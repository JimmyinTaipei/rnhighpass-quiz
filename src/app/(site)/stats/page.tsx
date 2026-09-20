import Link from "next/link";
import {
  getAllChapters,
  getQuestionsByIds,
  getUserAnswers,
} from "@/lib/data";
import { computeChapterStats } from "@/lib/quiz-utils";
import { requireUser } from "@/lib/auth";

export default async function StatsPage() {
  await requireUser("/stats");

  const answers = await getUserAnswers();
  const answeredIds = [...new Set(answers.map((a) => a.question_id))];
  const answeredQuestions = await getQuestionsByIds(answeredIds);
  const stats = computeChapterStats(answeredQuestions, answers).sort(
    (a, b) => b.answered - a.answered,
  );

  const chapters = await getAllChapters();
  const chapterById = new Map(chapters.map((c) => [c.id, c]));

  const totalAnswered = answers.length;
  const totalCorrect = answers.filter((a) => a.is_correct).length;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-deep">統計</h1>
      <p className="mb-6 text-sm text-muted">
        累計作答 {totalAnswered} 次，正確 {totalCorrect} 次。以下為各章節「已作答題目」的正確率。
      </p>

      {stats.length === 0 ? (
        <p className="text-muted">還沒有作答紀錄，去練習題目吧！</p>
      ) : (
        <div className="flex flex-col gap-2">
          {stats.map((s) => {
            const chapter = chapterById.get(s.chapterId);
            return (
              <Link
                key={s.chapterId}
                href={`/chapters/${s.chapterId}`}
                className="flex items-center justify-between rounded-card border border-card-border bg-card p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-body">
                    {chapter ? `${chapter.chapter_no} ${chapter.title}` : s.chapterId}
                  </p>
                  <p className="text-xs text-muted">
                    已答 {s.answered} 題，答對 {s.correct} 題
                  </p>
                </div>
                <span className="text-lg font-bold text-accent">{s.accuracy}%</span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
