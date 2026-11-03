import Link from "next/link";
import { searchHref, SEARCH_PAGE_SIZE, type SearchState } from "@/lib/search";

export function SearchPagination({ state, total, page, size = SEARCH_PAGE_SIZE, unit = "筆" }: {
  state: SearchState; total: number; page: number; size?: number; unit?: string;
}) {
  if (!total) return null;
  const pages = Math.ceil(total / size);
  const linkClass = "inline-flex min-h-11 items-center justify-center rounded-btn border border-card-border bg-card px-4 text-sm text-deep hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <nav aria-label="搜尋結果分頁" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-card-border pt-4">
      <p className="text-sm text-muted" aria-live="polite">第 {(page - 1) * size + 1}–{Math.min(page * size, total)} {unit}，共 {total} {unit}</p>
      {pages > 1 && <div className="flex items-center gap-2">
        {page > 1 ? <Link rel="prev" className={linkClass} href={searchHref({ ...state, page: page - 1 })}>上一頁</Link> : <span aria-disabled="true" className="px-4 text-sm text-muted">上一頁</span>}
        <span className="text-sm tabular-nums text-body">{page} / {pages}</span>
        {page < pages ? <Link rel="next" className={linkClass} href={searchHref({ ...state, page: page + 1 })}>下一頁</Link> : <span aria-disabled="true" className="px-4 text-sm text-muted">下一頁</span>}
      </div>}
    </nav>
  );
}
