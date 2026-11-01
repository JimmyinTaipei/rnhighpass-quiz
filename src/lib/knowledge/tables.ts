import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { readKnowledgeData } from "./data-files";
import { loadArticle } from "./index";

export interface KnowledgeTableRef {
  id: string;
  title: string;
  articleSlug: string;
  articleTitle: string;
  sectionId: string | null;
}

export const KNOWLEDGE_TABLE_ID_RE = /^kb-[a-z0-9][a-z0-9-]{0,115}$/;

let indexPromise: Promise<Record<string, KnowledgeTableRef> | null> | null = null;

/** Metadata lives in assets, rather than increasing the Worker bundle. */
export async function loadKnowledgeTableIndex() {
  indexPromise ??= readKnowledgeData<Record<string, KnowledgeTableRef>>("table-index.json");
  const index = await indexPromise;
  if (!index) indexPromise = null;
  return index;
}

export async function loadKnowledgeTable(id: string) {
  if (!KNOWLEDGE_TABLE_ID_RE.test(id)) return null;
  const ref = (await loadKnowledgeTableIndex())?.[id];
  if (!ref) return null;
  const article = await loadArticle(ref.articleSlug);
  if (!article) return null;
  let table: Element | null = null;
  const find = (root: Root) => visit(root, "element", (node) => {
    if (node.tagName === "table" && node.properties["data-table-id"] === id) table = node;
  });
  find(article.intro);
  const walk = (sections: typeof article.sections) => {
    for (const section of sections) {
      find(section.content);
      walk(section.children);
    }
  };
  walk(article.sections);
  if (!table) return null;
  const content: Root = { type: "root", children: [table] };
  return { ref, article, content };
}
