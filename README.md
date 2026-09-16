# rnhighpass-quiz

多保命 護理線上測驗平台 — 與主站 rnhighpass 完全獨立的專案。

## 對應網域
- 主站:rnhighpass.com(既有 repo,不受此專案影響)
- 本專案部署後對應:quiz.rnhighpass.com

## 技術棧
- Next.js(App Router + TypeScript + Tailwind)
- Supabase(資料庫 + Auth,Google 一鍵登入)
- Cloudflare Workers(透過 @opennextjs/cloudflare 部署)

## 本機開發
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## 尚待手動完成的設定(無法用腳本自動化的部分)
1. 到 Supabase 建立新專案,取得 URL / anon key,填入 .env.local
2. 在 Supabase Dashboard 啟用 Google OAuth provider,並在 Google Cloud
   Console 設定 OAuth 同意畫面與 Client ID
3. 在 Cloudflare Dashboard 建立新的 Workers/Pages 專案,連接此 repo 的
   GitHub 來源
4. 在 Cloudflare DNS 設定新增 quiz 子網域(CNAME 指向新專案),
   注意不要動到既有 rnhighpass.com 主站的 DNS 設定
5. 將 docs/ 資料夾放入「功能規格文件」與「design system」文件,
   作為後續開發與設計參考

## 資料夾說明
- \`src/lib/supabase.ts\`:Supabase client
- \`src/components/quiz\`:測驗相關元件
- \`src/components/notes\`:筆記/考點整理相關元件
- \`src/data\`:從既有分章題庫轉換後的 JSON 題庫資料
- \`src/styles/tokens.css\`:design system 色彩/間距 token
- \`docs\`:規格文件、design system 文件存放處
