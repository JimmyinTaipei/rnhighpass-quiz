import indexJson from "@/data/knowledge/index.json";
import creditsJson from "@/data/knowledge/credits.json";
import questionMapJson from "@/data/knowledge/question-map.json";
import questionSlotsJson from "@/data/knowledge/question-slots.json";
import taxonomyJson from "@/data/knowledge/taxonomy.json";
import searchJson from "@/data/knowledge/search.json";
import { ARTICLE_LOADERS } from "@/data/knowledge/loaders";
import { examCountFor, examStatsFor } from "./exam";
import type {
  ArticleSummary,
  ImageCredit,
  KnowledgeArticle,
  KnowledgeIndex,
  KnowledgePreview,
  KnowledgeCategory,
  RelatedKey,
  SearchEntry,
  SearchResult,
  Taxonomy,
  TaxonomyDomain,
  TaxonomyGroup,
} from "./types";
import { RELATED_GROUPS } from "./types";

// 索引只在 server 端使用:整包含所有段落摘要,不該送到瀏覽器。
// 需要的預覽資料由 page 挑出來、以 props 傳給 client component。
export const knowledgeIndex = indexJson as unknown as KnowledgeIndex;
export const imageCredits = creditsJson as unknown as Record<string, ImageCredit>;
export const taxonomy = taxonomyJson as unknown as Taxonomy;
const searchEntries = searchJson as unknown as SearchEntry[];

interface QuestionMapEntry {
  auto?: string[];
  pinned?: string[];
  excluded?: string[];
}
interface QuestionSlot {
  qkey: string;
  tag: string | null;
  drug: string[] | null;
  keyword: string | null;
  ids: string[];
  limit: number | null;
}
const questionMap = questionMapJson as Record<string, QuestionMapEntry>;
const questionSlots = new Map(
  (questionSlotsJson as QuestionSlot[]).map((s) => [s.qkey, s]),
);

export function getArticleSlugs(): string[] {
  return Object.keys(ARTICLE_LOADERS);
}

export async function loadArticle(slug: string): Promise<KnowledgeArticle | null> {
  const loader = ARTICLE_LOADERS[slug];
  return loader ? loader() : null;
}

let summaries: ArticleSummary[] | null = null;

export function getArticleSummaries(): ArticleSummary[] {
  summaries ??= Object.values(knowledgeIndex.articles).map((a) => ({
    ...a,
    examCount: examCountFor(a.slug),
  }));
  return summaries;
}

/** 考題多的在前，同題數依標題 */
export const byExamCount = (a: ArticleSummary, b: ArticleSummary) =>
  (b.examCount ?? 0) - (a.examCount ?? 0) || a.title.localeCompare(b.title, "zh-Hant");

/**
 * 一組頁面的相關國考題數:各頁題號的聯集(同一題被多頁引用只算一次),
 * 所以不等於各頁 examCount 相加。
 */
export function questionCountOf(articles: { slug: string }[]): number {
  const ids = new Set<string>();
  for (const a of articles) for (const id of examStatsFor(a.slug)?.ids ?? []) ids.add(id);
  return ids.size;
}

/** 系統頁「高頻」的門檻:相關國考題數 ≥ 此值 */
export const HIGH_FREQ_MIN = 20;

export function hrefFor(target: string): string {
  const [slug, id] = target.split("#");
  return id ? `/learn/${slug}#${id}` : `/learn/${slug}`;
}

export function previewFor(target: string): KnowledgePreview | null {
  const [slug, id] = target.split("#");
  if (!id) {
    const a = knowledgeIndex.articles[slug];
    if (!a) return null;
    return {
      key: target,
      href: hrefFor(target),
      title: a.title,
      number: null,
      articleTitle: a.title,
      path: [],
      summary: a.summary,
    };
  }
  const s = knowledgeIndex.sections[target];
  if (!s) return null;
  return {
    key: target,
    href: hrefFor(target),
    title: s.title,
    number: s.number,
    articleTitle: s.articleTitle,
    path: s.path,
    summary: s.summary,
  };
}

/** 某段落的考題 id:明寫的 ids ∪ 手動釘選 ∪ 自動比對 − 排除 */
export function questionIdsFor(qkey: string): string[] {
  const slot = questionSlots.get(qkey);
  const entry = questionMap[qkey] ?? {};
  const excluded = new Set(entry.excluded ?? []);
  const ids = [...(slot?.ids ?? []), ...(entry.pinned ?? []), ...(entry.auto ?? [])];
  return [...new Set(ids)].filter((id) => !excluded.has(id));
}

