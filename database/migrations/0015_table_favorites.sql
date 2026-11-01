-- Knowledge tables have persistent source IDs; no FK to legacy tables_.
-- Retain removed table IDs so their owners can remove stale favorites.
begin;

create table if not exists user_table_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  table_id text not null check (table_id ~ '^kb-[a-z0-9][a-z0-9-]{0,115}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, table_id)
);
create index if not exists idx_user_table_favorites_user_created
  on user_table_favorites(user_id, created_at desc);
alter table user_table_favorites enable row level security;

drop policy if exists "user can read own table favorites" on user_table_favorites;
create policy "user can read own table favorites" on user_table_favorites
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "user can insert own table favorites" on user_table_favorites;
create policy "user can insert own table favorites" on user_table_favorites
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "user can delete own table favorites" on user_table_favorites;
create policy "user can delete own table favorites" on user_table_favorites
  for delete to authenticated using (auth.uid() = user_id);

revoke all on user_table_favorites from anon;
grant select, insert, delete on user_table_favorites to authenticated;
commit;
