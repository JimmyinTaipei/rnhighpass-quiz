"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Stethoscope } from "lucide-react";
import { entryHref, lastPosition, useReadingStore } from "@/lib/reading-position";
import type { DiseaseTagSummary } from "@/lib/data";

interface DiseaseSidebarProps {
  tags: DiseaseTagSummary[];
}

/**
 * 疾病軸的側邊欄(demo)。
 *
 * 結構刻意與 ReadingSidebar 一致：放在 diseases/layout.tsx 這個沒有動態參數的
 * 共用段，所以切標籤時左側清單不重繪，只有右側題目換掉。
 *
 * 清單是「示範用的樣本」而非全部 1636 種疾病，理由見 getDiseaseTagSample。
 */
export function DiseaseSidebar({ tags }: DiseaseSidebarProps) {
  const pathname = usePathname();
  const current = decodeURIComponent(pathname.replace(/^\/diseases\/?/, ""));
  // 回科目軸時回到「上次讀到的位置」，沒有紀錄就回科目頁
  const store = useReadingStore();
  const pos = lastPosition(store);
  const backHref = pos ? entryHref(store, pos.subjectId) : "/subjects";

  const body = (
    <>
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-base font-semibold text-subj-deep">
        <Stethoscope size={16} className="shrink-0 text-subj-accent" />
        <span className="min-w-0 flex-1 truncate">依疾病瀏覽</span>
      </div>

      <a
        href={backHref}
        className="mb-2 flex items-center gap-2 rounded px-2 py-1.5 text-sm text-body transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none"
      >
        <BookOpen size={14} className="shrink-0 text-muted" />
        <span className="min-w-0 flex-1 truncate">回科目瀏覽</span>
      </a>

      <p className="px-2 py-1 text-xs text-muted">示範清單（部分標籤）</p>
      <ul>
        {tags.map((t) => {
          const isCurrent = t.tag === current;
          return (
            <li key={t.tag}>
              <Link
                href={`/diseases/${encodeURIComponent(t.tag)}`}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none ${
                  isCurrent
                    ? "bg-subj-light font-medium text-subj-deep"
                    : "text-body hover:bg-surface-hover"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{t.tag}</span>
                <span className="shrink-0 text-xs font-normal text-muted">
                  {t.questionCount} 題
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      <nav
        aria-label="疾病標籤"
        className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-64 shrink-0 self-start overflow-y-auto pr-2 lg:block"
      >
        {body}
      </nav>

      <details className="mb-4 rounded-card bg-sidebar px-3 py-2 lg:hidden">
        <summary className="cursor-pointer list-none py-1 text-sm font-medium text-subj-deep">
          {current || "疾病標籤"}
        </summary>
        <div className="pb-2 pt-1">{body}</div>
      </details>
    </>
  );
}
