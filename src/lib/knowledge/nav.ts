import { articlesOfType, getArticleSummaries, questionCountOf, taxonomy } from "./index";
import { BROWSE_TYPES, DOMAIN_KIND_LABELS, PEDS_NAV, type ArticleSummary } from "./types";

/** 知識庫導覽的一項(側欄、手機「瀏覽分類」、/learn 首頁共用) */
export interface LearnNavEntry {
  href: string;
  name: string;
  /** 主要所屬在這裡的頁數(側欄顯示) */
  pages: number;
  /** 相關國考題數(題號聯集,首頁顯示) */
  questions: number;
  /** 還沒有任何頁面:淡色 +「即將推出」,點進去是說明頁 */
  soon: boolean;
}

export interface LearnNavGroup {
  label: string;
  entries: LearnNavEntry[];
}

/** 小兒檢視收錄的頁面。小兒標記(peds)待審閱確認後才有資料,目前一律為空 */
export function pedsArticles(): ArticleSummary[] {
  return [];
}

/** 四組,順序固定:系統 / 跨系統 / 速查 / 護理專業 */
export function learnNavGroups(): LearnNavGroup[] {
  const all = getArticleSummaries();
  const domainEntries = (kind: "system" | "cross" | "nursing"): LearnNavEntry[] =>
    taxonomy.domains
      .filter((d) => d.kind === kind)
      .map((d) => {
        const primary = all.filter((a) => a.system === d.id);
        return {
          href: `/learn/system/${d.id}`,
          name: d.name,
          pages: primary.length,
          questions: questionCountOf(primary),
          soon: d.primaryCount + d.alsoCount === 0,
        };
      });
  const peds = pedsArticles();
  return [
    { label: DOMAIN_KIND_LABELS.system, entries: domainEntries("system") },
    {
      label: DOMAIN_KIND_LABELS.cross,
      entries: [
        ...domainEntries("cross"),
        { href: PEDS_NAV.href, name: PEDS_NAV.label, pages: peds.length, questions: questionCountOf(peds), soon: peds.length === 0 },
      ],
    },
    {
      label: "速查",
      entries: BROWSE_TYPES.map((t) => {
        const list = articlesOfType(t.type);
        return {
          href: `/learn/type/${t.type}`,
          name: t.label,
          pages: list.length,
          questions: questionCountOf(list),
          soon: list.length === 0,
        };
      }),
    },
    { label: DOMAIN_KIND_LABELS.nursing, entries: domainEntries("nursing") },
  ];
}
