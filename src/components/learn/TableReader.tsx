"use client";

import { createContext, useContext, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

const TableReaderContext = createContext<(() => void) | null>(null);
export function useTableReaderClose() {
  return useContext(TableReaderContext);
}

/** Native modal dialog supplies focus trapping and makes the underlying panel inert. */
export function TableReader({ tableId, title, onClose, children }: {
  tableId: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const active = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (active instanceof HTMLElement && active.isConnected) active.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <TableReaderContext.Provider value={onClose}>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="kb-table-reader"
        data-ui="apple"
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onKeyDown={(event) => {
          // The knowledge panel also listens for Esc on window. Only close this reader.
          if (event.key === "Escape") event.stopPropagation();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
        }}
      >
        <div className="kb-table-reader-layout on-white">
          <header className="kb-table-reader-header">
            <h2 id={titleId} className="min-w-0 flex-1 text-base font-semibold text-deep">{title}</h2>
            <FavoriteButton questionId={tableId} kind="table" label="這張表格" className="kb-table-favorite" />
            <button type="button" autoFocus onClick={onClose} aria-label="關閉表格" className="kb-table-icon-button">
              <X size={20} aria-hidden />
            </button>
          </header>
          <div className="kb-table-reader-content kb-prose">{children}</div>
          <footer className="shrink-0 border-t border-card-border px-4 py-3 text-sm">
            <Link href={`/tables/knowledge/${tableId}`} className="text-accent hover:underline" onClick={onClose}>開啟獨立頁面</Link>
          </footer>
        </div>
      </dialog>
    </TableReaderContext.Provider>,
    document.body,
  );
}
