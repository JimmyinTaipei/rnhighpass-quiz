# 第 3 輪(神經與感官)來源包

> 狀態：2026-10-06 使用者核准計畫；本機 session 製作。計畫檔：`~/.claude/plans/plan-glowing-sunset.md`；進度以 [knowledge-progress.md](../knowledge-progress.md) 為準
> 圖片另見 [neuro-images.md](neuro-images.md)；標籤合併見 [tag-merge-neuro.md](../tag-merge-neuro.md)
> 版權原則見 [knowledge-roadmap.md](../knowledge-roadmap.md)「版權優先與 UpToDate 使用原則」：所有來源只當參考，用自己的話與結構重寫

## 一、範圍

| 章 | 未涵蓋(2026-10-06) | 主要放在 |
|---|---:|---|
| 生解 Ch05 神經系統 | 160 | A、B、C 組 physiology 頁 |
| 生解 Ch06 感覺器官 | 32 | J 組 special-senses |
| 藥理 Ch02 自主神經藥物 | 54 | C 組 cholinergic-drugs、adrenergic-agonists |
| 藥理 Ch03 抗癲癇、神經退化 | 32 | D 組 antiepileptics、antiparkinson-drugs |
| 藥理 Ch04 止痛麻醉 | 33 | D 組 anesthetics；回補 nsaids-acetaminophen、opioids |
| 內外 Ch15 神經系統疾病 | 168 | E–H 組 |
| 內外 Ch17 眼、耳 | 47 | J 組 eye-disorders、ear-disorders |
| 兒科 Ch13 兒童神經 | 約 40 | I 組 pediatric-neuro；熱性痙攣在 epilepsy |
| 病理 Ch18 感官與神經 | 17 | 併入各疾病頁的病理段落 |

題號取法：`多保命護理分章/chapter_maps/章節架構/<科>/Ch*_mapping_*.md`(JSON，每小節的題號清單)；chapters 欄位用分章題本的 H2 名稱

## 二、手上已有的資料

| 資料 | 位置 | 用途 | 注意 |
|---|---|---|---|
| 內外科護理學上下冊(國考書) | `相關資源/國考書（最終參考用）/` | 神經、眼耳章考點核對 | 掃描圖檔，沒有文字層，無法 grep；只核對考點，不照抄 |
| 兒科護理學(國考書) | 同上 | 兒童神經章 | 同上 |
| Robbins Basic Pathology 9th | 同上 | 病理 Ch18：中樞神經血管疾病、外傷、去髓鞘、退化性疾病、腫瘤 | 有版權，只參考 |
| OpenStax Anatomy & Physiology 2e | `相關資源/anatomy-and-physiology-2e_-_WEB.pdf` | 神經組織、脊髓、腦、自主神經、感覺 | CC BY-NC-SA：**只參考、不譯、不用圖** |
| OpenStax Pharmacology、Medical-Surgical Nursing | `相關資源/*.pdf` | 自主神經藥物、抗癲癇、巴金森、神經疾病護理 | 同上 |
| 既有頁 | `content/knowledge/` | dementia、anti-dementia-drugs、delirium、cns-infections、pediatric-cancers(腦瘤)、neurotransmitters-psychiatry、opioids、nsaids-acetaminophen | 新頁連結過去，不重寫 |

UpToDate：本輪沒有匯出檔，依使用者規則**不請使用者搜尋**；補不齊的寫「待核對」，整輪結束列需確認清單

## 三、公開指引與法規(本機可直接取得)

