# 第 8–12 輪計畫(本週：8 基護 A → 9 腎與體液 → 10 基護 B；額度夠再做 11 消化、12 血液)(2026-10-20)

## Context

第 7 輪社區 A 已完成並部署(全部 5906/8960，66%)。基護只有 47%(748/1578)，是第 8、10 輪的主體；第 9 輪腎與體液、第 11 輪消化、第 12 輪血液接在後面。使用者希望本週完成 8–10，額度夠再推進 11、12。

使用者決定(2026-10-20)：
1. 基護課本：已放 `相關資源/國考書（最終參考用）/基本護理學上冊.pdf`(552 頁)、`下冊.pdf`(593 頁)。**沒有文字層**，照第 7 輪用 Vision OCR(重寫 `ocr.swift` 到本 session scratchpad `r8/`；PDF 頁 ≠ 書頁)；技術步驟以這套課本為準，OpenStax Clinical Nursing Skills 只參考，美式做法不同時並列
2. 技術參考另有 `相關資源/國考書（最終參考用）/內外科護理技術.pdf`(477 頁，也沒有文字層，一起 OCR)：**台灣書籍，只當參考**，不複製步驟文字、不重製表與圖；用在第 8 輪注射與輸液、第 9 輪透析、第 10 輪導尿灌腸管灌、第 11 輪造口與腹部技術的做法核對
3. **每一輪開新對話**：計畫寫在本檔(repo 內)，每輪新對話讀本檔對應的輪
4. 標籤合併另帶：**第 8 輪肌骨皮膚、第 10 輪產兒**；第 9 輪腎泌尿、第 11 輪消化(加泌尿生殖，tag-merge-round5.md 第六節)；第 12 輪血液已在第 7 輪合併，只處理新發現的

## 使用方式(每輪一個新對話)

1. 新對話開工：讀 `knowledge-progress.md`「目前輪次」→ 本檔對應的輪 → 路線圖「跨輪移交清單」
2. 每輪收尾：本檔該輪標題加「✅ 完成 YYYY-MM-DD」；`knowledge-progress.md` 換到下一輪並建該輪步驟表；路線圖狀態欄打勾
3. 範圍有變(題目移到別輪、頁面拆併)：直接改本檔後面的輪，不另寫新計畫檔
4. 原始計畫檔：`~/.claude/plans/plan-8-8-10-witty-tarjan.md`(2026-10-20 核准；以本檔為準)

## 共通規則(每輪都一樣，不再逐輪重寫)

- 每輪：X-0a 標籤合併 → X-0b 來源包 `docs/sources/<批次>.md`(含新舊說法表) → X-0c taxonomy groups 與圖片盤點 → A… 頁面組 → 收尾組
- 收尾組固定順序：回補連結 → 縮寫英文全名 → 跨輪移交清單打勾＋新增列 → 需確認清單 → build → `knowledge_coverage.py`、`source-scan.py`、`image-license-review.py` → **`sync_all.py` 寫回 Supabase(含標籤)、刪除來源已不存在的 question_tags、清 taxonomy 舊別名** → 重跑 build、resolver(`database/.venv/bin/python`)、export → **部署 workers.dev(NODE_OPTIONS 8192)** → 關掉自己開的 next dev
- 寫作：分層列點(第二層 `1.` 縮排 3 格)、只有 `## 重點摘要 {#summary}`＋`### 國考常考點`、句尾不加句號、全形冒號逗號、縮寫第一次寫英文全名、來源當行標注、國考舊考點保留並標注新指引、數字至少一個權威來源否則標「待核對」
- procedure 頁的步驟用表格(步驟｜做法｜原理)，原理欄是國考重點；技術數值(角度、針號、高度、時間)以課本＋國考答案為準，醫學中心衛教單張與 OpenStax 不同時並列
- 每寫完一篇更新 `docs/knowledge-progress.md`；組數不拉長，額度夠可連做兩組

## 本週排程

| 順序 | 輪 | 未涵蓋(約) | 新頁(約) | 本週 |
|---|---|---:|---:|---|
| 1 | 8 基護 A | 260 | 9 | 必做 |
| 2 | 9 腎與體液＋透析／CRRT | 290 | 10 | 必做 |
| 3 | 10 基護 B(拆 10a、10b) | 620 | 16 | 必做 |
| 4 | 11 消化 | 375 | 11 | 額度夠 |
| 5 | 12 血液 | 140(含移交) | 5 | 額度夠 |

---

