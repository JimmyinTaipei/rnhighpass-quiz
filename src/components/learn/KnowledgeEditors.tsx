"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import { getMetaSource, getSectionSource, saveKnowledgeEdit } from "@/lib/knowledge-edit-actions";

// dev mode(本機)編輯知識庫。開啟編輯器時才向 server 讀 .md 原文，
// 所以編輯的是 Markdown 原文(含粗體、連結語法)，不是畫面上的純文字。

const BTN = "inline-flex items-center gap-1 rounded-btn border px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50";
const BTN_SAVE = `${BTN} border-accent bg-accent text-white hover:bg-deep`;
const BTN_CANCEL = `${BTN} border-card-border bg-card text-body hover:bg-surface-hover`;
const BTN_DEV = `${BTN} border-warning/50 bg-warning/10 text-warning hover:bg-warning/20`;
const INPUT = "w-full rounded-btn border border-card-border bg-card px-2 py-1 text-base font-normal text-strong focus:border-accent focus:outline-none";

function useEditor<T>(load: () => Promise<{ ok: true; value: T } | { ok: false; reason: string }>) {
  const [value, setValue] = useState<T | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const open = () =>
    startTransition(async () => {
      setNote(null);
      const r = await load();
      if (r.ok) setValue(r.value);
      else setNote(r.reason);
    });
  const close = () => {
    setValue(null);
    setNote(null);
  };
  const save = (run: () => ReturnType<typeof saveKnowledgeEdit>) =>
    startTransition(async () => {
      const r = await run();
      if (r.ok) close();
      else setNote(r.reason);
    });

  return { value, setValue, note, isPending, open, close, save };
}

function Note({ text }: { text: string | null }) {
  return text ? <span className="text-xs text-wrong">{text}</span> : null;
}

/** 段落標題旁的鉛筆；開啟後在標題下方顯示輸入框(放在 <h*> 外面，form 不能放進標題元素) */
export function SectionTitleEditor({ slug, id }: { slug: string; id: string }) {
  const ed = useEditor(() => getSectionSource(slug, id));

  if (ed.value === null) {
    return (
      <span className="inline-flex shrink-0 items-center gap-2">
        <button
          type="button"
          title={`編輯標題 #${id}`}
          disabled={ed.isPending}
          onClick={ed.open}
          className="rounded p-1 text-warning opacity-60 hover:bg-warning/10 hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
        <Note text={ed.note} />
      </span>
    );
  }

  return (
    <form
      className="flex basis-full flex-wrap items-center gap-2 py-1"
      onSubmit={(e) => {
        e.preventDefault();
        ed.save(() => saveKnowledgeEdit(slug, { kind: "title", id, title: ed.value!.title }));
      }}
    >
      <input
        autoFocus
        value={ed.value.title}
        onChange={(e) => ed.setValue({ ...ed.value!, title: e.target.value })}
        onKeyDown={(e) => e.key === "Escape" && ed.close()}
        className={`${INPUT} min-w-0 flex-1`}
      />
      <button type="submit" disabled={ed.isPending} className={BTN_SAVE}>
        <Check size={12} /> {ed.isPending ? "儲存中…" : "儲存"}
      </button>
      <button type="button" onClick={ed.close} className={BTN_CANCEL}>
        <X size={12} /> 取消
      </button>
      <span className="font-mono text-[11px] text-muted">#{id}</span>
      <Note text={ed.note} />
    </form>
  );
}

/** 段落內文(不含子段落)的 Markdown 編輯器 */
export function SectionBodyEditor({ slug, id }: { slug: string; id: string }) {
  const ed = useEditor(() => getSectionSource(slug, id));

  if (ed.value === null) {
    return (
      <div className="mb-2 flex items-center gap-2">
        <button type="button" disabled={ed.isPending} onClick={ed.open} className={BTN_DEV}>
          <Pencil size={12} /> {ed.isPending ? "讀取中…" : "編輯內文"}
        </button>
        <Note text={ed.note} />
      </div>
    );
  }

  const lines = ed.value.body.split("\n").length;
  return (
    <div className="my-3 rounded-card border border-warning/50 bg-warning/5 p-3">
      <p className="mb-2 text-xs text-muted">
        編輯 <span className="font-mono">#{id}</span> 的 Markdown 原文(子段落另外編輯；不能在這裡新增標題)。儲存後會重建知識庫。
      </p>
      <textarea
        autoFocus
        value={ed.value.body}
        onChange={(e) => ed.setValue({ ...ed.value!, body: e.target.value })}
        rows={Math.min(Math.max(lines + 2, 6), 30)}
        className={`${INPUT} font-mono text-sm leading-relaxed`}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={ed.isPending}
          onClick={() => ed.save(() => saveKnowledgeEdit(slug, { kind: "body", id, body: ed.value!.body }))}
          className={BTN_SAVE}
        >
          <Check size={12} /> {ed.isPending ? "儲存中…" : "儲存"}
        </button>
        <button type="button" onClick={ed.close} className={BTN_CANCEL}>
          <X size={12} /> 取消
        </button>
        <Note text={ed.note} />
      </div>
    </div>
  );
}

/** 頁面標題與副標題(frontmatter) */
export function ArticleMetaEditor({ slug }: { slug: string }) {
  const ed = useEditor(() => getMetaSource(slug));

  if (ed.value === null) {
    return (
      <span className="inline-flex items-center gap-2">
        <button type="button" disabled={ed.isPending} onClick={ed.open} className={BTN_DEV}>
          <Pencil size={12} /> 編輯頁面標題
        </button>
        <Note text={ed.note} />
      </span>
    );
  }

  return (
    <form
      className="mt-2 w-full space-y-2 rounded-card border border-warning/50 bg-warning/5 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        ed.save(() => saveKnowledgeEdit(slug, { kind: "meta", ...ed.value! }));
      }}
    >
      <label className="block text-xs text-muted">
        標題(title)
        <input
          autoFocus
          value={ed.value.title}
          onChange={(e) => ed.setValue({ ...ed.value!, title: e.target.value })}
          className={INPUT}
        />
      </label>
      <label className="block text-xs text-muted">
        副標題(subtitle，可留空)
        <input
          value={ed.value.subtitle}
          onChange={(e) => ed.setValue({ ...ed.value!, subtitle: e.target.value })}
          className={INPUT}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" disabled={ed.isPending} className={BTN_SAVE}>
          <Check size={12} /> {ed.isPending ? "儲存中…" : "儲存"}
        </button>
        <button type="button" onClick={ed.close} className={BTN_CANCEL}>
          <X size={12} /> 取消
        </button>
        <Note text={ed.note} />
      </div>
    </form>
  );
}
