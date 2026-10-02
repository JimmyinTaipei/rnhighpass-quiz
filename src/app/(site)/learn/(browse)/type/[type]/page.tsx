import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { articlesOfType, taxonomy } from "@/lib/knowledge";
import { BROWSE_TYPES, type ArticleSummary } from "@/lib/knowledge/types";

function browseType(type: string) {
  return BROWSE_TYPES.find((t) => t.type === type);
}

export async function generateMetadata(props: PageProps<"/learn/type/[type]">): Promise<Metadata> {
  const { type } = await props.params;
  const t = browseType(type);
  return { title: t ? `${t.label}|知識庫` : "知識庫" };
}

const byTitle = (a: ArticleSummary, b: ArticleSummary) => a.title.localeCompare(b.title, "zh-Hant");

function CardGrid({ articles, showDraft }: { articles: ArticleSummary[]; showDraft: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} showDraft={showDraft} />
      ))}
    </div>
  );
}

/**
 * 依類型瀏覽(藥理、檢驗):跨所有分類列出同一類型的頁面,
 * 依主分類(taxonomy.yml 的順序)分區,區內再依群組(例:抗高血壓藥)分組。
 */
export default async function LearnTypePage(props: PageProps<"/learn/type/[type]">) {
  const { type } = await props.params;
  const t = browseType(type);
  if (!t) notFound();
  const articles = articlesOfType(t.type);
  const showDraft = await isAdmin();

  const sections = taxonomy.domains
    .map((d) => {
      const list = articles.filter((a) => a.system === d.id);
      const groups = d.groups.filter((g) => g.type === t.type);
      const grouped = groups
        .map((g) => ({ g, items: list.filter((a) => a.group === g.id).sort(byTitle) }))
        .filter((x) => x.items.length > 0);
      const ungrouped = list.filter((a) => !a.group || !groups.some((g) => g.id === a.group)).sort(byTitle);
      return { d, count: list.length, grouped, ungrouped };
    })
    .filter((s) => s.count > 0);

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>依類型</span>
      </nav>
      <h1 className="mb-1 text-3xl font-bold text-strong">{t.label}</h1>
      <p className="mb-6 text-sm text-muted">
        {articles.length} 篇・分佈在 {sections.length} 個分類
      </p>

      {articles.length === 0 && (
        <p className="rounded-card bg-card p-6 text-sm text-muted">此類型的內容即將加入。</p>
      )}

      {sections.map(({ d, count, grouped, ungrouped }) => (
        <section key={d.id} className="mb-8">
          <h2 className="mb-3 flex items-baseline gap-2 border-b border-card-border pb-1 text-xl font-bold text-deep">
            <Link href={`/learn/system/${d.id}`} className="hover:text-accent">
              {d.name}
            </Link>
            <span className="text-sm font-normal text-muted">{count}</span>
          </h2>
          {ungrouped.length > 0 && <CardGrid articles={ungrouped} showDraft={showDraft} />}
          {grouped.map(({ g, items }) => (
            <div key={g.id} id={`group-${g.id}`} className="mt-4 scroll-mt-4 first:mt-0">
              <h3 className="mb-2 text-base font-semibold text-strong">
                {g.name} <span className="text-sm font-normal text-muted">{items.length}</span>
              </h3>
              <CardGrid articles={items} showDraft={showDraft} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
