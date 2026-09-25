# 知識庫內容

每個 `.md` 檔是一篇知識頁,網址是 `/learn/<檔名>`。資料夾決定分類:

| 資料夾 | 分類 |
|---|---|
| `disease/` | 疾病 |
| `physiology/` | 生理機轉 |
| `drug/` | 藥物(以藥物類別為單位) |
| `lab/` | 檢驗 |

改完內容後執行 `pnpm knowledge:build`(`pnpm dev` / `pnpm build` 會自動執行)。
壞連結、重複 id、嵌入循環、缺圖片出處都會讓建置失敗並列出位置。

## Frontmatter

```yaml
---
title: SGLT2 抑制劑
subtitle: SGLT2 inhibitors(-gliflozin)
aliases: [SGLT2i, Empagliflozin, Dapagliflozin]
dzTags: [糖尿病]          # 題庫的 dz: 標籤;疾病頁會反向連到這篇
reviewed: false           # 審閱後改 true,頁面上的「草稿」標記就會消失
updated: 2026-09-25
references:
  - title: 中華民國糖尿病學會《糖尿病臨床照護指引》
    url: https://www.endo-dm.org.tw/
---
```

## 階層與知識點

- 內文從 `##` 開始(`#` 保留給頁面標題),最多到 `#####`。
- 顯示編號自動產生:`##` 一、 → `###` (一) → `####` 1. → `#####` (1)。
- **每個標題都要有 id**:`## 機轉 {#mechanism}`。id 只能用小寫英數與 `-`,
  它就是網址錨點(`/learn/sglt2i#mechanism`),發布後不要再改,否則別頁的連結會斷。
- 不可跳級(`##` 下面直接 `####`)。

## 連結與嵌入

| 語法 | 效果 |
|---|---|
| `[[sglt2i]]` | 連到整頁,連結文字自動用頁面標題 |
| `[[sglt2i#mechanism]]` | 連到段落,文字自動用段落標題 |
| `[[sglt2i#mechanism\|作用機轉]]` | 自訂連結文字(在表格內 `\|` 不用跳脫,建置時會先處理) |
| `![[sglt2i#summary]]` | **嵌入**:獨立一行。顯示來源段落的內容(含子段落),左側藍線、右上角是全站引用次數。內容只存在來源頁,改一處全站同步 |

藥物頁的 `## 重點摘要 {#summary}` 是給疾病頁嵌入用的,請保持精簡。

## 相關考題

```
::questions{tag="糖尿病酮酸中毒|DKA" keyword="酮酸|Kussmaul" limit="6"}
::questions{ids="113-1_BM_038,110-2_BM_051"}
```

- `tag`:題庫 dz 標籤,`|` 分隔表示「任一」。
- `keyword`:比對題幹與選項的正規表示式(不分大小寫)。與 `tag` 同時寫時兩者都要符合。
- `ids`:直接指定題號。
- 放好之後執行 `database/.venv/bin/python database/scripts/resolve_knowledge_questions.py`
  查一次資料庫,結果寫進 `src/data/knowledge/question-map.json`。
  該檔每個欄位的 `pinned`(手動加入)與 `excluded`(手動排除)重跑時不會被覆蓋。

## 提示框

```
:::exam[國考重點]
RI 與 NPH 混合時「先抽清、後抽濁」。
:::
```

種類:`tip`(小技巧)、`exam`(國考重點)、`warning`(注意/禁忌)、`note`(補充)。

## 圖片

放在 `public/knowledge-images/`,並在 `public/knowledge-images/credits.json` 登記出處:

```json
{
  "sglt2-mechanism.svg": {
    "title": "SGLT2 抑制劑作用位置",
    "author": "多保命",
    "license": "原創",
    "sourceUrl": "",
    "modified": ""
  }
}
```

只接受 Public Domain、CC0、CC BY 或原創圖。**不要用 OpenStax 的圖**(CC BY-NC-SA,會讓整頁受限)。

## 授權原則

`相關資源/` 的 OpenStax 教科書是 CC BY-NC-SA 4.0,只能當參考:用自己的話重新組織,
不要逐段翻譯。每頁在 `references` 列出依據的指引與教科書。
