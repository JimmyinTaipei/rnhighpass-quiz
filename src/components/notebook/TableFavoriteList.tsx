"use client";

import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import type { KnowledgeTableRef } from "@/lib/knowledge/tables";

export function TableFavoriteList({ items }: {
  items: { id: string; table: KnowledgeTableRef | null }[];
}) {
  const favorites = useFavorites();
  const visible = items.filter((item) => favorites?.loggedIn !== true || favorites.isFavorite(item.id, "table") || favorites.isPending(item.id, "table"));
  if (!visible.length) return <p className="text-muted">還沒有收藏的表格。</p>;
  return (
    <ul className="divide-y divide-card-border">
      {visible.map(({ id, table }) => (
        <li key={id} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            {table ? (
              <>
                <Link href={`/tables/knowledge/${id}`} className="block text-sm font-medium text-deep hover:underline">{table.title}</Link>
                <Link href={`/learn/${table.articleSlug}${table.sectionId ? `#${table.sectionId}` : ""}`} className="mt-1 block text-xs text-muted hover:underline">來源：{table.articleTitle}</Link>
              </>
            ) : <p className="text-sm text-muted">此表格已移除，可取消收藏</p>}
          </div>
          <FavoriteButton questionId={id} kind="table" label="這張表格" className="kb-table-favorite" />
        </li>
      ))}
    </ul>
  );
}
