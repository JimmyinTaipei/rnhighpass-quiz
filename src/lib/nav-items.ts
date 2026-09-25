import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Flag,
  ListChecks,
  Search,
  Table2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 手機底部頁籤放不下太多項，只有標記的才會出現在那裡 */
  mobile: boolean;
}

// 原本 NavLinks 與 MobileTabBar 各自維護一份一模一樣的陣列，改成共用一份。
export const NAV_ITEMS: NavItem[] = [
  { href: "/subjects", label: "科目", icon: BookOpen, mobile: true },
  { href: "/quiz", label: "測驗", icon: ListChecks, mobile: true },
  { href: "/search", label: "搜尋", icon: Search, mobile: true },
  { href: "/tables", label: "比較表", icon: Table2, mobile: false },
  { href: "/mistakes", label: "我的題本", icon: AlertCircle, mobile: true },
  { href: "/stats", label: "統計", icon: BarChart3, mobile: true },
  { href: "/report", label: "回報", icon: Flag, mobile: false },
];
