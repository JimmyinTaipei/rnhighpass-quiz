import type { Chapter, Question, Subject, UserAnswer } from "./types";
import { EXAM_GROUP_ORDER, EXAM_GROUP_LABELS, type ExamGroupId } from "./subject-groups";

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

export interface MistakeSubjectGroup {
  subjectId: string | null; // null = 未分類
  subjectName: string;
  orderIndex: number; // 未分類排最後
  questions: Question[]; // 依最新答錯時間新到舊排序
}

export interface MistakeCategoryGroup {
  id: ExamGroupId;
  label: string;
  count: number;
  subjectGroups: MistakeSubjectGroup[];
}

export function groupMistakes(
  questions: Question[],
  answers: UserAnswer[],
  chapters: Chapter[],
  subjects: Subject[],
): MistakeCategoryGroup[] {
  const latest = latestAnswerPerQuestion(answers);
  const chapterToSubject = new Map(chapters.map((c) => [c.id, c.subject_id]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));

  const byCategory = new Map<ExamGroupId, Map<string | null, Question[]>>();
  for (const id of EXAM_GROUP_ORDER) byCategory.set(id, new Map());

  for (const q of questions) {
    const cat = byCategory.get(q.exam_group_id as ExamGroupId);
    if (!cat) continue; // 未知的 exam_group_id，防禦性略過
    const subjectId =
      q.primary_chapter_id != null
        ? (chapterToSubject.get(q.primary_chapter_id) ?? null)
        : null;
    const list = cat.get(subjectId) ?? [];
    list.push(q);
    cat.set(subjectId, list);
  }

  return EXAM_GROUP_ORDER.map((id) => {
    const subjectMap = byCategory.get(id)!;
    const subjectGroups: MistakeSubjectGroup[] = [...subjectMap.entries()]
      .map(([subjectId, qs]) => {
        const subject = subjectId ? subjectById.get(subjectId) : undefined;
        const sorted = [...qs].sort((a, b) => {
          const ta = latest.get(a.id)?.answered_at ?? "";
          const tb = latest.get(b.id)?.answered_at ?? "";
          return tb.localeCompare(ta);
        });
        return {
          subjectId,
          subjectName: subject?.name ?? "未分類",
          orderIndex: subject?.order_index ?? Number.POSITIVE_INFINITY,
          questions: sorted,
        };
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
    const count = subjectGroups.reduce((n, g) => n + g.questions.length, 0);
    return { id, label: EXAM_GROUP_LABELS[id], count, subjectGroups };
  }).filter((c) => c.count > 0);
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
