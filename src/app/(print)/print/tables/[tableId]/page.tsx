import { notFound } from "next/navigation";
import { getTable } from "@/lib/data";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { ComparisonTableView } from "@/components/tables/ComparisonTableView";

export const metadata = { title: "匯出比較表 | 多保命" };

export default async function PrintTablePage(props: PageProps<"/print/tables/[tableId]">) {
  const { tableId } = await props.params;
  const table = await getTable(decodeURIComponent(tableId));
  if (!table) notFound();

  return (
    <>
      {/* 比較表欄位多，橫向比較放得下 */}
      <style>{`@page { size: A4 landscape; margin: 12mm; }`}</style>
      <PrintToolbar title={`匯出 PDF・${table.title}`} />
      <div className="mx-auto max-w-6xl px-4 py-6 print:max-w-none print:p-0">
        <h1 className="mb-3 text-xl font-bold text-deep">{table.title}</h1>
        <ComparisonTableView table={table} />
        <p className="mt-3 text-xs text-muted">多保命 護理國考題庫</p>
      </div>
    </>
  );
}
