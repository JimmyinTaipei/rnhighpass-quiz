import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { articlesInDomain, byExamCount, getDomain } from "@/lib/knowledge";
import {
  CATEGORY_LABELS,
  DOMAIN_KIND_LABELS,
  type ArticleSummary,
  type KnowledgeCategory,
} from "@/lib/knowledge/types";

const TYPE_ORDER: KnowledgeCategory[] = ["disease", "care", "admin", "physiology", "pathogen", "drug", "lab"];

export async function generateMetadata(props: PageProps<"/learn/system/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const d = getDomain(id);
  return { title: d ? `${d.name}|知識庫` : "知識庫" };
}

const byTitle = (a: ArticleSummary, b: ArticleSummary) => a.title.localeCompare(b.title, "zh-Hant");

function CardGrid({ articles, note }: { articles: ArticleSummary[]; note?: (a: ArticleSummary) => string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} note={note?.(a)} />
      ))}
    </div>
  );
}

/**
 * 一個分類(器官系統 / 跨系統 / 科目)底下的所有頁面:
 * 依類型(疾病、生理、藥物、檢驗)分區,區內再依 taxonomy.yml 的群組分組。
 */
export default async function LearnSystemPage(props: PageProps<"/learn/system/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const domain = getDomain(id);
  if (!domain) notFound();
  const { primary, also } = articlesInDomain(id);
  const byExam = searchParams.sort === "exam";
  const order = byExam ? byExamCount : byTitle;

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>{DOMAIN_KIND_LABELS[domain.kind]}</span>
      </nav>
      <h1 className="mb-1 text-3xl font-bold text-strong">{domain.name}</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {primary.length} 篇{also.length > 0 && `・另有 ${also.length} 篇也與此相關`}
        </p>
        <nav aria-label="排序" className="segmented">
          {[
            { label: "依名稱", href: `/learn/system/${id}`, active: !byExam },
            { label: "依考題數", href: `/learn/system/${id}?sort=exam`, active: byExam },
          ].map((o) => (
            <Link
              key={o.label}
              href={o.href}
              scroll={false}
              aria-current={o.active ? "true" : undefined}
            >
              {o.label}
            </Link>
          ))}
        </nav>
      </div>

      {primary.length === 0 && also.length === 0 && (
        <p className="rounded-card bg-card p-6 text-sm text-muted">此分類的內容即將加入。</p>
      )}

      {TYPE_ORDER.map((type) => {
        const list = primary.filter((a) => a.category === type);
        if (list.length === 0) return null;
        const groups = domain.groups.filter((g) => g.type === type);
        const grouped = groups
          .map((g) => ({ g, items: list.filter((a) => a.group === g.id).sort(order) }))
          .filter((x) => x.items.length > 0);
        const ungrouped = list.filter((a) => !a.group || !groups.some((g) => g.id === a.group)).sort(order);

        return (
          <section key={type} className="mb-8">
            <h2 className="mb-3 border-b border-card-border pb-1 text-xl font-bold text-deep">
              {CATEGORY_LABELS[type]} <span className="text-sm font-normal text-muted">{list.length}</span>
            </h2>
            {ungrouped.length > 0 && <CardGrid articles={ungrouped} />}
            {grouped.map(({ g, items }) => (
              <div key={g.id} id={`group-${g.id}`} className="mt-4 scroll-mt-4 first:mt-0">
                <h3 className="mb-2 text-base font-semibold text-strong">
                  {g.name} <span className="text-sm font-normal text-muted">{items.length}</span>
                </h3>
                <CardGrid articles={items} />
              </div>
            ))}
          </section>
        );
      })}

      {also.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 border-b border-card-border pb-1 text-xl font-bold text-deep">
            也與此相關 <span className="text-sm font-normal text-muted">{also.length}</span>
          </h2>
          <CardGrid
            articles={[...also].sort(order)}
            note={(a) => `主分類:${getDomain(a.system)?.name ?? a.system}`}
          />
        </section>
      )}
    </div>
  );
}
