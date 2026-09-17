import json
import re
from .common import IMAGES_DIR

SCANNED_FILENAME_PATTERN = re.compile(
    r'^(\d+-\d+(?:_makeup)?_[A-Z]+_\d+)(?:_([A-D]))?\.png$'
)


def _load_image_type_map():
    """id -> image_type，來源: images_by_type_{類型}.json (皆為 {subject: {chapter: [records]}})。"""
    type_map = {}
    for f in IMAGES_DIR.glob("images_by_type_*.json"):
        image_type = f.stem[len("images_by_type_"):]
        data = json.loads(f.read_text(encoding="utf-8"))
        for chapters in data.values():
            for records in chapters.values():
                for rec in records:
                    type_map[rec["id"]] = image_type
    return type_map


def parse_all_images():
    """回傳 images list，包含:
    - AI 規劃圖 (來源 images.json)：source_kind='ai_generated'，storage_path 若磁碟上真的有檔案才填
    - 實際掃描的考卷截圖 (images/*.png 且檔名符合題目ID格式)：source_kind='scanned_exam'
    """
    images = []

    index_path = IMAGES_DIR / "images.json"
    index_data = json.loads(index_path.read_text(encoding="utf-8"))
    image_type_map = _load_image_type_map()

    on_disk = {p.name for p in IMAGES_DIR.glob("*.png")}

    seen_filenames = set()
    for rec in index_data.get("images", []):
        filename = rec["image_filename"]
        if filename in seen_filenames:
            continue  # 來源 images.json 偶有完全重複的紀錄
        seen_filenames.add(filename)
        images.append({
            "filename": filename,
            "question_id": rec.get("id"),
            "option_letter": None,
            "caption": rec.get("caption"),
            "reason": rec.get("reason"),
            "ai_image_prompt": rec.get("ai_image_prompt"),
            "image_type": image_type_map.get(rec.get("id")),
            "source_kind": "ai_generated",
            "storage_path": str((IMAGES_DIR / filename)) if filename in on_disk else None,
        })

    indexed_filenames = {img["filename"] for img in images}
    for filename in sorted(on_disk):
        if filename in indexed_filenames:
            continue
        m = SCANNED_FILENAME_PATTERN.match(filename)
        if not m:
            continue
        images.append({
            "filename": filename,
            "question_id": m.group(1),
            "option_letter": m.group(2),
            "caption": None,
            "reason": None,
            "ai_image_prompt": None,
            "image_type": None,
            "source_kind": "scanned_exam",
            "storage_path": str(IMAGES_DIR / filename),
        })

    return images
