import type { SectionSummary } from "./types";

/** 參見不列引用來源的重點摘要與其子段落；整頁引用仍保留 */
export function isSummaryReference(key: string, sections: Record<string, SectionSummary>): boolean {
  const [slug, id] = key.split("#");
  if (!id) return false;
  if (id === "summary") return true;
  const section = sections[key];
  const summary = sections[`${slug}#summary`];
  return !!section && !!summary && section.path.includes(summary.title);
}
