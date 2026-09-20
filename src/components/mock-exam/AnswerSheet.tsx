"use client";

import type { Mark, QuestionOutcome } from "@/lib/mock-exam/session";
import { markInfo } from "./marks";

export interface AnswerSheetCell {
  id: string;
  /** 畫面上的題號(1 起算) */
  number: number;
  /** 格子下半部要顯示的答案文字；空字串代表未作答 */
  answer: string;
  mark?: Mark;
  /** 成績頁才有：用來上色 */
  outcome?: QuestionOutcome;
  /** 成績頁才有：正解 */
  correctAnswer?: string;
}

const OUTCOME_STYLES: Record<QuestionOutcome, string> = {
  correct: "bg-correct-bg text-correct-text",
  wrong: "bg-incorrect-bg text-incorrect-text",
  unanswered: "bg-page text-muted",
};

/**
 * 題號/答案總表。作答中用來「瀏覽作答情形」(未作答標粉紅)，
 * 交卷後用來顯示每題對錯。桌機一列 10 題(同考選部)，手機一列 5 題。
 */
export function AnswerSheet({
  cells,
  activeId,
  onSelect,
}: {
  cells: AnswerSheetCell[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 overflow-hidden rounded-card border border-card-border sm:grid-cols-10">
      {cells.map((cell) => {
        const mark = markInfo(cell.mark);
        const answerStyle = cell.outcome
          ? OUTCOME_STYLES[cell.outcome]
          : cell.answer
            ? "bg-light/60 text-strong"
            : "bg-incorrect-bg text-incorrect-text";
        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => onSelect(cell.id)}
            className={`flex flex-col border-b border-r border-card-border text-center transition-colors hover:bg-light/40 ${
              activeId === cell.id ? "ring-2 ring-inset ring-accent" : ""
            }`}
          >
            <span className="flex items-center justify-center gap-0.5 bg-card py-1 text-xs font-medium text-accent">
              [{cell.number}]
              {mark && (
                <span className={`${mark.className} text-[10px]`} aria-label={mark.label}>
                  {mark.symbol}
                </span>
              )}
            </span>
            <span className={`flex min-h-8 flex-col items-center justify-center py-1 text-sm font-medium ${answerStyle}`}>
              <span>{cell.answer || (cell.outcome ? "—" : "")}</span>
              {cell.correctAnswer !== undefined && cell.outcome !== "correct" && (
                <span className="text-[10px] font-normal">正解 {cell.correctAnswer}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
