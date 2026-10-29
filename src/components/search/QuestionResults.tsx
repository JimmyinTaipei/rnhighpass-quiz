"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import type { Question } from "@/lib/types";

export interface QuestionResultItem {
  question: Question;
  /** 「內外 Ch03 心臟血管」這類所在章節 */
  chapterLabel: string;
}

/**
 * 考古題搜尋結果：一列一題(題號＋題幹前兩行)，點開就地作答或看答案，不用跳到章節頁找。
 * 只有一題(用題號查到)時直接展開。
 */
export function QuestionResults({ items, isLoggedIn }: { items: QuestionResultItem[]; isLoggedIn: boolean }) {
  const [browse, setBrowse] = useState(false);
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.length === 1 ? [items[0].question.id] : []));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <div className="segmented mb-3" role="group" aria-label="題目顯示方式">
        <button type="button" aria-pressed={!browse} onClick={() => setBrowse(false)}>
          小測驗
        </button>
        <button type="button" aria-pressed={browse} onClick={() => setBrowse(true)}>
          看答案
        </button>
      </div>
      <ul className="space-y-2">
        {items.map(({ question, chapterLabel }) => {
          const expanded = open.has(question.id);
          return (
            <li key={question.id} className="rounded-card bg-(--surface-inset)">
              <button
                type="button"
                onClick={() => toggle(question.id)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-2 p-4 text-left hover:bg-surface-hover"
              >
                <ChevronRight
                  size={16}
                  className={`mt-0.5 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded bg-page px-2 py-0.5 font-medium text-body">{question.source_text}</span>
                    {chapterLabel && <span>{chapterLabel}</span>}
                  </span>
                  <span className={`block text-sm leading-relaxed text-strong ${expanded ? "" : "line-clamp-2"}`}>
                    {question.stem}
                  </span>
                </span>
              </button>
              {expanded && (
                <div className="fade-in px-4 pb-4">
                  <QuestionCard
                    key={`${question.id}-${browse}`}
                    question={question}
                    mode="learn"
                    browseMode={browse}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
