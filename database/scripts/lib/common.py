import os
from pathlib import Path

SOURCE_ROOT = Path(os.environ.get(
    "SOURCE_ROOT",
    "/Users/jimmy/Downloads/0_護理國考分章",
))

CHAPTERED_BOOKS_DIR = SOURCE_ROOT / "05_chaptered_books"
KNOWLEDGE_CARDS_DIR = SOURCE_ROOT / "08_knowledge_cards"
TABLES_DIR = SOURCE_ROOT / "tables"
IMAGES_DIR = SOURCE_ROOT / "images"

# 題目 ID 中永久嵌入的五碼粗分類 (見「規則整理.txt」)
EXAM_GROUPS = {
    "BM": "基醫",
    "FA": "基護與行政",
    "MS": "內外科",
    "OP": "產兒",
    "PC": "精社",
}


def list_subject_dirs():
    """11 科資料夾，如 '01_生解' -> (id='01_生解', name='生解', order_index=1)."""
    subjects = []
    for d in sorted(CHAPTERED_BOOKS_DIR.iterdir()):
        if not d.is_dir():
            continue
        prefix, _, name = d.name.partition("_")
        subjects.append({
            "id": d.name,
            "name": name,
            "order_index": int(prefix),
            "dir": d,
        })
    return subjects


def subject_short_name(subject_id: str) -> str:
    return subject_id.split("_", 1)[1]
