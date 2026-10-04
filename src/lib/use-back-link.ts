"use client";

import { useRouter } from "next/navigation";
import { canGoBackInSite } from "@/lib/nav-history";
import { parentOf } from "@/lib/nav-items";
import { usePagePathname } from "@/lib/use-page-pathname";

/**
 * 返回鍵(手機頂欄、電腦版左上角返回共用)：回到**上一頁**(點進來之前的那一頁)，不是上一層。
 * 站內有上一頁就 router.back()(保留上一頁的捲動位置，跟 iOS 一樣)；
 * 從外部連結直接進來、沒有站內上一頁時，才改走 parentOf 的上一層。分區首頁沒有返回鍵(parent 是 null)。
 */
export function useBackLink() {
  const pathname = usePagePathname();
  const router = useRouter();
  const parent = parentOf(pathname);

  const onClick = (e: React.MouseEvent) => {
    if (canGoBackInSite()) {
      e.preventDefault();
      router.back();
    }
  };

  return { pathname, parent, onClick };
}
