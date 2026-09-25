import indexJson from "@/data/knowledge/index.json";
import creditsJson from "@/data/knowledge/credits.json";
import questionMapJson from "@/data/knowledge/question-map.json";
import questionSlotsJson from "@/data/knowledge/question-slots.json";
import { ARTICLE_LOADERS } from "@/data/knowledge/loaders";
import type {
  ArticleSummary,
  ImageCredit,
  KnowledgeArticle,
  KnowledgeIndex,
  KnowledgePreview,
} from "./types";

// 索引只在 server 端使用:整包含所有段落摘要,不該送到瀏覽器。
// 需要的預覽資料由 page 挑出來、以 props 傳給 client component。
export const knowledgeIndex = indexJson as unknown as KnowledgeIndex;
export const imageCredits = creditsJson as unknown as Record<string, ImageCredit>;

interface QuestionMapEntry {
  auto?: string[];
  pinned?: string[];
  excluded?: string[];
}
interface QuestionSlot {
  qkey: string;
  tag: string | null;
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

export function getArticleSummaries(): ArticleSummary[] {
  return Object.values(knowledgeIndex.articles);
}

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