## 第 8 輪 基護 A(給藥、體溫脈搏血壓、體液供給) ✅ 2026-10-20 完成

範圍(未涵蓋)：基護 Ch13 給藥 116(給藥醫囑與原則 57、給藥途徑 41、藥物概述 11、系統與管理 5)、Ch10 體溫 32、脈搏 22、血壓 10、綜合 11、Ch14 體液供給 65(護理過程 57)＋Ch02 醫療環境控制 18(RACE 移交)

開工方式(使用者 2026-10-20)：第 8 輪的新對話先把 **8-0a、8-0b、8-0c 一次做完**再回報

跨輪移交：安全環境(火災 RACE、用氧安全，113-2_FA_004；連 `oxygen-therapy#precautions`、`admin/hospital-safety-environment`)

| 步 | 內容 |
|---|---|
| 8-0a | 標籤合併：基護 Ch10、13、14 ＋ **肌骨皮膚**(內外 Ch12、16，生解 Ch02–04，病理 Ch17，兒科 Ch14；例：骨折各類、壓力性損傷／褥瘡、骨質疏鬆)；`docs/tag-merge-round8.md` |
| 8-0b | OCR 基護上下冊與內外科護理技術的目錄(建 PDF 頁↔書頁對照表，後面幾輪共用)＋本輪章節；來源包 `sources/fundamentals-a.md`：課本頁碼、醫院給藥安全(病人安全目標、高警訊藥物、ISMP)、TFDA 用藥安全、醫學中心注射與輸液衛教單張、靜脈注射外滲處理；新舊說法表(三讀五對 → 七對／十對、IM 部位背臀肌 → 腹臀肌、Z 字注射回抽與否、體溫計種類) |
| 8-0c | taxonomy：fundamentals domain 加 groups(給藥、生命徵象、體液與輸液、安全環境)；原創圖：注射角度、肌肉注射部位(腹臀肌、股外側肌、三角肌)、體溫調節迴路 |
| A | `procedure/medication-administration-principles`(醫囑類型與執行、給藥原則與核對、給藥時間縮寫、藥物管理與管制藥品、給藥錯誤與通報；藥物概述 11 題的藥動學部分寫一節，深入內容留第 17 輪藥理 Ch01；約 68 題) |
| B | `procedure/injections`(皮內、皮下、肌肉、靜脈注射：部位、針號、角度、Z 字、胰島素與 heparin 注射、皮膚試驗判讀；約 35 題)、`procedure/non-parenteral-medication`(口服、舌下、眼耳鼻、吸入、塞劑、外用；約 20 題) |
| C | `procedure/body-temperature`(8-0c 改成 procedure，才能和脈搏血壓放同一個 vital-signs 組；體溫調節、測量部位與正常值、發燒分期與熱型、低體溫、惡性高熱連 anesthetics；約 32 題)、`procedure/pulse-blood-pressure`(脈搏部位與特徵、心尖橈動脈脈差、血壓測量誤差表(壓脈帶寬度、手臂高度)、姿位性低血壓連 hypotension；約 32＋11 題) |
| D | `procedure/iv-therapy`(輸液種類與張力、靜脈部位選擇、滴速與劑量計算、輸液幫浦、併發症(浸潤、外滲、靜脈炎分級、空氣栓塞、循環負荷過量)、中心靜脈連第 15 輪；約 57 題)；~~`procedure/blood-transfusion`~~ **不另開**(2026-10-20 D 組：既有 `care/transfusion-reactions`「輸血護理與輸血反應」已涵蓋血品、核對、速度、溫度與反應，只把未收的 1 題補進去，iv-therapy 連過去) |
| E | 安全環境：`care/patient-safety-environment`(跌倒、約束、火災 RACE 與 PASS、用氧安全、輻射與化學；Ch02 約 18 題)；加收各組遺漏題 |
| F | 收尾(共通規則) |

目標：基護 Ch10、13、14 ≥ 95%，Ch02 ≥ 90%

---

## 第 9 輪 腎與體液＋透析／CRRT

範圍(未涵蓋)：內外 Ch10 119、Ch04 36、生解 Ch10 51、Ch11 29、病理 Ch14 22、兒科 Ch12 25、藥理 Ch07 9(2026-10-21 重跑：內外 Ch10 118、Ch04 25、生解 Ch11 19、藥理 Ch07 8，其餘相同)

跨輪移交：tag-merge-round5.md 第六節的腎與泌尿同義標籤

