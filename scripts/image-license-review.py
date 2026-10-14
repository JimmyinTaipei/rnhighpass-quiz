#!/usr/bin/env python3
"""從 credits.json 產生 docs/image-license-review.md：列出所有「需要日後替換」的圖(CC BY-SA 等)。

允許且不需替換：Public Domain、CC0、CC BY(任何版本)、原創。
其餘(CC BY-SA、CC BY-NC…、未知)都列入清單。
替換狀態：在 credits.json 該圖加 "replaceStatus": "待替換" | "已替換為 AI 圖" | "保留"(預設待替換)。
每輪結束重跑：python3 scripts/image-license-review.py
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CREDITS = ROOT / "public/knowledge-images/credits.json"
KNOW = ROOT / "content/knowledge"
OUT = ROOT / "docs/image-license-review.md"

def ok(lic: str) -> bool:
    l = lic.strip()
    if l in ("原創", "Public Domain", "CC0") or l.startswith("CC0") or l.startswith("Public Domain"):
        return True
    return bool(re.match(r"^CC BY( \d|$)", l)) and "SA" not in l and "NC" not in l and "ND" not in l

credits = json.loads(CREDITS.read_text(encoding="utf-8"))
pages = {p: p.read_text(encoding="utf-8") for p in KNOW.rglob("*.md")}

rows, counts = [], {}
for name, c in credits.items():
    lic = c.get("license", "")
    counts[lic] = counts.get(lic, 0) + 1
    if ok(lic):
        continue
    used = sorted(str(p.relative_to(KNOW))[:-3] for p, t in pages.items() if f"/knowledge-images/{name}" in t)
    rows.append((name, c.get("title", ""), lic, ", ".join(used) or "(未使用)", c.get("sourceUrl", ""),
                 c.get("modified", "") or "未修改", c.get("replaceStatus", "待替換")))

lines = ["# 圖片授權複查清單(需日後替換的圖)", "",
         "> 由 `scripts/image-license-review.py` 自動產生，請勿手動編輯本檔；替換狀態寫在 `public/knowledge-images/credits.json` 該圖的 `replaceStatus`。",
         "> 規則：PD、CC0、CC BY、原創可直接用；CC BY-SA 等放進本清單，使用者日後逐張換成 AI 生成的圖(建議 AI 只出無文字底圖，中文標籤用 SVG 疊上)。", "",
         "## 授權統計", "", "| 授權 | 張數 |", "|---|---:|"]
lines += [f"| {k} | {v} |" for k, v in sorted(counts.items(), key=lambda x: -x[1])]
lines += ["", f"## 需替換清單(共 {len(rows)} 張)", ""]
if rows:
    lines += ["| 檔名 | 標題 | 授權 | 使用頁面 | 原始網址 | 修改 | 狀態 |", "|---|---|---|---|---|---|---|"]
    lines += ["| " + " | ".join(r) + " |" for r in sorted(rows)]
else:
    lines.append("目前沒有需要替換的圖。")
OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"{len(credits)} 張圖，需替換 {len(rows)} 張 → {OUT}")
