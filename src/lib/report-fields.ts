// 錯誤回報的共用常數。獨立於 "use server" 的 actions.ts(那裡只能匯出 async function)。

export const REPORT_CATEGORIES = {
  question: "題目有錯",
  answer: "答案有爭議",
  explanation: "詳解不清楚",
  site: "網站問題",
  suggestion: "建議",
} as const;

export type ReportCategory = keyof typeof REPORT_CATEGORIES;

export const REPORT_STATUS_LABELS = {
  new: "待處理",
  resolved: "已處理",
  wontfix: "不處理",
} as const;

export type ReportStatus = keyof typeof REPORT_STATUS_LABELS;

export const REPORT_MESSAGE_MIN = 5;
export const REPORT_MESSAGE_MAX = 2000;

/** 沒登入時的備援：原本多保命網頁用的 Google 表單 */
export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdthtlA0QfYFPvtfp0Z0ndT23StYGZGmk9ry5WVjZ2Ey2cyxw/viewform";

export interface ErrorReport {
  id: number;
  question_id: string | null;
  table_id: string | null;
  category: ReportCategory;
  message: string;
  page_path: string | null;
  status: ReportStatus;
  admin_note: string | null;
  resolved_at: string | null;
  created_at: string;
}
