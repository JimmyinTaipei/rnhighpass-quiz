"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { OPTION_KEYS, parseAcceptedAnswers } from "@/lib/quiz-utils";
import type { MockQuestion } from "@/lib/mock-exam/data";
import type { ExamResult, ExamSession } from "@/lib/mock-exam/session";
import { AnswerSheet } from "./AnswerSheet";
import { QuestionStem, optionText } from "./QuestionView";
import { RichText } from "./RichText";

export function correctAnswerLabel(answer: string) {
  const accepted = parseAcceptedAnswers(answer);
  return accepted.length === 0 ? "送分" : accepted.join("/");
}

/**
 * 交卷後的成績頁：分數 + 每題對錯。依需求不顯示詳解。
 * 答案一律用「原始」選項字母(題本上的 A–D)，方便對照題本。
 */
export function ResultView({
  title,
  subjectName,
  questions,
  session,
  result,
  onRestart,
}: {
  title: string;
  subjectName: string;
  questions: MockQuestion[];
  session: ExamSession;
  result: ExamResult;
  onRestart: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openQuestion = questions.find((q) => q.id === openId);
  const openIndex = questions.findIndex((q) => q.id === openId);
  const usedMinutes = Math.max(
    1,
    Math.round(((session.finishedAt ?? session.startedAt) - session.startedAt) / 60000),
  );

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-card-border bg-card p-6 shadow-sm">
        <p className="mb-1 text-sm text-muted">{title}</p>
        <h1 className="mb-4 text-xl font-bold text-deep">{subjectName}・成績</h1>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-muted">得分</p>
            <p className="text-5xl font-bold text-deep">{result.score}</p>
          </div>
          <dl className="grid grid-cols-4 gap-x-6 gap-y-1 text-sm">
            <dt className="text-muted">答對</dt>
            <dt className="text-muted">答錯</dt>
            <dt className="text-muted">未作答</dt>
            <dt className="text-muted">作答時間</dt>
            <dd className="font-bold text-correct-text">{result.correct}</dd>
            <dd className="font-bold text-incorrect-text">{result.wrong}</dd>
            <dd className="font-bold text-body">{result.unanswered}</dd>
            <dd className="font-bold text-body">{usedMinutes} 分</dd>
          </dl>
        </div>
        <p className="mt-4 text-xs text-muted">
          分數依本站題庫答案計算（送分題一律給分），僅供練習參考。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-bold text-deep">作答結果</h2>
        <p className="mb-3 text-xs text-muted">
          答案以題本原始選項字母顯示（作答時選項順序有打亂）。點題號可查看題目。
        </p>
        <AnswerSheet
          activeId={openId ?? undefined}
          onSelect={(id) => setOpenId((prev) => (prev === id ? null : id))}
          cells={questions.map((q, i) => ({
            id: q.id,
            number: i + 1,
            answer: session.answers[q.id] ?? "",
            mark: session.marks[q.id],
            outcome: result.outcomes[q.id],
            correctAnswer: correctAnswerLabel(q.answer),
          }))}
        />
      </section>

      {openQuestion && (
        <section className="rounded-card border border-card-border bg-card p-5 shadow-sm">
          <p className="mb-3 text-sm text-strong">
            第 <span className="font-bold text-incorrect">{openIndex + 1}</span> 題
          </p>
          <QuestionStem question={openQuestion} />
          <ul className="mt-3 space-y-2">
            {OPTION_KEYS.map((key) => {
              const accepted = parseAcceptedAnswers(openQuestion.answer);
              const isCorrect = accepted.length === 0 || accepted.includes(key);
              const isMine = session.answers[openQuestion.id] === key;
              const text = optionText(openQuestion, key);
              return (
                <li
                  key={key}
                  className={`flex items-start gap-3 rounded-btn border px-3 py-2.5 ${
                    isCorrect
                      ? "border-correct bg-correct-bg text-correct-text"
                      : isMine
                        ? "border-incorrect bg-incorrect-bg text-incorrect-text"
                        : "border-card-border text-body"
                  }`}
                >
                  <span className="shrink-0 font-medium">({key})</span>
                  <span className="flex-1">{text ? <RichText text={text} /> : null}</span>
                  {isMine && (
                    <span className="shrink-0 text-xs font-medium">你的答案</span>
                  )}
                  {isCorrect ? (
                    <CheckCircle2 size={18} className="shrink-0 text-correct" />
                  ) : isMine ? (
                    <XCircle size={18} className="shrink-0 text-incorrect" />
                  ) : null}
                </li>
              );
            })}
          </ul>
          {!session.answers[openQuestion.id] && (
            <p className="mt-3 text-xs text-muted">這題沒有作答。</p>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-btn bg-deep px-5 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
        >
          <RotateCcw size={16} />
          重新考這份
        </button>
        <Link
          href="/mock-exam/select"
          className="rounded-btn border border-card-border bg-card px-5 py-2.5 text-sm font-medium text-body hover:bg-page"
        >
          選擇其他考卷
        </Link>
      </div>
    </div>
  );
}
