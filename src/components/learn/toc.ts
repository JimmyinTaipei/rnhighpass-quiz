import type { KnowledgeSection } from "@/lib/knowledge/types";

/** 目錄只需要的欄位(不帶 hast,才能便宜地傳給 client component) */
export interface TocNode {
  id: string;
  number: string;
  title: string;
  depth: number;
  children: TocNode[];
}

export function buildToc(sections: KnowledgeSection[]): TocNode[] {
  return sections.map((s) => ({
    id: s.id,
    number: s.number,
    title: s.title,
    depth: s.depth,
    children: buildToc(s.children),
  }));
}
