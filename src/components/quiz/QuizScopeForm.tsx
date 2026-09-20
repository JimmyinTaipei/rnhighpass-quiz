"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";
import type { Chapter } from "@/lib/types";

interface QuizScopeFormProps {
  subjectId: string;
  chapters: Chapter[];
  questionCounts: Record<number, number>;
  minYear: number;
  maxYear: number;
}

const COUNT_OPTIONS = [20, 50, 100, 0] as const; // 0 = 全部

export function QuizScopeForm({
  subjectId,
  chapters,
  questionCounts,
  minYear,
  maxYear,
}: QuizScopeFormProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [fromYear, setFromYear] = useState(minYear);
  const [toYear, setToYear] = useState(maxYear);
  const [count, setCount] = useState<number>(50);
  const [order, setOrder] = useState<"random" | "original">("random");

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectedTotal = [...selected].reduce((sum, id) => sum + (questionCounts[id] ?? 0), 0);

  const submit = () => {
    const params = new URLSearchParams();
    params.set("chapters", [...selected].join(","));
    params.set("from", String(fromYear));
    params.set("to", String(toYear));
    if (count > 0) params.set("count", String(count));
    params.set("order", order);
    // subjectId 這個 prop 是從父層的 params.subjectId 原封不動傳下來的，
    // 本身已經是路由參數該有的編碼字串了(App Router 不會自動 decode，
    // 每個頁面要自己 decodeURIComponent 一次)。這裡再 encode 一次會變成
    // 雙重編碼，下一頁單次 decode 只會剝回單次編碼的狀態、查不到科目而 404。
    router.push(`/quiz/${subjectId}/run?${params}`);
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-subj-deep">選擇章節</h2>
          <button
            onClick={() => setSelected(new Set(chapters.map((c) => c.id)))}
            className="rounded-btn border border-card-border bg-card px-3 py-1 text-xs font-medium text-body hover:border-subj-accent"
          >
            整科全選
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="rounded-btn border border-card-border bg-card px-3 py-1 text-xs font-medium text-body hover:border-subj-accent"
          >
            全不選
          </button>
          <span className="text-sm text-muted">
            已選 {selected.size} 章・約 {selectedTotal} 題
          </span>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {chapters.map((c) => {
            const on = selected.has(c.id);
            return (
              <label
                key={c.id}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-card border p-3 text-sm transition-colors ${
                  on
                    ? "border-subj-accent bg-subj-light"
                    : "border-card-border bg-card hover:border-subj-accent"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(c.id)}
                    className="size-4 shrink-0 accent-[var(--subj-accent)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{c.chapter_no}</span>
                    <span className="block font-medium text-subj-deep">{c.title}</span>
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {questionCounts[c.id] ?? 0} 題
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-sm font-bold text-subj-deep">年份區間（民國）</h3>
          <div className="flex items-center gap-2">
            <select
              value={fromYear}
              onChange={(e) => {
                const v = Number(e.target.value);
                setFromYear(v);
                if (v > toYear) setToYear(v);
              }}
              className="rounded-btn border border-card-border bg-card px-2 py-1.5 text-sm text-strong"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span className="text-muted">—</span>
            <select
              value={toYear}
              onChange={(e) => {
                const v = Number(e.target.value);
                setToYear(v);
                if (v < fromYear) setFromYear(v);
              }}
              className="rounded-btn border border-card-border bg-card px-2 py-1.5 text-sm text-strong"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-subj-deep">題目數量</h3>
          <div className="flex flex-wrap gap-1.5">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-btn border px-3 py-1.5 text-sm font-medium transition-colors ${
                  count === n
                    ? "border-subj-accent bg-subj-light text-subj-deep"
                    : "border-card-border bg-card text-body hover:border-subj-accent"
                }`}
              >
                {n === 0 ? "全部" : n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-subj-deep">出題順序</h3>
          <div className="flex gap-1.5">
            {(["random", "original"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOrder(o)}
                className={`rounded-btn border px-3 py-1.5 text-sm font-medium transition-colors ${
                  order === o
                    ? "border-subj-accent bg-subj-light text-subj-deep"
                    : "border-card-border bg-card text-body hover:border-subj-accent"
                }`}
              >
                {o === "random" ? "隨機" : "依原始順序"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        onClick={submit}
        disabled={selected.size === 0}
        className="flex items-center gap-2 rounded-btn bg-subj-accent px-5 py-2.5 font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Play size={16} />
        {selected.size === 0 ? "請先選擇章節" : "開始測驗"}
      </button>
    </div>
  );
}
