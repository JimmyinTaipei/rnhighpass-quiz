"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/lib/nav-history";

/** 記錄站內換頁(見 lib/nav-history.ts),返回鍵靠它判斷能不能回上一頁。不渲染任何東西 */
export function NavHistoryTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);
  return null;
}
