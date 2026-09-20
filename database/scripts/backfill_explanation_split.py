"""一次性腳本：把資料庫裡既有 questions 列的 explanation_text 重新拆解，
補上 key_point / correct_reason / wrong_options_reason / extra_notes。
不需要重跑整個 markdown sync 流程。

用法：
    cd database && .venv/bin/python scripts/backfill_explanation_split.py
"""
import sys

sys.path.insert(0, __file__.rsplit("/scripts/", 1)[0] + "/scripts")

from lib.db import get_connection
from lib.explanation_split import split_explanation


def main():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute('select id, explanation_text from questions')
    rows = cur.fetchall()

    matched = 0
    unmatched = 0
    for qid, explanation_text in rows:
        fields = split_explanation(explanation_text)
        if any(fields.values()):
            matched += 1
        else:
            unmatched += 1
        cur.execute(
            '''update questions
               set key_point = %s, correct_reason = %s,
                   wrong_options_reason = %s, extra_notes = %s
               where id = %s''',
            (fields["key_point"], fields["correct_reason"],
             fields["wrong_options_reason"], fields["extra_notes"], qid),
        )

    conn.commit()
    print(f"共 {len(rows)} 筆；成功拆解至少一段：{matched}；完全沒匹配任何標記：{unmatched}")


if __name__ == "__main__":
    main()
