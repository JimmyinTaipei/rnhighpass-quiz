"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { TableReader } from "./TableReader";

/**
 * 知識頁表格的外框。表格比外框寬時(手機常見)，右下角顯示「左右滑動」提示，使用者
 * 一滑就消失；不夠寬就不顯示。提示疊在表格上、不佔版面，量測完才出現也不會讓內容跳動。
 * 所有欄一起捲動；表格本身不觸發放大。桌機使用表頭的放大按鈕，手機直接收藏。
 */
export function ScrollableTable({
  "data-table-id": tableId,
  "data-table-title": title,
  standalone = false,
  ...props
}: React.ComponentProps<"table"> & {
  "data-table-id"?: string;
  "data-table-title"?: string;
  standalone?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    measure();
    const onScroll = () => {
      if (el.scrollLeft > 8) setScrolled(true);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const table = <table {...props} aria-label={title ?? props["aria-label"]} />;
  const canExpand = !!tableId && !!title && !standalone;

  return (
    <div className="kb-table-block relative my-4 min-w-0 max-w-full">
      {canExpand && (
        <div className="kb-table-toolbar" aria-label="表格操作">
          <button type="button" className="kb-table-expand" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }} aria-haspopup="dialog" aria-label={`放大閱讀：${title}`}>
            <Maximize2 size={14} aria-hidden /> 放大閱讀
          </button>
          <span className="kb-table-inline-favorite">
            <FavoriteButton questionId={tableId} kind="table" label="這張表格" className="kb-table-favorite" />
          </span>
        </div>
      )}
      <div
        ref={ref}
        className={`kb-table-wrap overflow-x-auto rounded-btn border border-card-border${canExpand ? " kb-table-with-actions" : ""}`}
        tabIndex={0}
        role="region"
        aria-label={`${title ?? "表格"}，可左右捲動`}
      >
        {table}
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
      {open && tableId && title && (
        <TableReader tableId={tableId} title={title} onClose={() => setOpen(false)}>
          <div className="kb-table-wrap overflow-x-auto rounded-btn border border-card-border" tabIndex={0} role="region" aria-label={`${title}，可左右捲動`}>
            {table}
          </div>
        </TableReader>
      )}
    </div>
  );
}
