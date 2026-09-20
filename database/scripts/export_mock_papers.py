"""把模擬考要用的考卷從 Supabase 匯出成 JSON，一起打包進網站。

為什麼要匯出而不是線上查資料庫：
模擬考站(exam.rnhighpass.com)是公開、免登入的，如果它直接連 Supabase，
anon key 會出現在前端，任何人都能反過來把整個題庫(含詳解、筆記卡)抓走。
匯出成 JSON 之後，模擬考站只帶著這幾份考卷的題目與選項，沒有資料庫連線。

只匯出模擬考用得到的欄位：**不含**詳解、考點、章節、標籤。

用法(在 database/ 底下)：
    .venv/bin/python scripts/export_mock_papers.py
"""

import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.common import IMAGES_DIR  # noqa: E402
from lib.db import get_connection  # noqa: E402

# 要放上模擬考站的考卷(民國年-梯次)，只取正式考試、不含補考
SITTINGS = ["115-2", "115-1", "114-3"]
GROUP_IDS = ["BM", "FA", "MS", "OP", "PC"]

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "src" / "data" / "mock-exam"
PUBLIC_IMAGES_DIR = PROJECT_ROOT / "public" / "exam-images"

QUESTION_SQL = """
    select id, question_no, stem, option_a, option_b, option_c, option_d, answer
    from questions
    where exam_sitting = %s and exam_group_id = %s and is_makeup = false
    order by question_no
"""

# 題幹附圖(考卷掃描圖)。選項圖已經以 markdown 語法寫在選項文字裡，不必另外帶。
IMAGE_SQL = """
    select question_id, filename
    from images
    where source_kind = 'scanned_exam'
      and option_letter is null
      and question_id = any(%s)
    order by filename
"""


def export_paper(cur, sitting: str, group_id: str) -> tuple[list[dict], set[str]]:
    cur.execute(QUESTION_SQL, (sitting, group_id))
    columns = [d.name for d in cur.description]
    questions = [dict(zip(columns, row)) for row in cur.fetchall()]
    if not questions:
        return [], set()

    cur.execute(IMAGE_SQL, ([q["id"] for q in questions],))
    images: dict[str, list[str]] = {}
    for question_id, filename in cur.fetchall():
        images.setdefault(question_id, []).append(filename)

    used: set[str] = set()
    for q in questions:
        q["images"] = images.get(q["id"], [])
        used.update(q["images"])
    return questions, used


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    papers: list[dict] = []
    used_images: set[str] = set()

    with get_connection() as conn, conn.cursor() as cur:
        for sitting in SITTINGS:
            for group_id in GROUP_IDS:
                questions, images = export_paper(cur, sitting, group_id)
                if not questions:
                    print(f"跳過 {sitting} {group_id}：沒有題目")
                    continue
                used_images |= images

                path = DATA_DIR / f"{sitting}_{group_id}.json"
                path.write_text(
                    json.dumps(questions, ensure_ascii=False, indent=1) + "\n",
                    encoding="utf-8",
                )
                papers.append(
                    {
                        "sitting": sitting,
                        "groupId": group_id,
                        "questionCount": len(questions),
                    }
                )
                print(f"{path.relative_to(PROJECT_ROOT)}：{len(questions)} 題")

    write_index(papers)
    sync_images(used_images)


def write_index(papers: list[dict]) -> None:
    """產生 index.ts：考卷清單 + slug 對照表(動態 import，只載入正在考的那份)。"""
    entries = "\n".join(
        f'  "{p["sitting"]}_{p["groupId"]}": () => import("./{p["sitting"]}_{p["groupId"]}.json")'
        f".then((m) => m.default as MockQuestionData[]),"
        for p in papers
    )
    listing = "\n".join(
        f'  {{ sitting: "{p["sitting"]}", groupId: "{p["groupId"]}", '
        f"questionCount: {p['questionCount']} }},"
        for p in papers
    )
    content = f"""// 這個檔案由 database/scripts/export_mock_papers.py 產生，請不要手改。
// 題庫更新後重跑該指令，並重新部署模擬考站。

export interface MockQuestionData {{
  id: string;
  question_no: number;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  /** 題幹附圖檔名，對應 public/exam-images/ */
  images: string[];
}}

export interface MockPaperMeta {{
  sitting: string;
  groupId: string;
  questionCount: number;
}}

/** 模擬考站提供的考卷(新到舊由 data.ts 排序) */
export const MOCK_PAPERS: MockPaperMeta[] = [
{listing}
];

/** slug(`<sitting>_<group>`) -> 該份考卷的題目；動態 import 讓每份考卷各自成為一個 chunk */
export const MOCK_PAPER_LOADERS: Record<string, () => Promise<MockQuestionData[]>> = {{
{entries}
}};
"""
    path = DATA_DIR / "index.ts"
    path.write_text(content, encoding="utf-8")
    print(f"{path.relative_to(PROJECT_ROOT)}：{len(papers)} 份考卷")


def sync_images(used_images: set[str]) -> None:
    """只保留這幾份考卷用得到的圖片，其餘從 public/ 移除(來源檔仍在 IMAGES_DIR)。"""
    for filename in sorted(used_images):
        source = IMAGES_DIR / filename
        if not source.exists():
            print(f"⚠️  找不到圖片來源：{source}")
            continue
        shutil.copy2(source, PUBLIC_IMAGES_DIR / filename)
        print(f"圖片：{filename}")

    for existing in sorted(PUBLIC_IMAGES_DIR.glob("*.png")):
        if existing.name not in used_images:
            existing.unlink()
            print(f"移除不相關的圖片：{existing.name}")


if __name__ == "__main__":
    main()
