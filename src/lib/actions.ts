"use server";

import { refresh } from "next/cache";
import { createClient } from "./supabase-server";
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
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, reason: "not_logged_in" };

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!adminRow) return { ok: false, reason: "not_admin" };

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

  const { error } = await supabase
    .from("questions")
    .update({ ...clean, edited_fields, edited_at: new Date().toISOString() })
    .eq("id", questionId);
  if (error) return { ok: false, reason: error.message };

  // Next 16：用 refresh() 而不是 revalidatePath()。本專案每頁都讀 cookies()，
  // 都是 dynamic、Data Cache 裡沒東西，revalidateTag 會是 no-op；
  // 而 revalidatePath 目前還會順便刷掉所有造訪過的頁面，太重。
  // refresh() 只重抓當前路由的 RSC payload，而且跟回傳值同一次往返。
  refresh();
  return { ok: true };
}
