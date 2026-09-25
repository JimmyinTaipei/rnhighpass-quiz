// 「我的題本」的 server 端資料組裝。題本頁、重做(/quiz/review)、列印頁共用，
// 確保三邊對「這一科有哪些錯題 / 收藏」的判定完全一致。

import {
  getAllChapters,
  getFavorites,
  getQuestionMetaByIds,
  getSubjects,
  getUserAnswers,
  type QuestionMeta,
} from "./data";
import {
  answerHistoryByQuestion,
  countBySubject,
  currentMistakeIds,
  subjectIdOf,
  type AnswerHistory,
  type NotebookSource,
} from "./notebook";
import type { Chapter, Subject } from "./types";

export interface NotebookIndex {
  source: NotebookSource;
  subjects: Subject[];
  chapterById: Map<number, Chapter>;
  /** 這個來源的所有題目(只有 meta，不含詳解) */
  metas: QuestionMeta[];
  countsBySubject: Map<string, number>;
  history: Map<string, AnswerHistory>;
  /** 題目 -> 排序用日期(錯題：最後答錯；收藏：收藏時間) */
  dateById: Map<string, string | null>;
  totals: { mistakes: number; favorites: number };
}

export async function loadNotebookIndex(source: NotebookSource): Promise<NotebookIndex> {
  const [answers, favorites, chapters, subjects] = await Promise.all([
    getUserAnswers(),
    getFavorites(),
    getAllChapters(),
    getSubjects(),
  ]);
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const history = answerHistoryByQuestion(answers);
  const mistakeIds = currentMistakeIds(answers);

  const dateById = new Map<string, string | null>();
  if (source === "mistakes") {
    for (const id of mistakeIds) dateById.set(id, history.get(id)?.lastWrongAt ?? null);
  } else {
    for (const f of favorites) dateById.set(f.question_id, f.created_at);
  }

  const metas = await getQuestionMetaByIds([...dateById.keys()]);
  return {
    source,
    subjects,
    chapterById,
    metas,
    countsBySubject: countBySubject(metas, chapterById),
    history,
    dateById,
    totals: { mistakes: mistakeIds.length, favorites: favorites.length },
  };
}

/** 某科的題目 id，新到舊排序 */
export function idsForSubject(index: NotebookIndex, subjectId: string): string[] {
  return index.metas
    .filter((m) => subjectIdOf(m, index.chapterById) === subjectId)
    .map((m) => m.id)
    .sort((a, b) =>
      (index.dateById.get(b) ?? "").localeCompare(index.dateById.get(a) ?? ""),
    );
}
