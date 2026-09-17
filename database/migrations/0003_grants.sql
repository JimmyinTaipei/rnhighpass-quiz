-- Supabase 的 PostgREST 是用 anon / authenticated 角色連線,RLS policy 只決定
-- "哪些列可見",角色本身還是需要基本的資料表 GRANT 才能執行任何 SELECT/INSERT。
-- 因為這個專案的表是直接用 postgres 連線建立(繞過 Supabase dashboard 的預設流程),
-- 沒有自動套用預設 grant,所以要手動補上。

begin;

grant usage on schema public to anon, authenticated;

grant select on all tables in schema public to anon, authenticated;
grant select on all sequences in schema public to anon, authenticated;

-- user_answers 只開放給已登入的 authenticated 角色寫入/刪除自己的紀錄
-- (RLS policy 已限制只能動自己的 user_id;這裡只是補上角色本身的基本權限)
grant insert, delete on user_answers to authenticated;
grant usage on sequence user_answers_id_seq to authenticated;

-- 之後新建的表也自動套用同樣的預設權限,不用每次都手動 grant
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant select on sequences to anon, authenticated;

commit;
