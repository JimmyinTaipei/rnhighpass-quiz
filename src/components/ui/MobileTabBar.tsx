"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ListChecks, AlertCircle, BarChart3 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/subjects", label: "科目", icon: BookOpen },
  { href: "/quiz", label: "測驗", icon: ListChecks },
  { href: "/mistakes", label: "錯題本", icon: AlertCircle },
  { href: "/stats", label: "統計", icon: BarChart3 },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-card-border bg-white pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${
              isActive ? "text-deep" : "text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? "font-bold" : ""}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
