# 手機開發預覽與登入診斷（2026-11-01）

## 已重現的開發資源問題

使用者以同 Wi-Fi 的電腦區網 IP 開啟手機預覽，點登入沒有反應且沒有錯誤訊息

- Next.js 16.3.5 開發環境會限制 `_next` 資源的 Origin；原設定沒有允許電腦的區網 IP
- 實測對有效 JavaScript 資源帶 `Origin: http://192.168.0.24:3000` 請求，回應 **403**。這與「HTML 能讀但互動未啟動」相符；不是已完成手機瀏覽器登入實測的意思
- `next.config.ts` 開發時只允許本機目前網卡的私人 IPv4 精確位址，沒有使用整段私人網路萬用字元；正式建置不新增來源
- 使用 `pnpm dev` 後若 IP 改變，重新啟動即可重新偵測。目前本機伺服器已自動重啟載入設定
- 修改後重測：本機區網來源與 localhost 均可讀 JavaScript；不屬於本機的另一私人 IP 與外部來源仍回應 403

Next.js 規則見 [allowedDevOrigins 官方文件](https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins)

## 登入按鈕回饋

- 先前按鈕沒有處理 `signInWithOAuth` 的錯誤或例外，失敗看起來會完全沒反應
- 現在顯示「開啟登入中…」、暫停重複操作；例外、錯誤、沒有登入網址與 12 秒逾時都顯示可讀提示，並可重試
- OAuth 使用目前瀏覽器 origin 組合 `/auth/callback`，保留 `next` 路徑
- 先取得登入網址才由程式導航；逾時後即使先前請求晚回來，也不會自行跳頁
- 5 項程式處理情境已驗證：成功、回傳錯誤、拋出例外、缺少網址、逾時及晚回應；未使用真人帳號自動登入

## 仍需手機確認

1. 手機完整重新整理，必要時關閉舊分頁再從新的 Network 網址開啟
2. 點登入後應看到 Google 帳號選擇；若仍在原頁失敗，記下新顯示的錯誤
3. Google 登入完成應回到相同區網 origin，並顯示登入狀態
4. 若跳回 localhost／正式站或回到區網仍未登入，另查 Supabase Redirect URLs 與 cookie／PKCE；不能把已修復開發 JS 的 403 當成所有 OAuth 步驟都已通過

