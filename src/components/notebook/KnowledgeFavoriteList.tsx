import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import type { KnowledgePreview } from "@/lib/knowledge/types";

export interface KnowledgeFavoriteGroup {
  slug: string;
  title: string;
  href: string;
  /** 整頁有沒有收藏(沒有時只是段落的分組標題) */
  pageSaved: boolean;
  sections: KnowledgePreview[];
}

/** 「我的題本 › 知識頁」：依頁分組，整頁一列、收藏的段落縮排在底下(頁名 › 一、段落) */
export function KnowledgeFavoriteList({ groups }: { groups: KnowledgeFavoriteGroup[] }) {
  return (
    <ul className="space-y-2">
      {groups.map((g) => (
        <li key={g.slug} className="rounded-card bg-(--surface-inset) p-3">
          <div className="flex items-center gap-2">
            <Link href={g.href} className="min-w-0 flex-1 font-semibold text-deep hover:underline">
              {g.title}
            </Link>
            {g.pageSaved && <FavoriteButton questionId={g.slug} kind="knowledge" label="這一頁" size={16} />}
          </div>
          {g.sections.length > 0 && (
            <ul className="mt-1.5 space-y-1 border-l border-card-border pl-3">
              {g.sections.map((s) => (
                <li key={s.key} className="flex items-center gap-2 text-sm">
                  <Link href={s.href} className="flex min-w-0 flex-1 items-start gap-1 text-body hover:text-deep hover:underline">
                    <ChevronRight size={14} className="mt-[0.2em] shrink-0 text-muted" />
                    <span className="min-w-0">
                      {s.path.length > 0 && <span className="text-muted">{s.path.join(" › ")} › </span>}
                      {s.number}
                      {s.title}
                    </span>
                  </Link>
                  <FavoriteButton questionId={s.key} kind="knowledge" label="這一段" size={15} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
