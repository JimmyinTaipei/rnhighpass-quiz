"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Table2, X } from "lucide-react";
import type { ComparisonTable } from "@/lib/types";
import { ComparisonTableView } from "./ComparisonTableView";

interface TableModalLinkProps {
  tableId: string;
  title: string;
  /** 外觀：題目底下的細連結，或匯總區的卡片 */
  variant?: "inline" | "card";
}

/**
 * 點開比較表的 pop up。
 *
 * 內容是按需從 /api/tables/[tableId] 抓的（抓過就留在 state），
 * 避免把整章十幾張表的內容都塞進頁面 payload。
 */
export function TableModalLink({ tableId, title, variant = "inline" }: TableModalLinkProps) {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState<ComparisonTable | null>(null);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || table || error) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tables/${encodeURIComponent(tableId)}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as ComparisonTable;
        if (!cancelled) setTable(data);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, table, error, tableId]);

  // Esc 關閉 + 開啟時鎖住背景捲動
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
        onClick={() => setOpen(true)}
        className={
          variant === "card"
            ? "flex w-full items-start gap-2 rounded-card border border-card-border border-l-4 border-l-subj-accent bg-page p-3 text-left text-sm font-medium text-subj-deep transition-all hover:-translate-y-0.5 hover:shadow-sm"
            : "mt-2 flex items-center gap-1.5 rounded-btn border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-subj-deep transition-colors hover:border-subj-accent"
        }
      >
        <Table2 size={variant === "card" ? 16 : 14} className="shrink-0 text-subj-accent" />
        <span>{title}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
          // 點背景關閉；用 e.target === e.currentTarget 避免點到內容也被關掉
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="w-full max-w-5xl rounded-card bg-card shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-card-border p-4">
              <h2 className="text-lg font-bold text-subj-deep">{title}</h2>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="關閉"
                className="shrink-0 rounded-btn p-1 text-muted transition-colors hover:bg-page hover:text-subj-deep"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {error ? (
                <p className="text-sm text-incorrect">比較表載入失敗，請再試一次。</p>
              ) : !table ? (
                <p className="text-sm text-muted">載入中…</p>
              ) : (
                <ComparisonTableView table={table} />
              )}
            </div>

            <div className="border-t border-card-border p-4">
              <Link
                href={`/tables/${encodeURIComponent(tableId)}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-subj-deep hover:underline"
              >
                看完整頁面
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
