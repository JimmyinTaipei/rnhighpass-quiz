import { hasContent, topicAnchorId, type TopicNode } from "@/lib/topic-tree";

interface ChapterOutlineProps {
  nodes: TopicNode[];
  chapterLabel: string;
}

function OutlineItems({ nodes, depth }: { nodes: TopicNode[]; depth: number }) {
  return (
    <ul className={depth > 0 ? "ml-3 border-l border-subj-mid pl-2" : ""}>
      {nodes.filter(hasContent).map((node) => (
        <li key={node.topic.id}>
          <a
            href={`#${topicAnchorId(node.topic.id)}`}
            className={`block rounded px-2 py-1 transition-colors hover:bg-subj-light ${
              depth === 0
                ? "text-sm font-semibold text-subj-deep"
                : "text-xs text-body"
            }`}
          >
            {node.topic.heading_text}
            <span className="ml-1 text-xs font-normal text-muted">
              {node.totalQuestions > 0 && `${node.totalQuestions}題`}
              {node.totalQuestions > 0 && node.totalCards > 0 && "・"}
              {node.totalCards > 0 && `${node.totalCards}卡`}
            </span>
          </a>
          {node.children.length > 0 && (
            <OutlineItems nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * 章節大綱側欄——對應原始 markdown 的 ## / ### 階層。
 *
 * 點項目會跳到內容區對應的 <details>。因為內容預設是收合的，展開由
 * OutlineJump 這個 client component 監聽 hash 處理。
 */
export function ChapterOutline({ nodes, chapterLabel }: ChapterOutlineProps) {
  const items = <OutlineItems nodes={nodes} depth={0} />;

  return (
    <>
      {/* 桌機：固定在左側 */}
      <nav className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-64 shrink-0 overflow-y-auto rounded-card border border-card-border bg-card p-3 shadow-sm lg:block">
        <p className="mb-2 px-2 text-xs font-bold tracking-wide text-muted">
          {chapterLabel}
        </p>
        {items}
      </nav>

      {/* 手機：收在可展開的區塊，避免佔掉整個首屏 */}
      <details className="mb-4 rounded-card border border-card-border bg-card shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-subj-deep">
          章節大綱
        </summary>
        <div className="px-3 pb-3">{items}</div>
      </details>
    </>
  );
}
