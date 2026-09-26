"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { List, X } from "lucide-react";
import type { TocNode } from "./toc";

interface ArticleContextValue {
  slug: string;
  activeId: string | null;
  isCollapsed: (id: string) => boolean;
  toggle: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  /** 展開祖先、捲過去、閃一下,並把 #id 寫進網址 */
  reveal: (id: string, opts?: { push?: boolean }) => void;
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

export function useArticle() {
  return useContext(ArticleContext);
}

function flatten(nodes: TocNode[], parent: string | null, out: Map<string, string | null>) {
  for (const n of nodes) {
    out.set(n.id, parent);
    flatten(n.children, n.id, out);
  }
  return out;
}

interface ArticleShellProps {
  slug: string;
  toc: TocNode[];
  tocPanel: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 知識頁的兩欄外框:左目錄 / 右文章。
 * (原本的右欄「相關知識點」已拿掉:內文已有連結,引用關係改放在頁尾「參見」。)
 *
 * 摺疊狀態放這裡而不是各段落自己記:「全部收合」與「跳到某段要先展開祖先」
 * 都需要一個看得到整棵樹的地方。
 */
export function ArticleShell({ slug, toc, tocPanel, children }: ArticleShellProps) {
  const parentOf = useMemo(() => flatten(toc, null, new Map()), [toc]);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);

  const ancestorsOf = useCallback(
    (id: string) => {
      const out: string[] = [];
      let p = parentOf.get(id) ?? null;
      while (p) {
        out.push(p);
        p = parentOf.get(p) ?? null;
      }
      return out;
    },
    [parentOf],
  );

  const reveal = useCallback(
    (id: string, opts?: { push?: boolean }) => {
      if (!parentOf.has(id)) return;
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(id);
        for (const a of ancestorsOf(id)) next.delete(a);
        return next;
      });
      setDrawer(false);
      if (opts?.push) history.pushState(null, "", `#${id}`);
      // 等展開後的版面算好再捲
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.removeAttribute("data-flash");
        void el.offsetWidth; // 重新觸發動畫
        el.setAttribute("data-flash", "");
      });
    },
    [ancestorsOf, parentOf],
  );

  // 進頁時若帶 #id(從別頁的連結過來),展開並定位
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) reveal(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reveal]);

  // scroll-spy:最後一個捲過視窗上緣的標題就是「目前段落」
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headings = document.querySelectorAll<HTMLElement>("[data-kb-heading]");
      let current: string | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top > 140) break;
        if (h.offsetParent !== null) current = h.id;
      }
      setActiveId(current ?? headings[0]?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [collapsed]);

  const value = useMemo<ArticleContextValue>(
    () => ({
      slug,
      activeId,
      isCollapsed: (id) => collapsed.has(id),
      toggle: (id) =>
        setCollapsed((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      expandAll: () => setCollapsed(new Set()),
      // 收合全部 = 只留下最上層標題(子段落跟著父段落一起藏起來)
      collapseAll: () => setCollapsed(new Set(toc.map((n) => n.id))),
      reveal,
    }),
    [slug, activeId, collapsed, reveal, toc],
  );

  return (
    <ArticleContext.Provider value={value}>
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">{tocPanel}</div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* 窄螢幕:目錄改成底部抽屜。bottom-20 讓開手機的底部頁籤 */}
      <button
        type="button"
        onClick={() => setDrawer(true)}
        className="fixed right-4 bottom-20 z-30 flex items-center gap-1.5 rounded-full bg-deep px-3.5 py-2 text-sm font-medium text-on-accent shadow-md hover:opacity-90 md:bottom-6 lg:hidden"
      >
        <List size={16} /> 目錄
      </button>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="關閉"
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-card p-4 pb-8 shadow-xl">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="rounded p-1 text-muted hover:bg-surface-hover"
                aria-label="關閉"
              >
                <X size={18} />
              </button>
            </div>
            {tocPanel}
          </div>
        </div>
      )}
    </ArticleContext.Provider>
  );
}
