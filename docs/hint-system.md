# Hint 操作提示

> ✅ 2026-11-01：共用元件與知識頁首批套用完成，依使用者指示將本輪未暫緩的驗收項目結案

## 用途與界線

- 提供控制項的短文字補充，例如操作效果、是否儲存；標籤本身仍應能讓人理解操作
- 重要錯誤、必須立即知道的資訊保留在畫面，不把所有說明都藏入提示
- Hint 不放連結或表單；需要互動的說明卡另用 popover／dialog
- 網站逐步教學先延後，未決定導覽步驟、觸發時機與完成紀錄，不在 Hint 內預先建立教學狀態
- 參考：[W3C Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)、[WCAG hover／focus 內容要求](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)、[Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)

## 首批套用

- 「小測驗」提示：登入時「選答後立即對答並記錄，答錯會納入錯題本」，未登入時「可練習，作答不會儲存」
- 「看答案」提示：「直接顯示答案與詳解，不新增作答紀錄」
- 移除兩個按鈕下方的常駐說明，各按鈕不論是否選中都能查看自己的提示
- 不改模式切換、答案顯示或作答紀錄行為；未在其他功能大量套用

## 元件介面與行為

- `src/components/ui/Hint.tsx`：`<Hint content="說明" onClick={...}>按鈕文字</Hint>`，接受標準 button props，內部管理 trigger ref
- 輸出按鈕與 portal，無額外包住按鈕的 DOM，因此保留現有 segmented control 直接子項樣式
- 桌面滑過 300ms 開啟，離開 150ms 後關閉；進入提示框取消關閉，沒有閱讀倒數
- 鍵盤聚焦立即開啟，失焦或 Esc 關閉；焦點停留在按鈕，提示本身不加入 Tab 順序
- 觸控點選同時執行原操作並顯示提示，再點同一按鈕可收起；不採第一次攔截、第二次才操作的方式
- 點外部、頁面或面板捲動、視窗 resize 關閉；提示本身捲動不會關閉
- `role="tooltip"` 與 `aria-describedby` 關聯說明，保留既有 `aria-pressed` 與其他描述
- 浮層預設在上方，空間不足改下方，依實際尺寸限制於視窗內；使用 portal 避免段落容器裁切，保留最近 `data-ui` 的主題 tokens
- 沒有入場動畫，沒有新增套件；目前介面只處理啟用狀態的按鈕，disabled 原生按鈕不保證能接收 hover／focus

## 驗收情境

- 桌面：兩個模式的 hover、移入提示、移出關閉、Esc；看答案未選中時仍能先看提示
- 鍵盤：Tab 聚焦看到提示，Enter／Space 仍切換模式，Esc 不移走焦點
- 手機：第一下切換模式且顯示提示，點外部／捲動關閉，沒有額外操作步驟
- 登入／未登入的小測驗說明正確，看答案不新增作答紀錄
- 窄螢幕、視窗上下邊界、文章側邊面板：提示換行且不被容器裁切
- 開啟提示後切換頁面／卸載元件不留下 timer 或事件監聽

首批套用已結案；其他 Hint 位置與網站教學保留為後續討論項目
