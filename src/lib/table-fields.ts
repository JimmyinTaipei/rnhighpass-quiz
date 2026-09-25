// dev mode 比較表編輯的資料驗證。和 question-fields.ts 一樣刻意獨立於
// "use server" 的 actions.ts(那裡只能匯出 async function)，
// 表單端(即時提示)與 updateTable action(真正把關)共用同一份規則。

export const TABLE_LIMITS = {
  titleMax: 200,
  reasonMax: 2000,
  cellMax: 1000,
  maxColumns: 12,
  maxRows: 80,
  /** 整張表序列化後的上限，防止塞入超大 payload */
  totalBytesMax: 200_000,
} as const;

export interface TablePatch {
  title: string;
  reason: string | null;
  headers: string[];
  rows: string[][];
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

/**
 * 驗證並正規化比較表內容。回傳 { ok: true, value } 或 { ok: false, reason }。
 * 收的是 unknown：server action 的參數來自網路，型別宣告不代表實際內容。
 */
export function validateTablePatch(
  input: unknown,
): { ok: true; value: TablePatch } | { ok: false; reason: string } {
  if (!input || typeof input !== "object") return { ok: false, reason: "格式錯誤" };
  const raw = input as Record<string, unknown>;

  if (typeof raw.title !== "string") return { ok: false, reason: "標題格式錯誤" };
  const title = raw.title.trim();
  if (!title) return { ok: false, reason: "標題不能空白" };
  if (title.length > TABLE_LIMITS.titleMax) return { ok: false, reason: "標題太長" };

  if (raw.reason != null && typeof raw.reason !== "string") {
    return { ok: false, reason: "說明格式錯誤" };
  }
  const reasonText = typeof raw.reason === "string" ? raw.reason.trim() : "";
  if (reasonText.length > TABLE_LIMITS.reasonMax) return { ok: false, reason: "說明太長" };

  if (!isStringArray(raw.headers)) return { ok: false, reason: "表頭格式錯誤" };
  const headers = raw.headers.map((h) => h.trim());
  if (headers.length === 0 || headers.length > TABLE_LIMITS.maxColumns) {
    return { ok: false, reason: `欄數需為 1–${TABLE_LIMITS.maxColumns}` };
  }

  if (!Array.isArray(raw.rows) || !raw.rows.every(isStringArray)) {
    return { ok: false, reason: "表格內容格式錯誤" };
  }
  if (raw.rows.length > TABLE_LIMITS.maxRows) {
    return { ok: false, reason: `列數不能超過 ${TABLE_LIMITS.maxRows}` };
  }
  const rows = (raw.rows as string[][]).map((r) => r.map((c) => c.trim()));
  // 矩形矩陣：ComparisonTableView 以 headers 的欄數為準排版
  if (rows.some((r) => r.length !== headers.length)) {
    return { ok: false, reason: "每一列的欄數必須和表頭相同" };
  }
  if ([...headers, ...rows.flat()].some((c) => c.length > TABLE_LIMITS.cellMax)) {
    return { ok: false, reason: `單格不能超過 ${TABLE_LIMITS.cellMax} 字` };
  }

  const value: TablePatch = { title, reason: reasonText || null, headers, rows };
  if (JSON.stringify(value).length > TABLE_LIMITS.totalBytesMax) {
    return { ok: false, reason: "表格內容太大" };
  }
  return { ok: true, value };
}
