"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "@/lib/types";

const AUTO_ADVANCE_DELAY_MS = 700;

interface ChapterQuizRunnerProps {
  /**
   * 麵包屑顯示的範圍描述，例如「生解 / Ch09 消化系統」或「生解 / 3 章・50 題」。
   *
   * 原本這裡收的是 chapter + subject 兩個物件，但整支 runner 只用它們組這一行字。
   * 改成傳字串後，跨章節測驗(沒有單一章節可言)也能沿用同一個 runner。
   */
  scopeLabel: string;
  questions: Question[];
  isLoggedIn: boolean;
}

interface AnswerResult {
  questionId: string;
  selectedOption: string;
  correct: boolean;
}

type RunnerState =
  | { phase: "running"; index: number; results: AnswerResult[] }
  | { phase: "finished"; results: AnswerResult[] };

export function ChapterQuizRunner({
  scopeLabel,
  questions,
  isLoggedIn,
}: ChapterQuizRunnerProps) {
  const [state, setState] = useState<RunnerState>({
    phase: "running",
    index: 0,
    results: [],
  });
  const [cardKey, setCardKey] = useState(0);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function advance(results: AnswerResult[]) {
    setState((prev) => {
      if (prev.phase !== "running") return prev;
      const nextIndex = prev.index + 1;
      if (nextIndex >= questions.length) {
        return { phase: "finished", results };
      }
      return { phase: "running", index: nextIndex, results };
    });
    setCardKey((k) => k + 1);
  }

  function handleAnswered(question: Question, selectedOption: string, correct: boolean) {
    if (state.phase !== "running") return;
    const results = [...state.results, { questionId: question.id, selectedOption, correct }];

    if (correct) {
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) advance(results);
      }, AUTO_ADVANCE_DELAY_MS);
    } else {
      setState({ phase: "running", index: state.index, results });
    }
  }

  function handleNext() {
    if (state.phase !== "running") return;
    advance(state.results);
  }

  function handleRetry() {
    setState({ phase: "running", index: 0, results: [] });
    setCardKey((k) => k + 1);
  }

  if (state.phase === "finished") {
    const total = questions.length;
    const correctCount = state.results.filter((r) => r.correct).length;
    const accuracy = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const wrongResults = state.results.filter((r) => !r.correct);
    const wrongQuestions = questions.filter((q) =>
      wrongResults.some((r) => r.questionId === q.id),
    );

    return (
      <div>
        <h1 className="mb-2 text-2xl font-bold text-deep">測驗結束</h1>
        <p className="mb-6 text-lg text-body">
          正確率 {accuracy}%（{correctCount} / {total} 題）
        </p>
        {wrongQuestions.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-deep">答錯的題目</h2>
            {wrongQuestions.map((q) => {
              const result = wrongResults.find((r) => r.questionId === q.id);
              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  mode="quiz"
                  isLoggedIn={false}
                  revealAnswer={result?.selectedOption}
                />
              );
            })}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-btn border border-card-border bg-card px-4 py-2 font-medium text-body transition-colors hover:bg-gray-50"
          >
            重測一次
          </button>
          <Link
            href="/mistakes"
            className="rounded-btn bg-accent px-4 py-2 font-medium text-white transition-colors hover:opacity-90"
          >
            回錯題本複習
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[state.index];
  const lastResult = state.results.at(-1);
  const showNextButton = lastResult?.questionId === question.id && !lastResult.correct;
  const progress = ((state.index + (lastResult?.questionId === question.id ? 1 : 0)) / questions.length) * 100;

  return (
    <div>
      <p className="mb-1 text-sm text-muted">{scopeLabel}</p>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-light">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <QuestionCard
        key={cardKey}
        question={question}
        mode="quiz"
        isLoggedIn={isLoggedIn}
        onAnswered={(selected, correct) => handleAnswered(question, selected, correct)}
        hideExplanationWhenCorrect
      />
      <p className="mb-4 text-center text-sm text-muted">
        第 {state.index + 1} / {questions.length} 題
      </p>
      {showNextButton && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-btn bg-accent px-4 py-3 font-medium text-white transition-colors hover:opacity-90"
        >
          下一題
        </button>
      )}
    </div>
  );
}
