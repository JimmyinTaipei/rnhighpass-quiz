import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ArticleRow, ArticleRowList } from "@/components/learn/ArticleRow";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { articlesInDomain, byExamCount, getDomain, relatedCountsFor } from "@/lib/knowledge";
import { DOMAIN_KIND_LABELS, SYSTEM_TYPE_CHIPS, type ArticleSummary } from "@/lib/knowledge/types";

export async function generateMetadata(props: PageProps<"/learn/system/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const d = getDomain(id);
  return { title: d ? `${d.name}|知識庫` : "知識庫" };
}

interface Item {
  article: ArticleSummary;
  /** alsoIn 頁:低調標示主分類 */
  note?: string;
}

function Rows({ items, showDraft, withType }: { items: Item[]; showDraft: boolean; withType?: boolean }) {
  return (
    <ArticleRowList>
      {items.map(({ article, note }) => (
        <ArticleRow
          key={article.slug}
          article={article}
          note={note}
          showDraft={showDraft}
          related={article.category === "disease" ? relatedCountsFor(article.slug) : null}
          typeLabel={withType ? SYSTEM_TYPE_CHIPS.find((c) => c.categories.includes(article.category))?.label : undefined}
        />
      ))}
    </ArticleRowList>
  );
}

const chipClass = (active: boolean) =>
  `rounded-full px-3 py-1 ${
    active ? "bg-deep text-on-accent" : "border border-card-border bg-card text-body hover:bg-surface-hover"
  }`;

/**
 * 一個系統(或護理專業)底下的頁面。
 * 系統:上方類型 chips(?type=)與右上排序切換(預設依類型分區塊;?sort=exam 混成一個清單)。
 *   區塊與 chips 順序同 SYSTEM_TYPE_CHIPS;沒有頁面的類型隱藏;病原體不出現。
 * 護理專業:沒有 chips、切換與區塊標題,單一清單依題數排序。
 * 區塊內與混合清單都依相關題數由高到低、同題數依名稱(byExamCount)。
 */
export default async function LearnSystemPage(props: PageProps<"/learn/system/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const domain = getDomain(id);
  if (!domain) notFound();
  const showDraft = await isAdmin();
  const { primary, also } = articlesInDomain(id);

  const items: Item[] = [
    ...primary.map((article) => ({ article })),
    ...also.map((article) => ({ article, note: `主分類:${getDomain(article.system)?.name ?? article.system}` })),
  ]
    .filter(({ article }) => article.category !== "pathogen")
    .sort((a, b) => byExamCount(a.article, b.article));

  const isNursing = domain.kind === "nursing";
  const chips = SYSTEM_TYPE_CHIPS.filter((c) => items.some((i) => c.categories.includes(i.article.category)));
  const rawType = typeof searchParams.type === "string" ? searchParams.type : null;
  const chip = isNursing ? null : (chips.find((c) => c.key === rawType) ?? null);
  const byExam = !isNursing && searchParams.sort === "exam";
  const visible = chip ? items.filter((i) => chip.categories.includes(i.article.category)) : items;

  const href = (type: string | null, exam: boolean) => {
    const p = new URLSearchParams();
    if (type) p.set("type", type);
    if (exam) p.set("sort", "exam");
    const qs = p.toString();
    return qs ? `/learn/system/${id}?${qs}` : `/learn/system/${id}`;
  };

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>{DOMAIN_KIND_LABELS[domain.kind]}</span>
      </nav>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-strong">{domain.name}</h1>
        {!isNursing && items.length > 0 && (
          <nav aria-label="排序" className="segmented">
            {[
              { label: "依類型", exam: false },
              { label: "依考題數", exam: true },
            ].map((o) => (
              <Link
                key={o.label}
                href={href(chip?.key ?? null, o.exam)}
                scroll={false}
                aria-current={byExam === o.exam ? "true" : undefined}
              >
                {o.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      {domain.description && items.length > 0 && <p className="mb-1 text-sm text-body">{domain.description}</p>}
      {items.length > 0 && <p className="mb-4 text-sm text-muted">{primary.length} 篇</p>}

      {items.length === 0 && <ComingSoon description={domain.description} />}

      {!isNursing && chips.length > 1 && (
        <nav aria-label="類型篩選" className="mb-6 flex flex-wrap gap-2 text-sm">
          <Link href={href(null, byExam)} scroll={false} aria-current={!chip ? "true" : undefined} className={chipClass(!chip)}>
            全部
          </Link>
          {chips.map((c) => (
            <Link
              key={c.key}
              href={href(c.key, byExam)}
              scroll={false}
              aria-current={chip?.key === c.key ? "true" : undefined}
              className={chipClass(chip?.key === c.key)}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      )}

      {isNursing || byExam ? (
        visible.length > 0 && <Rows items={visible} showDraft={showDraft} withType={byExam} />
      ) : (
        chips
          .filter((c) => !chip || c.key === chip.key)
          .map((c) => {
            const list = visible.filter((i) => c.categories.includes(i.article.category));
            if (list.length === 0) return null;
            return (
              <section key={c.key} className="mb-8">
                <h2 className="mb-3 border-b border-card-border pb-1 text-xl font-bold text-deep">
                  {c.label} <span className="text-sm font-normal text-muted">{list.length}</span>
                </h2>
                <Rows items={list} showDraft={showDraft} />
              </section>
            );
          })
      )}
    </div>
  );
}
