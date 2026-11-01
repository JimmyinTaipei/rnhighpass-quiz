import { ReferenceArticles } from "@/components/learn/ReferenceArticles";
import type { ArticleSummary, RelatedKey } from "@/lib/knowledge/types";

interface RelatedCardsProps {
  /** 疾病頁:相關檢驗/藥物/病原體/生理的分組 */
  groups: { key: RelatedKey; label: string; articles: ArticleSummary[] }[];
  /** 檢驗/藥物/病原體/生理頁:相關疾病，不代表治療適應症 */
  usedBy: ArticleSummary[];
  showDraft: boolean;
}

/** 疾病頁的「相關…」與反向「相關疾病」精簡列。資料來自 index.json 的 related / usedBy。 */
export function RelatedCards({ groups, usedBy, showDraft }: RelatedCardsProps) {
  if (groups.length === 0 && usedBy.length === 0) return null;
  return (
    <section id="related" aria-label="相關知識" className="scroll-mt-4 space-y-4">
      {groups.map((g) => (
        <div key={g.key}>
          <h3 className="mb-1 text-base font-semibold text-deep">
            {g.label} <span className="text-sm font-normal text-muted">{g.articles.length}</span>
          </h3>
          <ReferenceArticles articles={g.articles} showDraft={showDraft} />
        </div>
      ))}
      {usedBy.length > 0 && (
        <div>
          <h3 className="mb-1 text-base font-semibold text-deep">
            相關疾病 <span className="text-sm font-normal text-muted">{usedBy.length}</span>
          </h3>
          <ReferenceArticles articles={usedBy} showDraft={showDraft} />
        </div>
      )}
    </section>
  );
}
