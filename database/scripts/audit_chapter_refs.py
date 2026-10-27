"""抽查知識頁 frontmatter 的 `chapters:` 對照。

每篇的題目集合用「跟 chapters 無關」的兩個來源(article-questions.json 是從 chapters 推出來的,不能用):
  1. 標籤比對到本頁的題目(ArticleMatcher.tagged;藥物等需要點名的頁還要題目提到名稱)
  2. 頁面 ::questions 實際嵌入的題目(question-map.json)
反查這些題目落在哪個 H2,和 chapters 比對:
  漏掉:這篇的題目集中在某個 H2(命中 ≥ MISS_HITS 題且占該段 ≥ MISS_SHARE),chapters 卻沒寫
  多寫:chapters 寫了某段,但上面兩個來源與 article-questions.json(依 chapters 算的相關題)在該段都 ≤ EXTRA_HITS 題
       (護理、生理頁多半沒有 dz 標籤,只看前兩個來源會誤報)
  沒人對:有題目的 H2 沒有任何文章對到,列出題目最多落在哪幾篇

讀的資料(先跑 pnpm knowledge:build 與 export_knowledge_questions.py):
  src/data/knowledge/index.json、question-map.json、taxonomy.json、chapter-outline.json
  分章題本來源檔

用法(在 rnhighpass-quiz/ 底下):
  database/.venv/bin/python database/scripts/audit_chapter_refs.py              印出摘要
  database/.venv/bin/python database/scripts/audit_chapter_refs.py --md 檔名    另存 Markdown 報告
"""

import argparse
import os
import sys
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(__file__))
from lib.knowledge_match import (  # noqa: E402
    ArticleMatcher,
    QuestionIndex,
    drug_tags_by_group,
    load_json,
)

SEP = " > "
MISS_HITS, MISS_SHARE = 5, 0.3
EXTRA_HITS = 0
SKIP_TITLES = {"綜合題型"}


def h2_of(key):
    parts = key.split(SEP)
    return SEP.join(parts[:2])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--md")
    a = ap.parse_args()

    articles = load_json("index.json")["articles"]
    related = {
        s: {c["key"]: c["count"] for c in v.get("chapters") or []}
        for s, v in load_json("article-questions.json").items()
    }
    index = QuestionIndex()
    drug_tags = drug_tags_by_group()
    embedded = defaultdict(set)
    for slot, v in load_json("question-map.json").items():
        embedded[slot.split("#")[0]].update(v.get("auto") or [])

    def article_qids(slug, art):
        m = ArticleMatcher(art, index, drug_tags)
        qs = {q for q in index.tags if m.tagged(q) and (not m.need_name or m.named(q))}
        return qs | embedded[slug]

    h2_qids = {n["key"]: n["qids"] for n in index.h2_nodes if n["title"] not in SKIP_TITLES}

    covered = set()
    for art in articles.values():
        for k in art.get("chapters") or []:
            covered.add(h2_of(k))

    missing, extra = [], []
    hits_by_h2 = defaultdict(Counter)
    for slug, art in sorted(articles.items()):
        qs = article_qids(slug, art)
        mine = {h2_of(k) for k in art.get("chapters") or []}
        for key, qids in h2_qids.items():
            n = len(qs & qids)
            if n:
                hits_by_h2[key][slug] = n
            if key not in mine and n >= MISS_HITS and n / max(len(qids), 1) >= MISS_SHARE:
                missing.append((slug, key, n, len(qids), key in covered))
        for k in art.get("chapters") or []:
            qids = index.qids_by_key.get(k, set())
            n = max(len(qs & qids), related.get(slug, {}).get(k, 0))
            if n <= EXTRA_HITS:
                extra.append((slug, k, n, len(qids)))

    orphan = []
    for key, qids in h2_qids.items():
        if qids and key not in covered:
            top = hits_by_h2[key].most_common(3)
            orphan.append((key, len(qids), top))

    lines = [f"# chapters 對照抽查({len(articles)} 篇)", ""]
    lines += [f"## 漏掉({len(missing)})", "", "| 文章 | 段落 | 命中／段落題數 | 段落已有別篇對到 |", "|---|---|---|---|"]
    lines += [f"| `{s}` | {k} | {n}/{t} | {'是' if c else '**否**'} |" for s, k, n, t, c in missing]
    lines += ["", f"## 多寫({len(extra)})", "", "| 文章 | 段落 | 命中／段落題數 |", "|---|---|---|"]
    lines += [f"| `{s}` | {k} | {n}/{t} |" for s, k, n, t in extra]
    lines += ["", f"## 沒人對({len(orphan)})", "", "| 段落 | 題數 | 題目最多落在 |", "|---|---|---|"]
    lines += [
        f"| {k} | {t} | {'、'.join(f'`{s}` {n}' for s, n in top) or '—'} |" for k, t, top in orphan
    ]
    text = "\n".join(lines) + "\n"
    if a.md:
        with open(a.md, "w") as f:
            f.write(text)
    print(f"漏掉 {len(missing)}、多寫 {len(extra)}、沒人對 {len(orphan)}")
    if not a.md:
        print(text)


if __name__ == "__main__":
    main()
