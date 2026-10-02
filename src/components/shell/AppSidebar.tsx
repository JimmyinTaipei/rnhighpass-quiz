"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePagePathname } from "@/lib/use-page-pathname";
import { PanelLeftClose, PanelLeftOpen, UserRound } from "lucide-react";
import {
  activeItemHref,
  NAV_SECTIONS,
  sectionOf,
  type NavItem,
  type NavSection,
} from "@/lib/nav-items";

/** 閱讀類頁面：側邊欄預設收成圖示列，把寬度讓給內容(iPad Notes 的做法) */
const isReadingPath = (p: string) => /^\/(chapters|learn\/(?!(?:system|type|peds)(?:\/|$))[^/]+)(\/|$)/.test(p) && !p.endsWith("/quiz");

const STORE_KEY = "sidebar-pinned";

function readPref(kind: "reading" | "normal"): boolean | null {
  try {
    const v = sessionStorage.getItem(`${STORE_KEY}:${kind}`);
    return v === null ? null : v === "1";
  } catch {
    return null;
  }
}

function writePref(kind: "reading" | "normal", pinned: boolean) {
  try {
    sessionStorage.setItem(`${STORE_KEY}:${kind}`, pinned ? "1" : "0");
  } catch {
    // 無痕模式等情況存不了，只是下一頁回到預設
  }
}

interface AppSidebarProps {
  /** 展開時底部的帳號區(UserStatus，server component) */
  account: React.ReactNode;
}

/**
 * md 以上的全站側邊欄，對應 iPadOS 的 sidebar。
 *
 * 兩種狀態：
 * - pinned(釘住展開)：只在 lg 以上生效，側邊欄佔 240px、內容往右讓。
 *   閱讀頁預設不釘，其他頁預設釘；使用者切換後依「閱讀頁 / 其他頁」分開記在 sessionStorage。
 * - overlay(暫時展開)：md–lg(iPad 直向)或沒釘住時，點圖示列頂端的按鈕，
 *   以浮層蓋在內容上，選完或點外面就收起，不擠壓閱讀中的內容。
 */
