# 第 4 輪(內分泌與代謝)來源包

> 狀態：2026-10-14 使用者核准計畫；本機 session 製作。計畫檔：`~/.claude/plans/supabase-golden-brook.md`；進度以 [knowledge-progress.md](../knowledge-progress.md) 為準
> 圖片另見 [endocrine-images.md](endocrine-images.md)；標籤合併見 [tag-merge-endocrine.md](../tag-merge-endocrine.md)、[tag-merge-cardio.md](../tag-merge-cardio.md)
> 版權原則見 [knowledge-roadmap.md](../knowledge-roadmap.md)「版權優先與 UpToDate 使用原則」：所有來源只當參考，用自己的話與結構重寫

## 一、範圍

| 章 | 未涵蓋(2026-10-14) | 主要放在 |
|---|---:|---|
| 生解 Ch12 內分泌系統 | 103 | A 組 endocrine-overview、hypothalamus-pituitary；B 組 thyroid-parathyroid、adrenal-glands；I 組補 glucose-homeostasis |
| 生解 Ch06 視覺(視交叉受壓) | 3 | C 組 pituitary-disorders |
| 內外 Ch08 內分泌系統疾病 | 138 | C–F 組疾病頁；I 組補 diabetes |
| 內外 Ch15 腦瘤(腦下垂體) | 6 | C 組 pituitary-disorders |
| 藥理 Ch10 內分泌與新陳代謝藥物 | 95 | G 組 corticosteroids、thyroid-drugs、pituitary-hormones；H 組 sex-hormones、bone-calcium-drugs；I 組補降血糖藥 |
| 兒科 Ch15 兒童內分泌與慢性病 | 43 | I 組 pediatric-endocrine、chronically-ill-children |
| 病理 Ch16 內分泌系統疾病 | 22 | 併入各疾病頁的病理段落 |

題號取法：`多保命護理分章/subject mappings/章節架構/<科>/Ch*_mapping_*.md`；chapters 欄位用分章題本的 H2 名稱
留給其他輪：骨質疏鬆疾病頁(第 14 輪肌骨)、家庭計畫護理與避孕方式比較(第 16 輪產科)、急性胰臟炎(第 11 輪消化)

## 二、手上已有的資料

| 資料 | 位置 | 用途 | 注意 |
|---|---|---|---|
| DAROC 第 1 型糖尿病臨床照護指引 2026 | `相關資源/相關指引/11507_DAROC Clinical Practice Guidelines for Type 1 Diabetes Care 2026_FINAL公告版.pdf` | I 組 diabetes、pediatric-endocrine(兒童第一型) | 學會公告，只參考、可引用數字並標注 |
| 2025 肥胖指引 | `相關資源/相關指引/11508_肥胖_縮_p353_v3-6.pdf` | 代謝症候群、肥胖相關題(若出現) | 同上 |
| 內外科、兒科護理學(國考書) | `相關資源/國考書（最終參考用）/` | 內分泌章與兒童內分泌章考點核對 | 掃描圖檔，只核對考點，不照抄 |
| Robbins Basic Pathology 9th | 同上 | 病理 Ch16：腦下垂體腺瘤、甲狀腺炎與腫瘤、腎上腺疾病、MEN | 有版權，只參考 |
| OpenStax Anatomy & Physiology 2e、Pharmacology、Medical-Surgical Nursing | `相關資源/*.pdf` | 內分泌生理、藥理、疾病護理 | CC BY-NC-SA：**只參考、不譯、不用圖** |
| 既有頁 | `content/knowledge/` | diabetes、glucose-homeostasis、insulin 與各降血糖藥、blood-glucose、hba1c、ogtt、ketones、blood-pressure-regulation(RAAS)、brain-tumors、head-injury(DI／SIADH／腦耗鹽)、eye-disorders、hypertension、loop-diuretics、potassium-sparing-diuretics、immunosuppressants、asthma-drugs | 新頁連結過去，不重寫 |

UpToDate：本輪沒有匯出檔，依規則**不請使用者搜尋**；補不齊的寫「待核對」，整輪結束列需確認清單

## 三、公開指引(2026-10-14 已確認存在與版本)

