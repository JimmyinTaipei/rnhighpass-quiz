-- 收藏題目。和 user_answers 一樣是「只屬於本人」的資料：
-- RLS 只允許讀 / 新增 / 刪除自己的列，前端永遠拿不到別人的收藏。

begin;

create table if not exists user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists idx_user_favorites_user_created
  on user_favorites(user_id, created_at desc);

alter table user_favorites enable row level security;

drop policy if exists "user can read own favorites" on user_favorites;
create policy "user can read own favorites" on user_favorites
  for select using (auth.uid() = user_id);

drop policy if exists "user can insert own favorites" on user_favorites;
create policy "user can insert own favorites" on user_favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "user can delete own favorites" on user_favorites;
create policy "user can delete own favorites" on user_favorites
  for delete using (auth.uid() = user_id);

-- anon 用不到這張表(0003 的 default privileges 會自動給 select，這裡收回)
revoke all on user_favorites from anon;
grant select, insert, delete on user_favorites to authenticated;

commit;
