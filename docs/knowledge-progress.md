# 知識庫進度(接續用)

> **任何知識庫工作開始前先讀這份檔案。** 做完一步就更新「目前狀態」與「下一步」
> 第 0–17 輪的完整紀錄(每輪步驟、需確認清單原文、各組細節)封存在 [archive/rounds/knowledge-progress-history.md](archive/rounds/knowledge-progress-history.md)；docs 其他檔案見 [README.md](README.md)

## 目前狀態(2026-10-28)

- **知識庫建完**：404 篇、題目涵蓋 8960/8960(11 科 100%)、chapters 對照涵蓋 660/660 個有題目的 H2
- **收尾**：A 標點、B 補連結、C chapters 抽查、D 需確認總表、E 寫回 Supabase 與部署、F 合併 main 都完成，見 [wrap-up-plan.md](wrap-up-plan.md)
- **線上版本**：workers.dev **eec4f4c9**(2026-10-29，加上間隔複習；部署後 404 篇知識頁全部 200)；再前一版 e6cbcd11(段落考題分配、知識頁收藏、搜尋合併、梯次區間等)；前一版 132f64cf(2026-10-28，含 Batch 審稿修正 262 條＋介面小修)。免費方案的 10 ms CPU 上限造成之前兩次 1102，**使用者 2026-10-28 改訂 Workers Paid(US$5/月)**；部署後 414 篇知識頁全部 200、前 8 分鐘 480 個請求 0 錯誤(CPU p50 14–26 ms)。可以之後降回免費，降之前要先把各頁 CPU 壓到 10 ms 以下(模擬考站 p90 約 230–420 ms 也要處理)
- **Supabase**：questions 8960、question_tags 16674，與來源一致
- **Batch 知識頁審稿完成**(2026-10-28)：549 個候選問題，改 262(162 頁)、誤報 282、待確認 5(4 項，已列入 review-checklist)；紀錄見 [archive/reviews/batch-knowledge-review-2026-10-28.md](archive/reviews/batch-knowledge-review-2026-10-28.md)，已上線(132f64cf)

## 表格閱讀與收藏（2026-11-01）

- 知識庫 2,097 張表格已補持久 ID／標題，表內文字保留；整張左右滑、有色表頭／白底內容、手機滑動／電腦放大彈窗與收藏已接入，收藏清單位於「我的題本 › 表格」
- migration 0015 已套用，RLS 啟用；舊比較表依使用者驗收回饋移除灰白交錯列，分章內容與比較表入口不合併
- 知識庫建置、型別、修改檔案 ESLint、5 項表格測試及完整正式建置通過；402 篇來源與輸出內容保留驗證通過
- 第二次手機驗收調整：手機文章與閱讀區改白底；取消表格本身點擊／Enter 開啟，手機只滑動並保留右下角提示，表頭直接顯示收藏。桌機放大／收藏移入有色表頭右側、依 hover／聚焦顯示；前版輕點手勢邏輯已移除。知識庫保留有色表頭，獨立頁收藏在標題旁
- 收藏與表頭規則更新：星號固定顯示、收藏後黃色；兩個表格控制改小型灰底，恢復表頭原始列高，僅放大按鈕 hover／聚焦顯示。手機登入另重現區網 Origin 的開發 JS 請求 403，已補精確本機私人 IP 的 allowedDevOrigins，詳見 [手機開發登入紀錄](mobile-development-login.md)
- 使用者已確認手機進站保有登入狀態；桌機表格星號依回饋改透明無框融入表頭，仍常駐且收藏後黃色，放大閱讀按鈕保留原樣
- 使用者確認本輪功能目前皆可使用，暫無其他修改；2026-11-01 已授權 commit、push 及部署 Cloudflare，部署進行中，完成後補上版本與線上驗證結果


## 下一步

1. **收尾 A2**：題目 AI 詳解套用標點規則(使用者已同意)；詳解錯誤更正要**先給使用者看做法**
2. **Batch 全面檢查**：2026-10-29 後醫物理用掉約 NT$1300，剩 **NT$437**(額度 2026-11-10 到期)。AI 詳解全量估 NT$380–560、不夠，**不做**；圖片 156 張估 NT$20 以內，使用者要做再做。用量見 [batch-usage-log.md](batch-usage-log.md)
3. **新梯次**：照 [new-sitting-import.md](new-sitting-import.md)；115-3(電腦化)試題公布後就可以開始
4. **功能**：見 [feature-backlog.md](feature-backlog.md)；「功能備忘錄」的項目要先跟使用者討論。2026-10-29 完成、commit 並部署(e6cbcd11)：段落考題重新分配＋綜合考題(K7)、知識頁收藏(K1)與建議改進(K8)、搜尋合併(P5)、年度次別篩選(L7)、錯題連到知識頁(L1)、UI 小修(P6)。`database/migrations/0014_knowledge_favorites.sql` 已套用到 Supabase(新表 user_knowledge_favorites、回報類型加 content)
5. **指引追蹤**：見 [guideline-watchlist.md](guideline-watchlist.md)，先查「優先」6 項有沒有新版，結果列給使用者決定
6. **需確認項目**：見 [review-checklist.md](review-checklist.md)，「待核對」使用者之後再看

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
