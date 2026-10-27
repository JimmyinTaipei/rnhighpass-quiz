#!/usr/bin/env python3
"""知識庫標點整理：句尾句號、括號全半形、中文旁的 ;,: 轉全形(規則見 docs/wrap-up-plan.md 收尾 A)

用法：
  python3 scripts/normalize-punctuation.py                 # dry-run，印統計與樣本
  python3 scripts/normalize-punctuation.py --samples 50    # 樣本數
  python3 scripts/normalize-punctuation.py --write         # 寫入
  python3 scripts/normalize-punctuation.py --write a.md b.md   # 只處理指定檔
"""
import argparse
import pathlib
import random
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HAN = "㐀-鿿豈-﫿"
CJK = re.compile(f"[{HAN}、，；：「」]")
# 中文旁的半形 ; , : → 全形(左邊是中文、全形收尾符號或中文後的粗體，或右邊是中文)
HALF_PUNCT = {";": "；", ",": "，", ":": "："}
PUNCT_LEFT = re.compile(
    f"(?:(?<=[{HAN}）」』])|(?<=[{HAN}]\\*\\*)|(?<=[{HAN}]\\*))[ \\t]*([;,:])[ \\t]*"
)
PUNCT_RIGHT = re.compile(f"[ \\t]*([;,:])[ \\t]*(?=[{HAN}（「]|\\*\\*?[{HAN}])")
# 畫面會顯示的 frontmatter 字串欄位
FM_KEYS = re.compile(r"^(\s*(?:title|subtitle|summary|aliases)\s*:\s*|\s*-\s+)(.*)$")
FM_LIST_KEYS = ("aliases",)

# 不能動的語法片段
PROTECT = re.compile(
    r"`[^`]*`"                 # 行內程式碼
    r"|\]\([^)\s]*\)"          # 連結網址
    r"|\{[^{}]*\}"             # {#id}、::questions{...}
    r"|https?://[^\s)）]+"     # 裸網址
    r"|\[\[[^\]]*\]\]"         # [[slug#id]]
)
FO, FC, HO, HC = "\x01", "\x02", "\x03", "\x04"  # 已判定的全形／半形括號
PAIR = re.compile(r"[(（]([^()（）]*)[)）]")
# 只在句尾 。 後面出現的收尾符號
TAIL = re.compile(r"。((?:\*\*|\*|」|』|）|\)|\x02|\x04)*)\s*$")


def protect(line):
    saved = []

    def keep(m):
        saved.append(m.group(0))
        return f"\x00{len(saved) - 1}\x00"

    return PROTECT.sub(keep, line), saved


def restore(line, saved):
    return re.sub(r"\x00(\d+)\x00", lambda m: saved[int(m.group(1))], line)


def convert_brackets(s, saved=()):
    """由內往外判斷每一對括號，s 已保護過語法片段；[[slug|中文]] 的顯示文字要算進去"""
    while True:
        m = PAIR.search(s)
        if not m:
            break
        inner = m.group(1)
        shown = re.sub(
            r"\x00(\d+)\x00",
            lambda x: saved[int(x.group(1))] if saved[int(x.group(1))].startswith("[[") else "",
            inner,
        )
        full = bool(CJK.search(shown))
        o, c = (FO, FC) if full else (HO, HC)
        s = s[: m.start()] + o + inner + c + s[m.end():]
    if FO in s:
        # 全形括號旁多的空白：開括號前(行首、列點、表格、引言符號後除外)、開括號後、閉括號前
        s = re.sub(r"(?<=[^\s|>*+\-\x00])[ \t]+" + FO, FO, s)
        s = re.sub(r"(?<=\x00)[ \t]+" + FO, FO, s)
        s = re.sub(FO + r"[ \t]+", FO, s)
        s = re.sub(r"[ \t]+" + FC, FC, s)
        # 閉括號後接中文或全形標點時去空白
        s = re.sub(FC + r"[ \t]+(?=[㐀-鿿，、。；：「])", FC, s)
        # **粗體** 後的空白(上面的 lookbehind 排除了 *)
        s = re.sub(r"(?<=\*\*)[ \t]+" + FO, FO, s)
    return s.replace(FO, "（").replace(FC, "）").replace(HO, "(").replace(HC, ")")


