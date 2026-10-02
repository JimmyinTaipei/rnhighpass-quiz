import Link from "next/link";
import { ListChecks } from "lucide-react";
import { parseChapterKey, type ArticleExamStats } from "@/lib/knowledge/exam";
import { pillTint } from "@/lib/ui";

/** 預設只列前幾個段落，其餘收進「其他」 */
const VISIBLE = 6;

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
 * 段落依相關題數排序，最常考的在前面。
 */
export function ExamPresence({ slug, stats, links }: ExamPresenceProps) {
  const places = [...stats.chapters].sort((a, b) => b.count - a.count);
  const visible = places.slice(0, VISIBLE);
  const rest = places.slice(VISIBLE);

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
      <ul className="flex flex-wrap gap-1.5">
        {visible.map((p) => (
          <PlaceChip key={p.key} place={p} link={links.get(p.key)} />
        ))}
      </ul>
      {rest.length > 0 && (
        <details className="group mt-1.5">
          <summary className="cursor-pointer list-none text-xs font-medium text-accent hover:text-deep">
            <span className="group-open:hidden">其他 {rest.length} 個段落</span>
            <span className="hidden group-open:inline">收合</span>
          </summary>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {rest.map((p) => (
              <PlaceChip key={p.key} place={p} link={links.get(p.key)} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function PlaceChip({
  place,
  link,
}: {
  place: ArticleExamStats["chapters"][number];
  link?: { chapterId: number; topicId: number | null };
}) {
  const { subject, chapterNo, path } = parseChapterKey(place.key);
  const body = (
    <>
      <span className="shrink-0 font-medium text-deep">
        {subject} {chapterNo}
      </span>
      <span className="min-w-0 truncate">{path.join(" › ")}</span>
      {place.count > 0 && (
        <span className="shrink-0 tabular-nums text-muted" title={`本段 ${place.total} 題中有 ${place.count} 題與本頁相關`}>
          {place.count}
        </span>
      )}
    </>
  );
  const cls =
    "flex max-w-full items-center gap-1.5 rounded-full bg-(--surface-row) px-3 py-1.5 text-[13px] text-strong";
  return (
    <li className="max-w-full">
      {link ? (
        <Link
          href={`/chapters/${link.chapterId}${link.topicId ? `#topic-${link.topicId}` : ""}`}
          className={`${cls} transition-colors hover:bg-light hover:text-deep`}
        >
          {body}
        </Link>
      ) : (
        <span className={cls}>{body}</span>
      )}
    </li>
  );
}
