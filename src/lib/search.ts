/** Shared URL, paging and matching rules for every search entry point. */
export const SEARCH_PAGE_SIZE = 15;
export const SEARCH_PREVIEW_SIZE = 5;
export const SEARCH_KNOWLEDGE_PREVIEW_SIZE = 2;
export const SEARCH_QUESTION_PREVIEW_SIZE = 4;
export const SEARCH_SCOPES = [
  { key: "all", label: "全部" },
  { key: "knowledge", label: "知識庫" },
  { key: "questions", label: "考古題" },
  { key: "notes", label: "章節筆記" },
  { key: "tables", label: "表格" },
] as const;
export type SearchScope = typeof SEARCH_SCOPES[number]["key"];
export const KNOWLEDGE_RESULT_KINDS = [
  { key: "all", label: "全部結果" },
  { key: "pages", label: "文章與段落" },
  { key: "tables", label: "表格" },
  { key: "body", label: "內文" },
] as const;
export type KnowledgeResultKind = typeof KNOWLEDGE_RESULT_KINDS[number]["key"];
export interface SearchState {
  q: string;
  scope: SearchScope;
  subject?: string;
  chapter?: string;
  type?: string;
  page?: number;
  from?: string;
  to?: string;
  resultKind?: KnowledgeResultKind;
}

export function searchParameters(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.scope !== "all") params.set("scope", state.scope);
  if (state.scope !== "knowledge") {
    if (state.subject) params.set("subject", state.subject);
    if (state.chapter) params.set("chapter", state.chapter);
    if ((state.scope === "all" || state.scope === "questions") && state.from) params.set("from", state.from);
    if ((state.scope === "all" || state.scope === "questions") && state.to) params.set("to", state.to);
  } else {
    if (state.type) params.set("type", state.type);
    if (state.resultKind && state.resultKind !== "all") params.set("result", state.resultKind);
  }
  if (state.page && state.page > 1) params.set("page", String(state.page));
  return params;
}

export function matchesKnowledgeResultKind(entry: { tableId?: string; b: string }, kind: KnowledgeResultKind, query: string): boolean {
  if (kind === "pages") return !entry.tableId;
  if (kind === "tables") return !!entry.tableId;
  if (kind === "body") return !!query.trim() && entry.b.toLowerCase().includes(query.trim().toLowerCase());
  return true;
}

export function searchHref(state: SearchState): string {
  const params = searchParameters(state);
  return `/search${params.size ? `?${params}` : ""}`;
}

export function pageNumber(raw: unknown): number {
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 100_000) : 1;
}

export function pageOf<T>(items: T[], requested: number, size = SEARCH_PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(requested, pages);
  return { items: items.slice((page - 1) * size, page * size), total: items.length, page, pages };
}

/** Quote the entire PostgREST value so commas/parentheses cannot become filters. */
export function searchFilter(columns: readonly string[], query: string): string {
  const pattern = `%${query.replace(/[\\%_]/g, (s) => `\\${s}`)}%`;
  const quoted = `"${pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  return columns.map((column) => `${column}.ilike.${quoted}`).join(",");
}

export function matchSnippet(text: string, query: string): [string, string, string] | null {
  const at = text.toLowerCase().indexOf(query.toLowerCase());
  if (at < 0 || !query) return null;
  const start = Math.max(0, at - 35);
  const end = Math.min(text.length, at + query.length + 55);
  return [(start ? "…" : "") + text.slice(start, at), text.slice(at, at + query.length), text.slice(at + query.length, end) + (end < text.length ? "…" : "")];
}

export function highlightParts(text: string, query: string): { text: string; match: boolean }[] {
  if (!query.trim()) return [{ text, match: false }];
  const parts: { text: string; match: boolean }[] = [];
  const lower = text.toLowerCase();
  const needle = query.toLowerCase();
  let cursor = 0;
  let at = lower.indexOf(needle);
  while (at >= 0) {
    if (at > cursor) parts.push({ text: text.slice(cursor, at), match: false });
    parts.push({ text: text.slice(at, at + query.length), match: true });
    cursor = at + query.length;
    at = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}

/** Only local search URLs can be used as a result's return destination. */
export function searchReturnHref(raw: string | null | undefined): string {
  return raw && /^\/search(?:\?|$)/.test(raw) && !/[\r\n\\]/.test(raw) ? raw : "/search";
}

export function withSearchReturn(href: string, state: SearchState): string {
  if (!href.startsWith("/tables/")) return href;
  return `${href}${href.includes("?") ? "&" : "?"}returnTo=${encodeURIComponent(searchHref(state))}`;
}

/** Inclusive sitting boundaries, preserving the separate makeup sitting. */
export function sittingSearchClause(from?: string, to?: string): string | null {
  const parts: string[] = [];
  if (from && /^\d{3}-\dm?$/.test(from)) {
    const key = from.replace(/m$/, "");
    parts.push(from.endsWith("m") ? `or(exam_sitting.gt.${key},and(exam_sitting.eq.${key},is_makeup.eq.true))` : `exam_sitting.gte.${key}`);
  }
  if (to && /^\d{3}-\dm?$/.test(to)) {
    const key = to.replace(/m$/, "");
    parts.push(to.endsWith("m") ? `exam_sitting.lte.${key}` : `or(exam_sitting.lt.${key},and(exam_sitting.eq.${key},is_makeup.eq.false))`);
  }
  return parts.length ? `and(${parts.join(",")})` : null;
}
