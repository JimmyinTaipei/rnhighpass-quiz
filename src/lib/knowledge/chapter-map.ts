import type { Root } from "hast";
import outlineJson from "@/data/knowledge/chapter-outline.json";
import chapterMapJson from "@/data/knowledge/chapter-map.json";
import chapterPointsJson from "@/data/knowledge/chapter-points.json";
import { examStatsFor } from "./exam";
import { knowledgeIndex } from "./index";

// 章節頁「考點地圖」的資料:分章題本大綱(題數)、知識頁對照、考點精華。
// 全部是建置期產生的 JSON,只在 server 端使用。

interface OutlineH3 {
  title: string;
  count: number;
  block: boolean;
}
interface OutlineH2 {
  title: string;
  count: number;
  children: OutlineH3[];
}
interface OutlineChapter {
  fullTitle: string;
  count: number;
  topics: OutlineH2[];
}
interface Outline {
  separator: string;
  thresholds: { h2Split: number; h3Block: number };
  chapters: OutlineChapter[];
}

const outline = outlineJson as unknown as Outline;
const chapterMap = chapterMapJson as unknown as {
  map: Record<string, string[]>;
  chapters: Record<string, { missing: string[] }>;
};
const chapterPoints = chapterPointsJson as unknown as Record<string, Record<string, Root[]>>;

// 各章末尾的混合題集合，不是一個主題，地圖上不列
const SKIP = new Set(["綜合題型"]);

export interface MapArticle {
  slug: string;
  title: string;
  /** 這個段落裡跟該知識頁相關的題數 */
  count: number;
}

export interface MapBlock {
  /** 「章節全名 > H2(> H3)」 */
  key: string;
  title: string;
  /** topics.natural_key(「H2」或「H2>H3」)，用來對到 topic id */
  naturalKey: string;
  count: number;
  points: Root[];
  articles: MapArticle[];
  /** 題數達獨立門檻的 H3(只有 H2 會有) */
  children: MapBlock[];
}

export interface ChapterMapData {
  count: number;
  blocks: MapBlock[];
  /** 每個有題目的 H2 都有知識頁：可以預設顯示考點地圖 */
  fullyCovered: boolean;
  hasPoints: boolean;
}

function articlesFor(key: string): MapArticle[] {
  return (chapterMap.map[key] ?? [])
    .map((slug) => ({
      slug,
      title: knowledgeIndex.articles[slug]?.title ?? slug,
      count: examStatsFor(slug)?.chapters.find((c) => c.key === key)?.count ?? 0,
    }))
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "zh-Hant"));
}

export function chapterMapFor(fullTitle: string): ChapterMapData | null {
  const ch = outline.chapters.find((c) => c.fullTitle === fullTitle);
  if (!ch) return null;
  const sep = outline.separator;
  const points = chapterPoints[fullTitle] ?? {};

  const blocks: MapBlock[] = ch.topics
    .filter((h2) => !SKIP.has(h2.title) && h2.count > 0)
    .map((h2) => {
      const key = [fullTitle, h2.title].join(sep);
      return {
        key,
        title: h2.title,
        naturalKey: h2.title,
        count: h2.count,
        points: points[key] ?? [],
        articles: articlesFor(key),
        children: h2.children
          .filter((h3) => h3.block)
          .map((h3) => {
            const k3 = [key, h3.title].join(sep);
            return {
              key: k3,
              title: h3.title,
              naturalKey: `${h2.title}>${h3.title}`,
              count: h3.count,
              points: points[k3] ?? [],
              articles: articlesFor(k3),
              children: [],
            };
          }),
      };
    });

  return {
    count: ch.count,
    blocks,
    fullyCovered: (chapterMap.chapters[fullTitle]?.missing.length ?? 1) === 0,
    hasPoints: Object.keys(points).length > 0,
  };
}

/**
 * 考頻 1–5 級，依段落題數。切點取自全站 H2 題數分布(2026-09):
 * 中位數 11、第 75 百分位 23、第 90 百分位 40。
 */
export function frequencyLevel(count: number): number {
  if (count >= 40) return 5;
  if (count >= 23) return 4;
  if (count >= 11) return 3;
  if (count >= 5) return 2;
  return count > 0 ? 1 : 0;
}
