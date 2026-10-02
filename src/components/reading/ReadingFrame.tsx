"use client";

import { usePathname } from "next/navigation";

interface ReadingFrameProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 閱讀頁的兩欄外框。
 *
 * 之所以是 client component：chapters/layout.tsx 同時罩住閱讀頁與
 * /chapters/<id>/quiz，而測驗頁是全版的單欄介面，不要側邊欄、也不要外框的
 * 內距(它自己的 <main> 已經有了)。layout 讀不到 pathname，所以判斷放這裡。
 */
export function ReadingFrame({ sidebar, children }: ReadingFrameProps) {
  const pathname = usePathname();
  if (pathname.endsWith("/quiz")) return <>{children}</>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-8 lg:flex-row">
      {sidebar}
      {/* flex-1 一路從 html.h-full → body.min-h-full → (site) → 這裡傳下來，
          所以內容少的章節面板也會填滿視窗高度，不會是一小塊白的浮在灰底上。 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* md 以上是白色面板；手機上不包面板，省下兩層內距讓題目與選項有足夠寬度
            (iOS 的內容就是直接貼著 16px 頁邊) */}
        <div className="md-on-white flex-1 md:rounded-card md:bg-card md:p-6 md:shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </div>
    </div>
  );
}
