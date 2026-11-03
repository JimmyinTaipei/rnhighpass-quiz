import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import type { Question } from "@/lib/types";
import { MatchSnippet } from "./MatchSnippet";
import { HighlightText } from "./HighlightText";

export interface QuestionResultItem {
  question: Question;
  chapterLabel: string;
  questionHref?: string;
  matchLabel?: string;
  snippet?: [string, string, string] | null;
}

/** Native details remains operable before hydration; search always shows answers. */
export function QuestionResults({ items, isLoggedIn, query = "" }: {
  items: QuestionResultItem[];
  isLoggedIn: boolean;
  query?: string;
}) {
  return <ul className="divide-y divide-card-border rounded-card bg-card">
    {items.map(({ question, chapterLabel, questionHref, matchLabel, snippet }) => (
      <li key={question.id} className="bg-card">
        <details data-search-detail={`question:${question.id}`} className="group/search-question" open={items.length === 1}>
          <summary className="flex min-h-11 cursor-pointer list-none items-start gap-2 p-4 text-left hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            <ChevronRight size={16} aria-hidden className="mt-0.5 shrink-0 text-muted transition-transform group-open/search-question:rotate-90 motion-reduce:transition-none" />
            <span className="min-w-0 flex-1">
              <span className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded bg-page px-2 py-0.5 font-medium text-body">{question.source_text}</span>
                {chapterLabel && <span>{chapterLabel}</span>}
              </span>
              <span className="block line-clamp-2 text-sm leading-relaxed text-strong group-open/search-question:line-clamp-none"><HighlightText text={question.stem} query={query} /></span>
              <span className="mt-2 block text-sm font-semibold text-deep">答案：{question.answer || "送分題"}</span>
              {matchLabel && matchLabel !== "題幹" && <span className="mt-2 block text-xs text-muted">命中：{matchLabel}<MatchSnippet snippet={snippet} /></span>}
              <span className="mt-2 block text-xs text-muted group-open/search-question:hidden">展開完整題目與解答</span>
            </span>
          </summary>
          <div className="px-4 pb-4">
            <QuestionCard question={question} mode="learn" browseMode shuffleOptions={false} isLoggedIn={isLoggedIn} />
            {questionHref && <Link href={questionHref} className="inline-flex min-h-11 items-center rounded-btn border border-card-border px-3 text-sm font-medium text-deep hover:bg-surface-hover">前往此題（科目章節）</Link>}
          </div>
        </details>
      </li>
    ))}
  </ul>;
}
