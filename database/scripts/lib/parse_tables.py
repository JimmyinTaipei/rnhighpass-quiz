import json
from .common import TABLES_DIR


def parse_all_tables():
    """回傳 (tables, question_tables, seen_qt, ref_to_table_id)。
    scope='shared' 給 00_共用/ 底下的表格，其餘依所在資料夾判斷 subject_id。
    ref_to_table_id: 供解析章節 markdown 裡 'table: 07_內外/xxx.json' 欄位用，
    key 為來源 JSON 內建的 '_relative_ref' 欄位（與 markdown table: 欄位值格式一致）。"""
    tables = []
    question_tables = []
    seen_qt = set()
    ref_to_table_id = {}

    for subject_dir in sorted(TABLES_DIR.iterdir()):
        if not subject_dir.is_dir():
            continue
        is_shared = subject_dir.name == "00_共用"

        for f in sorted(subject_dir.glob("*.json")):
            data = json.loads(f.read_text(encoding="utf-8"))
            table_id = data["table_id"]
            if "_relative_ref" in data:
                ref_to_table_id[data["_relative_ref"]] = table_id
            tables.append({
                "id": table_id,
                "title": data.get("title", ""),
                "reason": data.get("reason"),
                "scope": "shared" if is_shared else "subject",
                "subject_id": None if is_shared else subject_dir.name,
                "headers": data.get("headers", []),
                "rows": data.get("rows", []),
            })
            for qid in data.get("apply_to_ids", []):
                key = (qid, table_id)
                if key not in seen_qt:
                    seen_qt.add(key)
                    question_tables.append({"question_id": qid, "table_id": table_id})

    return tables, question_tables, seen_qt, ref_to_table_id
