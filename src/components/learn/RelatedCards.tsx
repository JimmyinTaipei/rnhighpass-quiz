import { ArticleCard } from "@/components/learn/ArticleCard";
import type { ArticleSummary, RelatedKey } from "@/lib/knowledge/types";

interface RelatedCardsProps {
  /** 疾病頁:相關檢驗/藥物/病原體/生理的分組 */
  groups: { key: RelatedKey; label: string; articles: ArticleSummary[] }[];
  /** 檢驗/藥物/病原體/生理頁:用於哪些疾病 */
  usedBy: ArticleSummary[];
  showDraft: boolean;
}

/** 疾病頁的「相關…」分組卡片,與其反向的「用於哪些疾病」。資料來自 index.json 的 related / usedBy。 */
export function RelatedCards({ groups, usedBy, showDraft }: RelatedCardsProps) {
  if (groups.length === 0 && usedBy.length === 0) return null;
  return (
    <section id="related" className="mt-10 scroll-mt-4">
      {groups.map((g) => (
        <div key={g.key} className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-deep">
            {g.label} <span className="text-sm font-normal text-muted">{g.articles.length}</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.articles.map((a) => (
              <ArticleCard key={a.slug} article={a} showDraft={showDraft} />
            ))}
          </div>
        </div>
      ))}
      {usedBy.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-deep">
            用於哪些疾病 <span className="text-sm font-normal text-muted">{usedBy.length}</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {usedBy.map((a) => (
              <ArticleCard key={a.slug} article={a} showDraft={showDraft} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
