"use client";

import Link from "next/link";
import { usePagePathname } from "@/lib/use-page-pathname";
import { NAV_SECTIONS, sectionOf } from "@/lib/nav-items";

/**
 * 手機底部頁籤，對應 iOS 的 tab bar。五格就是側邊欄的五個分區，
 * 所以電腦版側邊欄看得到的每一頁，手機上都在某個頁籤底下。
 * 底部留 safe area(Home 指示條)；包成 app 後也是同一套。
 */
export function MobileTabBar() {
  const pathname = usePagePathname();
  const current = sectionOf(pathname);

  return (
    <nav
      aria-label="主選單"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-card-border/70 bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      <div className="flex h-14">
        {NAV_SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = current === s.key;
          return (
            <Link
              key={s.key}
              href={s.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 active:opacity-60 ${
                active ? "text-deep" : "text-muted"
              }`}
            >
              <Icon size={23} strokeWidth={active ? 2.3 : 1.8} />
              <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{s.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
