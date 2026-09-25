import Link from "next/link";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import { getQuestionsByIds } from "@/lib/data";
import { shuffled } from "@/lib/quiz-utils";
import { requireUser } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import { parseNotebookSource, UNCATEGORIZED } from "@/lib/notebook";
import { idsForSubject, loadNotebookIndex } from "@/lib/notebook-data";
import { subjectGroup } from "@/lib/subject-groups";

export const metadata = { title: "重做題本 | 多保命" };

/**
 * 重做某一科的錯題或收藏。題目清單在 server 端依登入者身分重新計算，
 * URL 只帶「來源 + 科目」，不帶題目 id。
 */
export default async function ReviewPage(props: PageProps<"/quiz/review">) {
  const searchParams = await props.searchParams;
  const source = parseNotebookSource(
    typeof searchParams.source === "string" ? searchParams.source : undefined,
  );
  const subjectId = typeof searchParams.subject === "string" ? searchParams.subject : "";
  const user = await requireUser(
    `/quiz/review?source=${source}&subject=${encodeURIComponent(subjectId)}`,
  );

  const [index, devMode] = await Promise.all([loadNotebookIndex(source), getDevMode()]);
  const ids = subjectId ? idsForSubject(index, subjectId) : [];
  // 重做時打亂題目順序，避免照著清單順序背答案
  const questions = shuffled(await getQuestionsByIds(ids));

  const subject = index.subjects.find((s) => s.id === subjectId);
  const subjectName = subjectId === UNCATEGORIZED ? "未分類" : (subject?.name ?? "");
  const backHref = `/mistakes?tab=${source}&subject=${encodeURIComponent(subjectId)}`;

  return (
    <main
      data-group={subject ? subjectGroup(subject) : undefined}
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-8"
    >
      {questions.length === 0 ? (
        <div>
          <h1 className="mb-2 text-2xl font-bold text-subj-deep">沒有可以重做的題目</h1>
          <p className="mb-4 text-sm text-muted">這一科目前沒有{source === "mistakes" ? "錯題" : "收藏"}。</p>
          <Link
            href="/mistakes"
            className="rounded-btn bg-subj-accent px-4 py-2 text-sm font-medium text-on-accent"
          >
            回我的題本
          </Link>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={`${source === "mistakes" ? "重做錯題" : "重做收藏"} / ${subjectName}・${questions.length} 題`}
          questions={questions}
          isLoggedIn={!!user}
          devMode={devMode}
          reviewHref={backHref}
          mode={source === "mistakes" ? "mistakes" : "quiz"}
        />
      )}
    </main>
  );
}
