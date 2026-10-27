# 指引追蹤清單(guideline watchlist)

> 給 AI 定期檢查用：依「下次查看」先後，查官方網站有沒有新版；有新版就比對頁面內容，**列給使用者決定**再改
> 頁面清單用 `python3 scripts/guideline-scan.py` 重新產生(依內文引用自動找)
> 建立：2026-10-27；每查完一項，更新「頁面目前版本」與「上次查看」

## 怎麼查

1. 從「優先」開始，再查「每年更新」，最後查「2–3 年以上」
2. 到該指引的官方網站確認最新版本與年份(不要憑記憶判斷有沒有新版)
3. 有新版：讀新版的「重點改變」(what's new / summary of changes)，對照「涉及頁面」裡寫到的數值、切點、藥物順序、流程
4. 改法依原則：**國考答案不改**；頁面寫「國考答案」與「現行指引」並列，舊考點保留、標注新指引(見 knowledge-base-sourcing-rules)
5. 結果寫進 [review-checklist.md](review-checklist.md) 的新段落，使用者確認後才改頁面
6. 台灣的指引與政策(健保、國健署、疾管署、衛福部)優先於國外指引；兩者不同時並列

## 優先：頁面版本可能已經落後

| 指引 | 頁面目前版本 | 為什麼優先 | 涉及頁面(主要) |
|---|---|---|---|
| Surviving Sepsis Campaign(成人) | 2021 | 約 4–5 年改版一次，2021 之後可能已出新版 | sepsis、shock、hypotension、central-venous-catheter、antibiotics-overview |
| KDIGO AKI | 2012 | 舊版，KDIGO 正在改版 | acute-kidney-injury、dialysis-crrt |
| AASLD／EASL 肝硬化、肝癌 | 2021、2023 | 肝癌治療(免疫治療組合)變化快 | liver-cirrhosis、liver-cancer |
| 台灣血脂異常治療指引(TSOC) | 2017、2022 | 2022 之後可能有新版 | lipid-profile、statins |
| 疾管署《結核病診治指引》 | 第七版(2022) | 約 2–3 年改版，短程治療處方有在變 | tuberculosis、antituberculars、culture-and-sensitivity |
| NCCN／ASCO(化療副作用) | 2018、2023 | NCCN 每年改多次；只看止吐、嗜中性白血球低下發燒這類護理會用到的 | cancer-treatment-toxicities、antineoplastics |

## 每年更新

| 指引 | 通常發布時間 | 頁面目前版本 | 涉及頁面(主要) | 查什麼 |
|---|---|---|---|---|
| ADA Standards of Care in Diabetes | 每年 12 月(隔年版) | 2026 | diabetes、hba1c、ogtt、insulin、metformin、sglt2-inhibitors、glp1-receptor-agonists 等 20 篇 | 診斷切點、HbA1c 目標、選藥順序、低血糖分級 |
| 台灣糖尿病臨床照護指引(DAROC) | 不定期，約 1–2 年 | 2026(第 1 型) | diabetes、insulin | 和 ADA 不同的地方 |
| GOLD COPD Report | 每年 11 月 | 2026 | copd、oxygen-therapy、ventilation-mechanics | ABE 分組、起始藥物、氧氣目標 |
| GINA 氣喘 | 每年 5 月 | 2026 | asthma、asthma-drugs | Track 1／2、步驟治療、SABA 單用 |
| 疾管署 兒童預防接種時程 | 每年(新疫苗、改劑次) | 114 年 1 月 | immunization、newborn-care、preterm-infant、childhood-infectious-diseases | 新增疫苗、劑次、接種年齡 |
| 疾管署 法定傳染病分類、通報 | 不定期(公告) | 2025–2026 | notifiable-diseases、infection-control、vector-borne-zoonotic、respiratory-viral-infections | 分類、通報時限、新增或移除的病 |
| 國健署 癌症篩檢與成人預防保健 | 每年(補助對象常擴大) | 2025–2026 | cancer、gynecologic-cancers、health-administration-system、older-adult-chronic-disease、ogtt | 篩檢年齡、間隔、補助對象 |
| 健保給付規定 | 隨時公告 | 2025–2026 | osteoporosis、bone-calcium-drugs、anti-dementia-drugs、rheumatoid-arthritis、antipsychotics 等 19 篇 | 給付條件、限制 |
| 長照 2.0／長照 3.0 | 每年(預算、服務項目) | 2025–2026 | long-term-care、long-term-care-services、home-care-discharge-planning | 服務項目、對象、額度 |
| 衛福部 死因統計 | 每年 6 月 | 114 年 | vital-statistics、cancer | 十大死因排序、癌症死因排序 |
| 衛福部組織與新機關 | 不定期 | 2026 | health-administration-system、long-term-care | 新機關生效後更新(review-checklist 已列) |

## 2–3 年以上更新

| 指引 | 改版週期(約) | 頁面目前版本 | 涉及頁面(主要) | 查什麼 |
|---|---|---|---|---|
| AHA CPR／ECC(BLS、ACLS、PALS、NRP) | 5 年大改，每年 focused update | 2025 | cpr、arrhythmias、emergency-nursing、ecg、antiarrhythmics、newborn-care 等 29 篇 | 按壓深度速率、藥物劑量、流程圖 |
| AHA／ACC 高血壓 | 5–8 年 | 2025 | hypertension 與降壓藥 14 篇 | 分級切點、目標血壓、起始藥物 |
| 台灣高血壓治療指引(TSOC／THS) | 約 3–5 年 | 2022 | hypertension、降壓藥各頁 | 和 AHA 不同的目標值 |
| ACC／AHA 急性冠心症 | 5–10 年 | 2025 | coronary-artery-disease、thrombolytics、antiplatelets、anticoagulants、cardiac-biomarkers 等 19 篇 | DAPT 時間、再灌流時間 |
| 心衰竭(ESC、AHA／ACC／HFSA、TSOC) | ESC 約 3–5 年加 focused update | ESC 2026、AHA 2022、TSOC 2023–2024 | heart-failure、arni、sglt2-inhibitors、bnp、loop-diuretics 等 18 篇 | 四大類藥物、HFpEF 用藥、BNP 切點 |
| 心房顫動(ACC／AHA／HRS、ESC) | 約 3–5 年 | 2023、2024 | arrhythmias、anticoagulants、digoxin | 抗凝分數(CHA₂DS₂-VA)、心跳控制 |
| AHA／ASA 急性缺血性中風 | 約 3–5 年 | 2026 | stroke、thrombolytics | 溶栓時間窗、血壓目標 |
| KDIGO CKD、血壓、腎絲球疾病 | 依主題 5–10 年 | 2021–2025 | chronic-kidney-disease、glomerular-diseases、uacr、renal-function-tests | 分期、UACR 切點、SGLT2 抑制劑 |
| ACOG／WHO 產科 | 各 Practice Bulletin 不定期 | 2014–2025 | intrapartum-care、labor-complications、postpartum-complications、high-risk-pregnancy、intrapartum-fetal-monitoring 等 27 篇 | 子癇前症切點、產後出血處置、胎心音判讀 |
| 台灣成人骨質疏鬆症防治共識 | 約 3–5 年 | 2025 | osteoporosis、bone-calcium-drugs | 治療門檻、藥物 |
| ACG 腸胃(出血、潰瘍、胰臟炎) | 依主題 | 2021–2026 | upper-gi-disorders、lower-gi-disorders、biliary-pancreatic、gi-drugs | H. pylori 處方、胰臟炎輸液 |
| IDSA／ATS 社區型、院內肺炎 | 5 年以上 | CAP 2019、HAP／VAP 2016 | pneumonia、antibiotics-overview | 經驗性抗生素 |
| BTS 氧氣、胸膜疾病 | 5 年以上 | 2017、2023 | oxygen-therapy、pleural-chest-trauma、chest-tube | SpO₂ 目標 |
| NPIAP／EPUAP 壓傷 | 約 5 年 | 分期 2016、指引 2025 | pressure-injury | 分期定義、翻身間隔 |
| ILAE 癲癇分類 | 不定期 | 2025 | epilepsy、antiepileptics | 發作分類名詞 |
| AAP 新生兒、兒科 | 依主題 | 2003–2025 | neonatal-disorders、newborn-care、preterm-infant、kawasaki-disease | 黃疸照光切點、川崎病治療 |
| NICE(精神科) | 依主題 | 2010–2018 | personality-disorders、eating-disorders、adhd、dementia 等 14 篇 | 第一線治療 |
| DSM-5-TR | 10 年以上 | 2022 | 精神科 20 篇 | 很少變，最後查 |

## 查看紀錄

| 日期 | 指引 | 結果 |
|---|---|---|
| | | |
