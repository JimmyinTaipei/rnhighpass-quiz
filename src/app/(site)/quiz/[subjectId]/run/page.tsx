import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import {
  getChapters,
  getQuestionsForScope,
  getSubject,
  getUserAnswers,
  yearToSittingBounds,
} from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import { subjectGroup } from "@/lib/subject-groups";
import { knowledgeForQuestions } from "@/lib/knowledge/exam";
import { pillGray, pillSubject } from "@/lib/ui";

export default async function QuizRunPage(props: PageProps<"/quiz/[subjectId]/run">) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const subjectId = decodeURIComponent(params.subjectId);
  const user = await requireUser(`/quiz/${params.subjectId}`);

  const subject = await getSubject(subjectId);
  if (!subject) notFound();

  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

  // 章節 id 全部驗證過才用：只保留真的屬於這一科的，避免從 URL 帶別科的章節進來
  const ownChapters = await getChapters(subjectId);
  const ownIds = new Set(ownChapters.map((c) => c.id));
  const chapterIds = (str(searchParams.chapters) ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && ownIds.has(n));

  if (chapterIds.length === 0) notFound();

  const fromYear = Number(str(searchParams.from));
  const toYear = Number(str(searchParams.to));
  const bounds =
    Number.isFinite(fromYear) && Number.isFinite(toYear)
      ? yearToSittingBounds(fromYear, toYear)
      : {};
  const count = Number(str(searchParams.count));
  const order = str(searchParams.order) === "original" ? "original" : "random";
  // 題目來源：all 全部 / new 沒做過 / wrong 曾答錯(任何一次答錯都算)
  const poolParam = str(searchParams.pool);
  const pool = poolParam === "new" || poolParam === "wrong" ? poolParam : "all";

  const [devMode, history] = await Promise.all([
    getDevMode(),
    pool === "all" ? Promise.resolve([]) : getUserAnswers(),
  ]);
  const answered = new Set(history.map((a) => a.question_id));
  const wrong = new Set(history.filter((a) => !a.is_correct).map((a) => a.question_id));
  const questions = await getQuestionsForScope({
    chapterIds,
    ...bounds,
    limit: Number.isFinite(count) ? count : undefined,
    order,
    include:
      pool === "new" ? (id) => !answered.has(id) : pool === "wrong" ? (id) => wrong.has(id) : undefined,
  });
  const allPoolHref = (() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) if (typeof v === "string" && k !== "pool") p.set(k, v);
    return `/quiz/${params.subjectId}/run?${p}`;
  })();

  const scopeLabel =
    chapterIds.length === 1
      ? `${subject.name} / ${ownChapters.find((c) => c.id === chapterIds[0])?.chapter_no ?? ""} ${
          ownChapters.find((c) => c.id === chapterIds[0])?.title ?? ""
        }`
      : `${subject.name} / ${chapterIds.length} 章・${questions.length} 題`;

  return (
    <main
      data-group={subjectGroup(subject)}
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-8"
    >
      {questions.length === 0 ? (
        <div>
          <h1 className="mb-2 text-3xl font-bold text-subj-deep">沒有符合條件的題目</h1>
          <p className="mb-4 text-sm text-muted">
            {pool === "new"
              ? "這個範圍的題目你都做過了。"
              : pool === "wrong"
                ? "這個範圍裡沒有你答錯過的題目。"
                : "這個年份區間內，所選章節沒有題目。試著放寬年份或多選幾章。"}
          </p>
          <div className="flex flex-wrap gap-2">
            {pool !== "all" && (
              <Link href={allPoolHref} className={pillSubject}>
                改出全部題目
              </Link>
            )}
            <Link href={`/quiz/${params.subjectId}`} className={pillGray}>
              回到出題設定
            </Link>
          </div>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={scopeLabel}
          questions={questions}
          knowledgeByQuestion={knowledgeForQuestions(questions.map((q) => q.id))}
          isLoggedIn={!!user}
          devMode={devMode}
          reviewHref={`/quiz/${params.subjectId}`}
          reviewLabel="回到出題設定"
        />
      )}
    </main>
  );
}
