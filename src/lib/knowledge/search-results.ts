import type { KnowledgeCategory, KnowledgeIndex, SearchResult } from "./types";
import type { KnowledgeTableRef } from "./tables";

export interface KnowledgeSearchNode {
  key: string;
  title: string;
  order: number;
  hit?: SearchResult;
  children: KnowledgeSearchNode[];
}
export interface KnowledgeSearchGroup {
  slug: string;
  title: string;
  domain: string;
  category: KnowledgeCategory;
  articleHit?: SearchResult;
  matchCount: number;
  children: KnowledgeSearchNode[];
}

/** Group before paging; preserve article relevance and the article's section order. */
export function groupKnowledgeResults(results: SearchResult[], index: Pick<KnowledgeIndex, "articles" | "sections">, tables: Record<string, Pick<KnowledgeTableRef, "sectionId">> = {}): KnowledgeSearchGroup[] {
  const groups = new Map<string, KnowledgeSearchGroup>();
  const sectionsByPath = new Map<string, { key: string; order: number }>();
  const pathsByKey = new Map<string, string[]>();
  for (const [order, [key, section]] of Object.entries(index.sections).entries()) {
    const path = [...section.path, section.title];
    pathsByKey.set(key, path);
    sectionsByPath.set(JSON.stringify([key.split("#")[0], ...path]), { key, order });
  }
  const seen = new Set<string>();
  for (const result of results) {
    if (seen.has(result.k)) continue;
    seen.add(result.k);
    const slug = result.k.split("#")[0];
    const article = index.articles[slug];
    let group = groups.get(slug);
    if (!group) {
      group = { slug, title: article?.title ?? result.t, domain: article?.system ?? result.d, category: article?.category ?? result.c, matchCount: 0, children: [] };
      groups.set(slug, group);
    }
    group.matchCount += 1;
    if (result.k === slug) { group.articleHit = result; continue; }
    const tableSection = result.tableId ? tables[result.tableId]?.sectionId : null;
    const path = pathsByKey.get(result.tableId && tableSection ? `${slug}#${tableSection}` : result.k) ?? (result.tableId ? [] : [result.t]);
    let siblings = group.children;
    let sectionNode: KnowledgeSearchNode | undefined;
    for (let depth = 0; depth < path.length; depth++) {
      const pathKey = JSON.stringify([slug, ...path.slice(0, depth + 1)]);
      const metadata = sectionsByPath.get(pathKey);
      const key = metadata?.key ?? pathKey;
      sectionNode = siblings.find((node) => node.key === key);
      if (!sectionNode) {
        sectionNode = { key, title: path[depth], order: metadata?.order ?? Number.MAX_SAFE_INTEGER, children: [] };
        siblings.push(sectionNode);
      }
      siblings = sectionNode.children;
    }
    if (result.tableId) {
      const title = result.t.startsWith(`${group.title}｜`) ? result.t.slice(group.title.length + 1) : result.t;
      siblings.push({ key: result.k, title, order: (sectionNode?.order ?? -1) + 0.5, hit: result, children: [] });
    } else if (sectionNode) sectionNode.hit = result;
  }
  const sort = (nodes: KnowledgeSearchNode[]) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((node) => sort(node.children));
  };
  for (const group of groups.values()) sort(group.children);
  return [...groups.values()];
}

export function partitionKnowledgeTree(nodes: KnowledgeSearchNode[], limit = 3) {
  const keys: string[] = [];
  const collect = (list: KnowledgeSearchNode[]) => list.forEach((node) => { if (node.hit) keys.push(node.key); collect(node.children); });
  collect(nodes);
  const prune = (list: KnowledgeSearchNode[], allowed: Set<string>): KnowledgeSearchNode[] => list.flatMap((node) => {
    const children = prune(node.children, allowed);
    const hit = allowed.has(node.key) ? node.hit : undefined;
    return hit || children.length ? [{ ...node, hit, children }] : [];
  });
  return { preview: prune(nodes, new Set(keys.slice(0, limit))), remaining: prune(nodes, new Set(keys.slice(limit))), remainingCount: Math.max(0, keys.length - limit) };
}
