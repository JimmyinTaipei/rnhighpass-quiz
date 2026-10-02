"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import {
  CATEGORY_LABELS,
  type ArticleSummary,
  type KnowledgeCategory,
  type SearchResult,
  type TaxonomyDomain,
} from "@/lib/knowledge/types";

const TYPE_ORDER: KnowledgeCategory[] = ["disease", "care", "admin", "physiology", "pathogen", "drug", "lab"];
const OVERVIEW_LIMIT = 12;
const DEBOUNCE_MS = 250;

interface LearnIndexProps {
  articles: ArticleSummary[];
  domains: TaxonomyDomain[];
  /** 目前網址上的搜尋詞與類型;結果由 server 端全文搜尋算好傳進來 */
  query: string;
  type: KnowledgeCategory | null;
  results: SearchResult[];
}

function hrefOf(key: string) {
  const [slug, id] = key.split("#");
  return id ? `/learn/${slug}#${id}` : `/learn/${slug}`;
}

export function LearnIndex({ articles = [], domains = [], query = "", type = null, results = [] }: LearnIndexProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(query);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const domainName = useMemo(() => new Map(domains.map((d) => [d.id, d.name])), [domains]);

  // 搜尋詞寫進網址(?q=),由 server 端比對全文;打字時稍等一下再送,避免每個字都查一次
  const navigate = (nextQ: string, nextType: KnowledgeCategory | null) => {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextType) params.set("type", nextType);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  const onChange = (value: string) => {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate(value, type), DEBOUNCE_MS);
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const searching = query.trim().length > 0;

  return (
    <div>
      <label className="relative mb-3 block max-w-xl">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜尋疾病、藥名、檢驗或知識點(如 Kussmaul、SGLT2、HbA1c)"
          className="w-full rounded-btn bg-fill py-2 pr-3 pl-9 text-[15px] text-strong outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40"
        />
      </label>

      {searching ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            {[null, ...TYPE_ORDER].map((t) => (
              <button
                key={t ?? "all"}
                type="button"
                onClick={() => navigate(q, t)}
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
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {domains
            .filter((d) => d.primaryCount > 0)
            .map((d) => {
              // 最常考的主題排前面：總覽只列前 OVERVIEW_LIMIT 篇，先讀高頻的
              const list = articles
                .filter((a) => a.system === d.id)
                .sort(
                  (a, b) =>
                    (b.examCount ?? 0) - (a.examCount ?? 0) ||
                    TYPE_ORDER.indexOf(a.category) - TYPE_ORDER.indexOf(b.category) ||
                    a.title.localeCompare(b.title, "zh-Hant"),
                );
              const counts = TYPE_ORDER.map((t) => [t, list.filter((a) => a.category === t).length] as const).filter(
                ([, n]) => n > 0,
              );
              return (
                <section key={d.id} className="rounded-card bg-card p-4 shadow-sm">
                  <Link href={`/learn/system/${d.id}`} className="group flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-deep group-hover:underline">{d.name}</h2>
                    <ArrowRight size={16} className="text-muted group-hover:text-deep" />
                  </Link>
                  <p className="mb-3 text-xs text-muted">
                    {counts.map(([t, n]) => `${CATEGORY_LABELS[t]} ${n}`).join("・")}
                    {d.alsoCount > 0 && `・另有 ${d.alsoCount} 篇相關`}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {list.slice(0, OVERVIEW_LIMIT).map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/learn/${a.slug}`}
                          className="inline-flex items-baseline gap-1 rounded-full bg-fill px-3 py-1 text-sm text-strong transition-colors hover:bg-light hover:text-deep"
                        >
                          {a.title}
                          {(a.examCount ?? 0) > 0 && (
                            <span className="text-xs tabular-nums text-muted">{a.examCount}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                    {list.length > OVERVIEW_LIMIT && (
                      <li>
                        <Link href={`/learn/system/${d.id}`} className="inline-block px-2 py-0.5 text-sm text-accent">
                          還有 {list.length - OVERVIEW_LIMIT} 篇 →
                        </Link>
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}
