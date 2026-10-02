// 主站共用的按鈕樣式(Apple 風格：膠囊形、無外框，用填色區分層級)。
// 寫成字串常數而不是元件：呼叫端可能是 <Link>、<button> 或 <a>，直接接 className 最簡單。

const pillBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors";

/** 次要動作：灰底 */
export const pillGray = `${pillBase} bg-fill text-body hover:bg-fill-strong`;

/** 主要動作：品牌藍 */
export const pillTint = `${pillBase} bg-accent text-on-accent hover:bg-deep`;

/** 主要動作：科目色(在 [data-group] 底下) */
export const pillSubject = `${pillBase} bg-subj-accent text-on-accent hover:bg-subj-deep`;

/** 淡色強調：科目淺色底 */
export const pillSubjectSoft = `${pillBase} bg-subj-light text-subj-deep hover:bg-subj-mid`;

/** 大顆主要按鈕(首頁、空狀態) */
export const buttonLarge =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-on-accent transition-colors hover:bg-deep";
