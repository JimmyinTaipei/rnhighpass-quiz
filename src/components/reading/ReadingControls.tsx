"use client";

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";

/**
 * 閱讀頁的展開／收合控制。
 *
 * 內容區的每個主題都是原生 <details data-topic>(server component 渲染)，
 * 這裡只負責批次切換 open，所以整棵樹不需要變成 client component。
 */
export function ReadingControls() {
  const setAll = (open: boolean) => {
    document
      .querySelectorAll<HTMLDetailsElement>("details[data-topic]")
      .forEach((el) => {
        el.open = open;
      });
  };

  // 從大綱點連結過來時，目標預設是收合的，要順手打開(含所有祖先層)
  useEffect(() => {
    const openTarget = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      let el: HTMLElement | null = target;
      while (el) {
        if (el instanceof HTMLDetailsElement) el.open = true;
        el = el.parentElement;
      }
      target.scrollIntoView({ block: "start" });
    };
    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setAll(true)}
        className="flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-1.5 text-sm font-medium text-body transition-colors hover:border-subj-accent hover:text-subj-deep"
      >
        <ChevronsUpDown size={14} />
        全部展開
      </button>
      <button
        onClick={() => setAll(false)}
        className="flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-1.5 text-sm font-medium text-body transition-colors hover:border-subj-accent hover:text-subj-deep"
      >
        <ChevronsDownUp size={14} />
        全部收合
      </button>
    </div>
  );
}
