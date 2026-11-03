"use client";

import { createContext, useContext, useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { loadSearchReading, saveSearchReading, searchReadingKey, type SearchReadingState } from "@/lib/search-reading-state";

const SearchPendingContext = createContext(false);
const FRESH_SEARCH_KEY = "search:fresh-target:v1";
export const useSearchPending = () => useContext(SearchPendingContext);

/** Transitions keep the current results readable; native forms still work before hydration. */
export function SearchExperience({ stateKey, children }: { stateKey: string; children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);
  const freshSearch = useRef(false);
  const save = useRef<(restore?: boolean) => void>(() => {});

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let storage: Storage;
    try { storage = window.sessionStorage; } catch { return; }
    let restoring = true;
    let frame = 0;
    let secondFrame = 0;
    let saveFrame = 0;
    let last: SearchReadingState = { y: window.scrollY, open: [], restore: false };
    let freshTarget = false;
    try {
      freshTarget = storage.getItem(FRESH_SEARCH_KEY) === searchReadingKey(stateKey);
      if (freshTarget) storage.removeItem(FRESH_SEARCH_KEY);
    } catch { /* Some private browsing modes expose storage but block its methods. */ }
    const snapshot = (restore = last.restore) => {
      if (restoring || !element.isConnected) return;
      last = { y: window.scrollY, open: [...element.querySelectorAll<HTMLDetailsElement>("details[data-search-detail][open]")].map((details) => details.dataset.searchDetail!), restore };
      saveSearchReading(storage, stateKey, last);
    };
    save.current = snapshot;
    const stored = loadSearchReading(storage, stateKey);
    if (stored?.restore && !freshSearch.current && !freshTarget) {
      const open = new Set(stored.open);
      element.querySelectorAll<HTMLDetailsElement>("details[data-search-detail]").forEach((details) => { details.open = open.has(details.dataset.searchDetail!); });
      last = { ...stored, restore: false };
      frame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          window.scrollTo({ top: stored.y, behavior: "instant" });
          restoring = false;
          snapshot(false);
        });
      });
    } else {
      restoring = false;
      if (freshSearch.current || freshTarget) window.scrollTo({ top: 0, behavior: "instant" });
      snapshot(false);
    }
    freshSearch.current = false;
    const onScroll = () => {
      if (restoring || saveFrame) return;
      saveFrame = requestAnimationFrame(() => { saveFrame = 0; snapshot(); });
    };
    const onToggle = () => snapshot();
    const onPageHide = () => snapshot(true);
    const onPopState = () => snapshot(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("toggle", onToggle, true);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("popstate", onPopState);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
      cancelAnimationFrame(saveFrame);
      saveSearchReading(storage, stateKey, last);
      window.removeEventListener("scroll", onScroll);
      element.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("popstate", onPopState);
      save.current = () => {};
    };
  }, [stateKey]);

  useEffect(() => {
    if (!pending && freshSearch.current) {
      freshSearch.current = false;
      try { window.sessionStorage.removeItem(FRESH_SEARCH_KEY); } catch { /* Storage is optional. */ }
      window.scrollTo({ top: 0, behavior: "instant" });
      save.current(false);
    }
  }, [pending]);

  const navigate = (url: URL) => {
    save.current(false);
    try {
      const stored = loadSearchReading(window.sessionStorage, url.href);
      if (stored) saveSearchReading(window.sessionStorage, url.href, { ...stored, restore: false });
      window.sessionStorage.setItem(FRESH_SEARCH_KEY, searchReadingKey(url.href));
    } catch { /* Searching still works without storage. */ }
    freshSearch.current = true;
    startTransition(() => {
      if (searchReadingKey(url.href) === searchReadingKey(stateKey)) router.refresh();
      else router.push(`${url.pathname}${url.search}`, { scroll: false });
    });
  };

  return <SearchPendingContext.Provider value={pending}>
    <div ref={root} className="flex flex-1 flex-col" onSubmitCapture={(event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.getAttribute("action") !== "/search") return;
      event.preventDefault();
      const url = new URL("/search", window.location.origin);
      for (const [key, value] of new FormData(form)) if (typeof value === "string") url.searchParams.append(key, value);
      navigate(url);
    }} onClickCapture={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === "/search") { event.preventDefault(); navigate(url); }
      else save.current(true);
    }}>
      {children}
    </div>
  </SearchPendingContext.Provider>;
}

/** Local loading feedback leaves the search form and existing results visible. */
export function SearchLoadingIndicator() {
  const pending = useSearchPending();
  if (!pending) return null;
  return (
    <div role="status" aria-live="polite" className="sticky top-4 z-30 mb-5 flex items-center gap-3 rounded-card border border-accent bg-card px-4 py-4 shadow-sm">
      <LoaderCircle size={24} aria-hidden="true" className="shrink-0 animate-spin text-accent motion-reduce:animate-none" />
      <div className="min-w-0">
        <p className="font-semibold text-deep">搜尋中，正在載入結果…</p>
        <p className="mt-1 text-sm text-muted">關鍵字與目前結果會保留，完成後自動更新</p>
      </div>
    </div>
  );
}
