-- 錯誤回報。取代(並保留作為備援)原本的 Google 表單：
-- 回報會自動帶上題號 / 比較表 / 頁面路徑，站長可以直接在網站裡處理。
--
-- 權限：
--   一般登入者：只能新增、讀取「自己的」回報；不能改、不能刪。
--   admin      ：可以讀全部，並只能更新 status / admin_note / resolved_at。
--   anon       ：完全不能碰(沒有 service key，開放匿名寫入等於任何人都能灌資料)。

begin;

create table if not exists error_reports (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text references questions(id) on delete set null,
  table_id text references tables_(id) on delete set null,
  category text not null check (category in ('question', 'answer', 'explanation', 'site', 'suggestion')),
  message text not null check (char_length(message) between 5 and 2000),
  page_path text check (page_path is null or char_length(page_path) <= 300),
  status text not null default 'new' check (status in ('new', 'resolved', 'wontfix')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 2000),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_error_reports_user on error_reports(user_id, created_at desc);
create index if not exists idx_error_reports_status on error_reports(status, created_at desc);

alter table error_reports enable row level security;

drop policy if exists "user can read own reports" on error_reports;
create policy "user can read own reports" on error_reports
  for select using (auth.uid() = user_id);

-- 新增時 status / admin_note 必須是預設值，避免使用者自己把回報標成已處理
drop policy if exists "user can insert own reports" on error_reports;
create policy "user can insert own reports" on error_reports
  for insert with check (
    auth.uid() = user_id and status = 'new' and admin_note is null and resolved_at is null
  );

drop policy if exists "admin can read all reports" on error_reports;
create policy "admin can read all reports" on error_reports
  for select using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "admin can update reports" on error_reports;
create policy "admin can update reports" on error_reports
  for update
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

revoke all on error_reports from anon;
grant select, insert on error_reports to authenticated;
grant update (status, admin_note, resolved_at) on error_reports to authenticated;
grant usage on sequence error_reports_id_seq to authenticated;

-- ===== 每人每天最多 20 筆，防止灌爆 =====
-- security definer：計數時不受 RLS 影響(雖然使用者本來就讀得到自己的列，
-- 但不要讓限流的正確性依賴 policy 的寫法)。search_path 固定，避免被劫持。
create or replace function enforce_report_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from error_reports
    where user_id = new.user_id and created_at > now() - interval '1 day'
  ) >= 20 then
    raise exception 'report_rate_limited' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function enforce_report_rate_limit() from public;

drop trigger if exists trg_report_rate_limit on error_reports;
create trigger trg_report_rate_limit
  before insert on error_reports
  for each row execute function enforce_report_rate_limit();

commit;
