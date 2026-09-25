// 「我的題本」(錯題 / 收藏)與統計頁共用的純函式：把題目依 科目 → 章節 分組。
// 不 import 任何 server-only 模組，方便之後單獨測試。

import type { Chapter, Subject, UserAnswer } from "./types";
import { latestAnswerPerQuestion } from "./quiz-utils";

/** 沒有 primary_chapter_id 的題目歸到這個虛擬科目 */
export const UNCATEGORIZED = "none";

export type NotebookSource = "mistakes" | "favorites";

export function parseNotebookSource(raw: string | undefined): NotebookSource {
  return raw === "favorites" ? "favorites" : "mistakes";
}

interface HasChapter {
  id: string;
  primary_chapter_id: number | null;
}

export function subjectIdOf(q: HasChapter, chapterById: Map<number, Chapter>): string {
  if (q.primary_chapter_id == null) return UNCATEGORIZED;
  return chapterById.get(q.primary_chapter_id)?.subject_id ?? UNCATEGORIZED;
}

/** 每個科目有幾題(科目選擇器上的數字) */
export function countBySubject(
  questions: HasChapter[],
  chapterById: Map<number, Chapter>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const q of questions) {
    const s = subjectIdOf(q, chapterById);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return counts;
}

/** 題數最多的科目；同數時依課綱順序。全部為 0 時回 null */
export function busiestSubject(counts: Map<string, number>, subjects: Subject[]): string | null {
  let best: string | null = null;
  let bestCount = 0;
  for (const s of [...subjects].sort((a, b) => a.order_index - b.order_index)) {
    const c = counts.get(s.id) ?? 0;
    if (c > bestCount) {
      best = s.id;
      bestCount = c;
    }
  }
  if (!best && (counts.get(UNCATEGORIZED) ?? 0) > 0) return UNCATEGORIZED;
  return best;
}

export interface AnswerHistory {
  wrongCount: number;
  lastWrongAt: string | null;
}

/** 每題累計答錯幾次、最後一次答錯的時間 */
export function answerHistoryByQuestion(answers: UserAnswer[]): Map<string, AnswerHistory> {
  const map = new Map<string, AnswerHistory>();
  for (const a of answers) {
    if (a.is_correct) continue;
    const h = map.get(a.question_id) ?? { wrongCount: 0, lastWrongAt: null };
    h.wrongCount += 1;
    if (!h.lastWrongAt || a.answered_at > h.lastWrongAt) h.lastWrongAt = a.answered_at;
    map.set(a.question_id, h);
  }
  return map;
}

/** 目前的錯題 = 最近一次作答是錯的題目(答對後自動移出) */
export function currentMistakeIds(answers: UserAnswer[]): string[] {
  return [...latestAnswerPerQuestion(answers).values()]
    .filter((a) => !a.is_correct)
    .map((a) => a.question_id);
}

export interface ChapterGroup<T> {
  chapterId: number | null;
  label: string;
  order: number;
  items: T[];
}

/**
 * 依章節分組，章節依課綱順序；組內保持傳入的順序(呼叫端先排好)。
 */
export function groupByChapter<T extends { question: HasChapter }>(
  items: T[],
  chapterById: Map<number, Chapter>,
): ChapterGroup<T>[] {
  const groups = new Map<number | null, ChapterGroup<T>>();
  for (const item of items) {
    const cid = item.question.primary_chapter_id;
    const chapter = cid != null ? chapterById.get(cid) : undefined;
    const key = chapter ? chapter.id : null;
    let g = groups.get(key);
    if (!g) {
      g = {
        chapterId: key,
        label: chapter ? `${chapter.chapter_no} ${chapter.title}` : "未分類",
        order: chapter ? chapter.order_index : Number.POSITIVE_INFINITY,
        items: [],
      };
      groups.set(key, g);
    }
    g.items.push(item);
  }
  return [...groups.values()].sort((a, b) => a.order - b.order);
}
