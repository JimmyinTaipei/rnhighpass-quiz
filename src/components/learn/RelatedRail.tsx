"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Layers } from "lucide-react";
import type { KnowledgePreview } from "@/lib/knowledge/types";
import { useArticle } from "./ArticleShell";

export interface SectionRelations {
  /** 這段連出去的知識點 */
  outgoing: KnowledgePreview[];
  /** 別頁連到這段 */
  incoming: KnowledgePreview[];
  /** 別頁嵌入了這段 */
  embeddedIn: KnowledgePreview[];
}

interface RelatedRailProps {
  /** 段落 id → 關聯。子段落的關聯會併進祖先,捲到大標題時也看得到底下的連結 */
  relations: Record<string, SectionRelations>;
  /** 連到整頁的地方 */
  articleIncoming: KnowledgePreview[];
  sectionTitles: Record<string, string>;
}

function Item({ p }: { p: KnowledgePreview }) {
  return (
    <li>
      <Link href={p.href} className="block rounded px-2 py-1.5 hover:bg-surface-hover">
        <span className="block text-sm font-medium leading-snug text-deep">
          {p.number && <span className="mr-0.5 tabular-nums">{p.number}</span>}
          {p.title}
        </span>
        {p.number !== null && (
          <span className="block truncate text-xs text-muted">{[p.articleTitle, ...p.path].join(" › ")}</span>
        )}
      </Link>
    </li>
  );
}

function Group({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: KnowledgePreview[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="mb-1 flex items-center gap-1.5 px-2 text-xs font-semibold tracking-wide text-muted">
        {icon}
        {label}
      </p>
      <ul>
        {items.map((p) => (
          <Item key={p.key} p={p} />
        ))}
      </ul>
    </div>
  );
}

/** 引用本頁的地方依來源頁分組:一頁一列,底下列出是哪幾段 */
function SourceArticles({ items }: { items: KnowledgePreview[] }) {
  if (items.length === 0) return null;
  const groups = new Map<string, KnowledgePreview[]>();
  for (const p of items) groups.set(p.articleTitle, [...(groups.get(p.articleTitle) ?? []), p]);
  return (
    <div className="mb-4">
      <p className="mb-1 flex items-center gap-1.5 px-2 text-xs font-semibold tracking-wide text-muted">
        <ArrowDownLeft size={13} />
        引用本頁的頁面({groups.size})
      </p>
      <ul>
        {[...groups].map(([title, list]) => (
          <li key={title} className="px-2 py-1.5">
            <Link href={list[0].href.split("#")[0]} className="text-sm font-medium text-deep hover:underline">
              {title}
            </Link>
            <span className="ml-1 text-xs text-muted">{list.length} 處</span>
            <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              {list.map((p) => (
                <Link key={p.key} href={p.href} className="text-xs text-body hover:text-deep hover:underline">
                  {p.number}
                  {p.title}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 右欄「相關知識點」:跟著 scroll-spy 換成目前閱讀段落的外連與反向連結。
 */
export function RelatedRail({ relations, articleIncoming, sectionTitles }: RelatedRailProps) {
  const ctx = useArticle();
  const active = ctx?.activeId ?? null;
  const rel = active ? relations[active] : undefined;
  const empty =
    !rel || (rel.outgoing.length === 0 && rel.incoming.length === 0 && rel.embeddedIn.length === 0);

  return (
    <div>
      <p className="mb-1 px-2 text-sm font-semibold text-deep">相關知識點</p>
      {active && (
        <p className="mb-3 truncate px-2 text-xs text-muted">目前段落:{sectionTitles[active]}</p>
      )}

      {rel && (
        <>
          <Group icon={<ArrowUpRight size={13} />} label="本段連到" items={rel.outgoing} />
          <Group icon={<Layers size={13} />} label="本段被嵌入於" items={rel.embeddedIn} />
          <Group icon={<ArrowDownLeft size={13} />} label="連到本段" items={rel.incoming} />
        </>
      )}
      {empty && <p className="mb-4 px-2 text-sm text-muted">這一段沒有連到其他知識點。</p>}

      <div className="border-t border-card-border pt-3">
        <SourceArticles items={articleIncoming} />
        {articleIncoming.length === 0 && (
          <p className="px-2 text-sm text-muted">目前沒有其他頁面引用本頁。</p>
        )}
      </div>
    </div>
  );
}
