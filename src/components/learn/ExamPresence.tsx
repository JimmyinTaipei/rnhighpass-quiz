import Link from "next/link";
import { ListChecks } from "lucide-react";
import { parseChapterKey, type ArticleExamStats } from "@/lib/knowledge/exam";
import { pillTint } from "@/lib/ui";
import { ExamPlaceList, type ExamPlace } from "@/components/learn/ExamPlaceList";

interface ExamPresenceProps {
  slug: string;
  stats: ArticleExamStats;
  /** chapters 路徑 → 章節頁位置(getTopicLinks);查不到的段落不給連結 */
  links: Map<string, { chapterId: number; topicId: number | null }>;
}

/**
 * 知識頁頂端的「考題」區塊：相關題數、練相關題、出現在哪些章節段落。
 *
 * 之後章節頁與答錯詳解打開的知識面板會用同一個區塊，讓三個地方看起來一樣。
 * 段落依相關題數排序，最常考的在前面；收合規則見 ExamPlaceList。
 */
export function ExamPresence({ slug, stats, links }: ExamPresenceProps) {
  const places: ExamPlace[] = [...stats.chapters]
    .sort((a, b) => b.count - a.count)
    .map((p) => {
      const { subject, chapterNo, path } = parseChapterKey(p.key);
      const link = links.get(p.key);
      return {
        key: p.key,
        subject,
        chapterNo,
        path,
        count: p.count,
        total: p.total,
        href: link ? `/chapters/${link.chapterId}${link.topicId ? `#topic-${link.topicId}` : ""}` : null,
      };
    });

  return (
    <section
      aria-label="考題"
      className="mt-4 rounded-card bg-(--surface-inset) p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tabular-nums text-deep">{stats.total}</span>
          <span className="text-sm text-body">題相關考題</span>
        </p>
        {stats.total > 0 && (
          <Link
            href={`/learn/${slug}/quiz`}
            className={pillTint}
          >
            <ListChecks size={16} /> 練相關題
          </Link>
        )}
      </div>
      {stats.total === 0 && (
        <p className="mt-1 text-xs text-muted">分章題本裡還沒有直接考這個主題的題目。</p>
      )}

      <p className="mt-3 mb-1.5 text-xs font-medium text-muted">出現在</p>
      <ExamPlaceList places={places} />
    </section>
  );
}
