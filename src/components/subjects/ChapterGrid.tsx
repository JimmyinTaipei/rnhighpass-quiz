import Link from "next/link";
import type { Chapter, Subject } from "@/lib/types";
import { subjectGroup } from "@/lib/subject-groups";

interface ChapterGridProps {
  subject: Subject;
  chapters: Chapter[];
  questionCounts: Map<number, number>;
  /** 麵包屑回到的位置 */
  backHref: string;
  backLabel: string;
  hrefFor: (chapter: Chapter) => string;
  /** 測驗頁與閱讀頁的說明文字不同 */
  hint?: string;
}

/**
 * /subjects/[subjectId] 與 /quiz/[subjectId] 共用的章節清單。
 *
 * 整頁掛 data-group，所以底下的 subj-* class 會統一解析成該科顏色。
 */
export function ChapterGrid({
  subject,
  chapters,
  questionCounts,
  backHref,
  backLabel,
  hrefFor,
  hint,
}: ChapterGridProps) {
  const group = subjectGroup(subject);
  const total = chapters.reduce((sum, c) => sum + (questionCounts.get(c.id) ?? 0), 0);

  return (
    <main data-group={group} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <p className="mb-1 text-sm text-muted">
        <Link href={backHref} className="hover:text-subj-deep">
          {backLabel}
        </Link>{" "}
        / {subject.name}
      </p>
      <div className="mb-6 flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-bold text-subj-deep">{subject.name}</h1>
        <span className="text-sm text-muted">
          {chapters.length} 章・共 {total} 題
        </span>
      </div>
      {hint && <p className="mb-4 text-sm text-muted">{hint}</p>}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((c) => {
          const count = questionCounts.get(c.id) ?? 0;
          return (
            <Link
              key={c.id}
              href={hrefFor(c)}
              className="flex items-start justify-between gap-3 rounded-card border border-card-border border-l-4 border-l-subj-accent bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-subj-accent hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-subj-accent">
                  {c.chapter_no}
                </span>
                <span className="block font-medium text-subj-deep">{c.title}</span>
              </span>
              <span className="shrink-0 rounded-full bg-subj-light px-2 py-0.5 text-xs font-medium text-subj-deep">
                {count} 題
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
