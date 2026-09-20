"use client";

interface ConfirmDialogProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "確定",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mock-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="w-full max-w-md rounded-card border border-card-border bg-card p-6 text-center shadow-xl">
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
      </div>
    </div>
  );
}
