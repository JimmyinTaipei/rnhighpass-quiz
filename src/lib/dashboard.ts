// 錯題分析儀表板的計算。純函式：輸入作答紀錄與題目資料，輸出儀表板要畫的數字。
// 不碰資料庫，方便單獨測試與在首頁精簡卡片重用。

import type { Chapter, QuestionTag, Subject, UserAnswer } from "./types";
import { latestAnswerPerQuestion } from "./quiz-utils";
import { answerHistoryByQuestion, subjectIdOf, UNCATEGORIZED } from "./notebook";

/** 弱點章節 / 標籤至少要錯幾題才顯示；只錯 1、2 題的不算趨勢 */
export const WEAK_SPOT_MIN = 3;

export const DASHBOARD_RANGES = { "7": 7, "30": 30, all: null } as const;
export type DashboardRange = keyof typeof DASHBOARD_RANGES;

export function parseRange(raw: string | undefined): DashboardRange {
  return raw === "7" || raw === "all" ? raw : "30";
}

// 使用者都在台灣；server 跑在 UTC，所以日期一律用台北時區切
const dayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export const toDayKey = (d: Date | string) => dayKey.format(new Date(d));

const DAY_MS = 24 * 60 * 60 * 1000;

interface QuestionLite {
  id: string;
  primary_chapter_id: number | null;
  source_text: string;
  stem: string;
}

export interface DashboardInput {
  answers: UserAnswer[]; // 新到舊
  questions: QuestionLite[]; // 至少涵蓋所有作答過的題目
  tags: QuestionTag[]; // 至少涵蓋期間內答錯的題目
  chapters: Chapter[];
  subjects: Subject[];
  range: DashboardRange;
  now?: Date;
}

export interface WeakChapter {
  chapterId: number;
  label: string;
  subjectName: string;
  wrongQuestions: number;
  accuracy: number;
}

export interface WeakTag {
  type: "dz" | "block";
  value: string;
  wrongQuestions: number;
}

export interface StubbornQuestion {
  id: string;
  chapterId: number | null;
  source: string;
  stem: string;
  wrongCount: number;
}

export interface DashboardData {
  range: DashboardRange;
  kpi: {
    answered: number;
    accuracy: number | null;
    /** 與上一段同長度期間的正確率差(百分點)；range=all 或上一段沒資料時為 null */
    accuracyDelta: number | null;
    currentMistakes: number;
    streakDays: number;
  };
  daily: { day: string; label: string; correct: number; wrong: number }[];
  weakChapters: WeakChapter[];
  weakTags: WeakTag[];
  stubborn: StubbornQuestion[];
  mistakesBySubject: { subjectId: string; name: string; count: number }[];
}

const pct = (correct: number, total: number) =>
  total === 0 ? null : Math.round((correct / total) * 100);

