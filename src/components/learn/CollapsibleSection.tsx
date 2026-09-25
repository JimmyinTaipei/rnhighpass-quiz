"use client";

import { ChevronRight } from "lucide-react";
import { useArticle } from "./ArticleShell";

interface CollapsibleSectionProps {
  id: string;
  depth: number;
  number: string;
  title: string;
  children: React.ReactNode;
}

const HEADING_STYLE: Record<number, string> = {
  2: "text-xl font-bold text-deep",
  3: "text-lg font-semibold text-deep",
  4: "text-base font-semibold text-strong",
  5: "text-base font-medium text-strong",
};

/**
 * 一個知識點。標題列整條可點來摺疊;內容用 hidden 藏起來而不是卸載,
 * 讓 server 渲染好的內容(含考題)不必重新產生。
 */
export function CollapsibleSection({ id, depth, number, title, children }: CollapsibleSectionProps) {
  const ctx = useArticle();
  const collapsed = ctx?.isCollapsed(id) ?? false;
  const Heading = `h${Math.min(depth, 6)}` as "h2";

  return (
    <section
      className={
        depth === 2
          ? "mt-8 border-t border-card-border pt-5 first:mt-0 first:border-t-0 first:pt-0"
          : "mt-5"
      }
    >
      <Heading
        id={id}
        data-kb-heading=""
        className={`kb-heading group scroll-mt-4 ${HEADING_STYLE[depth] ?? HEADING_STYLE[5]}`}
      >
        <button
          type="button"
          onClick={() => ctx?.toggle(id)}
          aria-expanded={!collapsed}
          className="-ml-1 flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-surface-hover"
        >
          <ChevronRight
            size={depth === 2 ? 20 : 16}
            className={`mt-[0.2em] shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${
              collapsed ? "" : "rotate-90"
            }`}
          />
          <span className="shrink-0 tabular-nums">{number}</span>
          <span className="min-w-0">{title}</span>
        </button>
      </Heading>
      <div hidden={collapsed} className={depth >= 3 ? "pl-2 sm:pl-4" : ""}>
        {children}
      </div>
    </section>
  );
}
