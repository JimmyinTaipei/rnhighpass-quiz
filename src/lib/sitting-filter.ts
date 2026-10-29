// 題目依考試梯次區間篩選(章節頁、疾病頁、測驗設定)。狀態放在網址 ?from=114-2&to=115-2，可分享。
//
// 梯次鍵：exam_sitting(「113-1」固定寬度)，補考另加 m(「106-2m」)。
// 補考和正式考試在資料庫是同一個 exam_sitting，只靠 is_makeup 區分；加 m 之後字串比較
// 剛好是 106-2 < 106-2m < 107-1，區間的頭尾都能單獨選到補考。

export interface SittingFilter {
  /** 梯次區間(含頭尾)；null = 不限 */
  from: string | null;
  to: string | null;
}

const KEY_RE = /^\d{3}-\dm?$/;

export function sittingKey(q: { exam_sitting: string; is_makeup: boolean }): string {
  return q.is_makeup ? `${q.exam_sitting}m` : q.exam_sitting;
}

/** 選單上的寫法：115-1、106-2 補 */
export function sittingLabel(key: string): string {
  return key.endsWith("m") ? `${key.slice(0, -1)} 補` : key;
}

export function parseSittingFilter(sp: Record<string, string | string[] | undefined>): SittingFilter {
  const key = (v: string | string[] | undefined) => (typeof v === "string" && KEY_RE.test(v) ? v : null);
  let from = key(sp.from);
  let to = key(sp.to);
  if (from && to && from > to) [from, to] = [to, from];
  return { from, to };
}

export const isFiltering = (f: SittingFilter) => f.from !== null || f.to !== null;

export function matchesSitting(q: { exam_sitting: string; is_makeup: boolean }, f: SittingFilter): boolean {
  const k = sittingKey(q);
  return (!f.from || k >= f.from) && (!f.to || k <= f.to);
}

/** 這批題目出現過的梯次(舊到新)，下拉選單只列有題目的梯次 */
export function sittingsOf(questions: { exam_sitting: string; is_makeup: boolean }[]): string[] {
  return [...new Set(questions.map(sittingKey))].sort();
}
