// 這個檔案由 database/scripts/export_mock_papers.py 產生，請不要手改。
// 題庫更新後重跑該指令，並重新部署模擬考站。

export interface MockQuestionData {
  id: string;
  question_no: number;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  /** 題幹附圖檔名，對應 public/exam-images/ */
  images: string[];
}

export interface MockPaperMeta {
  sitting: string;
  groupId: string;
  questionCount: number;
}

/** 模擬考站提供的考卷(新到舊由 data.ts 排序) */
export const MOCK_PAPERS: MockPaperMeta[] = [
  { sitting: "115-2", groupId: "BM", questionCount: 50 },
  { sitting: "115-2", groupId: "FA", questionCount: 50 },
  { sitting: "115-2", groupId: "MS", questionCount: 50 },
  { sitting: "115-2", groupId: "OP", questionCount: 50 },
  { sitting: "115-2", groupId: "PC", questionCount: 50 },
  { sitting: "115-1", groupId: "BM", questionCount: 50 },
  { sitting: "115-1", groupId: "FA", questionCount: 50 },
  { sitting: "115-1", groupId: "MS", questionCount: 50 },
  { sitting: "115-1", groupId: "OP", questionCount: 50 },
  { sitting: "115-1", groupId: "PC", questionCount: 50 },
  { sitting: "114-3", groupId: "BM", questionCount: 50 },
  { sitting: "114-3", groupId: "FA", questionCount: 50 },
  { sitting: "114-3", groupId: "MS", questionCount: 50 },
  { sitting: "114-3", groupId: "OP", questionCount: 50 },
  { sitting: "114-3", groupId: "PC", questionCount: 50 },
];

/** slug(`<sitting>_<group>`) -> 該份考卷的題目；動態 import 讓每份考卷各自成為一個 chunk */
export const MOCK_PAPER_LOADERS: Record<string, () => Promise<MockQuestionData[]>> = {
  "115-2_BM": () => import("./115-2_BM.json").then((m) => m.default as MockQuestionData[]),
  "115-2_FA": () => import("./115-2_FA.json").then((m) => m.default as MockQuestionData[]),
  "115-2_MS": () => import("./115-2_MS.json").then((m) => m.default as MockQuestionData[]),
  "115-2_OP": () => import("./115-2_OP.json").then((m) => m.default as MockQuestionData[]),
  "115-2_PC": () => import("./115-2_PC.json").then((m) => m.default as MockQuestionData[]),
  "115-1_BM": () => import("./115-1_BM.json").then((m) => m.default as MockQuestionData[]),
  "115-1_FA": () => import("./115-1_FA.json").then((m) => m.default as MockQuestionData[]),
  "115-1_MS": () => import("./115-1_MS.json").then((m) => m.default as MockQuestionData[]),
  "115-1_OP": () => import("./115-1_OP.json").then((m) => m.default as MockQuestionData[]),
  "115-1_PC": () => import("./115-1_PC.json").then((m) => m.default as MockQuestionData[]),
  "114-3_BM": () => import("./114-3_BM.json").then((m) => m.default as MockQuestionData[]),
  "114-3_FA": () => import("./114-3_FA.json").then((m) => m.default as MockQuestionData[]),
  "114-3_MS": () => import("./114-3_MS.json").then((m) => m.default as MockQuestionData[]),
  "114-3_OP": () => import("./114-3_OP.json").then((m) => m.default as MockQuestionData[]),
  "114-3_PC": () => import("./114-3_PC.json").then((m) => m.default as MockQuestionData[]),
};
