"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, AlertCircle, BarChart3 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/subjects", label: "科目", icon: BookOpen },
  { href: "/mistakes", label: "錯題本", icon: AlertCircle },
  { href: "/stats", label: "統計", icon: BarChart3 },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-deep font-bold text-white"
                : "text-body hover:bg-light/60"
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
