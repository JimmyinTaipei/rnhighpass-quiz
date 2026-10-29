import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Library } from "lucide-react";
import { ContinueLastVisit } from "@/components/learn/ContinueLastVisit";
import { SoonBadge } from "@/components/learn/SoonBadge";
import { redirect } from "next/navigation";
import { learnNavGroups, type LearnNavGroup } from "@/lib/knowledge/nav";

export const metadata: Metadata = { title: "知識庫" };

/** 一行一項:名稱、知識頁篇數與相關題數;還沒有頁面的顯示「即將推出」 */
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
                  {r.pages} 篇{r.questions > 0 && ` · ${r.questions} 題`}
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
  // 知識庫搜尋已併進全站搜尋頁；舊網址 /learn?q= 轉過去
  const sp = await props.searchParams;
  if (typeof sp.q === "string" && sp.q.trim()) {
    const params = new URLSearchParams({ q: sp.q.trim(), scope: "knowledge" });
    if (typeof sp.type === "string") params.set("type", sp.type);
    redirect(`/search?${params}`);
  }

  return (
    <div>
      <h1 className="max-md:sr-only mb-1 flex items-center gap-2 text-3xl font-bold text-strong">
        <Library className="text-accent" /> 知識庫
      </h1>
      <p className="mb-6 text-sm text-body">以知識點為單位整理、依系統分類，彼此互相連結。每一列標出知識頁篇數與相關國考題數。</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <ContinueLastVisit />
        </Suspense>
        {learnNavGroups().map((g) => (
          <RowList key={g.label} group={g} />
        ))}
      </div>
    </div>
  );
}
