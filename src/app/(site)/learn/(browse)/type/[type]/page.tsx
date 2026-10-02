import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { OrganGroups } from "@/components/learn/OrganGroups";
import { articlesOfType, byExamCount } from "@/lib/knowledge";
import { groupByOrgan } from "@/lib/knowledge/grouping";
import { ArticleRow, ArticleRowList } from "@/components/learn/ArticleRow";
import { BLOOD_GROUPS, BROWSE_TYPES, LAB_METHODS, type ArticleSummary } from "@/lib/knowledge/types";

function browseType(type: string) {
  return BROWSE_TYPES.find((t) => t.type === type);
}

export async function generateMetadata(props: PageProps<"/learn/type/[type]">): Promise<Metadata> {
  const { type } = await props.params;
  const t = browseType(type);
  return { title: t ? `${t.label}|知識庫` : "知識庫" };
}

function Rows({ articles, showDraft }: { articles: ArticleSummary[]; showDraft: boolean }) {
  return (
    <ArticleRowList>
      {[...articles].sort(byExamCount).map((a) => (
        <ArticleRow key={a.slug} article={a} showDraft={showDraft} />
      ))}
    </ArticleRowList>
  );
}

/** 檢驗「依方式」:五個 method 區塊全部展開;抽血區塊內再依 bloodGroup 分小標題。沒有頁面的區塊與小標題不顯示 */
function MethodSections({ articles, showDraft }: { articles: ArticleSummary[]; showDraft: boolean }) {
  return (
    <>
      {LAB_METHODS.map((m) => {
        const list = articles.filter((a) => a.method === m.key);
        if (list.length === 0) return null;
        return (
          <section key={m.key} className="mb-8">
            <h2 className="mb-3 border-b border-card-border pb-1 text-xl font-bold text-deep">
              {m.label} <span className="text-sm font-normal text-muted">{list.length}</span>
            </h2>
            {m.key === "blood" ? (
              BLOOD_GROUPS.map((g) => {
                const sub = list.filter((a) => a.bloodGroup === g.key);
                if (sub.length === 0) return null;
                return (
                  <div key={g.key} className="mb-4">
                    <h3 className="mb-2 px-1 text-base font-semibold text-strong">
                      {g.label} <span className="text-sm font-normal text-muted">{sub.length}</span>
                    </h3>
                    <Rows articles={sub} showDraft={showDraft} />
                  </div>
                );
              })
            ) : (
              <Rows articles={list} showDraft={showDraft} />
            )}
          </section>
        );
      })}
    </>
  );
}

/**
 * 速查(藥理、檢驗、病原體、護理技術):同一類型的頁面,依器官系統分組(順序同側欄,
 * 最後是「一般」),組內依相關題數。分組規則見 lib/knowledge/grouping.ts。
 * 檢驗另有「依方式」檢視(預設),依 frontmatter method / bloodGroup 分區。
 */
export default async function LearnTypePage(props: PageProps<"/learn/type/[type]">) {
  const [{ type }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const t = browseType(type);
  if (!t) notFound();
  // 檢驗頁另有「依方式|依系統」切換(?view=system;預設依方式,其他值忽略)
  const isLab = t.type === "lab";
  const byMethod = isLab && searchParams.view !== "system";
  const showDraft = await isAdmin();
  const articles = articlesOfType(t.type);
  const groups = groupByOrgan(articles, byExamCount);

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>速查</span>
      </nav>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-strong">{t.label}</h1>
        {isLab && articles.length > 0 && (
          <nav aria-label="檢視方式" className="segmented">
            {[
              { label: "依方式", href: "/learn/type/lab", active: byMethod },
              { label: "依系統", href: "/learn/type/lab?view=system", active: !byMethod },
            ].map((o) => (
              <Link key={o.label} href={o.href} scroll={false} aria-current={o.active ? "true" : undefined}>
                {o.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      {articles.length > 0 && <p className="mb-6 text-sm text-muted">{articles.length} 篇</p>}

      {articles.length === 0 ? (
        <ComingSoon description={t.description} />
      ) : byMethod ? (
        <MethodSections articles={articles} showDraft={showDraft} />
      ) : (
        <OrganGroups groups={groups} showDraft={showDraft} />
      )}
    </div>
  );
}
