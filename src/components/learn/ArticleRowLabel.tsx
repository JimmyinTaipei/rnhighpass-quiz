import { FIELD_LABELS, type ArticleSummary } from "@/lib/knowledge/types";

export type ArticleRowMetadata = Pick<ArticleSummary, "title" | "subtitle" | "field" | "peds" | "pedsSections" | "reviewed">;

/** 一般文章列與延伸學習引用列共用中英文、標籤及草稿呈現 */
export function ArticleRowLabel({ article, typeLabel, note, showDraft = false }: {
  article: ArticleRowMetadata;
  typeLabel?: string;
  note?: string;
  showDraft?: boolean;
}) {
  const tags = [typeLabel, article.field ? FIELD_LABELS[article.field] : null].filter(Boolean);
  const meta = [note, showDraft && !article.reviewed ? "草稿" : null].filter(Boolean);
  return (
    <span className="min-w-0 flex-1">
      {/* 桌面中英文可同行；手機英文另起一行 */}
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-semibold text-strong md:min-w-0 md:max-w-full md:truncate">{article.title}</span>
        <span className="flex min-w-0 max-w-full items-baseline gap-x-2">
          {tags.map((t) => (
            <span key={t} className="shrink-0 rounded bg-sidebar px-1.5 text-xs text-muted">{t}</span>
          ))}
          {article.subtitle && <span className="hidden min-w-0 truncate text-sm text-body md:block">{article.subtitle}</span>}
        </span>
      </span>
      {article.subtitle && <span className="block truncate text-sm text-body md:hidden">{article.subtitle}</span>}
      {meta.length > 0 && <span className="block text-xs text-muted">{meta.join("・")}</span>}
    </span>
  );
}
