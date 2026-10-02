import { ArticleRow, ArticleRowList } from "@/components/learn/ArticleRow";
import { relatedCountsFor } from "@/lib/knowledge";
import type { OrganGroup } from "@/lib/knowledge/grouping";

/** 跨系統頁與速查頁:依器官系統分組的緊湊列,系統名稱當小標題 */
export function OrganGroups({ groups, showDraft }: { groups: OrganGroup[]; showDraft: boolean }) {
  return (
    <>
      {groups.map((g) => (
        <section key={g.id} className="mb-6">
          <h2 className="mb-2 flex items-baseline gap-2 px-1 text-base font-bold text-deep">
            {g.name} <span className="text-sm font-normal text-muted">{g.items.length}</span>
          </h2>
          <ArticleRowList>
            {g.items.map(({ article, note }) => (
              <ArticleRow
                key={article.slug}
                article={article}
                note={note}
                showDraft={showDraft}
                related={article.category === "disease" ? relatedCountsFor(article.slug) : null}
              />
            ))}
          </ArticleRowList>
        </section>
      ))}
    </>
  );
}
