"""
全量重建 + upsert 同步腳本。

從 多保命護理分章 讀取所有來源檔案，用穩定 ID（題目 ID、table_id、node_id 等）
對 Supabase Postgres 做 ON CONFLICT DO UPDATE，可安全重複執行。

用法：
    cd database && .venv/bin/python scripts/sync_all.py
"""
import sys
from collections import defaultdict
from datetime import datetime, timezone

import psycopg2.extras

sys.path.insert(0, __file__.rsplit("/scripts/", 1)[0] + "/scripts")

from lib.common import EXAM_GROUPS, list_subject_dirs
from lib.db import get_connection, upsert
from lib.parse_cards import parse_all_cards
from lib.parse_chapters import natural_key_from, parse_all_chapters
from lib.parse_images import parse_all_images
from lib.parse_tables import parse_all_tables


def main():
    counts = {}
    conn = get_connection()
    cur = conn.cursor()

    print("解析來源檔案...")
    subjects = list_subject_dirs()
    _subjects2, chapters, topics_by_chapter, questions = parse_all_chapters()
    cards, bullets, concept_nodes, concepts, concept_questions = parse_all_cards()
    tables, question_tables_from_apply, seen_qt, ref_to_table_id = parse_all_tables()
    images = parse_all_images()

    try:
        # ---------- subjects / exam_groups ----------
        counts["subjects"] = upsert(
            cur, "subjects",
            [{"id": s["id"], "name": s["name"], "order_index": s["order_index"]} for s in subjects],
            conflict_cols=["id"],
        )
        counts["exam_groups"] = upsert(
            cur, "exam_groups",
            [{"id": k, "name": v} for k, v in EXAM_GROUPS.items()],
            conflict_cols=["id"],
        )

        # ---------- chapters ----------
        counts["chapters"] = upsert(
            cur, "chapters",
            [{
                "subject_id": c["subject_id"],
                "chapter_no": c["chapter_no"],
                "title": c["title"],
                "full_title": c["full_title"],
                "order_index": c["order_index"],
            } for c in chapters],
            conflict_cols=["subject_id", "chapter_no"],
        )

        cur.execute("select id, subject_id, chapter_no, full_title from chapters")
        chapter_pk_by_subj_no = {}
        chapter_pk_by_full_title = {}
        chapter_key_to_full_title = {}
        for pk, subject_id, chapter_no, full_title in cur.fetchall():
            chapter_pk_by_subj_no[(subject_id, chapter_no)] = pk
            chapter_pk_by_full_title[full_title] = pk
            chapter_key_to_full_title[(subject_id, chapter_no)] = full_title

        # ---------- textbook_refs ----------
        textbook_ref_rows = []
        for c in chapters:
            chapter_id = chapter_pk_by_subj_no[(c["subject_id"], c["chapter_no"])]
            for name, label in c["textbook_refs"]:
                textbook_ref_rows.append({
                    "chapter_id": chapter_id,
                    "textbook_name": name,
                    "textbook_chapter_label": label,
                })
        counts["textbook_refs"] = upsert(
            cur, "textbook_refs", textbook_ref_rows,
            conflict_cols=["chapter_id", "textbook_name"],
        )

        # ---------- topics (level 2 then level 3, for self-referencing FK) ----------
        lvl2_rows = []
        lvl3_source = []  # (chapter_key, topic_dict)
        for chapter_key, topics in topics_by_chapter.items():
            chapter_id = chapter_pk_by_subj_no[chapter_key]
            for t in topics:
                if t["level"] == 2:
                    lvl2_rows.append({
                        "chapter_id": chapter_id,
                        "parent_topic_id": None,
                        "level": 2,
                        "heading_text": t["heading_text"],
                        "is_empty": t["is_empty"],
                        "order_index": t["order_index"],
                        "natural_key": t["natural_key"],
                    })
                else:
                    lvl3_source.append((chapter_key, t))

        topic_count = upsert(
            cur, "topics", lvl2_rows,
            conflict_cols=["chapter_id", "natural_key"],
        )

        cur.execute("select id, chapter_id, natural_key from topics")
        topic_pk = {(chapter_id, natural_key): pk for pk, chapter_id, natural_key in cur.fetchall()}

        lvl3_rows = []
        for chapter_key, t in lvl3_source:
            chapter_id = chapter_pk_by_subj_no[chapter_key]
            parent_natural_key = natural_key_from(t["parent_key"])
            parent_id = topic_pk.get((chapter_id, parent_natural_key))
            lvl3_rows.append({
                "chapter_id": chapter_id,
                "parent_topic_id": parent_id,
                "level": 3,
                "heading_text": t["heading_text"],
                "is_empty": t["is_empty"],
                "order_index": t["order_index"],
                "natural_key": t["natural_key"],
            })
        topic_count += upsert(
            cur, "topics", lvl3_rows,
            conflict_cols=["chapter_id", "natural_key"],
        )
        counts["topics"] = topic_count

        cur.execute("select id, chapter_id, natural_key from topics")
        topic_pk = {(chapter_id, natural_key): pk for pk, chapter_id, natural_key in cur.fetchall()}

        # ---------- questions: pick canonical occurrence per question id ----------
        occurrences_by_id = defaultdict(list)
        for q in questions:
            occurrences_by_id[q["id"]].append(q)

        canonical = {}
        for qid, occs in occurrences_by_id.items():
            home = None
            for occ in occs:
                full_title = chapter_key_to_full_title.get((occ["_subject_id"], occ["_chapter_no"]))
                if full_title == occ["chap"]:
                    home = occ
                    break
            canonical[qid] = home or occs[0]

        known_question_ids = set(canonical.keys())

        question_rows = []
        for qid, occ in canonical.items():
            chapter_id = chapter_pk_by_subj_no.get((occ["_subject_id"], occ["_chapter_no"]))
            topic_id = None
            if occ.get("topic_key") is not None and chapter_id is not None:
                topic_id = topic_pk.get((chapter_id, natural_key_from(occ["topic_key"])))
            question_rows.append({
                "id": qid,
                "source_text": occ["source_text"],
                "exam_sitting": occ["exam_sitting"],
                "is_makeup": occ["is_makeup"],
                "exam_group_id": occ["exam_group_id"],
                "question_no": occ["question_no"],
                "primary_chapter_id": chapter_id,
                "topic_id": topic_id,
                "stem": occ["stem"],
                "option_a": occ["option_a"],
                "option_b": occ["option_b"],
                "option_c": occ["option_c"],
                "option_d": occ["option_d"],
                "answer": occ["answer"],
                "explanation_text": occ["explanation_text"],
                "key_point": occ["key_point"],
                "correct_reason": occ["correct_reason"],
                "wrong_options_reason": occ["wrong_options_reason"],
                "extra_notes": occ["extra_notes"],
                "ref": occ["ref"],
            })
        # 網頁 dev mode 改過的欄位不要被 markdown 蓋回去。
        # questions.edited_fields 記錄了哪些欄位被手動編輯過(見 migration 0005)，
        # db.upsert 會針對這些欄位改用 CASE WHEN 保留資料庫現值。
        # 沒被標記的欄位、以及不在這份清單裡的結構性欄位(exam_sitting、
        # primary_chapter_id、topic_id 等)，一律照舊以來源檔案為準。
        counts["questions"] = upsert(
            cur, "questions", question_rows, conflict_cols=["id"],
            protect_columns=(
                "stem",
                "option_a", "option_b", "option_c", "option_d",
                "answer",
                "explanation_text",
                "key_point", "correct_reason", "wrong_options_reason", "extra_notes",
            ),
        )

        # ---------- question_chapters / question_tags / question_tables (from table:) ----------
        qc_pairs = set()
        qt_rows_seen = set()
        question_tag_rows = []
        question_table_rows = [
            r for r in question_tables_from_apply if r["question_id"] in known_question_ids
        ]  # 已由 parse_tables 依 (question_id, table_id) 去重；濾除找不到對應題目的孤兒列
        skipped_qtable = len(question_tables_from_apply) - len(question_table_rows)
        if skipped_qtable:
            print(f"警告：{skipped_qtable} 筆表格 apply_to_ids 的 question_id 在題庫中找不到，已略過")

        for qid, occs in occurrences_by_id.items():
            all_chap_names = set()
            all_tags = set()
            table_refs = set()
            for occ in occs:
                for name in occ["xchap"]:
                    all_chap_names.add(name)
                for t in occ["tags"]:
                    all_tags.add(t)
                if occ["table_path"]:
                    table_refs.add(occ["table_path"])

            for name in all_chap_names:
                chapter_id = chapter_pk_by_full_title.get(name)
                if chapter_id is not None:
                    qc_pairs.add((qid, chapter_id))

            for tag_type, tag_value in all_tags:
                question_tag_rows.append({
                    "question_id": qid, "tag_type": tag_type, "tag_value": tag_value,
                })

            for ref in table_refs:
                table_id = ref_to_table_id.get(ref)
                if table_id and (qid, table_id) not in seen_qt:
                    seen_qt.add((qid, table_id))
                    question_table_rows.append({"question_id": qid, "table_id": table_id})

        counts["question_chapters"] = upsert(
            cur, "question_chapters",
            [{"question_id": qid, "chapter_id": cid} for qid, cid in qc_pairs],
            conflict_cols=["question_id", "chapter_id"],
        )
        counts["question_tags"] = upsert(
            cur, "question_tags", question_tag_rows,
            conflict_cols=["question_id", "tag_type", "tag_value"],
        )

        # ---------- tables ----------
        counts["tables_"] = upsert(
            cur, "tables_",
            [{
                "id": t["id"], "title": t["title"], "reason": t["reason"],
                "scope": t["scope"], "subject_id": t["subject_id"],
                "headers": t["headers"], "rows": t["rows"],
            } for t in tables],
            conflict_cols=["id"], json_cols=("headers", "rows"),
            # 網頁 dev mode 改過的比較表欄位(tables_.edited_fields，見 migration 0010)
            # 不要被來源 JSON 蓋回去；scope / subject_id 仍以來源檔案為準。
            protect_columns=("title", "reason", "headers", "rows"),
        )
        counts["question_tables"] = upsert(
            cur, "question_tables", question_table_rows,
            conflict_cols=["question_id", "table_id"],
        )

        # ---------- images ----------
        orphan_images = 0
        image_rows = []
        for i in images:
            qid = i["question_id"]
            if qid is not None and qid not in known_question_ids:
                orphan_images += 1
                qid = None
            image_rows.append({
                "filename": i["filename"], "question_id": qid,
                "option_letter": i["option_letter"], "caption": i["caption"],
                "reason": i["reason"], "ai_image_prompt": i["ai_image_prompt"],
                "image_type": i["image_type"], "source_kind": i["source_kind"],
                "storage_path": i["storage_path"],
            })
        if orphan_images:
            print(f"警告：{orphan_images} 張圖片引用的 question_id 在題庫中找不到，已改存為 NULL")
        counts["images"] = upsert(
            cur, "images", image_rows,
            conflict_cols=["filename"],
        )

        # ---------- knowledge_cards / card_bullets ----------
        card_rows = []
        for c in cards:
            chapter_id = chapter_pk_by_subj_no.get((c["subject_id"], c["_chapter_no"]))
            card_rows.append({
                "node_id": c["node_id"], "subject_id": c["subject_id"],
                "chapter_id": chapter_id, "card_title": c["card_title"],
                "card_subtitle": c["card_subtitle"], "status": c["status"],
            })
        counts["knowledge_cards"] = upsert(
            cur, "knowledge_cards", card_rows, conflict_cols=["node_id"],
        )
        counts["card_bullets"] = upsert(
            cur, "card_bullets", bullets,
            conflict_cols=["card_node_id", "ordinal"],
        )

        # ---------- concept_nodes / concepts / concept_questions ----------
        node_rows = []
        for n in concept_nodes:
            chapter_id = chapter_pk_by_subj_no.get((n["subject_id"], n["_chapter_no"]))
            node_rows.append({
                "node_id": n["node_id"], "node_path": n["node_path"],
                "subject_id": n["subject_id"], "chapter_id": chapter_id,
            })
        counts["concept_nodes"] = upsert(
            cur, "concept_nodes", node_rows, conflict_cols=["node_id"],
        )
        counts["concepts"] = upsert(
            cur, "concepts", concepts, conflict_cols=["node_id", "concept_id"],
        )
        # concept_questions 依賴 questions 已存在；濾除找不到對應題目的孤兒列
        known_question_ids = set(canonical.keys())
        cq_rows = [cq for cq in concept_questions if cq["question_id"] in known_question_ids]
        skipped_cq = len(concept_questions) - len(cq_rows)
        counts["concept_questions"] = upsert(
            cur, "concept_questions", cq_rows,
            conflict_cols=["node_id", "concept_id", "question_id"],
        )
        if skipped_cq:
            print(f"警告：{skipped_cq} 筆 concept_questions 的 question_id 在題庫中找不到，已略過")

        # 同上，question_tags/question_tables/question_chapters 也可能引用不存在的題目（資料不一致時），
        # 這裡假設題庫已含所有引用到的題目；若未來報錯可在此加同樣的過濾。

        # ---------- sync_runs ----------
        cur.execute(
            "insert into sync_runs (started_at, finished_at, table_counts, note) values (%s, %s, %s, %s)",
            (datetime.now(timezone.utc), datetime.now(timezone.utc),
             psycopg2.extras.Json(counts), "sync_all.py")
        )

        conn.commit()
        print("\n同步完成，各表寫入筆數：")
        for k, v in counts.items():
            print(f"  {k}: {v}")

    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
