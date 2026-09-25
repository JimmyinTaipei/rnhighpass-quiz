import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/data";
import { loadDashboard } from "@/lib/dashboard-data";

/** 首頁的精簡儀表板：近 7 天概況 + 前 3 個弱點。未登入或沒有作答紀錄時不顯示。 */
export async function HomeDashboardCard() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { dashboard, answers } = await loadDashboard("7");
  if (answers.length === 0) return null;

  const { kpi } = dashboard;
  const weakSpots = [
    ...dashboard.weakChapters.map((c) => ({ key: `c${c.chapterId}`, label: `${c.subjectName} ${c.label}`, n: c.wrongQuestions })),
    ...dashboard.weakTags.map((t) => ({ key: `t${t.type}${t.value}`, label: `#${t.value}`, n: t.wrongQuestions })),
  ]
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);
  const wrong7 = dashboard.daily.slice(-7).reduce((n, d) => n + d.wrong, 0);

  return (
    <Link
      href="/stats?range=7"
      className="block w-full max-w-md rounded-card border border-card-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-deep">近 7 天學習概況</h2>
        <ChevronRight size={16} className="text-muted" />
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xl font-bold text-deep">{kpi.answered}</p>
          <p className="text-xs text-muted">作答</p>
        </div>
        <div>
          <p className="text-xl font-bold text-deep">{kpi.accuracy == null ? "—" : `${kpi.accuracy}%`}</p>
          <p className="text-xs text-muted">正確率</p>
        </div>
        <div>
          <p className="text-xl font-bold text-incorrect-text">{wrong7}</p>
          <p className="text-xs text-muted">答錯題次</p>
        </div>
      </div>
      {weakSpots.length > 0 && (
        <div className="border-t border-card-border pt-2">
          <p className="mb-1 text-xs text-muted">最需要加強</p>
          <ul className="space-y-0.5">
            {weakSpots.map((w) => (
              <li key={w.key} className="flex justify-between gap-2 text-sm">
                <span className="truncate text-strong">{w.label}</span>
                <span className="shrink-0 text-xs text-incorrect-text">錯 {w.n} 題</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
}
