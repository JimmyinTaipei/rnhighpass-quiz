import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevMode } from "@/lib/dev-mode";
import { getAdminAnalytics, getAllChapters, getQuestionMetaByIds, getSubjects } from "@/lib/data";
import { Panel } from "@/components/ui/Panel";
import { UsageChart } from "@/components/dashboard/UsageChart";

// 刻意不設 metadata 標題：非 admin 拿到的 404 頁不應透露這裡有管理頁

const RANGES = [30, 90, 365] as const;

export default async function AdminAnalyticsPage(props: PageProps<"/admin/analytics">) {
  // 頁面門檻；資料本身在資料庫端還會再驗一次 admin(migration 0012)
  if (!(await getDevMode())) notFound();

  const searchParams = await props.searchParams;
  const requested = Number(searchParams.days);
  const days = RANGES.includes(requested as (typeof RANGES)[number]) ? requested : 30;

  const [analytics, chapters, subjects] = await Promise.all([
    getAdminAnalytics(days),
    getAllChapters(),
    getSubjects(),
  ]);
  const { totals, usage, heat, users, hardest, error } = analytics;
  const hardMeta = await getQuestionMetaByIds(hardest.map((h) => h.question_id));
  const metaById = new Map(hardMeta.map((m) => [m.id, m]));
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const chapterLabel = (id: number) => {
    const c = chapterById.get(id);
    if (!c) return `#${id}`;
    return `${subjectById.get(c.subject_id)?.name ?? ""} ${c.chapter_no} ${c.title}`;
  };

  // 各科熱度：把章節熱度加總到科目
  const subjectHeat = new Map<string, { answers: number }>();
  for (const h of heat) {
    const sid = chapterById.get(h.chapter_id)?.subject_id;
    if (!sid) continue;
    const agg = subjectHeat.get(sid) ?? { answers: 0 };
    agg.answers += h.answers;
    subjectHeat.set(sid, agg);
  }
  const subjectRows = [...subjectHeat.entries()]
    .map(([id, v]) => ({ name: subjectById.get(id)?.name ?? id, ...v }))
    .sort((a, b) => b.answers - a.answers);
  const maxSubject = Math.max(1, ...subjectRows.map((r) => r.answers));

  const th = "border-b border-card-border px-2 py-1.5 text-left text-xs font-medium text-muted";
  const td = "border-b border-card-border px-2 py-1.5";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-deep">使用統計</h1>
          <div className="flex gap-1.5">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/admin/analytics?days=${r}`}
                className={`rounded-full border px-3 py-1 text-xs ${
                  days === r ? "border-accent bg-light font-bold text-deep" : "border-card-border text-body"
                }`}
              >
                近 {r} 天
              </Link>
            ))}
          </div>
        </div>
        <p className="mb-4 text-xs text-muted">
          只顯示彙總數字，看不到任何使用者的帳號或 email。頁面瀏覽量請看 Cloudflare Web Analytics。
        </p>
        {error && (
          <p className="mb-4 rounded-btn bg-incorrect-bg p-3 text-sm text-incorrect-text">
            讀取失敗：{error}（migration 0012 套用了嗎？）
          </p>
        )}
        {totals && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {[
              ["註冊人數", totals.registered_users],
              ["有作答過", totals.users_with_answers],
              ["近 7 天活躍", totals.active_users_7d],
              ["近 30 天活躍", totals.active_users_30d],
              ["近 7 天作答", totals.answers_7d],
              ["累計作答", totals.total_answers],
            ].map(([label, value]) => (
              <div key={label} className="rounded-card border border-card-border bg-page p-3">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 text-xl font-bold text-deep">{Number(value).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <UsageChart
          title="每日活躍人數"
          points={usage.map((u) => {
            const [, m, d] = u.day.split("-");
            return {
              label: `${Number(m)}/${Number(d)}`,
              value: u.active_users,
              detail: `${u.active_users} 人・作答 ${u.answers} 題・新使用者 ${u.new_users}`,
            };
          })}
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 text-lg font-bold text-deep">各科作答量（近 {days} 天）</h2>
          <ul className="space-y-1.5">
            {subjectRows.map((r) => (
              <li key={r.name} className="flex items-center gap-2 text-sm">
                <span className="w-12 shrink-0 text-body">{r.name}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-page">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(r.answers / maxSubject) * 100}%` }} />
                </span>
                <span className="w-14 shrink-0 text-right text-xs text-muted">{r.answers.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <h2 className="mb-3 text-lg font-bold text-deep">熱門章節（近 {days} 天，前 20）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={th}>章節</th>
                  <th className={`${th} text-right`}>作答</th>
                  <th className={`${th} text-right`}>人數</th>
                  <th className={`${th} text-right`}>正確率</th>
                </tr>
              </thead>
              <tbody>
                {heat.slice(0, 20).map((h) => (
                  <tr key={h.chapter_id}>
                    <td className={td}>
                      <Link href={`/chapters/${h.chapter_id}`} className="hover:underline">
                        {chapterLabel(h.chapter_id)}
                      </Link>
                    </td>
                    <td className={`${td} text-right`}>{h.answers}</td>
                    <td className={`${td} text-right`}>{h.users}</td>
                    <td className={`${td} text-right`}>{h.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel>
        <h2 className="mb-1 text-lg font-bold text-deep">全站錯最多的題目</h2>
        <p className="mb-3 text-xs text-muted">以每人最近一次作答計算，至少 5 人作答才列入。只有站長看得到。</p>
        {hardest.length === 0 ? (
          <p className="text-sm text-muted">作答人數還不夠。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={th}>題目</th>
                  <th className={`${th} text-right`}>作答人數</th>
                  <th className={`${th} text-right`}>答錯率</th>
                </tr>
              </thead>
              <tbody>
                {hardest.map((h) => {
                  const m = metaById.get(h.question_id);
                  return (
                    <tr key={h.question_id}>
                      <td className={`${td} max-w-xl`}>
                        <span className="mr-2 font-mono text-xs text-muted">{m?.source_text ?? h.question_id}</span>
                        {m?.primary_chapter_id ? (
                          <Link href={`/chapters/${m.primary_chapter_id}`} className="hover:underline">
                            {m.stem.slice(0, 60)}
                          </Link>
                        ) : (
                          m?.stem.slice(0, 60)
                        )}
                      </td>
                      <td className={`${td} text-right`}>{h.users}</td>
                      <td className={`${td} text-right font-bold text-incorrect-text`}>{h.wrong_rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel>
        <h2 className="mb-1 text-lg font-bold text-deep">使用者分佈（匿名）</h2>
        <p className="mb-3 text-xs text-muted">編號依第一次作答時間排序，每次查詢重新計算，無法對應到真實帳號。</p>
        <div className="max-h-[480px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr>
                <th className={th}>使用者</th>
                <th className={`${th} text-right`}>作答</th>
                <th className={`${th} text-right`}>正確率</th>
                <th className={`${th} text-right`}>活躍天數</th>
                <th className={th}>最常做</th>
                <th className={th}>第一次</th>
                <th className={th}>最後活躍</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_no}>
                  <td className={td}>#{u.user_no}</td>
                  <td className={`${td} text-right`}>{u.answers}</td>
                  <td className={`${td} text-right`}>{u.accuracy}%</td>
                  <td className={`${td} text-right`}>{u.active_days}</td>
                  <td className={td}>{u.top_subject ?? "—"}</td>
                  <td className={td}>{u.first_active}</td>
                  <td className={td}>{u.last_active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </main>
  );
}
