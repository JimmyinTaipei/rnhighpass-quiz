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
  ref: string | null;
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

export type QuizMode = "practice" | "chapter" | "tag" | "mistakes";

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
