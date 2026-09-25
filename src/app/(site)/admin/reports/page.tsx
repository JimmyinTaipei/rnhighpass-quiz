import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevMode } from "@/lib/dev-mode";
import { getAllReports, getQuestionsByIds } from "@/lib/data";
import { REPORT_STATUS_LABELS, type ReportStatus } from "@/lib/report-fields";
import { Panel } from "@/components/ui/Panel";
import { ReportAdminRow } from "@/components/admin/ReportAdminRow";

// 刻意不設 metadata 標題：非 admin 拿到的 404 頁不應透露這裡有管理頁

export default async function AdminReportsPage(props: PageProps<"/admin/reports">) {
  // 非 admin(或沒開 dev mode)一律當作頁面不存在，不透露這裡有管理頁
  if (!(await getDevMode())) notFound();

  const searchParams = await props.searchParams;
  const raw = typeof searchParams.status === "string" ? searchParams.status : "new";
  const status = raw in REPORT_STATUS_LABELS ? (raw as ReportStatus) : undefined;

  const reports = await getAllReports(status);
  const questionIds = reports.flatMap((r) => (r.question_id ? [r.question_id] : []));
  const questions = await getQuestionsByIds(questionIds);
  const chapterOf = new Map(questions.map((q) => [q.id, q.primary_chapter_id]));

  const filters: { key: string; label: string }[] = [
    ...(Object.keys(REPORT_STATUS_LABELS) as ReportStatus[]).map((k) => ({
      key: k,
      label: REPORT_STATUS_LABELS[k],
    })),
    { key: "all", label: "全部" },
  ];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <Panel>
        <h1 className="mb-4 text-2xl font-bold text-deep">回報管理</h1>
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={`/admin/reports?status=${f.key}`}
              className={`rounded-full border px-3 py-1 text-xs ${
                (status ?? "all") === f.key
                  ? "border-subj-accent bg-subj-light font-medium text-subj-deep"
                  : "border-card-border text-body"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        {reports.length === 0 ? (
          <p className="text-sm text-muted">沒有符合的回報。</p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => {
              const chapterId = r.question_id ? chapterOf.get(r.question_id) : null;
              return (
                <ReportAdminRow
                  key={`${r.id}-${r.status}`}
                  report={r}
                  questionHref={chapterId ? `/chapters/${chapterId}` : null}
                />
              );
            })}
          </ul>
        )}
      </Panel>
    </main>
  );
}
