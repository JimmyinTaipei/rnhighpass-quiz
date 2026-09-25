"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { chapterHref, lastPosition, useReadingStore } from "@/lib/reading-position";

/**
 * 科目頁最上方的「繼續上次」。
 *
 * 位置存在 localStorage，SSR 讀不到，所以伺服器與首次 client render 都是
 * null(useReadingStore 的 server snapshot 是空 store)，不會 hydration
 * mismatch。沒有紀錄時整列不出現。
 */
export function ContinueReading() {
  const pos = lastPosition(useReadingStore());
  if (!pos) return null;

  return (
    <a
      href={chapterHref(pos)}
      className="mb-4 flex items-center gap-3 rounded-card bg-sidebar px-4 py-2 transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
    >
      <BookOpen size={18} className="shrink-0 text-muted" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted">繼續上次</span>
        <span className="block truncate text-sm font-medium text-body">{pos.label}</span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-muted" />
    </a>
  );
}
