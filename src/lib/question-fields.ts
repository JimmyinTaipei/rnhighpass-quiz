// dev mode 編輯表單用的欄位清單。
//
// 刻意獨立成一個「非 use server」模組：這裡的匯出本來放在 src/lib/actions.ts，
// 但 "use server" 檔案的規則是「每一個匯出都必須是 async function」，
// 匯出一般的 const 陣列(非函式值)會讓整支模組在執行期直接炸掉
// ("A 'use server' file can only export async functions, found object")，
// 而且會連帶讓任何 import 到它的元件都壞掉——這裡就是 QuestionCard 透過
// QuestionEditForm 間接 import actions.ts 而整個掛掉的原因。

/** dev mode 可編輯的欄位。結構性欄位(章節、主題、梯次)刻意不開放。 */
export const EDITABLE_QUESTION_FIELDS = [
  "stem",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "answer",
  "explanation_text",
  "key_point",
  "correct_reason",
  "wrong_options_reason",
  "extra_notes",
] as const;

export type EditableQuestionField = (typeof EDITABLE_QUESTION_FIELDS)[number];

/** 這幾欄在 DB 是 NOT NULL，不能存成空值 */
export const REQUIRED_QUESTION_FIELDS: EditableQuestionField[] = [
  "stem",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "answer",
  "explanation_text",
];
