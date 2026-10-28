// 主站共用的按鈕樣式(Apple 風格：膠囊形、無外框，用填色區分層級)。
// 寫成字串常數而不是元件：呼叫端可能是 <Link>、<button> 或 <a>，直接接 className 最簡單。

// 字重不放在 pillBase：同一個元素上 font-medium 和 font-semibold 誰贏取決於 CSS 產生順序，不可靠。
const pillBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] whitespace-nowrap transition-colors";

/** 次要動作：灰底 */
export const pillGray = `${pillBase} bg-fill font-medium text-body hover:bg-fill-strong`;

/**
 * 主要動作：品牌藍。粉彩 mid 底＋深色字(不用白字，白字在粉彩底上對比不足)，
 * 加粗和淡色的 pillSubjectSoft 區分主次；hover 深一階，字色不變。
 */
export const pillTint = `${pillBase} bg-mid font-semibold text-on-mid hover:bg-accent`;

/** 主要動作：科目色(在 [data-group] 底下)，規則同 pillTint */
export const pillSubject = `${pillBase} bg-subj-mid font-semibold text-subj-ink hover:bg-subj-accent`;

/** 淡色強調：科目淺色底 */
export const pillSubjectSoft = `${pillBase} bg-subj-light font-medium text-subj-deep hover:bg-subj-mid`;

/** 大顆主要按鈕(首頁、空狀態) */
export const buttonLarge =
  "inline-flex items-center justify-center gap-2 rounded-full bg-mid px-6 py-3 text-[15px] font-semibold text-on-mid transition-colors hover:bg-accent";
