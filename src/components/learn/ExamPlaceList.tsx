"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

export interface ExamPlace {
  key: string;
  subject: string;
  chapterNo: string;
  path: string[];
  count: number;
  total: number;
  href: string | null;
}

/** 列與列之間的距離(同 gap-1.5) */
const GAP = 6;

/**
 * 「出現在」段落清單。收合時只顯示第一列(電腦一列約 2–3 項);
 * 第一列只放得下 1 項(手機)時顯示兩列,也就是 1–2 項。其餘按「其他 N 個段落」才顯示。
 * 全部項目一直在 DOM 裡(被 max-height 裁掉),才量得到每項在第幾列;量到之前先用約兩列的高度。
 */
export function ExamPlaceList({ places }: { places: ExamPlace[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [clip, setClip] = useState<{ height: number; hidden: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const items = [...list.children] as HTMLElement[];
      if (items.length === 0) return;
      const top = items[0].offsetTop;
      const rowHeight = items[0].offsetHeight;
      const firstRow = items.filter((el) => el.offsetTop === top).length;
      const rows = firstRow >= 2 ? 1 : 2;
      const limit = top + rows * (rowHeight + GAP);
      const hidden = items.filter((el) => el.offsetTop >= limit).length;
      setClip({ height: rows * rowHeight + (rows - 1) * GAP, hidden });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [places]);

  const collapsed = !open && (clip === null || clip.hidden > 0);

  return (
    <>
      <ul
        ref={listRef}
        className="flex flex-wrap gap-1.5 overflow-hidden"
        style={collapsed ? { maxHeight: clip?.height ?? 66 } : undefined}
      >
        {places.map((p) => (
          <PlaceChip key={p.key} place={p} />
        ))}
      </ul>
      {clip !== null && clip.hidden > 0 && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-1.5 text-xs font-medium text-accent hover:text-deep"
        >
          {open ? "收合" : `其他 ${clip.hidden} 個段落`}
        </button>
      )}
    </>
  );
}

function PlaceChip({ place }: { place: ExamPlace }) {
  const body = (
    <>
      <span className="shrink-0 font-medium text-deep">
        {place.subject} {place.chapterNo}
      </span>
      <span className="min-w-0 truncate">{place.path.join(" › ")}</span>
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
      {place.href ? (
        <Link href={place.href} className={`${cls} transition-colors hover:bg-light hover:text-deep`}>
          {body}
        </Link>
      ) : (
        <span className={cls}>{body}</span>
      )}
    </li>
  );
}
