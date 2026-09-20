import {
  MOCK_PAPERS,
  MOCK_PAPER_LOADERS,
  type MockQuestionData,
} from "@/data/mock-exam";
import { isMockGroupId, type MockGroupId, type PaperKey } from "./labels";

// 模擬考的題目來自打包好的 JSON(由 database/scripts/export_mock_papers.py 產生)，
// 不連 Supabase：模擬考站是公開免登入的，帶 anon key 上去等於把整個題庫
// (含詳解、筆記卡)開放給任何人抓取。題庫更新後要重跑匯出指令再部署。

export interface ExamPaper {
  sitting: string;
  isMakeup: boolean;
  groupId: MockGroupId;
  questionCount: number;
}

/** 考卷清單，新到舊排序 */
export async function getExamPapers(): Promise<ExamPaper[]> {
  return MOCK_PAPERS.filter((p) => isMockGroupId(p.groupId))
    .map((p) => ({
      sitting: p.sitting,
      // 匯出的都是正式考試(補考沒有放上模擬考站)
      isMakeup: false,
      groupId: p.groupId as MockGroupId,
      questionCount: p.questionCount,
    }))
    .sort((a, b) => b.sitting.localeCompare(a.sitting));
}

/** 考試中會用到的題目欄位(匯出時就已經不含詳解) */
export type MockQuestion = MockQuestionData;

export async function getMockExamPaper(
  paper: PaperKey,
  groupId: MockGroupId,
): Promise<MockQuestion[]> {
  if (paper.isMakeup) return [];
  const load = MOCK_PAPER_LOADERS[`${paper.sitting}_${groupId}`];
  if (!load) return [];
  return load();
}
