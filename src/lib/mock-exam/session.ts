// 模擬考作答狀態：純資料 + 純函式，client 元件與測試都可以直接用。
import { isAnswerCorrect, shuffledOptionOrder, type OptionKey } from "@/lib/quiz-utils";
import { EXAM_DURATION_MS } from "./labels";
import type { MockQuestion } from "./data";

export type Mark = "triangle" | "circle" | "square";

export interface ExamSession {
  version: 1;
  startedAt: number;
  /** 交卷時間；null = 作答中 */
  finishedAt: number | null;
  /** 每題的顯示順序：陣列位置 = 畫面上的 (A)(B)(C)(D)，內容 = 原始選項字母 */
  orders: Record<string, OptionKey[]>;
  /** 使用者的答案，一律存「原始」字母，計分與成績頁都不用再轉換 */
  answers: Record<string, OptionKey>;
  marks: Record<string, Mark>;
  index: number;
  /** 顯示比例(%)，比照考選部的放大/還原/縮小 */
  zoom: number;
  /**
   * 考前「是否顯示成績」的選擇。舊存檔沒有這個欄位，一律視為要顯示
   * (用 session.showScore !== false 判斷)。
   */
  showScore?: boolean;
}

export function createSession(questions: MockQuestion[], showScore = true): ExamSession {
  return {
    version: 1,
    startedAt: Date.now(),
    finishedAt: null,
    orders: Object.fromEntries(questions.map((q) => [q.id, shuffledOptionOrder(q)])),
    answers: {},
    marks: {},
    index: 0,
    zoom: 100,
    showScore,
  };
}

export function remainingMs(session: ExamSession, now: number): number {
  return Math.max(0, session.startedAt + EXAM_DURATION_MS - now);
}

// ===== localStorage =====
// 所有讀寫都包 try/catch：無痕視窗、封鎖網站資料時 localStorage 可能直接丟錯，
// 此時退化成「重新整理就重來」，考試本身照常進行。

const storageKey = (paperSlug: string, groupId: string) =>
  `mock-exam:v1:${paperSlug}:${groupId}`;

export function loadSession(
  paperSlug: string,
  groupId: string,
  questions: MockQuestion[],
): ExamSession | null {
  try {
    const raw = localStorage.getItem(storageKey(paperSlug, groupId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamSession;
    if (parsed?.version !== 1 || typeof parsed.startedAt !== "number") return null;
    // 題目在存檔之後有增減(資料更新)時，舊的作答無法對應，視為無效
    const ids = Object.keys(parsed.orders ?? {});
    if (ids.length !== questions.length || questions.some((q) => !parsed.orders[q.id])) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(paperSlug: string, groupId: string, session: ExamSession) {
  try {
    localStorage.setItem(storageKey(paperSlug, groupId), JSON.stringify(session));
  } catch {
    // 寫不進去就算了，見上方說明
  }
}

export function clearSession(paperSlug: string, groupId: string) {
  try {
    localStorage.removeItem(storageKey(paperSlug, groupId));
  } catch {
    // 同上
  }
}

// ===== 計分 =====

export type QuestionOutcome = "correct" | "wrong" | "unanswered";

export interface ExamResult {
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  outcomes: Record<string, QuestionOutcome>;
}

/**
 * 每題配分 = 100 / 題數(50 題即每題 2 分)。
 * 送分題不論作答與否都給分——比照國考「該題一律給分」的處理方式。
 */
export function gradeSession(session: ExamSession, questions: MockQuestion[]): ExamResult {
  const outcomes: Record<string, QuestionOutcome> = {};
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  for (const q of questions) {
    const selected = session.answers[q.id];
    const isFree = isAnswerCorrect(q.answer, "__none__");
    let outcome: QuestionOutcome;
    if (isFree) outcome = "correct";
    else if (!selected) outcome = "unanswered";
    else outcome = isAnswerCorrect(q.answer, selected) ? "correct" : "wrong";
    outcomes[q.id] = outcome;
    if (outcome === "correct") correct++;
    else if (outcome === "wrong") wrong++;
    else unanswered++;
  }
  const perQuestion = questions.length === 0 ? 0 : 100 / questions.length;
  const score = Math.round(correct * perQuestion * 100) / 100;
  return { score, correct, wrong, unanswered, outcomes };
}
