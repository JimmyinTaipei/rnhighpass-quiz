// 間隔複習：從作答紀錄算出每題下次該複習的日子(不另存狀態，作答紀錄就是唯一依據)。
// 純函式，不 import server-only 模組。
//
// 規則：
// - 複習對象：答錯過的題目，以及收藏的題目
// - 最後一次答錯 → 隔 1 天；之後連續答對 1、2、3、4 次 → 隔 3、7、14、30 天
// - 連續答對 5 次「畢業」，不再排複習(之後又答錯就重新開始)
// - 收藏但還沒做過的題目：今天就該複習
// 日期以台灣時間的「日」為單位，當天任何時候作答都算同一天。

import type { UserAnswer } from "./types";

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;
const DAY_MS = 86_400_000;

/** 台灣時間的日序號(1970-01-01 起第幾天)，用來比較「哪一天」 */
export function taipeiDay(iso: string | Date): number {
  const t = typeof iso === "string" ? Date.parse(iso) : iso.getTime();
  return Math.floor((t + 8 * 3_600_000) / DAY_MS);
}

export interface ReviewItem {
  questionId: string;
  /** 該複習的日(taipeiDay)；畢業的題目沒有 */
  dueDay: number;
  /** 最後一次答錯之後連續答對幾次 */
  streak: number;
}

export interface ReviewSchedule {
  /** 今天(含逾期)該複習的題目，逾期最久的在前 */
  due: ReviewItem[];
  /** 之後 7 天每天到期的題數(index 0 = 明天) */
  upcoming: number[];
  /** 連續答對 5 次、已經不用再複習的題數 */
  graduated: number;
}

export function reviewSchedule(answers: UserAnswer[], favoriteIds: string[], now = new Date()): ReviewSchedule {
  const today = taipeiDay(now);
  const byQuestion = new Map<string, UserAnswer[]>();
  for (const a of answers) {
    const list = byQuestion.get(a.question_id) ?? [];
    list.push(a);
    byQuestion.set(a.question_id, list);
  }

  const items: ReviewItem[] = [];
  let graduated = 0;
  const consider = new Set<string>(favoriteIds);
  for (const [qid, list] of byQuestion) if (list.some((a) => !a.is_correct)) consider.add(qid);

  for (const qid of consider) {
    const list = (byQuestion.get(qid) ?? []).slice().sort((a, b) => a.answered_at.localeCompare(b.answered_at));
    if (list.length === 0) {
      items.push({ questionId: qid, dueDay: today, streak: 0 });
      continue;
    }
    // 一天算一次：當天只要答錯過就算錯(當天重做到對不等於記住了)
    const daily = new Map<number, boolean>();
    for (const a of list) {
      const d = taipeiDay(a.answered_at);
      daily.set(d, (daily.get(d) ?? true) && a.is_correct);
    }
    const days = [...daily.entries()].sort((a, b) => a[0] - b[0]);
    let streak = 0;
    for (let i = days.length - 1; i >= 0 && days[i][1]; i--) streak++;
    const lastDay = days[days.length - 1][0];
    if (streak >= REVIEW_INTERVALS.length) {
      graduated++;
      continue;
    }
    items.push({ questionId: qid, dueDay: lastDay + REVIEW_INTERVALS[streak], streak });
  }

  const due = items.filter((i) => i.dueDay <= today).sort((a, b) => a.dueDay - b.dueDay);
  const upcoming = Array.from({ length: 7 }, (_, d) => items.filter((i) => i.dueDay === today + d + 1).length);
  return { due, upcoming, graduated };
}
