"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateReportStatus } from "@/lib/actions";
import {
  REPORT_CATEGORIES,
  REPORT_STATUS_LABELS,
  type ErrorReport,
  type ReportStatus,
} from "@/lib/report-fields";
import { ReportStatusBadge } from "@/components/report/ReportStatusBadge";

/** /admin/reports 的一列：顯示回報內容，可改狀態與回覆 */
export function ReportAdminRow({
  report,
  questionHref,
}: {
  report: ErrorReport;
  /** 題目所在章節頁(可直接在那裡開 dev 編輯)；找不到章節時為 null */
  questionHref: string | null;
}) {
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [note, setNote] = useState(report.admin_note ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const res = await updateReportStatus(report.id, status, note);
      setMsg(res.ok ? "已更新" : `失敗：${res.reason}`);
    });

  return (
    <li className="rounded-card border border-card-border bg-page p-4 text-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <ReportStatusBadge status={report.status} />
        <span className="font-medium text-body">{REPORT_CATEGORIES[report.category]}</span>
        <span>#{report.id}</span>
        <span>{new Date(report.created_at).toLocaleString("zh-TW")}</span>
        {report.question_id &&
          (questionHref ? (
            <Link href={questionHref} className="font-mono text-subj-deep hover:underline">
              {report.question_id}
            </Link>
          ) : (
            <span className="font-mono">{report.question_id}</span>
          ))}
        {report.table_id && (
          <Link
            href={`/tables/${encodeURIComponent(report.table_id)}`}
            className="font-mono text-subj-deep hover:underline"
          >
            {report.table_id}
          </Link>
        )}
        {report.page_path && <span className="truncate font-mono">{report.page_path}</span>}
      </div>
      <p className="mb-3 whitespace-pre-wrap leading-relaxed text-strong">{report.message}</p>
      <div className="flex flex-wrap items-start gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReportStatus)}
          className="rounded-btn border border-card-border bg-card px-2 py-1.5 text-xs"
          aria-label="處理狀態"
        >
          {(Object.keys(REPORT_STATUS_LABELS) as ReportStatus[]).map((s) => (
            <option key={s} value={s}>
              {REPORT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
          placeholder="回覆給回報者（選填，對方看得到）"
          className="min-w-0 flex-1 rounded-btn border border-card-border bg-card px-2 py-1.5 text-xs"
        />
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-btn bg-subj-accent px-3 py-1.5 text-xs font-medium text-on-accent disabled:opacity-50"
        >
          {isPending ? "儲存中…" : "儲存"}
        </button>
        {msg && <span className="self-center text-xs text-muted">{msg}</span>}
      </div>
    </li>
  );
}
