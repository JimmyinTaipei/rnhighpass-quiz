"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, X } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { ReportForm } from "./ReportForm";

interface ReportButtonProps {
  questionId?: string;
  tableId?: string;
  targetLabel: string;
  /** icon = 題目卡右上角的小圖示；text = 比較表頁的文字按鈕 */
  variant?: "icon" | "text";
}

/** 開啟錯誤回報 modal。登入狀態沿用 FavoritesProvider 已經抓好的結果。 */
export function ReportButton({ questionId, tableId, targetLabel, variant = "icon" }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
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
        aria-label="回報錯誤"
        title="回報錯誤"
        className={
          variant === "icon"
            ? "rounded-btn p-1 text-muted transition-colors hover:text-incorrect"
            : "flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-incorrect hover:text-incorrect"
        }
      >
        <Flag size={variant === "icon" ? 16 : 12} />
        {variant === "text" && "回報錯誤"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="回報錯誤"
        >
          <div className="w-full max-w-lg rounded-card bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-card-border p-4">
              <h2 className="text-lg font-bold text-subj-deep">回報錯誤</h2>
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
                loggedIn={loggedIn}
                onDone={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
