import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ArticleRow, ArticleRowList } from "@/components/learn/ArticleRow";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { OrganGroups } from "@/components/learn/OrganGroups";
import { articlesOfType, byExamCount, getDomain } from "@/lib/knowledge";
import { groupByOrgan } from "@/lib/knowledge/grouping";
import { BLOOD_GROUPS, BROWSE_TYPES, LAB_METHODS, type ArticleSummary } from "@/lib/knowledge/types";

function browseType(type: string) {
  return BROWSE_TYPES.find((t) => t.type === type);
}

export async function generateMetadata(props: PageProps<"/learn/type/[type]">): Promise<Metadata> {
  const { type } = await props.params;
  const t = browseType(type);
  return { title: t ? `${t.label}|知識庫` : "知識庫" };
}

const chipClass = (active: boolean) =>
  `rounded-full px-3 py-1 ${
    active ? "bg-deep text-on-accent" : "border border-card-border bg-card text-body hover:bg-surface-hover"
  }`;

/** 檢驗列:依題數排序,小標籤標出所屬系統(不依系統分組) */
function LabRows({ articles, showDraft }: { articles: ArticleSummary[]; showDraft: boolean }) {
  return (
    <ArticleRowList>
      {[...articles].sort(byExamCount).map((a) => (
        <ArticleRow key={a.slug} article={a} showDraft={showDraft} typeLabel={getDomain(a.system)?.name} />
      ))}
    </ArticleRowList>
  );
}

/**
 * 檢驗:上方 method chips(沒有「全部」;?method=,缺省或無效時選第一個有頁面的)。
 * 抽血再依 bloodGroup 分小標題(順序同 BLOOD_GROUPS,空的隱藏);其他方式是單一清單。
 */
function LabByMethod({
  articles,
  method,
  showDraft,
}: {
  articles: ArticleSummary[];
  method: string | null;
  showDraft: boolean;
}) {
  const methods = LAB_METHODS.filter((m) => articles.some((a) => a.method === m.key));
  const current = methods.find((m) => m.key === method) ?? methods[0];
  if (!current) return null;
  const list = articles.filter((a) => a.method === current.key);

  return (
    <>
      <nav aria-label="檢查方式" className="mb-6 flex flex-wrap gap-2 text-sm">
        {methods.map((m, i) => (
          <Link
            key={m.key}
            href={i === 0 ? "/learn/type/lab" : `/learn/type/lab?method=${m.key}`}
            scroll={false}
            aria-current={m.key === current.key ? "true" : undefined}
            className={chipClass(m.key === current.key)}
          >
            {m.label}
          </Link>
        ))}
      </nav>
      {current.key === "blood" ? (
        BLOOD_GROUPS.map((g) => {
          const sub = list.filter((a) => a.bloodGroup === g.key);
          if (sub.length === 0) return null;
          return (
            <section key={g.key} className="mb-6">
              <h2 className="mb-2 px-1 text-base font-bold text-deep">
                {g.label} <span className="text-sm font-normal text-muted">{sub.length}</span>
              </h2>
              <LabRows articles={sub} showDraft={showDraft} />
            </section>
          );
        })
      ) : (
        <LabRows articles={list} showDraft={showDraft} />
      )}
    </>
  );
}

/**
 * 速查(藥理、檢驗、病原體、護理技術)。
 * 檢驗依檢查方式(frontmatter method / bloodGroup)切換;其他類型依器官系統分組
 * (順序同側欄,最後是「一般」,規則見 lib/knowledge/grouping.ts),組內依相關題數。
 */
export default async function LearnTypePage(props: PageProps<"/learn/type/[type]">) {
  const [{ type }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const t = browseType(type);
  if (!t) notFound();
  const showDraft = await isAdmin();
  const articles = articlesOfType(t.type);
  const method = typeof searchParams.method === "string" ? searchParams.method : null;

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>速查</span>
      </nav>
      <h1 className="mb-1 text-3xl font-bold text-strong">{t.label}</h1>
      {articles.length > 0 && <p className="mb-6 text-sm text-muted">{articles.length} 篇</p>}

      {articles.length === 0 ? (
        <ComingSoon description={t.description} />
      ) : t.type === "lab" ? (
        <LabByMethod articles={articles} method={method} showDraft={showDraft} />
      ) : (
        <OrganGroups groups={groupByOrgan(articles, byExamCount)} showDraft={showDraft} />
      )}
    </div>
  );
}
