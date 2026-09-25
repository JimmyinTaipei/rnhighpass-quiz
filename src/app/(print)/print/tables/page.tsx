import { notFound } from "next/navigation";
import { getAllChapters, getAllTables, getSubjects, getTableChapterCounts } from "@/lib/data";
import { placeTables, sectionsForSubject } from "@/lib/table-placement";
import { UNCATEGORIZED } from "@/lib/notebook";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { ComparisonTableView } from "@/components/tables/ComparisonTableView";

export const metadata = { title: "匯出比較表 | 多保命" };

/** 一次匯出某一科「主要歸屬」在該科的所有比較表，依章節排序 */
export default async function PrintSubjectTablesPage(props: PageProps<"/print/tables">) {
  const sp = await props.searchParams;
  const subjectId = typeof sp.subject === "string" ? sp.subject : "";
  if (!subjectId) notFound();

  const [tables, subjects, chapters, counts] = await Promise.all([
    getAllTables(),
    getSubjects(),
    getAllChapters(),
    getTableChapterCounts(),
  ]);
  const placed = placeTables(tables, counts, chapters, subjects);
  const sections = sectionsForSubject(placed, subjectId, chapters).filter((s) => s.primary.length > 0);
  const tableById = new Map(tables.map((t) => [t.id, t]));
  const name =
    subjectId === UNCATEGORIZED ? "跨科共用" : (subjects.find((s) => s.id === subjectId)?.name ?? subjectId);
  const total = sections.reduce((n, s) => n + s.primary.length, 0);

  return (
    <>
      <style>{`@page { size: A4 landscape; margin: 12mm; }`}</style>
      <PrintToolbar title={`匯出 PDF・${name}比較表 ${total} 張`} />
      <div className="mx-auto max-w-6xl px-4 py-6 print:max-w-none print:p-0">
        <h1 className="mb-4 text-xl font-bold text-deep">{name}・比較表</h1>
        {sections.map((s) => (
          <section key={s.chapterId ?? "none"} className="mb-6">
            <h2 className="mb-2 border-b border-card-border pb-1 font-bold text-deep">{s.label}</h2>
            <div className="space-y-5">
              {s.primary.map((ref) => {
                const t = tableById.get(ref.id);
                if (!t) return null;
                return (
                  <div key={t.id} className="break-inside-avoid">
                    <h3 className="mb-1.5 text-sm font-bold text-deep">{t.title}</h3>
                    <ComparisonTableView table={t} showReason={false} />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
