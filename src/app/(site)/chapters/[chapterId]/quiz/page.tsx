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

export default async function ChapterQuizPage(
  props: PageProps<"/chapters/[chapterId]/quiz">,
) {
  const { chapterId } = await props.params;
  const user = await requireUser(`/chapters/${chapterId}/quiz`);
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  const [subject, topics, devMode] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
    getDevMode(),
  ]);

  const questions = await getQuestionsByTopicIds(topics.map((t) => t.id));
  const byTopic = new Map<number, typeof questions>();
  for (const q of questions) {
    if (q.topic_id == null) continue;
    const list = byTopic.get(q.topic_id) ?? [];
    list.push(q);
    byTopic.set(q.topic_id, list);
  }
  const orderedQuestions = topics.flatMap((t) => byTopic.get(t.id) ?? []);

  if (orderedQuestions.length === 0) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <ChapterQuizRunner
        scopeLabel={`${subject?.name ?? ""} / ${chapter.chapter_no} ${chapter.title}`}
        questions={orderedQuestions}
        isLoggedIn={!!user}
        devMode={devMode}
      />
    </main>
  );
}
