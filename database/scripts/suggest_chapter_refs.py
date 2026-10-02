"""替知識頁建議 frontmatter 的 `chapters:`(對到分章題本的 H2 / 可獨立的 H3)。

依據是題目本身的標籤,而不是比對標題文字:某個 H2 底下的題目有多少帶著
這篇文章的 dz 標籤(疾病等)或所屬群組的 drug 標籤(藥物頁),命中比例高的
段落就是這篇文章「在考試裡出現的位置」。另外段落標題直接寫到文章名稱或別名
時也算一條線索。

讀的資料:
  src/data/knowledge/index.json、taxonomy.json(先跑 pnpm knowledge:build)
  src/data/knowledge/chapter-outline.json 的門檻
  分章題本來源檔(題目標籤)

用法(在 rnhighpass-quiz/ 底下):
  database/.venv/bin/python database/scripts/suggest_chapter_refs.py            只列出建議
  database/.venv/bin/python database/scripts/suggest_chapter_refs.py --write    寫進還沒有 chapters 的文章
  加 --slug <slug> 只看一篇

寫入只會補「還沒有 chapters 欄位」的文章,已經寫過(含人工修改過)的不會被覆寫。
自動結果是起點,寫入後請抽查;建置時 build-knowledge.mjs 仍會檢查每一條。
"""

import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from lib.knowledge_match import (  # noqa: E402
    ArticleMatcher,
    QuestionIndex,
    drug_tags_by_group,
    load_json,
)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONTENT = os.path.join(ROOT, "content", "knowledge")

# 選段落的條件:命中 ≥ MIN_HITS 題,且占該段題數 ≥ MIN_SHARE;
# 或命中很多(≥ MANY_HITS)時放寬到 ≥ MANY_SHARE(大段落裡的一個重要主題)。
MIN_HITS, MIN_SHARE = 3, 0.3
MANY_HITS, MANY_SHARE = 10, 0.15
# 檢驗頁、生理頁借用疾病的 dz 標籤,會把整個疾病的段落都拉進來,所以只收命中比例高的
STRICT_CATEGORIES, STRICT_SHARE = {"lab", "physiology"}, 0.5
# 可獨立的 H3 命中比例到這裡,就改對到 H3 而不是整個 H2
H3_SHARE = 0.5
# 各章末尾的混合題集合,不是一個主題,不對照
SKIP_TITLES = {"綜合題型"}


def suggest(a, index, drug_tags):
    m = ArticleMatcher(a, index, drug_tags)
    # 藥物頁在這裡只用名稱當「段落裡至少一題提到」的門檻,命中數仍以標籤計;
    # 病原體頁的標籤是疾病,本來就用標籤判斷段落(名稱只用在算相關題數)
    need_name = m.need_name and a["category"] == "drug" and bool(m.drug)

    def hits(qids):
        return sum(1 for qid in qids if m.tagged(qid))

    def named(qids):
        return any(m.tagged(qid) and m.named(qid) for qid in qids)

    def title_match(title):
        t = title.lower()
        return any(n in t for n in m.title_names)

    strict = a["category"] in STRICT_CATEGORIES

    def qualifies(h, total):
        if total == 0 or h == 0:
            return False
        share = h / total
        if strict:
            return h >= MIN_HITS and share >= STRICT_SHARE
        return (h >= MIN_HITS and share >= MIN_SHARE) or (h >= MANY_HITS and share >= MANY_SHARE)

    picks = []
    for node in index.h2_nodes:
        if node["title"] in SKIP_TITLES:
            continue
        total = len(node["qids"])
        h = hits(node["qids"])
        blocks = [
            (c, hits(c["qids"]))
            for c in node["children"]
            if c["block"] and c["qids"]
        ]
        strong_blocks = [
            (c, ch)
            for c, ch in blocks
            if ch >= MIN_HITS
            and ch / len(c["qids"]) >= H3_SHARE
            and (not need_name or named(c["qids"]))
        ]
        h2_ok = (qualifies(h, total) and (not need_name or named(node["qids"]))) or (
            total > 0 and title_match(node["title"])
        )
        if strong_blocks and (not h2_ok or h / max(total, 1) < H3_SHARE):
            # 命中集中在可獨立的 H3:對到 H3 比對到整個大 H2 精準
            for c, ch in strong_blocks:
                picks.append((c["key"], ch, len(c["qids"])))
        elif h2_ok:
            picks.append((node["key"], h, total))
    return picks


def insert_chapters(path, keys):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    end = text.index("\n---", 3)
    fm = text[:end]
    if re.search(r"^chapters:", fm, re.M):
        return False
    block = "chapters:\n" + "".join(f"  - {k}\n" for k in keys)
    # 放在分類欄位(group / alsoIn / system)之後,跟分類擺在一起
    for field in ("group", "alsoIn", "system"):
        m = re.search(rf"^{field}:.*\n", fm, re.M)
        if m:
            fm = fm[: m.end()] + block + fm[m.end():]
            break
    else:
        fm = fm + "\n" + block.rstrip("\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write(fm + text[end:])
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--slug")
    args = ap.parse_args()

    articles = load_json("index.json")["articles"]
    drug_tags = drug_tags_by_group()
    index = QuestionIndex()

    written = empty = 0
    for slug, a in sorted(articles.items()):
        if args.slug and slug != args.slug:
            continue
        picks = suggest(a, index, drug_tags)
        has = bool(a.get("chapters"))
        mark = "(已有 chapters,略過)" if has else ""
        print(f"\n{slug}  {a['title']}  {mark}")
        if not picks:
            empty += 1
            print("  (沒有建議:標籤比對不到,需要人工對照)")
        for key, h, total in picks:
            print(f"  - {key}   命中 {h}/{total}")
        if args.write and picks and not has:
            path = os.path.join(CONTENT, a["category"], f"{slug}.md")
            if insert_chapters(path, [k for k, _, _ in picks]):
                written += 1

    print(f"\n沒有建議:{empty} 篇")
    if args.write:
        print(f"已寫入:{written} 篇。請執行 pnpm knowledge:build 檢查。")


if __name__ == "__main__":
    main()
