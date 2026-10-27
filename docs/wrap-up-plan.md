# 知識庫收尾計畫

> 第 17 輪後內容已涵蓋 8960/8960，這份是**建完之後的收尾**。做完一步就在表上打勾，並在 [knowledge-progress.md](knowledge-progress.md)「目前輪次」記下一步
> 功能面的待辦另見 [feature-backlog.md](feature-backlog.md)

## 範圍(2026-10-27 掃描，content/ 404 篇)

| 項目 | 數量 |
|---|---|
| 句尾「。」的行(不含表格、標題、frontmatter) | 7,788 行，172 篇 |
| 半形 `()` 內有中文 → 改成 `（）` | 約 20,700 處 |
| 全形 `（）` 內沒有中文 → 改成 `()` | 59 處 |
| 已符合(全形＋中文 278、半形＋英文 4,532) | 不動 |
| 括號裡又有括號的行 | 60 行(腳本由內往外處理，再人工看) |
| 「見之後的 XX 頁」等純文字待補連結 | 9 處＋progress 裡各輪「之後要回補的連結」 |
| 各輪需確認清單 | 第 6–17 輪共 12 份 |
| 自動產生、未逐篇審的 `chapters:` 對照 | 127 篇 |

## 步驟

| 步 | 內容 | 誰 | 狀態 |
|---|---|---|---|
| 收尾 0 | 使用者登入確認首頁「上次開啟」與登入顯示(17b 部署後還沒確認) | 使用者 | ✅ 2026-10-27 |
| 收尾 A | 標點批次：句尾句號＋括號(規則見下)；先跑 dry-run 給使用者看 30 處樣本，同意後才寫入；腳本 `scripts/normalize-punctuation.py` | Claude | ✅ 2026-10-27(414 檔、20,978 行；建置結果與原本相同) |
| 收尾 A2 | 題目 AI 詳解套用同樣標點規則(使用者已同意)；詳解錯誤更正要**先給使用者看做法**再決定採不採用 | Claude | ⬜ 排在 B 之後 |
| 收尾 B | 補連結：純文字「之後的 XX 頁」改 `[[slug]]`；逐條核對 progress 各輪「之後要回補的連結」，已補的劃掉、沒補的補上；跑 resolver 確認沒有壞連結 | Claude | ✅ 2026-10-27(見下方紀錄) |
| 收尾 C | `chapters:` 抽查：腳本比對每篇的 chapters 與相關考題實際落在的章節，列出差異大的篇，人工修 | Claude | ⬜ |
| 收尾 D | 需確認清單整併：第 6–17 輪清單合成一份 [review-checklist.md](review-checklist.md)，依類型分組(圖片待審、建議做的圖、待核對、只依國考、國考答案與新指引不同)，每項 checkbox＋連到頁面 | Claude 整理、使用者勾 | ✅ 2026-10-27(使用者勾選中) |
| 收尾 E | build、export、source-scan；重新部署 workers.dev(內容改了要重建靜態資產) | Claude | ⬜ |
| 收尾 F | 分支 `claude/knowledge-assets` 合併回 main(目前領先 main 14 個 commit，部署是從這個分支做的) | 使用者同意後 Claude | ⬜ |

A、B 都會改很多頁，各自一個 commit，有問題可以整批還原。

## 收尾 A 的規則

### 句號

1. 每一行最後的「。」刪掉(列點、段落、提示框都一樣)
2. 「。」後面只接 `**`、`」`、`）` 這類收尾符號時，也算句尾
3. 一行內句子中間的「。」保留
4. 表格、標題、frontmatter、程式碼區塊不動

### 括號

1. 括號內**有中文** → 全形 `（）`
   1. 例：`醫療法(第 28 條)` → `醫療法（第 28 條）`
   2. 中英混合也算有中文：`賦權(empowerment，又譯增能)` → `賦權（empowerment，又譯增能）`
2. 括號內**沒有中文**(英文、縮寫、數字、符號) → 半形 `()`
   1. 例：`根本原因分析（RCA）` → `根本原因分析(RCA)`
   2. 純數字也用半形：`(2025)`、`(1:1000)`
3. 改成全形時，去掉括號外側和內側多的空白：`第 28 條 (醫療法)` → `第 28 條（醫療法）`
4. 括號裡又有括號：由內往外判斷，外層含中文就用全形
5. 不動的地方：Markdown 連結網址 `](...)`、`{#id}`、`::questions{...}`、行內程式碼、URL、frontmatter 的 YAML 語法
6. frontmatter 的 `title`、`subtitle`、`summary`、`aliases` 字串值照同樣規則改(畫面會顯示)；`build-knowledge.mjs` 已經兩種括號都認得

### 使用者決定(2026-10-27)

1. 純數字或符號的括號 `(2025)` 用半形
2. 題目的 AI 詳解也照同樣規則改(收尾 A2，用 05_apply_sol.py 流程)；確定詳解內容有錯的也一併更正
3. 指令行(`::questions`、`::figure`、`:::exam` 等)整行不動，`keyword` 是正規表示式
4. 括號內只有 `[[slug|中文]]` 連結，或含「、，；：」時算有中文
5. 雙層全形括號照規則，不改用〔〕
6. 中文旁的半形分號、逗號、冒號一起轉全形(原有分號 1,859、逗號 120、冒號 25 處)；數字中的 `3:1`、`1,000` 與 YAML 語法不動

## 收尾 B 紀錄(2026-10-27)

1. 純文字改連結 42 處：「見之後的 XX 頁」「留給 XX 那一輪」「見第 N 輪」「之後在 XX 頁整理」「（G 組）」等，掃描後已清空
2. 各輪「之後要回補的連結」逐條核對 29 條未連：原頁**有提到**的 9 條補上(individual-cognitive-behavioral-therapy → eating-disorders、rheumatoid-arthritis 與 sle → immunology-labs、hypersensitivity-reactions → transfusion-reactions、immunoglobulins-hla 與 t-lymphocytes → hypersensitivity-reactions、complement-system → urticaria-angioedema、sle 等)
3. 原頁**沒有提到**對方的不硬加，例如 family-violence ↔ community-mental-health、dementia ↔ community-mental-health、child-adolescent-mental-health ↔ milieu-therapy、somatic-dissociative-disorders → personality-disorders、autoimmune-diseases → monoclonal-antibodies、hypothalamus-pituitary → thyroid-parathyroid、sex-hormones；之後改寫到那段時再加
4. 標點規則補一條：括號內只有 `[[slug]]`(畫面顯示中文標題)也算中文，用全形；收尾 A 時被轉成半形的 214 處已改回
5. 連結 3,927 → 3,984；build 通過，normalize-punctuation 0 處
