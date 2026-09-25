# 線上模擬考模組（搬移說明）

模擬考目前放在 rnhighpass-quiz 裡（網址 `/mock-exam`），設計成可以整包搬到獨立網站。

## 兩個網站

| 網站 | 內容 | 資料來源 | 部署指令 |
|---|---|---|---|
| exam.rnhighpass.com | 只有模擬考（`SITE_MODE=mock`） | `src/data/mock-exam/` 的 JSON，**不連 Supabase** | `pnpm cf:deploy:exam` |
| quiz.rnhighpass.com | 完整測驗網站（之後上線，本身也含模擬考） | Supabase | `pnpm cf:deploy` |

`SITE_MODE=mock` 時：`src/proxy.ts` 把 `/mock-exam` 以外的路徑全部導回模擬考、`(site)/layout.tsx` 直接 404、頁首的連結改成回多保命主站。

### 題庫更新後
1. `cd database && .venv/bin/python scripts/export_mock_papers.py`（重新匯出 115-2 / 115-1 / 114-3 並同步圖片）
2. `pnpm cf:deploy:exam`

### 之後上線完整站要做的事
1. `pnpm cf:deploy`（不帶 SITE_MODE），在 Cloudflare 綁 quiz.rnhighpass.com
2. Supabase → Authentication → URL Configuration 加入該網域（Site URL 與 `/auth/callback`），Google OAuth 也要加
3. 完整站若要顯示題目附圖，把 `~/Downloads/多保命護理分章/images/*.png` 複製回 `public/exam-images/`
4. 模擬考併回 quiz 站後，exam 子網域可以關掉或轉址

## 流程

`/mock-exam`（模擬身分證登入，畫面鍵盤）→ `/mock-exam/select`（選梯次與科目）→
`/mock-exam/[paper]/[group]`：確認應考資訊 → 顯示成績選項 → 考前等候（2 分鐘）→ 作答 → 本節考試結束 → 成績

- 登入只驗格式（1 個英文字母＋9 碼數字），sessionStorage 只存 `mock-exam:login = "1"`，**不保存身分證號**。
- `(authed)/` 底下的頁面由 `LoginGate` 擋住，未登入導回 `/mock-exam?next=…`。

## 要複製的檔案

| 路徑 | 內容 |
|---|---|
| `src/app/(exam)/mock-exam/` | 登入頁、`(authed)/` 選卷頁與作答頁、模擬考外框（無主站導覽列） |
| `src/components/mock-exam/` | 作答介面元件 |
| `src/lib/mock-exam/` | 資料讀取、計分、作答保存（localStorage）、科目名稱 |
| `src/data/mock-exam/` | 打包的考卷 JSON（由 `database/scripts/export_mock_papers.py` 產生） |
| `public/exam-images/` | 考卷掃描圖（來源：`多保命護理分章/images/*.png`） |
| `database/migrations/0007_exam_papers_view.sql` | 考卷清單 view（同一個 Supabase 就不用重跑） |

## 對主站的依賴（新網站要一起帶過去或重寫）

- `src/lib/quiz-utils.ts`：只用到 `parseAcceptedAnswers`、`isAnswerCorrect`、`shuffledOptionOrder`、`OPTION_KEYS`、`OptionKey`（純函式）
- `src/lib/types.ts`：`Question` 型別
- `src/lib/use-is-client.ts`：hydration 完成判斷
- `src/components/ui/PageLoader.tsx`、`src/components/ui/morphing-square.tsx`、`src/lib/utils.ts`：載入動畫（npm 套件 `motion`、`class-variance-authority`、`clsx`、`tailwind-merge`）
- `src/app/globals.css`：色彩 token（`bg-deep`、`text-muted`、`rounded-card` 等）
- 根 `src/app/layout.tsx`（`<html>/<body>`、字型）

不需要登入、auth、`user_answers`。模擬考唯一連出去的地方是頁首的「回主畫面」，目的地在 `src/lib/mock-exam/labels.ts` 的 `SITE_HOME`，搬移時改那一行即可（設為 `null` 會隱藏按鈕）。

## 環境變數

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 搬到獨立網站時

- 首頁 `/` 可以直接 redirect 到 `/mock-exam`，或把 `(exam)/mock-exam` 內容改放到根目錄。
- 題庫圖片有新增時，記得重新複製 `public/exam-images/`。
