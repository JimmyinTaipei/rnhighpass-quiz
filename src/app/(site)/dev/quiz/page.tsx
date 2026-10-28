import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import {
  getChapter,
  getQuestionsByTopicIds,
  getSubject,
  getTopics,
} from "@/lib/data";
import { knowledgeForQuestions } from "@/lib/knowledge/exam";

/**
 * 開發用作答頁預覽：/dev/quiz?chapter=411(&topic=<id>)
 *
 * 只在 next dev 存在，上線版本一律 404。用真實題目載入同一個 ChapterQuizRunner，
 * 但固定 isLoggedIn={false}：runner 未登入時不寫 user_answers，所以不用登入、
 * 也不會動到任何人的作答紀錄。給截圖與改 UI 時檢查作答頁用(docs/ui-audit-2026-10-28.md)。
 */
export default async function DevQuizPreviewPage(props: PageProps<"/dev/quiz">) {
  if (process.env.NODE_ENV !== "development") notFound();

  const searchParams = await props.searchParams;
  const chapterIdNum = Number(typeof searchParams.chapter === "string" ? searchParams.chapter : 411);
  const topicParam = typeof searchParams.topic === "string" ? Number(searchParams.topic) : null;
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  const [subject, topics] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
  ]);

  // 題目範圍與排序比照 chapters/[chapterId]/quiz
  const scopeTopic = topicParam ? topics.find((t) => t.id === topicParam) : undefined;
  const scopeTopics = scopeTopic
    ? topics.filter((t) => t.id === scopeTopic.id || t.parent_topic_id === scopeTopic.id)
    : topics;
  const questions = await getQuestionsByTopicIds(scopeTopics.map((t) => t.id));
  const byTopic = new Map<number, typeof questions>();
  for (const q of questions) {
    if (q.topic_id == null) continue;
    const list = byTopic.get(q.topic_id) ?? [];
    list.push(q);
    byTopic.set(q.topic_id, list);
  }
  const orderedQuestions = scopeTopics.flatMap((t) => byTopic.get(t.id) ?? []);

  if (orderedQuestions.length === 0) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <p className="mb-3 rounded-btn bg-warning/10 px-3 py-1.5 text-xs text-warning">
        開發用預覽：不登入、不記錄作答
      </p>
      <ChapterQuizRunner
        scopeLabel={`${subject?.name ?? ""} / ${chapter.chapter_no} ${chapter.title}${
          scopeTopic ? ` / ${scopeTopic.heading_text}` : ""
        }`}
        questions={orderedQuestions}
        knowledgeByQuestion={knowledgeForQuestions(orderedQuestions.map((q) => q.id))}
        isLoggedIn={false}
        reviewHref={`/chapters/${chapter.id}${scopeTopic ? `#topic-${scopeTopic.id}` : ""}`}
        reviewLabel="回到本章"
      />
    </main>
  );
}
