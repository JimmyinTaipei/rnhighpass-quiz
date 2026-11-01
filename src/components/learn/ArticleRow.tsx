import Link from "next/link";
import { ExamPill } from "@/components/learn/ExamPill";
import type { ArticleSummary } from "@/lib/knowledge/types";
import { ArticleRowLabel } from "@/components/learn/ArticleRowLabel";
import { hasPediatricContent, PediatricBadge } from "@/components/learn/PediatricBadge";

export interface ArticleRowProps {
  article: ArticleSummary;
  /** 類型小標籤(「依考題數」混合清單用) */
  typeLabel?: string;
  /** 低調小字,例如「主分類:心臟血管」 */
  note?: string;
  /** 疾病列右側:明確 related 的藥物、檢驗數 */
  related?: { drug: number; lab: number } | null;
  /** 只有管理者看得到「草稿」 */
  showDraft?: boolean;
  /** 預設顯示考題數，相關內容清單可關閉 */
  showExamCount?: boolean;
  /** 延伸學習區使用無外框、較緊湊的列 */
  variant?: "default" | "reference";
}

/** 緊湊列:標題、一行英文名、右上題數膠囊;不顯示摘要。放在 <ArticleRowList> 裡 */
export function ArticleRow({ article, typeLabel, note, related, showDraft = false, showExamCount = true, variant = "default" }: ArticleRowProps) {
  const relatedText = related
    ? [related.drug > 0 && `${related.drug} 藥`, related.lab > 0 && `${related.lab} 檢驗`].filter(Boolean).join("・")
    : "";
  return (
    <li>
      <Link
        href={`/learn/${article.slug}`}
        className={`flex items-start gap-3 transition-colors duration-150 hover:bg-surface-hover motion-reduce:transition-none ${variant === "reference" ? "px-3 py-2" : "px-4 py-2.5"}`}
      >
        <ArticleRowLabel article={article} typeLabel={typeLabel} note={note} showDraft={showDraft} />
        {(showExamCount || relatedText || hasPediatricContent(article)) && (
          <span className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
            <span className="flex items-center gap-2">
              <PediatricBadge article={article} />
              {showExamCount && <ExamPill count={article.examCount} />}
            </span>
            {relatedText && <span className="text-xs text-muted">{relatedText}</span>}
          </span>
        )}
      </Link>
    </li>
  );
}

export function ArticleRowList({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "reference" }) {
  return <ul className={`divide-y divide-card-border ${variant === "reference" ? "" : "rounded-card bg-card"}`}>{children}</ul>;
}
