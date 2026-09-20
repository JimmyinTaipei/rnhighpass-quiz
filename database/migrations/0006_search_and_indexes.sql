-- 搜尋索引 + 幾個反向查詢用的索引
--
-- 為什麼是 pg_trgm 而不是全文檢索(tsvector)：
-- Postgres 內建的 to_tsvector 不會切中文詞，對中文題幹幾乎沒有效果。
-- pg_trgm 走 trigram，能真的加速 ILIKE '%關鍵字%'，是 Supabase 上可行的做法。

begin;

create extension if not exists pg_trgm;

-- 搜尋範圍：題幹 + 考點 + 筆記卡標題/條目
create index if not exists idx_questions_stem_trgm
  on questions using gin (stem gin_trgm_ops);
create index if not exists idx_questions_key_point_trgm
  on questions using gin (key_point gin_trgm_ops);
create index if not exists idx_cards_title_trgm
  on knowledge_cards using gin (card_title gin_trgm_ops);
create index if not exists idx_bullets_text_trgm
  on card_bullets using gin (bullet_text gin_trgm_ops);

-- 反向查詢索引。
-- question_tables 的 PK 是 (question_id, table_id)、question_chapters 是
-- (question_id, chapter_id)，所以「某張表有哪些題」「某章有哪些題」這兩個方向
-- 原本都會全表掃描。比較表頁面與跨章節關聯都吃這兩個方向。
create index if not exists idx_question_tables_table
  on question_tables(table_id);
create index if not exists idx_question_chapters_chapter
  on question_chapters(chapter_id);

commit;
