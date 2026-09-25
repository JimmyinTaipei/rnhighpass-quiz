// 比較表的「主要章節 / 次要章節」歸屬。純函式。
//
// 規則：引用這張表的題目最多的章節 = 主要章節(同分取課綱順序較前者)；
// 其他有引用的章節 = 次要章節，那裡只放一個連回主要章節的連結卡。
// 沒有任何題目引用的表，放在所屬科目的「未對應章節」區。

import type { Chapter, ComparisonTable, Subject } from "./types";
import { UNCATEGORIZED } from "./notebook";

export interface TableRef {
  id: string;
  title: string;
}

export interface PlacedTable extends TableRef {
  subjectId: string;
  primaryChapterId: number | null;
  /** 主要章節裡引用的題數 */
  primaryCount: number;
  secondaryChapterIds: number[];
}

export interface TableChapterSection {
  chapterId: number | null;
  label: string;
  primary: (TableRef & { count: number })[];
  /** 次要：同一張表，但主要位置在別章 */
  secondary: (TableRef & { primarySubjectId: string; primaryLabel: string })[];
}

export function placeTables(
  tables: Pick<ComparisonTable, "id" | "title" | "subject_id">[],
  counts: { table_id: string; chapter_id: number; question_count: number }[],
  chapters: Chapter[],
  subjects: Subject[],
): PlacedTable[] {
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const subjectOrder = new Map(subjects.map((s) => [s.id, s.order_index]));
  // 課綱順序：先科目、再章節
  const rank = (chapterId: number) => {
    const c = chapterById.get(chapterId);
    if (!c) return Number.POSITIVE_INFINITY;
    return (subjectOrder.get(c.subject_id) ?? 99) * 10_000 + c.order_index;
  };

  const byTable = new Map<string, { chapterId: number; n: number }[]>();
  for (const row of counts) {
    if (!chapterById.has(row.chapter_id)) continue;
    const list = byTable.get(row.table_id) ?? [];
    list.push({ chapterId: row.chapter_id, n: row.question_count });
    byTable.set(row.table_id, list);
  }

  return tables.map((t) => {
    const refs = (byTable.get(t.id) ?? []).sort(
      (a, b) => b.n - a.n || rank(a.chapterId) - rank(b.chapterId),
    );
    const primary = refs[0];
    const subjectId = primary
      ? chapterById.get(primary.chapterId)!.subject_id
      : (t.subject_id ?? UNCATEGORIZED);
    return {
      id: t.id,
      title: t.title,
      subjectId,
      primaryChapterId: primary?.chapterId ?? null,
      primaryCount: primary?.n ?? 0,
      secondaryChapterIds: refs.slice(1).map((r) => r.chapterId),
    };
  });
}

/** 某一科的章節區塊(依課綱順序)，最後是「未對應章節」 */
export function sectionsForSubject(
  placed: PlacedTable[],
  subjectId: string,
  chapters: Chapter[],
): TableChapterSection[] {
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const label = (id: number) => {
    const c = chapterById.get(id);
    return c ? `${c.chapter_no} ${c.title}` : `#${id}`;
  };
  const sections = new Map<number, TableChapterSection>();
  const section = (chapterId: number) => {
    let s = sections.get(chapterId);
    if (!s) {
      s = { chapterId, label: label(chapterId), primary: [], secondary: [] };
      sections.set(chapterId, s);
    }
    return s;
  };
  const unplaced: TableChapterSection = { chapterId: null, label: "未對應章節", primary: [], secondary: [] };

  for (const t of placed) {
    if (t.subjectId === subjectId) {
      if (t.primaryChapterId == null) unplaced.primary.push({ id: t.id, title: t.title, count: 0 });
      else section(t.primaryChapterId).primary.push({ id: t.id, title: t.title, count: t.primaryCount });
    }
    if (t.primaryChapterId == null) continue;
    for (const cid of t.secondaryChapterIds) {
      if (chapterById.get(cid)?.subject_id !== subjectId) continue;
      section(cid).secondary.push({
        id: t.id,
        title: t.title,
        primarySubjectId: t.subjectId,
        primaryLabel: label(t.primaryChapterId),
      });
    }
  }

  const byTitle = (a: TableRef, b: TableRef) => a.title.localeCompare(b.title, "zh-Hant");
  const ordered = [...sections.values()].sort(
    (a, b) => (chapterById.get(a.chapterId!)?.order_index ?? 0) - (chapterById.get(b.chapterId!)?.order_index ?? 0),
  );
  for (const s of [...ordered, unplaced]) {
    s.primary.sort((a, b) => b.count - a.count || byTitle(a, b));
    s.secondary.sort(byTitle);
  }
  return unplaced.primary.length > 0 ? [...ordered, unplaced] : ordered;
}

/** 科目選擇器上的數字：主要歸屬在該科的表數 */
export function tableCountsBySubject(placed: PlacedTable[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of placed) m.set(t.subjectId, (m.get(t.subjectId) ?? 0) + 1);
  return m;
}
