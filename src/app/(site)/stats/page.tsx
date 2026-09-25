import Link from "next/link";
import { getAllChapterQuestionCounts, getTopicChapterMap } from "@/lib/data";
import { computeChapterStats } from "@/lib/quiz-utils";
import { requireUser } from "@/lib/auth";
import { parseRange, type DashboardRange } from "@/lib/dashboard";
import { loadDashboard } from "@/lib/dashboard-data";
import { busiestSubject } from "@/lib/notebook";
import { subjectGroup } from "@/lib/subject-groups";
import { Panel } from "@/components/ui/Panel";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";

export const metadata = { title: "統計 | 多保命" };

export default async function StatsPage(props: PageProps<"/stats">) {
  await requireUser("/stats");
  const searchParams = await props.searchParams;
  const range = parseRange(typeof searchParams.range === "string" ? searchParams.range : undefined);
  const requested = typeof searchParams.subject === "string" ? searchParams.subject : null;

  const [{ dashboard, answers, questions, chapters, subjects }, totalByChapter] = await Promise.all([
    loadDashboard(range),
    getAllChapterQuestionCounts(),
  ]);
  const topicChapter = await getTopicChapterMap(
    questions.flatMap((q) => (q.topic_id != null ? [q.topic_id] : [])),
  );

  // 題目算在哪一章：走 topics(和涵蓋率分母一致)，沒有 topic 才退回 primary_chapter_id
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const chapterOf = (id: string) => {
    const q = questionById.get(id);
    if (!q) return null;
    return (q.topic_id != null ? topicChapter.get(q.topic_id) : undefined) ?? q.primary_chapter_id;
  };
  const stats = computeChapterStats([...questionById.keys()], answers, chapterOf);
  const chapterById = new Map(chapters.map((c) => [c.id, c]));

  // 科目選擇器上的數字 = 該科已作答的題目數
  const answeredBySubject = new Map<string, number>();
  for (const s of stats) {
    const subjectId = chapterById.get(s.chapterId)?.subject_id;
    if (subjectId) answeredBySubject.set(subjectId, (answeredBySubject.get(subjectId) ?? 0) + s.answered);
  }
  const subjectId =
    requested && subjects.some((s) => s.id === requested)
      ? requested
      : busiestSubject(answeredBySubject, subjects);
  const subject = subjects.find((s) => s.id === subjectId);

  const statByChapter = new Map(stats.map((s) => [s.chapterId, s]));
  const subjectChapters = chapters
    .filter((c) => c.subject_id === subjectId)
    .sort((a, b) => a.order_index - b.order_index);

  const href = (params: { range?: DashboardRange; subject?: string | null }) => {
    const q = new URLSearchParams();
    const r = params.range ?? range;
    if (r !== "30") q.set("range", r);
    const s = params.subject === undefined ? subjectId : params.subject;
    if (s) q.set("subject", s);
    const qs = q.toString();
    return qs ? `/stats?${qs}` : "/stats";
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <Panel>
        <h1 className="mb-4 text-2xl font-bold text-deep">統計</h1>
        {answers.length === 0 ? (
          <p className="text-muted">還沒有作答紀錄，去練習題目吧！</p>
        ) : (
          <Dashboard data={dashboard} rangeHref={(r) => href({ range: r })} />
        )}
      </Panel>

      {answers.length > 0 && subjectId && (
        <Panel>
          <h2 className="mb-1 text-lg font-bold text-deep">各章正確率與涵蓋率</h2>
          <p className="mb-4 text-xs text-muted">
            正確率以每題最近一次作答為準；涵蓋率 = 已作答題數 / 該章總題數。
          </p>
          <div className="mb-6">
            <SubjectPicker
              subjects={subjects}
              counts={answeredBySubject}
              selected={subjectId}
              hrefFor={(id) => href({ subject: id })}
            />
          </div>
          <div data-group={subject ? subjectGroup(subject) : undefined} className="flex flex-col gap-1">
            {subjectChapters.map((c) => {
              const s = statByChapter.get(c.id);
              const total = totalByChapter.get(c.id) ?? 0;
              const coverage = total === 0 ? 0 : Math.min(100, Math.round(((s?.answered ?? 0) / total) * 100));
              return (
                <Link
                  key={c.id}
                  href={`/chapters/${c.id}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-btn px-2 py-2 transition-colors hover:bg-surface-hover sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]"
                >
                  <span className="truncate text-sm text-strong">
                    {c.chapter_no} {c.title}
                  </span>
                  <span className="col-span-2 row-start-2 flex items-center gap-2 sm:col-span-1 sm:row-start-auto">
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-page" title={`涵蓋率 ${coverage}%`}>
                      <span className="block h-full rounded-full bg-subj-accent" style={{ width: `${coverage}%` }} />
                    </span>
                    <span className="w-24 shrink-0 text-right text-xs text-muted">
                      {s?.answered ?? 0} / {total} 題
                    </span>
                  </span>
                  <span
                    className={`w-12 text-right text-sm font-bold ${
                      !s ? "text-muted" : s.accuracy < 60 ? "text-incorrect-text" : "text-subj-deep"
                    }`}
                  >
                    {s ? `${s.accuracy}%` : "—"}
                  </span>
                </Link>
              );
            })}
          </div>
        </Panel>
      )}
    </main>
  );
}
