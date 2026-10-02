import Link from "next/link";
import { ExamPill } from "@/components/learn/ExamPill";
import { FIELD_LABELS, type ArticleSummary } from "@/lib/knowledge/types";

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
}

/** 緊湊列:標題、一行英文名、右上題數膠囊;不顯示摘要。放在 <ArticleRowList> 裡 */
export function ArticleRow({ article, typeLabel, note, related, showDraft = false }: ArticleRowProps) {
  const tags = [typeLabel, article.field ? FIELD_LABELS[article.field] : null].filter(Boolean);
  const peds = !!article.peds || (article.pedsSections?.length ?? 0) > 0;
  const meta = [note, showDraft && !article.reviewed ? "草稿" : null].filter(Boolean);
  const relatedText = related
    ? [related.drug > 0 && `${related.drug} 藥`, related.lab > 0 && `${related.lab} 檢驗`].filter(Boolean).join("・")
    : "";
  return (
    <li>
      <Link
        href={`/learn/${article.slug}`}
        className="flex items-start gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-surface-hover motion-reduce:transition-none"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-strong">{article.title}</span>
            {peds && (
              <span className="rounded-full bg-light px-1.5 text-xs font-medium text-deep" title="小兒專屬或含小兒段落">
                小兒
              </span>
            )}
            {tags.map((t) => (
              <span key={t} className="rounded bg-sidebar px-1.5 text-xs text-muted">
                {t}
              </span>
            ))}
          </span>
          {article.subtitle && <span className="block truncate text-sm text-body">{article.subtitle}</span>}
          {meta.length > 0 && <span className="block text-xs text-muted">{meta.join("・")}</span>}
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
          <ExamPill count={article.examCount} />
          {relatedText && <span className="text-xs text-muted">{relatedText}</span>}
        </span>
      </Link>
    </li>
  );
}

export function ArticleRowList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-card-border rounded-card bg-card">{children}</ul>;
}
