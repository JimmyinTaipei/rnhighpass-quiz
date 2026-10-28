# 動態效果體檢(2026-10-28)

只做評估，沒有改程式碼。用到的 skill：improve-animations(AUDIT 八類規則)、find-animation-opportunities(頻率／目的／速度／功能四道關卡)、apple-design(對稱路徑、可中斷、拖曳關閉)、taste-motion。

效果示範：動態效果庫 https://claude.ai/artifact/LEJ6HbFWRuJ8Yr2djVRsS7

## 現況

- 動畫工具：`motion`(只有 `KnowledgePanel.tsx` 在用)、Tailwind 的 `transition-*`、`globals.css` 幾組 keyframes
- 沒有共用的曲線與時長 token，各處各寫(150ms、200ms、220ms、300ms，ease-out／ease／spring)
- 整體風格偏 iOS(按下變淡、彈簧面板)，方向是對的，問題集中在「**出現有、消失沒有**」與「**疊在畫面上的東西都是瞬間開關**」

## 問題清單(依影響排序)

| # | 位置 | 現在 | 目的 | 頻率 | 建議 |
|---|---|---|---|---|---|
| A1 | 8 個彈出層：`ChapterQuizRunner.tsx` 的 `Sheet`(作答設定、作答情形、交卷、離開)、`mock-exam/ConfirmDialog.tsx`、`ArticleShell.tsx:209`(手機目錄)、`FilterSheet.tsx:42`(手機分類)、`TableModalLink.tsx:76`(比較表)、`ReportButton.tsx:54`(回報)、`ZoomableFigureImage.tsx:151`(圖片放大) | `{open && …}` 條件渲染，開和關都是瞬間 | 避免突兀、空間一致 | 偶爾 | 做一個共用的 `Overlay` 元件(用已安裝的 motion 的 `AnimatePresence`)。手機底部面板：進 `translateY(100%)→0` 300ms、出 200ms，曲線 `cubic-bezier(0.32, 0.72, 0, 1)`；置中對話框：`opacity 0 + scale(0.96)→1` 200ms、出 150ms，曲線 `cubic-bezier(0.23, 1, 0.32, 1)`；背景暗幕 opacity 200ms。減少動態時只淡入淡出 150ms |
| A2 | `KnowledgePanel.tsx:67-76` | 打開有彈簧，關閉瞬間消失(`router.back()` 直接卸載)；抓取條拉不動 | 空間一致(怎麼來就怎麼走) | 偶爾 | 關閉時先播退場(手機 `y: 100%`、電腦 `x: 100%`，200ms 抽屜曲線)再 `router.back()`；手機可往下拉關閉：跟手 1:1，放開時位移 > 30% 高度或速度 > 0.11 px/ms 就關，否則彈回(spring bounce 0.2) |
| A3 | `SubjectSwitcher.tsx:66`(科目切換)、`EmbedBadge.tsx:39`(被引用小選單) | 瞬間出現 | 空間一致 | 偶爾 | 從按鈕位置展開：`transform-origin: top`、`opacity 0 + scale(0.95)→1` 150ms、出 100ms，`cubic-bezier(0.23, 1, 0.32, 1)` |
| A4 | `FavoriteButton.tsx:45` 的提示文字 | 瞬間出現、2 秒後瞬間消失 | 回饋 | 偶爾 | 淡入＋往上 4px，進 150ms、出 150ms |
| A5 | `ChapterQuizRunner.tsx` 換題(`key` 換掉整張題卡) | 瞬間換掉 | 避免突兀、方向 | **很常用**(一次幾十到上百題) | 只做幾乎察覺不到的：點按鈕或滑動換題時 `opacity 0 + translateX(±8px)→0`，150ms；**鍵盤換題不動**。詳解出現時 opacity 0→1 150ms(不動高度) |
| A6 | `CollapsibleSection.tsx:68`、知識頁「相關考題」`<details>` | `hidden` 瞬間展開／收起 | 狀態變化 | 偶爾 | 展開時內容 opacity 0→1 150ms(不動高度，長段落動高度會卡)；收起維持瞬間 |
| A7 | `globals.css` `@media (prefers-reduced-motion: reduce)` 把主站所有 transition、animation 設成 0s | 減少動態 = 完全沒有回饋 | 無障礙 | — | 改成「保留淡入淡出、拿掉位移」：只對 transform 類動畫歸零，opacity／顏色保留 150ms |

### 小修(低)

