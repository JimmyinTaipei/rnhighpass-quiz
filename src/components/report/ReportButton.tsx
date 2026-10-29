"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, X } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { ReportForm } from "./ReportForm";
import type { ReportCategory } from "@/lib/report-fields";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { overlayMotion } from "@/lib/motion";

interface ReportButtonProps {
  questionId?: string;
  tableId?: string;
  targetLabel: string;
  /** icon = 題目卡右上角的小圖示；text = 比較表頁的文字按鈕 */
  variant?: "icon" | "text";
  /** 按鈕與對話框標題，預設「回報錯誤」；知識頁用「建議改進」 */
  title?: string;
  defaultCategory?: ReportCategory;
  categories?: ReportCategory[];
  pagePath?: string;
}

/** 開啟錯誤回報 modal。登入狀態沿用 FavoritesProvider 已經抓好的結果。 */
export function ReportButton({
  questionId,
  tableId,
  targetLabel,
  variant = "icon",
  title = "回報錯誤",
  defaultCategory,
  categories,
  pagePath,
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const loggedIn = useFavorites()?.loggedIn ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={title}
        title={title}
        className={
          variant === "icon"
            ? "relative rounded-btn p-1 text-muted transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:text-incorrect"
            : "flex items-center gap-1 rounded-full bg-fill px-3 py-1.5 text-xs font-medium text-body transition-colors hover:bg-fill-strong"
        }
      >
        <Flag size={variant === "icon" ? 16 : 12} />
        {variant === "text" && title}
      </button>

      {/* 暗幕淡入、內容從 96% 縮放淡入；關閉時反過來 */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="report"
            {...overlayMotion("scrim", reduce)}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <motion.div {...overlayMotion("dialog", reduce)} className="w-full max-w-lg rounded-card bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-card-border p-4">
                <h2 className="text-lg font-bold text-subj-deep">{title}</h2>
                <button
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  aria-label="關閉"
                  className="rounded-btn p-1 text-muted hover:bg-page hover:text-subj-deep"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <ReportForm
                  questionId={questionId}
                  tableId={tableId}
                  targetLabel={targetLabel}
                  defaultCategory={defaultCategory}
                  categories={categories}
                  pagePath={pagePath}
                  loggedIn={loggedIn}
                  onDone={() => setOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
