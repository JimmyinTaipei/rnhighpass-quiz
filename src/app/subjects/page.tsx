import Link from "next/link";
import { getSubjects } from "@/lib/data";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-deep">科目</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {subjects.map((s) => (
          <Link
            key={s.id}
            href={`/subjects/${s.id}`}
            className="rounded-card border border-card-border bg-card p-4 text-center font-medium text-body shadow-sm transition-colors hover:border-accent hover:text-accent"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