公開 Supabase OAuth 入口在本輪回應 302；未讀取或修改專案管理設定，不能據此認定區網 callback 已列在允許清單。回呼規則見 [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

## 選擇 Google 帳號後跳回 localhost

- 使用者確認 Safari 無法連線時的網址是 `localhost:3000` 或 `127.0.0.1:3000`；手機上的 localhost 是手機自己，並非開發電腦
- 程式送出的 callback 是目前網頁 origin 的 `/auth/callback`。Supabase Auth `/health` 回報 v2.197.0；該版本 [回呼驗證程式](https://github.com/supabase/auth/blob/v2.197.0/internal/utilities/request.go)會在非 Site URL 同源的情況下拒絕非迴路 IP，即使加入 Redirect URLs；未通過時會退回 Site URL
- 不更改專案的 Site URL。用本機 Bonjour 名稱 `macbook-air.local` 作開發網址，並在 Supabase Redirect URLs 額外加入 `http://macbook-air.local:3000/**`；萬用字元只涵蓋這個名稱與連接埠，可保留 callback 的 `next` 參數
- 使用者已確認手機可以開啟 `http://MacBook-Air.local:3000/learn/antivirals`；本機 Bonjour 查詢也解析至 Wi-Fi IP。`next.config.ts` 在 macOS 開發環境額外允許依作業系統主機名稱推導的 `.local` 名稱，來源請求測試 `.local`／IP 為 200，其他 `.local`／外部來源為 403
- Supabase Management API 使用現有憑證回應 401，CLI 也沒有可用管理登入，因此無法查詢或修改專案 Redirect URLs；**須由使用者在 Supabase Dashboard 手動加入上述項目，保留原有項目與 Site URL**
- Dashboard 儲存後，使用者應從 `.local` 網址重新啟動整個 Google 登入流程，不要改寫或轉貼包含授權碼的舊 localhost 網址。完成後驗證使用者身分與表格收藏；若出現新錯誤記下文字
- Mac 重新命名後 `.local` 名稱可能改變，開發伺服器重啟後要核對新名稱並更新 Supabase Redirect URLs；部分 Wi-Fi 可能阻擋 Bonjour，需另找可解析且已允許的開發主機名稱

## 0.0.0.0 轉址修正與最終手機測試單

使用者在選 Google 帳號後遇到 Safari「不允許使用受到限制的網路埠」，網址開頭為 `0.0.0.0:3000`

- 已重現：即使請求的 Host 是 `macbook-air.local:3000`，原 `/auth/callback` 仍因讀取 `request.url` 的 origin，回傳 `http://0.0.0.0:3000/...`
- 登入 callback 改為安全的站內相對 Location，保留瀏覽器的實際主機；成功、失敗兩條路徑皆不組入監聽位址
- Next.js proxy 要求絕對轉址，因此未登入題本／測驗頁及模擬考站的導向，在開發環境遇到 wildcard bind origin 時，會使用 Host 中驗證過的本機／區網／`.local` 名稱。正式請求保留原 origin，不信任任意外部 Host
- 回跳路徑另外排除控制字元，避免 URL 解析器把含 tab／換行的相對路徑轉成外站路徑
- 實際 HTTP 測試：`.local`、區網 IP 及 localhost 的 callback／未登入題本導向皆保留原主機。7 項自動測試涵蓋成功／失敗交換、相對轉址、外站路徑拒絕、cookie 保留與 proxy 主機處理，並通過型別／ESLint
- 使用者已加入 Supabase `.local` Redirect URLs；管理 API 仍無法代讀，完整手機 OAuth 需按以下步驟驗收

### 測試前

1. Mac 與手機連同一個 Wi-Fi，Mac 保持喚醒，開發終端機持續執行
2. 本機伺服器目前已在 3000 埠執行；網頁可打開就不必再啟動另一份。若已關閉，在 `rnhighpass-quiz` 內執行 `pnpm dev`，確認沒有因埠被占用而改成 3001
3. 保留 Supabase 新加入的 `http://macbook-air.local:3000/**`，本次不需要再改 Site URL

### 逐步操作與預期結果

1. 關閉 Safari 先前顯示 `localhost` 或 `0.0.0.0` 錯誤的分頁，另開一般分頁
2. 完整輸入 `http://macbook-air.local:3000/learn/antivirals`，注意 `http`、冒號 `:` 與 `3000`
   - 預期：能看到「抗病毒藥物」知識頁
3. 點頁面右上角「登入」
   - 預期：先看到「開啟登入中…」，接著進 Google 帳號選擇。若已登入而沒有按鈕，先到「我的」確認帳號即可，不必為了測試登出
4. 選自己的 Google 帳號，依畫面完成同意或驗證
   - 預期：返回 `macbook-air.local:3000` 的站內頁面。頁面路徑可以是首頁；不能再導到 `localhost` 或 `0.0.0.0`
5. 點底部「我的」
   - 預期：顯示自己的帳號資料，登入按鈕消失
6. 再開 `http://macbook-air.local:3000/learn/antivirals`，點一張表格右上角空心星號
   - 預期：星號變黃色實心。等儲存完成後重新整理，星號仍為黃色
7. 開 `http://macbook-air.local:3000/mistakes?tab=tables`
   - 預期：「我的題本 › 表格」列出剛才的表格，不會被送回登入頁

### 若沒有符合預期

- 告知停在上述第幾步、畫面錯誤文字、網址的主機及路徑即可
- 不要貼上 `?` 或 `#` 後面的授權碼、token 等登入參數
- 不要把舊的 Google 返回網址手動改主機後再開；從知識頁的登入按鈕重新開始，讓新流程使用同一組 cookie 與授權狀態

## 使用者手機驗收結果（2026-11-01）

- 使用者確認以 `.local` 進入網站時已是登入狀態，不需再次輸入 Google 帳號；先前的 session 已保留，錯誤在後續轉址而非一定未登入
- 手機能以已登入狀態正常進站已獲使用者確認；不擴大解讀為重新登出後的全新 Google 登入、收藏寫入或所有手機情境均已驗收
