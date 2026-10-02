"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const isPanelPath = (p: string) => p.startsWith("/k/");

/**
 * 「底下那一頁」的網址。知識面板開著時網址是 /k/<slug>(面板有自己的網址，返回鍵才能關它)，
 * 但面板只是疊在目前頁面上的一層：側邊欄、頁籤、標題列都應該維持原本那一頁，
 * 不能跳成「知識庫」。直接開 /k 會轉到知識頁，不會停在這裡，所以沒有「第一頁就是 /k」的情況。
 */
export function usePagePathname(): string {
  const pathname = usePathname();
  const [page, setPage] = useState(pathname);
  if (!isPanelPath(pathname) && page !== pathname) setPage(pathname);
  return isPanelPath(pathname) ? page : pathname;
}
