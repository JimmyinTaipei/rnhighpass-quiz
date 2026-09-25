-- 站長用的匿名使用統計(/admin/analytics)。
--
-- 為什麼用 security definer function 而不是 view / 放寬 RLS：
--   user_answers 的 RLS 只讓使用者讀自己的列，這個保護不能為了統計而放寬。
--   這些 function 以擁有者權限跨使用者彙總，但：
--     1. 第一行就檢查呼叫者是不是 admin，不是就丟錯
--     2. 只回傳彙總數字；絕不回傳 user_id、email 或任何可識別身分的欄位
--     3. revoke 掉 public / anon 的 execute，只開給 authenticated(再由 1. 把關)
--     4. search_path 固定為 public，避免被同名物件劫持
-- 日期一律以台北時區切日。

begin;

create or replace function assert_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from admins where user_id = auth.uid()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;

-- ===== 全站總覽 =====
create or replace function admin_site_totals()
returns table (
  registered_users int,
  users_with_answers int,
  total_answers int,
  active_users_7d int,
  active_users_30d int,
  answers_7d int
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform assert_admin();
  return query
  select
    (select count(*)::int from auth.users),
    (select count(distinct a.user_id)::int from user_answers a),
    (select count(*)::int from user_answers a),
    (select count(distinct a.user_id)::int from user_answers a where a.answered_at > now() - interval '7 days'),
    (select count(distinct a.user_id)::int from user_answers a where a.answered_at > now() - interval '30 days'),
    (select count(*)::int from user_answers a where a.answered_at > now() - interval '7 days');
end;
$$;

-- ===== 每日使用率 =====
-- new_users = 當天第一次作答的人數(不碰 auth.users 的個資欄位)
create or replace function admin_usage_daily(days int default 30)
returns table (day date, active_users int, answers int, new_users int)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform assert_admin();
  days := least(greatest(days, 1), 365);
  return query
  with d as (
    select generate_series(
      (now() at time zone 'Asia/Taipei')::date - (days - 1),
      (now() at time zone 'Asia/Taipei')::date,
      interval '1 day'
    )::date as day
  ),
  a as (
    select user_id, (answered_at at time zone 'Asia/Taipei')::date as day
    from user_answers
    where answered_at > now() - make_interval(days => days + 1)
  ),
  firsts as (
    select user_id, min((answered_at at time zone 'Asia/Taipei')::date) as day
    from user_answers
    group by user_id
  )
  select
    d.day,
    (select count(distinct a.user_id)::int from a where a.day = d.day),
    (select count(*)::int from a where a.day = d.day),
    (select count(*)::int from firsts f where f.day = d.day)
  from d
  order by d.day;
end;
$$;

-- ===== 內容熱度：各章被做了幾次、幾個人做過 =====
-- 章節走 topics，與 chapter_question_counts(0008)一致
create or replace function admin_content_heat(days int default 30)
returns table (chapter_id bigint, answers int, users int, accuracy int)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform assert_admin();
  return query
  select
    t.chapter_id,
    count(*)::int,
    count(distinct a.user_id)::int,
    round(100.0 * avg(case when a.is_correct then 1 else 0 end))::int
  from user_answers a
  join questions q on q.id = a.question_id
  join topics t on t.id = q.topic_id
  where days is null or a.answered_at > now() - make_interval(days => least(greatest(days, 1), 3650))
  group by t.chapter_id
  order by 2 desc;
end;
$$;

-- ===== 使用者分佈(匿名) =====
-- 每位使用者一列，只有流水號(依第一次作答時間排)，不回傳任何身分資訊。
-- 流水號每次查詢都重新計算，無法拿來對應到真實帳號。
create or replace function admin_user_summary()
returns table (
  user_no int,
  answers int,
  accuracy int,
  active_days int,
  top_subject text,
  first_active date,
  last_active date
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform assert_admin();
  return query
  with per_user as (
    select
      a.user_id,
      count(*)::int as answers,
      round(100.0 * avg(case when a.is_correct then 1 else 0 end))::int as accuracy,
      count(distinct (a.answered_at at time zone 'Asia/Taipei')::date)::int as active_days,
      min(a.answered_at) as first_at,
      max(a.answered_at) as last_at
    from user_answers a
    group by a.user_id
  ),
  subj as (
    select distinct on (a.user_id) a.user_id, s.name as top_subject
    from user_answers a
    join questions q on q.id = a.question_id
    join chapters c on c.id = q.primary_chapter_id
    join subjects s on s.id = c.subject_id
    group by a.user_id, s.name
    order by a.user_id, count(*) desc
  )
  select
    (row_number() over (order by p.first_at))::int,
    p.answers,
    p.accuracy,
    p.active_days,
    sb.top_subject,
    (p.first_at at time zone 'Asia/Taipei')::date,
    (p.last_at at time zone 'Asia/Taipei')::date
  from per_user p
  left join subj sb on sb.user_id = p.user_id
  order by p.answers desc;
end;
$$;

-- ===== 全站錯最多的題目 =====
-- 以「每人最近一次作答」計算，至少 min_users 人作答才列入，避免小樣本誤導。
-- 只給站長看；選項分佈刻意不做。
create or replace function admin_hardest_questions(min_users int default 5, lim int default 30)
returns table (question_id text, users int, wrong_users int, wrong_rate int)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform assert_admin();
  return query
  with latest as (
    select distinct on (a.user_id, a.question_id) a.user_id, a.question_id, a.is_correct
    from user_answers a
    order by a.user_id, a.question_id, a.answered_at desc
  )
  select
    l.question_id,
    count(*)::int,
    count(*) filter (where not l.is_correct)::int,
    round(100.0 * count(*) filter (where not l.is_correct) / count(*))::int
  from latest l
  group by l.question_id
  having count(*) >= greatest(min_users, 1)
  order by 4 desc, 2 desc
  limit least(greatest(lim, 1), 100);
end;
$$;

-- ===== 權限 =====
-- Postgres 預設會把新 function 的 execute 給 public，一定要先收回
revoke all on function assert_admin() from public, anon, authenticated;
revoke all on function admin_site_totals() from public, anon;
revoke all on function admin_usage_daily(int) from public, anon;
revoke all on function admin_content_heat(int) from public, anon;
revoke all on function admin_user_summary() from public, anon;
revoke all on function admin_hardest_questions(int, int) from public, anon;

grant execute on function admin_site_totals() to authenticated;
grant execute on function admin_usage_daily(int) to authenticated;
grant execute on function admin_content_heat(int) to authenticated;
grant execute on function admin_user_summary() to authenticated;
grant execute on function admin_hardest_questions(int, int) to authenticated;

commit;
