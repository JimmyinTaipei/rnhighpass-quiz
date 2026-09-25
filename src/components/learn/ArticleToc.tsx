"use client";

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useArticle } from "./ArticleShell";
import type { TocNode } from "./toc";

function containsId(node: TocNode, id: string | null): boolean {
  if (!id) return false;
  return node.id === id || node.children.some((c) => containsId(c, id));
}

function TocList({ nodes, level }: { nodes: TocNode[]; level: number }) {
  const ctx = useArticle();
  if (!ctx) return null;
  return (
    <ul className={level > 0 ? "ml-3 border-l border-card-border pl-2" : ""}>
      {nodes.map((n) => {
        const active = ctx.activeId === n.id;
        const onPath = !active && containsId(n, ctx.activeId);
        return (
          <li key={n.id}>
            <a
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                ctx.reveal(n.id, { push: true });
              }}
              className={`flex gap-1 rounded px-2 py-1 text-sm leading-snug transition-colors duration-150 hover:bg-surface-hover motion-reduce:transition-none ${
                active
                  ? "bg-light font-semibold text-deep"
                  : onPath
                    ? "font-medium text-deep"
                    : "text-body"
              }`}
            >
              <span className="shrink-0 tabular-nums text-muted">{n.number}</span>
              <span className="min-w-0">{n.title}</span>
            </a>
            {/* 深層(1. 以下)只在閱讀到附近時展開,避免目錄比文章還長 */}
            {n.children.length > 0 && (level < 1 || onPath || active) && (
              <TocList nodes={n.children} level={level + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ArticleToc({ toc, title }: { toc: TocNode[]; title: string }) {
  const ctx = useArticle();
  return (
    <nav aria-label="目錄">
      <div className="mb-2 flex items-center justify-between gap-2 px-2">
        <p className="min-w-0 truncate text-sm font-semibold text-deep">{title}</p>
        {ctx && (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={ctx.expandAll}
              title="全部展開"
              aria-label="全部展開"
              className="rounded p-1 text-muted hover:bg-surface-hover hover:text-deep"
            >
              <ChevronsUpDown size={16} />
            </button>
            <button
              type="button"
              onClick={ctx.collapseAll}
              title="全部收合"
              aria-label="全部收合"
              className="rounded p-1 text-muted hover:bg-surface-hover hover:text-deep"
            >
              <ChevronsDownUp size={16} />
            </button>
          </div>
        )}
      </div>
      <TocList nodes={toc} level={0} />
    </nav>
  );
}
