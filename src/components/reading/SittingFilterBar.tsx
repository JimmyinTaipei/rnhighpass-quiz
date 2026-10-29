"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SittingRangeSelect } from "./SittingControls";

/**
 * 題目瀏覽的篩選：梯次區間(從…到…，下拉選單)。
 * 改網址參數，由 server 端篩題。測驗設定(QuizScopeForm)用同一組控制項。
 */
export function SittingFilterBar({ sittings, shown, total }: { sittings: string[]; shown: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const first = sittings[0] ?? "";
  const last = sittings[sittings.length - 1] ?? "";

  const replace = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  return (
    <div className={`mb-6 space-y-3 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <SittingRangeSelect
          sittings={sittings}
          from={searchParams.get("from") ?? first}
          to={searchParams.get("to") ?? last}
          // 選回最舊／最新就拿掉參數，網址保持乾淨
          onChange={(from, to) => replace({ from: from === first ? null : from, to: to === last ? null : to })}
        />
        <span className="ml-auto text-sm text-muted tabular-nums">
          {shown === total ? `${total} 題` : `${shown} / ${total} 題`}
        </span>
      </div>
      {shown === 0 && (
        <p className="rounded-card bg-(--surface-inset) px-4 py-3 text-sm text-body">
          這個範圍沒有題目，換一個範圍試試。
        </p>
      )}
    </div>
  );
}
