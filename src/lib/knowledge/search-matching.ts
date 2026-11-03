import { matchesKnowledgeResultKind, type KnowledgeResultKind } from "../search";
import type { SearchEntry, SearchResult } from "./types";

function snippet(text: string, position: number, length: number): [string, string, string] {
  const start = Math.max(0, position - 28);
  const end = Math.min(text.length, position + length + 28);
  return [(start ? "…" : "") + text.slice(start, position), text.slice(position, position + length), text.slice(position + length, end) + (end < text.length ? "…" : "")];
}

/** Parent article names and ancestor headings are location metadata, not hits. */
export function matchKnowledgeEntry(entry: SearchEntry, query: string, kind: KnowledgeResultKind = "all"): { rank: number; result: SearchResult } | null {
  const q = query.trim().toLowerCase();
  if (!q || !matchesKnowledgeResultKind(entry, kind, q)) return null;
  const isArticle = !entry.k.includes("#");
  // Generated table labels begin with the owning article; omit that prefix when matching.
  const ownTitle = entry.tableId && entry.t.startsWith(`${entry.s}｜`) ? entry.t.slice(entry.s.length + 1) : entry.t;
  const title = ownTitle.toLowerCase();
  const bodyPosition = entry.b.toLowerCase().indexOf(q);
  const aliasPosition = isArticle ? entry.s.toLowerCase().indexOf(q) : -1;
  let rank: number;
  if (title === q) rank = isArticle ? 0 : 4;
  else if (title.startsWith(q)) rank = isArticle ? 1 : 5;
  else if (title.includes(q)) rank = isArticle ? 2 : 6;
  else if (aliasPosition >= 0) rank = 3;
  else if (bodyPosition >= 0) rank = 7;
  else return null;
  const { b, ...metadata } = entry;
  return {
    rank,
    result: {
      ...metadata,
      snippet: bodyPosition >= 0 ? snippet(b, bodyPosition, q.length) : aliasPosition >= 0 && rank >= 2 ? snippet(entry.s, aliasPosition, q.length) : null,
    },
  };
}
