#!/usr/bin/env python3
"""1a 來源掃描：content/knowledge/ 與 UpToDate 匯出檔比對。

檢查：
1. 內文出現西里爾、亞美尼亞文字，或與拉丁字母混用的希臘大寫字母
   (UpToDate 匯出檔用形似字元做防複製記號，貼進頁面就會帶進來)
2. 與 UpToDate 匯出檔共有的英文連續詞串(預設 6 個字以上)
3. 引用 UpToDate 的次數與篇名是否對得到匯出檔

用法：python3 scripts/source-scan.py [--n 6] [--out docs/uptodate-scan.md]
"""
import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT_DIRS = ["精神科相關", "癌症相關", "感染相關", "免疫相關"]
EXPORT_BASE = ROOT.parent / "相關資源"
CONTENT = ROOT / "content" / "knowledge"

# 形似字元 → 拉丁字母
CONFUSABLE = {
    "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
    "і": "i", "ѕ": "s", "ј": "j", "ԁ": "d", "һ": "h", "ӏ": "l",
    "А": "A", "В": "B", "Е": "E", "К": "K", "М": "M", "Н": "H", "О": "O",
    "Р": "P", "С": "C", "Т": "T", "Х": "X", "І": "I", "Ѕ": "S", "Ј": "J",
    "Α": "A", "Β": "B", "Ε": "E", "Η": "H", "Ι": "I", "Κ": "K", "Μ": "M",
    "Ν": "N", "Ο": "O", "Ρ": "P", "Τ": "T", "Χ": "X", "Ζ": "Z", "Υ": "Y",
    "ο": "o", "ν": "v", "κ": "k", "ϲ": "c", "ρ": "p", "τ": "t", "υ": "u",
    "ս": "u", "ո": "n", "Լ": "L", "օ": "o", "ց": "g", "ԛ": "q", "ɡ": "g",
}
CYR_ARM = re.compile(r"[Ѐ-ӿ԰-֏]")
GREEK_CAP = re.compile(r"[ΑΒΕΗΙΚΜΝΟΡΤΧΖΥ]")
NUMN = 5
WORD = re.compile(r"[A-Za-zͰ-ϿЀ-ӿ԰-֏']+")


def norm_token(tok: str) -> str:
    if any("a" <= c.lower() <= "z" for c in tok) or all(c in CONFUSABLE for c in tok):
        tok = "".join(CONFUSABLE.get(c, c) for c in tok)
    return tok.lower().strip("'")


def segments(text: str):
    """回傳英文詞的連續片段；遇到非英文(中文、數字、標點)就斷開。"""
    seg = []
    pos = 0
    for m in WORD.finditer(text):
        gap = text[pos:m.start()]
        # 只允許空白、連字號、逗號、句號、括號之類的英文標點，其餘斷開
        if seg and re.search(r"[^\sA-Za-z0-9,.;:()\-–—/'\"]", gap):
            yield seg
            seg = []
        t = norm_token(m.group())
        if t:
            seg.append(t)
        pos = m.end()
    if seg:
        yield seg


def shingles(text: str, n: int):
    for seg in segments(text):
        for i in range(len(seg) - n + 1):
            yield tuple(seg[i:i + n])


NUM = re.compile(r"\d+(?:[.,]\d+)?(?:\s?[–\-~]\s?\d+(?:[.,]\d+)?)?\s?(?:%|mg|mcg|μg|µg|g|mL|ml|kg|mmHg|mEq|IU|U|days?|weeks?|months?|years?|天|週|個月|年|歲|小時|分鐘|hours?|h|min)?")


def numeric_seq(text: str):
    toks = []
    for m in NUM.finditer(text):
        t = re.sub(r"[\s,]", "", m.group()).lower().replace("–", "-").replace("~", "-")
        digits = re.sub(r"\D", "", t)
        # 只留比較有辨識度的數字：含單位、範圍或 2 位數以上
        if len(digits) >= 2 or re.search(r"[%a-z\-]", t):
            toks.append(t)
    return toks


def strip_frontmatter(s: str):
    if s.startswith("---"):
        end = s.find("\n---", 3)
        if end != -1:
            return s[3:end], s[end + 4:]
    return "", s


def clean_md(body: str) -> str:
    # 引用文字(篇名)本來就會與匯出檔相同，不算重疊
    body = re.sub(r"\(來源[：:][^()]*(?:\([^()]*\)[^()]*)*\)", " ", body)
    body = re.sub(r"\[[^\]]*\]\(https?://[^)]*\)", " ", body)
    body = re.sub(r"\]\([^)]*\)", "]", body)  # 連結網址
    body = re.sub(r"https?://\S+", " ", body)
    body = re.sub(r"[*_`>#|]", " ", body)
    return body


