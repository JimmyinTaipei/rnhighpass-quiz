"use client";

import { useFavorites, type FavoriteKind } from "./FavoritesProvider";

export function FavoriteCount({ kind, initialCount }: { kind: FavoriteKind; initialCount: number }) {
  const favorites = useFavorites();
  return <>{favorites?.loggedIn === true ? favorites.count(kind) : initialCount}</>;
}
