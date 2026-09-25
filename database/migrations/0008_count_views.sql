-- 章節層級的計數：側邊欄要在每一個閱讀頁列出整科所有 Ch 的題數與筆記數。
--
-- 為什麼要 view：原本 getQuestionCountsByChapter 是「一題抓一列」再用 JS 數，
-- 但 PostgREST 預設一次最多回 1000 列(全庫 8960 題)，所以科目頁的章節題數
-- 在題目多的科目已經會被截斷。理由與做法同 0007 的 exam_papers。
--
-- 刻意沿用「透過 topics 內聯」而非 questions.primary_chapter_id：
-- 閱讀頁與測驗頁都是以 topic_id 取題(見 getQuestionsByTopicIds)，用
-- primary_chapter_id 數出來的數字會跟使用者實際看到的題數不一致。
--
-- security_invoker：view 以查詢者權限執行，沿用 questions / knowledge_cards
-- 的 "public read" RLS，不會因為 view 擁有者是 postgres 而繞過 RLS。

begin;

create or replace view chapter_question_counts
with (security_invoker = true) as
select
  t.chapter_id,
  count(q.id)::int as question_count
from topics t
join questions q on q.topic_id = t.id
group by t.chapter_id;

-- 筆記(knowledge_cards)本身就有 chapter_id，直接數即可。
-- 注意：per-topic 的筆記數無法在這裡算 —— 筆記掛到 topic 是前端用
-- natural_key 路徑字串比對的(src/lib/card-topic-match.ts)，不是 FK。
create or replace view chapter_card_counts
with (security_invoker = true) as
select
  chapter_id,
  count(*)::int as card_count
from knowledge_cards
where chapter_id is not null
group by chapter_id;

grant select on chapter_question_counts to anon, authenticated;
grant select on chapter_card_counts to anon, authenticated;

commit;
