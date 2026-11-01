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
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { overlayMotion } from "@/lib/motion";
import { DesktopBackLink } from "@/components/shell/DesktopBackBar";
import { useHideOnScrollDown } from "@/lib/use-hide-on-scroll";
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
  /** page 模式的左側目錄；panel 模式不顯示 */
  tocPanel?: React.ReactNode;
  children: React.ReactNode;
  /**
   * page:知識頁本身，接管視窗捲動(scroll-spy)與網址 #id。
   * panel:在章節頁等處打開的知識面板。面板有自己的捲動區，底下那一頁的
   * 網址 hash 屬於那一頁(如章節頁的 #topic-123)，所以不讀也不寫 hash。
   */
  variant?: "page" | "panel";
  /** panel 模式打開時要定位的段落 id */
  initialId?: string;
}

/**
 * 知識頁的兩欄外框:左目錄 / 右文章。
 * (原本的右欄「相關知識點」已拿掉:內文已有連結,引用關係改放在頁尾「參見」。)
 *
 * 摺疊狀態放這裡而不是各段落自己記:「全部收合」與「跳到某段要先展開祖先」
 * 都需要一個看得到整棵樹的地方。
 */
export function ArticleShell({
  slug,
  toc,
  tocPanel,
  children,
  variant = "page",
  initialId,
}: ArticleShellProps) {
  const isPanel = variant === "panel";
  const parentOf = useMemo(() => flatten(toc, null, new Map()), [toc]);
  // 重點摘要預設收合(帶 #summary 進頁時 reveal 會展開)
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(toc.some((n) => n.id === "summary") ? ["summary"] : []),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const tocHidden = useHideOnScrollDown();
  const reduce = useReducedMotion();

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
      if (opts?.push && !isPanel) history.pushState(null, "", `#${id}`);
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
    [ancestorsOf, parentOf, isPanel],
  );

  // 進頁時若帶 #id(從別頁的連結過來),展開並定位
  useEffect(() => {
    if (isPanel) {
      if (!initialId) return;
      // 等面板內容排好版再定位
      const frame = requestAnimationFrame(() => reveal(initialId));
      return () => cancelAnimationFrame(frame);
    }
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) reveal(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reveal, isPanel, initialId]);

  // scroll-spy:最後一個捲過視窗上緣的標題就是「目前段落」
  useEffect(() => {
    // 面板沒有目錄，不需要追蹤目前段落
    if (isPanel) return;
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
  }, [collapsed, isPanel]);

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

  if (isPanel) {
    return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
  }

  return (
    <ArticleContext.Provider value={value}>
      {/* lg：目錄＋內文兩欄。xl 以上內文欄固定寬度、放在畫面正中央，目錄靠在內文左邊(第三欄留白與第一欄對稱) */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 bg-card px-4 py-6 md:bg-transparent lg:grid-cols-[240px_minmax(0,1fr)] xl:max-w-none xl:grid-cols-[minmax(240px,1fr)_minmax(0,54rem)_minmax(0,1fr)]">
        <aside className="hidden lg:block xl:w-[240px] xl:justify-self-end">
          <div className="sticky top-[calc(var(--desk-bar)+1rem)] max-h-[calc(100vh-2rem-var(--desk-bar))] overflow-y-auto pr-1">
            <DesktopBackLink className="-ml-1 mb-2" />
            {tocPanel}
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* 窄螢幕:目錄改成底部抽屜。按鈕疊在「回到頂端」(ScrollTopButton，size-11)上方，兩顆不重疊；
          手機還要讓開底部頁籤。往下捲(在讀內文)時收起不擋字，往上捲才出現；鍵盤聚焦時一定看得到 */}
      <button
        type="button"
        onClick={() => setDrawer(true)}
        className={`fixed right-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+1rem+2.75rem+0.75rem)] z-30 flex items-center gap-1.5 rounded-full bg-deep px-3.5 py-2 text-sm font-medium text-on-accent shadow-md transition-[opacity,translate] duration-200 ease-out hover:opacity-90 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 md:right-6 md:bottom-[calc(1.5rem+2.75rem+0.75rem)] lg:hidden ${
          tocHidden ? "pointer-events-none translate-y-3 opacity-0" : ""
        }`}
      >
        <List size={16} /> 目錄
      </button>

      {/* 目錄抽屜：從底部滑上來、關閉時滑回去 */}
      <AnimatePresence>
        {drawer && (
          <div key="toc" className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <motion.button
              {...overlayMotion("scrim", reduce)}
              type="button"
              aria-label="關閉"
              className="absolute inset-0 bg-black/30"
              onClick={() => setDrawer(false)}
            />
            <motion.div
              {...overlayMotion("sheet", reduce)}
              className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-card p-4 pb-8 shadow-xl"
            >
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ArticleContext.Provider>
  );
}
