"""分章題本的章節大綱 + 各段題數 → src/data/knowledge/chapter-outline.json。

給 scripts/build-knowledge.mjs 用:知識頁 frontmatter 的 `chapters:` 要對到
章節的 H2(題數多時可到 H3),建置時拿這份大綱檢查寫的路徑存不存在。
建置腳本是離線跑的(Cloudflare 上沒有來源資料夾也連不到資料庫),所以這份
JSON 要跟著 git 提交,來源題本改過再重跑一次即可。

只讀來源檔,不連資料庫。

路徑寫法:「章節全名 > H2」或「章節全名 > H2 > H3」,例如
  藥理-Ch10內分泌與新陳代謝藥物 > 糖尿病用藥

H3 能不能單獨對照,看兩個門檻(下面的 H2_SPLIT / H3_BLOCK):
H2 本身題數 ≥ H2_SPLIT,而且該 H3 題數 ≥ H3_BLOCK,才會標成 block。
2026-09 的分布:H2 中位數 11 題、第 90 百分位 40 題;H3 中位數 5 題、
第 90 百分位 16 題。40/15 大約是「大 H2 裡的熱門 H3」,全站拆出約 130 塊。

題數以題號去重:同一題可能因 xchap 出現在好幾章,但在同一段裡只算一次。

用法(在 rnhighpass-quiz/ 底下):
  database/.venv/bin/python database/scripts/export_chapter_outline.py
"""

import json
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(__file__))
from lib.parse_chapters import parse_all_chapters  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_FILE = os.path.join(ROOT, "src", "data", "knowledge", "chapter-outline.json")

H2_SPLIT = 40
H3_BLOCK = 15
SEP = " > "


def main():
    subjects, chapters, topics_by_chapter, questions = parse_all_chapters()
    subject_name = {s["id"]: s["name"] for s in subjects}

    # (subject_id, chapter_no) -> natural_key -> 題號集合
    ids = defaultdict(lambda: defaultdict(set))
    for q in questions:
        key = q["topic_key"]
        if key is None:
            continue
        bucket = ids[(q["_subject_id"], q["_chapter_no"])]
        if len(key) == 2 and isinstance(key[0], tuple):  # H3:((h2,), h3)
            bucket[f"{key[0][0]}>{key[1]}"].add(q["id"])
            bucket[key[0][0]].add(q["id"])
        else:
            bucket[key[0]].add(q["id"])

    out_chapters = []
    for ch in chapters:
        ck = (ch["subject_id"], ch["chapter_no"])
        bucket = ids[ck]
        h2_list = []
        by_h2 = {}
        for t in topics_by_chapter[ck]:
            if t["level"] == 2:
                node = {
                    "title": t["heading_text"],
                    "count": len(bucket.get(t["natural_key"], ())),
                    "children": [],
                }
                by_h2[t["natural_key"]] = node
                h2_list.append(node)
            else:
                parent = by_h2[t["key"][0][0]]
                parent["children"].append({
                    "title": t["heading_text"],
                    "count": len(bucket.get(t["natural_key"], ())),
                })
        for node in h2_list:
            for child in node["children"]:
                child["block"] = node["count"] >= H2_SPLIT and child["count"] >= H3_BLOCK
        out_chapters.append({
            "fullTitle": ch["full_title"],
            "subjectId": ch["subject_id"],
            "subject": subject_name[ch["subject_id"]],
            "chapterNo": ch["chapter_no"],
            "title": ch["title"],
            "count": len(set().union(*bucket.values())) if bucket else 0,
            "topics": h2_list,
        })

    data = {
        "separator": SEP,
        "thresholds": {"h2Split": H2_SPLIT, "h3Block": H3_BLOCK},
        "chapters": out_chapters,
    }
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")

    blocks = sum(c["block"] for ch in out_chapters for t in ch["topics"] for c in t["children"])
    h2 = sum(len(ch["topics"]) for ch in out_chapters)
    print(f"{len(out_chapters)} 章、{h2} 個 H2、{blocks} 個可獨立的 H3 → {os.path.relpath(OUT_FILE, ROOT)}")


if __name__ == "__main__":
    main()
