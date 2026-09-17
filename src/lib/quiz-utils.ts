import type { UserAnswer } from "./types";

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

export function mistakeQuestionIds(answers: UserAnswer[]): string[] {
  const latest = latestAnswerPerQuestion(answers);
  return [...latest.values()]
    .filter((a) => !a.is_correct)
    .map((a) => a.question_id);
}

export interface ChapterStat {
  chapterId: number;
  total: number;
  answered: number;
  correct: number;
  accuracy: number; // 0-100，answered 為 0 時是 0
}

export function computeChapterStats(
  questions: { id: string; primary_chapter_id: number | null }[],
  answers: UserAnswer[],
): ChapterStat[] {
  const latest = latestAnswerPerQuestion(answers);
  const byChapter = new Map<number, { total: number; answered: number; correct: number }>();

  for (const q of questions) {
    if (q.primary_chapter_id == null) continue;
    const bucket = byChapter.get(q.primary_chapter_id) ?? {
      total: 0,
      answered: 0,
      correct: 0,
    };
    bucket.total += 1;
    const answer = latest.get(q.id);
    if (answer) {
      bucket.answered += 1;
      if (answer.is_correct) bucket.correct += 1;
    }
    byChapter.set(q.primary_chapter_id, bucket);
  }

  return [...byChapter.entries()].map(([chapterId, s]) => ({
    chapterId,
    total: s.total,
    answered: s.answered,
    correct: s.correct,
    accuracy: s.answered === 0 ? 0 : Math.round((s.correct / s.answered) * 100),
  }));
}
