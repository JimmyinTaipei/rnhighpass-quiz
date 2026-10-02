import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Library } from "lucide-react";
import { ContinueLastVisit } from "@/components/learn/ContinueLastVisit";
import { LearnIndex } from "@/components/learn/LearnIndex";
import {
  articlesOfType,
  getArticleSummaries,
  questionCountOf,
  searchKnowledge,
  taxonomy,
} from "@/lib/knowledge";
import { BROWSE_TYPES, CATEGORY_LABELS, DOMAIN_KIND_LABELS, type KnowledgeCategory } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "知識庫" };

interface Row {
  href: string;
  name: string;
  /** 相關國考題數(題號聯集) */
  questions: number;
}

/** 一行一項:只有名稱與相關題數 */
function RowList({ title, rows }: { title: string; rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-sm font-semibold tracking-wide text-muted">{title}</h2>
      <ul className="divide-y divide-card-border rounded-card bg-card">
        {rows.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="flex items-center gap-2 px-4 py-3 hover:bg-surface-hover">
              <span className="min-w-0 flex-1 truncate font-medium text-deep">{r.name}</span>
              <span className="shrink-0 text-sm tabular-nums text-muted">
                {r.questions > 0 ? `${r.questions} 題` : "—"}
              </span>
              <ChevronRight size={16} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function LearnPage(props: PageProps<"/learn">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const rawType = typeof sp.type === "string" ? sp.type : null;
  const type = rawType && rawType in CATEGORY_LABELS ? (rawType as KnowledgeCategory) : null;

  // 題數只算「主要所屬」是這個系統的頁面(與系統頁清單一致)；順序固定照 taxonomy.yml
  const all = getArticleSummaries();
  const domainRows = (kind: "system" | "nursing"): Row[] =>
    taxonomy.domains
      .filter((d) => d.kind === kind)
      .map((d) => ({
        href: `/learn/system/${d.id}`,
        name: d.name,
        questions: questionCountOf(all.filter((a) => a.system === d.id)),
      }));
  const typeRows: Row[] = BROWSE_TYPES.map((t) => ({
    href: `/learn/type/${t.type}`,
    name: t.label,
    questions: questionCountOf(articlesOfType(t.type)),
  }));

  return (
    <div>
      <h1 className="max-md:sr-only mb-1 flex items-center gap-2 text-3xl font-bold text-strong">
        <Library className="text-accent" /> 知識庫
      </h1>
      <p className="mb-6 text-sm text-body">以知識點為單位整理、依系統分類，彼此互相連結。數字是相關國考題數。</p>
      <LearnIndex domains={taxonomy.domains} query={q} type={type} results={searchKnowledge(q, type)}>
        <Suspense fallback={null}>
          <ContinueLastVisit />
        </Suspense>
        <RowList title={DOMAIN_KIND_LABELS.system} rows={domainRows("system")} />
        <RowList title="跨系統速查" rows={typeRows} />
        <RowList title={DOMAIN_KIND_LABELS.nursing} rows={domainRows("nursing")} />
      </LearnIndex>
    </div>
  );
}
