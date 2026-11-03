import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HighlightText } from "./HighlightText";
import { MatchSnippet } from "./MatchSnippet";
import { withSearchReturn, type SearchState } from "@/lib/search";
import { CATEGORY_LABELS } from "@/lib/knowledge/types";
import { partitionKnowledgeTree, type KnowledgeSearchGroup, type KnowledgeSearchNode } from "@/lib/knowledge/search-results";

function ResultTree({ nodes, state }: { nodes: KnowledgeSearchNode[]; state: SearchState }) {
  return <ul className="space-y-1">
    {nodes.map((node) => {
      const hit = node.hit;
      const [slug, id] = hit?.k.split("#") ?? [];
      const href = hit?.tableId
        ? withSearchReturn(`/tables/knowledge/${encodeURIComponent(hit.tableId)}`, state)
        : `/learn/${slug}#${id}`;
      return <li key={node.key}>
        {hit ? <Link href={href} className="block rounded-btn px-2 py-2 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent">
          <span className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-deep"><HighlightText text={node.title} query={state.q} /></span>
            <span className="shrink-0 text-xs text-muted">{hit.tableId ? "表格" : "段落"}</span>
          </span>
          <MatchSnippet snippet={hit.snippet} label={state.resultKind === "body" ? "內文" : undefined} />
        </Link> : <p className="px-2 py-2 text-sm font-medium text-muted">{node.title}</p>}
        {node.children.length > 0 && <div className="ml-3 border-l border-card-border pl-3"><ResultTree nodes={node.children} state={state} /></div>}
      </li>;
    })}
  </ul>;
}

/** One article per group; nonmatching ancestors are context, not result links. */
export function KnowledgeResultList({ groups, domainName, state }: {
  groups: KnowledgeSearchGroup[];
  domainName: Map<string, string>;
  state: SearchState;
}) {
  return <ul className="divide-y divide-card-border bg-card">
    {groups.map((group) => {
      const tree = partitionKnowledgeTree(group.children);
      return <li key={group.slug} className="py-5 first:pt-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/learn/${group.slug}`} className="block text-xl font-semibold text-deep hover:underline focus-visible:outline-2 focus-visible:outline-accent"><HighlightText text={group.title} query={state.q} /></Link>
            <p className="mt-1 text-xs text-muted">{domainName.get(group.domain)} › {CATEGORY_LABELS[group.category]}</p>
          </div>
          <span className="shrink-0 pt-1 text-xs tabular-nums text-muted">{group.matchCount} 項符合</span>
        </div>
        {group.articleHit && <div className="mt-2 text-sm text-body">
          <span className="text-xs text-muted">{group.title.toLowerCase().includes(state.q.toLowerCase()) ? "篇名符合" : "文章符合"}</span>
          <MatchSnippet snippet={group.articleHit.snippet} label={state.resultKind === "body" ? "內文" : undefined} />
        </div>}
        {tree.preview.length > 0 && <div className="mt-3 ml-1 border-l border-card-border pl-3"><ResultTree nodes={tree.preview} state={state} /></div>}
        {tree.remainingCount > 0 && <details data-search-detail={`knowledge:${group.slug}`} className="group/more mt-2">
          <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-1 rounded-btn px-2 text-sm font-medium text-deep hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"><ChevronRight size={15} aria-hidden className="transition-transform group-open/more:rotate-90 motion-reduce:transition-none" />顯示其餘 {tree.remainingCount} 項符合</summary>
          <div className="mt-1 ml-1 border-l border-card-border pl-3"><ResultTree nodes={tree.remaining} state={state} /></div>
        </details>}
      </li>;
    })}
  </ul>;
}
