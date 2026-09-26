import Link from "next/link";
import { ArrowDownLeft, Layers, Shapes } from "lucide-react";
import type { ArticleSummary, KnowledgePreview, TaxonomyDomain, TaxonomyGroup } from "@/lib/knowledge/types";

export interface CitingArticle {
  slug: string;
  title: string;
  /** 引用本頁的段落(整頁層級的引用沒有 number) */
  places: (KnowledgePreview & { embedded: boolean })[];
}

interface SeeAlsoProps {
  citing: CitingArticle[];
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
  if (citing.length === 0 && siblings.length === 0 && alsoIn.length === 0) return null;

  return (
    <section id="see-also" className="mt-10 scroll-mt-4 rounded-card border border-card-border bg-page p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-bold text-deep">參見</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {citing.length > 0 && (
          <Block icon={<ArrowDownLeft size={15} />} title={`引用本頁的頁面(${citing.length})`}>
            <ul className="space-y-2.5">
              {citing.map((c) => (
                <li key={c.slug}>
                  <Link href={`/learn/${c.slug}`} className="font-medium text-deep hover:underline">
                    {c.title}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
                    {c.places
                      .filter((p) => p.number !== null)
                      .map((p) => (
                        <Link key={p.key} href={p.href} className="text-body hover:text-deep hover:underline">
                          {p.number}
                          {p.title}
                          {p.embedded && <span className="ml-1 text-xs text-accent">嵌入</span>}
                        </Link>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {group && siblings.length > 0 && (
          <Block icon={<Shapes size={15} />} title={`其他${group.name}(${siblings.length})`}>
            <ul className="flex flex-wrap gap-2">
              {siblings.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/learn/${a.slug}`}
                    className="inline-block rounded-full border border-card-border bg-card px-3 py-1 text-sm text-deep hover:border-accent"
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
