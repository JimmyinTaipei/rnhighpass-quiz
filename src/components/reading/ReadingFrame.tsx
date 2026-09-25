"use client";

import { usePathname } from "next/navigation";
import { Panel } from "@/components/ui/Panel";

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
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
      {sidebar}
      {/* flex-1 一路從 html.h-full → body.min-h-full → (site) → 這裡傳下來，
          所以內容少的章節面板也會填滿視窗高度，不會是一小塊白的浮在灰底上。 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Panel className="flex-1">{children}</Panel>
      </div>
    </div>
  );
}
