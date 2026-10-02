"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Library } from "lucide-react";
import { SoonBadge } from "@/components/learn/SoonBadge";
import type { LearnNavGroup } from "@/lib/knowledge/nav";

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function Group({ group, pathname }: { group: LearnNavGroup; pathname: string }) {
  return (
    <div className="mb-3">
      <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted">{group.label}</p>
      <ul>
        {group.entries.map((e) => {
          const active = under(pathname, e.href);
          return (
            <li key={e.href}>
              <Link
                href={e.href}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors duration-150 motion-reduce:transition-none ${
                  active
                    ? "bg-light font-semibold text-deep"
                    : e.soon
                      ? "text-muted/70 hover:bg-surface-hover"
                      : "text-body hover:bg-surface-hover"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{e.name}</span>
                {e.soon ? (
                  <SoonBadge />
                ) : (
                  e.pages > 0 && <span className="shrink-0 text-xs font-normal text-muted">{e.pages}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * 知識庫的分類側欄,四組依序為:系統 / 跨系統 / 速查 / 護理專業(資料來自 learnNavGroups)。
 * 手機上收成一個可展開的區塊,避免把內容推到很下面。
 */
export function LearnSidebar({ groups }: { groups: LearnNavGroup[] }) {
  const pathname = usePathname();
  const currentName = groups.flatMap((g) => g.entries).find((e) => under(pathname, e.href))?.name;

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

  const list = groups.map((g) => <Group key={g.label} group={g} pathname={pathname} />);

  return (
    <>
      <details className="group rounded-card bg-card p-2 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1 text-sm font-semibold text-deep [&::-webkit-details-marker]:hidden">
          瀏覽分類{currentName && `:${currentName}`}
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-2">
          {header}
          {list}
        </div>
      </details>

      <aside className="hidden lg:block">
        <nav aria-label="知識庫分類" className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
          {header}
          {list}
        </nav>
      </aside>
    </>
  );
}
