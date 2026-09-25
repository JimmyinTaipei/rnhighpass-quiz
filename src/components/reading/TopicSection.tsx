import { ChevronRight } from "lucide-react";
import { NoteCard } from "@/components/notes/NoteCard";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionBriefCard } from "./QuestionBriefCard";
import { hasContent, topicAnchorId, type TopicNode } from "@/lib/topic-tree";
import type { ViewMode } from "@/lib/view-mode";
import type { ComparisonTable } from "@/lib/types";
import type { ChapterRef } from "@/lib/data";

interface TopicSectionProps {
  node: TopicNode;
  depth: number;
  view: ViewMode;
  reveal: boolean;
  isLoggedIn: boolean;
  /** 題目 id -> 該題的比較表。整章查一次後往下傳，不在每個主題重查。 */
  tablesByQuestion: Map<string, ComparisonTable[]>;
  /** 題目 id -> 其他章節(已扣掉當前章節) */
  otherChaptersByQuestion: Map<string, ChapterRef[]>;
  /** 題目 id -> 疾病標籤 */
  diseaseTagsByQuestion: Map<string, string[]>;
  devMode: boolean;
}

/**
 * 內容區的一個主題。遞迴渲染子主題，所以 level 3 是真的包在 level 2 底下
 * (原本只是縮排的文字)。
 *
 * 主題層本身不畫卡片 —— 巢狀只靠縮排加一條左側導引線表達(Notion 式)，
 * 避免深層題目被「框中框中框」包住。只有題目卡/筆記卡自己有一層淡框。
 *
 * 用原生 <details> 而非 useState，這樣整棵樹可以留在 server component；
 * 「全部展開/收合」由 ReadingControls 透過 details[data-topic] 批次切換。
 * 預設不加 open —— 使用者要的是進章節頁時全部收合。
 */
export function TopicSection({
  node,
  depth,
  view,
  reveal,
  isLoggedIn,
  tablesByQuestion,
  otherChaptersByQuestion,
  diseaseTagsByQuestion,
  devMode,
}: TopicSectionProps) {
  const { topic, questions, cards, children, totalQuestions, totalCards } = node;

  return (
    <details
      data-topic
      id={topicAnchorId(topic.id)}
      className={`group scroll-mt-4 ${depth === 0 ? "mb-6" : "mb-2"}`}
    >
      <summary
        className={`-mx-2 flex cursor-pointer list-none items-center gap-2 rounded-btn px-2 py-2 transition-colors hover:bg-surface-hover/60 ${
          depth === 0 ? "border-b border-card-border pb-2" : ""
        }`}
      >
        <ChevronRight
          size={16}
          className="shrink-0 text-muted transition-transform group-open:rotate-90"
        />
        <span
          className={
            depth === 0
              ? "text-xl font-bold text-subj-deep"
              : "text-base font-semibold text-subj-deep"
          }
        >
          {topic.heading_text}
        </span>
        <span className="text-xs text-muted">
          {totalQuestions > 0 && `${totalQuestions} 題`}
          {totalQuestions > 0 && totalCards > 0 && "・"}
          {totalCards > 0 && `${totalCards} 筆記`}
        </span>
      </summary>

      <div className="mt-2 ml-2 border-l border-card-border pl-4 transition-colors hover:border-subj-mid">
        {/* 筆記卡在題目之前，且是掛在這個主題底下(原本全章的卡都擠在頁首) */}
        {cards.map((c) => (
          <NoteCard key={c.node_id} card={c} />
        ))}

        {questions.length > 0 && view === "card" && (
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            {questions.map((q) => (
              <QuestionBriefCard key={q.id} question={q} />
            ))}
          </div>
        )}
        {questions.length > 0 && view === "quiz" &&
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              mode="chapter"
              isLoggedIn={isLoggedIn}
              browseMode={reveal}
              tables={tablesByQuestion.get(q.id)}
              otherChapters={otherChaptersByQuestion.get(q.id)}
              diseaseTags={diseaseTagsByQuestion.get(q.id)}
              devMode={devMode}
            />
          ))}

        {children.filter(hasContent).map((child) => (
          <TopicSection
            key={child.topic.id}
            node={child}
            depth={depth + 1}
            view={view}
            reveal={reveal}
            isLoggedIn={isLoggedIn}
            tablesByQuestion={tablesByQuestion}
            otherChaptersByQuestion={otherChaptersByQuestion}
            diseaseTagsByQuestion={diseaseTagsByQuestion}
            devMode={devMode}
          />
        ))}
      </div>
    </details>
  );
}
