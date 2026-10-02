"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * 卡片上的摘要:手機 3 行、桌面 4 行,超過才出現「展開」;展開後看完整內容,不離開頁面。
 */
export function ExpandableSummary({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflow(!open && el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, text]);

  return (
    <div className="mt-2">
      <p ref={ref} className={`whitespace-pre-line text-sm text-body ${open ? "" : "line-clamp-3 sm:line-clamp-4"}`}>
        {text}
      </p>
      {(overflow || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-1 text-xs font-medium text-accent hover:text-deep hover:underline"
        >
          {open ? "收合" : "展開"}
        </button>
      )}
    </div>
  );
}
