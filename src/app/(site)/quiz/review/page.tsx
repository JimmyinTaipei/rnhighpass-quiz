import Link from "next/link";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import { getQuestionsByIds } from "@/lib/data";
import { shuffled } from "@/lib/quiz-utils";
import { requireUser } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import { parseNotebookSource, UNCATEGORIZED } from "@/lib/notebook";
import { idsForSubject, loadNotebookIndex, loadReviewSchedule } from "@/lib/notebook-data";
import { subjectGroup } from "@/lib/subject-groups";
import { knowledgeForQuestions } from "@/lib/knowledge/exam";

export const metadata = { title: "重做題本 | 多保命" };

/** 今日複習一次最多出幾題(逾期最久的先出)，做完還有就再按一次 */
const DUE_LIMIT = 50;

/**
 * 重做某一科的錯題或收藏。題目清單在 server 端依登入者身分重新計算，
 * URL 只帶「來源 + 科目」，不帶題目 id。
 * source=due 是間隔複習的「今日複習」：跨科目，題目由作答紀錄排程(lib/spaced-review.ts)。
 */
export default async function ReviewPage(props: PageProps<"/quiz/review">) {
  const searchParams = await props.searchParams;
  if (searchParams.source === "due") return <DueReview />;
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
          <h1 className="mb-2 text-3xl font-bold text-subj-deep">沒有可以重做的題目</h1>
          <p className="mb-4 text-sm text-muted">這一科目前沒有{source === "mistakes" ? "錯題" : "收藏"}。</p>
          <Link
            href="/mistakes"
            className="rounded-btn bg-subj-mid px-4 py-2 text-sm font-semibold text-subj-ink"
          >
            回我的題本
          </Link>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={`${source === "mistakes" ? "重做錯題" : "重做收藏"} / ${subjectName}・${questions.length} 題`}
          questions={questions}
          knowledgeByQuestion={knowledgeForQuestions(questions.map((q) => q.id))}
          isLoggedIn={!!user}
          devMode={devMode}
          reviewHref={backHref}
          mode={source === "mistakes" ? "mistakes" : "quiz"}
        />
      )}
    </main>
  );
}

async function DueReview() {
  const user = await requireUser("/quiz/review?source=due");
  const [schedule, devMode] = await Promise.all([loadReviewSchedule(), getDevMode()]);
  const ids = schedule.due.slice(0, DUE_LIMIT).map((i) => i.questionId);
  const questions = shuffled(await getQuestionsByIds(ids));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      {questions.length === 0 ? (
        <div>
          <h1 className="mb-2 text-3xl font-bold text-strong">今天的複習都做完了</h1>
          <p className="mb-4 text-sm text-muted">
            {schedule.upcoming[0] ? `明天有 ${schedule.upcoming[0]} 題要複習。` : "錯題與收藏會依記憶間隔自動排進來。"}
          </p>
          <Link href="/" className="rounded-btn bg-mid px-4 py-2 text-sm font-semibold text-on-mid">
            回首頁
          </Link>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={`今日複習・${questions.length} 題${schedule.due.length > DUE_LIMIT ? `(共 ${schedule.due.length} 題到期)` : ""}`}
          questions={questions}
          knowledgeByQuestion={knowledgeForQuestions(questions.map((q) => q.id))}
          isLoggedIn={!!user}
          devMode={devMode}
          reviewHref="/"
          reviewLabel="回首頁"
          mode="review"
        />
      )}
    </main>
  );
}
