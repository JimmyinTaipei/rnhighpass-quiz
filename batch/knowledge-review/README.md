# 知識頁 Batch 審稿

用 Gemini batch 找知識頁的實質錯誤(事實、過時、前後矛盾、表格、計算、名詞)。模型結果只是候選，Claude 逐條查證、列給使用者決定後才改頁面

| 位置 | 用途 |
|---|---|
| `prompt.md` | 審稿指示(system instruction) |
| `requests/` | 請求檔，`python3 scripts/batch-knowledge-review.py prep [--pilot 6]` 產生(不進 git，可重產) |
| `responses/` | Google Cloud 下載回來的原始回傳(不進 git) |
| `reports/` | `parse` 產生的報告與候選問題 JSONL |

## 送出步驟(使用者)

1. 先送 `requests/knowledge-review-pilot.jsonl`(6 篇)試跑，確認格式與品質
2. 上傳到 Cloud Storage → Vertex AI 建立 batch prediction，模型選 Gemini 3.8 Flash，輸出到 Cloud Storage
3. 下載回傳的 predictions JSONL 放進 `responses/`
4. Claude 跑 `python3 scripts/batch-knowledge-review.py parse batch/knowledge-review/responses/<檔名>.jsonl`
5. 試跑沒問題再送 `requests/knowledge-review-all.jsonl`(404 篇，估約 6 美元)

之後的圖片審稿(第二階段)與 AI 詳解審稿(第三階段)沿用同一個資料夾結構
