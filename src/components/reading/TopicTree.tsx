"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TreeNode } from "@/lib/reading-nav";

interface TopicTreeProps {
  nodes: TreeNode[];
  /** 目前所在節點(階段 3 由 scrollspy 提供) */
  activeId?: number;
  /** 點了節點之後要做的事，例如窄螢幕把抽屜關掉 */
  onNavigate?: () => void;
  /**
   * 這棵樹屬於哪一章。側邊欄可以同時展開別章，那些樹的錨點必須帶上章節路徑
   * (`/chapters/3#topic-99`)，否則會跳到當前這一頁不存在的錨點。
   * 省略 = 這是當前章節的樹，維持同頁錨點。
   */
  basePath?: string;
}

/**
 * 側邊欄的節點樹。遞迴、不寫死層數。
 *
 * 側邊欄與(階段 3 的)窄螢幕抽屜共用這一個元件，所以這裡不做任何版面假設：
 * 不設寬度、不 sticky、不管捲動，那些都是容器的事。
 */
export function TopicTree({ nodes, activeId, onNavigate, basePath }: TopicTreeProps) {
  const [expanded, setExpanded] = useState<Set<number>>(() => initialExpanded(nodes));
  // 同一棵樹可能同時出現在側邊欄與窄螢幕目錄，aria-controls 的 id 不能撞
  const uid = useId();

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <TreeLevel
      nodes={nodes}
      depth={0}
      uid={uid}
      expanded={expanded}
      onToggle={toggle}
      activeId={activeId}
      onNavigate={onNavigate}
      basePath={basePath}
    />
  );
}

/** 只有一個子節點的層級預設展開——多點一下才看到唯一的小孩是白費力氣 */
function initialExpanded(nodes: TreeNode[], acc = new Set<number>()): Set<number> {
  for (const node of nodes) {
    if (node.children.length === 1) acc.add(node.id);
    initialExpanded(node.children, acc);
  }
  return acc;
}

interface TreeLevelProps extends Omit<TopicTreeProps, "nodes"> {
  nodes: TreeNode[];
  depth: number;
  uid: string;
  expanded: Set<number>;
  onToggle: (id: number) => void;
}

function TreeLevel({
  nodes,
  depth,
  uid,
  expanded,
  onToggle,
  activeId,
  onNavigate,
  basePath,
}: TreeLevelProps) {
  if (nodes.length === 0) return null;

  return (
    <ul>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isOpen = expanded.has(node.id);
        const isActive = activeId === node.id;
        const childrenId = `${uid}-${node.id}`;

        return (
          <li key={node.id}>
            <div
              className={`flex items-center rounded transition-colors duration-150 motion-reduce:transition-none ${
                isActive ? "bg-subj-light" : "hover:bg-surface-hover"
              }`}
              // 用縮排表達層級，不用豎線
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => onToggle(node.id)}
                  aria-expanded={isOpen}
                  aria-controls={childrenId}
                  aria-label={`${isOpen ? "收合" : "展開"} ${node.label}`}
                  className="flex size-6 shrink-0 items-center justify-center rounded text-muted transition-colors duration-150 hover:text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none"
                >
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-150 motion-reduce:transition-none ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                // 沒有子節點的列也要對齊，留一個同寬的空位
                <span className="size-6 shrink-0" aria-hidden />
              )}

              <NodeLink
                basePath={basePath}
                topicId={node.id}
                onNavigate={onNavigate}
                className={`flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent ${
                  isActive ? "font-medium text-subj-deep" : "text-body"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{node.label}</span>
                <NodeCounts questions={node.questionCount} notes={node.noteCount} />
              </NodeLink>
            </div>

            {hasChildren && isOpen && (
              <div id={childrenId}>
                <TreeLevel
                  nodes={node.children}
                  depth={depth + 1}
                  uid={uid}
                  expanded={expanded}
                  onToggle={onToggle}
                  activeId={activeId}
                  onNavigate={onNavigate}
                  basePath={basePath}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * 同一章就用原生 <a> 的同頁錨點(不該觸發路由)；別章則走 next/link 的 client 導航。
 * 跳過去之後 ReadingControls 的 hashchange/mount 處理會把目標主題連同祖先層展開。
 */
function NodeLink({
  basePath,
  topicId,
  onNavigate,
  className,
  children,
}: {
  basePath?: string;
  topicId: number;
  onNavigate?: () => void;
  className: string;
  children: React.ReactNode;
}) {
  const hash = `#topic-${topicId}`;
  if (!basePath) {
    return (
      <a href={hash} onClick={onNavigate} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`${basePath}${hash}`} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}

export function NodeCounts({ questions, notes }: { questions: number; notes: number }) {
  if (questions === 0 && notes === 0) return null;
  return (
    <span className="shrink-0 text-xs font-normal text-muted">
      {questions > 0 && `${questions} 題`}
      {questions > 0 && notes > 0 && "・"}
      {notes > 0 && `${notes} 筆記`}
    </span>
  );
}
