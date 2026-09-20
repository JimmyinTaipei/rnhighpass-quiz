import re
from .common import CHAPTERED_BOOKS_DIR, list_subject_dirs, subject_short_name
from .explanation_split import split_explanation

ID_PATTERN = re.compile(r'^(\d+-\d+)(_makeup)?_([A-Z]+)_(\d+)$')
CHAPTER_FILENAME_PATTERN = re.compile(r'^(Ch\d+)_(.+)\.md$')
OPTION_PATTERN = re.compile(r'^（([A-D])）(.*)$')

# 開啟新欄位的已知前綴（順序即來源檔案的固定欄位順序）
FIELD_PREFIXES = ["ID: ", "source: ", "chap: ", "xchap: ", "tag: ",
                   "ques: ", "ans: ", "ref: ", "sol: ", "table: "]

# 圖片區塊的標記行，不併入任何欄位內容
IMAGE_LINE_PREFIXES = (">", "![", "*")


def flatten_key(key):
    parts = []
    for item in key:
        if isinstance(item, tuple):
            parts.extend(flatten_key(item))
        else:
            parts.append(item)
    return parts


def natural_key_from(key):
    return ">".join(flatten_key(key))


def parse_question_id(qid: str):
    m = ID_PATTERN.match(qid)
    if not m:
        raise ValueError(f"Unrecognized question ID format: {qid!r}")
    sitting, makeup, group, num = m.groups()
    return {
        "exam_sitting": sitting,
        "is_makeup": makeup is not None,
        "exam_group_id": group,
        "question_no": int(num),
    }


def parse_tags(raw: str):
    """'block:呼吸, dz:呼吸道感染' -> [('block','呼吸'), ('dz','呼吸道感染')].
    Any malformed/no-colon entry falls back to type 'other'."""
    tags = []
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        if ":" in part:
            t, _, v = part.partition(":")
            t = t.strip()
            if t not in ("block", "dz"):
                t = "other"
            tags.append((t, v.strip()))
        else:
            tags.append(("other", part))
    return tags


def _new_field_prefix(line: str):
    for p in FIELD_PREFIXES:
        if line.startswith(p):
            return p
    return None


def parse_question_block(lines: list[str]) -> dict:
    """lines: all raw lines belonging to one question block, starting with 'ID: '."""
    fields: dict[str, list[str]] = {}
    current = None
    for line in lines:
        prefix = _new_field_prefix(line)
        if prefix is not None:
            current = prefix
            fields.setdefault(current, [])
            fields[current].append(line[len(prefix):])
        elif line.startswith(IMAGE_LINE_PREFIXES):
            current = None  # 圖片說明區塊，之後的延續行也不併入欄位
        elif current is not None:
            fields[current].append(line)

    def joined(key, default=""):
        return "\n".join(fields.get(key, [])).strip()

    qid = joined("ID: ")
    id_parts = parse_question_id(qid)

    ques_lines = [l for l in fields.get("ques: ", [])]
    stem_lines = []
    options = {}
    for l in ques_lines:
        m = OPTION_PATTERN.match(l)
        if m:
            options[m.group(1)] = m.group(2).strip()
        else:
            stem_lines.append(l)
    stem = "\n".join(stem_lines).strip()

    xchap_raw = joined("xchap: ")
    xchap = [c.strip() for c in xchap_raw.split(",") if c.strip()] if xchap_raw else []

    chap = joined("chap: ")
    # xchap 依慣例包含 chap 本身；若未包含則補上，確保 question_chapters 完整
    if chap and chap not in xchap:
        xchap = [chap] + xchap

    table_path = joined("table: ") or None
    explanation_text = joined("sol: ")

    return {
        "id": qid,
        "source_text": joined("source: "),
        "chap": chap,
        "xchap": xchap,
        "tags": parse_tags(joined("tag: ")),
        "stem": stem,
        "option_a": options.get("A", ""),
        "option_b": options.get("B", ""),
        "option_c": options.get("C", ""),
        "option_d": options.get("D", ""),
        "answer": joined("ans: "),
        "ref": joined("ref: ") or None,
        "explanation_text": explanation_text,
        **split_explanation(explanation_text),
        "table_path": table_path,
        **id_parts,
    }


