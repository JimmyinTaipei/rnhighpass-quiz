import type { KnowledgeSection } from "@/lib/knowledge/types";

/** 目錄只需要的欄位(不帶 hast,才能便宜地傳給 client component) */
export interface TocNode {
  id: string;
  number: string;
  title: string;
  depth: number;
  children: TocNode[];
}

/**
 * 重點摘要底下的「國考常考點」(### {#exam-points})畫面上直接併進重點條列,沒有標題,
 * 所以也不進目錄。markdown 保留這個子標題,是為了嵌入藥物重點時能把國考點排除(見 ArticleRenderer)。
 */
export const isMergedExamPoints = (parent: KnowledgeSection, child: KnowledgeSection) =>
  parent.id === "summary" && child.id === "exam-points";

export function buildToc(sections: KnowledgeSection[]): TocNode[] {
  return sections.map((s) => ({
    id: s.id,
    number: s.number,
    title: s.title,
    depth: s.depth,
    children: buildToc(s.children.filter((c) => !isMergedExamPoints(s, c))),
  }));
}
