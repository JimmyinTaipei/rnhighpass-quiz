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
  system: string;
  alsoIn: string[];
  group: string | null;
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
  system: string;
  alsoIn: string[];
  group: string | null;
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

// ===== 分類(對應 content/knowledge/taxonomy.yml,由建置腳本輸出 taxonomy.json) =====

export type DomainKind = "system" | "cross" | "subject";

export const DOMAIN_KIND_LABELS: Record<DomainKind, string> = {
  system: "器官系統",
  cross: "跨系統主題",
  subject: "依科目",
};

export interface TaxonomyGroup {
  id: string;
  name: string;
  type: KnowledgeCategory;
  count: number;
}

export interface TaxonomyDomain {
  id: string;
  name: string;
  kind: DomainKind;
  blockTag: string | null;
  /** 以此為主系統的頁數 */
  primaryCount: number;
  /** 以此為次系統(alsoIn)的頁數 */
  alsoCount: number;
  groups: TaxonomyGroup[];
}

export interface Taxonomy {
  types: Record<KnowledgeCategory, string>;
  domains: TaxonomyDomain[];
}

/** 首頁搜尋索引的一筆:整篇文章(k = slug)或一個知識點(k = slug#id) */
export interface SearchEntry {
  k: string;
  /** 標題 */
  t: string;
  /** 副標與別名(文章)或麵包屑(知識點) */
  s: string;
  c: KnowledgeCategory;
  /** 主系統 */
  d: string;
  /** 知識點編號;文章沒有 */
  n?: string;
  /** 內文純文字(只在 server 端的全文搜尋使用) */
  b: string;
}

/** 搜尋結果:不帶整段內文,只帶命中片段(前文、命中字、後文) */
export type SearchResult = Omit<SearchEntry, "b"> & {
  snippet: [string, string, string] | null;
};
