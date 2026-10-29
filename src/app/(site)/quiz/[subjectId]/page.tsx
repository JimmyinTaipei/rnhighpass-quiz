import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizScopeForm } from "@/components/quiz/QuizScopeForm";
import {
  getChapters,
  getExamSittings,
  getQuestionCountsByChapter,
  getSubject,
} from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { subjectGroup } from "@/lib/subject-groups";

export default async function QuizSubjectPage(props: PageProps<"/quiz/[subjectId]">) {
  const params = await props.params;
  const subjectId = decodeURIComponent(params.subjectId);
  await requireUser(`/quiz/${params.subjectId}`);

  const subject = await getSubject(subjectId);
  if (!subject) notFound();

  const chapters = await getChapters(subjectId);
  const [counts, sittings] = await Promise.all([
    getQuestionCountsByChapter(chapters.map((c) => c.id)),
    getExamSittings(),
  ]);

  return (
    <main
      data-group={subjectGroup(subject)}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"
    >
      <p className="mb-1 text-sm text-muted">
        <Link href="/quiz" className="hover:text-subj-deep">
          練習
        </Link>{" "}
        / {subject.name}
      </p>
      <h1 className="mb-6 text-3xl font-bold text-subj-deep">{subject.name}・出題設定</h1>

      <QuizScopeForm
        subjectId={params.subjectId}
        chapters={chapters}
        questionCounts={Object.fromEntries(counts)}
        sittings={sittings}
      />
    </main>
  );
}
