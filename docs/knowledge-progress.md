# 知識庫製作進度(接續用)

> **任何知識庫工作開始前先讀這份檔案。** 每完成一篇或一個步驟就更新，暫停(額度用完、中斷)後，新的 session 讀這份就能接著做。
> 定位與寫作規則見 [positioning.md](positioning.md)；批次順序與資料需求見 [knowledge-roadmap.md](knowledge-roadmap.md)。

## 目前輪次

- **輪次**：第 0 輪(定位、介面規範、進度機制)
- **計畫檔**：`~/.claude/plans/1-cosmic-sonnet.md`
- **狀態**：完成，等使用者確認畫面與資料清單

## 本輪步驟

| 步驟 | 內容 | 狀態 |
|---|---|---|
| 0a | positioning.md、knowledge-roadmap.md、本檔、AGENTS.md 規則、記憶 | ✅ 完成 |
| 0b | procedure／device 範本、taxonomy(device 類型、critical-care 分類)、程式同步 | ✅ 完成 |
| 0c | 頁首重點摘要框、刪「XX 考題」膠囊、ExamPresence 響應式、巢狀列點樣式、basics 三段切換 | ✅ 完成(tsc、lint 通過；畫面待使用者目視確認) |
| 0d | roadmap「各批次需要的資料」清單，回報使用者，等補齊再開第 1 輪 | ✅ 清單完成，等使用者回覆 |

## 進行中

- **第 1 輪 1a 掃描：腳本與報告完成(2026-10-04)**，接著做 1b。
  - 腳本：`python3 scripts/source-scan.py`；報告：[uptodate-scan.md](uptodate-scan.md)。
  - 結果：161 篇頁面比對 198 篇 UpToDate 匯出檔(精神、癌症、感染、免疫)。**0 篇含形似字元、0 篇英文逐字重疊**；1 篇數字序列重疊(sepsis：SIRS 標準值，屬事實性數字，保留)、1 篇零星重疊(HPV，不處理)。
  - **發現**：UpToDate 匯出檔的英文字母夾雜西里爾、希臘、亞美尼亞形似字元(例：`Ιmmսոοglоbսlins`)，是防複製／追蹤記號。腳本比對前會還原。之後新匯入的資料若要貼進頁面，會帶著這些記號，所以一律改寫，不貼原文。
  - **限制**：中文翻譯式近似照抄抓不到；國考書 PDF 是掃描圖檔沒文字層，無法比對(需 OCR)；圖表重製要人工看。
  - 人工抽查：antipsychotics 對 UpToDate 兩篇 SGA／FGA，結構、表格、藥名與考點都是重新整理，沒有翻譯式照抄。
  - ~~待做：1b 先抽查 5–8 篇引用 UpToDate 最多的頁面(antipsychotics、depressive-disorder、schizophrenia、sepsis 等)，人工看有沒有翻譯式近似照抄；之後每輪存檔前跑 `source-scan.py`。~~(已抽查 antipsychotics；其餘引用多的頁面在 1b 改寫時順便看)

- **第 1 輪 1b 進度(2026-10-04)**
  - 試做 3 篇：lung-cancer、lithium-level、candida，使用者已同意格式。
  - **重點摘要補條列：142 頁全部完成**(癌症 13、病原體 17、感染疾病 16、care 6、lab 10、行政 33、先前試做 3 與其他)。做法：只用頁面內已有的事實濃縮成 3–5 點，不加新資訊；`build-knowledge` 通過，`source-scan.py` 無新增重疊。
  - **19 頁原本沒有「重點摘要」的頁面也補完(2026-10-04)**：diabetes、blood-glucose、hba1c、ketones、ogtt、uacr、glucose-homeostasis、hypertension、heart-failure、coronary-artery-disease、hypotension、blood-pressure-regulation、cardiac-output、coronary-circulation、schizophrenia、bipolar-disorder、depressive-disorder、neurotransmitters-psychiatry、abg。每頁加「重點摘要」(4–6 點)與「國考常考點」(整理自頁內 `:::exam` 方塊與各段考點，不新增事實)，插在導言段與第一個 H2 之間。**全部 161 頁現在都有重點摘要**，build 與 source-scan 通過。
  - **密集句改分層列點(2026-10-04 完成主要部分)**：重新量測後，原先估的 605 行是高估(引用網址的括號被算進去)；扣掉引用後約 273 行，其中 136 行是「國考常考點」的壓縮條列(刻意保持緊湊，考前掃讀用)，其餘 137 行在內文。已改寫約 100 行：hypertension(22)、diabetes(12)、heart-failure(14)、end-of-life-care、cancer-treatment-toxicities、admin 11 頁、drug 與 pathogen 與 physiology 約 40 行等，全部改成 1. → a. 分層列點，引用保留。**未改**：①導言段(說明性短文，連結多)；②約 25 行附有長引用或國考與新指引對照的敘述(改動容易傷到引用，之後遇到再改)；③「國考常考點」的壓縮條列。
  - **1b 結論**：161 頁都有重點摘要；主要密集句已拆；build 與 source-scan 通過。
  - 下一步：第 1.5 輪免疫，**預計交給雲端 session**，交接說明與來源包規劃在 [sources/immunology.md](sources/immunology.md)；交出去之前要先 commit 並 push 本機的修改。

