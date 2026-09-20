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
  isAdmin: boolean;
}

/**
 * 內容區的一個主題。遞迴渲染子主題，所以 level 3 是真的包在 level 2 底下
 * (原本只是縮排的文字)。
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
  isAdmin,
}: TopicSectionProps) {
  const { topic, questions, cards, children, totalQuestions, totalCards } = node;

  return (
    <details
      data-topic
      id={topicAnchorId(topic.id)}
      className={`group mb-3 scroll-mt-4 rounded-card border border-card-border bg-card/60 ${
        depth > 0 ? "ml-2 border-l-4 border-l-subj-mid sm:ml-4" : ""
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3">
        <span
          className={
            depth === 0
              ? "text-xl font-bold text-subj-deep"
              : "text-lg font-semibold text-subj-deep"
          }
        >
          {topic.heading_text}
        </span>
        <span className="shrink-0 text-xs text-muted">
          {totalQuestions > 0 && `${totalQuestions} 題`}
          {totalQuestions > 0 && totalCards > 0 && "・"}
          {totalCards > 0 && `${totalCards} 筆記`}
        </span>
      </summary>

      <div className="px-4 pb-4">
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
              isAdmin={isAdmin}
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
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </details>
  );
}
