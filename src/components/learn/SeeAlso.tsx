import Link from "next/link";
import { ArrowDownLeft, Layers, Shapes } from "lucide-react";
import type { ArticleSummary, KnowledgePreview, TaxonomyDomain, TaxonomyGroup } from "@/lib/knowledge/types";

export interface CitingArticle {
  slug: string;
  title: string;
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
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-deep">
        {icon}
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
export function SeeAlso({ citing, group, siblings, alsoIn }: SeeAlsoProps) {
  const citingCount = citing.reduce((n, g) => n + g.articles.length, 0);
  if (citingCount === 0 && siblings.length === 0 && alsoIn.length === 0) return null;

  return (
    <section id="see-also" className="mt-10 scroll-mt-4 rounded-card bg-(--surface-inset) p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-bold text-deep">參見</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {citingCount > 0 && (
          <div className="md:col-span-2">
            <Block icon={<ArrowDownLeft size={15} />} title={`引用本頁的頁面(${citingCount})`}>
              {/* 依系統分組；每頁一行頁名，引用的段落一行一個「› 段落」縮排在底下 */}
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {citing.map((g) => (
                  <div key={g.id}>
                    <h4 className="mb-1.5 text-xs font-semibold text-muted">
                      {g.name}
                      <span className="ml-1 font-normal tabular-nums">{g.articles.length}</span>
                    </h4>
                    <ul className="space-y-2">
                      {g.articles.map((c) => {
                        const sections = c.places.filter((p) => p.number !== null);
                        return (
                          <li key={c.slug}>
                            <Link href={`/learn/${c.slug}`} className="font-medium text-deep hover:underline">
                              {c.title}
                            </Link>
                            {sections.length > 0 && (
                              <ul className="mt-0.5 space-y-0.5 border-l border-card-border pl-3 text-sm">
                                {sections.map((p) => (
                                  <li key={p.key}>
                                    <Link href={p.href} className="text-body hover:text-deep hover:underline">
                                      <span aria-hidden className="mr-1 text-muted">›</span>
                                      {p.number}
                                      {p.title}
                                    </Link>
                                    {p.embedded && <span className="ml-1 text-xs text-accent">嵌入</span>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Block>
          </div>
        )}

        {group && siblings.length > 0 && (
          <Block icon={<Shapes size={15} />} title={`其他${group.name}(${siblings.length})`}>
            <ul className="flex flex-wrap gap-2">
              {siblings.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/learn/${a.slug}`}
                    className="inline-block rounded-full bg-(--surface-row) px-3 py-1 text-sm text-deep hover:bg-surface-hover"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {alsoIn.length > 0 && (
          <Block icon={<Layers size={15} />} title="也見於">
            <ul className="flex flex-wrap gap-2">
              {alsoIn.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/learn/system/${d.id}`}
                    className="inline-block rounded-full bg-light px-3 py-1 text-sm font-medium text-deep hover:bg-mid"
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
