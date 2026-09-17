import type { Subject } from "./types";

export type ExamGroupId = "BM" | "FA" | "MS" | "OP" | "PC";

export const EXAM_GROUP_ORDER: ExamGroupId[] = ["BM", "FA", "MS", "OP", "PC"];

export const EXAM_GROUP_LABELS: Record<ExamGroupId, string> = {
  BM: "基礎醫學",
  FA: "基護與行政",
  MS: "內外科",
  OP: "產科兒科",
  PC: "精神社區",
};

// 11 科課綱固定順序（order_index 1-11），依區間對應到 5 大類：
// 1-4 生解/病理/藥理/微免 -> 基礎醫學
// 5-6 基護/行政 -> 基護與行政
// 7   內外 -> 內外科
// 8-9 產科/兒科 -> 產科兒科
// 10-11 精神/社區 -> 精神社區
export function subjectGroup(subject: Pick<Subject, "order_index">): ExamGroupId {
  const i = subject.order_index;
  if (i <= 4) return "BM";
  if (i <= 6) return "FA";
  if (i === 7) return "MS";
  if (i <= 9) return "OP";
  return "PC";
}

export interface SubjectGroup {
  id: ExamGroupId;
  label: string;
  subjects: Subject[];
}

export function groupSubjects(subjects: Subject[]): SubjectGroup[] {
  const sorted = [...subjects].sort((a, b) => a.order_index - b.order_index);
  return EXAM_GROUP_ORDER.map((id) => ({
    id,
    label: EXAM_GROUP_LABELS[id],
    subjects: sorted.filter((s) => subjectGroup(s) === id),
  })).filter((g) => g.subjects.length > 0);
}
