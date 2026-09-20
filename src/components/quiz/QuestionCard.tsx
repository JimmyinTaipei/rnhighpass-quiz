"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BookOpen, BookOpenCheck, CheckCircle2, XCircle } from "lucide-react";
import { submitAnswer } from "@/lib/actions";
import {
  OPTION_KEYS,
  isAnswerCorrect,
  parseAcceptedAnswers,
  shuffledOptionOrder,
  type OptionKey,
} from "@/lib/quiz-utils";
import { useIsClient } from "@/lib/use-is-client";
import { TableModalLink } from "@/components/tables/TableModalLink";
import { QuestionEditForm } from "@/components/admin/QuestionEditForm";
import type { ChapterRef } from "@/lib/data";
import type { ComparisonTable, Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  mode?: string;
  isLoggedIn: boolean;
  onAnswered?: (selected: string, correct: boolean) => void;
  hideExplanationWhenCorrect?: boolean;
  revealAnswer?: string;
  /**
   * 純瀏覽模式：直接顯示正解與詳解，且點選項「不記錄、不判定對錯」。
   *
   * 刻意不重用 revealAnswer——那個 prop 是塞進 selected state 的，而
   * selected !== null 同時代表「已作答」，正是觸發 submitAnswer 的條件。
   * 若拿它來做瀏覽模式，純瀏覽也會被收錄進錯題本。
   */
  browseMode?: boolean;
  /** 該題對應的比較表(只需要 id 與 title，內容由 modal 按需載入) */
  tables?: Pick<ComparisonTable, "id" | "title">[];
  /** 這題還出現在哪些「其他章節」(已扣掉當前章節) */
  otherChapters?: ChapterRef[];
  /** 疾病標籤(tag_type='dz') */
  diseaseTags?: string[];
  /** dev mode：是 admin 時顯示編輯介面(實際授權在 updateQuestion action 內) */
  isAdmin?: boolean;
  /**
   * 作答前打亂選項順序(預設開)。作答後一律排回原始 A–D 順序，方便對照詳解。
   * 瀏覽模式與 revealAnswer(已作答的回顧)本來就是作答後狀態，不會打亂。
   */
  shuffleOptions?: boolean;
}

