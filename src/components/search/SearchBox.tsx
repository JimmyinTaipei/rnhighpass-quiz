"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { SOURCE_EXAMPLE } from "@/lib/question-ref";

export type SearchScope = "all" | "knowledge" | "questions";

/** 全站唯一的搜尋框(搜尋頁、知識庫、章節頁共用)，送出後一律到 /search，保留目前的範圍 */
export function SearchBox({
  initialQuery = "",
  scope = "all",
  autoFocus = false,
  className = "",
}: {
  initialQuery?: string;
  scope?: SearchScope;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        const params = new URLSearchParams({ q });
        if (scope !== "all") params.set("scope", scope);
        router.push(`/search?${params}`);
      }}
      className={`flex gap-2 ${className}`}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus={autoFocus}
          aria-label="搜尋"
          placeholder={
            scope === "knowledge"
              ? "搜尋知識庫：疾病、藥物、檢驗…"
              : `搜尋知識庫、考古題，或輸入題號（例：${SOURCE_EXAMPLE}）`
          }
          className="w-full rounded-btn bg-fill py-2 pr-3 pl-9 text-base text-strong placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-subj-accent/40"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-btn bg-subj-mid px-4 py-2 text-sm font-semibold text-subj-ink transition-colors hover:bg-subj-accent"
      >
        搜尋
      </button>
    </form>
  );
}
