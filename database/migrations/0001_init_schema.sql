-- 護理國考題庫資料庫 schema
-- 設計原則：保留來源資料裡已存在的穩定 ID 當主鍵（題目 ID、table_id 等），
-- 其餘用 surrogate key（bigserial）+ unique 約束。
-- 全部表格皆可安全地重覆執行 upsert（sync_all.py 全量重建 + upsert 策略）。

begin;

-- ========== 科目 / 考科分類 ==========

create table if not exists subjects (
  id text primary key,              -- e.g. '07_內外'
  name text not null,                -- e.g. '內外'
  order_index int not null default 0
);

create table if not exists exam_groups (
  id text primary key,               -- BM / FA / MS / OP / PC
  name text not null                 -- 基醫 / 基護與行政 / 內外科 / 產兒 / 精社
);

-- ========== 章節 / 主題階層 ==========

create table if not exists chapters (
  id bigserial primary key,
  subject_id text not null references subjects(id) on delete cascade,
  chapter_no text not null,          -- e.g. 'Ch09'
  title text not null,               -- e.g. '呼吸系統疾病'
  full_title text not null,          -- e.g. '內外-Ch09呼吸系統疾病' (chap:/xchap: 用這個字串比對)
  order_index int not null default 0,
  unique (subject_id, chapter_no),
  unique (full_title)
);

create table if not exists textbook_refs (
  id bigserial primary key,
  chapter_id bigint not null references chapters(id) on delete cascade,
  textbook_name text not null,       -- e.g. '捷徑'
  textbook_chapter_label text not null, -- e.g. 'Ch01~03'
  unique (chapter_id, textbook_name)
);

create table if not exists topics (
  id bigserial primary key,
  chapter_id bigint not null references chapters(id) on delete cascade,
  parent_topic_id bigint references topics(id) on delete cascade,
  level int not null,                -- 2 = ##, 3 = ###
  heading_text text not null,
  is_empty boolean not null default false, -- 標題含 [空]，代表目前無題目
  order_index int not null default 0,
  -- natural_key 由 parser 產生（如 '大腸>常見疾病'），確保同一章節內即使
  -- 不同上層主題出現相同子標題文字也不會衝突；同時避免 parent_topic_id 為
  -- NULL 時 unique 約束失效（Postgres 視 NULL 彼此不相等，無法被 ON CONFLICT 偵測）的問題。
  natural_key text not null,
  unique (chapter_id, natural_key)
);

-- ========== 題目 ==========

create table if not exists questions (
  id text primary key,               -- 原始題目 ID，如 '114-3_FA_032'
  source_text text not null,         -- e.g. '114-3-基護行政-32'
  exam_sitting text not null,        -- e.g. '114-3'
  is_makeup boolean not null default false,
  exam_group_id text not null references exam_groups(id),
  question_no int not null,
  primary_chapter_id bigint references chapters(id),
  topic_id bigint references topics(id),
  stem text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  -- 通常為單一字母 A-D，但少數題目有爭議/更正/送分（如 'B or D'、'送分'、'A(原為C)'），
  -- 保留原始文字，不強制格式，讓前端自行判斷如何顯示
  answer text not null,
  explanation_text text not null,
  ref text                            -- e.g. 'AI生成'
);

create index if not exists idx_questions_primary_chapter on questions(primary_chapter_id);
create index if not exists idx_questions_topic on questions(topic_id);
create index if not exists idx_questions_exam_group on questions(exam_group_id);

-- 多對多：題目 <-> 章節（來自 xchap:，含 chap: 本身）
create table if not exists question_chapters (
  question_id text not null references questions(id) on delete cascade,
  chapter_id bigint not null references chapters(id) on delete cascade,
  primary key (question_id, chapter_id)
);

create table if not exists question_tags (
  id bigserial primary key,
  question_id text not null references questions(id) on delete cascade,
  tag_type text not null,            -- 'block' | 'dz' | 'other'
  tag_value text not null,
  unique (question_id, tag_type, tag_value)
);

create index if not exists idx_question_tags_value on question_tags(tag_type, tag_value);

-- ========== 比較表 ==========

create table if not exists tables_ (
  id text primary key,               -- table_id，如 'tbl_acid_base_disorders'
  title text not null,
  reason text,
  scope text not null default 'subject', -- 'shared' | 'subject'
  subject_id text references subjects(id),
  headers jsonb not null,
  rows jsonb not null
);

create table if not exists question_tables (
  question_id text not null references questions(id) on delete cascade,
  table_id text not null references tables_(id) on delete cascade,
  primary key (question_id, table_id)
);

-- ========== 圖片 ==========

create table if not exists images (
  id bigserial primary key,
  filename text not null unique,
  question_id text references questions(id),
  option_letter char(1) check (option_letter in ('A','B','C','D')),
  caption text,
  reason text,
  ai_image_prompt text,
  image_type text,
  source_kind text not null default 'ai_generated', -- 'ai_generated' | 'scanned_exam'
  storage_path text                  -- 本機相對路徑；尚未產生檔案的留 null
);

create index if not exists idx_images_question on images(question_id);

-- ========== 知識卡 ==========

create table if not exists knowledge_cards (
  node_id text primary key,          -- '內外-Ch09呼吸系統疾病-胸廓與肋膜病變-肋骨骨折與連枷胸'
  subject_id text not null references subjects(id),
  chapter_id bigint references chapters(id),
  card_title text not null,
  card_subtitle text,
  status text
);

create table if not exists card_bullets (
  id bigserial primary key,
  card_node_id text not null references knowledge_cards(node_id) on delete cascade,
  ordinal int not null,
  bullet_text text not null,
  unique (card_node_id, ordinal)
);

-- ========== 概念節點 ==========

create table if not exists concept_nodes (
  node_id text primary key,
  node_path text not null,
  subject_id text not null references subjects(id),
  chapter_id bigint references chapters(id)
);

create table if not exists concepts (
  node_id text not null references concept_nodes(node_id) on delete cascade,
  concept_id text not null,          -- 'c1', 'c2', ... 僅在 node 內唯一
  concept_text text not null,
  concept_type text,
  occurrence_count int not null default 0,
  priority_score int not null default 0,
  primary key (node_id, concept_id)
);

create table if not exists concept_questions (
  node_id text not null,
  concept_id text not null,
  question_id text not null references questions(id) on delete cascade,
  primary key (node_id, concept_id, question_id),
  foreign key (node_id, concept_id) references concepts(node_id, concept_id) on delete cascade
);

-- ========== 同步紀錄 ==========

create table if not exists sync_runs (
  id bigserial primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  table_counts jsonb,
  note text
);

commit;
