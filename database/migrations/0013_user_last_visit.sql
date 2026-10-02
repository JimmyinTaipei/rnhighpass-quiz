-- 「繼續閱讀」：每位使用者只記最後開啟的一個知識頁。
-- 不記閱讀進度、不記歷史，所以一個 user 一列，每次開頁 upsert。
-- 只存 slug：標題由網站從知識庫索引取，改標題時不用同步。

begin;

create table if not exists user_last_visit (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slug text not null,
  visited_at timestamptz not null default now()
);

alter table user_last_visit enable row level security;

drop policy if exists "user can read own last visit" on user_last_visit;
create policy "user can read own last visit" on user_last_visit
  for select using (auth.uid() = user_id);

drop policy if exists "user can insert own last visit" on user_last_visit;
create policy "user can insert own last visit" on user_last_visit
  for insert with check (auth.uid() = user_id);

drop policy if exists "user can update own last visit" on user_last_visit;
create policy "user can update own last visit" on user_last_visit
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- anon 用不到這張表(0003 的 default privileges 會自動給 select，這裡收回)
revoke all on user_last_visit from anon;
grant select, insert, update on user_last_visit to authenticated;

commit;
