"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "./supabase-server";
import { DEV_MODE_COOKIE } from "./dev-mode";
import { validateTablePatch } from "./table-fields";
import {
  REPORT_CATEGORIES,
  REPORT_MESSAGE_MAX,
  REPORT_MESSAGE_MIN,
  REPORT_STATUS_LABELS,
  type ReportCategory,
  type ReportStatus,
} from "./report-fields";
import {
  EDITABLE_QUESTION_FIELDS,
  REQUIRED_QUESTION_FIELDS,
  type EditableQuestionField,
} from "./question-fields";

export async function submitAnswer(
  questionId: string,
  selectedOption: string,
  isCorrect: boolean,
  quizMode: string,
): Promise<{ ok: boolean; reason?: string }> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, reason: "not_logged_in" };
  }

  const { error } = await supabase.from("user_answers").insert({
    user_id: userData.user.id,
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    quiz_mode: quizMode,
  });

  if (error) {
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

/**
 * 所有 admin action 的共同門檻：重新向 Supabase 確認身分與 admin 身分。
 * 不接受任何來自前端的 user id 或旗標。
 */
async function requireAdmin(): Promise<
  { ok: true; supabase: SupabaseServer; userId: string } | { ok: false; reason: string }
> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, reason: "not_logged_in" };

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!adminRow) return { ok: false, reason: "not_admin" };
  return { ok: true, supabase, userId: userData.user.id };
}

/**
 * 寫一筆 admin 編輯紀錄(migration 0010)。紀錄失敗就中止編輯：
 * 寧可改不了，也不要留下無法追溯的修改。
 */
async function logAdminEdit(
  supabase: SupabaseServer,
  userId: string,
  targetType: "question" | "table",
  targetId: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Promise<string | null> {
  const { error } = await supabase.from("admin_edit_log").insert({
    user_id: userId,
    target_type: targetType,
    target_id: targetId,
    before,
    after,
  });
  return error ? error.message : null;
}

/**
 * dev mode 開關。只有 admin 能打開；關閉則任何人都可以(只是刪 cookie)。
 * cookie 只代表「想看 dev 工具」，不是憑證——getDevMode() 每次都會再驗 admin。
 */
export async function setDevMode(on: boolean): Promise<{ ok: boolean; reason?: string }> {
  const store = await cookies();
  if (!on) {
    store.delete(DEV_MODE_COOKIE);
    return { ok: true };
  }
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, reason: auth.reason };
  store.set(DEV_MODE_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 小時後自動關掉，避免忘記
  });
  return { ok: true };
}

/**
 * dev mode：更新一題的內容。
 *
 * 三層防護，缺一不可：
 *  1. 這裡自己驗 admin —— Server Action 是公開的 POST 端點，Next 16 文件明講
 *     「只在已登入頁面渲染表單」不是安全邊界，所以不能只靠沒渲染按鈕。
 *  2. Postgres RLS 的 "admin can update questions" policy(migration 0005)。
 *  3. GRANT 只開放內容欄位的 update，結構性欄位連授權都沒有。
 *
 * 另外會把「真的有變動」的欄位記進 edited_fields，讓 sync_all.py 之後不要用
 * markdown 把它蓋回去(見 database/scripts/lib/db.py 的 protect_columns)。
 */