| 步 | 內容 |
|---|---|
| 9-0a | 標籤合併：腎泌尿＋體液電解質(例：急性腎衰竭／急性腎損傷、慢性腎衰竭／CKD、尿毒症、腎病症候群)；第 8 輪留下：尿路感染 vs 泌尿道感染、腎衰竭 vs 腎臟衰竭、電解質補充劑／電解質調節劑／電解質不平衡用藥(見 tag-merge-round8.md 第五節)；**2026-10-21 檢查補充**：尿滯留 vs 尿瀦留、壓力性 vs 應力性尿失禁、良性前列腺肥大／前列腺肥大／攝護腺肥大、尿路結石 vs 泌尿道結石(腎結石是部位，維持)；慢性腎衰竭、腎功能不全是否併入慢性腎臟病拿不準就列待決定 |
| 9-0b | 來源包 `sources/renal.md`：KDIGO 2024 CKD、KDIGO 2012 AKI(查是否有 2025–26 更新)、KDIGO 2021 腎絲球(另查 2021 後分疾病的新版，例如 IgA 腎病變)、腎臟醫學會衛教、健保透析與腹膜透析規定、ICU Book 5e 電解質與 CRRT 章、內外上下冊 OCR 對應章(確認沒有文字層，OCR Ch04、Ch10；工具在 `ocr/ocr.swift`、`pagemap.py`) |
| 9-0c | taxonomy renal groups；圖：Servier 腎臟與腎元、原創腎元功能分段、透析原理(擴散、超過濾) |
| A | `physiology/kidney-urinary-physiology`(解剖、腎元、過濾再吸收分泌、清除率、RAAS 連 blood-pressure-regulation、排尿反射；生解 Ch10)、`lab/renal-function-urinalysis`(BUN、Cr、eGFR、尿液分析、24 小時尿) |
| B | `physiology/fluid-electrolytes`(體液分布、滲透壓、鈉與水、鎂；鉀、鈣磷連既有 lab 頁；生解 Ch11、內外 Ch04；**低／高血鈉標籤已 100%，臨床連 diabetes-insipidus-siadh 不重寫**)、內外 Ch04 剩餘題補進 abg、potassium(**酸鹼剩餘題歸 abg**：生解 Ch11 酸鹼不平衡約 12、內外 Ch04 酸鹼平衡改變約 11、代謝性酸／鹼中毒標籤) |
| C | `disease/acute-kidney-injury`、`disease/chronic-kidney-disease`(分期、併發症、飲食、貧血與骨病連 bone-calcium-drugs、uacr) |
| D | `device/dialysis-crrt`(血液透析、廂管與動靜脈瘻管照護、腹膜透析、CRRT、透析不平衡症候群；腎移植寫一節，排斥與用藥連 immunosuppressants；收尾時把路線圖移交清單第 6 輪那列的 CRRT 改成已在本頁，第 15 輪只連過去) |
| E | `disease/glomerular-diseases`(腎炎與腎病症候群，含兒童)、`disease/pediatric-genitourinary`(VUR、尿道下裂、隱睪、Wilms 連 pediatric-cancers) |
| F | `disease/urologic-disorders`(結石、BPH、膀胱與前列腺癌與腎臟癌連 cancer、尿失禁分類與治療、泌尿手術與 TURP 照護；內外 Ch11 生殖剩餘題中屬泌尿的)；**和第 10 輪分界**：本頁只收疾病面，導尿、膀胱訓練、基護的尿滯留與尿失禁題留第 10 輪 urinary-elimination，兩頁互連(2026-10-21 檢查：E 組太重拆成 E、F) |
| G | 收尾 |

目標：內外 Ch04、Ch10，生解 Ch10–11，病理 Ch14，兒科 Ch12 ≥ 95%

---

## 第 10 輪 基護 B(拆兩半，各自收尾一次寫回) ✅ 2026-10-22 完成

範圍(未涵蓋)：Ch07 舒適 91、Ch15 排泄 90、Ch12 營養 80、Ch11 冷熱 72、Ch08 活動 50、Ch06 護理過程 47、Ch04 記錄 40、Ch03 觀察溝通 39、Ch01 緒論 32、Ch18 出入院 27、Ch16 繃帶 25、Ch02 環境(第 8 輪剩餘)、Ch09 睡眠 9

