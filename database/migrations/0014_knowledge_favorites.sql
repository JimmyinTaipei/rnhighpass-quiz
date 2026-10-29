-- 收藏知識頁(整頁或某個段落)。target = "slug" 或 "slug#段落id"。
-- 和 user_favorites 一樣只屬於本人；只存 slug 與段落 id，標題由網站從知識庫索引取。
-- 另外：回報新增「內容有錯」(content)，給知識頁的「建議改進」用。

begin;

create table if not exists user_knowledge_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  target text not null check (char_length(target) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, target)
);

create index if not exists idx_user_knowledge_favorites_user_created
  on user_knowledge_favorites(user_id, created_at desc);

alter table user_knowledge_favorites enable row level security;

drop policy if exists "user can read own knowledge favorites" on user_knowledge_favorites;
create policy "user can read own knowledge favorites" on user_knowledge_favorites
  for select using (auth.uid() = user_id);

drop policy if exists "user can insert own knowledge favorites" on user_knowledge_favorites;
create policy "user can insert own knowledge favorites" on user_knowledge_favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "user can delete own knowledge favorites" on user_knowledge_favorites;
create policy "user can delete own knowledge favorites" on user_knowledge_favorites
  for delete using (auth.uid() = user_id);

revoke all on user_knowledge_favorites from anon;
grant select, insert, delete on user_knowledge_favorites to authenticated;

alter table error_reports drop constraint if exists error_reports_category_check;
alter table error_reports add constraint error_reports_category_check
  check (category in ('question', 'answer', 'explanation', 'content', 'site', 'suggestion'));

commit;
