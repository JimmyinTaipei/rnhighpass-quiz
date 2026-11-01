import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderHast } from "@/components/learn/ArticleRenderer";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { loadKnowledgeTable, loadKnowledgeTableIndex } from "@/lib/knowledge/tables";

export const dynamic = "force-static";
export const dynamicParams = false;

type Props = { params: Promise<{ tableId: string }> };

export async function generateStaticParams() {
  const index = await loadKnowledgeTableIndex();
  if (!index) throw new Error("缺少知識表格索引，請先執行 knowledge:build");
  return Object.keys(index).map((tableId) => ({ tableId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tableId } = await params;
  const ref = (await loadKnowledgeTableIndex())?.[tableId];
  return { title: ref ? `${ref.title} | 多保命` : "表格不存在 | 多保命" };
}

export default async function KnowledgeTablePage({ params }: Props) {
  const { tableId } = await params;
  const table = await loadKnowledgeTable(tableId);
  if (!table) notFound();
  const { ref, article, content } = table;
  const sourceHref = `/learn/${ref.articleSlug}${ref.sectionId ? `#${ref.sectionId}` : ""}`;

  return (
    <main className="on-white mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <h1 className="min-w-0 text-2xl font-bold text-deep">{ref.title}</h1>
        <FavoriteButton questionId={tableId} kind="table" label="這張表格" className="kb-table-favorite shrink-0" />
      </div>
      <p className="mt-2 text-sm text-body">
        來源：<Link href={sourceHref} className="text-accent hover:underline">{ref.articleTitle}</Link>
      </p>
      <div className="kb-prose">
        {renderHast(content, {
          article,
          questions: new Map(),
          tablesByQuestion: new Map(),
          otherChaptersByQuestion: new Map(),
          diseaseTagsByQuestion: new Map(),
          isLoggedIn: false,
          devMode: false,
          editSlug: null,
          embedDepth: 0,
          tableStandalone: true,
        })}
      </div>
    </main>
  );
}
