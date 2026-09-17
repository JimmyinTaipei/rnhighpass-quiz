import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import {
  getChapter,
  getCurrentUser,
  getQuestionsByTopicIds,
  getSubject,
  getTopics,
} from "@/lib/data";

export default async function ChapterQuizPage(
  props: PageProps<"/chapters/[chapterId]/quiz">,
) {
  const { chapterId } = await props.params;
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  const [subject, topics, user] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
    getCurrentUser(),
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
        chapter={chapter}
        subject={subject}
        questions={orderedQuestions}
        isLoggedIn={!!user}
      />
    </main>
  );
}
