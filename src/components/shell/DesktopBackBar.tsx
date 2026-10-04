"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { hasDesktopBack } from "@/lib/nav-items";
import { useBackLink } from "@/lib/use-back-link";

/**
 * 電腦版(md 以上)內容區頂端的返回列，仿 UpToDate 左上角的「< Back」。
 * 回到上一頁(點進來之前那一頁)；只在章節頁與知識頁出現(hasDesktopBack)。手機用 MobileTopBar 的返回鍵。
 * 出現時 globals.css 會把 --desk-bar 設成這一列的高度，讓頂端 sticky 的側欄、目錄與錨點跳轉往下讓開。
 */
export function DesktopBackBar() {
  const { pathname, parent, onClick } = useBackLink();
  if (!parent || !hasDesktopBack(pathname)) return null;

  return (
    <div className="desk-back-bar sticky top-0 z-30 hidden h-(--desk-bar-h) items-center border-b border-card-border/70 bg-card/85 px-3 backdrop-blur-xl backdrop-saturate-150 md:flex">
      <Link
        href={parent.href}
        onClick={onClick}
        title="回到上一頁"
        className="flex items-center gap-0.5 rounded-lg py-1 pr-2.5 pl-1 text-[15px] text-accent hover:bg-surface-hover active:opacity-60"
      >
        <ChevronLeft size={20} strokeWidth={2.2} className="shrink-0" />
        返回
      </Link>
    </div>
  );
}
