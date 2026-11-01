import { ArticleRow, ArticleRowList } from "@/components/learn/ArticleRow";
import { groupByPrimarySystem } from "@/lib/knowledge/grouping";
import type { ArticleSummary } from "@/lib/knowledge/types";

/** 延伸學習的各類清單共用系統名稱、篇數與列容器 */
export function ReferenceSystemGroup({ name, count, children }: { name: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="px-3 text-xs font-medium text-muted">
        {name}<span className="ml-1 font-normal tabular-nums">{count}</span>
      </h4>
      <ArticleRowList variant="reference">{children}</ArticleRowList>
    </div>
  );
}

export function ReferenceArticles({ articles, showDraft }: { articles: ArticleSummary[]; showDraft: boolean }) {
  return (
    <div className="space-y-2">
      {groupByPrimarySystem(articles).map((group) => (
        <ReferenceSystemGroup key={group.id} name={group.name} count={group.articles.length}>
          {group.articles.map((article) => (
            <ArticleRow key={article.slug} article={article} showDraft={showDraft} showExamCount={false} variant="reference" />
          ))}
        </ReferenceSystemGroup>
      ))}
    </div>
  );
}
