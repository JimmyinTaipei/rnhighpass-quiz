"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, BookOpenCheck } from "lucide-react";
import { submitAnswer } from "@/lib/actions";
import { isAnswerCorrect, parseAcceptedAnswers } from "@/lib/quiz-utils";
import type { Question } from "@/lib/types";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

interface QuestionCardProps {
  question: Question;
  mode?: string;
  isLoggedIn: boolean;
  onAnswered?: (selected: string, correct: boolean) => void;
  hideExplanationWhenCorrect?: boolean;
  revealAnswer?: string;
}

export function QuestionCard({
  question,
  mode = "practice",
  isLoggedIn,
  onAnswered,
  hideExplanationWhenCorrect = false,
  revealAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<OptionKey | null>(
    (revealAnswer as OptionKey | undefined) ?? null,
  );
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const options: Record<OptionKey, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  const isAnswered = selected !== null;
  const accepted = parseAcceptedAnswers(question.answer);
  const isCorrect = selected !== null && isAnswerCorrect(question.answer, selected);

  function handleSelect(key: OptionKey) {
    if (isAnswered) return;
    setSelected(key);
    const correct = isAnswerCorrect(question.answer, key);
    onAnswered?.(key, correct);

    if (isLoggedIn) {
      startTransition(async () => {
        const result = await submitAnswer(question.id, key, correct, mode);
        setSaveNote(result.ok ? null : "作答紀錄儲存失敗，但不影響你看解析");
      });
    }
  }

  function optionStyle(key: OptionKey) {
    if (!isAnswered) {
      return selected === key
        ? "bg-light border-accent text-deep"
        : "bg-white border-card-border text-body hover:bg-gray-50";
    }
    if (accepted.length === 0 || accepted.includes(key)) {
      return "bg-[#EAF3DE] border-correct text-[#27500A] font-medium";
    }
    if (selected === key) {
      return "bg-[#FCEBEB] border-incorrect text-[#791F1F]";
    }
    return "bg-white border-card-border text-muted opacity-60";
  }

  return (
    <div className="mb-4 rounded-card border border-card-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-muted">
          {question.source_text}
        </span>
      </div>

      <p className="mb-4 whitespace-pre-wrap font-medium leading-relaxed text-body">
        {question.stem}
      </p>

      <div className="mb-4 space-y-2">
        {OPTION_KEYS.map((key) => {
          if (!options[key]) return null;
          return (
            <button
              key={key}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(key)}
              className={`flex w-full items-center justify-between rounded-btn border p-3 text-left transition-colors ${optionStyle(key)}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-bold">{key}.</span>
                <span>{options[key]}</span>
              </div>
              {isAnswered && (accepted.length === 0 || accepted.includes(key)) && (
                <CheckCircle2 size={18} className="text-correct shrink-0" />
              )}
              {isAnswered && selected === key && !accepted.includes(key) && accepted.length > 0 && (
                <XCircle size={18} className="text-incorrect shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && !(hideExplanationWhenCorrect && isCorrect) && (
        <div className="mt-4 border-t border-card-border pt-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-deep">
            <BookOpenCheck size={18} />
            <span>詳解</span>
            {accepted.length === 0 && (
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-normal text-warning">
                送分題
              </span>
            )}
            {accepted.length > 1 && (
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-normal text-warning">
                爭議題・正解 {accepted.join("、")}
              </span>
            )}
            {!isCorrect && accepted.length <= 1 && (
              <span className="text-xs font-normal text-incorrect">
                正解是 {question.answer}
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">
            {question.explanation_text}
          </p>
          {isPending && <p className="mt-1 text-xs text-muted">儲存中...</p>}
          {saveNote && <p className="mt-1 text-xs text-muted">{saveNote}</p>}
        </div>
      )}
    </div>
  );
}
