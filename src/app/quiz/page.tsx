import Link from "next/link";
import { getSubjects } from "@/lib/data";
import { groupSubjects } from "@/lib/subject-groups";

export default async function QuizPage() {
  const subjects = await getSubjects();
  const groups = groupSubjects(subjects);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-deep">測驗</h1>
      {groups.map((g) => (
        <section key={g.id} className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-deep">{g.label}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {g.subjects.map((s) => (
              <Link
                key={s.id}
                href={`/quiz/${s.id}`}
                className="rounded-card border border-card-border bg-card p-4 text-center font-medium text-body shadow-sm transition-colors hover:border-accent hover:text-accent"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
