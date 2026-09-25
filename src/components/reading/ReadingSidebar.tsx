"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SubjectSwitcher } from "./SubjectSwitcher";
import { NodeCounts, TopicTree } from "./TopicTree";
import { Skeleton } from "@/components/ui/Skeleton";
import { writePosition } from "@/lib/reading-position";
import { buildChapterGroups, buildSidebarChapters, type TreeNode } from "@/lib/reading-nav";
import { subjectGroup } from "@/lib/subject-groups";
import type { Chapter, Subject } from "@/lib/types";

interface ReadingSidebarProps {
  subjects: Subject[];
  /** 全站章節。目前在哪一章是從網址推的，所以這裡不能只給一科。 */
  chapters: Chapter[];
  /** chapter id -> 題數 / 筆記數(serialize 過的 Map) */
  questionCounts: [number, number][];
  cardCounts: [number, number][];
  /** 當前章節的節點樹，來自 chapters/@tree 這個平行路由 slot */
  children: React.ReactNode;
}

/**
 * 閱讀頁側邊欄：科目切換 ▸ Ch 列表 ▸ 展開中章節的節點樹。
 *
 * 掛在 chapters/layout.tsx。那一層不含動態參數，是 /chapters/1 與 /chapters/2
 * 的共用 layout 段，所以換章時 Next 不會重繪它——左側列表留在原地，只有右側
 * page 與 @tree slot 換掉。代價是 layout 拿不到 chapterId，因此「現在在哪一章」
 * 改由 usePathname 推，再用全站 chapters 反查科目。
 *
 * 展開狀態也因此活得比單一頁面久：切章時已展開的其他章節會留著(連抓回來的樹
 * 都在 state 裡，不會重抓)。整頁重新整理才回到預設值——只展開當前章節。
 *
 * 切 Ch / 切科走的是一般的 Next 導航(server render)，沒有在瀏覽器端新增任何
 * Supabase 查詢——src/lib/data.ts 是 server-only(用 next/headers 的 cookies)。
 * 唯一的 client 端請求是展開「非當前章節」時抓那一章的樹(見 /api/chapters/[id]/tree)。
 */
