import { getDomain, taxonomy } from "./index";
import type { ArticleSummary, TaxonomyDomain } from "./types";

/** 「系統」組的 domain(順序同側欄);跨系統頁與速查頁依它分組 */
export function organDomains(): TaxonomyDomain[] {
  return taxonomy.domains.filter((d) => d.kind === "system");
}

/** 護理專業的 domain(基本護理、護理行政、社區衛生);分組時排在器官系統之後、「一般」之前 */
function nursingDomains(): TaxonomyDomain[] {
  return taxonomy.domains.filter((d) => d.kind === "nursing");
}

/**
 * 一篇頁面在「依系統分組」檢視中出現在哪些器官系統(空陣列 = 一般)。
 * - 主分類本身是器官系統或護理專業 → 就是它(例:臨終照護、疼痛護理 → 基本護理)。
 * - 感染(方案 B):alsoIn 裡所有器官系統都列,第一個是主要歸屬;病原體多半同時影響數個器官。
 * - 腫瘤與其他(規則 A):alsoIn 裡第一個器官系統。
 * 頁面只有一個家;重複出現只是檢視,內容不複製。
 */
export function organsOf(a: ArticleSummary): string[] {
  const organ = new Set(organDomains().map((d) => d.id));
  if (organ.has(a.system) || nursingDomains().some((d) => d.id === a.system)) return [a.system];
  const organs = a.alsoIn.filter((d) => organ.has(d));
  if (a.system === "infection") return organs;
  return organs.slice(0, 1);
}

export interface OrganGroup {
  id: string;
  name: string;
  items: { article: ArticleSummary; note?: string }[];
}

/** 依器官系統分組(順序同側欄),接著護理專業,沒有對應者放最後的「一般」;組內依 sort 排序 */
export function groupByOrgan(
  articles: ArticleSummary[],
  sort: (a: ArticleSummary, b: ArticleSummary) => number,
  noteFor?: (a: ArticleSummary) => string | undefined,
): OrganGroup[] {
  const groups: OrganGroup[] = [...organDomains(), ...nursingDomains(), { id: "general", name: "一般" }].map((d) => ({
    id: d.id,
    name: d.name,
    items: [],
  }));
  const byId = new Map(groups.map((g) => [g.id, g]));
  for (const a of [...articles].sort(sort)) {
    const organs = organsOf(a);
    if (organs.length === 0) {
      byId.get("general")!.items.push({ article: a, note: noteFor?.(a) });
      continue;
    }
    organs.forEach((id, k) => {
      // 列在多個器官時,非主要歸屬的那幾組標出主要歸屬
      const main = k > 0 ? `主要:${getDomain(organs[0])?.name ?? organs[0]}` : undefined;
      byId.get(id)?.items.push({ article: a, note: [noteFor?.(a), main].filter(Boolean).join("・") || undefined });
    });
  }
  return groups.filter((g) => g.items.length > 0);
}
