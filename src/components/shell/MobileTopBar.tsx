"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePagePathname } from "@/lib/use-page-pathname";
import { ChevronLeft } from "lucide-react";
import { parentOf, segmentsFor, titleOf } from "@/lib/nav-items";

interface MobileTopBarProps {
  /** 右上角(未登入時的登入鈕) */
  trailing?: React.ReactNode;
}

/**
 * 手機頂部的標題列，對應 iOS 的 navigation bar：
 * 深層頁左上角有返回鍵，分區首頁則在標題下方放分段切換(取代電腦版側邊欄的第二層)。
 *
 * 返回鍵：站內有上一頁就 router.back()(保留上一頁的捲動位置，跟 iOS 一樣)，
 * 從外部連結直接進來時沒有上一頁，改走 parentOf 的固定去處。
 */
export function MobileTopBar({ trailing }: MobileTopBarProps) {
  const pathname = usePagePathname();
  const router = useRouter();
  const parent = parentOf(pathname);
  const segments = segmentsFor(pathname);

  const goBack = (e: React.MouseEvent) => {
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-card-border/70 bg-card/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <div className="flex h-12 items-center gap-1 px-2">
        {parent ? (
          <Link
            href={parent.href}
            onClick={goBack}
            className="flex min-w-0 items-center rounded-lg py-1.5 pr-2 text-accent active:opacity-60"
          >
            <ChevronLeft size={26} strokeWidth={2.2} className="shrink-0" />
            <span className="truncate text-[15px]">{parent.label}</span>
          </Link>
        ) : (
          <span className="w-2" />
        )}
        {/* 分區首頁：標題在這裡(頁面內的大標題在手機上隱藏)。
            深層頁只有返回鍵：頁面本身就有章節名、文章名等標題，這裡再寫一次只是重複 */}
        <p className="min-w-0 flex-1 truncate text-lg font-semibold text-strong">
          {parent ? "" : titleOf(pathname)}
        </p>
        {/* 「我的」頁的帳號卡片已經有登入鈕 */}
        <div className="flex min-w-[2.5rem] shrink-0 justify-end">{pathname !== "/me" && trailing}</div>
      </div>

      {segments && (
        <nav aria-label="分區切換" className="px-3 pb-2">
          <div className="segmented flex w-full">
            {segments.map((s) => {
              const active = s.href === pathname;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className="flex-1 text-center"
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