跨輪移交：營養評估、治療飲食、管灌與 TPN(維生素表不重寫，連 nutritional-disorders)；冷療組織傷害(112-1_FA_021)與燙傷 10 題(熱療安全，連 environmental-injury#heat-injury)

| 步 | 內容 |
|---|---|
| 10-0a | 標籤合併：基護其餘章＋**產兒**(產科全部、兒科 Ch01–05、16)；產兒標籤多，只合併真正同義，拿不準的列待決定；第 8 輪留下：安胎藥物 vs 安胎用藥(見 tag-merge-round8.md 第五節) |
| 10-0b | 來源包 `sources/fundamentals-b.md`(課本 Ch01–09、11–12、15–16、18 OCR；國健署飲食指南、營養師公會治療飲食、腸造口與導尿衛教單張、壓力性損傷 NPIAP 2019) |
| **10a** A | `procedure/hygiene-comfort-care`(口腔、床上沐浴、背部護理、會陰、頭髮)、`procedure/positioning-body-mechanics`(各臥位與用途、身體力學、移位) |
| 10a B | `care/activity-immobility`(制動併發症、ROM、輔具、步態訓練)、`disease/pressure-injury`(NPIAP 分級、Braden，連肌骨皮第 14 輪)、`care/sleep-rest` |
| 10a C | `procedure/heat-cold-therapy`(生理效應、適應症與禁忌、溫度範圍、冷療傷害與燙傷移交題) |
| 10a D | `care/nutrition-assessment-diets`(評估、BMI、治療飲食)、`procedure/enteral-parenteral-nutrition`(鼻胃管放置與確認、灌食、TPN)；10a 收尾＋寫回 |
| **10b** E | `procedure/bowel-elimination`(便秘、灌腸種類、腸造口照護)、`procedure/urinary-elimination`(導尿、留置尿管照護、膀胱訓練；連 urinary-tract-infection) |
| 10b F | `care/nursing-process`(評估、診斷 NANDA、目標 SMART、評值)、`care/documentation-orders`(記錄原則、SOAP／PIE／焦點記錄、醫囑；連 medical-records-consent) |
| 10b G | `care/observation-communication`(溝通技巧、治療性溝通，連 psychiatric-nursing-foundations)、`care/nursing-concepts-health`(護理理念、健康疾病模式、工作模式；連 nursing-care-models) |
| 10b H | `procedure/bandaging`(繃帶種類與包紮法)、`procedure/admission-discharge-specimens`(出入院、檢體收集剩餘) |
| 10b I | **基護掃尾**(2026-10-22 新增)：Ch05 感染控制剩 9 題補進 infection-control 等既有頁、Ch17 臨終剩 2 題補進既有臨終頁、各組留下的零星題與多章重複題；跑涵蓋報告確認基護 18 章全部 100%；10b 收尾＋寫回 |

目標：**基護每章 100%**(使用者 2026-10-22；原本 ≥ 90%)。每組收完負責小節的全部題，送分題、跨系統題也用 `::questions{ids}` 放進最接近的頁

2026-10-22 補充(依 2026-10-21 涵蓋報告，基護 1057/1578)：
- 未涵蓋：Ch07 83、Ch15 78、Ch12 68、Ch11 67、Ch08 49、Ch06 45、Ch03 37、Ch04 34、Ch01 30、Ch16 25、Ch18 21、Ch05 9、Ch09 9、Ch17 2(Ch02、10、13、14 已 100%)
- 10-0a 加併 `壓瘡`(12 題，全在基護)→ `壓力性損傷`(第 8 輪只併了壓傷)
- 基護相關未處理標籤分給頁面收：便秘 53、痔瘡 6(E)、尿滯留 16(E)、燙傷 10、扭傷 7(C)、創傷 8(H 或 I)

---

## 第 11 輪 消化(額度夠才做)

範圍(未涵蓋，2026-10-22 涵蓋報告)：內外 Ch07 127、生解 Ch09 101、兒科 Ch11 37、藥理 Ch06 32、病理 Ch12 27、Ch13 12(共 336)

跨輪移交：
1. 第 5 輪：肝硬化腹水護理與穿刺(edema-shock#cirrhosis-ascites)；幽門狹窄、唇顎裂、食道閉鎖照護(genetic-inheritance#multifactorial)
2. 第 9 輪：腸阻塞體液變化(106-2_MS_016)、肝硬化腹水護理(113-1_MS_007)，機轉連 fluid-electrolytes
3. 第 10 輪：傾倒症候群飲食、膽道閉鎖與兒童肝病飲食(連基護營養兩頁)；痔瘡病因與術後照護 5 題、瀉劑與止瀉劑藥理 6 題(題號見路線圖)，便秘與灌腸連 bowel-elimination

計畫檢查(2026-10-22)：
- 前列腺肥大同義詞已在 9-0a 合併、壞死性腸炎已在 10-0a 合併，tag-merge-round5.md 第六節只剩感染性腸炎等(第四節)；另帶一個沒做過的系統，建議**生殖**(男女生殖、乳房；含第 9 輪留下的睪丸腫瘤、男性生殖解剖)
- 既有頁只連不重寫：viral-hepatitis、liver-cancer、colorectal-cancer、infectious-diarrhea、helicobacter-pylori、bowel-elimination#stoma、enteral-parenteral-nutrition；胃癌、食道癌從 cancer#other-cancers 移到 upper-gi-disorders(cancer 頁改連結)
- 口腔與食道疾病(內外 Ch07 31 題只涵蓋 9、病理 Ch12 食道 12 題只涵蓋 2)原本沒有歸屬頁，併進 B 組 upper-gi-disorders

| 步 | 內容 |
|---|---|
| 11-0a | 標籤合併：消化同義標籤＋tag-merge-round5.md 第四節剩餘＋生殖系統；`docs/tag-merge-round11.md` |
| 11-0b | 來源包 `sources/digestive.md`(課本書頁、H. pylori 台灣共識、AASLD、消化醫學會；新舊說法表) |
| 11-0c | taxonomy digestive groups(生理、上消化道、下消化道、肝膽胰、兒科、檢驗與檢查)，既有 5 頁歸組；Servier 消化圖盤點 |
| A | `physiology/gi-anatomy-physiology`(口腔到大腸、消化酶與激素)、`physiology/liver-biliary-pancreas`(生解 Ch09 剩餘) |
| B | `disease/upper-gi-disorders`(口腔炎、食道弛緩不能、食道裂孔疝、GERD、消化性潰瘍、上消化道出血、胃癌、食道癌、胃手術後傾倒症候群)、`drug/gi-drugs`(PPI、H2、制酸、止吐、瀉劑、止瀉；含移交 6 題) |
| C | `disease/lower-gi-disorders`(IBD、吸收不良、腸阻塞(106-2_MS_016)、闌尾炎、疝氣、憩室、痔(移交 5 題))、腸造口連 bowel-elimination |
| D | `disease/liver-cirrhosis`(腹水與穿刺、食道靜脈曲張、肝性腦病變；移交 113-1_MS_007)、`disease/biliary-pancreatic`(膽結石、胰臟炎、胰臟癌) |
| E | `disease/pediatric-gi`(幽門狹窄、唇顎裂、食道閉鎖、巨結腸症、腸套疊、膽道閉鎖；移交；先天性 23 題只涵蓋 3，題多可單獨一組)、`lab/liver-function`、`lab/gi-diagnostic-procedures`(內視鏡、上消化道攝影、ERCP、肝切片、腹部穿刺；比照 urologic-diagnostic-procedures) |
| F | 掃尾＋收尾(共通規則) |

目標：6 章 100%

---

## 第 12 輪 血液(額度夠才做)

範圍(未涵蓋，2026-10-22 涵蓋報告)：內外 Ch14 23(75/98)、藥理 Ch09 22(60/82，抗血栓 14)、兒科 Ch10 14(31/45，凝血 8)、病理 Ch10 15(42/57)、生解 Ch07 血液小節 8(心臟、血管留第 15 輪)

跨輪移交：
1. 第 5 輪：海洋性貧血、血友病、類血友病、G6PD、鐮刀型與球形紅血球的治療護理；惡性貧血與 B12、葉酸缺乏(約 11 題)；出血疾病原因題(109-2_BM_044 等)；血友病關節出血與居家照護(約 9 題)；海洋性貧血輸血與排鐵(114-1_OP_041)
2. 第 9 輪：造血藥物頁做好後回補 chronic-kidney-disease#anemia
3. 第 11 輪：惡性貧血與 B12(113-2_MS_021 在 lower-gi-disorders#malabsorption)、缺鐵性貧血與痔瘡出血，互連

計畫檢查(2026-10-22)：
- 既有頁只連不重寫：thrombosis-embolism-infarction(#hemostasis、**#dic**)、single-gene-disorders(海洋性、鐮刀型、vWD、球形、血友病、G6PD 的遺傳)、complete-blood-count#anemia、transfusion-reactions、leukemia、lymphoma-myeloma
- **hemoglobinopathies-care 不另開頁**(使用者決定)：輸血與排鐵、脾切除、G6PD 避免物寫進 anemias#hemolytic
- 抗血栓 14 題與深部靜脈血栓(52%)原本沒有歸屬：補既有 anticoagulants、antiplatelets、thrombolytics
- 新增 `lab/coagulation-tests`(taxonomy 已有 coagulation-labs 組但沒有頁)
- 標籤合併另帶**社區 B**(第 13 輪範圍，使用者決定)

| 步 | 內容 |
|---|---|
| 12-0a | 標籤合併：血液重查(第 7 輪後新增、抗血栓與貧血用藥)＋社區 B(社區 Ch02、04、06–09、11、12、15)；`docs/tag-merge-round12.md` |
| 12-0b | 來源包 `sources/hematology.md`(內外、兒科課本書頁、血液病學會、輸血作業規範、ASH ITP 2019、ISTH DIC；新舊說法表) |
| 12-0c | taxonomy hematology groups(血液生理、貧血、出血凝血、檢驗)；圖片盤點(Servier 血球生成＋原創凝血瀑布) |
| A | `physiology/blood-hemostasis`(血球生成、EPO、血紅素、血型、凝血瀑布與纖溶；病理止血留 thrombosis 頁並互連)、`disease/anemias`(缺鐵、巨球性、再生不良、溶血含海洋性輸血排鐵與 G6PD 照護、真性紅血球增多症；移交) |
| B | `disease/bleeding-disorders`(血小板減少、ITP、血友病關節出血與居家、vWD 治療、DIC 護理與判讀；移交)、`lab/coagulation-tests`(PT/INR、aPTT、出血時間、纖維蛋白原、D-dimer、FDP；依疾病判讀表) |
| C | `drug/hematinics`(鐵劑、B12、葉酸、EPO、排鐵劑；回補 CKD)＋補 anticoagulants(DVT 護理、HIT)、antiplatelets、thrombolytics |
| D | 掃尾(白血病、淋巴瘤剩 4 題補既有頁)＋收尾(共通規則) |

目標：內外 Ch14、藥理 Ch09、兒科 Ch10、病理 Ch10 **4 章 100%**；生解 Ch07 血液小節 100%

---|---|
| 12-0 | 第 7 輪已合併血液標籤，只處理新發現的；來源包(血液病學會、輸血規範)；圖：原創凝血瀑布 |
| A | `physiology/blood-hemostasis`(血球生成、凝血與纖維溶解)、`disease/anemias`(缺鐵、巨球性、再生不良、溶血；移交) |
| B | `disease/bleeding-disorders`(血友病、類血友病、ITP、DIC；移交)、`drug/hematinics`(鐵劑、B12、葉酸、EPO、排鐵劑) |
| C | `disease/hemoglobinopathies-care`(海洋性貧血、G6PD 的照護；移交)；收尾 |

---

## 關鍵檔案

- 進度：`rnhighpass-quiz/docs/knowledge-progress.md`(開工時「目前輪次」換第 8 輪，第 7 輪移到摘要)、`docs/knowledge-roadmap.md`(8–12 列狀態、移交清單)
- 分類：`content/knowledge/taxonomy.yml`
- 範本頁：`procedure/oxygen-therapy.md`、`procedure/airway-clearance.md`(procedure)、`device/chest-tube.md`(device)、`care/community-mental-health.md`(無標籤題用 chapters＋`::questions{ids}`)
- 題目：`多保命護理分章/05_chaptered_books/` 基護、內外、生解、病理、兒科、藥理對應章
- 腳本：`analysis/tag_fixes/apply_tag_merge.py`、`scripts/05_apply_chap_tag_xchap.py`、`scripts/knowledge_coverage.py`、`scripts/source-scan.py`、`scripts/image-license-review.py`、`sync_all.py`
- 課本：基本護理學上下冊、內外科護理技術、內外科護理學上下冊、兒科護理學、Robbins 9e、ICU Book 5e(只參考、不複製)；本機 python 用 `/usr/bin/python3`

## 驗證

1. 每組：`pnpm knowledge:build` 通過、resolver 通過、`knowledge_coverage.py` 看該組 H2 比例、`source-scan.py` 無新照抄
2. 每輪：本機頁面截圖確認步驟表與圖；目標章節 ≥ 95%(基護 B ≥ 90%)
3. 收尾：Supabase question_tags＝來源、workers.dev 新頁線上 200
4. 每輪結束列需確認清單(只列真的需要的)，回報用中文，已處理與未處理標籤、章節分開列
