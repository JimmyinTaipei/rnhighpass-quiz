"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReportButton } from "@/components/report/ReportButton";
import { KNOWLEDGE_REPORT_CATEGORIES } from "@/lib/report-fields";
import { useArticle } from "./ArticleShell";

interface CollapsibleSectionProps {
  id: string;
  depth: number;
  number: string;
  title: string;
  children: React.ReactNode;
  /** dev mode(本機)才傳：標題旁的編輯器 */
  titleEditor?: React.ReactNode;
  /** 這一段的考題數(考題區塊在整個階層最後)；>0 時標題旁顯示「N 題 ↓」 */
  questionCount?: number;
  questionsAnchor?: string;
}

const HEADING_STYLE: Record<number, string> = {
  2: "text-xl font-bold text-deep",
  3: "text-lg font-semibold text-deep",
  4: "text-base font-semibold text-strong",
  5: "text-base font-medium text-strong",
};

/**
 * 一個知識點。標題列整條可點來摺疊;內容用 hidden 藏起來而不是卸載,
 * 讓 server 渲染好的內容(含考題)不必重新產生。
 */
export function CollapsibleSection({
  id,
  depth,
  number,
  title,
  children,
  titleEditor,
  questionCount = 0,
  questionsAnchor,
}: CollapsibleSectionProps) {
  const ctx = useArticle();
  const collapsed = ctx?.isCollapsed(id) ?? false;
  // 使用者點過才加淡入：頁面剛載入時展開的段落不要整頁一起淡入
  const [touched, setTouched] = useState(false);
  const Heading = `h${Math.min(depth, 6)}` as "h2";
  // 一、與（一）可以回報、收藏；頁尾綜合考題不用
  const canFavorite = ctx && depth <= 3 && id !== "questions";

  // 跳到本段考題並展開；段落收合時先展開段落，等畫面更新後再捲動
  const jumpToQuestions = () => {
    if (!questionsAnchor) return;
    if (collapsed) ctx?.toggle(id);
    requestAnimationFrame(() => {
      const el = document.getElementById(questionsAnchor);
      if (!(el instanceof HTMLDetailsElement)) return;
      el.open = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section
      className={
        depth === 2 ? "mt-8 border-t border-card-border pt-5 first:mt-0 first:border-t-0 first:pt-0" : "mt-5"
      }
    >
      <div className={`group/heading flex items-start gap-1 ${titleEditor ? "flex-wrap" : ""}`}>
        <Heading
          id={id}
          data-kb-heading=""
          className={`kb-heading group min-w-0 flex-1 scroll-mt-4 ${HEADING_STYLE[depth] ?? HEADING_STYLE[5]}`}
        >
          <button
            type="button"
            onClick={() => {
              setTouched(true);
              ctx?.toggle(id);
            }}
            aria-expanded={!collapsed}
            className="-ml-1 flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-surface-hover"
          >
            <ChevronRight
              size={depth === 2 ? 20 : 16}
              className={`mt-[0.2em] shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${
                collapsed ? "" : "rotate-90"
              }`}
            />
            <span className="shrink-0 tabular-nums">{number}</span>
            <span className="min-w-0">{title}</span>
          </button>
        </Heading>
        {questionCount > 0 && questionsAnchor && (
          <button
            type="button"
            onClick={jumpToQuestions}
            title="跳到這一段的考題"
            className="relative mt-1 shrink-0 rounded-full bg-fill px-2 py-0.5 text-xs font-medium whitespace-nowrap text-body tabular-nums transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-fill-strong"
          >
            {questionCount} 題 ↓
          </button>
        )}
        {canFavorite && (
          // 回報(旗子)、收藏(星號)，順序同題目卡。星號一直顯示；旗子在有滑鼠的裝置滑到標題才出現
          // (每段都有一面旗子太吵)，觸控裝置沒有滑過的動作，所以一直顯示
          <div className="mt-1 flex shrink-0 items-center gap-4">
            <span className="inline-flex [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/heading:opacity-100 [@media(hover:hover)]:focus-within:opacity-100">
              <ReportButton
              title="建議改進"
              targetLabel={`段落「${number.trim()}${title}」`}
              defaultCategory="suggestion"
              categories={KNOWLEDGE_REPORT_CATEGORIES}
              pagePath={`/learn/${ctx.slug}#${id}`}
              />
            </span>
            <FavoriteButton
              questionId={`${ctx.slug}#${id}`}
              kind="knowledge"
              label="這一段"
              size={depth === 2 ? 17 : 15}
            />
          </div>
        )}
        {titleEditor}
      </div>
      {/* hidden → 顯示時 CSS 動畫會重新播一次，所以每次展開都會淡入；收起維持瞬間 */}
      <div hidden={collapsed} className={`${depth >= 3 ? "pl-2 sm:pl-4" : ""} ${touched ? "fade-in" : ""}`}>
        {children}
      </div>
    </section>
  );
}
