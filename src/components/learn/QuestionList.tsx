"use client";

import { useState } from "react";
import { Hint } from "@/components/ui/Hint";
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
        <Hint content={isLoggedIn ? "選答後立即對答並記錄，答錯會納入錯題本" : "可練習，作答不會儲存"} aria-pressed={!browse} onClick={() => setBrowse(false)}>
          小測驗
        </Hint>
        <Hint content="直接顯示答案與詳解，不新增作答紀錄" aria-pressed={browse} onClick={() => setBrowse(true)}>
          看答案
        </Hint>
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
