import { createClient } from "@/lib/supabase-server";
import type { Question } from "@/lib/types";
import { isMockGroupId, type MockGroupId, type PaperKey } from "./labels";

export interface ExamPaper {
  sitting: string;
  isMakeup: boolean;
  groupId: MockGroupId;
  questionCount: number;
}

/** 考卷清單(來自 migration 0007 的 exam_papers view)，新到舊排序 */
export async function getExamPapers(): Promise<ExamPaper[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_papers")
    .select("exam_sitting, exam_group_id, is_makeup, question_count")
    .order("exam_sitting", { ascending: false });
  if (error) throw error;

  return (data ?? [])
    .filter((r) => isMockGroupId(r.exam_group_id))
    .map((r) => ({
      sitting: r.exam_sitting as string,
      isMakeup: !!r.is_makeup,
      groupId: r.exam_group_id as MockGroupId,
      questionCount: r.question_count as number,
    }));
}

/** 考試中會用到的題目欄位。刻意不帶詳解：交卷後也不顯示詳解，就不必送到瀏覽器 */
export type MockQuestion = Pick<
  Question,
  "id" | "question_no" | "stem" | "option_a" | "option_b" | "option_c" | "option_d" | "answer"
> & {
  /** 題幹附圖(考卷掃描圖)的檔名，對應 public/exam-images/ */
  images: string[];
};

export async function getMockExamPaper(
  paper: PaperKey,
  groupId: MockGroupId,
): Promise<MockQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, question_no, stem, option_a, option_b, option_c, option_d, answer")
    .eq("exam_sitting", paper.sitting)
    .eq("is_makeup", paper.isMakeup)
    .eq("exam_group_id", groupId)
    .order("question_no");
  if (error) throw error;
  const questions = data ?? [];
  if (questions.length === 0) return [];

  // 選項圖(option_letter 有值)已經以 markdown 圖片語法寫在選項文字裡，
  // 這裡只取題幹圖。AI 生成的解說圖不屬於考卷，不在考試中顯示。
  const { data: images, error: imageError } = await supabase
    .from("images")
    .select("question_id, filename")
    .eq("source_kind", "scanned_exam")
    .is("option_letter", null)
    .in(
      "question_id",
      questions.map((q) => q.id),
    )
    .order("filename");
  if (imageError) throw imageError;

  const byQuestion = new Map<string, string[]>();
  for (const img of images ?? []) {
    if (!img.question_id) continue;
    const list = byQuestion.get(img.question_id) ?? [];
    list.push(img.filename);
    byQuestion.set(img.question_id, list);
  }

  return questions.map((q) => ({ ...q, images: byQuestion.get(q.id) ?? [] }));
}
