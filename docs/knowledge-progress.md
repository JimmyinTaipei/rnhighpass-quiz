# 知識庫進度(接續用)

> **任何知識庫工作開始前先讀這份檔案。** 做完一步就更新「目前狀態」與「下一步」
> 第 0–17 輪的完整紀錄(每輪步驟、需確認清單原文、各組細節)封存在 [archive/rounds/knowledge-progress-history.md](archive/rounds/knowledge-progress-history.md)；docs 其他檔案見 [README.md](README.md)

## 目前狀態(2026-10-27)

- **知識庫建完**：404 篇、題目涵蓋 8960/8960(11 科 100%)、chapters 對照涵蓋 660/660 個有題目的 H2
- **收尾**：A 標點、B 補連結、C chapters 抽查、D 需確認總表、E 寫回 Supabase 與部署、F 合併 main 都完成，見 [wrap-up-plan.md](wrap-up-plan.md)
- **線上版本**：workers.dev 版本 ad054753(2026-10-27)，main = claude/knowledge-assets(fddd992 之後)
- **Supabase**：questions 8960、question_tags 16674，與來源一致

## 下一步

1. **收尾 A2**：題目 AI 詳解套用標點規則(使用者已同意)；詳解錯誤更正要**先給使用者看做法**
2. **Batch 全面檢查**(Gemini 3.8 Flash，剩 NT$2007)：順序 知識頁 → 圖片 → AI 詳解。知識頁請求檔已備好(`batch/knowledge-review/`，`scripts/batch-knowledge-review.py`)，**等使用者先送 6 篇試跑**，回傳後 parse、Claude 逐條查證再列給使用者
3. **功能**：見 [feature-backlog.md](feature-backlog.md)；「功能備忘錄」的項目要先跟使用者討論
4. **指引追蹤**：見 [guideline-watchlist.md](guideline-watchlist.md)，先查「優先」6 項有沒有新版，結果列給使用者決定
5. **需確認項目**：見 [review-checklist.md](review-checklist.md)，「待核對」使用者之後再看

## 常用指令

| 用途 | 指令(在 rnhighpass-quiz/) |
|---|---|
| 建置知識庫 | `node scripts/build-knowledge.mjs` |
| 題目解析與相關題 | `database/.venv/bin/python database/scripts/resolve_knowledge_questions.py`、`export_knowledge_questions.py` |
| chapters 抽查 | `database/.venv/bin/python database/scripts/audit_chapter_refs.py` |
| 標點檢查 | `python3 scripts/normalize-punctuation.py`(加 `--write` 寫入) |
| 來源重疊與圖片授權 | `python3 scripts/source-scan.py`、`python3 scripts/image-license-review.py` |
| 指引引用掃描 | `python3 scripts/guideline-scan.py` |
| 涵蓋報告 | `python3 /Users/jimmy/Projects/多保命護理分章/scripts/knowledge_coverage.py` |
| 寫回 Supabase | `cd database && .venv/bin/python scripts/sync_all.py`(只 upsert，來源刪掉的標籤要另外刪) |
| 部署 | 見 [deploy-size-plan.md](deploy-size-plan.md)：opennextjs build → upload 預覽 → `wrangler versions deploy <id>@100` |

## 更新規則

1. 每做完一步：更新「目前狀態」與「下一步」
2. 做到一半要停：在「下一步」寫清楚做到哪裡、缺什麼
3. 動到題庫(01／02)：兩邊同步，記在 `多保命護理分章/analysis/題目修正紀錄.md`，寫回 Supabase
4. 全專案 `pnpm lint` 會記憶體不足，改用 `NODE_OPTIONS=--max-old-space-size=8192 npx eslint <檔案>`
