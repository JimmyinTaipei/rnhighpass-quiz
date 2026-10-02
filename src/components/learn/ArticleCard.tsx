import Link from "next/link";
import { ExamPill } from "@/components/learn/ExamPill";
import type { ArticleSummary } from "@/lib/knowledge/types";

/** 文章卡(疾病頁的相關卡片用):保留摘要,題數在右上膠囊。note 用來標主系統名稱 */
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
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-[17px] font-semibold text-strong">{article.title}</p>
        <ExamPill count={article.examCount} />
      </div>
      {article.subtitle && <p className="text-sm text-body">{article.subtitle}</p>}
      {article.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{article.summary}</p>}
      <p className="mt-2 text-xs text-muted">
        {article.sectionCount} 個知識點
        {showDraft && !article.reviewed && "・草稿"}
        {groupLabel && `・${groupLabel}`}
        {note && `・${note}`}
      </p>
    </Link>
  );
}
