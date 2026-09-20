-- 網頁端「dev mode」直接編輯題目所需的權限與保護欄位。
--
-- 背景：目前寫入被三層擋住——
--   1. GRANT：0003 只給 anon/authenticated 的 select
--   2. RLS  ：questions 開了 RLS，但只有 "public read" 這條 for select 的 policy
--   3. 應用層：沒有任何 admin 概念
-- 專案沒有 service role key(.env.local 只有 URL 與 anon key)，所以這裡走
-- Postgres 層授權：即使應用層被繞過，RLS 仍然守得住。

begin;

-- ===== 誰是 admin =====
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- 只能看到自己那一列。不開放列舉所有 admin。
drop policy if exists "admin can read own row" on admins;
create policy "admin can read own row" on admins
  for select using (auth.uid() = user_id);

-- ===== 手動編輯的保護旗標 =====
-- sync_all.py 是從 markdown 全量 upsert，沒有這個旗標的話，網頁上改過的題目
-- 下一次同步就會被來源檔案蓋回去。記錄「哪些欄位被手改過」，讓 sync 跳過它們。
alter table questions add column if not exists edited_fields text[] not null default '{}';
alter table questions add column if not exists edited_at timestamptz;

-- ===== 打開寫入：GRANT 與 RLS 兩層都要 =====
-- 只開這些內容欄位，結構性欄位(primary_chapter_id / topic_id / exam_sitting 等)
-- 仍然只能由 sync 決定，避免從網頁把題目搬到別章造成資料不一致。
grant update (
  stem,
  option_a, option_b, option_c, option_d,
  answer,
  explanation_text,
  key_point, correct_reason, wrong_options_reason, extra_notes,
  edited_fields, edited_at
) on questions to authenticated;

drop policy if exists "admin can update questions" on questions;
create policy "admin can update questions" on questions
  for update
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

commit;

-- 套用後要把自己加進 admins(在 Supabase Dashboard 的 SQL Editor 執行)：
--   insert into admins (user_id, note)
--   select id, 'owner' from auth.users where email = '你的 email'
--   on conflict (user_id) do nothing;
