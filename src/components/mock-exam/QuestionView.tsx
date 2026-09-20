"use client";

import { OPTION_KEYS, type OptionKey } from "@/lib/quiz-utils";
import type { MockQuestion } from "@/lib/mock-exam/data";
import { RichText, examImageSrc } from "./RichText";

const OPTION_FIELD: Record<OptionKey, "option_a" | "option_b" | "option_c" | "option_d"> = {
  A: "option_a",
  B: "option_b",
  C: "option_c",
  D: "option_d",
};

export function optionText(question: MockQuestion, key: OptionKey) {
  return question[OPTION_FIELD[key]];
}

export function QuestionStem({ question }: { question: MockQuestion }) {
  return (
    <>
      <p className="mb-3 leading-relaxed text-strong">
        <RichText text={question.stem} />
      </p>
      {question.images.map((filename) => (
        // eslint-disable-next-line @next/next/no-img-element -- 考卷掃描圖，尺寸不一
        <img
          key={filename}
          src={examImageSrc(filename)}
          alt="題目附圖"
          className="mb-3 max-h-[28rem] max-w-full rounded border border-card-border"
        />
      ))}
    </>
  );
}

interface QuestionViewProps {
  question: MockQuestion;
  number: number;
  points: number;
  /** 顯示順序(位置 -> 原始字母) */
  order: OptionKey[];
  /** 已選的原始字母 */
  selected: OptionKey | undefined;
  zoom: number;
  onSelect: (original: OptionKey) => void;
  onZoom: (zoom: number) => void;
}

export function QuestionView({
  question,
  number,
  points,
  order,
  selected,
  zoom,
  onSelect,
  onZoom,
}: QuestionViewProps) {
  const pointsLabel = Number.isInteger(points) ? points : points.toFixed(2);
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="text-base text-strong">
          第 <span className="font-bold text-incorrect">{number}</span> 題（{pointsLabel}分）
        </span>
        <span className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onZoom(Math.min(200, zoom + 10))}
            className="text-incorrect underline hover:opacity-70"
          >
            放大
          </button>
          <button
            type="button"
            onClick={() => onZoom(100)}
            className="text-incorrect underline hover:opacity-70"
          >
            還原
          </button>
          <button
            type="button"
            onClick={() => onZoom(Math.max(70, zoom - 10))}
            className="text-accent underline hover:opacity-70"
          >
            縮小
          </button>
          <span className="text-muted">（顯示比例：{zoom}%）</span>
        </span>
      </div>

      <div style={{ fontSize: `${zoom}%` }}>
        <QuestionStem question={question} />

        {OPTION_KEYS.every((k) => !optionText(question, k)) && (
          <p className="mt-3 rounded-btn bg-warning/10 px-3 py-2 text-sm text-body">
            本題選項文字尚未建檔，請先略過（作答不影響其他題目）。
          </p>
        )}
        <fieldset className="mt-4 space-y-2">
          <legend className="sr-only">第 {number} 題選項</legend>
          {order.map((original, position) => {
            const displayKey = OPTION_KEYS[position];
            const text = optionText(question, original);
            const checked = selected === original;
            return (
              <label
                key={original}
                className={`flex cursor-pointer items-start gap-3 rounded-btn border px-3 py-2.5 transition-colors ${
                  checked
                    ? "border-accent bg-light"
                    : "border-transparent hover:border-card-border hover:bg-page"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={checked}
                  onChange={() => onSelect(original)}
                  className="mt-1.5 size-4 shrink-0 accent-[var(--color-deep)]"
                />
                <span className="shrink-0 text-strong">({displayKey})</span>
                <span className="text-strong">{text ? <RichText text={text} /> : null}</span>
              </label>
            );
          })}
        </fieldset>
      </div>
    </section>
  );
}