export function questionSlot(qkey: string): QuestionSlot | undefined {
  return questionSlots.get(qkey);
}

/** 疾病標籤頁用:哪些知識頁宣告了這個 dz 標籤 */
export function articlesForDiseaseTag(tag: string): ArticleSummary[] {
  return getArticleSummaries().filter((a) => a.dzTags.includes(tag));
}

// ===== 分類 =====

const domainById = new Map(taxonomy.domains.map((d) => [d.id, d]));
const groupById = new Map(
  taxonomy.domains.flatMap((d) => d.groups.map((g) => [g.id, g] as const)),
);

export function getDomain(id: string): TaxonomyDomain | undefined {
  return domainById.get(id);
}

export function getGroup(id: string | null): TaxonomyGroup | undefined {
  return id ? groupById.get(id) : undefined;
}

/** 某分類底下的頁面:主系統在此的,與以次系統身分出現的(標「也見於」) */
export function articlesInDomain(id: string): { primary: ArticleSummary[]; also: ArticleSummary[] } {
  const all = getArticleSummaries();
  return {
    primary: all.filter((a) => a.system === id),
    also: all.filter((a) => a.alsoIn.includes(id)),
  };
}

/** 疾病頁的相關頁面,依 RELATED_GROUPS 分組(空組不回傳),組內題數多的在前 */
export function relatedGroupsFor(slug: string): { key: RelatedKey; label: string; articles: ArticleSummary[] }[] {
  const rel = knowledgeIndex.related[slug];
  if (!rel) return [];
  return RELATED_GROUPS.map(({ key, label }) => ({
    key,
    label,
    articles: (rel[key] ?? [])
      .map((s) => summaryBySlug(s))
      .filter((a): a is ArticleSummary => !!a)
      .sort(byExamCount),
  })).filter((g) => g.articles.length > 0);
}

/** 檢驗/藥物/病原體/生理頁:用到它的疾病(related 的反向) */
export function usedByFor(slug: string): ArticleSummary[] {
  return (knowledgeIndex.usedBy[slug] ?? [])
    .map((s) => summaryBySlug(s))
    .filter((a): a is ArticleSummary => !!a)
    .sort(byExamCount);
}

function summaryBySlug(slug: string): ArticleSummary | undefined {
  return getArticleSummaries().find((a) => a.slug === slug);
}

/** 某類型(藥物、檢驗…)的所有頁面,跨所有分類 */
export function articlesOfType(type: KnowledgeCategory): ArticleSummary[] {
  return getArticleSummaries().filter((a) => a.category === type);
}

/** 同群組的其他頁(參見用) */
export function siblingArticles(article: { slug: string; group: string | null }): ArticleSummary[] {
  if (!article.group) return [];
  return getArticleSummaries()
    .filter((a) => a.group === article.group && a.slug !== article.slug)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
}

// ===== 全文搜尋(server 端;內容成長到上千個知識點也不必把全文送到瀏覽器) =====

const SEARCH_LIMIT = 60;
const SNIPPET_RADIUS = 28;

function snippetOf(text: string, pos: number, len: number): [string, string, string] {
  const start = Math.max(0, pos - SNIPPET_RADIUS);
  const end = Math.min(text.length, pos + len + SNIPPET_RADIUS);
  return [
    (start > 0 ? "…" : "") + text.slice(start, pos),
    text.slice(pos, pos + len),
    text.slice(pos + len, end) + (end < text.length ? "…" : ""),
  ];
}

/**
 * 排序:標題開頭符合 < 標題包含 < 別名/麵包屑 < 只有內文符合;同分時整篇文章在前。
 */
export function searchKnowledge(query: string, type: KnowledgeCategory | null): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: { rank: number; result: SearchResult }[] = [];
  for (const e of searchEntries) {
    if (type && e.c !== type) continue;
    const t = e.t.toLowerCase();
    const bodyPos = e.b.toLowerCase().indexOf(q);
    let rank: number;
    if (t.startsWith(q)) rank = 0;
    else if (t.includes(q)) rank = 1;
    else if (e.s.toLowerCase().includes(q)) rank = 2;
    else if (bodyPos >= 0) rank = 3;
    else continue;
    if (!e.k.includes("#")) rank -= 0.5;
    const { b, ...rest } = e;
    hits.push({
      rank,
      result: { ...rest, snippet: bodyPos >= 0 && rank >= 2 ? snippetOf(b, bodyPos, q.length) : null },
    });
  }
  return hits
    .sort((a, b) => a.rank - b.rank)
    .slice(0, SEARCH_LIMIT)
    .map((h) => h.result);
}
