"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Send } from "lucide-react";
import { submitReport } from "@/lib/actions";
import {
  GOOGLE_FORM_URL,
  REPORT_CATEGORIES,
  REPORT_MESSAGE_MAX,
  REPORT_MESSAGE_MIN,
  type ReportCategory,
} from "@/lib/report-fields";

interface ReportFormProps {
  questionId?: string;
  tableId?: string;
  /** 題目/比較表的顯示名稱，只用來讓使用者確認自己在回報哪一個 */
  targetLabel?: string;
  defaultCategory?: ReportCategory;
  /** null = 還不知道(載入中) */
  loggedIn: boolean | null;
  onDone?: () => void;
}

/** 錯誤回報表單。modal(題目卡、比較表)與 /report 頁共用。 */
export function ReportForm({
  questionId,
  tableId,
  targetLabel,
  defaultCategory,
  loggedIn,
  onDone,
}: ReportFormProps) {
  const [category, setCategory] = useState<ReportCategory>(
    defaultCategory ?? (questionId ? "question" : "site"),
  );
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (loggedIn === false) {
    return (
      <div className="text-sm text-body">
        <p className="mb-3">登入後就能直接在網站上回報，並追蹤處理進度。</p>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-subj-deep hover:underline"
        >
          不想登入？改用 Google 表單回報
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  if (result?.ok) {
    return (
      <div className="text-sm text-body">
        <p className="mb-3 font-medium text-correct-text">{result.text}</p>
        {onDone && (
          <button
            onClick={onDone}
            className="rounded-btn border border-card-border bg-card px-4 py-2 text-sm font-medium"
          >
            關閉
          </button>
        )}
      </div>
    );
  }

  const submit = () => {
    setResult(null);
    startTransition(async () => {
      const res = await submitReport({
        category,
        message,
        questionId: questionId ?? null,
        tableId: tableId ?? null,
        pagePath: window.location.pathname + window.location.search,
      });
      setResult(
        res.ok
          ? { ok: true, text: "已收到回報，謝謝！處理進度可以在「回報錯誤」頁查看。" }
          : {
              ok: false,
              text: res.reason === "not_logged_in" ? "請先登入" : (res.reason ?? "送出失敗"),
            },
      );
      if (res.ok) setMessage("");
    });
  };

  const length = message.trim().length;

  return (
    <div className="text-sm">
      {targetLabel && (
        <p className="mb-3 rounded-btn bg-page px-3 py-2 text-xs text-muted">回報對象：{targetLabel}</p>
      )}
      <fieldset className="mb-3">
        <legend className="mb-1.5 text-xs font-medium text-body">類型</legend>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(REPORT_CATEGORIES) as ReportCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                category === key
                  ? "border-subj-accent bg-subj-light font-medium text-subj-deep"
                  : "border-card-border bg-card text-body hover:border-subj-accent"
              }`}
            >
              {REPORT_CATEGORIES[key]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mb-1 block text-xs font-medium text-body" htmlFor="report-message">
        說明
      </label>
      <textarea
        id="report-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={REPORT_MESSAGE_MAX}
        rows={4}
        placeholder="例如：答案應該是 C，依據是…"
        className="w-full rounded-btn border border-card-border bg-card px-3 py-2 leading-relaxed text-strong focus:border-subj-accent focus:outline-none"
      />
      <div className="mt-1 mb-3 text-right text-xs text-muted">
        {length} / {REPORT_MESSAGE_MAX}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={isPending || loggedIn === null || length < REPORT_MESSAGE_MIN}
          className="flex items-center gap-1.5 rounded-btn bg-subj-accent px-4 py-2 font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Send size={14} />
          {isPending ? "送出中…" : "送出回報"}
        </button>
        {result && !result.ok && <span className="text-xs text-incorrect">{result.text}</span>}
      </div>
    </div>
  );
}
