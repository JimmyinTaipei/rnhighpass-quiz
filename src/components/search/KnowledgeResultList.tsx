import Link from "next/link";
import { CATEGORY_LABELS, type SearchResult } from "@/lib/knowledge/types";

function hrefOf(key: string) {
  const [slug, id] = key.split("#");
  return id ? `/learn/${slug}#${id}` : `/learn/${slug}`;
}

/** 知識庫搜尋結果：整頁顯示類型，知識點顯示所在頁與段落，內文命中時附一段上下文 */
export function KnowledgeResultList({
  results,
  domainName,
}: {
  results: SearchResult[];
  domainName: Map<string, string>;
}) {
  return (
    <ul className="divide-y divide-card-border rounded-card bg-(--surface-inset)">
      {results.map((e) => {
        const isArticle = !e.k.includes("#");
        return (
          <li key={e.k}>
            <Link href={hrefOf(e.k)} className="block px-4 py-2.5 hover:bg-surface-hover">
              <span className="flex items-baseline gap-2">
                <span className={isArticle ? "font-semibold text-deep" : "font-medium text-deep"}>
                  {e.n && <span className="mr-0.5 tabular-nums">{e.n}</span>}
                  {e.t}
                </span>
                <span className="shrink-0 rounded bg-sidebar px-1.5 text-xs text-muted">
                  {isArticle ? CATEGORY_LABELS[e.c] : "知識點"}
                </span>
              </span>
              <span className="block truncate text-xs text-muted">
                {isArticle ? [domainName.get(e.d), e.s].filter(Boolean).join("・") : e.s}
              </span>
              {e.snippet && (
                <span className="mt-0.5 block text-sm text-body">
                  {e.snippet[0]}
                  <mark className="rounded bg-light px-0.5 text-deep">{e.snippet[1]}</mark>
                  {e.snippet[2]}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
