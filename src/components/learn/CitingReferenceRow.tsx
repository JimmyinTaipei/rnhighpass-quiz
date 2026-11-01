"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { CitingArticle } from "./SeeAlso";
import { ArticleRowLabel } from "./ArticleRowLabel";
import { hasPediatricContent, PediatricBadge } from "./PediatricBadge";

/** 文章入口與段落展開共用一行，展開後才占用下方空間 */
export function CitingReferenceRow({ article, showDraft = false }: { article: CitingArticle; showDraft?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const sections = article.places.filter((p) => p.number !== null);
  return (
    <li>
      <div className="flex items-start gap-1 px-3 hover:bg-surface-hover">
        <Link href={`/learn/${article.slug}`} className="flex min-w-0 flex-1 py-2">
          <ArticleRowLabel article={article} showDraft={showDraft} />
        </Link>
        {hasPediatricContent(article) && (
          <span className="flex shrink-0 items-center py-2">
            <PediatricBadge article={article} />
          </span>
        )}
        {sections.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            aria-label={`${open ? "收起" : "展開"}${article.title}的引用段落（${sections.length}）`}
            onClick={() => setOpen(!open)}
            className="flex shrink-0 items-center gap-1 px-2 py-2 text-sm text-muted hover:text-deep"
          >
            段落 {sections.length}
            <ChevronDown size={14} aria-hidden className={open ? "rotate-180" : ""} />
          </button>
        )}
      </div>
      {sections.length > 0 && (
        <ul id={id} hidden={!open} className="mx-3 mb-2 border-l border-card-border pl-3 text-sm">
          {sections.map((p) => (
            <li key={p.key}>
              <Link href={p.href} className="inline-block px-2 py-1 text-body hover:bg-surface-hover hover:text-deep">
                {p.number}{p.title}
              </Link>
              {p.embedded && <span className="ml-1 text-xs text-accent">嵌入</span>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
