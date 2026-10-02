"use client";

import Link from "next/link";
import { ChevronRight, Sprout } from "lucide-react";
import { useBasicsMode } from "@/lib/basics-mode";

/**
 * 第二層「想打好基礎」:預設收合,淡色底與固定圖示,國考生一眼知道可以略過。
 * 不是段落,所以不進左側目錄。fullHref 有值時底部加「看完整頁面 →」(第三層)。
 */
export function BasicsBox({
  title,
  fullHref,
  children,
}: {
  title: string;
  fullHref?: string;
  children: React.ReactNode;
}) {
  const mode = useBasicsMode();
  if (mode === "hidden") return null;
  return (
    <details className="kb-basics group my-4 rounded-btn border border-card-border bg-page/70">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2 text-sm text-body [&::-webkit-details-marker]:hidden">
        <ChevronRight size={15} className="shrink-0 text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" />
        <Sprout size={15} className="shrink-0 text-correct" aria-hidden />
        <span className="font-medium text-muted">想打好基礎：</span>
        <span className="min-w-0 font-semibold text-strong">{title}</span>
      </summary>
      <div className="kb-callout-body border-t border-card-border px-4 py-3 text-[0.95em]">
        {children}
        {fullHref && (
          <p className="mt-2 text-sm">
            <Link href={fullHref} className="font-medium text-accent hover:text-deep hover:underline">
              看完整頁面 →
            </Link>
          </p>
        )}
      </div>
    </details>
  );
}