export function AppSidebar({ account }: AppSidebarProps) {
  const pathname = usePagePathname();
  const reading = isReadingPath(pathname);
  const kind = reading ? "reading" : "normal";
  const [prefs, setPrefs] = useState<Record<string, boolean | null>>({ reading: null, normal: null });
  const [overlay, setOverlay] = useState(false);

  // sessionStorage 在 SSR 讀不到，hydration 後再套用使用者的選擇
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setPrefs({ reading: readPref("reading"), normal: readPref("normal") }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // 換頁就收起浮層
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOverlay(false);
  }

  const pinned = prefs[kind] ?? !reading;
  const section = sectionOf(pathname);
  const activeHref = activeItemHref(pathname);

  const toggle = () => {
    // lg 以上切換「釘住」；更窄時只開關浮層
    if (window.matchMedia("(min-width: 1024px)").matches) {
      const next = !pinned;
      writePref(kind, next);
      setPrefs((p) => ({ ...p, [kind]: next }));
      setOverlay(false);
    } else {
      setOverlay((o) => !o);
    }
  };

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 border-r border-card-border bg-sidebar/80 transition-[width] duration-200 ease-out motion-reduce:transition-none md:block ${
          pinned ? "w-[68px] lg:w-60" : "w-[68px]"
        }`}
      >
        <SidebarBody
          expanded={pinned ? "lg" : "never"}
          section={section}
          activeHref={activeHref}
          account={account}
          onToggle={toggle}
        />
      </aside>

      {overlay && (
        <div className="fixed inset-0 z-40 hidden md:block">
          <button
            type="button"
            aria-label="關閉側邊欄"
            className="absolute inset-0 bg-black/20"
            onClick={() => setOverlay(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-card-border bg-card shadow-2xl">
            <SidebarBody
              expanded="always"
              section={section}
              activeHref={activeHref}
              account={account}
              onToggle={() => setOverlay(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

type Expanded = "always" | "lg" | "never";

// 展開時才顯示的元素(文字、群組標題)用的 class。
// 要完整寫出每個字串：Tailwind 只掃描原始碼裡的完整 class 名，組出來的 `lg:${x}` 不會產生。
const SHOW: Record<"inline" | "block", Record<Expanded, string>> = {
  inline: { always: "inline", lg: "hidden lg:inline", never: "hidden" },
  block: { always: "block", lg: "hidden lg:block", never: "hidden" },
};
const showWhen = (e: Expanded, display: "inline" | "block" = "inline") => SHOW[display][e];

function SidebarBody({
  expanded,
  section,
  activeHref,
  account,
  onToggle,
}: {
  expanded: Expanded;
  section: string;
  activeHref: string | null;
  account: React.ReactNode;
  onToggle: () => void;
}) {
  // 釘住(lg)時：lg 以上是展開的，按了會收合；更窄時看到的是圖示列，按了會展開浮層
  const toggleLabel = expanded === "always" ? "收合側邊欄" : expanded === "never" ? "展開側邊欄" : "切換側邊欄";
  const row = expanded === "always" ? "justify-start" : expanded === "lg" ? "justify-center lg:justify-start" : "justify-center";

  return (
    <nav aria-label="主選單" className="flex h-full flex-col gap-1 overflow-y-auto px-2.5 py-3">
      <div className={`mb-2 flex items-center gap-2 px-1 ${row}`}>
        <Link href="/" className={`${showWhen(expanded)} flex-1 truncate text-lg font-bold tracking-wide text-deep`}>
          多保命
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={toggleLabel}
          title={toggleLabel}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-deep active:scale-95"
        >
          {expanded === "lg" ? (
            <>
              <PanelLeftOpen size={20} className="lg:hidden" />
              <PanelLeftClose size={20} className="hidden lg:block" />
            </>
          ) : expanded === "never" ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {NAV_SECTIONS.map((s) =>
        s.items.length === 0 ? (
          <SidebarLink
            key={s.key}
            item={s}
            active={section === s.key}
            expanded={expanded}
          />
        ) : (
          <SidebarGroup key={s.key} section={s} activeHref={activeHref} expanded={expanded} />
        ),
      )}

      <div className="mt-auto border-t border-card-border pt-3">
        <div className={showWhen(expanded, "block")}>{account}</div>
        {/* 收合時帳號區放不下，改成連到「我的」 */}
        <Link
          href="/me"
          title="我的"
          aria-label="我的"
          className={`${expanded === "always" ? "hidden" : expanded === "lg" ? "flex lg:hidden" : "flex"} justify-center rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-deep`}
        >
          <UserRound size={20} />
        </Link>
      </div>
    </nav>
  );
}

function SidebarGroup({
  section,
  activeHref,
  expanded,
}: {
  section: NavSection;
  activeHref: string | null;
  expanded: Expanded;
}) {
  return (
    <div className="mt-3">
      <p className={`${showWhen(expanded, "block")} mb-1 px-3 text-xs font-semibold tracking-wide text-muted`}>
        {section.label}
      </p>
      {/* 收合時用一條細線分隔群組，取代群組標題 */}
      <div
        className={`${expanded === "always" ? "hidden" : expanded === "lg" ? "block lg:hidden" : "block"} mx-3 mb-2 border-t border-card-border`}
      />
      <div className="flex flex-col gap-0.5">
        {section.items.map((item) => (
          <SidebarLink key={item.href} item={item} active={activeHref === item.href} expanded={expanded} />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  expanded,
}: {
  item: Pick<NavItem, "href" | "label" | "icon">;
  active: boolean;
  expanded: Expanded;
}) {
  const Icon = item.icon;
  const row = expanded === "always" ? "justify-start" : expanded === "lg" ? "justify-center lg:justify-start" : "justify-center";
  return (
    <Link
      href={item.href}
      title={item.label}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors active:scale-[0.98] motion-reduce:transition-none ${row} ${
        active ? "bg-deep font-semibold text-on-accent" : "text-body hover:bg-surface-hover hover:text-deep"
      }`}
    >
      <Icon size={19} strokeWidth={active ? 2.3 : 1.9} className="shrink-0" />
      <span className={`${showWhen(expanded)} truncate`}>{item.label}</span>
    </Link>
  );
}
