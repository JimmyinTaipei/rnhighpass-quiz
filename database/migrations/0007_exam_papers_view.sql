-- 線上模擬考的「考卷清單」：一份考卷 = 同一梯次(exam_sitting) + 同一類科(exam_group_id)。
--
-- 為什麼要 view：前端若直接 select exam_sitting 再自己去重，PostgREST 預設一次最多
-- 回 1000 列(全庫 8960 題)，會漏掉部分梯次。這裡在資料庫端 group by，只回幾十列。
--
-- security_invoker：讓 view 以查詢者的權限執行，沿用 questions 的 "public read" RLS，
-- 不會因為 view 擁有者是 postgres 而繞過 RLS。

begin;

create or replace view exam_papers
with (security_invoker = true) as
select
  exam_sitting,
  exam_group_id,
  is_makeup,
  count(*)::int as question_count
from questions
group by exam_sitting, exam_group_id, is_makeup;

grant select on exam_papers to anon, authenticated;

commit;
