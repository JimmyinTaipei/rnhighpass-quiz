import Link from "next/link";
import { Flag } from "lucide-react";
import { getKnowledgeFavorites, getQuestionsByIds } from "@/lib/data";
import { hrefFor, knowledgeIndex, previewFor } from "@/lib/knowledge";
import type { KnowledgePreview } from "@/lib/knowledge/types";
import { weakArticles } from "@/lib/knowledge/exam";
import { WeakArticles } from "@/components/learn/WeakArticles";
import { requireUser } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import {
  busiestSubject,
  groupByChapter,
  parseNotebookSource,
  UNCATEGORIZED,
} from "@/lib/notebook";
import { idsForSubject, loadNotebookIndex, loadReviewSchedule } from "@/lib/notebook-data";
import { subjectGroup } from "@/lib/subject-groups";
import { Panel } from "@/components/ui/Panel";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";
import { NotebookList, type NotebookItem } from "@/components/notebook/NotebookList";
import { KnowledgeFavoriteList, type KnowledgeFavoriteGroup } from "@/components/notebook/KnowledgeFavoriteList";

/** 收藏的知識頁依頁分組(最近收藏的頁在前)，段落依頁內順序 */
function groupKnowledgeFavorites(rows: { target: string }[]): KnowledgeFavoriteGroup[] {
  const groups = new Map<string, KnowledgeFavoriteGroup>();
  const order = Object.keys(knowledgeIndex.sections);
  for (const { target } of rows) {
    const [slug, id] = target.split("#");
    const article = knowledgeIndex.articles[slug];
    if (!article) continue; // 頁面已刪除或改名
    const g = groups.get(slug) ?? { slug, title: article.title, href: hrefFor(slug), pageSaved: false, sections: [] };
    if (!id) g.pageSaved = true;
    else {
      const p = previewFor(target);
      if (p) g.sections.push(p);
    }
    groups.set(slug, g);
  }
  const pos = (p: KnowledgePreview) => order.indexOf(p.key);
  for (const g of groups.values()) g.sections.sort((a, b) => pos(a) - pos(b));
  return [...groups.values()];
}

export const metadata = { title: "我的題本 | 多保命" };

export default async function NotebookPage(props: PageProps<"/mistakes">) {
  await requireUser("/mistakes");
  const searchParams = await props.searchParams;
  const rawTab = typeof searchParams.tab === "string" ? searchParams.tab : undefined;
  const showKnowledge = rawTab === "knowledge";
  const source = parseNotebookSource(rawTab);

  const [index, devMode, knowledgeRows, schedule] = await Promise.all([
    loadNotebookIndex(source),
    getDevMode(),
    getKnowledgeFavorites(),
    loadReviewSchedule(),
  ]);
  const knowledgeGroups = groupKnowledgeFavorites(knowledgeRows);
  const { subjects, countsBySubject, totals } = index;

  // 指定的科目沒有題目時(例如剛答對最後一題)，退回題數最多的科目
  const requested = typeof searchParams.subject === "string" ? searchParams.subject : null;
  const subjectId =
    requested && (countsBySubject.get(requested) ?? 0) > 0
      ? requested
      : busiestSubject(countsBySubject, subjects);

  const ids = subjectId ? idsForSubject(index, subjectId) : [];
  const questions = await getQuestionsByIds(ids);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const items: NotebookItem[] = ids.flatMap((id) => {
    const question = byId.get(id);
    if (!question) return [];
    return [
      {
        question,
        wrongCount: index.history.get(id)?.wrongCount ?? 0,
        date: index.dateById.get(id) ?? null,
      },
    ];
  });
  const groups = groupByChapter(items, index.chapterById).map((g) => ({
    chapterId: g.chapterId,
    label: g.label,
    items: g.items,
  }));

  const subject = subjects.find((s) => s.id === subjectId);
  const subjectName = subjectId === UNCATEGORIZED ? "未分類" : (subject?.name ?? "");
  const tabHref = (tab: string) => `/mistakes?tab=${tab}`;
  const subjectHref = (id: string) =>
    `/mistakes?tab=${source}&subject=${encodeURIComponent(id)}`;
  const scopeQuery = subjectId
    ? `source=${source}&subject=${encodeURIComponent(subjectId)}`
    : "";

  const tabs = [
    { key: "mistakes", label: "錯題", count: totals.mistakes },
    { key: "favorites", label: "收藏", count: totals.favorites },
    { key: "knowledge", label: "知識頁", count: knowledgeRows.length },
  ];
  const activeTab = showKnowledge ? "knowledge" : source;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
      <Panel className="flex-1">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h1 className="max-md:sr-only text-3xl font-bold text-strong">我的題本</h1>
          <Link
            href="/report"
            className="flex items-center gap-1 text-xs text-muted hover:text-subj-deep"
          >
            <Flag size={12} />
            我的回報進度
          </Link>
        </div>

        {schedule.due.length > 0 && (
          <Link
            href="/quiz/review?source=due"
            className="mb-4 flex items-center justify-between gap-3 rounded-card bg-light px-4 py-3 text-sm text-deep hover:bg-mid"
          >
            <span>
              <span className="font-semibold">今天該複習 {schedule.due.length} 題</span>
              <span className="ml-2 text-xs text-body">錯題與收藏依記憶間隔排程</span>
            </span>
            <span className="shrink-0 font-semibold">開始 →</span>
          </Link>
        )}

        <div role="tablist" className="mb-4 flex gap-1 border-b border-card-border">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={tabHref(t.key)}
              role="tab"
              aria-selected={activeTab === t.key}
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
                activeTab === t.key
                  ? "border-accent font-bold text-deep"
                  : "border-transparent text-muted hover:text-body"
              }`}
            >
              {t.label} <span className="text-xs">{t.count}</span>
            </Link>
          ))}
        </div>

        {showKnowledge ? (
          <>
            <p className="mb-4 text-sm text-muted">在知識頁標題右邊按星號收整頁，或按段落標題旁的星號收單一段。</p>
            {knowledgeGroups.length === 0 ? (
              <p className="text-muted">還沒有收藏的知識頁。</p>
            ) : (
              <KnowledgeFavoriteList groups={knowledgeGroups} />
            )}
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              {source === "mistakes"
                ? "答錯自動收錄，答對後自動移出。"
                : "在任何題目右上角按星號就能收藏。"}
            </p>

            {!subjectId ? (
              <p className="text-muted">
                {source === "mistakes"
                  ? "目前沒有錯題，繼續保持！"
                  : "還沒有收藏的題目。"}
              </p>
            ) : (
              <>
                {source === "mistakes" && <WeakArticles articles={weakArticles([...index.dateById.keys()])} />}
                <div className="mb-6">
                  <SubjectPicker
                    subjects={subjects}
                    counts={countsBySubject}
                    selected={subjectId}
                    hrefFor={subjectHref}
                  />
                </div>
                <div data-group={subject ? subjectGroup(subject) : undefined}>
                  <NotebookList
                    key={`${source}-${subjectId}`}
                    source={source}
                    subjectName={subjectName}
                    groups={groups}
                    reviewHref={`/quiz/review?${scopeQuery}`}
                    exportHref={`/print/questions?${scopeQuery}`}
                    devMode={devMode}
                  />
                </div>
              </>
            )}
          </>
        )}
      </Panel>
    </main>
  );
}
