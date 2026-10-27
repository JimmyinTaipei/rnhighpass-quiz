# Worker 大小超限：改打包方式的計畫

> 2026-10-27 建立。狀態：**規劃中，尚未修改程式**(等使用者同意)

## 問題

- 16e 部署失敗：Cloudflare Worker 未壓縮上限 64 MiB，`.open-next/server-functions/default/handler.mjs` 約 59–61 MB
- 原因：知識庫資料用 `import` 打包進 Worker
   1. `src/data/knowledge/articles/*.json`(396 篇)23 MB，經 `loaders.ts` 的動態 import 載入
   2. `search.json` 5.4 MB(只有 `/learn` 搜尋用 `searchKnowledge`)
   3. `index.json` 3.4 MB(很多元件同步使用 `knowledgeIndex`，先不動)
- 線上目前是 16a 版本 **ed3095ba-3735-480f-abf9-4d11d6f9345e**(2026-10-27 03:08 UTC)

## 做法

### 第一階段：文章 JSON 移到靜態資產(主要效果)

1. `scripts/build-knowledge.mjs`：文章 JSON 改輸出到 `public/knowledge-data/articles/<slug>.json`；`loaders.ts` 改成只輸出 slug 清單(不再 import JSON)
2. `src/lib/knowledge/index.ts` 的 `loadArticle(slug)`(本來就是 async，呼叫端不用改)
   1. Cloudflare 上：`getCloudflareContext().env.ASSETS.fetch(...)` 讀檔
   2. 本機 `next dev`：直接用 fs 讀 `public/` 的檔案
   3. 讀不到 → 回傳 null(頁面顯示 404，不會整站壞掉)
3. 同一請求內快取，避免同頁重複讀
4. 預估 handler 從 ~60 MB 降到 ~37 MB

### 第二階段：搜尋索引也移出(小改動，一起做)

- `search.json` 同樣放到 `public/knowledge-data/`，`searchKnowledge` 改成 async，只有 `/learn/(browse)/page.tsx` 一處要加 `await`
- 預估再降 5 MB，handler 約 32 MB；之後每輪新增內容都不會讓 Worker 變大

### 不動的部分

- `index.json`、題目對照、taxonomy 等仍打包(用的地方多、檔案小)
- 網址、頁面內容、登入規則都不變

## 影響

- 內容與功能：使用者看到的一樣
- 速度：開文章多一次讀檔(第一次約 10–50 ms，有快取後幾 ms)；Worker 變小，冷啟動應該變快；**部署後實測**
- 公開性：知識頁本來就公開(只有「練相關題」要登入)，但 JSON 原始檔會有固定網址，比較容易被整批下載；如果在意，之後可改成只有 Worker 能讀的方式(R2 或 KV)
- 模擬考站(exam.rnhighpass.com)共用同一份程式：模擬考模式不使用知識頁，影響很小，但要另外確認

## 修改前的預防

1. **先提交目前的內容**：從上一個提交「第10~12輪前置作業」之後，有約 340 個檔案(第 10–16 輪的知識頁與資料)還沒提交；改程式前先提交，萬一要退回程式，內容不會一起不見(**要使用者同意才提交**)
2. **另開分支**做程式修改，主分支保持可部署的狀態
3. **記下線上版本** ed3095ba：部署後出問題可以用 `wrangler rollback ed3095ba-3735-480f-abf9-4d11d6f9345e` 退回
4. **先在本機測**：`next dev` 測 fs 讀取；`pnpm cf:preview`(wrangler dev)測 ASSETS 讀取，確認 handler 大小降下來再部署
5. **部署前確認硬碟可用空間 ≥ 10 GB**
6. **部署後檢查**
   1. 396 篇 `/learn/<slug>` 全部回 200(用腳本逐篇跑)
   2. 側邊面板 `/k/<slug>`、嵌入段落、搜尋、`/learn/<slug>/quiz` 登入導向
   3. 模擬考站首頁
   4. 實測幾篇的回應時間，和改前比較
7. 有任何一項失敗 → 立刻 rollback，再查原因

## 進度

| 步 | 內容 | 狀態 |
|---|---|---|
| 0 | 規劃(本檔) | ✅ 2026-10-27 |
| 1 | 提交目前內容、開分支 | ⬜ 等使用者同意 |
| 2 | 第一、二階段修改 | ⬜ |
| 3 | 本機與 wrangler dev 測試 | ⬜ |
| 4 | 部署、檢查、實測速度 | ⬜ |
