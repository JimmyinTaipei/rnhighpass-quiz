"""知識庫段落 → 相關考題的對應表。

讀 src/data/knowledge/question-slots.json(由 scripts/build-knowledge.mjs 從
每篇文章的 ::questions{...} 產生),依規則查一次資料庫,把題號寫進
src/data/knowledge/question-map.json。

為什麼不在網頁執行期查:知識頁的考題是「編輯過的清單」,需要人工增刪
(pinned / excluded),而且每次開頁都跑正規表示式比對整個題庫太浪費。

規則:
  tag     題庫 dz 標籤,用 | 分隔表示「任一」
  keyword 比對題幹與選項的正規表示式(Postgres ~*,不分大小寫)
  drug    題庫 drug 標籤(資料庫存為 tag_type='other'),任一符合;
          文章裡寫 group="..." 時,建置腳本已展開成 taxonomy.yml 登記的同義詞
  寫了多種規則時必須全部符合;新到舊排序,取 limit 題(預設 8)。

question-map.json 每個欄位的 pinned(手動加入)與 excluded(手動排除)
重跑時會保留,只有 auto 會被覆寫。

用法(在 rnhighpass-quiz/ 底下):
  database/.venv/bin/python database/scripts/resolve_knowledge_questions.py
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from lib.db import get_connection  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SLOTS_FILE = os.path.join(ROOT, "src", "data", "knowledge", "question-slots.json")
MAP_FILE = os.path.join(ROOT, "src", "data", "knowledge", "question-map.json")
DEFAULT_LIMIT = 8


def resolve(cur, slot: dict) -> list[str]:
    tag = slot.get("tag")
    keyword = slot.get("keyword")
    drug = slot.get("drug")
    if not tag and not keyword and not drug:
        return []

    where = []
    params: list = []
    if tag:
        where.append(
            "exists (select 1 from question_tags t where t.question_id = q.id "
            "and t.tag_type = 'dz' and t.tag_value = any(%s))"
        )
        params.append([t.strip() for t in tag.split("|") if t.strip()])
    if drug:
        where.append(
            "exists (select 1 from question_tags t where t.question_id = q.id "
            "and t.tag_type = 'other' and t.tag_value = any(%s))"
        )
        params.append(drug)
    if keyword:
        where.append(
            "(q.stem || ' ' || q.option_a || ' ' || q.option_b || ' ' || "
            "q.option_c || ' ' || q.option_d) ~* %s"
        )
        params.append(keyword)

    # 送分題沒有標準答案,放在知識頁當練習會讓人困惑
    where.append("q.answer <> '送分'")

    limit = slot.get("limit") or DEFAULT_LIMIT
    sql = (
        "select q.id from questions q where "
        + " and ".join(where)
        + " order by q.exam_sitting desc, q.id desc limit %s"
    )
    cur.execute(sql, [*params, limit])
    return [r[0] for r in cur.fetchall()]


def main():
    with open(SLOTS_FILE, encoding="utf-8") as f:
        slots = json.load(f)
    existing = {}
    if os.path.exists(MAP_FILE):
        with open(MAP_FILE, encoding="utf-8") as f:
            existing = json.load(f)

    conn = get_connection()
    cur = conn.cursor()
    result = {}
    empty = []
    for slot in slots:
        key = slot["qkey"]
        prev = existing.get(key, {})
        auto = resolve(cur, slot)
        entry = {"auto": auto}
        if prev.get("pinned"):
            entry["pinned"] = prev["pinned"]
        if prev.get("excluded"):
            entry["excluded"] = prev["excluded"]
        result[key] = entry
        total = len(set(auto) | set(slot.get("ids") or []) | set(prev.get("pinned") or []))
        if total == 0:
            empty.append(key)
        print(f"{key:48s} {len(auto):3d} 題")
    conn.close()

    dropped = sorted(set(existing) - set(result))
    with open(MAP_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\n寫入 {MAP_FILE}:{len(result)} 個欄位")
    if empty:
        print("⚠ 沒有任何題目的欄位(規則可能太嚴):")
        for k in empty:
            print("   ", k)
    if dropped:
        print("⚠ 以下欄位已不存在於文章中,已移除(若有 pinned/excluded 請確認):")
        for k in dropped:
            print("   ", k)


if __name__ == "__main__":
    main()
