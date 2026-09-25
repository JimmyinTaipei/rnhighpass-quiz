import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, FileDown } from "lucide-react";
import { NoteCard } from "@/components/notes/NoteCard";
import { ReadingControls } from "@/components/reading/ReadingControls";
import { TopicSection } from "@/components/reading/TopicSection";
import { ViewControls } from "@/components/reading/ViewControls";
import {
  dedupeTables,
  getCardsByChapter,
  getChapter,
  getCurrentUser,
  getDiseaseTagsForQuestions,
  getOtherChaptersForQuestions,
  getQuestionsByTopicIds,
  getSubject,
  getTablesForQuestions,
  getTopics,
} from "@/lib/data";
import { TableModalLink } from "@/components/tables/TableModalLink";
import { buildChapterContent, hasContent } from "@/lib/topic-tree";
import { getDevMode } from "@/lib/dev-mode";
import { subjectGroup } from "@/lib/subject-groups";
import { parseViewMode } from "@/lib/view-mode";

export default async function ChapterPage(props: PageProps<"/chapters/[chapterId]">) {
  const [{ chapterId }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  // 側邊欄(科目切換 + Ch 列表 + 節點樹)在 chapters/layout.tsx 與 @tree slot，
  // 這一頁只負責右欄內容，所以不再查 subjects / siblingChapters / 章節計數。
  const [subject, topics, cards, user, devMode] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
    getCardsByChapter(chapterIdNum),
    getCurrentUser(),
    getDevMode(),
  ]);

  const questions = await getQuestionsByTopicIds(topics.map((t) => t.id));
  // 比較表整章查一次，往下傳給每個主題；匯總區則是把它去重攤平
  const questionIds = questions.map((q) => q.id);
  const [tablesByQuestion, otherChaptersByQuestion, diseaseTagsByQuestion] = await Promise.all([
    getTablesForQuestions(questionIds),
    // 「其他章節」= question_chapters 扣掉當前這一章
    getOtherChaptersForQuestions(questionIds, chapterIdNum),
    getDiseaseTagsForQuestions(questionIds),
  ]);
  const chapterTables = dedupeTables(tablesByQuestion);
  const content = buildChapterContent(chapter, topics, questions, cards);
  const visibleTopics = content.tree.filter(hasContent);

  const view = parseViewMode(
    typeof searchParams.view === "string" ? searchParams.view : undefined,
  );
  const reveal = searchParams.reveal === "1";
  const group = subject ? subjectGroup(subject) : undefined;

  return (
    <div data-group={group} className="min-w-0">
      <p className="mb-1 text-sm text-muted">
        <Link href="/subjects" className="hover:text-subj-deep">
          科目
        </Link>{" "}
        /{" "}
        <Link
          href={`/subjects/${encodeURIComponent(chapter.subject_id)}`}
          className="hover:text-subj-deep"
        >
          {subject?.name}
        </Link>{" "}
        /{" "}
        <Link href={`/chapters/${chapter.id}`} className="hover:text-subj-deep">
          {chapter.chapter_no}
        </Link>
      </p>
      <h1 className="mb-4 flex items-center gap-2 text-3xl font-bold text-subj-deep">
        <BookOpen className="text-subj-accent" />
        {chapter.chapter_no} {chapter.title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <ViewControls view={view} reveal={reveal} />
        <ReadingControls />
        {questions.length > 0 && (
          <Link
            href={`/chapters/${chapter.id}/quiz`}
            className="rounded-btn bg-subj-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            開始測驗
          </Link>
        )}
        {questions.length > 0 && (
          <Link
            href={`/print/questions?source=chapter&chapter=${chapter.id}`}
            target="_blank"
            className="flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-2 text-sm font-medium text-body transition-colors hover:border-subj-accent hover:text-subj-deep"
          >
            <FileDown size={14} />
            匯出本章 PDF
          </Link>
        )}
      </div>

      {visibleTopics.map((node) => (
        <TopicSection
          key={node.topic.id}
          node={node}
          depth={0}
          view={view}
          reveal={reveal}
          isLoggedIn={!!user}
          tablesByQuestion={tablesByQuestion}
          otherChaptersByQuestion={otherChaptersByQuestion}
          diseaseTagsByQuestion={diseaseTagsByQuestion}
          devMode={devMode}
        />
      ))}

      {chapterTables.length > 0 && (
        <details data-topic className="group mb-6">
          <summary className="-mx-2 flex cursor-pointer list-none items-center gap-2 rounded-btn border-b border-card-border px-2 py-2 transition-colors hover:bg-surface-hover/60">
            <ChevronRight
              size={16}
              className="shrink-0 text-muted transition-transform group-open:rotate-90"
            />
            <span className="text-xl font-bold text-subj-deep">本章相關比較表</span>
            <span className="text-xs text-muted">{chapterTables.length} 張</span>
          </summary>
          <div className="mt-2 ml-2 grid gap-2 border-l border-card-border pl-4 transition-colors md:grid-cols-2 hover:border-subj-mid">
            {chapterTables.map((t) => (
              <TableModalLink key={t.id} tableId={t.id} title={t.title} variant="card" />
            ))}
          </div>
        </details>
      )}

      {/* 比對不到主題的筆記卡掛在章節層，確保不會有卡片憑空消失 */}
      {content.orphanCards.length > 0 && (
        <details data-topic className="group mb-6">
          <summary className="-mx-2 flex cursor-pointer list-none items-center gap-2 rounded-btn border-b border-card-border px-2 py-2 transition-colors hover:bg-surface-hover/60">
            <ChevronRight
              size={16}
              className="shrink-0 text-muted transition-transform group-open:rotate-90"
            />
            <span className="text-xl font-bold text-subj-deep">其他筆記</span>
            <span className="text-xs text-muted">
              {content.orphanCards.length} 筆記
            </span>
          </summary>
          <div className="mt-2 ml-2 border-l border-card-border pl-4 transition-colors hover:border-subj-mid">
            {content.orphanCards.map((c) => (
              <NoteCard key={c.node_id} card={c} />
            ))}
          </div>
        </details>
      )}

      {visibleTopics.length === 0 &&
        content.orphanCards.length === 0 &&
        chapterTables.length === 0 && (
        <p className="text-sm text-muted">這個章節還沒有題目或筆記。</p>
      )}
    </div>
  );
}
