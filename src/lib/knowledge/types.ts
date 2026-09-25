// 對應 scripts/build-knowledge.mjs 的輸出格式。改其中一邊時兩邊要一起改。
import type { Root } from "hast";

export type KnowledgeCategory = "disease" | "physiology" | "drug" | "lab";

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  disease: "疾病",
  physiology: "生理機轉",
  drug: "藥物",
  lab: "檢驗",
};

export interface KnowledgeReference {
  title: string;
  url?: string;
  note?: string;
}

export interface KnowledgeSection {
  id: string;
  depth: number;
  /** 一、 / (一) / 1. / (1) */
  number: string;
  title: string;
  content: Root;
  children: KnowledgeSection[];
}

export interface KnowledgeEmbed {
  target: string;
  articleTitle: string;
  section: KnowledgeSection;
  /** 全站有幾處嵌入這一段 */
  embedCount: number;
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  subtitle: string | null;
  category: KnowledgeCategory;
  aliases: string[];
  dzTags: string[];
  reviewed: boolean;
  updated: string | null;
  references: KnowledgeReference[];
  intro: Root;
  sections: KnowledgeSection[];
  embeds: Record<string, KnowledgeEmbed>;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  subtitle: string | null;
  category: KnowledgeCategory;
  aliases: string[];
  dzTags: string[];
  reviewed: boolean;
  summary: string;
  sectionCount: number;
}

export interface SectionSummary {
  slug: string;
  id: string;
  number: string;
  title: string;
  articleTitle: string;
  /** 祖先段落標題(麵包屑) */
  path: string[];
  summary: string;
}

export interface KnowledgeIndex {
  articles: Record<string, ArticleSummary>;
  sections: Record<string, SectionSummary>;
  /** "slug#id" → 它連出去的目標("slug" 或 "slug#id") */
  links: Record<string, string[]>;
  /** 目標 → 連到它的段落 */
  backlinks: Record<string, string[]>;
  /** 被嵌入的段落 → 嵌入它的段落 */
  embeds: Record<string, string[]>;
}

/** 滑過預覽卡與側欄共用的資料 */
export interface KnowledgePreview {
  key: string;
  href: string;
  title: string;
  number: string | null;
  articleTitle: string;
  path: string[];
  summary: string;
}

export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl?: string;
  modified?: string;
}
