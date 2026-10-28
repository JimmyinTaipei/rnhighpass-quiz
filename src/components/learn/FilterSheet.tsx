"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { overlayMotion } from "@/lib/motion";

export interface FilterOption {
  key: string;
  label: string;
  href: string;
  active: boolean;
}

/**
 * 手機版的篩選選單：一顆「分類：疾病 ▾」按鈕，點了從底部彈出選項清單(仿 iOS 的 action sheet)。
 * 電腦版仍用一排膠囊，所以這顆按鈕只在 md 以下出現。
 */
export function FilterSheet({ label, options }: { label: string; options: FilterOption[] }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.active) ?? options[0];
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full border border-card-border bg-card px-3 py-1 text-body hover:bg-surface-hover md:hidden"
      >
        {label}：<span className="font-medium text-deep">{current?.label}</span>
        <ChevronDown size={15} className="text-muted" />
      </button>

      {/* 從底部滑上來、關閉時滑回去 */}
      <AnimatePresence>
        {open && (
          <div key="filter" className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={label}>
            <motion.button
              {...overlayMotion("scrim", reduce)}
              type="button"
              aria-label="關閉"
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              {...overlayMotion("sheet", reduce)}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-card px-2 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-xl"
            >
              <div aria-hidden className="mx-auto mb-2 h-1 w-9 rounded-full bg-fill-strong" />
              <p className="px-3 pb-1 text-xs font-medium text-muted">{label}</p>
              <ul>
                {options.map((o) => (
                  <li key={o.key}>
                    <Link
                      href={o.href}
                      scroll={false}
                      onClick={() => setOpen(false)}
                      aria-current={o.active ? "true" : undefined}
                      className={`flex items-center justify-between rounded-btn px-3 py-3 text-[16px] hover:bg-surface-hover ${
                        o.active ? "font-semibold text-deep" : "text-strong"
                      }`}
                    >
                      {o.label}
                      {o.active && <Check size={18} className="text-accent" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
