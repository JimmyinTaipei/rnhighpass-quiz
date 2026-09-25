import type { ComparisonTable } from "@/lib/types";

/**
 * 比較表的純渲染元件。modal 與 /tables/[tableId] 共用同一份，
 * 確保兩處排版一致。
 */
export function ComparisonTableView({
  table,
  showReason = true,
}: {
  table: ComparisonTable;
  showReason?: boolean;
}) {
  return (
    <div>
      {showReason && table.reason && (
        <p className="mb-3 rounded-btn border-l-4 border-l-subj-accent bg-subj-light/50 p-3 text-sm leading-relaxed text-strong">
          {table.reason}
        </p>
      )}
      {/* 比較表通常有 5~6 欄中文，手機一定放不下 → 水平捲動而不是硬擠 */}
      <div className="overflow-x-auto rounded-card border border-card-border print:overflow-visible">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm print:min-w-0 print:text-xs">
          <thead>
            <tr className="bg-subj-light">
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="border-r border-b border-card-border px-3 py-2 font-bold text-subj-deep last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="break-inside-avoid align-top even:bg-page">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-r border-b border-card-border px-3 py-2 leading-relaxed text-strong last:border-r-0 ${
                      ci === 0 ? "font-medium whitespace-nowrap" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
