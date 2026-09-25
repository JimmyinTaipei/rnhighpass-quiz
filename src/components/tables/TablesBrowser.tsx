"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Link2, Search, Table2 } from "lucide-react";
import type { TableChapterSection } from "@/lib/table-placement";

interface TablesBrowserProps {
  subjectId: string;
  sections: TableChapterSection[];
  /** 全站所有表(搜尋用)，含主要歸屬的科目 */
  allTables: { id: string; title: string; subjectId: string; subjectName: string }[];
}

/**
 * 捲到某張表並短暫高亮。直接操作 DOM 屬性而不是 CSS :target 或 React state：
 * Next 的 Link 用 pushState 換網址，:target 不會更新；高亮只是暫時的視覺效果。
 */
function flashTable(id: string, behavior: ScrollBehavior) {
  const el = document.getElementById(`tbl-${id}`);
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior });
  el.setAttribute("data-flash", "");
  const t = setTimeout(() => el.removeAttribute("data-flash"), 2400);
  return () => clearTimeout(t);
}

const tableHref = (id: string) => `/tables/${encodeURIComponent(id)}`;
const anchorHref = (subjectId: string, id: string) =>
  `/tables?subject=${encodeURIComponent(subjectId)}#tbl-${id}`;

/**
 * 比較表的章節分組清單 + 表名搜尋。
 * 主要章節顯示一般卡片；次要章節顯示同一張表的「連結卡」，點下去跳回主要章節那張(並高亮)。
 */
export function TablesBrowser({ subjectId, sections, allTables }: TablesBrowserProps) {
  const [query, setQuery] = useState("");
  // 從別科的連結卡跳過來：元件以 subjectId 為 key 重新掛載，這裡讀網址的 #tbl-xxx
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash);
    if (hash.startsWith("#tbl-")) return flashTable(hash.slice("#tbl-".length), "auto");
  }, []);

  const q = query.trim().toLowerCase();
  const matches = q ? allTables.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 60) : [];

  return (
    <div>
      <label className="mb-6 flex items-center gap-2 rounded-btn border border-card-border bg-card px-3 py-2 focus-within:border-subj-accent">
        <Search size={16} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋所有比較表的名稱"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </label>

      {q ? (
        matches.length === 0 ? (
          <p className="text-sm text-muted">沒有符合的比較表。</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((t) => (
              <Link
                key={t.id}
                href={tableHref(t.id)}
                className="rounded-card border border-card-border border-l-4 border-l-subj-accent bg-page p-3 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="block text-xs text-muted">{t.subjectName}</span>
                <span className="font-medium text-subj-deep">{t.title}</span>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <section key={s.chapterId ?? "none"} id={s.chapterId != null ? `ch-${s.chapterId}` : undefined} className="scroll-mt-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="h-5 w-1.5 rounded-full bg-subj-accent" />
                <h2 className="text-lg font-bold text-subj-deep">{s.label}</h2>
                <span className="text-xs text-muted">
                  {s.primary.length} 張{s.secondary.length > 0 && `・另有 ${s.secondary.length} 張相關`}
                </span>
                {s.chapterId != null && (
                  <Link href={`/chapters/${s.chapterId}`} className="ml-auto text-xs text-subj-deep hover:underline">
                    看章節
                  </Link>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {s.primary.map((t) => (
                  <Link
                    key={t.id}
                    id={`tbl-${t.id}`}
                    href={tableHref(t.id)}
                    className="table-card flex scroll-mt-24 items-start gap-2 rounded-card border border-card-border border-l-4 border-l-subj-accent bg-page p-3 text-sm font-medium text-subj-deep shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Table2 size={16} className="mt-0.5 shrink-0 text-subj-accent" />
                    <span className="min-w-0 flex-1">{t.title}</span>
                    {t.count > 0 && <span className="shrink-0 text-xs font-normal text-muted">{t.count} 題</span>}
                  </Link>
                ))}
                {s.secondary.map((t) => (
                  <Link
                    key={`sec-${t.id}`}
                    href={anchorHref(t.primarySubjectId, t.id)}
                    onClick={() => {
                      // 同一科內跳轉不會重新掛載，直接在這裡觸發高亮與捲動
                      if (t.primarySubjectId !== subjectId) return;
                      flashTable(t.id, "smooth");
                    }}
                    title={`這張表主要放在 ${t.primaryLabel}`}
                    className="flex items-start gap-2 rounded-card border border-dashed border-card-border bg-card p-3 text-sm text-body transition-colors hover:border-subj-accent hover:text-subj-deep"
                  >
                    <Link2 size={16} className="mt-0.5 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      {t.title}
                      <span className="mt-0.5 block text-xs text-muted">主要在 {t.primaryLabel}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          {sections.length === 0 && subjectId && <p className="text-sm text-muted">這一科沒有比較表。</p>}
        </div>
      )}
    </div>
  );
}
