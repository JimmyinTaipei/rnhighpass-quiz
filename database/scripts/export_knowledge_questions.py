"""每篇知識頁的相關考題 → src/data/knowledge/article-questions.json。

範圍是文章 frontmatter `chapters:` 對到的段落；段落裡哪些題跟本頁有關，
規則見 lib/knowledge_match.py 的 ArticleMatcher.related。同一題出現在
好幾個段落只算一次。

輸出(每篇):
  total     相關題數(去重)
  ids       題號，給「練相關題」用
  chapters  每個對照段落的相關題數與段落總題數，順序同 frontmatter

跟 chapter-outline.json 一樣是離線產生、跟著 git 提交。改了 chapters 或
題本之後重跑(先 pnpm knowledge:build，讓 index.json 是最新的):
  database/.venv/bin/python database/scripts/export_knowledge_questions.py
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from lib.knowledge_match import (  # noqa: E402
    DATA,
    ArticleMatcher,
    QuestionIndex,
    drug_tags_by_group,
    load_json,
)

OUT_FILE = os.path.join(DATA, "article-questions.json")


def main():
    articles = load_json("index.json")["articles"]
    index = QuestionIndex()
    drug_tags = drug_tags_by_group()

    out = {}
    for slug, a in sorted(articles.items()):
        keys = a.get("chapters") or []
        if not keys:
            continue
        m = ArticleMatcher(a, index, drug_tags)
        all_ids = set()
        per = []
        for key in keys:
            qids = index.qids_by_key.get(key)
            if qids is None:
                # build-knowledge.mjs 已檢查過；會到這裡代表大綱跟 index.json 不同步
                sys.exit(f"{slug}: 大綱裡找不到 {key},請重跑 export_chapter_outline.py 與 knowledge:build")
            rel = m.related(qids)
            all_ids |= rel
            per.append({"key": key, "count": len(rel), "total": len(qids)})
        out[slug] = {"total": len(all_ids), "ids": sorted(all_ids), "chapters": per}

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")

    totals = sorted((v["total"], k) for k, v in out.items())
    print(f"{len(out)} 篇 → {os.path.relpath(OUT_FILE, os.path.dirname(DATA))}")
    print("最多:", ", ".join(f"{k} {n}" for n, k in totals[-5:][::-1]))
    print("最少:", ", ".join(f"{k} {n}" for n, k in totals[:5]))


if __name__ == "__main__":
    main()
