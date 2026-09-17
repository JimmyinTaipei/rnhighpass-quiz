import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { NoteCard } from "@/components/notes/NoteCard";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import {
  getCardsByChapter,
  getChapter,
  getCurrentUser,
  getQuestionsByTopicIds,
  getSubject,
  getTopics,
} from "@/lib/data";

export default async function ChapterPage(props: PageProps<"/chapters/[chapterId]">) {
  const { chapterId } = await props.params;
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) notFound();

  const chapter = await getChapter(chapterIdNum);
  if (!chapter) notFound();

  const [subject, topics, cards, user] = await Promise.all([
    getSubject(chapter.subject_id),
    getTopics(chapterIdNum),
    getCardsByChapter(chapterIdNum),
    getCurrentUser(),
  ]);

  const questions = await getQuestionsByTopicIds(topics.map((t) => t.id));
  const questionsByTopic = new Map<number, typeof questions>();
  for (const q of questions) {
    if (q.topic_id == null) continue;
    const list = questionsByTopic.get(q.topic_id) ?? [];
    list.push(q);
    questionsByTopic.set(q.topic_id, list);
  }
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <p className="mb-1 text-sm text-muted">
        <Link href="/subjects" className="hover:text-accent">
          科目
        </Link>{" "}
        /{" "}
        <Link href={`/subjects/${chapter.subject_id}`} className="hover:text-accent">
          {subject?.name}
        </Link>
      </p>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-deep">
        <BookOpen className="text-accent" />
        {chapter.chapter_no} {chapter.title}
      </h1>
      <p className="mb-4 text-sm text-muted">單頁捲動：筆記卡在上、相關考題緊接在下</p>

      {questions.length > 0 && (
        <Link
          href={`/chapters/${chapter.id}/quiz`}
          className="mb-8 inline-block rounded-btn bg-accent px-4 py-2 font-medium text-white transition-colors hover:opacity-90"
        >
          開始測驗
        </Link>
      )}

      {cards.length > 0 && (
        <section className="mb-10">
          {cards.map((c) => (
            <NoteCard key={c.node_id} card={c} />
          ))}
        </section>
      )}

      <div className="flex flex-col">
        {topics.map((topic) => {
          const topicQuestions = questionsByTopic.get(topic.id) ?? [];
          if (topicQuestions.length === 0) return null;
          return (
            <div key={topic.id} className="mb-10">
              <h2
                className={
                  topic.level === 2
                    ? "mb-4 border-b border-card-border pb-2 text-xl font-bold text-deep"
                    : "mb-3 pl-3 text-sm font-semibold text-muted"
                }
              >
                {topic.heading_text}
              </h2>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-card-border" />
                <span className="text-sm font-medium text-muted">
                  相關考題・共 {topicQuestions.length} 題
                </span>
                <div className="h-px flex-1 bg-card-border" />
              </div>
              <div>
                {topicQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} mode="chapter" isLoggedIn={!!user} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
