"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { updateTable } from "@/lib/actions";
import { validateTablePatch } from "@/lib/table-fields";
import type { ComparisonTable } from "@/lib/types";

/**
 * dev mode：比較表編輯器。格狀編輯每一格，可增刪列與欄。
 * 送出前先用同一份 validateTablePatch 做即時檢查，server 端還會再驗一次。
 */
export function TableEditForm({ table }: { table: ComparisonTable }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(table.title);
  const [reason, setReason] = useState(table.reason ?? "");
  const [headers, setHeaders] = useState<string[]>(table.headers);
  const [rows, setRows] = useState<string[][]>(table.rows);
  const [note, setNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setTitle(table.title);
    setReason(table.reason ?? "");
    setHeaders(table.headers);
    setRows(table.rows);
    setNote(null);
    setOpen(false);
  };

  const setCell = (ri: number, ci: number, value: string) =>
    setRows((rs) => rs.map((r, i) => (i === ri ? r.map((c, j) => (j === ci ? value : c)) : r)));

  const addRow = () => setRows((rs) => [...rs, headers.map(() => "")]);
  const removeRow = (ri: number) => setRows((rs) => rs.filter((_, i) => i !== ri));
  const addColumn = () => {
    setHeaders((hs) => [...hs, ""]);
    setRows((rs) => rs.map((r) => [...r, ""]));
  };
  const removeColumn = (ci: number) => {
    setHeaders((hs) => hs.filter((_, i) => i !== ci));
    setRows((rs) => rs.map((r) => r.filter((_, i) => i !== ci)));
  };

  const save = () => {
    const payload = { title, reason, headers, rows };
    const check = validateTablePatch(payload);
    if (!check.ok) {
      setNote(check.reason);
      return;
    }
    setNote(null);
    startTransition(async () => {
      const result = await updateTable(table.id, payload);
      if (result.ok) {
        setNote("已儲存");
        setOpen(false);
      } else {
        setNote(`儲存失敗：${result.reason ?? "未知原因"}`);
      }
    });
  };

  const edited = table.edited_fields ?? [];

  if (!open) {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-btn border border-warning/50 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning transition-colors hover:bg-warning/20"
        >
          <Pencil size={12} />
          編輯這張表
        </button>
        <span className="font-mono text-[11px] text-muted">id={table.id}</span>
        {edited.length > 0 && (
          <span className="text-xs text-warning">已手改：{edited.join(", ")}</span>
        )}
        {note && <span className="text-xs text-muted">{note}</span>}
      </div>
    );
  }

  const input =
    "w-full rounded-btn border border-card-border bg-card px-2 py-1 text-sm text-strong focus:border-subj-accent focus:outline-none";

  return (
    <div className="mb-6 rounded-card border border-warning/50 bg-warning/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-warning">編輯比較表・{table.id}</h4>
        <button onClick={reset} aria-label="取消" className="rounded p-1 text-muted hover:text-body">
          <X size={16} />
        </button>
      </div>

      <label className="mb-1 block text-xs font-medium text-body">標題</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} className={`${input} mb-3`} />

      <label className="mb-1 block text-xs font-medium text-body">說明（為何值得比較）</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        className={`${input} mb-3 leading-relaxed`}
      />

      <div className="overflow-x-auto rounded-card border border-card-border bg-card">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="border-b border-r border-card-border p-1 align-top">
                  <div className="flex items-start gap-1">
                    <textarea
                      value={h}
                      onChange={(e) =>
                        setHeaders((hs) => hs.map((x, i) => (i === ci ? e.target.value : x)))
                      }
                      rows={1}
                      className={`${input} font-bold`}
                    />
                    <button
                      onClick={() => removeColumn(ci)}
                      disabled={headers.length <= 1}
                      aria-label="刪除此欄"
                      className="mt-1 text-muted hover:text-incorrect disabled:opacity-30"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </th>
              ))}
              <th className="w-8 border-b border-card-border p-1">
                <button onClick={addColumn} aria-label="新增一欄" className="text-muted hover:text-subj-deep">
                  <Plus size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-b border-r border-card-border p-1 align-top">
                    <textarea
                      value={cell}
                      onChange={(e) => setCell(ri, ci, e.target.value)}
                      rows={2}
                      className={`${input} leading-relaxed`}
                    />
                  </td>
                ))}
                <td className="border-b border-card-border p-1 text-center align-top">
                  <button
                    onClick={() => removeRow(ri)}
                    aria-label="刪除此列"
                    className="mt-1 text-muted hover:text-incorrect"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRow}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-subj-deep hover:underline"
      >
        <Plus size={12} />
        新增一列
      </button>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-1 rounded-btn bg-subj-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Save size={14} />
          {isPending ? "儲存中…" : "儲存"}
        </button>
        <button
          onClick={reset}
          className="rounded-btn border border-card-border bg-card px-4 py-2 text-sm font-medium text-body"
        >
          取消
        </button>
        {note && <span className="text-xs text-incorrect">{note}</span>}
      </div>
    </div>
  );
}