def convert_punct(s):
    full = lambda m: HALF_PUNCT[m.group(1)]
    return PUNCT_RIGHT.sub(full, PUNCT_LEFT.sub(full, s))


def fix_line(line, body=True, punct=True):
    # ::questions{keyword="(a|b)"} 裡是正規表示式，::figure、:::exam 等指令行整行不動
    if body and line.lstrip().startswith("::"):
        return line
    s, saved = protect(line)
    s = convert_brackets(s, saved)
    if punct:
        s = convert_punct(s)
    s = restore(s, saved)
    if body:
        st = s.lstrip()
        if st and not st.startswith(("|", "#", ":::", "::", "<")):
            m = TAIL.search(s)
            if m:
                s = s[: m.start()] + m.group(1)
    return s


def fix_frontmatter_line(line, key):
    # summary: | 的續行
    if key == "summary" and line.startswith((" ", "\t")) and not line.lstrip().startswith("#"):
        return fix_line(line, body=False)
    m = FM_KEYS.match(line)
    if not m:
        return line
    if m.group(1).lstrip().startswith("-") and key not in FM_LIST_KEYS:
        return line
    value = m.group(2)
    # aliases: [a, b] 的逗號、summary: | # 註解都是 YAML 語法，只改括號
    yaml_syntax = value.startswith(("[", "|", ">", "#", "'", '"'))
    return m.group(1) + fix_line(value, body=False, punct=not yaml_syntax)


def process(text):
    lines = text.split("\n")
    out = []
    i = 0
    if lines and lines[0] == "---":
        out.append(lines[0])
        i = 1
        list_key = None
        while i < len(lines) and lines[i] != "---":
            l = lines[i]
            km = re.match(r"^(\w+)\s*:", l)
            if km:
                list_key = km.group(1)
            out.append(fix_frontmatter_line(l, list_key))
            i += 1
        if i < len(lines):
            out.append(lines[i])
            i += 1
    fence = False
    for l in lines[i:]:
        if l.lstrip().startswith("```"):
            fence = not fence
            out.append(l)
            continue
        out.append(l if fence else fix_line(l))
    return "\n".join(out)


def targets(paths):
    if paths:
        return [pathlib.Path(p).resolve() for p in paths]
    return sorted(
        p for p in (ROOT / "content").rglob("*.md") if p.name != "README.md"
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--samples", type=int, default=30)
    ap.add_argument("--seed", type=int, default=1)
    a = ap.parse_args()

    changed_files = 0
    changes = []
    for p in targets(a.files):
        old = p.read_text()
        new = process(old)
        if new == old:
            continue
        changed_files += 1
        for n, (x, y) in enumerate(zip(old.split("\n"), new.split("\n")), 1):
            if x != y:
                changes.append((p.relative_to(ROOT), n, x, y))
        if a.write:
            p.write_text(new)

    print(f"{'已寫入' if a.write else 'dry-run'}：{changed_files} 個檔、{len(changes)} 行有變動")
    if not a.write:
        random.seed(a.seed)
        nested = [c for c in changes if re.search(r"[(（][^()（）]*[(（]", protect(c[2])[0])]
        pick = random.sample(changes, min(a.samples, len(changes)))
        for title, group in (("隨機樣本", pick), ("括號裡有括號(全部)", nested)):
            print(f"\n## {title}({len(group)})")
            for f, n, x, y in group:
                print(f"\n{f}:{n}\n- {x.strip()}\n+ {y.strip()}")


if __name__ == "__main__":
    main()
