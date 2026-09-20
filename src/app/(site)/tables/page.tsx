import Link from "next/link";
import { getAllTables, getSubjects } from "@/lib/data";
import { subjectGroup } from "@/lib/subject-groups";
import type { ComparisonTable } from "@/lib/types";

export const metadata = { title: "比較表 | 多保命" };

export default async function TablesPage() {
  const [tables, subjects] = await Promise.all([getAllTables(), getSubjects()]);

  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const shared = tables.filter((t) => t.scope === "shared");
  const bySubject = new Map<string, ComparisonTable[]>();
  for (const t of tables) {
    if (t.scope === "shared" || !t.subject_id) continue;
    const list = bySubject.get(t.subject_id) ?? [];
    list.push(t);
    bySubject.set(t.subject_id, list);
  }

  const card = (t: ComparisonTable) => (
    <Link
      key={t.id}
      href={`/tables/${encodeURIComponent(t.id)}`}
      className="rounded-card border border-card-border border-l-4 border-l-subj-accent bg-card p-3 text-sm font-medium text-subj-deep shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {t.title}
    </Link>
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-body">比較表</h1>
      <p className="mb-8 text-sm text-muted">
        共 {tables.length} 張，把容易混淆的考點整理成對照表。
      </p>

      {shared.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-subj-accent" />
            <h2 className="text-xl font-bold text-subj-deep">跨科共用</h2>
            <span className="text-sm text-muted">{shared.length} 張</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{shared.map(card)}</div>
        </section>
      )}

      {/* 依科目順序列出，並掛上該科的 data-group 讓顏色跟著換 */}
      {subjects.map((s) => {
        const list = bySubject.get(s.id);
        if (!list || list.length === 0) return null;
        return (
          <section key={s.id} data-group={subjectGroup(s)} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-subj-accent" />
              <h2 className="text-xl font-bold text-subj-deep">
                {subjectById.get(s.id)?.name ?? s.id}
              </h2>
              <span className="text-sm text-muted">{list.length} 張</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map(card)}</div>
          </section>
        );
      })}
    </main>
  );
}
