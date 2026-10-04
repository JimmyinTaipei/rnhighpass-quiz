"use client";

/**
 * 站內瀏覽紀錄(存在 sessionStorage,分頁關掉就清掉),給返回鍵判斷「有沒有站內的上一頁」。
 *
 * 不能用 document.referrer:Next 站內換頁不會更新它,永遠是第一次進站時的來源,
 * 於是站內點了好幾頁之後,返回鍵仍以為沒有上一頁、改去上一層。
 * 換頁時:新網址等於倒數第二筆 → 視為上一頁(彈出最後一筆);否則推入。
 */
const KEY = "nav:stack";
const MAX = 50;

function load(): string[] {
  try {
    const v = JSON.parse(window.sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function recordVisit(path: string): void {
  const stack = load();
  if (stack.at(-2) === path) stack.pop();
  else if (stack.at(-1) !== path) stack.push(path);
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(stack.slice(-MAX)));
  } catch {
    // 存不了就當作沒有上一頁,返回鍵改走上一層
  }
}

/** 目前這頁之前還有站內頁面(可以 router.back() 而不會離開網站) */
export function canGoBackInSite(): boolean {
  return load().length > 1 && window.history.length > 1;
}
