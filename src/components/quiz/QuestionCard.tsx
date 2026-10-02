"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BookOpen, BookOpenCheck, BookOpenText, CheckCircle2, XCircle } from "lucide-react";
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
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReportButton } from "@/components/report/ReportButton";
import type { ChapterRef } from "@/lib/data";
import type { ComparisonTable, Question } from "@/lib/types";
import type { KnowledgeRef } from "@/lib/knowledge/exam";

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
  /** 相關知識頁(knowledgeForQuestions)，作答後在詳解底下列「複習知識點」，點開是知識面板 */
  knowledge?: KnowledgeRef[];
  /**
   * dev mode：由 server 端 getDevMode()(admin 且開關打開)決定。
   * 只影響要不要渲染編輯工具，實際授權在 updateQuestion action 與 RLS。
   */
  devMode?: boolean;
  /**
   * 作答前打亂選項順序(預設開)。作答後一律排回原始 A–D 順序，方便對照詳解。
   * 瀏覽模式與 revealAnswer(已作答的回顧)本來就是作答後狀態，不會打亂。
   */
  shuffleOptions?: boolean;
  /**
   * 受控模式(做題頁)：選擇狀態由外層管理，外層決定何時記錄、何時揭曉。
   * 有傳 onSelect 就是受控；章節頁、知識頁、疾病頁維持原本「點了就對答、立即記錄」。
   */
  selected?: OptionKey | null;
  onSelect?: (key: OptionKey) => void;
  /** 受控時是否顯示對錯與詳解。交卷後對答模式在交卷前是 false，可以自由改答 */
  reveal?: boolean;
  /** 受控時的選項順序(外層要知道順序，快捷鍵 1–4 才對得到畫面上的位置) */
  optionOrder?: readonly OptionKey[];
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
  knowledge,
  devMode = false,
  shuffleOptions = true,
  selected: selectedProp,
  onSelect,
  reveal,
  optionOrder,
}: QuestionCardProps) {
  const controlled = onSelect !== undefined;
  const [innerSelected, setSelected] = useState<OptionKey | null>(
    (revealAnswer as OptionKey | undefined) ?? null,
  );
  const selected = controlled ? (selectedProp ?? null) : innerSelected;
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
  // 是否顯示對錯與詳解。非受控時「選了就揭曉」(原本的行為)
  const revealed = browseMode || (controlled ? (reveal ?? isAnswered) && isAnswered : isAnswered);
  // 是否不能再改答：揭曉之後就鎖住(受控的交卷後對答模式在交卷前可以一直改)
  const locked = browseMode || (isAnswered && revealed);
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
    needsShuffle && !revealed && isClient ? (optionOrder ?? shuffledOrder) : OPTION_KEYS;
  const optionsHidden = needsShuffle && !revealed && !isClient;

  function handleSelect(key: OptionKey) {
    // 瀏覽模式不作答、不記錄
    if (locked) return;
    if (controlled) {
      onSelect(key);
      return;
    }
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
        ? "bg-correct-bg text-correct-text font-medium"
        : "bg-(--surface-row) text-body";
    }
    if (!revealed) {
      return selected === key
        ? "bg-light text-deep"
        : "bg-(--surface-row) text-strong hover:bg-surface-hover";
    }
    if (accepted.length === 0 || accepted.includes(key)) {
      return "bg-correct-bg text-correct-text font-medium";
    }
    if (selected === key) {
      return "bg-incorrect-bg text-incorrect-text";
    }
    return "bg-(--surface-row) text-muted";
  }

  return (
    // 底色跟外層反差(見 globals.css 的 --surface-inset)：白色面板裡是灰卡，灰色頁面上是白卡
    <div className="mb-4 rounded-card bg-(--surface-inset) p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-full bg-fill px-2.5 py-0.5 text-xs font-medium text-body">
          {question.source_text}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <ReportButton questionId={question.id} targetLabel={question.source_text} />
          <FavoriteButton questionId={question.id} />
        </div>
      </div>

      <p className="mb-4 text-[16px] whitespace-pre-wrap leading-relaxed font-medium text-strong">
        {question.stem}
      </p>

      <div className={`mb-4 space-y-1.5 ${optionsHidden ? "invisible" : ""}`}>
        {displayOrder.map((key, position) => {
          if (!options[key]) return null;
          const label = revealed ? key : OPTION_KEYS[position];
          return (
            <button
              key={key}
              type="button"
              disabled={locked}
              onClick={() => handleSelect(key)}
              className={`flex w-full items-center justify-between gap-3 rounded-btn px-3.5 py-3 text-left text-[15px] transition-colors duration-150 ${optionStyle(key)}`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-fill text-xs font-semibold">
                  {label}
                </span>
                <span className="leading-relaxed">{options[key]}</span>
              </div>
              {revealed && (accepted.length === 0 || accepted.includes(key)) && (
                <CheckCircle2 size={18} className="icon-pop shrink-0 text-correct" />
              )}
              {revealed && selected === key && !accepted.includes(key) && accepted.length > 0 && (
                <XCircle size={18} className="icon-pop shrink-0 text-incorrect" />
              )}
            </button>
          );
        })}
      </div>

      {(browseMode || (revealed && !(hideExplanationWhenCorrect && isCorrect))) && (
        <div className="mt-5">
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
                  className={`rounded-btn px-3.5 py-3 ${
                    section.emphasis ? "bg-subj-light/70" : "bg-(--surface-row)"
                  }`}
                >
                  <h4 className="mb-1 text-xs font-semibold text-subj-deep">
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

          {knowledge && knowledge.length > 0 && (
            <div className="mt-3 border-t border-card-border pt-3">
              <h4 className="mb-1.5 text-xs font-bold text-subj-deep">複習知識點</h4>
              <div className="flex flex-wrap gap-1.5">
                {knowledge.map((k) => (
                  <Link
                    key={k.slug}
                    href={`/k/${k.slug}`}
                    scroll={false}
                    className="flex items-center gap-1 rounded-full bg-(--surface-row) px-2.5 py-1 text-xs font-medium text-deep transition-colors hover:bg-light"
                  >
                    <BookOpenText size={12} className="text-accent" />
                    {k.title}
                  </Link>
                ))}
              </div>
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
                    className="flex items-center gap-1 rounded-full bg-(--surface-row) px-2.5 py-1 text-xs text-body transition-colors hover:bg-subj-light hover:text-subj-deep"
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

      {devMode && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-dashed border-warning/50 pt-2 font-mono text-[11px] text-muted">
          <span>id={question.id}</span>
          <span>topic={question.topic_id ?? "—"}</span>
          <span>chapter={question.primary_chapter_id ?? "—"}</span>
          {question.edited_fields && question.edited_fields.length > 0 && (
            <span className="text-warning">已手改：{question.edited_fields.join(", ")}</span>
          )}
        </div>
      )}
      {devMode && <QuestionEditForm question={question} />}
    </div>
  );
}
