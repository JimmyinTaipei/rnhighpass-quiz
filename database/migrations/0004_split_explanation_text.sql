-- explanation_text 目前是把「考點」「正解為何對/錯」「其餘選項為何對/錯」「延伸提醒」
-- 用換行接在同一個欄位裡的純文字。這裡新增結構化欄位,方便之後個別編輯/顯示。
-- explanation_text 保留不刪,作為未能成功拆解時的 fallback。

begin;

alter table questions
  add column key_point text,
  add column correct_reason text,
  add column wrong_options_reason text,
  add column extra_notes text;

commit;