export async function updateQuestion(
  questionId: string,
  patch: Partial<Record<EditableQuestionField, string>>,
): Promise<{ ok: boolean; reason?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, reason: auth.reason };
  const { supabase, userId } = auth;
  if (typeof questionId !== "string" || !patch || typeof patch !== "object") {
    return { ok: false, reason: "格式錯誤" };
  }

  // 只信任白名單欄位，其餘一律丟掉
  const clean: Record<string, string | null> = {};
  for (const field of EDITABLE_QUESTION_FIELDS) {
    const value = patch[field];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed === "" && REQUIRED_QUESTION_FIELDS.includes(field)) {
      return { ok: false, reason: `${field} 不能空白` };
    }
    // 四個詳解欄位是 nullable：空字串要存成 null，否則 QuestionCard 判斷
    // 「四欄都空就 fallback 到 explanation_text」的邏輯會失準
    clean[field] = trimmed === "" ? null : trimmed;
  }
  if (Object.keys(clean).length === 0) return { ok: false, reason: "沒有要更新的欄位" };

  // 跟現值比對，只把「真的改了」的欄位記進 edited_fields
  const { data: current, error: readError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .maybeSingle();
  if (readError) return { ok: false, reason: readError.message };
  if (!current) return { ok: false, reason: "找不到這一題" };

  const changed: string[] = [];
  for (const [field, value] of Object.entries(clean)) {
    if ((current as Record<string, unknown>)[field] !== value) changed.push(field);
  }
  if (changed.length === 0) return { ok: true };

  const previous: string[] = Array.isArray(current.edited_fields) ? current.edited_fields : [];
  const edited_fields = [...new Set([...previous, ...changed])];

  const before = Object.fromEntries(
    changed.map((f) => [f, (current as Record<string, unknown>)[f]]),
  );
  const after = Object.fromEntries(changed.map((f) => [f, clean[f]]));
  const logError = await logAdminEdit(supabase, userId, "question", questionId, before, after);
  if (logError) return { ok: false, reason: `編輯紀錄寫入失敗：${logError}` };

  const { data: updated, error } = await supabase
    .from("questions")
    .update({ ...clean, edited_fields, edited_at: new Date().toISOString() })
    .eq("id", questionId)
    .select("id");
  if (error) return { ok: false, reason: error.message };
  // RLS 擋下的 update 不會回錯誤，只會是 0 列——要自己檢查
  if (!updated || updated.length === 0) return { ok: false, reason: "沒有寫入權限" };

  // Next 16：用 refresh() 而不是 revalidatePath()。本專案每頁都讀 cookies()，
  // 都是 dynamic、Data Cache 裡沒東西，revalidateTag 會是 no-op；
  // 而 revalidatePath 目前還會順便刷掉所有造訪過的頁面，太重。
  // refresh() 只重抓當前路由的 RSC payload，而且跟回傳值同一次往返。
  refresh();
  return { ok: true };
}

/**
 * dev mode：更新一張比較表(標題、說明、表頭、內容)。
 * 防護與 updateQuestion 相同：action 驗 admin → 資料形狀驗證 → RLS / 欄位 GRANT
 * (migration 0010)。改過的欄位記進 tables_.edited_fields，sync 時不會被蓋掉。
 */
export async function updateTable(
  tableId: string,
  input: unknown,
): Promise<{ ok: boolean; reason?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, reason: auth.reason };
  const { supabase, userId } = auth;
  if (typeof tableId !== "string" || !tableId) return { ok: false, reason: "格式錯誤" };

  const parsed = validateTablePatch(input);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  const next = parsed.value;

  const { data: current, error: readError } = await supabase
    .from("tables_")
    .select("title, reason, headers, rows, edited_fields")
    .eq("id", tableId)
    .maybeSingle();
  if (readError) return { ok: false, reason: readError.message };
  if (!current) return { ok: false, reason: "找不到這張表" };

  const fields = ["title", "reason", "headers", "rows"] as const;
  const changed = fields.filter(
    (f) => JSON.stringify(current[f] ?? null) !== JSON.stringify(next[f] ?? null),
  );
  if (changed.length === 0) return { ok: true };

  const before = Object.fromEntries(changed.map((f) => [f, current[f]]));
  const after = Object.fromEntries(changed.map((f) => [f, next[f]]));
  const logError = await logAdminEdit(supabase, userId, "table", tableId, before, after);
  if (logError) return { ok: false, reason: `編輯紀錄寫入失敗：${logError}` };

  const previous: string[] = Array.isArray(current.edited_fields) ? current.edited_fields : [];
  const { data: updated, error } = await supabase
    .from("tables_")
    .update({
      ...after,
      edited_fields: [...new Set([...previous, ...changed])],
      edited_at: new Date().toISOString(),
    })
    .eq("id", tableId)
    .select("id");
  if (error) return { ok: false, reason: error.message };
  if (!updated || updated.length === 0) return { ok: false, reason: "沒有寫入權限" };

  refresh();
  return { ok: true };
}

// ===== 收藏(migration 0009) =====

/** 題目 id 的形狀(如 '114-3_FA_032')。擋掉奇怪的輸入，實際存在與否交給 FK。 */
const QUESTION_ID_RE = /^[\w-]{1,64}$/;

/**
 * 設定某題的收藏狀態。刻意用「設成 on/off」而不是 toggle：
 * 連點或重送時結果一樣，不會因為時序而翻轉兩次。
 */
export async function setFavorite(
  questionId: string,
  on: boolean,
): Promise<{ ok: boolean; reason?: string }> {
  if (typeof questionId !== "string" || !QUESTION_ID_RE.test(questionId)) {
    return { ok: false, reason: "格式錯誤" };
  }
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, reason: "not_logged_in" };
  const userId = userData.user.id;

  const { error } = on
    ? await supabase
        .from("user_favorites")
        .upsert(
          { user_id: userId, question_id: questionId },
          { onConflict: "user_id,question_id", ignoreDuplicates: true },
        )
    : await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("question_id", questionId);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/** 目前使用者收藏的題目 id(給 FavoritesProvider 在 client 掛載後抓一次) */
