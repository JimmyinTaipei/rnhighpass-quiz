import Link from "next/link";
import { FileDown } from "lucide-react";
import { getAllChapters, getAllTables, getSubjects, getTableChapterCounts } from "@/lib/data";
import { subjectGroup } from "@/lib/subject-groups";
import { busiestSubject, UNCATEGORIZED } from "@/lib/notebook";
import { placeTables, sectionsForSubject, tableCountsBySubject } from "@/lib/table-placement";
import { Panel } from "@/components/ui/Panel";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";
import { TablesBrowser } from "@/components/tables/TablesBrowser";

export const metadata = { title: "比較表 | 多保命" };

export default async function TablesPage(props: PageProps<"/tables">) {
  const [searchParams, tables, subjects, chapters, counts] = await Promise.all([
    props.searchParams,
    getAllTables(),
    getSubjects(),
    getAllChapters(),
    getTableChapterCounts(),
  ]);

  const placed = placeTables(tables, counts, chapters, subjects);
  const countBySubject = tableCountsBySubject(placed);
  const requested = typeof searchParams.subject === "string" ? searchParams.subject : null;
  const subjectId =
    requested && (countBySubject.get(requested) ?? 0) > 0
      ? requested
      : (busiestSubject(countBySubject, subjects) ?? UNCATEGORIZED);
  const subject = subjects.find((s) => s.id === subjectId);
  const subjectName = (id: string) =>
    id === UNCATEGORIZED ? "跨科共用" : (subjects.find((s) => s.id === id)?.name ?? id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
      <Panel className="flex-1">
        <h1 className="mb-2 text-3xl font-bold text-body">比較表</h1>
        <p className="mb-6 text-sm text-muted">
          共 {tables.length} 張，依「最常出題的章節」歸類；其他相關章節會以
          <span className="mx-1 rounded border border-dashed border-card-border px-1">連結卡</span>
          連回主要位置。
        </p>
        <div className="mb-6 flex flex-col gap-3">
          <Link
            href={`/print/tables?subject=${encodeURIComponent(subjectId)}`}
            target="_blank"
            className="flex items-center gap-1 self-end rounded-btn border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-accent hover:text-deep"
          >
            <FileDown size={12} />
            匯出本科比較表 PDF
          </Link>
          <SubjectPicker
            subjects={subjects}
            counts={countBySubject}
            selected={subjectId}
            hrefFor={(id) => `/tables?subject=${encodeURIComponent(id)}`}
            unit="張"
          />
        </div>
        <div data-group={subject ? subjectGroup(subject) : undefined}>
          <TablesBrowser
            key={subjectId}
            subjectId={subjectId}
            sections={sectionsForSubject(placed, subjectId, chapters)}
            allTables={placed.map((t) => ({
              id: t.id,
              title: t.title,
              subjectId: t.subjectId,
              subjectName: subjectName(t.subjectId),
            }))}
          />
        </div>
      </Panel>
    </main>
  );
}
