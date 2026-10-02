import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Flag,
  House,
  Library,
  ListChecks,
  MonitorCheck,
  Search,
  ShieldCheck,
  Stethoscope,
  Table2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

// 全站導覽的唯一設定：電腦版側邊欄、手機底部頁籤、手機頂部返回鍵都讀這一份。
// 分區對應 iPadOS 的側邊欄群組與 iOS 的底部頁籤——同一個分區在兩種裝置上是同一個位置。

export type SectionKey = "home" | "study" | "practice" | "search" | "me";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 這些路徑前綴都算「在這一項」(預設只有 href 本身與其子路徑) */
  prefixes?: string[];
}

export interface NavSection {
  key: SectionKey;
  label: string;
  icon: LucideIcon;
  /** 手機頁籤點下去的落點 */
  href: string;
  /** 側邊欄群組裡的項目；空陣列 = 側邊欄只顯示一列(首頁、搜尋) */
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  { key: "home", label: "首頁", icon: House, href: "/", items: [] },
  {
    key: "study",
    label: "學習",
    icon: BookOpen,
    href: "/subjects",
    items: [
      { href: "/subjects", label: "科目", icon: BookOpen, prefixes: ["/subjects", "/chapters"] },
      { href: "/learn", label: "知識庫", icon: Library, prefixes: ["/learn", "/k"] },
      { href: "/diseases", label: "疾病索引", icon: Stethoscope },
      { href: "/tables", label: "比較表", icon: Table2 },
    ],
  },
  {
    key: "practice",
    label: "練習",
    icon: ListChecks,
    href: "/quiz",
    items: [
      { href: "/quiz", label: "出題", icon: ListChecks },
      { href: "/mistakes", label: "我的題本", icon: AlertCircle, prefixes: ["/mistakes", "/quiz/review"] },
      { href: "/mock-exam", label: "歷年考題模擬", icon: MonitorCheck },
    ],
  },
  { key: "search", label: "搜尋", icon: Search, href: "/search", items: [] },
  {
    key: "me",
    label: "我的",
    icon: UserRound,
    href: "/me",
    items: [
      { href: "/stats", label: "統計", icon: BarChart3 },
      { href: "/report", label: "回報問題", icon: Flag },
      { href: "/privacy", label: "隱私與資料", icon: ShieldCheck },
    ],
  },
];

const under = (pathname: string, prefix: string) =>
  prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`);

/** 做題頁：不論從哪裡進來(章節、知識頁)，都屬於「練習」 */
const isQuizPath = (pathname: string) =>
  /^\/(chapters|learn)\/[^/]+\/quiz$/.test(pathname);

/** 目前網址屬於哪個分區(側邊欄與頁籤亮哪一格) */
export function sectionOf(pathname: string): SectionKey {
  if (pathname === "/") return "home";
  if (isQuizPath(pathname)) return "practice";
  for (const s of NAV_SECTIONS) {
    if (s.key === "home") continue;
    if (under(pathname, s.href)) return s.key;
    if (s.items.some((i) => (i.prefixes ?? [i.href]).some((p) => under(pathname, p)))) return s.key;
  }
  if (under(pathname, "/admin")) return "me";
  return "home";
}

/** 目前網址對應的側邊欄項目 href(最長前綴優先，/quiz/review 算題本而不是出題) */
export function activeItemHref(pathname: string): string | null {
  if (isQuizPath(pathname)) return null;
  let best: { href: string; len: number } | null = null;
  for (const s of NAV_SECTIONS) {
    for (const i of s.items) {
      for (const p of i.prefixes ?? [i.href]) {
        if (under(pathname, p) && (!best || p.length > best.len)) best = { href: i.href, len: p.length };
      }
    }
  }
  return best?.href ?? null;
}

export interface ParentLink {
  href: string;
  label: string;
}

/**
 * 手機頂部返回鍵的去處。分區首頁(頁籤直接到得了的頁)回傳 null、不顯示返回鍵。
 * 返回鍵優先用瀏覽器上一頁(保留捲動位置)，站外進來或第一頁時才用這裡的連結。
 */
export function parentOf(pathname: string): ParentLink | null {
  const seg = pathname.split("/").filter(Boolean);
  const [a, b, c] = seg;
  if (seg.length === 0) return null;
  switch (a) {
    case "chapters":
      if (c === "quiz") return { href: `/chapters/${b}`, label: "本章" };
      return { href: "/subjects", label: "科目" };
    case "subjects":
      return b ? { href: "/subjects", label: "科目" } : null;
    case "learn":
      if (!b) return null;
      if (c === "quiz") return { href: `/learn/${b}`, label: "知識頁" };
      return { href: "/learn", label: "知識庫" };
    case "diseases":
      return b ? { href: "/diseases", label: "疾病索引" } : null;
    case "tables":
      return b ? { href: "/tables", label: "比較表" } : null;
    case "quiz":
      if (b === "review") return { href: "/mistakes", label: "我的題本" };
      if (c === "run") return { href: `/quiz/${b}`, label: "出題設定" };
      return b ? { href: "/quiz", label: "練習" } : null;
    case "stats":
    case "report":
    case "privacy":
    case "admin":
      return { href: "/me", label: "我的" };
    default:
      return null;
  }
}

/** 手機頂部標題：目前項目的名稱，沒有就用分區名稱 */
export function titleOf(pathname: string): string {
  if (pathname === "/") return "多保命";
  const href = activeItemHref(pathname);
  for (const s of NAV_SECTIONS) {
    const item = s.items.find((i) => i.href === href);
    if (item) return item.label;
  }
  if (isQuizPath(pathname)) return "練習";
  return NAV_SECTIONS.find((s) => s.key === sectionOf(pathname))?.label ?? "多保命";
}

/** 手機上分區首頁頂端的分段切換(取代側邊欄的第二層)。只在這些分區的項目首頁出現 */
export function segmentsFor(pathname: string): NavItem[] | null {
  for (const s of NAV_SECTIONS) {
    if (s.key !== "study" && s.key !== "practice") continue;
    if (s.items.some((i) => i.href === pathname)) return s.items;
  }
  return null;
}
