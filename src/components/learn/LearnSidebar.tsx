"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Library } from "lucide-react";
import { DOMAIN_KIND_LABELS, type DomainKind, type TaxonomyDomain } from "@/lib/knowledge/types";

const KIND_ORDER: DomainKind[] = ["system", "cross", "subject"];

function DomainList({ domains, current }: { domains: TaxonomyDomain[]; current: string | null }) {
  return (
    <>
      {KIND_ORDER.map((kind) => {
        const list = domains.filter((d) => d.kind === kind);
        if (list.length === 0) return null;
        return (
          <div key={kind} className="mb-3">
            <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted">{DOMAIN_KIND_LABELS[kind]}</p>
            <ul>
              {list.map((d) => {
                const total = d.primaryCount + d.alsoCount;
                if (total === 0) {
                  // 還沒有內容的分類也列出來:讓人知道之後會放在哪,但不可點
                  return (
                    <li key={d.id} className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted/70" title="即將加入">
                      <span className="min-w-0 flex-1 truncate">{d.name}</span>
                    </li>
                  );
                }
                const active = current === d.id;
                return (
                  <li key={d.id}>
                    <Link
                      href={`/learn/system/${d.id}`}
                      className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors duration-150 motion-reduce:transition-none ${
                        active ? "bg-light font-semibold text-deep" : "text-body hover:bg-surface-hover"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{d.name}</span>
                      <span className="shrink-0 text-xs font-normal text-muted">{total}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

/**
 * 知識庫的分類側欄:器官系統 / 跨系統 / 科目。
 * 手機上收成一個可展開的區塊,避免把內容推到很下面。
 */
export function LearnSidebar({ domains }: { domains: TaxonomyDomain[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/learn\/system\/([^/]+)/);
  const current = match ? decodeURIComponent(match[1]) : null;
  const currentName = domains.find((d) => d.id === current)?.name;

  const header = (
    <Link
      href="/learn"
      className={`mb-2 flex items-center gap-1.5 rounded px-2 py-1.5 text-base font-semibold ${
        pathname === "/learn" ? "text-deep" : "text-deep hover:bg-surface-hover"
      }`}
    >
      <Library size={16} className="text-accent" /> 知識庫
    </Link>
  );

  return (
    <>
      <details className="group rounded-card border border-card-border bg-card p-2 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1 text-sm font-semibold text-deep [&::-webkit-details-marker]:hidden">
          瀏覽分類{currentName && `:${currentName}`}
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-2">
          {header}
          <DomainList domains={domains} current={current} />
        </div>
      </details>

      <aside className="hidden lg:block">
        <nav aria-label="知識庫分類" className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
          {header}
          <DomainList domains={domains} current={current} />
        </nav>
      </aside>
    </>
  );
}
