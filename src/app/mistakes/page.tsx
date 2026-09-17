import { QuestionCard } from "@/components/quiz/QuestionCard";
import {
  getAllChapters,
  getCurrentUser,
  getQuestionsByIds,
  getSubjects,
  getUserAnswers,
} from "@/lib/data";
import { groupMistakes, mistakeQuestionIds } from "@/lib/quiz-utils";

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
  const [questions, chapters, subjects] = await Promise.all([
    getQuestionsByIds(ids),
    getAllChapters(),
    getSubjects(),
  ]);
  const groups = groupMistakes(questions, answers, chapters, subjects);

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
          {groups.map((cat) => (
            <details
              key={cat.id}
              open
              className="mb-6 rounded-card border border-card-border bg-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-lg font-bold text-deep">
                <span>{cat.label}</span>
                <span className="text-sm font-normal text-muted">{cat.count} 題</span>
              </summary>
              <div className="px-4 pb-4">
                {cat.subjectGroups.map((sg) => (
                  <details key={sg.subjectId ?? "uncategorized"} open className="mb-3">
                    <summary className="cursor-pointer list-none py-2 font-semibold text-body">
                      {sg.subjectName}({sg.questions.length})
                    </summary>
                    <div className="pl-2">
                      {sg.questions.map((q) => (
                        <QuestionCard key={q.id} question={q} mode="mistakes" isLoggedIn />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
