"use client";

import { sittingLabel } from "@/lib/sitting-filter";

// 梯次區間選單，題目瀏覽(SittingFilterBar)與測驗設定(QuizScopeForm)共用。

// 觸控裝置字小於 16px 會放大頁面，所以下拉選單用 max(16px, 1rem)(同輸入框)
const selectClass =
  "min-w-0 rounded-btn border border-card-border bg-card py-1.5 pr-1 pl-2 text-[max(16px,1rem)] text-strong focus:outline-none focus:ring-2 focus:ring-accent/40 md:text-sm";

/** 「114-2 到 115-2」(補考寫「106-2 補」)。起點選得比終點晚時，另一端自動跟上 */
export function SittingRangeSelect({
  sittings,
  from: rawFrom,
  to: rawTo,
  onChange,
}: {
  /** 舊到新 */
  sittings: string[];
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  // 網址上的梯次不一定存在(例如還沒考的 115-3)：起點對到之後最近的一梯、終點對到之前最近的一梯
  const from = sittings.find((s) => s >= rawFrom) ?? sittings[sittings.length - 1] ?? rawFrom;
  const to = [...sittings].reverse().find((s) => s <= rawTo) ?? sittings[0] ?? rawTo;
  const options = sittings.map((s) => (
    <option key={s} value={s}>
      {sittingLabel(s)}
    </option>
  ));
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
      <span className="w-10 shrink-0 font-medium text-muted">範圍</span>
      <select
        aria-label="從哪一次"
        value={from}
        onChange={(e) => onChange(e.target.value, e.target.value > to ? e.target.value : to)}
        className={selectClass}
      >
        {options}
      </select>
      <span className="text-muted">到</span>
      <select
        aria-label="到哪一次"
        value={to}
        onChange={(e) => onChange(e.target.value < from ? e.target.value : from, e.target.value)}
        className={selectClass}
      >
        {options}
      </select>
    </div>
  );
}
