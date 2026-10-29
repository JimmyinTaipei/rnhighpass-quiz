"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  href: string;
  active: boolean;
}

/**
 * 手機版的篩選：「分類：疾病 ▾」，點了是原生下拉選單(iPhone 上是系統的選取器，最接近原生 app)。
 * 底部彈出清單只留給目錄用。電腦版仍用一排膠囊，所以這個只在 md 以下出現。
 */
export function FilterSheet({ label, options }: { label: string; options: FilterOption[] }) {
  const router = useRouter();
  const current = options.find((o) => o.active) ?? options[0];
  return (
    <label className="relative inline-flex items-center gap-1 rounded-full border border-card-border bg-card px-3 py-1 text-body focus-within:ring-2 focus-within:ring-accent/40 md:hidden">
      {label}：<span className="font-medium text-deep">{current?.label}</span>
      <ChevronDown size={15} className="text-muted" />
      {/* 透明的原生 select 蓋在整顆按鈕上，點哪裡都會打開系統選單；字級 16px 避免 iOS 放大頁面 */}
      <select
        aria-label={label}
        value={current?.key}
        onChange={(e) => {
          const next = options.find((o) => o.key === e.target.value);
          if (next) router.push(next.href, { scroll: false });
        }}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0 text-[16px]"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
