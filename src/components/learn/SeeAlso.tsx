import Link from "next/link";
import { CitingReferenceRow } from "@/components/learn/CitingReferenceRow";
import { ReferenceArticles, ReferenceSystemGroup } from "@/components/learn/ReferenceArticles";
import type { ArticleRowMetadata } from "@/components/learn/ArticleRowLabel";
import type { ArticleSummary, KnowledgePreview, TaxonomyDomain, TaxonomyGroup } from "@/lib/knowledge/types";

export interface CitingArticle extends ArticleRowMetadata {
  slug: string;
  /** 來源頁的主系統(分組用) */
  system: string;
  /** 來源頁的相關考題數(組內排序用) */
  examCount: number;
  /** 引用本頁的段落(整頁層級的引用沒有 number) */
  places: (KnowledgePreview & { embedded: boolean })[];
}

/** 依主系統分好組的引用來源 */
export interface CitingGroup {
  id: string;
  name: string;
  articles: CitingArticle[];
}

interface SeeAlsoProps {
  citing: CitingGroup[];
  group: TaxonomyGroup | undefined;
  siblings: ArticleSummary[];
  alsoIn: TaxonomyDomain[];
  showDraft?: boolean;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 text-base font-semibold text-deep">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * 頁尾「參見」:誰引用了本頁、同群組的其他頁、次系統。
 * 取代原本右欄的「相關知識點」——內文的連結已經說明「本頁連到哪」,
 * 這裡只補內文看不到的反向關係。
 */
export function SeeAlso({ citing, group, siblings, alsoIn, showDraft = false }: SeeAlsoProps) {
  const citingCount = citing.reduce((n, g) => n + g.articles.length, 0);
  if (citingCount === 0 && siblings.length === 0 && alsoIn.length === 0) return null;

  return (
    <section id="see-also" aria-label="參見" className="scroll-mt-4">
      <div className="space-y-4">
        {citingCount > 0 && (
          <div>
            <Block title={`引用本頁的頁面（${citingCount}）`}>
              {/* 系統單欄排列，段落預設收合；文章連結與展開操作各自獨立 */}
              <div className="space-y-2">
                {citing.map((g) => (
                  <ReferenceSystemGroup key={g.id} name={g.name} count={g.articles.length}>
                    {g.articles.map((c) => <CitingReferenceRow key={c.slug} article={c} showDraft={showDraft} />)}
                  </ReferenceSystemGroup>
                ))}
              </div>
            </Block>
          </div>
        )}

        {group && siblings.length > 0 && (
          <Block title={`同群組：${group.name}（${siblings.length}）`}>
            <ReferenceArticles articles={siblings} showDraft={showDraft} />
          </Block>
        )}

        {alsoIn.length > 0 && (
          <Block title="其他分類">
            <ul className="flex flex-wrap gap-2">
              {alsoIn.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/learn/system/${d.id}`}
                    className="inline-block px-3 py-2 text-sm font-medium text-deep hover:bg-surface-hover"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>
    </section>
  );
}
