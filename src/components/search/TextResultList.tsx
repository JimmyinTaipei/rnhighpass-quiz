import Link from "next/link";
import type { TextSearchItem } from "@/lib/search-data";
import { withSearchReturn, type SearchState } from "@/lib/search";
import { HighlightText } from "./HighlightText";
import { MatchSnippet } from "./MatchSnippet";

export function TextResultList({ items, state }: { items: TextSearchItem[]; state: SearchState }) {
  return <ul className="divide-y divide-card-border rounded-card bg-card">
    {items.map((item) => <li key={item.id}>
      <Link href={withSearchReturn(item.href, state)} className="block min-h-11 px-4 py-3 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent">
        <span className="block break-words font-medium text-deep"><HighlightText text={item.title} query={state.q} /></span>
        <span className="mt-1 block text-xs text-muted">{item.location}</span>
        <MatchSnippet snippet={item.snippet} />
      </Link>
    </li>)}
  </ul>;
}
