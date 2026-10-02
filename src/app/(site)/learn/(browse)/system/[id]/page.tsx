import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { articlesInDomain, byExamCount, getDomain, getGroup, HIGH_FREQ_MIN } from "@/lib/knowledge";
import { DOMAIN_KIND_LABELS, SYSTEM_TYPE_CHIPS, type ArticleSummary } from "@/lib/knowledge/types";

export async function generateMetadata(props: PageProps<"/learn/system/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const d = getDomain(id);
  return { title: d ? `${d.name}|知識庫` : "知識庫" };
}

function CardGrid({
  articles,
  note,
  showDraft,
}: {
  articles: ArticleSummary[];
  note?: (a: ArticleSummary) => string;
  showDraft: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} note={note?.(a)} groupLabel={getGroup(a.group)?.name} showDraft={showDraft} />
      ))}
    </div>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <h2 className="mb-3 border-b border-card-border pb-1 text-xl font-bold text-deep">
      {title} <span className="text-sm font-normal text-muted">{count}</span>
    </h2>
  );
}

/**
 * 一個系統(或護理專業科目)底下的所有頁面。
 * 上方用 ?type= 篩選類型(與「跨系統速查」同一份資料,只做 filter);
 * 清單依相關國考題數排序,題數 ≥ HIGH_FREQ_MIN 的列為「高頻」,其餘為「其他」。
 * 沒有任何一篇達標(或全部達標)時不分段,直接單一清單。
 */
export default async function LearnSystemPage(props: PageProps<"/learn/system/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const domain = getDomain(id);
  if (!domain) notFound();
  const showDraft = await isAdmin();
  const { primary, also } = articlesInDomain(id);

  // 護理專業(基護、行政、社區)全是護理主題與行政頁,不套用類型篩選
  const showChips = domain.kind === "system";
  const rawType = typeof searchParams.type === "string" ? searchParams.type : null;
  const chip = showChips ? SYSTEM_TYPE_CHIPS.find((c) => c.key === rawType) ?? null : null;
  const inChip = (a: ArticleSummary) => !chip || chip.categories.includes(a.category);
  const list = primary.filter(inChip).sort(byExamCount);
  const alsoList = also.filter(inChip).sort(byExamCount);

  const chipOptions = [
    { key: null, label: "全部", n: primary.length + also.length },
    ...SYSTEM_TYPE_CHIPS.map((c) => ({
      key: c.key,
      label: c.label,
      n: [...primary, ...also].filter((a) => c.categories.includes(a.category)).length,
    })).filter((c) => c.n > 0),
  ];

  const high = list.filter((a) => (a.examCount ?? 0) >= HIGH_FREQ_MIN);
  const rest = list.filter((a) => (a.examCount ?? 0) < HIGH_FREQ_MIN);
  const split = high.length > 0 && rest.length > 0;

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
      {domain.description && (primary.length > 0 || also.length > 0) && (
        <p className="mb-1 text-sm text-body">{domain.description}</p>
      )}
      <p className="mb-4 text-sm text-muted">{primary.length} 篇</p>

      {showChips && chipOptions.length > 2 && (
        <nav aria-label="類型篩選" className="mb-6 flex flex-wrap gap-2 text-sm">
          {chipOptions.map((o) => {
            const active = (chip?.key ?? null) === o.key;
            return (
              <Link
                key={o.label}
                href={o.key ? `/learn/system/${id}?type=${o.key}` : `/learn/system/${id}`}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={`rounded-full px-3 py-1 ${
                  active ? "bg-deep text-on-accent" : "border border-card-border bg-card text-body hover:bg-surface-hover"
                }`}
              >
                {o.label}
              </Link>
            );
          })}
        </nav>
      )}

      {primary.length === 0 && also.length === 0 && <ComingSoon description={domain.description} />}

      {list.length > 0 &&
        (split ? (
          <>
            <section className="mb-8">
              <SectionHeading title="高頻" count={high.length} />
              <CardGrid articles={high} showDraft={showDraft} />
            </section>
            <section className="mb-8">
              <SectionHeading title="其他" count={rest.length} />
              <CardGrid articles={rest} showDraft={showDraft} />
            </section>
          </>
        ) : (
          <section className="mb-8">
            <CardGrid articles={list} showDraft={showDraft} />
          </section>
        ))}

      {alsoList.length > 0 && (
        <section className="mb-8">
          <SectionHeading title="也與此相關" count={alsoList.length} />
          <CardGrid articles={alsoList} showDraft={showDraft} note={(a) => `主分類:${getDomain(a.system)?.name ?? a.system}`} />
        </section>
      )}
    </div>
  );
}