export async function listFavoriteIds(): Promise<{ loggedIn: boolean; ids: string[] }> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { loggedIn: false, ids: [] };
  const { data, error } = await supabase
    .from("user_favorites")
    .select("question_id")
    .eq("user_id", userData.user.id)
    .limit(5000);
  if (error) return { loggedIn: true, ids: [] };
  return { loggedIn: true, ids: (data ?? []).map((r) => r.question_id) };
}

// ===== 錯誤回報(migration 0011) =====

export async function submitReport(input: {
  category: string;
  message: string;
  questionId?: string | null;
  tableId?: string | null;
  pagePath?: string | null;
}): Promise<{ ok: boolean; reason?: string }> {
  if (!input || typeof input !== "object") return { ok: false, reason: "格式錯誤" };
  const { category, questionId, tableId, pagePath } = input;
  if (typeof category !== "string" || !(category in REPORT_CATEGORIES)) {
    return { ok: false, reason: "請選擇回報類型" };
  }
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length < REPORT_MESSAGE_MIN) {
    return { ok: false, reason: `請至少寫 ${REPORT_MESSAGE_MIN} 個字` };
  }
  if (message.length > REPORT_MESSAGE_MAX) return { ok: false, reason: "內容太長" };
  if (questionId != null && (typeof questionId !== "string" || !QUESTION_ID_RE.test(questionId))) {
    return { ok: false, reason: "格式錯誤" };
  }
  if (tableId != null && (typeof tableId !== "string" || !/^[\w-]{1,120}$/.test(tableId))) {
    return { ok: false, reason: "格式錯誤" };
  }
  // 只收站內路徑，而且截短；這欄只是方便站長定位，不拿來導向
  const path =
    typeof pagePath === "string" && pagePath.startsWith("/") ? pagePath.slice(0, 300) : null;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, reason: "not_logged_in" };

  const { error } = await supabase.from("error_reports").insert({
    user_id: userData.user.id,
    category: category as ReportCategory,
    message,
    question_id: questionId ?? null,
    table_id: tableId ?? null,
    page_path: path,
  });
  if (error) {
    if (error.message.includes("report_rate_limited")) {
      return { ok: false, reason: "今天回報次數已達上限，明天再試，或改用 Google 表單" };
    }
    return { ok: false, reason: "送出失敗，請稍後再試" };
  }
  return { ok: true };
}

/** admin：更新回報的處理狀態與備註 */
export async function updateReportStatus(
  reportId: number,
  status: string,
  adminNote: string,
): Promise<{ ok: boolean; reason?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, reason: auth.reason };
  if (!Number.isInteger(reportId) || !(status in REPORT_STATUS_LABELS)) {
    return { ok: false, reason: "格式錯誤" };
  }
  const note = typeof adminNote === "string" ? adminNote.trim().slice(0, 2000) : "";
  const { data, error } = await auth.supabase
    .from("error_reports")
    .update({
      status: status as ReportStatus,
      admin_note: note || null,
      resolved_at: status === "new" ? null : new Date().toISOString(),
    })
    .eq("id", reportId)
    .select("id");
  if (error) return { ok: false, reason: error.message };
  if (!data || data.length === 0) return { ok: false, reason: "沒有寫入權限" };
  refresh();
  return { ok: true };
}

// ===== 隱私：刪除自己的紀錄 =====

/**
 * 刪除目前使用者的作答紀錄與收藏。RLS 本來就只允許刪自己的列，
 * 這裡另外加 user_id 條件，讓意圖明確、也不依賴 policy 的寫法。
 * 錯誤回報不在這裡刪：那是給站長的訊息，使用者沒有刪除權限(migration 0011)。
 */
export async function deleteMyData(confirmText: string): Promise<{ ok: boolean; reason?: string }> {
  if (confirmText !== "刪除") return { ok: false, reason: "請輸入「刪除」確認" };
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, reason: "not_logged_in" };
  const userId = userData.user.id;

  const [answers, favorites] = await Promise.all([
    supabase.from("user_answers").delete().eq("user_id", userId),
    supabase.from("user_favorites").delete().eq("user_id", userId),
  ]);
  const error = answers.error ?? favorites.error;
  if (error) return { ok: false, reason: error.message };
  refresh();
  return { ok: true };
}
