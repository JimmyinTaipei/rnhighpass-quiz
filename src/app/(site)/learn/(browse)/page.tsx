import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Library } from "lucide-react";
import { ContinueLastVisit } from "@/components/learn/ContinueLastVisit";
import { LearnIndex } from "@/components/learn/LearnIndex";
import { SoonBadge } from "@/components/learn/SoonBadge";
import { searchKnowledge, taxonomy } from "@/lib/knowledge";
import { learnNavGroups, type LearnNavGroup } from "@/lib/knowledge/nav";
import { CATEGORY_LABELS, type KnowledgeCategory } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "知識庫" };

/** 一行一項:只有名稱與相關題數;還沒有頁面的顯示「即將推出」 */
function RowList({ group }: { group: LearnNavGroup }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-sm font-semibold tracking-wide text-muted">{group.label}</h2>
      <ul className="divide-y divide-card-border rounded-card bg-card">
        {group.entries.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="flex items-center gap-2 px-4 py-3 hover:bg-surface-hover">
              <span className={`min-w-0 flex-1 truncate font-medium ${r.soon ? "text-muted/70" : "text-deep"}`}>
                {r.name}
              </span>
              {r.soon ? (
                <SoonBadge />
              ) : (
                <span className="shrink-0 text-sm tabular-nums text-muted">
                  {r.questions > 0 ? `${r.questions} 題` : "—"}
                </span>
              )}
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
        {learnNavGroups().map((g) => (
          <RowList key={g.label} group={g} />
        ))}
      </LearnIndex>
    </div>
  );
}
