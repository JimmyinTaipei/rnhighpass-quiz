import type { Question, UserAnswer } from "./types";

// 少數題目的 answer 欄位不是單一字母，例如 "B or D"（爭議題）、
// "A(原為C)"（更正題，A 才是現在的正解）、"送分"（送分題，沒有正解）。
export function parseAcceptedAnswers(answer: string): string[] {
  const correctionMatch = answer.match(/^([A-D])\(原/);
  if (correctionMatch) return [correctionMatch[1]];
  const letters = answer.match(/[A-D]/g);
  return letters ? [...new Set(letters)] : [];
}

export function isAnswerCorrect(answer: string, selected: string): boolean {
  const accepted = parseAcceptedAnswers(answer);
  if (accepted.length === 0) return true; // 送分：選什麼都算對
  return accepted.includes(selected);
}

// answers 需已依 answered_at 由新到舊排序（getUserAnswers 已經這樣排）
export function latestAnswerPerQuestion(
  answers: UserAnswer[],
): Map<string, UserAnswer> {
  const map = new Map<string, UserAnswer>();
  for (const a of answers) {
    if (!map.has(a.question_id)) {
      map.set(a.question_id, a);
    }
  }
  return map;
}

export interface ChapterStat {
  chapterId: number;
  answered: number;
  correct: number;
  accuracy: number; // 0-100，answered 為 0 時是 0
}

/**
 * 各章節「已作答題目」的正確率(以每題最近一次作答為準)。
 * chapterOf 決定題目算在哪一章：統計頁用 topics 的章節，才會和
 * chapter_question_counts(涵蓋率的分母)一致。
 */
export function computeChapterStats(
  questionIds: string[],
  answers: UserAnswer[],
  chapterOf: (questionId: string) => number | null,
): ChapterStat[] {
  const latest = latestAnswerPerQuestion(answers);
  const byChapter = new Map<number, { answered: number; correct: number }>();

  for (const id of questionIds) {
    const chapterId = chapterOf(id);
    const answer = latest.get(id);
    if (chapterId == null || !answer) continue;
    const bucket = byChapter.get(chapterId) ?? { answered: 0, correct: 0 };
    bucket.answered += 1;
    if (answer.is_correct) bucket.correct += 1;
    byChapter.set(chapterId, bucket);
  }

  return [...byChapter.entries()].map(([chapterId, s]) => ({
    chapterId,
    answered: s.answered,
    correct: s.correct,
    accuracy: s.answered === 0 ? 0 : Math.round((s.correct / s.answered) * 100),
  }));
}

// ===== 選項打亂 =====

export const OPTION_KEYS = ["A", "B", "C", "D"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

type OptionFields = Pick<Question, "option_a" | "option_b" | "option_c" | "option_d">;

/**
 * 產生一組打亂後的選項順序(陣列內容是「原始」字母，陣列位置是顯示位置)。
 *
 * 選項有空白的題目不打亂：那是整題(含選項)都印在掃描圖裡的題目，
 * 圖上的 A–D 位置是固定的，打亂會讓顯示字母跟圖對不起來。
 */
export function shuffledOptionOrder(question: OptionFields): OptionKey[] {
  const order: OptionKey[] = [...OPTION_KEYS];
  const texts = [question.option_a, question.option_b, question.option_c, question.option_d];
  if (texts.some((t) => !t || !t.trim())) return order;
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Fisher–Yates 洗牌，回傳新陣列 */
export function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