def parse_textbook_refs(text: str):
    """解析檔案開頭 '## 課本章節對照' 表格 -> [(textbook_name, chapter_label), ...]."""
    refs = []
    start = text.find("## 課本章節對照")
    h1 = text.find("\n# ")
    if start == -1 or h1 == -1:
        return refs
    block = text[start:h1]
    for line in block.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != 2:
            continue
        name, label = cells
        if name in ("參考書", "---"):
            continue
        if set(name) <= {"-"}:
            continue
        refs.append((name, label))
    return refs


def parse_chapter_file(path, subject_id: str):
    subject_short = subject_short_name(subject_id)
    text = path.read_text(encoding="utf-8")

    m = CHAPTER_FILENAME_PATTERN.match(path.name)
    if not m:
        raise ValueError(f"Unrecognized chapter filename: {path}")
    chapter_no = m.group(1)

    h1_match = re.search(r'^# (.+)$', text, re.M)
    if not h1_match:
        raise ValueError(f"No H1 title found in {path}")
    full_title = h1_match.group(1).strip()
    prefix = f"{subject_short}-{chapter_no}"
    title = full_title[len(prefix):] if full_title.startswith(prefix) else full_title

    textbook_refs = parse_textbook_refs(text)

    chapter_num = int(re.sub(r'\D', '', chapter_no) or 0)
    chapter = {
        "subject_id": subject_id,
        "chapter_no": chapter_no,
        "title": title,
        "full_title": full_title,
        "order_index": chapter_num,
        "textbook_refs": textbook_refs,
    }

    topics = []              # [{key:(lvl2,lvl3-or-None), level, heading_text, is_empty, order_index}]
    topic_index = {}         # key -> index into topics list
    questions = []

    lvl2_key = None
    lvl3_key = None
    order_counter = 0

    def strip_empty_marker(heading_raw):
        is_empty = heading_raw.startswith("[空]")
        heading_text = heading_raw[len("[空]"):].strip() if is_empty else heading_raw
        return heading_text, is_empty

    def register_topic(level, heading_raw, key):
        nonlocal order_counter
        heading_text, is_empty = strip_empty_marker(heading_raw)
        if key not in topic_index:
            order_counter += 1
            topic_index[key] = len(topics)
            topics.append({
                "level": level,
                "heading_text": heading_text,
                "is_empty": is_empty,
                "order_index": order_counter,
                "parent_key": key[0] if level == 3 else None,
                "key": key,
                "natural_key": ">".join(flatten_key(key)),
            })
        return key

    body = text[h1_match.end():]
    lines = body.splitlines()
    block_lines = None

    def flush():
        nonlocal block_lines
        if block_lines:
            q = parse_question_block(block_lines)
            q["topic_key"] = lvl3_key if lvl3_key is not None else lvl2_key
            questions.append(q)
        block_lines = None

    for line in lines:
        if line.startswith("### "):
            flush()
            heading_raw = line[4:].strip()
            heading_clean, _ = strip_empty_marker(heading_raw)
            lvl3_key = register_topic(3, heading_raw, (lvl2_key, heading_clean))
        elif line.startswith("## ") and not line.startswith("## 課本章節對照"):
            flush()
            heading_raw = line[3:].strip()
            heading_clean, _ = strip_empty_marker(heading_raw)
            lvl2_key = register_topic(2, heading_raw, (heading_clean,))
            lvl3_key = None
        elif line.startswith("ID: "):
            flush()
            block_lines = [line]
        elif block_lines is not None:
            block_lines.append(line)
    flush()

    return chapter, topics, questions


def parse_all_chapters():
    """回傳 (chapters, all_topics_by_chapter, all_questions)。"""
    subjects = list_subject_dirs()
    chapters = []
    topics_by_chapter = {}   # (subject_id, chapter_no) -> topics list
    all_questions = []       # each has 'subject_id','chapter_no','topic_key' for later FK resolution

    for subj in subjects:
        for f in sorted(subj["dir"].glob("Ch*.md")):
            chapter, topics, questions = parse_chapter_file(f, subj["id"])
            chapters.append(chapter)
            topics_by_chapter[(subj["id"], chapter["chapter_no"])] = topics
            for q in questions:
                q["_subject_id"] = subj["id"]
                q["_chapter_no"] = chapter["chapter_no"]
            all_questions.extend(questions)

    return subjects, chapters, topics_by_chapter, all_questions
