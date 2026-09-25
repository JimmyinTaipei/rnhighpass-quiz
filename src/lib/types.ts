// 對應 database/migrations/0001_init_schema.sql + 0002_user_answers_and_rls.sql
// 之後如果 schema 改了，這裡要手動同步更新。

export interface Subject {
  id: string;
  name: string;
  order_index: number;
}

export interface Chapter {
  id: number;
  subject_id: string;
  chapter_no: string;
  title: string;
  full_title: string;
  order_index: number;
}

export interface Topic {
  id: number;
  chapter_id: number;
  parent_topic_id: number | null;
  level: number;
  heading_text: string;
  is_empty: boolean;
  order_index: number;
  natural_key: string;
}

export interface Question {
  id: string;
  source_text: string;
  exam_sitting: string;
  is_makeup: boolean;
  exam_group_id: string;
  question_no: number;
  primary_chapter_id: number | null;
  topic_id: number | null;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  explanation_text: string;
  key_point: string | null;
  correct_reason: string | null;
  wrong_options_reason: string | null;
  extra_notes: string | null;
  ref: string | null;
  /** migration 0005：被網頁 dev mode 手動編輯過的欄位，sync 時不會被覆蓋 */
  edited_fields?: string[] | null;
  edited_at?: string | null;
}

export interface QuestionTag {
  question_id: string;
  tag_type: "block" | "dz" | "other";
  tag_value: string;
}

export interface KnowledgeCard {
  node_id: string;
  subject_id: string;
  chapter_id: number | null;
  card_title: string;
  card_subtitle: string | null;
  status: string | null;
}

export interface CardBullet {
  card_node_id: string;
  ordinal: number;
  bullet_text: string;
}

/**
 * 比較表(DB 的 tables_)。來源是 多保命護理分章/tables/<科目>/*.json，
 * 由 sync_all.py 匯入；headers/rows 在 DB 是 jsonb，形狀是矩形字串矩陣。
 *
 * scope='shared' 代表放在 tables/00_共用/ 底下的跨科表，此時 subject_id 為 null。
 */
export interface ComparisonTable {
  id: string;                 // 'tbl_acid_base_disorders'
  title: string;
  reason: string | null;      // 為何值得比較的說明，適合直接當敘述文字顯示
  scope: "shared" | "subject";
  subject_id: string | null;  // scope='subject' 時等於 subjects.id，如 '07_內外'
  headers: string[];
  rows: string[][];
  /** migration 0010：被網頁 dev mode 手動編輯過的欄位，sync 時不會被覆蓋 */
  edited_fields?: string[] | null;
  edited_at?: string | null;
}

export interface QuestionImage {
  id: number;
  filename: string;
  question_id: string | null;
  option_letter: "A" | "B" | "C" | "D" | null;
  caption: string | null;
  image_type: string | null;
  source_kind: "ai_generated" | "scanned_exam";
  storage_path: string | null;
}

export type QuizMode = "practice" | "chapter" | "tag" | "mistakes" | "quiz";

export interface UserAnswer {
  id: number;
  user_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  quiz_mode: string;
  answered_at: string;
}

// 前端組出來的複合視圖：一個主題底下的筆記卡 + 相關題目
export interface TopicWithContent extends Topic {
  cards: (KnowledgeCard & { bullets: string[] })[];
  questions: Question[];
}
