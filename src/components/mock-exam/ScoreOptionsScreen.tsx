"use client";

import { useState } from "react";

const QUESTIONS = [
  { key: "perSection", label: "是否於每節考試結束後，顯示該節成績？" },
  { key: "afterAll", label: "當次考試結束後，顯示各科成績？" },
] as const;

type Choice = Record<(typeof QUESTIONS)[number]["key"], boolean>;

/**
 * 考前「是否顯示成績」選項(比照考選部 step 3-1)。預設都是「否」，同正式系統。
 * 模擬考只有一節，所以兩題任一選「是」就在交卷後顯示成績。
 */
export function ScoreOptionsScreen({ onConfirm }: { onConfirm: (showScore: boolean) => void }) {
  const [choice, setChoice] = useState<Choice>({ perSection: false, afterAll: false });

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-card border border-card-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          {QUESTIONS.map((q) => (
            <fieldset
              key={q.key}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-strong"
            >
              <legend className="sr-only">{q.label}</legend>
              <span aria-hidden className="sm:text-lg">
                {q.label}
              </span>
              <span className="flex gap-4">
                {([true, false] as const).map((value) => (
                  <label key={String(value)} className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="radio"
                      name={q.key}
                      checked={choice[q.key] === value}
                      onChange={() => setChoice((prev) => ({ ...prev, [q.key]: value }))}
                      className="size-4 accent-[var(--color-deep)]"
                    />
                    {value ? "是" : "否"}
                  </label>
                ))}
              </span>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-center text-sm">
          <p className="font-bold text-incorrect">提醒您！</p>
          <p className="text-body">*1. 如果選擇不顯示考試成績，事後不得要求提供！</p>
          <p className="text-body">*2. 正式考試成績將以考選部榜示後之成績通知為準！</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => onConfirm(choice.perSection || choice.afterAll)}
            className="min-w-28 rounded-btn bg-deep px-6 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
          >
            確定
          </button>
        </div>
      </section>
      <p className="mt-4 text-center text-xs text-muted">
        建議考前就先決定好要不要顯示成績，正式考試時才不會在這一步猶豫。
      </p>
    </div>
  );
}
