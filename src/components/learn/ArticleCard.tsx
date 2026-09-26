import Link from "next/link";
import type { ArticleSummary } from "@/lib/knowledge/types";

/** 知識庫清單用的文章卡。note 用來標「也見於」時的主系統名稱 */
export function ArticleCard({ article, note }: { article: ArticleSummary; note?: string }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="block rounded-card border border-card-border bg-card p-4 shadow-sm transition-colors duration-150 hover:border-accent motion-reduce:transition-none"
    >
      <p className="font-semibold text-deep">{article.title}</p>
      {article.subtitle && <p className="text-sm text-body">{article.subtitle}</p>}
      {article.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{article.summary}</p>}
      <p className="mt-2 text-xs text-muted">
        {article.sectionCount} 個知識點
        {!article.reviewed && "・草稿"}
        {note && `・${note}`}
      </p>
    </Link>
  );
}
