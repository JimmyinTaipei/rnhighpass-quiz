// 顯示模式的型別與解析。刻意獨立成一個「非 client」模組：
// ViewControls 是 "use client"，而章節頁(server component)要呼叫 parseViewMode，
// 從 client 模組匯出純函式會在執行期炸掉
// ("Attempted to call parseViewMode() from the server but it is on the client")。

// 註：曾經有第三種 "table"(把題目列成表格)，但那是誤解——使用者要的「表格」是
// tables_ 那批比較表，已改由 ComparisonTable 相關元件呈現，所以這裡移除。
// parseViewMode 有白名單校驗，舊的 ?view=table 連結會自動退回 "quiz"。
export const VIEW_MODES = ["quiz", "card"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export function parseViewMode(raw: string | undefined): ViewMode {
  return VIEW_MODES.includes(raw as ViewMode) ? (raw as ViewMode) : "quiz";
}
