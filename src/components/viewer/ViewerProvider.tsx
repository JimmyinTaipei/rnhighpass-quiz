"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export type Viewer = {
  loggedIn: boolean;
  displayName: string | null;
  admin: boolean;
  devMode: boolean;
};

type ViewerState = Viewer & {
  /** 還沒問到 /api/me(第一次載入) */
  loading: boolean;
  /** 登入登出、切換 dev mode 之後重新讀取 */
  refresh: () => Promise<void>;
};

const anonymous: Viewer = { loggedIn: false, displayName: null, admin: false, devMode: false };

const ViewerContext = createContext<ViewerState>({ ...anonymous, loading: true, refresh: async () => {} });

/**
 * 目前使用者，在瀏覽器端讀 /api/me。
 * 知識頁是預先產生的靜態頁(伺服器端不知道是誰在看)，登入狀態、admin 與 dev mode 都從這裡拿。
 * 真正的授權仍在 server action 與 RLS 裡，這裡只決定要不要顯示按鈕。
 */
export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [viewer, setViewer] = useState<Viewer>(anonymous);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) setViewer((await res.json()) as Viewer);
    } catch {
      // 網路失敗就維持目前狀態
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const { data } = createClient().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") void refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  return <ViewerContext.Provider value={{ ...viewer, loading, refresh }}>{children}</ViewerContext.Provider>;
}

export function useViewer() {
  return useContext(ViewerContext);
}
