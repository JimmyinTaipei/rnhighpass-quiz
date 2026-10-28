"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { overlayMotion } from "@/lib/motion";

interface ConfirmDialogProps {
  /**
   * 做題頁傳 open：先掛載再打開，開關都有縮放淡入淡出。
   * 模擬考仍用 {cond && <ConfirmDialog />}(預設 true)，掛載時直接出現(AnimatePresence initial={false})，
   * 卸載時直接消失——仿考選部介面本來就沒有動態。
   */
  open?: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open = true,
  title,
  message,
  confirmLabel = "確定",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="confirm"
          {...overlayMotion("scrim", reduce)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mock-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <motion.div
            {...overlayMotion("dialog", reduce)}
            className="w-full max-w-md rounded-card border border-card-border bg-card p-6 text-center shadow-xl"
          >
            <h2 id="mock-confirm-title" className="mb-3 text-lg font-bold text-deep">
              {title}
            </h2>
            <div className="mb-6 text-sm leading-relaxed text-body">{message}</div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className="min-w-24 rounded-btn bg-deep px-5 py-2 text-sm font-medium text-on-accent hover:opacity-90"
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="min-w-24 rounded-btn border border-card-border bg-card px-5 py-2 text-sm font-medium text-body hover:bg-page"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