def load_exports(n: int):
    index = defaultdict(set)  # shingle → {檔名}
    numidx = defaultdict(set)  # 數字序列 → {檔名}
    files = []
    for d in EXPORT_DIRS:
        for p in sorted((EXPORT_BASE / d).glob("*")):
            if p.suffix.lower() != ".md":
                continue
            text = p.read_text(encoding="utf-8", errors="ignore")
            if "UpToDate" not in text[:1500]:
                continue
            files.append(p)
            for sh in shingles(text, n):
                index[sh].add(f"{d}/{p.stem}")
            nums = numeric_seq(text)
            for i in range(len(nums) - NUMN + 1):
                numidx[tuple(nums[i:i + NUMN])].add(f"{d}/{p.stem}")
    return index, numidx, files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=6)
    ap.add_argument("--out", default=str(ROOT / "docs" / "uptodate-scan.md"))
    args = ap.parse_args()

    index, numidx, export_files = load_exports(args.n)
    print(f"匯出檔 {len(export_files)} 篇，{len(index)} 個 {args.n}-gram", file=sys.stderr)
    if not export_files:
        print("⚠️ 找不到 UpToDate 匯出檔(相關資源/ 不在這台機器上，例如雲端 session)：只會檢查形似字元，英文與數字比對不會有結果。請在有匯出檔的本機再跑一次。", file=sys.stderr)

    rows = []
    for p in sorted(CONTENT.rglob("*.md")):
        if "_templates" in p.parts or p.name == "README.md":
            continue
        raw = p.read_text(encoding="utf-8")
        fm, body = strip_frontmatter(raw)
        rel = str(p.relative_to(CONTENT))

        cites = len(re.findall(r"uptodate", raw, re.I))
        homoglyph = []
        for m in WORD.finditer(body):
            w = m.group()
            if CYR_ARM.search(w) or (GREEK_CAP.search(w) and re.search(r"[A-Za-z]", w)):
                homoglyph.append(w)

        text = clean_md(body)
        hits = defaultdict(int)
        sample = {}
        total = 0
        for seg in segments(text):
            run_from = None
            for i in range(len(seg) - args.n + 1):
                sh = tuple(seg[i:i + args.n])
                srcs = index.get(sh)
                if srcs:
                    total += 1
                    for s in srcs:
                        hits[s] += 1
                        sample.setdefault(s, " ".join(seg[i:i + args.n]))
        top = sorted(hits.items(), key=lambda kv: -kv[1])[:3]
        nums = numeric_seq(text)
        nhits = defaultdict(int)
        for i in range(len(nums) - NUMN + 1):
            for s_ in numidx.get(tuple(nums[i:i + NUMN]), ()):
                nhits[s_] += 1
        ntop = sorted(nhits.items(), key=lambda kv: -kv[1])[:2]
        rows.append((rel, cites, len(homoglyph), total, top, sample, homoglyph[:3], sum(nhits.values()), ntop))

    # 判斷
    def verdict(r):
        rel, cites, hg, total, top, _, _, nn, _ = r
        if hg:
            return "⚠️ 疑似貼上"
        if total >= 6:
            return "⚠️ 逐字重疊"
        if nn >= 3:
            return "數字序列重疊"
        if total >= 1 or nn >= 1:
            return "檢視"
        return "無重疊"

    order = {"⚠️ 疑似貼上": 0, "⚠️ 逐字重疊": 1, "數字序列重疊": 2, "檢視": 3, "無重疊": 4}
    rows.sort(key=lambda r: (order[verdict(r)], -(r[3] + r[7]), r[0]))

    out = ["# 來源掃描報告(1a)", "",
           f"> 由 `scripts/source-scan.py` 產生。{len(rows)} 篇頁面對 {len(export_files)} 篇 UpToDate 匯出檔，英文 {args.n} 字連續詞串比對。" + ("" if export_files else "**本次沒有匯出檔可比對，只檢查了形似字元。**"),
           "> 「疑似貼上」＝內文含形似字元(UpToDate 匯出檔的防複製記號)；「逐字重疊」＝共有 6 串以上；「數字序列重疊」＝連續 5 個有辨識度的數字(含單位)與匯出檔順序相同，可能是照原文順序整理，需人工比對；「檢視」＝零星重疊，多半是專有名詞或藥名。",
           "> **限制**：①中文翻譯式的近似照抄抓不到(只能抓英文詞串與數字序列)，要人工抽查；②國考書 PDF 是掃描圖檔、沒有文字層，無法比對(需要 OCR)；③圖片與表格的重製要人工看。", "",
           "| 結果 | 頁面 | 引用行數 | 形似字元 | 英文重疊 | 數字序列重疊 | 最相近的匯出檔 | 例 |",
           "|---|---|---:|---:|---:|---:|---|---|"]
    for r in rows:
        rel, cites, hg, total, top, sample, hgs, nn, ntop = r
        v = verdict(r)
        src = "；".join(f"{s}({c})" for s, c in (top or ntop)) or "—"
        ex = ""
        if top:
            ex = sample[top[0][0]].replace("|", "/")
        elif hgs:
            ex = "、".join(hgs)
        out.append(f"| {v} | {rel} | {cites} | {hg} | {total} | {nn} | {src} | {ex} |")
    Path(args.out).write_text("\n".join(out) + "\n", encoding="utf-8")

    cnt = defaultdict(int)
    for r in rows:
        cnt[verdict(r)] += 1
    print(dict(cnt), file=sys.stderr)


if __name__ == "__main__":
    main()
