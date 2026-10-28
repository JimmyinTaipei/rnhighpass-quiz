"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 知識頁表格的外框。表格比外框寬時(手機常見)，右下角顯示「左右滑動」提示，使用者
 * 一滑就消失；不夠寬就不顯示。提示疊在表格上、不佔版面，量測完才出現也不會讓內容跳動。
 * 第一欄固定在左邊見 globals.css 的 .kb-table-wrap。
 */
export function ScrollableTable(props: React.ComponentProps<"table">) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onScroll = () => {
      if (el.scrollLeft > 8) setScrolled(true);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative my-4">
      <div ref={ref} className="kb-table-wrap overflow-x-auto rounded-btn border border-card-border">
        <table {...props} />
      </div>
      {overflowing && (
        <span
          aria-hidden
          className={`pointer-events-none absolute right-2 bottom-2 rounded-full bg-strong/75 px-2 py-0.5 text-[0.6875rem] font-medium text-white transition-opacity duration-200 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          左右滑動 →
        </span>
      )}
    </div>
  );
}
