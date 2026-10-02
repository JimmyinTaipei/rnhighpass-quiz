import Link from "next/link";
import type { ArticleSummary } from "@/lib/knowledge/types";

/** 知識庫清單用的文章卡。note 用來標「也見於」時的主系統名稱 */
export function ArticleCard({
  article,
  note,
  groupLabel,
  showDraft = false,
}: {
  article: ArticleSummary;
  note?: string;
  /** 群組名稱(例:抗高血壓藥),顯示成小標籤 */
  groupLabel?: string;
  /** 只有管理者看得到「草稿」 */
  showDraft?: boolean;
}) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="block rounded-card bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-150 hover:shadow-md active:opacity-70 motion-reduce:transition-none"
    >
      <p className="text-[17px] font-semibold text-strong">{article.title}</p>
      {article.subtitle && <p className="text-sm text-body">{article.subtitle}</p>}
      {article.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{article.summary}</p>}
      <p className="mt-2 text-xs text-muted">
        {(article.examCount ?? 0) > 0 && (
          <span className="font-medium text-deep tabular-nums">{article.examCount} 題・</span>
        )}
        {article.sectionCount} 個知識點
        {showDraft && !article.reviewed && "・草稿"}
        {groupLabel && `・${groupLabel}`}
        {note && `・${note}`}
      </p>
    </Link>
  );
}
