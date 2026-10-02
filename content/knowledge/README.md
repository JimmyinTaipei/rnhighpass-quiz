# 知識庫內容

每個 `.md` 檔是一篇知識頁,網址是 `/learn/<檔名>`。資料夾決定分類:

| 資料夾 | 頁面類型 |
|---|---|
| `disease/` | 疾病 |
| `physiology/` | 生理機轉 |
| `drug/` | 藥物(以藥物類別為單位) |
| `lab/` | 檢驗 |
| `care/` | 護理主題(不屬於單一疾病或藥物的護理內容) |
| `pathogen/` | 病原體(微生物、寄生蟲) |
| `admin/` | 護理行政(管理理論、人力、財務、品質、法規等概念與制度) |

新頁面請從 `_templates/` 複製對應範本開始(`_` 開頭的資料夾不會被建置)。

改完內容後執行 `pnpm knowledge:build`(`pnpm dev` / `pnpm build` 會自動執行)。
壞連結、重複 id、嵌入循環、缺圖片出處、分類 id 不存在都會讓建置失敗並列出位置。

## 在網頁上編輯(本機 dev mode)

在本機執行 `pnpm dev`(或 `node scripts/build-knowledge.mjs && next dev`)，以 admin 登入並開啟 dev mode 後，知識頁會出現：

- 頁首「編輯頁面標題」：改 frontmatter 的 `title`、`subtitle`。
- 每個段落標題旁的鉛筆：改標題文字，`{#id}` 會自動保留(別頁的連結不會斷)。
- 每個段落開頭「編輯內文」：改該段自己的 Markdown 原文(不含子段落)；不能在這裡新增標題。

儲存時會直接改寫 `content/knowledge/**/<slug>.md` 並重跑建置；建置失敗(壞連結、YAML 錯誤)會自動還原原檔並顯示錯誤。
正式站不會出現這些按鈕(`NODE_ENV` 不是 development 時 server action 一律拒絕)，改完記得用 git 提交 .md。

## 分類(system / alsoIn / group)

知識庫依器官系統分類,分類清單**只定義在 [`taxonomy.yml`](taxonomy.yml)**,頁面只能引用裡面的 id,
不可以自創——這是避免分類越長越亂(junk tag)的規則。

| 欄位 | 必填 | 說明 |
|---|---|---|
| `system` | ✓ | 主分類。器官系統(對應題庫十大 `block:`)、跨系統主題(精神、體液電解質酸鹼、感染),或分不出系統時用科目(基本護理、護理行政、社區衛生) |
| `alsoIn` | | 次分類。頁面也會出現在這些分類的清單,標「也見於」 |
| `group` | | 群組,必須屬於主分類、且類型與資料夾相符(例:`drug/` 的降血糖藥用 `antidiabetics`) |

怎麼選、以及分章題本各章對應到哪個分類,寫在 `taxonomy.yml` 開頭的註解。
現有分類放不下時,**先在 taxonomy.yml 新增**再使用。

## 章節對照(chapters)

`chapters` 列出這篇文章對到分章題本的哪些段落。章節頁會用它把段落連到知識頁，知識頁也會反過來顯示「出現在哪些章節」與題數。

```yaml
chapters:
  - 藥理-Ch10內分泌與新陳代謝藥物 > 糖尿病用藥
  - 內外-Ch08內分泌系統疾病 > 胰臟疾病與糖尿病
  - 產科-Ch10高危險妊娠之護理 > 妊娠前的內科疾病 > 糖尿病
```

| 規則 | 說明 |
|---|---|
| 寫法 | `章節全名 > H2`,章節全名是題本檔案的 `#` 標題 |
| 以 H2 為單位 | 只有「H2 ≥ 40 題且該 H3 ≥ 15 題」的 H3 可以單獨寫,其餘寫到它的 H2 |
| 不要重複 | 寫了 H2 就不要再寫它底下的 H3 |
| 不寫「綜合題型」 | 那是各章末尾的混合題,不是主題 |

段落清單與題數在 `src/data/knowledge/chapter-outline.json`,由 `database/scripts/export_chapter_outline.py` 從題本產生。題本的標題改過之後要重跑，再提交 JSON。寫錯的路徑會讓建置失敗，並提示該改成哪個 H2。

新文章可以先用 `database/scripts/suggest_chapter_refs.py --slug <slug>` 看建議。它依題目的 dz 或藥物標籤計算每個段落的命中題數,`--write` 只會補上還沒有 `chapters` 的文章。建議只是起點，寫入後請抽查。

改完 `chapters` 之後，執行 `database/.venv/bin/python database/scripts/export_knowledge_questions.py` 重算每篇的相關考題，並提交 `src/data/knowledge/article-questions.json`。知識頁上方的「N 題相關考題」「練相關題」、清單上的題數，以及題目詳解底下的「複習知識點」都來自這份檔案。

建置時會印出涵蓋率。一章的每個 H2 都有知識頁對到,才算「全部涵蓋」,詳細清單在 `src/data/knowledge/chapter-map.json` 的 `chapters.<章節>.missing`。

## Frontmatter

```yaml
---
title: SGLT2 抑制劑
subtitle: SGLT2 inhibitors(-gliflozin)
aliases: [SGLT2i, Empagliflozin, Dapagliflozin]
dzTags: [糖尿病]          # 題庫的 dz: 標籤;疾病頁會反向連到這篇
admTags: [X理論與Y理論]   # 只有 admin 類型頁用:題庫的 adm: 標籤(護理行政)
system: endocrine         # 主分類(taxonomy.yml 的 id)
alsoIn: [cardiovascular, renal]
group: antidiabetics
reviewed: false           # 審閱後改 true,頁面上的「草稿」標記就會消失
updated: 2026-09-25
references:
  - title: 中華民國糖尿病學會《糖尿病臨床照護指引》
    url: https://www.endo-dm.org.tw/
---
```

### 病原體索引(`pathogens`)

提到病原體的頁面(pathogen 頁,以及把病原寫在疾病頁的情況,例如結核菌寫在 `tuberculosis`)要登記病原體,
讓題目頁能用名稱比對出「相關病原體」並連到該段落:

```yaml
pathogens:
  - id: staphylococcus-aureus          # 必須是本頁某個標題的 {#id},全站唯一,發布後不要改
    name: 金黃色葡萄球菌
    names: [Staphylococcus aureus, S. aureus, 金黃葡萄球菌, MRSA]
```

- id 用學名小寫加 `-`。名稱(不分大小寫)全站唯一,重複時建置會失敗。
- 建置輸出 `src/data/knowledge/pathogen-index.json`(名稱 → `slug#id`)。

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
- `keyword`:比對題幹與選項的正規表示式(不分大小寫)。
- `drug`:題庫 drug 標籤,`|` 分隔表示「任一」。
- `adm`:題庫 adm 標籤(護理行政:理論、公式、制度),`|` 分隔表示「任一」。
- `group`:taxonomy.yml 的藥物群組 id,自動展開成該群組登記的所有 drug 標籤同義詞(推薦用這個,不用記同義詞)。
- 寫了多種規則時,全部都要符合。
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
