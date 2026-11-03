# docs 索引

> 2026-10-27 整理：常用的放最上層，做完的紀錄都在 `archive/`(不用看，需要查舊決定時再翻)

## 你會用到的

| 檔案 | 做什麼 |
|---|---|
| [review-checklist.md](review-checklist.md) | **需確認總表**：圖片待審、待核對、國考與現行不同，勾選或在行尾留意見 |
| [feature-backlog.md](feature-backlog.md) | **功能列表**：「功能備忘錄」放你的想法，討論後才移到下面的表格 |
| [search-audit.md](search-audit.md) | **搜尋盤查**：所有入口、實際搜尋欄位、範圍與操作一致性方案及待決事項 |
| [ui-library.md](ui-library.md) | **UI 對照庫**：本機可操作的下拉選單樣式、取捨與後續新增方式 |
| [guideline-watchlist.md](guideline-watchlist.md) | **指引追蹤清單**：每年或 2–3 年改版的指引、頁面目前版本、下次要查什麼(AI 定期檢查用) |

## Claude 工作用(你不用看)

| 檔案 | 做什麼 |
|---|---|
| [knowledge-progress.md](knowledge-progress.md) | 目前狀態、下一步、常用指令(每次開工先讀) |
| [wrap-up-plan.md](wrap-up-plan.md) | 知識庫建完後的收尾步驟與紀錄 |
| [batch-usage-log.md](batch-usage-log.md) | Gemini batch 用量、費用與 Google Cloud 剩餘額度 |
| [positioning.md](positioning.md) | 知識庫定位、寫作格式、各類型範本、之後的功能順序 |
| [knowledge-roadmap.md](knowledge-roadmap.md) | 各輪範圍、跨輪移交清單、資料來源原則 |
| [deploy-size-plan.md](deploy-size-plan.md) | 部署流程(免費方案 CPU 與大小限制) |
| [new-sitting-import.md](new-sitting-import.md) | 新梯次考題匯入流程(PDF → 題庫 → 網站)、網頁修改拉回本地 |
| [knowledge-question-alignment.md](knowledge-question-alignment.md) | 知識頁上下考題來源、題數差異與內容吻合問題，2026-11-01 決定暫緩處理 |
| [hint-system.md](hint-system.md) | 共用操作提示、首批小測驗／看答案套用與驗收方式；網站教學延後 |
| [spec.md](spec.md) | 網站最初的功能規格(2026-09) |

## 自動產生的報告

| 檔案 | 產生方式 |
|---|---|
| [image-license-review.md](image-license-review.md) | `python3 scripts/image-license-review.py`(圖片授權) |
| [uptodate-scan.md](uptodate-scan.md) | `python3 scripts/source-scan.py`(和外部來源的重疊掃描) |

## sources/

各系統的資料來源整理、圖片盤點與 AI 底圖提示詞。做圖或補內容時才會用到，例如 [sources/musculoskeletal-skin-images.md](sources/musculoskeletal-skin-images.md)(8 張 AI 底圖的提示詞)

## archive/(做完的紀錄)

| 資料夾 | 內容 |
|---|---|
| `archive/rounds/` | 第 0–17 輪完整進度紀錄、第 8–12 與 13–17 輪計畫 |
| `archive/tag-merge/` | 各輪同義標籤合併紀錄(題目修正紀錄會連到這裡)；待決定項目都已處理或收進 review-checklist |
| `archive/reviews/` | 各種一次性審閱清單：產科拆分、小兒、跨系統分組、檢驗方法、DSM 核對、國考點、相關頁、打好基礎候選 |
