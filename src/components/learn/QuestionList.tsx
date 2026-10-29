"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import type { ChapterRef } from "@/lib/data";
import type { ComparisonTable, Question } from "@/lib/types";

interface QuestionListProps {
  questions: Question[];
  isLoggedIn: boolean;
  devMode: boolean;
  tables: Record<string, Pick<ComparisonTable, "id" | "title">[]>;
  otherChapters: Record<string, ChapterRef[]>;
  diseaseTags: Record<string, string[]>;
}

/**
 * 知識頁段落裡的考題：目的是瀏覽。「小測驗」點選項立即對答(會記錄)；
 * 「看答案」直接顯示正解與詳解，不記錄。整個區塊一起切換。
 */
export function QuestionList({ questions, isLoggedIn, devMode, tables, otherChapters, diseaseTags }: QuestionListProps) {
  const [browse, setBrowse] = useState(false);
  return (
    <>
      <div className="segmented mb-3" role="group" aria-label="考題顯示方式">
        <button type="button" aria-pressed={!browse} onClick={() => setBrowse(false)}>
          小測驗
        </button>
        <button type="button" aria-pressed={browse} onClick={() => setBrowse(true)}>
          看答案
        </button>
      </div>
      {questions.map((q) => (
        <QuestionCard
          // 切換時重新掛載，小測驗模式回到未作答
          key={`${q.id}-${browse}`}
          question={q}
          mode="learn"
          browseMode={browse}
          isLoggedIn={isLoggedIn}
          tables={tables[q.id]}
          otherChapters={otherChapters[q.id]}
          diseaseTags={diseaseTags[q.id]}
          devMode={devMode}
        />
      ))}
    </>
  );
}
