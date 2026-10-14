# 第 2 輪（精神收尾）來源包與製作計畫

> 狀態：2026-10-06 使用者核准；本機 session 製作。計畫檔：`~/.claude/plans/idempotent-scribbling-starfish.md`；進度以 [knowledge-progress.md](../knowledge-progress.md) 為準。
> 版權原則見 [knowledge-roadmap.md](../knowledge-roadmap.md)「版權優先與 UpToDate 使用原則」。

## 一、範圍與 100% 的定義

- **15 章做到 100%**：精神 Ch01–Ch13、社區 Ch11 社區心理衛生、兒科 Ch17 兒童青少年發展與心理社會健康問題(2026-10-06 約 580 題未涵蓋)
- 其他科目的精神相關題目(藥理 Ch03 鎮靜安眠與中樞興奮劑、社區 Ch08 失智、內外阿茲海默)跟著新頁一起收，不保證 100%
- 每個題號要出現在某頁的 `::questions{ids=}` 或被自動配對收錄；例外只有答案鍵可疑的題目，寫進 progress 檔「例外清單」
- 使用者說「下一輪」才做下一組，**一次做一組**；每寫完一篇就更新 progress 檔

## 二、頁面規劃（25 篇新頁、A–H 八組）

| 組 | 類型 | slug | 重點 |
|---|---|---|---|
| A | 護理 | psychodynamic-theories | 精神分析、心性發展、Erikson、Sullivan、Peplau、客體關係、防衛機轉、生物心理社會模式 |
| A | 護理 | individual-cognitive-behavioral-therapy | 個別心理治療、行為治療、認知治療、理情與現實治療、系統減敏感、代幣制度、肯定訓練 |
| A | 護理 | group-family-therapy | 家庭系統與結構治療、團體治療性因素、成員角色、心理演劇、懷舊團體 |
| A | 護理 | milieu-therapy | 環境治療、治療性氣氛、態度治療、活動、職能、娛樂治療 |
| B | 疾病 | anxiety-disorders | 焦慮程度、恐慌、畏懼、廣泛性焦慮、分離焦慮 |
| B | 疾病 | obsessive-compulsive-disorder | 症狀、原始與附帶收穫、護理 |
| B | 疾病 | trauma-stress-disorders | PTSD、急性壓力症、適應障礙 |
| B | 疾病 | somatic-dissociative-disorders | 身體症狀、轉化症、疾病焦慮、解離 |
| B | 藥物 | anxiolytics-hypnotics | BZD、Z-drugs、buspirone、flumazenil、褪黑激素類、BZD 戒斷 |
| C | 疾病 | autism-spectrum-disorder | 診斷、篩檢、早療、護理 |
| C | 疾病 | intellectual-disability | 分級、病因、教育與照護 |
| C | 疾病 | adhd | 診斷、處置、行為與藥物治療 |
| C | 藥物 | cns-stimulants | methylphenidate、atomoxetine、amphetamine、咖啡因、modafinil |
| C | 疾病 | eating-disorders | 厭食、暴食、再餵食症候群 |
| C | 護理 | child-adolescent-mental-health | 概論與護理原則、學習與閱讀障礙、遺尿遺糞、妥瑞、行為規範、兒青憂鬱、校園霸凌、早療 |
| D | 疾病 | dementia | 阿茲海默、血管性、路易氏體、額顳葉、BPSD、失智政策、老年精神健康；用藥連結藥物頁 |
| D | 藥物 | anti-dementia-drugs | AChEI、memantine、BPSD 用藥注意、健保規定 |
| D | 疾病 | delirium | 與失智、憂鬱的鑑別、CAM、預防與處置 |
| E | 疾病 | substance-use-disorders | 總論、毒品分級、各類物質中毒與戒斷、減害、復健 |
| E | 疾病 | alcohol-use-disorder | 戒斷時間軸、震顫性譫妄、Wernicke–Korsakoff |
| E | 藥物 | addiction-treatment-drugs | disulfiram、naltrexone、acamprosate、美沙冬與丁基原啡因、尼古丁替代與 varenicline |
| F | 疾病 | personality-disorders | A、B、C 群，邊緣型的分裂與操縱、設限 |
| F | 護理 | family-violence | 家暴、兒虐、老人虐待、性侵；通報與法規、身體表徵 |
| G | 護理 | community-mental-health | 三級預防、社區心衛發展、心理健康促進、關懷訪視、社會安全網、個案管理、復元與賦能 |
| G | 護理 | psychiatric-nursing-foundations | 發展史、台灣精神醫療體系、護理人員角色功能、精神科急診與居家護理 |
| H | — | 不開新頁 | 把剩餘題目補進既有頁；重複的藥理細節改成連結 |

