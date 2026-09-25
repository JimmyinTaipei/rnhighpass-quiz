"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KnowledgePreview } from "@/lib/knowledge/types";

/**
 * 嵌入區塊右上角的引用次數(仿 RemNote)。點開列出全站所有嵌入這一段的位置。
 */
export function EmbedBadge({ places }: { places: KnowledgePreview[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={`這段內容被 ${places.length} 處引用`}
        className="min-w-6 rounded bg-sidebar px-1.5 py-0.5 text-xs font-semibold tabular-nums text-muted hover:bg-mid hover:text-deep"
      >
        {places.length}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-64 rounded-card border border-card-border bg-card p-2 shadow-lg">
          <p className="px-2 py-1 text-xs text-muted">引用這段內容的地方</p>
          <ul>
            {places.map((p) => (
              <li key={p.key}>
                <Link
                  href={p.href}
                  className="block rounded px-2 py-1.5 text-sm text-body hover:bg-surface-hover"
                >
                  <span className="font-medium text-deep">{p.articleTitle}</span>
                  {p.number !== null && (
                    <span className="text-muted">
                      {" › "}
                      {p.number}
                      {p.title}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
