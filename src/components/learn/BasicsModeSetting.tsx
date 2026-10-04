"use client";

import { Sprout } from "lucide-react";
import { BASICS_MODES, setBasicsMode, useBasicsMode, type BasicsMode } from "@/lib/basics-mode";

const LABELS: Record<BasicsMode, string> = {
  collapsed: "收合",
  expanded: "全部展開",
  hidden: "隱藏",
};

/** /me 設定頁:知識頁「想打好基礎」區塊的顯示方式(存在這台裝置) */
export function BasicsModeSetting() {
  const mode = useBasicsMode();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <span className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-correct text-white">
          <Sprout size={16} />
        </span>
        <span className="text-[15px] text-strong">想打好基礎</span>
      </span>
      <div className="segmented" role="group" aria-label="想打好基礎的顯示方式">
        {BASICS_MODES.map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setBasicsMode(m)}>
            {LABELS[m]}
          </button>
        ))}
      </div>
    </div>
  );
}
