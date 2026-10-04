<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 知識庫工作

做知識庫(content/knowledge/)相關工作前，先讀：

1. `docs/knowledge-progress.md`：目前輪次、進行中的篇、下一步、待使用者決定(暫停後從這裡接著做)
2. `docs/positioning.md`：定位、分類、寫作格式(分層列點)、各類型範本
3. `docs/knowledge-roadmap.md`：批次順序與資料需求
4. `content/knowledge/README.md`：語法與建置規則

每寫完一篇就更新 knowledge-progress.md。

## 寫作格式補充

- **句尾不加句號**：每一行最後的「。」都省略(列點、段落、方塊皆同)。一行內有兩句以上時，句間的「。」保留當分隔，但盡量拆成兩個列點。

## 版權與來源規則(雲端 session 與本機 session 都要遵守)

- 內容以不碰版權為第一優先。UpToDate、原文書、國考書都只當參考，**用自己的話與結構重寫**，不貼原文、不逐句翻譯、不重製原圖或整張表。引用標注不等於取得複製授權。
- 圖片只用公領域、CC0、CC BY。
- 事實在當行標注來源(篇名＋網址或書名頁碼)；數字、劑量、診斷切點至少一個權威來源，沒有就標「待核對」，不要用印象補。
- 使用者**不再自己去搜尋 UpToDate**：每輪結束只列「需確認清單」(最多約 5 項)。
- `相關資源/`(UpToDate 匯出與書籍 PDF)只在使用者本機，不放進 repo。UpToDate 匯出檔含形似字元的防複製記號，若在頁面裡發現西里爾、亞美尼亞或與拉丁字母混用的希臘字元，就是貼上的痕跡，要改寫。
- 存檔前跑 `python3 scripts/source-scan.py`(結果在 `docs/uptodate-scan.md`)。
- 詳細原則見 `docs/knowledge-roadmap.md`「版權優先與 UpToDate 使用原則」。