> 既有相關頁：`disease/schizophrenia`(含 #communication、#violence、#restraint、#law)、`depressive-disorder`、`bipolar-disorder`、`drug/antipsychotics`、`antidepressants`、`mood-stabilizers`、`lab/lithium-level`、`physiology/neurotransmitters-psychiatry`、`drug/opioids`、`care/end-of-life-care`

### 藥物內容放哪裡

- 機轉、劑量、副作用、交互作用、護理指導**只寫在藥物頁**；藥物頁 `chapters` 以藥理 Ch03 為主，藥物題優先放藥物頁的 `::questions`
- 疾病頁與 Ch06 治療方法頁只寫「什麼情況用哪一類藥」1–3 點，加 `[[藥物頁#錨點]]` 連結；需要比較表時用 `![[藥物頁#錨點]]` 嵌入

## 三、來源授權與使用方式

`相關資源/精神科相關` 的 UpToDate 匯出檔(38 篇)只涵蓋思覺失調與情緒障礙；本輪其他主題**不請使用者匯出新的 UpToDate**。

| 來源 | 授權 | 使用方式 |
|---|---|---|
| UpToDate 匯出檔(精神科相關 38 篇) | 付費訂閱，有版權 | 只參考；用自己的話與結構重寫；引用標注篇名 |
| 精神衛生法、家庭暴力防治法、兒少權益保障法、老人福利法、毒品危害防制條例 | 全國法規資料庫，公開 | 可引用條文與數字；標注法規名稱與條號 |
| 失智症防治照護政策綱領 2.0、衛福部心理健康司(關懷訪視、社會安全網、心衛中心、自殺防治)、國健署兒童發展篩檢與早療 | 政府公開資料 | 可引用數字；當行標注網址 |
| NICE 指引(GAD/panic CG113、OCD CG31、PTSD NG116、dementia NG97、delirium CG103、alcohol CG115/CG100、eating disorders NG69、ADHD NG87、autism CG128/CG170、BPD CG78、antisocial CG77) | 公開，有版權 | 只參考；用自己的話寫 |
| WHO mhGAP、APA 實務指引 | 公開，有版權 | 只參考 |
| DSM-5-TR 診斷準則 | 有版權 | 不逐條抄；只摘要核心概念 |
| PubMed／PMC 開放全文綜論 | 依各篇授權 | 只參考；DOI 被擋時改用 PMC 網址 |
| StatPearls（NCBI Bookshelf） | CC BY-NC-ND 4.0 | 只參考，補充缺口；不貼原文 |
| OpenStax Psychiatric-Mental Health Nursing、Pharmacology | CC BY-NC-SA 4.0 | 只參考；不用其圖；不逐段翻譯 |
| 國考書(精神科護理、兒科護理學)、題庫 AI 詳解 | 書籍有版權；詳解為 AI 生成 | 只用來判斷考點與核對；不貼原文 |

## 四、題號取得

- 取自 `多保命護理分章/subject mappings/章節架構/<科>/Ch*_mapping_*.md`(JSON，每小節的題號清單)：精神 Ch01–13、社區 Ch11、兒科 Ch17、藥理 Ch03
- 跨科題目用題庫解析腳本(scratchpad 的 `parse_books.py`；若被清掉，照 `05_chaptered_books` 的 ID:、ques:、ans:、sol:、tag:、xchap: 格式重寫)
- `::questions{ids=}` 不走 resolver，用 DB `questions.id` 驗證題號存在

## 五、高風險數字(必須有權威來源，否則標待核對)

BZD 等效劑量與減量、酒精戒斷時間軸與 CIWA-Ar 切點、Wernicke 的 thiamine 劑量、AChEI 適應症與副作用、厭食症再餵食的電解質監測、methylphenidate 劑量與年齡、家暴與兒虐通報時限。

## 六、沒有 UpToDate 支持的主題(日後抽查)

本輪除思覺失調、情緒障礙外，其餘主題皆無 UpToDate 匯出檔，每頁完成後把「只靠二手來源」的項目登記在 progress 檔，整輪結束彙整成「需確認清單」。
