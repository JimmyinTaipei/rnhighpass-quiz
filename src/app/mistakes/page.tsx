import { QuestionCard } from "@/components/quiz/QuestionCard";
import { getCurrentUser, getQuestionsByIds, getUserAnswers } from "@/lib/data";
import { mistakeQuestionIds } from "@/lib/quiz-utils";

export default async function MistakesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold text-deep">錯題本</h1>
        <p className="text-muted">登入後才能記錄與查看錯題本。</p>
      </main>
    );
  }

  const answers = await getUserAnswers();
  const ids = mistakeQuestionIds(answers);
  const questions = await getQuestionsByIds(ids);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-deep">錯題本</h1>
      <p className="mb-6 text-sm text-muted">
        共 {questions.length} 題尚未答對，答錯自動收錄，答對後自動從清單移除。
      </p>
      {questions.length === 0 ? (
        <p className="text-muted">目前沒有錯題，繼續保持！</p>
      ) : (
        <div>
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} mode="mistakes" isLoggedIn />
          ))}
        </div>
      )}
    </main>
  );
}
