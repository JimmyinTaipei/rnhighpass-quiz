import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import {
  getChapter,
  getQuestionsByTopicIds,
  getSubject,
  getTopics,
} from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import { knowledgeForQuestions } from "@/lib/knowledge/exam";

export default async function ChapterQuizPage(
  props: PageProps<"/chapters/[chapterId]/quiz">,
) {
  const [{ chapterId }, searchParams] = await Promise.all([props.params, props.searchParams]);
  // ?topic=<id>:只練某一節(考點地圖的「練這節」)，含它底下的子段落
  const topicParam = typeof searchParams.topic === "string" ? Number(searchParams.topic) : null;
  const user = await requireUser(
    `/chapters/${chapterId}/quiz${topicParam ? `?topic=${topicParam}` : ""}`,
  );
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  const [subject, topics, devMode] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
    getDevMode(),
  ]);

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
      <ChapterQuizRunner
        scopeLabel={`${subject?.name ?? ""} / ${chapter.chapter_no} ${chapter.title}${
          scopeTopic ? ` / ${scopeTopic.heading_text}` : ""
        }`}
        questions={orderedQuestions}
        knowledgeByQuestion={knowledgeForQuestions(orderedQuestions.map((q) => q.id))}
        isLoggedIn={!!user}
        devMode={devMode}
        reviewHref={`/chapters/${chapter.id}${scopeTopic ? `#topic-${scopeTopic.id}` : ""}`}
        reviewLabel="回到本章"
      />
    </main>
  );
}
