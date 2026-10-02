"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Library } from "lucide-react";
import {
  DOMAIN_KIND_LABELS,
  type KnowledgeCategory,
  type TaxonomyDomain,
} from "@/lib/knowledge/types";

export interface SidebarTypeLink {
  type: KnowledgeCategory;
  label: string;
  count: number;
}

function DomainGroup({
  label,
  domains,
  current,
}: {
  label: string;
  domains: TaxonomyDomain[];
  current: string | null;
}) {
  if (domains.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted">{label}</p>
      <ul>
        {domains.map((d) => {
          if (d.primaryCount + d.alsoCount === 0) {
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
                {d.primaryCount > 0 && (
                  <span className="shrink-0 text-xs font-normal text-muted">{d.primaryCount}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 跨系統速查(藥理、檢驗、病原體):跨所有器官系統列出同一類型的頁面 */
function TypeList({ types, current }: { types: SidebarTypeLink[]; current: string | null }) {
  if (types.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted">跨系統速查</p>
      <ul>
        {types.map((t) => {
          if (t.count === 0) {
            return (
              <li key={t.type} className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted/70" title="即將加入">
                <span className="min-w-0 flex-1 truncate">{t.label}</span>
              </li>
            );
          }
          const active = current === t.type;
          return (
            <li key={t.type}>
              <Link
                href={`/learn/type/${t.type}`}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors duration-150 motion-reduce:transition-none ${
                  active ? "bg-light font-semibold text-deep" : "text-body hover:bg-surface-hover"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{t.label}</span>
                <span className="shrink-0 text-xs font-normal text-muted">{t.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * 知識庫的分類側欄,三組依序為:系統 / 跨系統速查(藥理、檢驗、病原體) / 護理專業。
 * 手機上收成一個可展開的區塊,避免把內容推到很下面。
 */
export function LearnSidebar({ domains, types }: { domains: TaxonomyDomain[]; types: SidebarTypeLink[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/learn\/system\/([^/]+)/);
  const current = match ? decodeURIComponent(match[1]) : null;
  const typeMatch = pathname.match(/^\/learn\/type\/([^/]+)/);
  const currentType = typeMatch ? decodeURIComponent(typeMatch[1]) : null;
  const currentName =
    domains.find((d) => d.id === current)?.name ?? types.find((t) => t.type === currentType)?.label;

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

  const groups = (
    <>
      <DomainGroup label={DOMAIN_KIND_LABELS.system} domains={domains.filter((d) => d.kind === "system")} current={current} />
      <TypeList types={types} current={currentType} />
      <DomainGroup label={DOMAIN_KIND_LABELS.nursing} domains={domains.filter((d) => d.kind === "nursing")} current={current} />
    </>
  );

  return (
    <>
      <details className="group rounded-card bg-card p-2 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1 text-sm font-semibold text-deep [&::-webkit-details-marker]:hidden">
          瀏覽分類{currentName && `:${currentName}`}
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-2">
          {header}
          {groups}
        </div>
      </details>

      <aside className="hidden lg:block">
        <nav aria-label="知識庫分類" className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
          {header}
          {groups}
        </nav>
      </aside>
    </>
  );
}
