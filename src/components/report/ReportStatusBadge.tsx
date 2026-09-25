import { REPORT_STATUS_LABELS, type ReportStatus } from "@/lib/report-fields";

const STYLES: Record<ReportStatus, string> = {
  new: "bg-warning/10 text-warning",
  resolved: "bg-correct-bg text-correct-text",
  wontfix: "bg-page text-muted",
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {REPORT_STATUS_LABELS[status]}
    </span>
  );
}