- `globals.css` 的 `icon-pop` 從 `scale(0)` 起跳、放大到 1.2(=L3)：改 `scale(0.6)→1`、160ms、`cubic-bezier(0.23, 1, 0.32, 1)`
- `[data-ui="apple"] … :active { opacity: 0.6; transition: opacity 0s }`：按下立即變淡是對的，但放開時沒有淡回(元件上的 `transition-colors` 不含 opacity)，會「啪」一下回來。加一條放開時 opacity 200ms ease-out
- 作答頁進度條 `transition-[width]`：動寬度會觸發重排，改成 `transform: scaleX()`
- 共用 token：在 `globals.css` 加 `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`、`--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`、`--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`、`--dur-fast: 150ms`、`--dur-base: 200ms`、`--dur-panel: 300ms`，上面各項都用它們

## 考慮過但不建議

- **鍵盤換題(←→、Enter、1–4)加動畫**：鍵盤操作一天上百次，加動畫只會覺得慢。永遠不動
- **章節樹、側邊欄的展開收合加高度動畫**：導覽用、一天很多次，只保留現在的箭頭旋轉 150ms
- **模擬考(`/mock-exam`)加動畫**：仿考選部介面，正式考試畫面沒有動態，加了反而不像
- **答對時的慶祝效果(撒花、彈跳)**：每題都答，太頻繁；慶祝只留給「交卷完成」「錯題全部訂正完」這類少數時刻(見效果庫「打勾畫出來」)
- **首頁背景一直在動的雲、封面、海浪**：屬於「品牌氣氛」，已處理減少動態；是否改成播一次後停，留給使用者決定

## 結論

多保命需要的動態不多，問題很集中：**彈出層開關瞬間**(A1、A2)是「生硬」感的主要來源，做一個共用的 Overlay 元件就能一次解決 8 處，是最划算的一項。其次是 A7(減少動態時保留淡入淡出)和 A3–A4 的小選單、提示。換題(A5)要非常克制。

## 建議分批

| 批次 | 內容 | 改動 |
|---|---|---|
| 動態第 1 批 | 動態 token＋共用 Overlay(A1)＋知識面板退場與下拉關閉(A2)＋減少動態(A7) | 中 |
| 動態第 2 批 | 小選單(A3)、收藏提示(A4)、icon-pop、放開淡回、進度條 | 小 |
| 動態第 3 批 | 換題與詳解(A5)、段落展開(A6) | 小，但要實機確認手感 |

## 實作紀錄(2026-10-28)

三批都已完成，合成一個 commit(各批改到同幾個檔案)。

- 共用：`src/lib/motion.ts`(`overlayMotion(kind, reduce)`：scrim／sheet／dialog／fade／popover)、`src/lib/use-media-query.ts`；CSS token 在 `globals.css` 的 `--ease-*`、`--dur-*`
- A1：作答頁 `Sheet`(手機滑上來、桌機縮放淡入)、`ConfirmDialog`(加 `open` prop；模擬考照舊瞬間出現)、知識頁手機目錄、手機分類選單、比較表、回報錯誤、圖片放大(只淡入淡出)
- A2：知識面板關閉先播退場再 `router.back()`(用命令式 `animate()`，`onAnimationComplete` 會被提早觸發)；手機抓標題列往下拉可關閉，門檻：拉超過面板高度 30% 或放開速度 > 400 px/s(原訂 0.11 px/ms 太敏感，改用 Vaul 的 0.4 px/ms)；Esc 直接關
- A3：科目切換 `origin-top`、引用次數 `origin-top-right`，150ms 展開、100ms 收起
- A4：收藏提示淡入＋往上 4px
- A5：點按鈕、滑動、答對自動下一題時，新題從換題方向淡入 8px(150ms)；鍵盤換題(含鍵盤作答後的自動下一題)不動。詳解作答後淡入(`.fade-in`)
- A6：知識段落「點過之後」展開才淡入(頁面剛載入不整頁淡入)；相關考題 `<details>` 打開淡入
- A7：減少動態時只歸零 transform 類 transition 與 keyframes，`icon-pop`／`.fade-in` 改成純淡入，捲動隱藏的浮動按鈕只淡出
- 小修：`icon-pop` 改 scale(0.6)→1、160ms；按壓放開淡回 200ms(base 層＋`transition-colors` 補 opacity，暗幕 `inset-0` 排除)；進度條改 `scaleX`

需要實機確認：知識面板下拉關閉的手感、換題 8px 是否太明顯或太不明顯、按鈕放開淡回