export function QuestionCard({
  question,
  mode = "practice",
  isLoggedIn,
  onAnswered,
  hideExplanationWhenCorrect = false,
  revealAnswer,
  browseMode = false,
  tables,
  otherChapters,
  diseaseTags,
  isAdmin = false,
  shuffleOptions = true,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<OptionKey | null>(
    (revealAnswer as OptionKey | undefined) ?? null,
  );
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // 打亂後的順序(位置 -> 原始字母)。亂數在 server 與 client 算出來會不同，
  // 所以 hydration 完成(isClient)前不使用它，先把選項藏起來，避免先看到原順序再跳動。
  const needsShuffle = shuffleOptions && !browseMode && revealAnswer === undefined;
  const isClient = useIsClient();
  const [shuffledOrder] = useState(() => shuffledOptionOrder(question));

  const options: Record<OptionKey, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  const isAnswered = selected !== null;
  const accepted = parseAcceptedAnswers(question.answer);

  // 詳解四個欄位各自獨立成區塊。用陣列組裝避免同一段 markup 重複四次，
  // 順序固定為「考點 → 為什麼對 → 為什麼錯 → 補充」。
  // 四欄都空(舊題目只有 explanation_text)時走下面的 fallback。
  const explanationSections = [
    { label: "考點", text: question.key_point, emphasis: true },
    { label: "正解原因", text: question.correct_reason, emphasis: false },
    { label: "其他選項為何錯", text: question.wrong_options_reason, emphasis: false },
    { label: "延伸提醒", text: question.extra_notes, emphasis: false },
  ].filter((s): s is { label: string; text: string; emphasis: boolean } => !!s.text);
  const isCorrect = selected !== null && isAnswerCorrect(question.answer, selected);
  // 作答前用打亂的順序、顯示字母用位置；作答後排回原始順序與原始字母
  const displayOrder: readonly OptionKey[] =
    needsShuffle && !isAnswered && isClient ? shuffledOrder : OPTION_KEYS;
  const optionsHidden = needsShuffle && !isAnswered && !isClient;

  function handleSelect(key: OptionKey) {
    // 瀏覽模式不作答、不記錄
    if (browseMode) return;
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
    if (browseMode) {
      return accepted.length === 0 || accepted.includes(key)
        ? "bg-correct-bg border-correct text-correct-text font-medium"
        : "bg-card border-card-border text-body";
    }
    if (!isAnswered) {
      return selected === key
        ? "bg-light border-accent text-deep"
        : "bg-card border-card-border text-body hover:bg-page";
    }
    if (accepted.length === 0 || accepted.includes(key)) {
      return "bg-correct-bg border-correct text-correct-text font-medium";
    }
    if (selected === key) {
      return "bg-incorrect-bg border-incorrect text-incorrect-text";
    }
    return "bg-card border-card-border text-muted opacity-60";
  }

  return (
    <div className="mb-4 rounded-card border border-card-border bg-card p-5 shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded bg-page px-2 py-1 text-xs font-medium text-muted">
          {question.source_text}
        </span>
      </div>

      <p className="mb-4 whitespace-pre-wrap font-medium leading-relaxed text-body">
        {question.stem}
      </p>

      <div className={`mb-4 space-y-2 ${optionsHidden ? "invisible" : ""}`}>
        {displayOrder.map((key, position) => {
          if (!options[key]) return null;
          const label = isAnswered || browseMode ? key : OPTION_KEYS[position];
          return (
            <button
              key={key}
              type="button"
              disabled={isAnswered || browseMode}
              onClick={() => handleSelect(key)}
              className={`flex w-full items-center justify-between rounded-btn border p-3 text-left transition-all duration-200 ${optionStyle(key)} ${
                !isAnswered ? "hover:-translate-y-0.5 hover:shadow-sm" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-bold">{label}.</span>
                <span>{options[key]}</span>
              </div>
              {(browseMode || isAnswered) && (accepted.length === 0 || accepted.includes(key)) && (
                <CheckCircle2 size={18} className="icon-pop shrink-0 text-correct" />
              )}
              {isAnswered && selected === key && !accepted.includes(key) && accepted.length > 0 && (
                <XCircle size={18} className="icon-pop shrink-0 text-incorrect" />
              )}
            </button>
          );
        })}
      </div>

      {(browseMode || (isAnswered && !(hideExplanationWhenCorrect && isCorrect))) && (
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
            {!browseMode && !isCorrect && accepted.length <= 1 && (
              <span className="text-xs font-normal text-incorrect">
                正解是 {question.answer}
              </span>
            )}
          </div>
          {explanationSections.length > 0 ? (
            <div className="space-y-2">
              {explanationSections.map((section) => (
                <section
                  key={section.label}
                  className={`rounded-btn border-l-4 p-3 ${
                    section.emphasis
                      ? "border-l-subj-accent bg-subj-light/50"
                      : "border-l-card-border bg-page"
                  }`}
                >
                  <h4 className="mb-1 text-xs font-bold tracking-wide text-subj-deep">
                    {section.label}
                  </h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-strong">
                    {section.text}
                  </p>
                </section>
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-strong">
              {question.explanation_text}
            </p>
          )}
          {tables && tables.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tables.map((t) => (
                <TableModalLink key={t.id} tableId={t.id} title={t.title} />
              ))}
            </div>
          )}

          {otherChapters && otherChapters.length > 0 && (
            <div className="mt-3 border-t border-card-border pt-3">
              <h4 className="mb-1.5 text-xs font-bold text-subj-deep">也出現在其他章節</h4>
              <div className="flex flex-wrap gap-1.5">
                {otherChapters.map((c) => (
                  <Link
                    key={c.id}
                    href={`/chapters/${c.id}`}
                    className="flex items-center gap-1 rounded-full bg-page px-2.5 py-1 text-xs text-body transition-colors hover:bg-subj-light hover:text-subj-deep"
                  >
                    <BookOpen size={12} className="text-subj-accent" />
                    {c.subjectName} {c.chapter_no} {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {diseaseTags && diseaseTags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted">疾病標籤</span>
              {diseaseTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-card-border px-2 py-0.5 text-xs text-body"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {isPending && <p className="mt-1 text-xs text-muted">儲存中...</p>}
          {saveNote && <p className="mt-1 text-xs text-muted">{saveNote}</p>}
        </div>
      )}

      {isAdmin && <QuestionEditForm question={question} />}
    </div>
  );
}
