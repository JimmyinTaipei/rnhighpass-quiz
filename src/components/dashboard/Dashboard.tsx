import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Flame, RotateCcw, Tag } from "lucide-react";
import { WEAK_SPOT_MIN, type DashboardData, type DashboardRange } from "@/lib/dashboard";
import { DailyChart } from "./DailyChart";

const RANGE_LABELS: Record<DashboardRange, string> = { "7": "近 7 天", "30": "近 30 天", all: "全部" };

function Tile({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="rounded-card border border-card-border bg-page p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-deep">{value}</p>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-card-border bg-page p-4">
      <h3 className="mb-3 text-sm font-bold text-deep">{title}</h3>
      {children}
    </section>
  );
}

/** 統計頁頂端的錯題分析儀表板 */
export function Dashboard({ data, rangeHref }: { data: DashboardData; rangeHref: (r: DashboardRange) => string }) {
  const { kpi } = data;
  const delta = kpi.accuracyDelta;
  const maxSubject = Math.max(1, ...data.mistakesBySubject.map((s) => s.count));
  const rangeLabel = RANGE_LABELS[data.range];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {(Object.keys(RANGE_LABELS) as DashboardRange[]).map((r) => (
          <Link
            key={r}
            href={rangeHref(r)}
            scroll={false}
            aria-current={data.range === r ? "true" : undefined}
            className={`rounded-full border px-3 py-1 text-xs ${
              data.range === r
                ? "border-accent bg-light font-bold text-deep"
                : "border-card-border bg-card text-body hover:border-accent"
            }`}
          >
            {RANGE_LABELS[r]}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label={`${rangeLabel}作答`} value={`${kpi.answered}`} sub="題次" />
        <Tile
          label={`${rangeLabel}正確率`}
          value={kpi.accuracy == null ? "—" : `${kpi.accuracy}%`}
          sub={
            delta == null ? (
              "沒有可比較的前期資料"
            ) : (
              <span className="flex items-center gap-0.5">
                {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                比前一段 {delta >= 0 ? "+" : ""}
                {delta} 個百分點
              </span>
            )
          }
        />
        <Tile
          label="目前錯題"
          value={`${kpi.currentMistakes}`}
          sub={<Link href="/mistakes" className="text-deep hover:underline">去我的題本 →</Link>}
        />
        <Tile
          label="連續學習"
          value={`${kpi.streakDays} 天`}
          sub={kpi.streakDays > 0 ? <span className="flex items-center gap-0.5"><Flame size={12} />保持下去</span> : "今天做一題開始"}
        />
      </div>

      <Section title="近 14 天每日作答">
        <DailyChart days={data.daily} />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={`弱點章節（${rangeLabel}答錯 ≥ ${WEAK_SPOT_MIN} 題）`}>
          {data.weakChapters.length === 0 ? (
            <p className="text-sm text-muted">目前沒有明顯集中的弱點章節。</p>
          ) : (
            <ul className="space-y-1.5">
              {data.weakChapters.map((c) => (
                <li key={c.chapterId}>
                  <Link
                    href={`/chapters/${c.chapterId}`}
                    className="flex items-center gap-2 rounded-btn px-2 py-1.5 text-sm transition-colors hover:bg-surface-hover"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-xs text-muted">{c.subjectName} </span>
                      <span className="text-strong">{c.label}</span>
                    </span>
                    <span className="shrink-0 text-xs text-incorrect-text">錯 {c.wrongQuestions} 題</span>
                    <span className="w-10 shrink-0 text-right text-xs text-muted">{c.accuracy}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={`弱點標籤（${rangeLabel}答錯 ≥ ${WEAK_SPOT_MIN} 題）`}>
          {data.weakTags.length === 0 ? (
            <p className="text-sm text-muted">目前沒有明顯集中的弱點標籤。</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {data.weakTags.map((t) => {
                const chip = (
                  <>
                    <Tag size={12} className="text-incorrect" />
                    {t.value}
                    <span className="text-muted">{t.wrongQuestions}</span>
                  </>
                );
                const cls =
                  "flex items-center gap-1 rounded-full border border-card-border bg-card px-2.5 py-1 text-xs text-body";
                // 只有疾病標籤有對應頁面
                return t.type === "dz" ? (
                  <Link
                    key={`${t.type}:${t.value}`}
                    href={`/diseases/${encodeURIComponent(t.value)}`}
                    className={`${cls} hover:border-incorrect`}
                  >
                    {chip}
                  </Link>
                ) : (
                  <span key={`${t.type}:${t.value}`} className={cls}>
                    {chip}
                  </span>
                );
              })}
            </div>
          )}
        </Section>

        <Section title="頑固題（錯 2 次以上、還沒訂正）">
          {data.stubborn.length === 0 ? (
            <p className="text-sm text-muted">沒有反覆答錯的題目。</p>
          ) : (
            <ul className="space-y-1.5">
              {data.stubborn.map((q) => (
                <li key={q.id} className="flex items-center gap-2 text-sm">
                  <span className="shrink-0 font-mono text-xs text-muted">{q.source}</span>
                  <span className="min-w-0 flex-1 truncate text-strong">{q.stem}</span>
                  <span className="shrink-0 rounded-full bg-incorrect-bg px-2 py-0.5 text-xs text-incorrect-text">
                    錯 {q.wrongCount} 次
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="各科目前錯題">
          {data.mistakesBySubject.length === 0 ? (
            <p className="text-sm text-muted">目前沒有錯題。</p>
          ) : (
            <ul className="space-y-1.5">
              {data.mistakesBySubject.map((s) => (
                <li key={s.subjectId}>
                  <Link
                    href={`/mistakes?tab=mistakes&subject=${encodeURIComponent(s.subjectId)}`}
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <span className="w-12 shrink-0 text-body">{s.name}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-card">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${(s.count / maxSubject) * 100}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-xs text-muted">{s.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data.mistakesBySubject.length > 0 && (
            <Link
              href="/mistakes"
              className="mt-3 inline-flex items-center gap-1 text-xs text-deep hover:underline"
            >
              <RotateCcw size={12} />
              到我的題本重做
            </Link>
          )}
        </Section>
      </div>
    </div>
  );
}
