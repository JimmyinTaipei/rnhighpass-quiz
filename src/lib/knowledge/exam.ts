import articleQuestionsJson from "@/data/knowledge/article-questions.json";
import indexJson from "@/data/knowledge/index.json";

// 知識頁 ↔ 分章題本的考題統計(由 database/scripts/export_knowledge_questions.py 產生)。
// 跟 index.json 一樣只在 server 端使用:ids 整包送到瀏覽器沒有意義。

export interface ChapterPresence {
  /** 「章節全名 > H2(> H3)」,同 frontmatter 的 chapters */
  key: string;
  /** 這個段落裡跟本頁相關的題數 */
  count: number;
  /** 這個段落的總題數 */
  total: number;
}

export interface ArticleExamStats {
  /** 相關題數(跨段落去重) */
  total: number;
  ids: string[];
  chapters: ChapterPresence[];
}

const stats = articleQuestionsJson as unknown as Record<string, ArticleExamStats>;

export function examStatsFor(slug: string): ArticleExamStats | null {
  return stats[slug] ?? null;
}

export function examCountFor(slug: string): number {
  return stats[slug]?.total ?? 0;
}

const SEP = " > ";

export interface ChapterKeyParts {
  /** 章節全名,如「藥理-Ch10內分泌與新陳代謝藥物」 */
  fullTitle: string;
  /** 科目簡稱,如「藥理」 */
  subject: string;
  /** 如「Ch10」 */
  chapterNo: string;
  /** H2(與 H3)標題 */
  path: string[];
}

export function parseChapterKey(key: string): ChapterKeyParts {
  const [fullTitle, ...path] = key.split(SEP);
  const dash = fullTitle.indexOf("-");
  const subject = dash > 0 ? fullTitle.slice(0, dash) : fullTitle;
  const chapterNo = fullTitle.slice(dash + 1).match(/^Ch\d+/)?.[0] ?? "";
  return { fullTitle, subject, chapterNo, path };
}

/** 題目詳解底下「複習知識點」的一項 */
export interface KnowledgeRef {
  slug: string;
  title: string;
}

/** 每題最多列幾篇，避免總論型的頁面把詳解塞滿 */
const MAX_REFS = 3;

let byQuestion: Map<string, string[]> | null = null;

/**
 * 題號 → 相關知識頁(article-questions.json 反查)。
 * 範圍窄的頁面排前面(相關題少 = 主題更專一)：SGLT2 抑制劑比糖尿病更貼近那一題。
 * 回傳 plain object，才能當 props 傳給 client component。
 */
export function knowledgeForQuestions(ids: string[], exclude?: string): Record<string, KnowledgeRef[]> {
  if (!byQuestion) {
    byQuestion = new Map();
    const bySpecificity = Object.entries(stats).sort((a, b) => a[1].total - b[1].total);
    for (const [slug, s] of bySpecificity) {
      for (const id of s.ids) {
        const list = byQuestion.get(id);
        if (list) list.push(slug);
        else byQuestion.set(id, [slug]);
      }
    }
  }
  const titles = (indexJson as unknown as { articles: Record<string, { title: string }> }).articles;
  const out: Record<string, KnowledgeRef[]> = {};
  for (const id of ids) {
    const refs = (byQuestion.get(id) ?? [])
      .filter((slug) => slug !== exclude && titles[slug])
      .slice(0, MAX_REFS)
      .map((slug) => ({ slug, title: titles[slug].title }));
    if (refs.length > 0) out[id] = refs;
  }
  return out;
}
