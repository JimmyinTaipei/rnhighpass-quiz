import type { ArticleSummary } from "@/lib/knowledge/types";

type PediatricMetadata = Pick<ArticleSummary, "peds" | "pedsSections">;

export function hasPediatricContent(article: PediatricMetadata): boolean {
  return !!article.peds || (article.pedsSections?.length ?? 0) > 0;
}

/** 列右側的對象標記，與題數或引用段落控制並排 */
export function PediatricBadge({ article }: { article: PediatricMetadata }) {
  if (!hasPediatricContent(article)) return null;
  return (
    <span className="shrink-0 rounded-full bg-light px-1.5 text-xs font-medium text-deep" title="小兒專屬或含小兒段落">小兒</span>
  );
}
