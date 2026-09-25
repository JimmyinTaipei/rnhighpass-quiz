// 儀表板 / 統計頁的 server 端資料組裝

import {
  getAllChapters,
  getQuestionMetaByIds,
  getSubjects,
  getTagsForQuestions,
  getUserAnswers,
} from "./data";
import { computeDashboard, wrongIdsInRange, type DashboardRange } from "./dashboard";

export async function loadDashboard(range: DashboardRange) {
  const [answers, chapters, subjects] = await Promise.all([
    getUserAnswers(),
    getAllChapters(),
    getSubjects(),
  ]);
  const answeredIds = [...new Set(answers.map((a) => a.question_id))];
  const [questions, tags] = await Promise.all([
    getQuestionMetaByIds(answeredIds),
    // tags 只查期間內答錯的題目，不需要整個作答歷史
    getTagsForQuestions(wrongIdsInRange(answers, range)),
  ]);
  const dashboard = computeDashboard({ answers, questions, tags, chapters, subjects, range });
  return { dashboard, answers, questions, chapters, subjects };
}
