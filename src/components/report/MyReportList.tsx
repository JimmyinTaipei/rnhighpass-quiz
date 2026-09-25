import { REPORT_CATEGORIES, type ErrorReport } from "@/lib/report-fields";
import { ReportStatusBadge } from "./ReportStatusBadge";

/** 使用者自己的回報與處理進度。/report 頁與我的題本共用。 */
export function MyReportList({ reports }: { reports: ErrorReport[] }) {
  if (reports.length === 0) {
    return <p className="text-sm text-muted">還沒有回報紀錄。</p>;
  }
  return (
    <ul className="space-y-2">
      {reports.map((r) => (
        <li key={r.id} className="rounded-card border border-card-border bg-page p-3 text-sm">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <ReportStatusBadge status={r.status} />
            <span>{REPORT_CATEGORIES[r.category]}</span>
            {r.question_id && <span className="font-mono">{r.question_id}</span>}
            <span>{new Date(r.created_at).toLocaleDateString("zh-TW")}</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-strong">{r.message}</p>
          {r.admin_note && (
            <p className="mt-2 rounded-btn border-l-4 border-l-subj-accent bg-card p-2 text-xs leading-relaxed text-body">
              站長回覆：{r.admin_note}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
