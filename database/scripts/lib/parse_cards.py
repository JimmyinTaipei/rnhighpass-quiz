import json
import re
from .common import KNOWLEDGE_CARDS_DIR

CHAPTER_NO_PATTERN = re.compile(r'^(Ch\d+)')


def _chapter_no(chapter_field: str) -> str:
    m = CHAPTER_NO_PATTERN.match(chapter_field)
    if not m:
        raise ValueError(f"Cannot extract chapter_no from {chapter_field!r}")
    return m.group(1)


def parse_all_cards():
    """回傳 (knowledge_cards, card_bullets, concept_nodes, concepts, concept_questions)。
    每筆都帶著 '_subject_id'/'_chapter_no' 供 sync_all.py 解析章節 FK。"""
    knowledge_cards = []
    card_bullets = []
    concept_nodes = []
    concepts = []
    concept_questions = []

    for subject_dir in sorted(KNOWLEDGE_CARDS_DIR.iterdir()):
        if not subject_dir.is_dir():
            continue
        subject_id = subject_dir.name

        for f in sorted(subject_dir.glob("*_cards.json")):
            data = json.loads(f.read_text(encoding="utf-8"))
            chapter_no = _chapter_no(data["chapter"])
            for card in data.get("cards", []):
                knowledge_cards.append({
                    "node_id": card["node_id"],
                    "subject_id": subject_id,
                    "_chapter_no": chapter_no,
                    "card_title": card.get("card_title", ""),
                    "card_subtitle": card.get("card_subtitle"),
                    "status": card.get("status"),
                })
                for i, bullet in enumerate(card.get("bullets", []), start=1):
                    card_bullets.append({
                        "card_node_id": card["node_id"],
                        "ordinal": i,
                        "bullet_text": bullet,
                    })

        for f in sorted(subject_dir.glob("*_concepts.json")):
            data = json.loads(f.read_text(encoding="utf-8"))
            chapter_no = _chapter_no(data["chapter"])
            for node in data.get("nodes", []):
                concept_nodes.append({
                    "node_id": node["node_id"],
                    "node_path": node.get("node_path", ""),
                    "subject_id": subject_id,
                    "_chapter_no": chapter_no,
                })
                for c in node.get("concepts", []):
                    concepts.append({
                        "node_id": node["node_id"],
                        "concept_id": c["concept_id"],
                        "concept_text": c.get("concept_text", ""),
                        "concept_type": c.get("concept_type"),
                        "occurrence_count": c.get("occurrence_count", 0),
                        "priority_score": c.get("priority_score", 0),
                    })
                    for qid in c.get("supporting_q_ids", []):
                        concept_questions.append({
                            "node_id": node["node_id"],
                            "concept_id": c["concept_id"],
                            "question_id": qid,
                        })

    return knowledge_cards, card_bullets, concept_nodes, concepts, concept_questions
