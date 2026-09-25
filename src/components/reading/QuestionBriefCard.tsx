import { parseAcceptedAnswers } from "@/lib/quiz-utils";
import type { Question } from "@/lib/types";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

/**
 * 卡片檢視：比「題目檢視」密、比「表格檢視」完整。
 * 純瀏覽用，所以直接標出正解，不接作答邏輯。
 */
export function QuestionBriefCard({ question }: { question: Question }) {
  const accepted = parseAcceptedAnswers(question.answer);
  const options = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  return (
    <div className="rounded-card border border-card-border bg-page p-4">
      <span className="rounded bg-card px-2 py-0.5 text-xs font-medium text-muted">
        {question.source_text}
      </span>
      <p className="mt-2 mb-3 whitespace-pre-wrap text-sm font-medium leading-relaxed text-strong">
        {question.stem}
      </p>
      <ul className="mb-3 space-y-1">
        {OPTION_KEYS.map((key) => {
          if (!options[key]) return null;
          const correct = accepted.length === 0 || accepted.includes(key);
          return (
            <li
              key={key}
              className={`rounded px-2 py-1 text-xs ${
                correct
                  ? "bg-correct-bg font-medium text-correct-text"
                  : "text-body"
              }`}
            >
              <span className="mr-1 font-bold">{key}.</span>
              {options[key]}
            </li>
          );
        })}
      </ul>
      {question.key_point && (
        <div className="rounded-btn border-l-4 border-l-subj-accent bg-subj-light/50 p-2">
          <h4 className="text-xs font-bold text-subj-deep">考點</h4>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-strong">
            {question.key_point}
          </p>
        </div>
      )}
    </div>
  );
}
