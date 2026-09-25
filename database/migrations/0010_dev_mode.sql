-- dev mode 第二階段：比較表可從網頁編輯 + admin 編輯紀錄。
--
-- 授權模型與 0005 相同，三層缺一不可：
--   1. 應用層：updateTable / updateQuestion action 內部重新驗證 admin
--   2. RLS   ：只有 admins 表裡的人能 update
--   3. GRANT ：只開放內容欄位，結構欄位(id / scope / subject_id)連授權都沒有
-- 專案沒有 service role key，所有寫入都走使用者自己的 session。

begin;

-- ===== 比較表：手動編輯保護旗標(sync_all.py 會跳過這些欄位) =====
alter table tables_ add column if not exists edited_fields text[] not null default '{}';
alter table tables_ add column if not exists edited_at timestamptz;

grant update (title, reason, headers, rows, edited_fields, edited_at)
  on tables_ to authenticated;

drop policy if exists "admin can update tables" on tables_;
create policy "admin can update tables" on tables_
  for update
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ===== admin 編輯紀錄 =====
-- 只能新增與讀取，不能改、不能刪：出錯時可以從 before 還原，
-- 也能追溯是誰在什麼時候改了什麼。
create table if not exists admin_edit_log (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('question', 'table')),
  target_id text not null,
  before jsonb not null,
  after jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_edit_log_target
  on admin_edit_log(target_type, target_id, created_at desc);

alter table admin_edit_log enable row level security;

drop policy if exists "admin can read edit log" on admin_edit_log;
create policy "admin can read edit log" on admin_edit_log
  for select using (exists (select 1 from admins where user_id = auth.uid()));

-- with check 同時限制 user_id 必須是自己，避免冒名寫紀錄
drop policy if exists "admin can insert own edit log" on admin_edit_log;
create policy "admin can insert own edit log" on admin_edit_log
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from admins where user_id = auth.uid())
  );

-- 0003 的 default privileges 會自動給 anon/authenticated select；
-- RLS 已經擋住非 admin，但這張表 anon 完全用不到，收回比較乾淨。
revoke all on admin_edit_log from anon;
grant select, insert on admin_edit_log to authenticated;
grant usage on sequence admin_edit_log_id_seq to authenticated;

-- ===== 比較表 × 章節 的引用次數(Phase 5：比較表依章節分類) =====
-- 章節一律透過 topics 取得，與 0008 的 chapter_question_counts 一致。
create or replace view table_chapter_counts
with (security_invoker = true) as
select
  qt.table_id,
  t.chapter_id,
  count(*)::int as question_count
from question_tables qt
join questions q on q.id = qt.question_id
join topics t on t.id = q.topic_id
group by qt.table_id, t.chapter_id;

grant select on table_chapter_counts to anon, authenticated;

commit;
