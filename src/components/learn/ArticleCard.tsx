import Link from "next/link";
import { ExamPill } from "@/components/learn/ExamPill";
import { ExpandableSummary } from "@/components/learn/ExpandableSummary";
import type { ArticleSummary } from "@/lib/knowledge/types";

/**
 * 文章卡(疾病頁的相關藥理、檢驗等):標題連到該頁、右上題數膠囊、
 * summary 預設 3–4 行可展開(不離開頁面)。note 用來標主系統名稱
 */
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
    <div className="rounded-card bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-2">
        <Link href={`/learn/${article.slug}`} className="group min-w-0 flex-1">
          {/* 電腦版：中文標題不換行;英文放得下就接在右側，放不下自動掉到第二行(手機一律在第二行) */}
          <span className="block md:flex md:flex-wrap md:items-baseline md:gap-x-2">
            <span className="block text-[1.0625rem] font-semibold text-strong group-hover:text-deep group-hover:underline md:min-w-0 md:max-w-full md:truncate">
              {article.title}
            </span>
            {article.subtitle && <span className="block min-w-0 text-sm text-body md:max-w-full md:truncate">{article.subtitle}</span>}
          </span>
        </Link>
        <ExamPill count={article.examCount} />
      </div>
      {article.summary && <ExpandableSummary text={article.summary} />}
      <p className="mt-2 text-xs text-muted">
        {article.sectionCount} 個知識點
        {showDraft && !article.reviewed && "・草稿"}
        {groupLabel && `・${groupLabel}`}
        {note && `・${note}`}
      </p>
    </div>
  );
}
