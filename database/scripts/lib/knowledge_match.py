"""知識頁 ↔ 題目的比對規則。

suggest_chapter_refs.py(建議 chapters 對照)與 export_knowledge_questions.py
(每篇文章的相關考題數)共用這一份，兩邊對「哪些題目跟這篇有關」的判斷才一致。
"""

import json
import os
import re
from collections import defaultdict

from .parse_chapters import parse_all_chapters

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DATA = os.path.join(ROOT, "src", "data", "knowledge")
SEP = " > "

# 名稱比對的最短長度。段落標題很短，兩個字的別名會誤中(「性病」中「血管性病變」)；
# 題目內文是在已對照的段落裡找，「血鋰」「尿酮」這類兩字詞反而是最精準的線索
MIN_TITLE_NAME_LEN = 3
MIN_TEXT_NAME_LEN = 2
# 標籤借自別的主題、要再比對名稱的頁面類型(見 ArticleMatcher)
NAME_CATEGORIES = {"drug", "pathogen", "lab", "physiology"}


def load_json(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


class QuestionIndex:
    """分章題本的段落與題目。

    h2_nodes:段落樹(key、title、qids、children),順序同大綱
    qids_by_key:「章節全名 > H2(> H3)」→ 題號集合
    """

    def __init__(self):
        _, _, _, questions = parse_all_chapters()
        self.tags = {}
        self.text = {}
        ids = defaultdict(lambda: defaultdict(set))
        for q in questions:
            self.tags[q["id"]] = q["tags"]
            self.text[q["id"]] = " ".join(
                q[k] for k in ("stem", "option_a", "option_b", "option_c", "option_d")
            ).lower()
            key = q["topic_key"]
            if key is None:
                continue
            bucket = ids[(q["_subject_id"], q["_chapter_no"])]
            if len(key) == 2 and isinstance(key[0], tuple):
                bucket[f"{key[0][0]}>{key[1]}"].add(q["id"])
                bucket[key[0][0]].add(q["id"])
            else:
                bucket[key[0]].add(q["id"])

        self.h2_nodes = []
        self.qids_by_key = {}
        for ch in load_json("chapter-outline.json")["chapters"]:
            ck = (ch["subjectId"], ch["chapterNo"])
            for h2 in ch["topics"]:
                h2_key = f"{ch['fullTitle']}{SEP}{h2['title']}"
                node = {
                    "key": h2_key,
                    "title": h2["title"],
                    "qids": ids[ck].get(h2["title"], set()),
                    "children": [],
                }
                self.qids_by_key[h2_key] = node["qids"]
                for h3 in h2["children"]:
                    child = {
                        "key": f"{h2_key}{SEP}{h3['title']}",
                        "title": h3["title"],
                        "block": h3["block"],
                        "qids": ids[ck].get(f"{h2['title']}>{h3['title']}", set()),
                    }
                    self.qids_by_key[child["key"]] = child["qids"]
                    node["children"].append(child)
                self.h2_nodes.append(node)


def drug_tags_by_group():
    taxonomy = load_json("taxonomy.json")
    return {g["id"]: g.get("drugTags", []) for d in taxonomy["domains"] for g in d["groups"]}


def article_names(a, min_len):
    names = [str(n) for n in (a["title"], *(a.get("aliases") or []))]
    if a.get("subtitle"):
        names.append(re.sub(r"[((].*", "", a["subtitle"]).strip())
    return [n.lower() for n in names if len(n) >= min_len]


class ArticleMatcher:
    """判斷一題跟某篇知識頁有沒有關係。

    tagged:題目帶有本頁的 dz 標籤(疾病等)、所屬群組的 drug 標籤,或本頁 admTags 的 adm 標籤(護理行政)。
      藥物頁的 dzTags 是「治療哪些病」，拿來比對會把整個疾病章都拉進來，
      所以藥物頁只看 drug 標籤；沒有群組的藥物頁才退回 dz。
    named:題幹或選項提到本頁名稱/別名(不要求標籤：在已對照的段落裡，提到名稱就夠了)。
      同一群組的藥物頁共用 drug 標籤(ACEI、ARB、β 阻斷劑都是「降血壓藥」)；
      病原體、檢驗、生理頁的 dz 標籤借自疾病(糖尿病的題不見得在考 HbA1c)，
      要靠名稱才分得開。疾病與護理主題頁的 dz 標籤就是主題本身，不需要。
    """

    def __init__(self, a, index, drug_tags):
        self.a = a
        self.index = index
        self.dz = set(a.get("dzTags") or [])
        self.adm = set(a.get("admTags") or [])
        self.drug = set(drug_tags.get(a.get("group"), []))
        self.use_dz = a["category"] != "drug" or not self.drug
        self.names = article_names(a, MIN_TEXT_NAME_LEN)
        self.title_names = article_names(a, MIN_TITLE_NAME_LEN)
        self.need_name = (
            a["category"] in NAME_CATEGORIES
            and bool(self.names)
            and bool(self.drug or self.dz)
        )

    @property
    def has_signal(self):
        return bool((self.dz and self.use_dz) or self.drug or self.adm)

    def tagged(self, qid):
        return any(
            (t == "dz" and self.use_dz and v in self.dz)
            or (t == "other" and v in self.drug)
            or (t == "adm" and v in self.adm)
            for t, v in self.index.tags[qid]
        )

    def named(self, qid):
        return any(n in self.index.text[qid] for n in self.names)

    def related(self, qids):
        """一個對照段落裡跟本頁相關的題目。

        沒有標籤可比對(人工對照的生理頁、檢驗頁)時整段都算。需要名稱的頁面
        只算提到名稱的題，不退回只看標籤——否則「糖尿病的題」會全部算成
        HbA1c、酮體的題。所以小類別的藥可能只有個位數，那是實際的數字。
        """
        if not self.has_signal:
            return set(qids)
        if self.need_name:
            return {q for q in qids if self.named(q)}
        hit = {q for q in qids if self.tagged(q)}
        # 段落是人工對照的(標籤一題都沒中)，整段視為相關
        return hit or set(qids)
