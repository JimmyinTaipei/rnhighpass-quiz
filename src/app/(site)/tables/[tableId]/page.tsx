import Link from "next/link";
import { FileDown } from "lucide-react";
import { notFound } from "next/navigation";
import { ComparisonTableView } from "@/components/tables/ComparisonTableView";
import { TableEditForm } from "@/components/admin/TableEditForm";
import { ReportButton } from "@/components/report/ReportButton";
import { getDevMode } from "@/lib/dev-mode";
import { getAllChapters, getQuestionsForTable, getSubjects, getTable } from "@/lib/data";
import { subjectGroup } from "@/lib/subject-groups";
import { Panel } from "@/components/ui/Panel";

export default async function TablePage(props: PageProps<"/tables/[tableId]">) {
  const { tableId } = await props.params;
  const table = await getTable(decodeURIComponent(tableId));
  if (!table) notFound();

  const [questions, chapters, subjects, devMode] = await Promise.all([
    getQuestionsForTable(table.id),
    getAllChapters(),
    getSubjects(),
    getDevMode(),
  ]);

  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const ownSubject = table.subject_id ? subjectById.get(table.subject_id) : undefined;
  const group = ownSubject ? subjectGroup(ownSubject) : undefined;

  // 引用這張表的題目分佈在哪些章節——這也是「跨章節」最直觀的證據
  const byChapter = new Map<number, number>();
  for (const q of questions) {
    if (q.primary_chapter_id == null) continue;
    byChapter.set(q.primary_chapter_id, (byChapter.get(q.primary_chapter_id) ?? 0) + 1);
  }
  const chapterRows = [...byChapter.entries()]
    .map(([id, count]) => ({ chapter: chapterById.get(id), count }))
    .filter((r) => r.chapter)
    .sort((a, b) => b.count - a.count);

  return (
    <main data-group={group} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 flex flex-col">
      <Panel className="flex-1">
      <p className="mb-1 text-sm text-muted">
        <Link href="/tables" className="hover:text-subj-deep">
          比較表
        </Link>{" "}
        / {table.scope === "shared" ? "跨科共用" : (ownSubject?.name ?? table.subject_id)}
      </p>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-subj-deep">{table.title}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/print/tables/${encodeURIComponent(table.id)}`}
            target="_blank"
            className="flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-subj-accent hover:text-subj-deep"
          >
            <FileDown size={12} />
            匯出 PDF
          </Link>
          <ReportButton tableId={table.id} targetLabel={`比較表：${table.title}`} variant="text" />
        </div>
      </div>

      {devMode && <TableEditForm key={table.edited_at ?? "orig"} table={table} />}
      <ComparisonTableView table={table} />

      {chapterRows.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-subj-deep">
            相關考題分佈・共 {questions.length} 題
          </h2>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {chapterRows.map(({ chapter, count }) => (
              <Link
                key={chapter!.id}
                href={`/chapters/${chapter!.id}`}
                className="flex items-center justify-between gap-2 rounded-card border border-card-border bg-page p-3 text-sm shadow-sm transition-colors hover:border-subj-accent"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-muted">
                    {subjectById.get(chapter!.subject_id)?.name ?? chapter!.subject_id}
                  </span>
                  <span className="block font-medium text-subj-deep">
                    {chapter!.chapter_no} {chapter!.title}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-subj-light px-2 py-0.5 text-xs font-medium text-subj-deep">
                  {count} 題
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Panel>
    </main>
  );
}
