"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listFavoriteIds, setFavorite } from "@/lib/actions";

interface FavoritesContextValue {
  /** null = 還在載入 */
  loggedIn: boolean | null;
  isFavorite: (questionId: string) => boolean;
  /** 成功回傳 null；失敗回傳原因(狀態已自動退回) */
  toggle: (questionId: string) => Promise<"not_logged_in" | "failed" | null>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * 收藏狀態的 client 端快取。
 *
 * 刻意在掛載後才用 action 抓，而不是在 (site)/layout 裡 server 端查：
 * layout 讀 cookies 會讓各頁的 loading.tsx 失效(見 NavBar 的註解)。
 * 收藏清單通常只有幾十到幾百個 id，抓一次整站共用。
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    listFavoriteIds()
      .then((res) => {
        if (cancelled) return;
        setLoggedIn(res.loggedIn);
        setIds(new Set(res.ids));
      })
      .catch(() => {
        if (!cancelled) setLoggedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      if (loggedIn === false) return "not_logged_in" as const;
      const next = !ids.has(id);
      const apply = (on: boolean) =>
        setIds((prev) => {
          const copy = new Set(prev);
          if (on) copy.add(id);
          else copy.delete(id);
          return copy;
        });
      apply(next); // optimistic
      try {
        const res = await setFavorite(id, next);
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
