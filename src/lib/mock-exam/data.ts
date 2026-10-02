import {
  MOCK_PAPERS,
  MOCK_PAPER_LOADERS,
  type MockQuestionData,
} from "@/data/mock-exam";
import { isMockOnly } from "@/lib/site-mode";
import { createClient } from "@/lib/supabase-server";
import { isMockGroupId, type MockGroupId, type PaperKey } from "./labels";

// 題目來源依部署而不同：
// - 模擬考站(exam.rnhighpass.com，SITE_MODE=mock)：打包好的 JSON
//   (由 database/scripts/export_mock_papers.py 產生)，不連 Supabase——
//   那個站公開免登入，帶 anon key 上去等於把整個題庫(含詳解、筆記卡)開放給任何人抓取。
// - 主站的「歷年考題模擬」：要登入，直接查 Supabase，資料庫有哪些梯次就能選哪些。

export interface ExamPaper {
  sitting: string;
  isMakeup: boolean;
  groupId: MockGroupId;
  questionCount: number;
}

/** 考卷清單，新到舊排序 */
export async function getExamPapers(): Promise<ExamPaper[]> {
  if (!isMockOnly()) return getExamPapersFromDb();
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
  if (!isMockOnly()) return getMockExamPaperFromDb(paper, groupId);
  if (paper.isMakeup) return [];
  const load = MOCK_PAPER_LOADERS[`${paper.sitting}_${groupId}`];
  if (!load) return [];
  return load();
}

// ===== 主站：從 Supabase 讀 =====

async function getExamPapersFromDb(): Promise<ExamPaper[]> {
  const supabase = await createClient();
  // exam_papers view 在資料庫端 group by(migration 0007)，一份考卷一列
  const { data, error } = await supabase
    .from("exam_papers")
    .select("exam_sitting, exam_group_id, is_makeup, question_count");
  if (error) throw error;
  return (data ?? [])
    .filter((p) => isMockGroupId(p.exam_group_id))
    .map((p) => ({
      sitting: p.exam_sitting as string,
      isMakeup: p.is_makeup as boolean,
      groupId: p.exam_group_id as MockGroupId,
      questionCount: p.question_count as number,
    }))
    // 新到舊；同一梯次正式考試排在補考前
    .sort((a, b) => b.sitting.localeCompare(a.sitting) || Number(a.isMakeup) - Number(b.isMakeup));
}

/** 欄位與 export_mock_papers.py 匯出的 JSON 相同(不含詳解)，作答元件不必分兩套 */
async function getMockExamPaperFromDb(paper: PaperKey, groupId: MockGroupId): Promise<MockQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, question_no, stem, option_a, option_b, option_c, option_d, answer")
    .eq("exam_sitting", paper.sitting)
    .eq("exam_group_id", groupId)
    .eq("is_makeup", paper.isMakeup)
    .order("question_no");
  if (error) throw error;
  const questions = data ?? [];
  if (questions.length === 0) return [];

  // 題幹附圖(考卷掃描圖)；選項圖已經以 markdown 寫在選項文字裡
  const { data: images, error: imageError } = await supabase
    .from("images")
    .select("question_id, filename")
    .eq("source_kind", "scanned_exam")
    .is("option_letter", null)
    .in("question_id", questions.map((q) => q.id))
    .order("filename");
  if (imageError) throw imageError;
  const byQuestion = new Map<string, string[]>();
  for (const img of images ?? []) {
    const list = byQuestion.get(img.question_id) ?? [];
    list.push(img.filename);
    byQuestion.set(img.question_id, list);
  }
  return questions.map((q) => ({ ...q, images: byQuestion.get(q.id) ?? [] }));
}
