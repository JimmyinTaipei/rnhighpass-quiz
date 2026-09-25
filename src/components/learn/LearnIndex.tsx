"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  CATEGORY_LABELS,
  type ArticleSummary,
  type KnowledgeCategory,
} from "@/lib/knowledge/types";

const ORDER: KnowledgeCategory[] = ["disease", "physiology", "drug", "lab"];

export function LearnIndex({ articles }: { articles: ArticleSummary[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((a) =>
      [a.title, a.subtitle ?? "", ...a.aliases, a.summary].some((s) => s.toLowerCase().includes(needle)),
    );
  }, [articles, q]);

  return (
    <div>
      <label className="relative mb-6 block max-w-md">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋疾病、藥名、檢驗(可用英文,如 SGLT2、HbA1c)"
          className="w-full rounded-btn border border-card-border bg-card py-2 pr-3 pl-9 text-sm text-strong outline-none focus:border-accent"
        />
      </label>

      {ORDER.map((cat) => {
        const list = filtered
          .filter((a) => a.category === cat)
          .sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
        if (list.length === 0) return null;
        return (
          <section key={cat} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-deep">
              {CATEGORY_LABELS[cat]} <span className="text-sm font-normal text-muted">{list.length}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <Link
                  key={a.slug}
                  href={`/learn/${a.slug}`}
                  className="rounded-card border border-card-border bg-card p-4 shadow-sm transition-colors duration-150 hover:border-accent motion-reduce:transition-none"
                >
                  <p className="font-semibold text-deep">{a.title}</p>
                  {a.subtitle && <p className="text-sm text-body">{a.subtitle}</p>}
                  {a.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{a.summary}</p>}
                  <p className="mt-2 text-xs text-muted">
                    {a.sectionCount} 個知識點{!a.reviewed && "・草稿"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {filtered.length === 0 && <p className="text-sm text-muted">找不到符合「{q}」的知識頁。</p>}
    </div>
  );
}
