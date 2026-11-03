"use client";

import Form from "next/form";
import { Search } from "lucide-react";
import { useId } from "react";
import { SOURCE_EXAMPLE } from "@/lib/question-ref";
import { searchParameters, type SearchScope, type KnowledgeResultKind } from "@/lib/search";
import { useSearchPending } from "./SearchExperience";

export type { SearchScope } from "@/lib/search";

/** 全站唯一的搜尋框(搜尋頁、知識庫、章節頁共用)，送出後一律到 /search，保留目前的範圍 */
export function SearchBox({
  initialQuery = "",
  scope = "all",
  autoFocus = false,
  className = "",
  subject,
  chapter,
  type,
  label,
  from,
  to,
  resultKind,
}: {
  initialQuery?: string;
  scope?: SearchScope;
  autoFocus?: boolean;
  className?: string;
  subject?: string;
  chapter?: string;
  type?: string;
  label?: string;
  from?: string;
  to?: string;
  resultKind?: KnowledgeResultKind;
}) {
  const inputId = useId();
  const pending = useSearchPending();
  const filters = searchParameters({ q: "", scope, subject, chapter, type, from, to, resultKind });

  return (
    <Form
      action="/search"
      role="search"
      className={className}
    >
      {Array.from(filters, ([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-body">{label ?? (scope === "knowledge" ? "搜尋範圍：知識庫文字與表格" : "搜尋範圍：全站")}</label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          />
          <input
            id={inputId}
            type="search"
            name="q"
            defaultValue={initialQuery}
            required
            readOnly={pending}
            autoFocus={autoFocus}
            placeholder={
              subject ? "搜尋本科題目、解答、筆記與表格…" : scope === "tables" ? "搜尋表格名稱、表頭與內容…" : scope === "knowledge"
                ? "搜尋知識庫：疾病、藥物、檢驗…"
                : `搜尋知識庫、考古題，或輸入題號（例：${SOURCE_EXAMPLE}）`
            }
            className="min-h-11 w-full rounded-btn border border-card-border bg-card py-2 pr-3 pl-9 text-base text-strong placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-subj-accent/40"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-btn bg-subj-mid px-4 py-2 text-sm font-semibold text-subj-ink transition-colors hover:bg-subj-accent disabled:cursor-wait"
        >
          {pending ? "搜尋中…" : "搜尋"}
        </button>
      </div>
    </Form>
  );
}
