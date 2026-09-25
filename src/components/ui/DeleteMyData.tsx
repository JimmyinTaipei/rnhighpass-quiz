"use client";

import { useState, useTransition } from "react";
import { deleteMyData } from "@/lib/actions";

/** 刪除自己所有作答紀錄與收藏。要手動輸入「刪除」才會送出。 */
export function DeleteMyData() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-btn border border-incorrect/50 px-4 py-2 text-sm font-medium text-incorrect-text hover:bg-incorrect-bg"
      >
        刪除我的所有紀錄
      </button>
    );
  }

  return (
    <div className="rounded-card border border-incorrect/50 bg-incorrect-bg/40 p-4 text-sm">
      <p className="mb-2 text-strong">
        會永久刪除你的<strong>作答紀錄、錯題本與收藏</strong>，無法復原。確定的話請輸入「刪除」。
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-28 rounded-btn border border-card-border bg-card px-2 py-1.5"
          aria-label="輸入「刪除」確認"
        />
        <button
          disabled={text !== "刪除" || isPending}
          onClick={() =>
            startTransition(async () => {
              const res = await deleteMyData(text);
              setMsg(res.ok ? "已刪除。" : `刪除失敗：${res.reason}`);
              if (res.ok) {
                setText("");
                setOpen(false);
              }
            })
          }
          className="rounded-btn bg-incorrect px-4 py-1.5 font-medium text-white disabled:opacity-40"
        >
          {isPending ? "刪除中…" : "確定刪除"}
        </button>
        <button onClick={() => setOpen(false)} className="text-muted underline">
          取消
        </button>
      </div>
      {msg && <p className="mt-2 text-xs">{msg}</p>}
    </div>
  );
}
