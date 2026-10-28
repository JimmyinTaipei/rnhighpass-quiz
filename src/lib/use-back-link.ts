"use client";

import { useRouter } from "next/navigation";
import { canGoBackInSite } from "@/lib/nav-history";
import { parentOf } from "@/lib/nav-items";
import { usePagePathname } from "@/lib/use-page-pathname";

/**
 * 返回鍵(手機頂欄、電腦版目錄上方的返回共用)：回到**上一頁**(點進來之前的那一頁)，不是上一層。
 * 站內有上一頁就用瀏覽器上一頁(保留上一頁的捲動位置，跟 iOS 一樣)；
 * 從外部連結直接進來、沒有站內上一頁時，才改走 parentOf 的上一層。分區首頁沒有返回鍵(parent 是 null)。
 *
 * 同一頁裡跳段落(目錄、#錨點、系統頁的類型篩選)也會留下瀏覽紀錄，
 * 所以要一路退到網址路徑不同的那一筆，不然按返回只會回到上一個段落。
 */
const MAX_SKIP = 50;

function backToPreviousPage(fallback: () => void) {
  const start = window.location.pathname;
  let steps = 0;
  const onPop = () => {
    if (window.location.pathname !== start) {
      window.removeEventListener("popstate", onPop);
      return;
    }
    steps += 1;
    if (steps > MAX_SKIP) {
      window.removeEventListener("popstate", onPop);
      fallback();
      return;
    }
    window.history.back();
  };
  window.addEventListener("popstate", onPop);
  window.history.back();
}

export function useBackLink() {
  const pathname = usePagePathname();
  const router = useRouter();
  const parent = parentOf(pathname);

  const onClick = (e: React.MouseEvent) => {
    if (canGoBackInSite()) {
      e.preventDefault();
      backToPreviousPage(() => parent && router.push(parent.href));
    }
  };

  return { pathname, parent, onClick };
}