## 備註

- 頁首的 frontmatter 摘要框已在第 0.5 輪拿掉；frontmatter summary 只給預覽卡用(metformin 有寫)。頁面唯一的重點區塊是 `## 重點摘要 {#summary}`。
- 137 頁的頁尾「國考常考點」已合併到重點摘要底下的 `### 國考常考點`；其中 98 頁的重點摘要只有國考常考點，**第 1 輪要補上 3–5 點重點條列**。
- 全專案 `pnpm lint` 會記憶體不足當掉；改用 `NODE_OPTIONS=--max-old-space-size=8192 npx eslint <檔案>` 只檢查改過的檔。

## 下一步

- 等使用者：①目視確認 0c 畫面(metformin 頁頁首、手機寬度的「出現在」、/me 的「想打好基礎」切換)②回覆資料需求清單(roadmap「需要你補的」)
- 等使用者目視確認第 0.5 輪畫面：重點摘要卡片(國考點直接接在重點後面、沒有子標題)、系統頁/章節頁搜尋、「返回」=回上一頁(電腦版只在章節頁與知識頁出現；手機頂欄標籤改為「返回」)、右下「回到頂端」
- 第 1 輪先做 **1a 既有內容掃描**(UpToDate 與受版權保護來源比對，結果寫 `docs/uptodate-scan.md`，細節見 roadmap「UpToDate 使用原則」)，再做 1b：舊頁分層列點改寫＋重點摘要補條列(先試改 3 篇給使用者看)；之後是 **1.5 輪免疫**，然後才是第 2 輪精神收尾

## 待使用者決定

- **版權優先與 UpToDate 新原則(2026-10-04 使用者決定)**：內容以不碰版權為第一優先，有疑慮就在各文件標注來源與處理；免疫批次已抓的 UpToDate 照用，之後不再請使用者搜尋，除非真的需要確認，每輪結束只列「需確認清單」；不因此降低正確度與深度。免疫輪插在第 1 與第 2 輪之間(1.5 輪)。

- 行政 A–E 輪約 39 題 AI 詳解更正 **尚未 sync_all**(使用者指示：整輪做完再問)
- 資料庫 36 列含 master_id 的舊髒列＋13 列 other 型引號題號，刪除 SQL 已給使用者，未回覆
- 「詳解有更新的題目」清單(新的行政 F 輪)：使用者會再決定要不要開始

## 已完成輪次(摘要)

| 批次 | 篇數 | 完成日 |
|---|---:|---|
| 心血管 | — | 2026-09 |
| 精神 A–C | 8 | 2026-09 |
| 癌症 A–F | 21 | 2026-09 |
| 感染 | — | 2026-09 |
| 護理行政 A–E | 33 | 2026-10-01 |
| 第 0 輪：定位、範本、進度機制 | — | 2026-10-03 |
| 第 0.5 輪：重點摘要合併(137 頁)、搜尋、返回與回到頂端 | — | 2026-10-03 |

## 更新規則

1. 每寫完一篇：存檔 → 在「本輪步驟」或批次表把該篇標完成 → 寫下「下一步」。
2. 寫到一半要停：在「進行中」寫檔名、已完成的 H2、還缺什麼、來源包位置。
3. 一輪結束：跑 build-knowledge、resolver、`knowledge_coverage.py`，把涵蓋數寫進 roadmap，本檔換到下一輪。
