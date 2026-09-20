"use client";

import { useState, useTransition } from "react";
import { Pencil, Save, X } from "lucide-react";
import { updateQuestion } from "@/lib/actions";
import { EDITABLE_QUESTION_FIELDS, type EditableQuestionField } from "@/lib/question-fields";
import type { Question } from "@/lib/types";

const FIELD_LABELS: Record<EditableQuestionField, string> = {
  stem: "題幹",
  option_a: "選項 A",
  option_b: "選項 B",
  option_c: "選項 C",
  option_d: "選項 D",
  answer: "答案",
  explanation_text: "詳解原文",
  key_point: "考點",
  correct_reason: "正解原因",
  wrong_options_reason: "其他選項為何錯",
  extra_notes: "延伸提醒",
};

/** 單行輸入就夠的欄位，其餘用 textarea */
const SINGLE_LINE: EditableQuestionField[] = [
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "answer",
];

export function QuestionEditForm({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      EDITABLE_QUESTION_FIELDS.map((f) => [f, (question[f] as string | null) ?? ""]),
    ),
  );
  const [note, setNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setNote(null);
    startTransition(async () => {
      const result = await updateQuestion(question.id, values);
      if (result.ok) {
        setNote("已儲存");
        setOpen(false);
      } else {
        setNote(`儲存失敗：${result.reason ?? "未知原因"}`);
      }
    });
  };

  if (!open) {
    return (
      <div className="mt-3 flex items-center gap-2 border-t border-card-border pt-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-btn border border-warning/50 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning transition-colors hover:bg-warning/20"
        >
          <Pencil size={12} />
          編輯這一題
        </button>
        {question.edited_fields && question.edited_fields.length > 0 && (
          <span className="text-xs text-muted">
            已手動編輯 {question.edited_fields.length} 個欄位（同步時不會被覆蓋）
          </span>
        )}
        {note && <span className="text-xs text-muted">{note}</span>}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-card border border-warning/50 bg-warning/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-warning">編輯題目・{question.id}</h4>
        <button
          onClick={() => setOpen(false)}
          aria-label="取消"
          className="rounded p-1 text-muted hover:text-body"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {EDITABLE_QUESTION_FIELDS.map((field) => (
          <div key={field}>
            <label className="mb-1 block text-xs font-medium text-body">
              {FIELD_LABELS[field]}
              {field === "answer" && (
                // answer 在 DB 是自由文字：可能是 'B or D'、'送分'、'A(原為C)'，
                // 所以刻意用文字輸入而不是 A-D 單選，否則會破壞送分/爭議題的判定
                <span className="ml-1 font-normal text-muted">
                  （自由文字，可填 送分 / B or D / A(原為C)）
                </span>
              )}
            </label>
            {SINGLE_LINE.includes(field) ? (
              <input
                type="text"
                value={values[field]}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                className="w-full rounded-btn border border-card-border bg-card px-2 py-1.5 text-sm text-strong focus:border-subj-accent focus:outline-none"
              />
            ) : (
              <textarea
                value={values[field]}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                rows={field === "stem" ? 3 : 2}
                className="w-full rounded-btn border border-card-border bg-card px-2 py-1.5 text-sm leading-relaxed text-strong focus:border-subj-accent focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

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
          onClick={() => setOpen(false)}
          className="rounded-btn border border-card-border bg-card px-4 py-2 text-sm font-medium text-body"
        >
          取消
        </button>
        {note && <span className="text-xs text-incorrect">{note}</span>}
      </div>
    </div>
  );
}