export function computeDashboard(input: DashboardInput): DashboardData {
  const { answers, questions, tags, chapters, subjects, range } = input;
  const now = input.now ?? new Date();
  const days = DASHBOARD_RANGES[range];
  const since = days == null ? null : now.getTime() - days * DAY_MS;
  const prevSince = days == null ? null : now.getTime() - 2 * days * DAY_MS;

  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const questionById = new Map(questions.map((q) => [q.id, q]));

  const inRange = since == null ? answers : answers.filter((a) => Date.parse(a.answered_at) >= since);
  const prev =
    since == null || prevSince == null
      ? []
      : answers.filter((a) => {
          const t = Date.parse(a.answered_at);
          return t >= prevSince && t < since;
        });

  // ===== KPI =====
  const correctInRange = inRange.filter((a) => a.is_correct).length;
  const accuracy = pct(correctInRange, inRange.length);
  const prevAccuracy = pct(prev.filter((a) => a.is_correct).length, prev.length);
  const latest = latestAnswerPerQuestion(answers);
  const currentMistakeIds = [...latest.values()].filter((a) => !a.is_correct).map((a) => a.question_id);

  const activeDays = new Set(answers.map((a) => toDayKey(a.answered_at)));
  let streakDays = 0;
  // 今天還沒做題不算斷：從今天或昨天開始往回數
  let cursor = activeDays.has(toDayKey(now)) ? now.getTime() : now.getTime() - DAY_MS;
  while (activeDays.has(toDayKey(new Date(cursor)))) {
    streakDays += 1;
    cursor -= DAY_MS;
  }

  // ===== 近 14 天每日作答 =====
  const byDay = new Map<string, { correct: number; wrong: number }>();
  for (const a of answers) {
    const k = toDayKey(a.answered_at);
    const b = byDay.get(k) ?? { correct: 0, wrong: 0 };
    if (a.is_correct) b.correct += 1;
    else b.wrong += 1;
    byDay.set(k, b);
  }
  const daily = Array.from({ length: 14 }, (_, i) => {
    const day = toDayKey(new Date(now.getTime() - (13 - i) * DAY_MS));
    const b = byDay.get(day) ?? { correct: 0, wrong: 0 };
    const [, m, d] = day.split("-");
    return { day, label: `${Number(m)}/${Number(d)}`, ...b };
  });

  // ===== 弱點章節：期間內答錯過的「題目」數 >= WEAK_SPOT_MIN =====
  const chapterAgg = new Map<number, { wrongIds: Set<string>; correct: number; total: number }>();
  const wrongIdsInRange = new Set<string>();
  for (const a of inRange) {
    const q = questionById.get(a.question_id);
    if (!a.is_correct) wrongIdsInRange.add(a.question_id);
    if (!q || q.primary_chapter_id == null) continue;
    const agg = chapterAgg.get(q.primary_chapter_id) ?? { wrongIds: new Set(), correct: 0, total: 0 };
    agg.total += 1;
    if (a.is_correct) agg.correct += 1;
    else agg.wrongIds.add(a.question_id);
    chapterAgg.set(q.primary_chapter_id, agg);
  }
  const weakChapters: WeakChapter[] = [...chapterAgg.entries()]
    .filter(([, agg]) => agg.wrongIds.size >= WEAK_SPOT_MIN)
    .flatMap(([chapterId, agg]) => {
      const c = chapterById.get(chapterId);
      if (!c) return [];
      return [
        {
          chapterId,
          label: `${c.chapter_no} ${c.title}`,
          subjectName: subjectById.get(c.subject_id)?.name ?? c.subject_id,
          wrongQuestions: agg.wrongIds.size,
          accuracy: pct(agg.correct, agg.total) ?? 0,
        },
      ];
    })
    .sort((a, b) => b.wrongQuestions - a.wrongQuestions || a.accuracy - b.accuracy)
    .slice(0, 8);

  // ===== 弱點標籤：同一個 dz/block 標籤底下期間內答錯的題目數 >= WEAK_SPOT_MIN =====
  const tagAgg = new Map<string, { type: "dz" | "block"; value: string; ids: Set<string> }>();
  for (const t of tags) {
    if (t.tag_type === "other" || !wrongIdsInRange.has(t.question_id)) continue;
    const key = `${t.tag_type}:${t.tag_value}`;
    const agg = tagAgg.get(key) ?? { type: t.tag_type, value: t.tag_value, ids: new Set() };
    agg.ids.add(t.question_id);
    tagAgg.set(key, agg);
  }
  const weakTags: WeakTag[] = [...tagAgg.values()]
    .filter((t) => t.ids.size >= WEAK_SPOT_MIN)
    .map((t) => ({ type: t.type, value: t.value, wrongQuestions: t.ids.size }))
    .sort((a, b) => b.wrongQuestions - a.wrongQuestions)
    .slice(0, 10);

  // ===== 頑固題：累計錯 >= 2 次而且最近一次仍然錯 =====
  const history = answerHistoryByQuestion(answers);
  const stubborn: StubbornQuestion[] = currentMistakeIds
    .map((id) => ({ id, wrongCount: history.get(id)?.wrongCount ?? 0 }))
    .filter((x) => x.wrongCount >= 2)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5)
    .map(({ id, wrongCount }) => {
      const q = questionById.get(id);
      return {
        id,
        chapterId: q?.primary_chapter_id ?? null,
        source: q?.source_text ?? id,
        stem: q?.stem ?? "",
        wrongCount,
      };
    });

  // ===== 各科目前錯題數 =====
  const subjectCounts = new Map<string, number>();
  for (const id of currentMistakeIds) {
    const q = questionById.get(id);
    const s = q ? subjectIdOf(q, chapterById) : UNCATEGORIZED;
    subjectCounts.set(s, (subjectCounts.get(s) ?? 0) + 1);
  }
  const mistakesBySubject = [...subjectCounts.entries()]
    .map(([subjectId, count]) => ({
      subjectId,
      name: subjectById.get(subjectId)?.name ?? "未分類",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    range,
    kpi: {
      answered: inRange.length,
      accuracy,
      accuracyDelta: accuracy != null && prevAccuracy != null ? accuracy - prevAccuracy : null,
      currentMistakes: currentMistakeIds.length,
      streakDays,
    },
    daily,
    weakChapters,
    weakTags,
    stubborn,
    mistakesBySubject,
  };
}

/** 給 loader 用：期間內答錯過的題目 id(只需要查這些題的 tags) */
export function wrongIdsInRange(answers: UserAnswer[], range: DashboardRange, now = new Date()) {
  const days = DASHBOARD_RANGES[range];
  const since = days == null ? null : now.getTime() - days * DAY_MS;
  return [
    ...new Set(
      answers
        .filter((a) => !a.is_correct && (since == null || Date.parse(a.answered_at) >= since))
        .map((a) => a.question_id),
    ),
  ];
}