| 主題 | 來源 | 版本 | 用在 |
|---|---|---|---|
| 甲狀腺亢進 | ATA [2016 Guidelines for Diagnosis and Management of Hyperthyroidism and Other Causes of Thyrotoxicosis](https://www.thyroid.org/professionals/meetings/past-meetings/spring-2016-satellite/)(Ross DS 等，Thyroid 2016;26(10):1343–1421) | 2016 | hyperthyroidism、thyroid-drugs：抗甲狀腺藥、放射碘、術前準備、甲狀腺風暴、懷孕 |
| 甲狀腺低下 | ATA Guidelines for the Treatment of Hypothyroidism(Jonklaas J 等，Thyroid 2014;24(12):1670–1751) | 2014(寫頁時確認有無更新) | hypothyroidism、thyroid-drugs：levothyroxine 服法、黏液水腫昏迷 |
| 甲狀腺癌 | ATA [2025 Management Guidelines for Adult Patients with Differentiated Thyroid Cancer](https://www.thyroid.org/new-ata-guidelines-adult-patients-differentiated-thyroid-cancer/)([PubMed 41173539](https://pubmed.ncbi.nlm.nih.gov/41173539/)) | 2025(取代 2015 的癌症部分) | thyroid-nodules-cancer；**2025 版不再涵蓋成人甲狀腺結節**，結節評估仍參考 2015 版 |
| 尿崩症改名 | [Changing the Name of Diabetes Insipidus: A Position Statement](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10534955/)(多國內分泌學會聯合，2022，開放取用) | 2022 | diabetes-insipidus-siadh：中樞性 → 精胺酸血管加壓素缺乏(AVP-D)、腎因性 → 精胺酸血管加壓素抗性(AVP-R)；**國考仍用尿崩症，頁面新舊對照** |
| 原發性醛固酮症 | Endocrine Society [2025 Clinical Practice Guideline](https://www.endocrine.org/news-and-advocacy/news-room/2025/endocrine-society-guideline-calls-for-increased-screening-for-common-cause-of-high-blood-pressure)(JCEM 2025 年 9 月) | 2025(取代 2016) | pheochromocytoma-aldosteronism：建議所有高血壓病人篩檢(醛固酮、腎素、鉀)；MRA 為第一線藥物治療 |
| 類固醇造成的腎上腺功能不全 | ESE／Endocrine Society [2024 聯合指引](https://www.endocrine.org/clinical-practice-guidelines/glucocorticoid-induced-adrenal-insufficiency) | 2024 | corticosteroids、adrenal-insufficiency：減量、壓力劑量(輕微壓力口服、中重度與手術用注射)、不用 fludrocortisone |
| 原發性腎上腺功能不全 | Endocrine Society Diagnosis and Treatment of Primary Adrenal Insufficiency(Bornstein SR 等，JCEM 2016) | 2016(寫頁時確認) | adrenal-insufficiency：愛迪生氏病、腎上腺危象 |
| 庫欣氏症候群 | Endocrine Society 診斷(2008)、治療(2015)；Pituitary Society 2021 共識 | 寫頁時確認 | cushing-syndrome |
| 嗜鉻細胞瘤 | Endocrine Society Pheochromocytoma and Paraganglioma(Lenders JW 等，JCEM 2014) | 2014(寫頁時確認) | pheochromocytoma-aldosteronism：術前 α 阻斷再 β |
| 泌乳素瘤 | Pituitary Society 國際共識(Petersenn S 等，Nat Rev Endocrinol 2023) | 2023(取代 2006、Endocrine Society 2011) | pituitary-disorders、pituitary-hormones：cabergoline 為首選；**國考常考 bromocriptine，頁面並列** |
| 肢端肥大症 | Endocrine Society Acromegaly(Katznelson L 等，JCEM 2014)；Pituitary Society 共識 | 寫頁時確認 | pituitary-disorders：經蝶骨手術為首選、octreotide |
| 先天性腎上腺增生症 | Endocrine Society CAH due to 21-hydroxylase deficiency(Speiser PW 等，JCEM 2018，取代 2010) | 2018(寫頁時確認全文) | pediatric-endocrine |
| 高血糖危象 | ADA／EASD／JBDS／AACE／DTS [Hyperglycemic Crises in Adults with Diabetes: A Consensus Report](https://nutrition-evidence.com/article/508348/hyperglycemic-crises-in-adults-with-diabetes-a-consensus-report)(Diabetes Care 2024;47(8):1257–1275)；ADA Standards of Care 2026 | 2024、2026 | I 組補 diabetes：DKA 與 HHS 診斷與緩解標準(第一次訂 HHS 緩解標準) |
| 更年期荷爾蒙療法 | [The 2022 Hormone Therapy Position Statement of NAMS](https://pubmed.ncbi.nlm.nih.gov/35797481/)(現改名 The Menopause Society) | 2022 | sex-hormones：60 歲以下或停經 10 年內利大於弊、經皮與低劑量血栓風險較低 |
| 避孕藥禁忌 | CDC [U.S. MEC 2024 附錄 D 複方荷爾蒙避孕](https://www.cdc.gov/contraception/hcp/usmec/combined-hormonal-contraceptives.html) | 2024 | sex-hormones：35 歲以上抽菸每天 ≥ 15 支為第 4 類(禁用)、< 15 支為第 3 類 |

## 四、台灣資料

| 主題 | 來源 | 狀態 |
|---|---|---|
| 新生兒篩檢 | 衛福部／國健署([108 年擴大為 21 項](https://mohw.gov.tw/cp-16-49488-1.html))；先天性甲狀腺低能症、先天性腎上腺增生症都在篩檢項目內 | **待核對**：完整項目表、是否已改為全額公費並加入 SMA 成為 22 項(聯合報報導未寫年份) |
| 放射碘治療出院與居家防護 | 核能安全委員會 2024 年游離輻射安全諮詢會紀錄：「碘 131 治療病人住院及出院輻射安全防護導則」研析中 | **台灣尚無公告的出院劑量率門檻**；頁面用醫學中心衛教單張的居家防護(與嬰幼兒孕婦保持距離、分開餐具與床、沖水 2 次)，數字標待核對 |
| 骨質疏鬆 | 中華民國骨質疏鬆症學會臨床治療指引(衛福部曾發布；最新版待查)、健保給付規定(bisphosphonate、denosumab、teriparatide 的給付條件) | **待查**最新版；H 組寫 bone-calcium-drugs 前找 |
| 甲狀腺、腎上腺、腦下垂體衛教 | 醫學中心衛教單張(臺大、長庚、北榮、聯醫：甲狀腺切除術後、放射碘、類固醇使用、腎上腺危象識別卡) | 寫頁時逐篇找，依 [[knowledge-base-sourcing-rules]] 優先 |
| 藥品 | 食藥署仿單(levothyroxine、PTU、methimazole、desmopressin、hydrocortisone、bisphosphonate) | 寫頁時查 |

## 五、新舊說法要並列的地方(先列，寫頁時確認)

| 主題 | 國考常見說法 | 新指引或現況 | 處理 |
|---|---|---|---|
| 尿崩症名稱 | 中樞性、腎因性尿崩症 | 2022 改名 AVP-D、AVP-R | 標題用尿崩症，括號附新名 |
| 尿崩症藥物 | vasopressin、vasopressin tannate(油性懸浮液) | desmopressin(DDAVP，口服、舌下、鼻噴) 為主 | 兩者都寫；油性懸浮液標「舊藥，台灣已少用」(待核對) |
| 甲狀腺風暴用藥順序 | 先 PTU，1 小時後才給碘劑 | ATA 2016 同樣先 thionamide 再碘劑；PTU 可抑制 T4 → T3，懷孕第一期也用 PTU | 一致，寫清楚理由 |
| 抗甲狀腺藥首選 | 常考 PTU | ATA 2016：除懷孕第一期與甲狀腺風暴外，首選 methimazole(PTU 有嚴重肝毒性) | 並列 |
| 泌乳素瘤 | bromocriptine | cabergoline 首選(2023 共識) | 並列 |
| 原發性醛固酮症篩檢 | 低血鉀合併高血壓才懷疑 | 2025 建議所有高血壓病人篩檢 | 並列 |
| 類固醇壓力劑量 | 手術前加倍或給 hydrocortisone 100 mg | 2024 指引依壓力程度分級 | 數字依指引表，寫頁時核對 |
| 甲狀腺結節與癌 | 2015 ATA | 2025 ATA 只管癌症 | 結節用 2015、癌用 2025 |
| HHS 名稱 | 高滲透壓高血糖非酮性昏迷(HHNK) | HHS(高血糖高滲透壓狀態)；2024 共識第一次訂緩解標準 | 頁面附舊稱 |
| 更年期荷爾蒙療法 | WHI 之後「盡量不用」 | 60 歲以下或停經 10 年內利大於弊 | 並列 |

## 六、版權與 UpToDate 注意

- 本輪不使用 UpToDate；凡依記憶寫的數字一律標「待核對」
- 指引全文多為付費期刊：只引用建議的結論與數字，用自己的話寫，不重製指引表格
- 存檔前跑 `python3 scripts/source-scan.py`