| 主題 | 來源 | 版本 | 用在 |
|---|---|---|---|
| 急性缺血性中風 | AHA/ASA [2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke](https://professional.heart.org/en/guidelines-statements/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-strokestr0000000000000513) | 2026(取代 2018 與 2019 更新) | stroke：溶栓、取栓時間窗、血壓、血糖、吞嚥篩檢 |
| 台灣靜脈溶栓 | 台灣腦中風學會「2025 急性缺血性腦中風靜脈血栓溶解治療指引更新」(台灣中風醫誌 7(1)，[長庚書目](https://pure.lib.cgu.edu.tw/en/publications/2025%E5%8F%B0%E7%81%A3%E8%85%A6%E4%B8%AD%E9%A2%A8%E5%AD%B8%E6%9C%83%E6%80%A5%E6%80%A7%E7%BC%BA%E8%A1%80%E6%80%A7%E8%85%A6%E4%B8%AD%E9%A2%A8%E9%9D%9C%E8%84%88%E8%A1%80%E6%A0%93%E6%BA%B6%E8%A7%A3%E6%B2%BB%E7%99%82%E6%8C%87%E5%BC%95%E6%9B%B4%E6%96%B0/)) | 2025 | stroke：台灣的 rt-PA／tenecteplase 條件(全文待取得) |
| 台灣取栓 | 台灣腦中風學會「2023 急性缺血中風動脈內血栓移除治療指引更新」([PDF](https://www1.cgmh.org.tw/intr/intr5/6370Z/guidelines/Taiwan/2_EVT_TW_2023.pdf)) | 2023 | stroke |
| 癲癇分類 | ILAE [Updated classification of epileptic seizures (2025)](https://www.ilae.org/updated-classification-epileptic-seizures-2025)、[PubMed 40264351](https://pubmed.ncbi.nlm.nih.gov/40264351/) | 2025(取代 2017) | epilepsy：四大類(局部、全身、不明、無法分類)、「意識」取代「覺察」；**國考仍考舊稱(大發作、小發作、部分發作)，頁面新舊對照並標新指引** |
| 重度頭部外傷 | Brain Trauma Foundation Guidelines for the Management of Severe TBI | 第 4 版(2016)＋2020 減壓顱骨切除更新 | increased-icp、head-injury：ICP 22 mmHg、CPP 60–70 mmHg(寫頁時核對) |
| 腦死判定 | 衛福部《腦死判定準則》([六法全書版](https://6laws.net/6law/law3/腦死判定準則.htm)；正式以全國法規資料庫為準) | 101-12-17 修正(寫頁時再查是否有更新版) | cranial-nerve-spine-disorders：判定條件、測試項目、兩次判定間隔(3 歲以上 4 小時等) |
| 器官捐贈 | 《人體器官移植條例》第 4 條 | 寫頁時查 | 腦死段落 |

寫頁時視需要再找(依 [[knowledge-base-sourcing-rules]]：台灣醫學中心衛教單張優先)：

- 巴金森：MDS 臨床診斷準則、台灣動作障礙學會衛教
- 重症肌無力、GBS、ALS、MS：台灣神經學學會衛教、EAN／PNS 2023 GBS 指引
- 青光眼、白內障、視網膜剝離、黃斑部退化：醫學中心眼科衛教單張、NEI 衛教頁(PD)
- 中耳炎、美尼爾氏症、BPPV：AAO-HNS 指引摘要、醫學中心耳鼻喉衛教
- 腦性麻痺、水腦、神經管缺陷、雷氏症候群：國健署兒童健康手冊、醫學中心兒科衛教
- 藥物：食藥署仿單、健保給付規定(抗癲癇、巴金森、肉毒桿菌素)

## 四、新舊說法要並列的地方(先列，寫頁時確認)

| 主題 | 國考常見舊說法 | 新指引 | 處理 |
|---|---|---|---|
| 癲癇分類 | 大發作、小發作、部分發作、複雜性部分發作 | ILAE 2017→2025：局部(有無意識障礙)、全身(強直陣攣、失神)等 | 新舊對照表，題目用舊稱時頁面也查得到 |
| 腦中風溶栓時間窗 | 3 小時(舊題)、4.5 小時 | 4.5 小時內 IV 溶栓；影像選擇後可延長；取栓最長 24 小時 | 標注指引年份 |
| 腦中風血壓 | 依舊題 | 2026 AHA/ASA：溶栓或取栓後不建議把收縮壓強降到 < 140 | 寫明新建議 |
| 顱內壓治療 | 過度換氣常規使用 | BTF：不建議預防性長期過度換氣 | 加 :::exam 提示 |
| 脊髓損傷類固醇 | 高劑量 methylprednisolone | 目前不建議常規使用 | 舊考點保留、標新指引 |

## 五、版權注意

- 國考書、Robbins、OpenStax 都只當參考；表格自己設計欄位，不重製原書表格
- 解剖圖依 [neuro-images.md](neuro-images.md)：Servier(CC BY 4.0，官網下載)、Lynch(CC BY 2.5)、NEI(PD)、原創；不用課本與國考書的圖
- 存檔前跑 `python3 scripts/source-scan.py`