export function ReadingSidebar({
  subjects,
  chapters,
  questionCounts,
  cardCounts,
  children,
}: ReadingSidebarProps) {
  const pathname = usePathname();
  const uid = useId();
  const currentChapterId = chapterIdFromPath(pathname);
  const chapter = chapters.find((c) => c.id === currentChapterId);
  const subject = subjects.find((s) => s.id === chapter?.subject_id);
  const currentChapterLabel = chapter ? `${chapter.chapter_no} ${chapter.title}` : "";

  // 展開中的章節。可以同時開多章。
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  // 非當前章節的樹是按需抓回來的，抓過就留著
  const [trees, setTrees] = useState<Map<number, TreeNode[]>>(new Map());
  const [failed, setFailed] = useState<Set<number>>(new Set());
  // 純粹用來去重的「抓取中」名單。不影響畫面(骨架的條件是「沒有樹也沒失敗」)，
  // 所以不該是 state —— 放 state 會在 effect 裡同步 setState，引發連鎖 render。
  const inFlight = useRef<Set<number>>(new Set());

  // 換章時把新的一章加進展開集合，但不收掉使用者自己開的其他章。
  // 這是 React 官方的「prop 變動時調整 state」寫法(render 期間 set，立刻重跑
  // 這一次 render)，不是 effect —— 用 effect 會多一輪 commit 後的連鎖 render。
  const [lastChapterId, setLastChapterId] = useState<number | null>(null);
  if (currentChapterId != null && currentChapterId !== lastChapterId) {
    setLastChapterId(currentChapterId);
    setExpanded((prev) =>
      prev.has(currentChapterId) ? prev : new Set(prev).add(currentChapterId),
    );
  }

  // 展開了非當前章節就去抓它的樹。當前章節走 @tree slot，不在這裡抓。
  useEffect(() => {
    for (const id of expanded) {
      if (
        id === currentChapterId ||
        trees.has(id) ||
        failed.has(id) ||
        inFlight.current.has(id)
      ) {
        continue;
      }
      inFlight.current.add(id);
      (async () => {
        try {
          const res = await fetch(`/api/chapters/${id}/tree`);
          if (!res.ok) throw new Error("fetch failed");
          const nodes = (await res.json()) as TreeNode[];
          setTrees((prev) => new Map(prev).set(id, nodes));
        } catch {
          setFailed((prev) => new Set(prev).add(id));
        } finally {
          inFlight.current.delete(id);
        }
      })();
    }
  }, [expanded, currentChapterId, trees, failed]);

  const toggle = useCallback((id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // 收合再展開時給失敗過的那一章一次重試的機會
    setFailed((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // 記住「上次讀到哪」，供科目頁的「繼續上次」與科目切換使用
  useEffect(() => {
    if (!chapter || !subject) return;
    writePosition({
      subjectId: subject.id,
      chapterId: chapter.id,
      label: `${subject.name} ${currentChapterLabel}`,
    });
  }, [subject, chapter, currentChapterLabel]);

  // 章節不存在(例如 404 網址)時不畫目錄；/quiz 由 ReadingFrame 擋掉
  if (!chapter || !subject) return null;

  const groups = buildSidebarChapters(
    buildChapterGroups(chapters.filter((c) => c.subject_id === subject.id)),
    new Map(questionCounts),
    new Map(cardCounts),
  );

  const body = (
    <>
      <SubjectSwitcher
        subjects={subjects}
        current={{ kind: "subject", id: subject.id, label: subject.name }}
      />

      <div className="mt-2">
        {groups.map((group, i) => (
          <div key={group.label ?? i} className="mb-2 last:mb-0">
            {/* label 目前一定是 undefined。之後要在科目內分群時才會有標題。 */}
            {group.label && (
              <p className="px-2 py-1 text-xs text-muted">{group.label}</p>
            )}

            {group.chapters.map((c) => {
              const isCurrent = c.id === chapter.id;
              const isOpen = expanded.has(c.id);
              const panelId = `${uid}-ch-${c.id}`;

              return (
                <div key={c.id}>
                  {/* chevron 與章節名稱是兩個獨立的可點區域：前者只展開、後者才換章。
                      結構刻意與 TopicTree 的節點列一致，兩層目錄的操作手感才一樣。 */}
                  <div
                    className={`flex items-center rounded text-sm transition-colors duration-150 motion-reduce:transition-none ${
                      isCurrent
                        ? "bg-subj-light font-medium text-subj-deep"
                        : "text-body hover:bg-surface-hover"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${isOpen ? "收合" : "展開"} ${c.chapterNo} ${c.title}`}
                      className={`flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-150 hover:text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none ${
                        isCurrent ? "text-subj-deep" : "text-muted"
                      }`}
                    >
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-150 motion-reduce:transition-none ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    <Link
                      href={`/chapters/${c.id}`}
                      className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {c.chapterNo} {c.title}
                      </span>
                      {!isCurrent && (
                        <NodeCounts questions={c.questionCount} notes={c.noteCount} />
                      )}
                    </Link>
                  </div>

                  {isOpen && (
                    <div id={panelId} className="mt-0.5 pl-3">
                      {isCurrent ? (
                        /* 當前章節的樹由 @tree slot 提供(server render、可 stream) */
                        children
                      ) : (
                        <ChapterTreePanel
                          nodes={trees.get(c.id)}
                          failed={failed.has(c.id)}
                          basePath={`/chapters/${c.id}`}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div data-group={subjectGroup(subject)} className="contents">
      <nav
        aria-label="章節目錄"
        className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 self-start overflow-y-auto rounded-card border border-card-border bg-card p-3 shadow-sm lg:block"
      >
        {body}
      </nav>

      {/* 窄螢幕：先用可展開區塊頂著，階段 3 會換成頂端 sticky 的「目前章節」+ 抽屜。
          共用的是同一份 body，不會有兩套樹的邏輯。 */}
      <details className="mb-4 rounded-card border border-card-border bg-card px-3 py-2 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none py-1 text-sm font-medium text-subj-deep">
          {currentChapterLabel}
        </summary>
        <div className="pb-2 pt-1">{body}</div>
      </details>
    </div>
  );
}

/** 非當前章節的樹：抓到就畫，抓的途中給幾條灰線，抓失敗給一行字。 */
function ChapterTreePanel({
  nodes,
  failed,
  basePath,
}: {
  nodes?: TreeNode[];
  failed: boolean;
  basePath: string;
}) {
  if (failed) {
    return <p className="py-1 pl-6 text-xs text-muted">目錄載入失敗</p>;
  }
  if (!nodes) {
    // 與 chapters/@tree/loading.tsx 同一種骨架
    return (
      <div className="space-y-2 py-1 pl-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-36" />
      </div>
    );
  }
  return <TopicTree nodes={nodes} basePath={basePath} />;
}

/** /chapters/123 或 /chapters/123/quiz -> 123 */
function chapterIdFromPath(pathname: string): number | null {
  const m = /^\/chapters\/(\d+)/.exec(pathname);
  return m ? Number(m[1]) : null;
}
