"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CATEGORY_LABELS,
  type KnowledgeCategory,
  type SearchResult,
  type TaxonomyDomain,
} from "@/lib/knowledge/types";

const TYPE_ORDER: KnowledgeCategory[] = ["disease", "care", "admin", "physiology", "pathogen", "drug", "lab", "procedure", "device"];

interface LearnIndexProps {
  domains: TaxonomyDomain[];
  /** 目前網址上的搜尋詞與類型;結果由 server 端全文搜尋算好傳進來 */
  query: string;
  type: KnowledgeCategory | null;
  results: SearchResult[];
  /** 沒有搜尋詞時顯示的內容(繼續閱讀與各分類清單,由 server 端組好) */
  children?: React.ReactNode;
}

function hrefOf(key: string) {
  const [slug, id] = key.split("#");
  return id ? `/learn/${slug}#${id}` : `/learn/${slug}`;
}

export function LearnIndex({ domains = [], query = "", type = null, results = [], children }: LearnIndexProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const domainName = useMemo(() => new Map(domains.map((d) => [d.id, d.name])), [domains]);

  // 搜尋框在 (browse)/layout.tsx 的 KnowledgeSearchBox;這裡只負責類型篩選與結果
  const navigate = (nextQ: string, nextType: KnowledgeCategory | null) => {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextType) params.set("type", nextType);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const searching = query.trim().length > 0;

  return (
    <div>

      {searching ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            {[null, ...TYPE_ORDER].map((t) => (
              <button
                key={t ?? "all"}
                type="button"
                onClick={() => navigate(query, t)}
                className={`rounded-full px-3 py-1 ${
                  type === t ? "bg-deep text-on-accent" : "border border-card-border bg-card text-body hover:bg-surface-hover"
                }`}
              >
                {t ? CATEGORY_LABELS[t] : "全部"}
              </button>
            ))}
          </div>
          {results.length === 0 ? (
            <p className="text-sm text-muted">找不到符合「{query}」的頁面或知識點。</p>
          ) : (
            <ul
              className={`divide-y divide-card-border rounded-card bg-card transition-opacity ${
                pending ? "opacity-60" : ""
              }`}
            >
              {results.map((e) => {
                const isArticle = !e.k.includes("#");
                return (
                  <li key={e.k}>
                    <Link href={hrefOf(e.k)} className="block px-4 py-2.5 hover:bg-surface-hover">
                      <span className="flex items-baseline gap-2">
                        <span className={isArticle ? "font-semibold text-deep" : "font-medium text-deep"}>
                          {e.n && <span className="mr-0.5 tabular-nums">{e.n}</span>}
                          {e.t}
                        </span>
                        <span className="shrink-0 rounded bg-sidebar px-1.5 text-xs text-muted">
                          {isArticle ? CATEGORY_LABELS[e.c] : "知識點"}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {isArticle ? [domainName.get(e.d), e.s].filter(Boolean).join("・") : e.s}
                      </span>
                      {e.snippet && (
                        <span className="mt-0.5 block text-sm text-body">
                          {e.snippet[0]}
                          <mark className="rounded bg-light px-0.5 text-deep">{e.snippet[1]}</mark>
                          {e.snippet[2]}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
