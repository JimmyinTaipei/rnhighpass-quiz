// 題號解析：搜尋框同時接受兩種寫法，畫面上一律建議用 Source。
//   ID     113-1_BM_004、106-2_makeup_BM_034(資料庫主鍵)
//   Source 113-1-基醫-4、106-2-補考-基醫-34(考卷上的寫法，讀者看得懂)
// Source 可以只寫到科目(113-1-基醫)，列出那一卷全部題目。

const SUBJECT_CODES: Record<string, string> = {
  基醫: "BM",
  基護行政: "FA",
  內外: "MS",
  產兒: "OP",
  精社: "PC",
};
const CODE_SUBJECTS = Object.fromEntries(Object.entries(SUBJECT_CODES).map(([k, v]) => [v, k]));

export type QuestionRef =
  /** 一題：用 id 查 */
  | { kind: "id"; id: string; source: string }
  /** 一整卷：用 source_text 前綴查 */
  | { kind: "paper"; prefix: string };

export const SOURCE_EXAMPLE = "113-1-基醫-4";

export function parseQuestionRef(raw: string): QuestionRef | null {
  const q = raw.trim();
  if (!q) return null;

  const id = /^(\d{3})-(\d)(?:[-_](makeup))?[-_]([A-Za-z]{2})[-_](\d{1,3})$/i.exec(q);
  if (id) {
    const [, year, no, makeup, code, num] = id;
    const subject = CODE_SUBJECTS[code.toUpperCase()];
    if (!subject) return null;
    return build(year, no, !!makeup, subject, Number(num));
  }

  // 「113年第1次 基醫 第4題」這類寫法也接受：去掉年、第、次、題與空白標點，統一成 -
  const s = q
    .replace(/[年次題]/g, "-")
    .replace(/第/g, "")
    .replace(/[\s_、，,／/.。]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const src = /^(\d{3})-?(\d)-?(補考)?-?(基醫|基護行政|基護|內外|產兒|精社)(?:-?(\d{1,3}))?$/.exec(s);
  if (!src) return null;
  const [, year, no, makeup, rawSubject, num] = src;
  const subject = rawSubject === "基護" ? "基護行政" : rawSubject;
  if (num === undefined) {
    return { kind: "paper", prefix: `${year}-${no}-${makeup ? "補考-" : ""}${subject}-` };
  }
  return build(year, no, !!makeup, subject, Number(num));
}

function build(year: string, no: string, makeup: boolean, subject: string, num: number): QuestionRef {
  const code = SUBJECT_CODES[subject];
  return {
    kind: "id",
    id: `${year}-${no}${makeup ? "_makeup" : ""}_${code}_${String(num).padStart(3, "0")}`,
    source: `${year}-${no}-${makeup ? "補考-" : ""}${subject}-${num}`,
  };
}
