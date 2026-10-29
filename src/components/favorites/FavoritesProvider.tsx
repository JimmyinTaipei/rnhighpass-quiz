"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listFavoriteIds, setFavorite, setKnowledgeFavorite } from "@/lib/actions";

/** question = 題目 id；knowledge = 知識頁 "slug" 或 "slug#段落id" */
export type FavoriteKind = "question" | "knowledge";

interface FavoritesContextValue {
  /** null = 還在載入 */
  loggedIn: boolean | null;
  isFavorite: (id: string, kind?: FavoriteKind) => boolean;
  /** 成功回傳 null；失敗回傳原因(狀態已自動退回) */
  toggle: (id: string, kind?: FavoriteKind) => Promise<"not_logged_in" | "failed" | null>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * 收藏狀態的 client 端快取。
 *
 * 刻意在掛載後才用 action 抓，而不是在 (site)/layout 裡 server 端查：
 * layout 讀 cookies 會讓各頁的 loading.tsx 失效(見 NavBar 的註解)。
 * 收藏清單通常只有幾十到幾百個 id，抓一次整站共用。題目與知識頁分兩組存，key 加上前綴。
 */
const keyOf = (id: string, kind: FavoriteKind) => `${kind}:${id}`;

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    listFavoriteIds()
      .then((res) => {
        if (cancelled) return;
        setLoggedIn(res.loggedIn);
        setIds(
          new Set([
            ...res.ids.map((id) => keyOf(id, "question")),
            ...res.knowledge.map((t) => keyOf(t, "knowledge")),
          ]),
        );
      })
      .catch(() => {
        if (!cancelled) setLoggedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback(
    (id: string, kind: FavoriteKind = "question") => ids.has(keyOf(id, kind)),
    [ids],
  );

  const toggle = useCallback(
    async (id: string, kind: FavoriteKind = "question") => {
      if (loggedIn === false) return "not_logged_in" as const;
      const key = keyOf(id, kind);
      const next = !ids.has(key);
      const apply = (on: boolean) =>
        setIds((prev) => {
          const copy = new Set(prev);
          if (on) copy.add(key);
          else copy.delete(key);
          return copy;
        });
      apply(next); // optimistic
      try {
        const res = kind === "knowledge" ? await setKnowledgeFavorite(id, next) : await setFavorite(id, next);
        if (!res.ok) {
          apply(!next);
          if (res.reason === "not_logged_in") {
            setLoggedIn(false);
            return "not_logged_in" as const;
          }
          return "failed" as const;
        }
        return null;
      } catch {
        apply(!next);
        return "failed" as const;
      }
    },
    [ids, loggedIn],
  );

  return (
    <FavoritesContext.Provider value={{ loggedIn, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue | null {
  return useContext(FavoritesContext);
}
