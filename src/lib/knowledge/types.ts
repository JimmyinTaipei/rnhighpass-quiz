// 對應 scripts/build-knowledge.mjs 的輸出格式。改其中一邊時兩邊要一起改。
import type { Root } from "hast";

export type KnowledgeCategory =
  | "disease"
  | "physiology"
  | "drug"
  | "lab"
  | "care"
  | "pathogen"
  | "admin"
  | "procedure";

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  disease: "疾病",
  physiology: "解剖&生理",
  drug: "藥物",
  lab: "檢驗",
  care: "護理主題",
  pathogen: "病原體",
  admin: "護理行政",
  procedure: "護理技術",
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
  /** 護理行政標籤(題庫 adm: 標籤),只有 admin 類型頁使用 */
  admTags?: string[];
  system: string;
  alsoIn: string[];
  group: string | null;
  reviewed: boolean;
  updated: string | null;
  references: KnowledgeReference[];
  /** 對到的分章題本段落,如「藥理-Ch10內分泌系統用藥 > 胰島素」 */
  chapters: string[];
  intro: Root;
  sections: KnowledgeSection[];
  embeds: Record<string, KnowledgeEmbed>;
}

/** 解剖&生理頁的小標籤(frontmatter field);擴充時同步 build-knowledge.mjs 的 FIELDS */
export type KnowledgeField = "anatomy" | "physiology" | "biochem";

export const FIELD_LABELS: Record<KnowledgeField, string> = {
  anatomy: "解剖",
  physiology: "生理",
  biochem: "生化",
};

export interface ArticleSummary {
  slug: string;
  title: string;
  subtitle: string | null;
  category: KnowledgeCategory;
  aliases: string[];
  dzTags: string[];
  /** 護理行政標籤(題庫 adm: 標籤),只有 admin 類型頁使用 */
  admTags?: string[];
  system: string;
  alsoIn: string[];
  group: string | null;
  field?: KnowledgeField | null;
  reviewed: boolean;
  chapters: string[];
  summary: string;
  sectionCount: number;
  /** 相關考題數(article-questions.json)，由 getArticleSummaries 合併進來 */
  examCount?: number;
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
  /** 疾病頁 → 相關的檢驗/藥物/病原體/生理頁(frontmatter related;沒寫的由內文連結推導) */
  related: Record<string, Record<RelatedKey, string[]>>;
  /** 有在 frontmatter 明確寫 related 的疾病頁(其餘是由內文連結推導) */
  relatedExplicit: string[];
  /** 檢驗/藥物/病原體/生理頁 → 用到它的疾病頁(related 的反向,自動產生) */
  usedBy: Record<string, string[]>;
}

export type RelatedKey = "lab" | "drug" | "pathogen" | "physiology";

/** 疾病頁「相關…」分組的順序與標題 */
export const RELATED_GROUPS: { key: RelatedKey; label: string }[] = [
  { key: "lab", label: "相關檢驗" },
  { key: "drug", label: "相關藥物" },
  { key: "pathogen", label: "相關病原體" },
  { key: "physiology", label: "相關解剖&生理" },
];

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

export type DomainKind = "system" | "cross" | "nursing";

/** 側欄「速查」列出的類型(/learn/type/[type])。description 是還沒有頁面時的「即將推出」說明 */
export const BROWSE_TYPES: { type: KnowledgeCategory; label: string; description?: string }[] = [
  { type: "drug", label: "藥理" },
  { type: "lab", label: "檢驗" },
  { type: "pathogen", label: "病原體" },
  {
    type: "procedure",
    label: "護理技術",
    description:
      "臨床護理技術(如無菌技術、抽痰、導尿、給藥、傷口護理),依用途分組，每頁整理目的、適應症、用物、步驟、注意事項、併發症與國考重點。內容整理中。",
  },
];

/** 跨系統的「小兒」:對象標記(不是 domain),彙整小兒專屬頁與含小兒區段的頁 */
export const PEDS_NAV = {
  href: "/learn/peds",
  label: "小兒",
  description:
    "彙整小兒專屬疾病(如兒童癌症、兒童呼吸道感染)與含小兒區段的頁面，依系統分組。頁面仍屬原本的器官系統，這裡只是另一種檢視。內容整理中。",
};

/**
 * 系統頁的類型(?type=<key>):chips 由左到右與區塊由上到下都是這個順序。
 * 「疾病」含疾病、護理主題、護理行政頁;病原體不在系統頁出現(走速查與疾病頁的 related)。
 */
export const SYSTEM_TYPE_CHIPS: { key: string; label: string; categories: KnowledgeCategory[] }[] = [
  { key: "physiology", label: "解剖&生理", categories: ["physiology"] },
  { key: "drug", label: "藥理", categories: ["drug"] },
  { key: "disease", label: "疾病", categories: ["disease", "care", "admin"] },
  { key: "lab", label: "檢驗", categories: ["lab"] },
  { key: "procedure", label: "技術", categories: ["procedure"] },
];

/** 頁面類型對應的系統頁 chip;病原體沒有 chip,回傳 null */
export function chipKeyOf(category: KnowledgeCategory): string | null {
  return SYSTEM_TYPE_CHIPS.find((c) => c.categories.includes(category))?.key ?? null;
}

export const DOMAIN_KIND_LABELS: Record<DomainKind, string> = {
  system: "系統",
  cross: "跨系統",
  nursing: "護理專業",
};

export interface TaxonomyGroup {
  id: string;
  name: string;
  type: KnowledgeCategory;
  /** 題庫 drug 標籤的同義詞 */
  drugTags: string[];
  count: number;
}

export interface TaxonomyDomain {
  id: string;
  name: string;
  kind: DomainKind;
  /** 系統頁的說明文字;還沒有頁面時也當作「即將推出」說明 */
  description: string | null;
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
