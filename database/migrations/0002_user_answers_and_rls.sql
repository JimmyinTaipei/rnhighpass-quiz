-- 使用者作答紀錄 + Row Level Security
-- 內容表格（subjects...concept_questions）對所有人開放讀取（公開題庫，不需要登入就能看筆記/題目）。
-- user_answers 是唯一含使用者資料的表，只有本人能讀寫自己的紀錄。
--
-- 注意：sync_all.py 用的是直連 Postgres（SUPABASE_DB_URL），走的是資料庫層級權限，
-- 不經過 PostgREST，所以完全不受這裡的 RLS policy 影響，可以照常 upsert。

begin;

create table if not exists user_answers (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references questions(id) on delete cascade,
  selected_option text not null,
  is_correct boolean not null,
  quiz_mode text not null default 'practice',
  answered_at timestamptz not null default now()
);

create index if not exists idx_user_answers_user on user_answers(user_id);
create index if not exists idx_user_answers_question on user_answers(question_id);
create index if not exists idx_user_answers_user_question on user_answers(user_id, question_id, answered_at desc);

alter table user_answers enable row level security;

drop policy if exists "user can read own answers" on user_answers;
create policy "user can read own answers" on user_answers
  for select using (auth.uid() = user_id);

drop policy if exists "user can insert own answers" on user_answers;
create policy "user can insert own answers" on user_answers
  for insert with check (auth.uid() = user_id);

drop policy if exists "user can delete own answers" on user_answers;
create policy "user can delete own answers" on user_answers
  for delete using (auth.uid() = user_id);

-- 內容表格：公開唯讀
do $$
declare
  t text;
begin
  foreach t in array array[
    'subjects', 'exam_groups', 'chapters', 'textbook_refs', 'topics',
    'questions', 'question_chapters', 'question_tags', 'tables_',
    'question_tables', 'images', 'knowledge_cards', 'card_bullets',
    'concept_nodes', 'concepts', 'concept_questions'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "public read" on %I;', t);
    execute format('create policy "public read" on %I for select using (true);', t);
  end loop;
end $$;

commit;
