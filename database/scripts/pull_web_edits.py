"""
網頁上(dev mode)改過的題目與比較表 → 寫回本地來源檔，讓本地檔案維持唯一真實來源。

網頁編輯會把改過的欄位記在 edited_fields(questions、tables_)，sync_all.py 不會用 markdown 蓋掉它們。
這支把那些欄位寫回：
  題目：01_exam_papers 與 02_chaptered 裡同一題的每一份(02 有跨章複本)
        stem → ques:、option_a–d →（A）–（D）、answer → ans:、
        詳解 → sol:(改的是四段拆開的欄位時，照「考點／正解為何對(錯)／其餘選項為何錯(對)／延伸提醒」重組)
  比較表：tables/**/<檔>.json 的 title、reason、headers、rows
寫回後逐題用 sync_all 的解析器重讀一次，確認讀出來跟資料庫一致，才清掉 edited_fields。
寫回的內容記在 多保命護理分章/analysis/題目修正紀錄.md。

用法(在 rnhighpass-quiz/)：
  database/.venv/bin/python database/scripts/pull_web_edits.py          # 預覽：列出有哪些題目、比較表、哪些欄位
  database/.venv/bin/python database/scripts/pull_web_edits.py --write  # 寫回本地並清掉 edited_fields
寫回後在 多保命護理分章 跑 02_sync_01_to_02.py --dry-run 應該沒有差異，再照常 commit 兩邊的 repo。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import CHAPTERED_BOOKS_DIR, EXAM_PAPERS_DIR, SOURCE_ROOT, TABLES_DIR  # noqa: E402
from lib.db import get_connection  # noqa: E402
from lib.parse_chapters import FIELD_PREFIXES, parse_question_block  # noqa: E402

LOG_PATH = SOURCE_ROOT / "analysis" / "題目修正紀錄.md"
SPLIT_FIELDS = ["key_point", "correct_reason", "wrong_options_reason", "extra_notes"]


def sol_from(row: dict, edited: set[str], old_sol: str) -> str | None:
    """新的 sol 文字；詳解沒改時回傳 None"""
    if edited & set(SPLIT_FIELDS):
        # 問「何者錯誤」的題目用「正解為何錯／其餘選項為何對」，沿用原本的措辭
        wrong_style = "正解為何錯：" in old_sol
        parts = [
            ("考點：", row["key_point"]),
            ("正解為何錯：" if wrong_style else "正解為何對：", row["correct_reason"]),
            ("其餘選項為何對：" if wrong_style else "其餘選項為何錯：", row["wrong_options_reason"]),
            ("延伸提醒：", row["extra_notes"]),
        ]
        return "\n".join(f"{m}{v}" for m, v in parts if v)
    if "explanation_text" in edited:
        return row["explanation_text"]
    return None


def field_lines(prefix: str, text: str) -> list[str]:
    """多行欄位：第一行接在前綴後面，之後每行前面一個空白(同題庫寫法)"""
    lines = text.split("\n")
    return [prefix + lines[0]] + [" " + ln.strip() for ln in lines[1:]]


def rewrite_block(block: list[str], row: dict, edited: set[str]) -> list[str]:
    out, i = [], 0
    old = parse_question_block(block)
    new_sol = sol_from(row, edited, old["explanation_text"])
    while i < len(block):
        ln = block[i]
        # 這一欄佔幾行：直到下一個欄位前綴或選項行
        j = i + 1
        while j < len(block) and not any(block[j].startswith(p) for p in FIELD_PREFIXES) and not block[j].startswith("（"):
            j += 1
        if ln.startswith("ques: ") and "stem" in edited:
            # ques 後面的圖片行(![…]、>)要留著
            tail = [x for x in block[i + 1 : j] if x.startswith(("![", ">", "*"))]
            out += field_lines("ques: ", row["stem"]) + tail
        elif ln.startswith("（") and ln[1:2] in "ABCD" and f"option_{ln[1].lower()}" in edited:
            out.append(f"（{ln[1]}）{row[f'option_{ln[1].lower()}']}")
        elif ln.startswith("ans: ") and "answer" in edited:
            out.append(f"ans: {row['answer']}")
        elif ln.startswith("sol: ") and new_sol is not None:
            out += field_lines("sol: ", new_sol)
        else:
            out += block[i:j]
        i = j
    return out


def rewrite_files(rows: dict[str, dict], write: bool) -> tuple[dict[str, int], list[str]]:
    """回傳({題號: 改了幾份}, 驗證失敗)"""
    copies: dict[str, int] = {}
    failures = []
    for path in sorted([*EXAM_PAPERS_DIR.glob("*/*.md"), *CHAPTERED_BOOKS_DIR.glob("*/*.md")]):
        lines = path.read_text(encoding="utf-8").split("\n")
        out, i, changed = [], 0, False
        while i < len(lines):
            if not lines[i].startswith("ID: ") or lines[i][4:].strip() not in rows:
                out.append(lines[i])
                i += 1
                continue
            qid = lines[i][4:].strip()
            j = i + 1
            while j < len(lines) and not lines[j].startswith(("ID: ", "#")):
                j += 1
            # 區塊尾巴的空行不算在區塊內
            k = j
            while k > i + 1 and lines[k - 1].strip() == "":
                k -= 1
            row = rows[qid]
            new_block = rewrite_block(lines[i:k], row, set(row["edited_fields"]))
            check = parse_question_block(new_block)
            if not matches(check, row):
                failures.append(f"{qid}({path.name})：寫回後重讀跟資料庫不一致，沒有寫入")
                new_block = lines[i:k]
            elif new_block != lines[i:k]:
                changed = True
                copies[qid] = copies.get(qid, 0) + 1
            out += new_block + lines[k:j]
            i = j
        if changed and write:
            path.write_text("\n".join(out), encoding="utf-8")
    return copies, failures


def matches(parsed: dict, row: dict) -> bool:
    for f in row["edited_fields"]:
        if f in SPLIT_FIELDS or f == "explanation_text":
            continue  # 詳解用重組後的全文比
        if (parsed.get(f) or "").strip() != (row[f] or "").strip():
            return False
    sol_edited = set(row["edited_fields"]) & {"explanation_text", *SPLIT_FIELDS}
    if sol_edited:
        for f in SPLIT_FIELDS if sol_edited - {"explanation_text"} else ["explanation_text"]:
            if (parsed.get(f) or "").strip() != (row[f] or "").strip():
                return False
    return True


def table_files() -> dict[str, Path]:
    out = {}
    for p in TABLES_DIR.rglob("*.json"):
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue
        if isinstance(data, dict) and data.get("table_id"):
            out[data["table_id"]] = p
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write", action="store_true", help="寫回本地並清掉 edited_fields")
    args = ap.parse_args()

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "select id, stem, option_a, option_b, option_c, option_d, answer, explanation_text, "
        "key_point, correct_reason, wrong_options_reason, extra_notes, edited_fields, edited_at "
        "from questions where coalesce(array_length(edited_fields, 1), 0) > 0 order by id"
    )
    cols = [d[0] for d in cur.description]
    questions = {r[0]: dict(zip(cols, r)) for r in cur.fetchall()}
    cur.execute(
        "select id, title, reason, headers, rows, edited_fields, edited_at "
        "from tables_ where coalesce(array_length(edited_fields, 1), 0) > 0 order by id"
    )
    cols = [d[0] for d in cur.description]
    tables = {r[0]: dict(zip(cols, r)) for r in cur.fetchall()}

    print(f"網頁改過的題目 {len(questions)} 題、比較表 {len(tables)} 張")
    for qid, r in questions.items():
        print(f"  {qid}：{', '.join(r['edited_fields'])}(最後修改 {r['edited_at']:%Y-%m-%d %H:%M})")
    for tid, r in tables.items():
        print(f"  比較表 {tid}：{', '.join(r['edited_fields'])}")
    if not questions and not tables:
        return

    copies, failures = rewrite_files(questions, args.write)
    missing = sorted(set(questions) - set(copies))
    tfiles = table_files()
    for tid, r in tables.items():
        p = tfiles.get(tid)
        if not p:
            failures.append(f"比較表 {tid}：找不到本地 JSON")
            continue
        data = json.loads(p.read_text(encoding="utf-8"))
        for f in r["edited_fields"]:
            data[f] = r[f]
        if args.write:
            p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for qid in missing:
        if qid not in [f.split("(")[0] for f in failures]:
            print(f"  {qid}：本地檔案已經跟資料庫一樣(或找不到這一題)")
    for f in failures:
        print("  ⚠", f)
    print(f"寫回：{len(copies)} 題({sum(copies.values())} 份，含 02 跨章複本)")

    if not args.write:
        print("\n預覽模式，沒有寫入。確認後加 --write")
        return

    done_q = [q for q in questions if q in copies or q in missing]
    done_q = [q for q in done_q if not any(f.startswith(q + "(") for f in failures)]
    done_t = [t for t in tables if t in tfiles]
    cur.execute("update questions set edited_fields = '{}' where id = any(%s)", (done_q,))
    cur.execute("update tables_ set edited_fields = '{}' where id = any(%s)", (done_t,))
    conn.commit()

    LOG_PATH.parent.mkdir(exist_ok=True)
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(f"\n## {stamp} 網頁編輯寫回(pull_web_edits.py)\n\n")
        for q in done_q:
            fh.write(f"- {q}：{', '.join(questions[q]['edited_fields'])}\n")
        for t in done_t:
            fh.write(f"- 比較表 {t}：{', '.join(tables[t]['edited_fields'])}\n")
    print(f"已清掉 {len(done_q)} 題、{len(done_t)} 張表的 edited_fields；紀錄寫在 {LOG_PATH}")


if __name__ == "__main__":
    main()
