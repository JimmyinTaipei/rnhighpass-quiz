import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import {
  getChapters,
  getQuestionsForScope,
  getSubject,
  yearToSittingBounds,
} from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { subjectGroup } from "@/lib/subject-groups";

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

  const questions = await getQuestionsForScope({
    chapterIds,
    ...bounds,
    limit: Number.isFinite(count) ? count : undefined,
    order,
  });

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
          <h1 className="mb-2 text-2xl font-bold text-subj-deep">沒有符合條件的題目</h1>
          <p className="mb-4 text-sm text-muted">
            這個年份區間內，所選章節沒有題目。試著放寬年份或多選幾章。
          </p>
          <Link
            href={`/quiz/${params.subjectId}`}
            className="rounded-btn bg-subj-accent px-4 py-2 text-sm font-medium text-on-accent"
          >
            回到測驗設定
          </Link>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={scopeLabel}
          questions={questions}
          isLoggedIn={!!user}
        />
      )}
    </main>
  );
}
