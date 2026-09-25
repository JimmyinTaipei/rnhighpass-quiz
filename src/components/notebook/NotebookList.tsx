"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileDown, ListChecks, RotateCcw, SquareCheck } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import type { Question } from "@/lib/types";

export interface NotebookItem {
  question: Question;
  wrongCount: number;
  /** 錯題：最後答錯時間；收藏：收藏時間 */
  date: string | null;
}

export interface NotebookGroup {
  chapterId: number | null;
  label: string;
  items: NotebookItem[];
}

interface NotebookListProps {
  source: "mistakes" | "favorites";
  subjectName: string;
  groups: NotebookGroup[];
  /** 本科重做與匯出的連結(server 端依使用者身分算題目，不帶 id) */
  reviewHref: string;
  exportHref: string;
  devMode: boolean;
}

/** 勾選匯出的上限，與 /print/questions 的限制一致 */
const MAX_SELECTED = 100;

/**
 * 題本清單：章節分組 → 每題一行摘要，點開才渲染完整 QuestionCard。
 * 收合狀態不掛 QuestionCard，幾百題的錯題本也不會一次渲染幾百張卡。
 */
export function NotebookList({
  source,
  subjectName,
  groups,
  reviewHref,
  exportHref,
  devMode,
}: NotebookListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const toggleIn = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const selectedIds = [...selected].slice(0, MAX_SELECTED);
  const exportSelectedHref = `/print/questions?source=ids&ids=${encodeURIComponent(selectedIds.join(","))}`;

  const btn =
    "flex items-center gap-1.5 rounded-btn border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-subj-accent hover:text-subj-deep";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-subj-deep">
          {subjectName}・{total} 題{source === "mistakes" ? "錯題" : "收藏"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href={reviewHref} className={btn}>
            <RotateCcw size={12} />
            重做本科{source === "mistakes" ? "錯題" : "收藏"}
          </Link>
          <Link href={exportHref} className={btn} target="_blank">
            <FileDown size={12} />
            匯出本科 PDF
          </Link>
          <button
            type="button"
            onClick={() => {
              setSelecting((v) => !v);
              setSelected(new Set());
            }}
            aria-pressed={selecting}
            className={`${btn} ${selecting ? "border-subj-accent text-subj-deep" : ""}`}
          >
            <ListChecks size={12} />
            {selecting ? "取消選取" : "選取題目"}
          </button>
        </div>
      </div>

      {selecting && (
        <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-3 rounded-btn border border-subj-accent bg-subj-light px-3 py-2 text-sm">
          <span className="text-subj-deep">
            已選 {selected.size} 題{selected.size > MAX_SELECTED && `（最多匯出 ${MAX_SELECTED} 題）`}
          </span>
          <button
            type="button"
            onClick={() =>
              setSelected(new Set(groups.flatMap((g) => g.items.map((i) => i.question.id))))
            }
            className="text-xs text-subj-deep underline"
          >
            全選
          </button>
          {selected.size > 0 && (
            <Link
              href={exportSelectedHref}
              target="_blank"
              className="ml-auto flex items-center gap-1 rounded-btn bg-subj-accent px-3 py-1 text-xs font-medium text-on-accent"
            >
              <FileDown size={12} />
              匯出選取的題目
            </Link>
          )}
        </div>
      )}

      <div className="space-y-3">
        {groups.map((g, gi) => (
          <details
            key={g.chapterId ?? "none"}
            open={gi < 2}
            className="group rounded-card border border-card-border bg-page"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-body">
              <ChevronRight
                size={16}
                className="shrink-0 text-muted transition-transform group-open:rotate-90"
              />
              <span className="min-w-0 flex-1">{g.label}</span>
              <span className="text-xs font-normal text-muted">{g.items.length} 題</span>
              {g.chapterId != null && (
                <Link
                  href={`/chapters/${g.chapterId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-normal text-subj-deep hover:underline"
                >
                  看章節
                </Link>
              )}
            </summary>
            <ul className="divide-y divide-card-border border-t border-card-border">
              {g.items.map(({ question, wrongCount, date }) => {
                const isOpen = expanded.has(question.id);
                const isSelected = selected.has(question.id);
                return (
                  <li key={question.id} className="px-2 py-1">
                    <div className="flex items-start gap-2">
                      {selecting && (
                        <button
                          type="button"
                          onClick={() => setSelected((s) => toggleIn(s, question.id))}
                          aria-pressed={isSelected}
                          aria-label="選取這一題"
                          className={`mt-2 shrink-0 ${isSelected ? "text-subj-accent" : "text-muted"}`}
                        >
                          <SquareCheck size={18} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpanded((s) => toggleIn(s, question.id))}
                        aria-expanded={isOpen}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-btn px-2 py-2 text-left text-sm transition-colors hover:bg-surface-hover"
                      >
                        <span className="shrink-0 font-mono text-xs text-muted">
                          {question.source_text}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-strong">{question.stem}</span>
                        {wrongCount > 0 && (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                              wrongCount >= 2 ? "bg-incorrect-bg text-incorrect-text" : "bg-card text-muted"
                            }`}
                          >
                            錯 {wrongCount} 次
                          </span>
                        )}
                        {date && (
                          <span className="hidden shrink-0 text-xs text-muted sm:inline">
                            {new Date(date).toLocaleDateString("zh-TW", { month: "numeric", day: "numeric" })}
                          </span>
                        )}
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-1 pt-2">
                        <QuestionCard
                          question={question}
                          mode={source === "mistakes" ? "mistakes" : "practice"}
                          isLoggedIn
                          devMode={devMode}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
