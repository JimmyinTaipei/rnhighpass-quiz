import Link from "next/link";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root } from "hast";
import { BookOpenText, ListChecks } from "lucide-react";
import { frequencyLevel, type ChapterMapData, type MapBlock } from "@/lib/knowledge/chapter-map";
import type { Topic } from "@/lib/types";
import { pillSubjectSoft } from "@/lib/ui";

interface ChapterMapProps {
  chapterId: number;
  data: ChapterMapData;
  topics: Topic[];
}

/**
 * 章節頁的「考點地圖」：以 H2 為單位(題數多的 H3 另成一塊)，
 * 每塊列考頻、考點精華、對到的知識頁與「練這節」。
 *
 * 知識頁連到 /k/<slug>，站內點擊會被 @panel 攔截成側邊面板，章節頁不動；
 * 詳細內容都在知識頁，這裡只放「這章考什麼」。
 */
export function ChapterMap({ chapterId, data, topics }: ChapterMapProps) {
  const topicId = new Map(topics.map((t) => [t.natural_key, t.id]));
  const withArticles = data.blocks.filter(
    (b) => b.articles.length > 0 || b.children.some((c) => c.articles.length > 0),
  ).length;
  const blockCount = data.blocks.reduce((n, b) => n + 1 + b.children.length, 0);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        本章 {data.count} 題・{blockCount} 個考點區塊・{withArticles}/{data.blocks.length} 節有知識頁
        {!data.hasPoints && "・考點精華整理中"}
      </p>
      {data.blocks.map((b) => (
        <Block key={b.key} block={b} chapterId={chapterId} topicId={topicId} level={2} />
      ))}
    </div>
  );
}

function Block({
  block,
  chapterId,
  topicId,
  level,
}: {
  block: MapBlock;
  chapterId: number;
  topicId: Map<string, number>;
  level: 2 | 3;
}) {
  const tid = topicId.get(block.naturalKey);
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <section
      id={tid ? `map-${tid}` : undefined}
      className={
        level === 2
          ? "mb-3 scroll-mt-4 rounded-card bg-(--surface-inset) p-4 sm:p-5"
          : "mt-4 border-l-2 border-subj-mid pl-4"
      }
    >
      {/* 手機上標題獨佔一行，考頻與「練這節」放下一行，長標題才不會被擠成直的 */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <Heading
          className={`min-w-0 font-bold text-subj-deep sm:flex-1 ${level === 2 ? "text-lg" : "text-base"}`}
        >
          {block.title}
        </Heading>
        <div className="flex shrink-0 items-center gap-2">
          <Frequency count={block.count} />
          {tid && (
            <Link
              href={`/chapters/${chapterId}/quiz?topic=${tid}`}
              className={pillSubjectSoft}
            >
              <ListChecks size={13} /> 練這節
            </Link>
          )}
        </div>
      </div>

      {block.points.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-strong marker:text-subj-accent">
          {block.points.map((p, i) => (
            <li key={i}>{renderPoint(p)}</li>
          ))}
        </ul>
      )}

      {block.articles.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {block.articles.map((a) => (
            <li key={a.slug} className="max-w-full">
              <Link
                href={`/k/${a.slug}`}
                scroll={false}
                className="flex max-w-full items-center gap-1.5 rounded-full bg-(--surface-row) px-3 py-1.5 text-[13px] text-strong transition-colors hover:bg-light hover:text-deep"
              >
                <BookOpenText size={13} className="shrink-0 text-accent" />
                <span className="truncate font-medium">{a.title}</span>
                {a.count > 0 && <span className="shrink-0 tabular-nums text-muted">{a.count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        level === 2 &&
        block.children.every((c) => c.articles.length === 0) && (
          <p className="mt-3 text-xs text-muted">這一節還沒有對應的知識頁。</p>
        )
      )}

      {block.children.map((c) => (
        <Block key={c.key} block={c} chapterId={chapterId} topicId={topicId} level={3} />
      ))}
    </section>
  );
}

/** 考頻：五格，題數越多亮越多格 */
function Frequency({ count }: { count: number }) {
  const level = frequencyLevel(count);
  return (
    <span className="flex items-center gap-1.5" title={`考頻 ${level}/5・${count} 題`}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i <= level ? "bg-subj-accent" : "bg-card-border"}`}
          />
        ))}
      </span>
      <span className="text-xs tabular-nums text-muted">{count} 題</span>
    </span>
  );
}

/** 考點是一小段 hast(通常是一個 <p>)。li 裡不需要段落間距，<p> 改成行內 */
function renderPoint(root: Root) {
  return toJsxRuntime(root, {
    Fragment,
    jsx,
    jsxs,
    components: { p: (props) => <>{props.children}</> },
  });
}
