#!/usr/bin/env python3
"""知識頁 Batch 審稿(Vertex AI Gemini batch)：準備請求檔、解析回傳

流程：prep 產生 requests/*.jsonl → 使用者在 Google Cloud 提交 batch → 回傳放 responses/ → parse 產生報告
回傳結果只是候選問題，Claude 逐條查證後才改頁面，不直接套用

用法(在 rnhighpass-quiz/)：
  python3 scripts/batch-knowledge-review.py prep                 # 全部 404 篇 → requests/knowledge-review-all.jsonl
  python3 scripts/batch-knowledge-review.py prep --pilot 6       # 先試 6 篇 → requests/knowledge-review-pilot.jsonl
  python3 scripts/batch-knowledge-review.py parse responses/x.jsonl   # → reports/
"""
import argparse
import json
import pathlib
import random
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "knowledge"
WORK = ROOT / "batch" / "knowledge-review"
PROMPT = WORK / "prompt.md"

# 送給模型的 frontmatter 只留有助判斷的欄位
KEEP_FM = ("title", "subtitle", "summary", "updated", "references")

SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "slug": {"type": "STRING"},
        "summary": {"type": "STRING"},
        "issues": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "section": {"type": "STRING"},
                    "quote": {"type": "STRING"},
                    "problem": {"type": "STRING"},
                    "correction": {"type": "STRING"},
                    "source": {"type": "STRING"},
                    "category": {"type": "STRING", "enum": ["事實錯誤", "過時說法", "前後矛盾", "表格錯誤", "計算錯誤", "名詞錯誤"]},
                    "severity": {"type": "STRING", "enum": ["高", "中", "低"]},
                    "confidence": {"type": "STRING", "enum": ["高", "中", "低"]},
                },
                "required": ["section", "quote", "problem", "correction", "category", "severity", "confidence"],
            },
        },
    },
    "required": ["slug", "issues"],
}


def pages():
    return sorted(p for p in CONTENT.rglob("*.md") if p.name != "README.md" and "_templates" not in p.parts)


def page_text(p):
    """去掉送給模型沒用的部分：題目指令、aliases、chapters 等標籤欄位"""
    t = p.read_text(encoding="utf-8")
    fm, body = "", t
    if t.startswith("---\n"):
        end = t.index("\n---", 4)
        fm, body = t[4:end], t[end + 4:]
    keep, cur = [], None
    for line in fm.split("\n"):
        m = re.match(r"^(\w+):", line)
        if m:
            cur = m.group(1)
        if cur in KEEP_FM:
            keep.append(line)
    body = re.sub(r"^::questions\{.*\}\s*$", "", body, flags=re.M)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return "---\n" + "\n".join(keep) + "\n---\n" + body.strip() + "\n"


def request(p, system):
    slug = p.stem
    user = f"slug: {slug}\n分類：{p.parent.name}\n\n{page_text(p)}"
    return {
        "request": {
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "systemInstruction": {"parts": [{"text": system}]},
            "generationConfig": {"responseMimeType": "application/json", "responseSchema": SCHEMA},
        }
    }


def prep(a):
    system = PROMPT.read_text(encoding="utf-8")
    ps = pages()
    if a.pilot:
        random.seed(7)
        ps = random.sample(ps, a.pilot)
    out = WORK / "requests" / f"knowledge-review-{'pilot' if a.pilot else 'all'}.jsonl"
    out.parent.mkdir(parents=True, exist_ok=True)
    chars = 0
    with out.open("w", encoding="utf-8") as f:
        for p in ps:
            r = request(p, system)
            chars += len(r["request"]["contents"][0]["parts"][0]["text"]) + len(system)
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"{len(ps)} 篇 → {out.relative_to(ROOT)}；約 {chars:,} 字(粗估輸入 tokens 同量級)")
    if a.pilot:
        print("試跑篇目：", "、".join(p.stem for p in ps))


def response_json(line):
    """Vertex batch 回傳一行：{"request": ..., "response": {"candidates": [...]}, "status": ...}"""
    d = json.loads(line)
    resp = d.get("response") or {}
    parts = ((resp.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
    req_text = d["request"]["contents"][0]["parts"][0]["text"]
    slug = re.match(r"slug: (\S+)", req_text).group(1)
    if not text:
        return slug, None, d.get("status") or "沒有回傳內容"
    m = re.search(r"\{.*\}", text, re.S)
    try:
        return slug, json.loads(m.group(0) if m else text), None
    except json.JSONDecodeError as e:
        return slug, None, f"JSON 解析失敗：{e}"


def parse(a):
    files = {p.stem: p for p in pages()}
    rows, errors, seen = [], [], set()
    for path in a.files:
        for line in pathlib.Path(path).read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            slug, data, err = response_json(line)
            seen.add(slug)
            if err:
                errors.append((slug, err))
                continue
            page = files[slug].read_text(encoding="utf-8")
            for i in data.get("issues") or []:
                q = i.get("quote", "")
                i["slug"] = slug
                i["quote_found"] = bool(q) and q in page
                rows.append(i)
    missing = sorted(set(files) - seen) if a.expect_all else []
    order = {"高": 0, "中": 1, "低": 2}
    rows.sort(key=lambda r: (order.get(r.get("severity"), 3), order.get(r.get("confidence"), 3), r["slug"]))
    rep = WORK / "reports"
    rep.mkdir(exist_ok=True)
    stem = pathlib.Path(a.files[0]).stem
    (rep / f"{stem}.issues.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows), encoding="utf-8")
    md = [f"# 知識頁審稿結果：{stem}", "", f"{len(seen)} 篇回傳、{len(rows)} 個候選問題、{len(errors)} 篇失敗" + (f"、{len(missing)} 篇缺漏" if missing else ""), ""]
    md += ["> 這是模型的候選問題，Claude 逐條查證後才改頁面；「原文找不到」表示 quote 不是逐字複製，要人工定位", ""]
    md += ["| 嚴重 | 信心 | 頁面 | 段落 | 問題 | 建議 | 依據 | 原文 |", "|---|---|---|---|---|---|---|---|"]
    esc = lambda s: str(s or "").replace("|", "／").replace("\n", " ")
    for r in rows:
        md.append(f"| {r.get('severity')} | {r.get('confidence')} | `{r['slug']}` | {esc(r.get('section'))} | {esc(r.get('problem'))} | {esc(r.get('correction'))} | {esc(r.get('source'))} | {'✓' if r['quote_found'] else '找不到'} |")
    if errors:
        md += ["", "## 失敗", ""] + [f"- `{s}`：{e}" for s, e in errors]
    if missing:
        md += ["", "## 缺漏", ""] + [f"- `{s}`" for s in missing]
    (rep / f"{stem}.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"{len(seen)} 篇、{len(rows)} 個問題、{len(errors)} 篇失敗 → {(rep / (stem + '.md')).relative_to(ROOT)}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("prep")
    p.add_argument("--pilot", type=int, default=0)
    p = sub.add_parser("parse")
    p.add_argument("files", nargs="+")
    p.add_argument("--expect-all", action="store_true", help="檢查 404 篇有沒有缺漏")
    a = ap.parse_args()
    {"prep": prep, "parse": parse}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
