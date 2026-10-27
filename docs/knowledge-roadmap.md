# 知識庫批次順序

> 每輪結束時更新「未涵蓋」與「狀態」。進度細節在 [knowledge-progress.md](knowledge-progress.md)；原則在 [positioning.md](positioning.md)。
> 涵蓋數來源：`多保命護理分章/analysis/knowledge_coverage.md`(2026-10-03：3,318/8,960，37%)。
> 2026-10-06 順序調整：第 2 輪擴大為精神 15 章 100%；神經與感官前移到第 3 輪，原第 3 輪以後各輪順延一輪。

## 排序原則

1. **以系統為一批**：相關的頁一起做，互相連結、資料共用。
2. **批次之間**：依「未涵蓋題數 ÷ 資料搜集難度」排序，先做 CP 值高的。
3. **批次之內**：依 H2 題數由多到少。
4. 生解的解剖頁、急重症的器材頁、護理技術頁，都放進對應的系統批次一起做。
5. **不為了省額度降低品質。** 一輪做不完就記在進度檔，下次接著做。
6. 每批先做**來源包** `多保命護理分章/sources/<批次>.md`(網址、授權、要點、頁碼)；來源包可以在額度少時先做，也可以由使用者先提供 PDF。

難易：**易**＝有政府或學會的公開資料，或是延伸已完成的頁；**中**＝要整合幾個來源；**難**＝要先決定結構，或很依賴圖。

## 已完成

| 批次 | 涵蓋 |
|---|---|
| 微免(病原體) | 81% |
| 護理行政 | 99% |
| 癌症(內外 Ch03、兒科 Ch18、病理 Ch04、藥理 Ch12) | 92–100% |
| 精神 A–C(思覺失調、雙相、憂鬱、危機、倫理法律、肌體治療) | 該章 70–99% |
| 心血管(高血壓、心衰竭、冠心病、檢驗) | 內外 Ch13 54% |
| 感染(抗生素、感控、法定傳染病) | 藥理 Ch11 100%、基護 Ch05 89% |

## 待做(依順序)

| 輪 | 批次 | 未涵蓋(約) | 主要章節 | 難易 | 狀態 |
|---|---|---:|---|---|---|
| 0 | 定位、範本、進度機制、小介面修正 | — | — | — | ✅ 2026-10-03 |
| 1 | **1a 來源與改寫掃描**(見下方「UpToDate 使用原則」)＋1b 舊頁分層列點改寫＋補 summary | (約 160 篇) | 全部 | 易 | |
| 1.5 | **免疫＋氣喘＋輸血反應＋病理發炎**(22 篇 6 組 A–F；用 `相關資源/免疫相關` 已匯出的資料；本機 session 製作，頁面表見 [sources/immunology.md](sources/immunology.md)) | 約 330 | 微免 Ch02–03、內外 Ch02、病理 Ch05 與 Ch02、藥理 Ch05、生解 Ch07 淋巴 | 中 | ✅ 2026-10-05 完成(22 篇) |
| 2 | **精神收尾(精神 13 章＋社區 Ch11＋兒科 Ch17 共 15 章做到 100%)**：25 篇新頁 A–H 八組(含 4 篇藥物頁)＋精神範圍同義標籤合併(0.5 步)；計畫見 `~/.claude/plans/idempotent-scribbling-starfish.md`，頁面表見 [sources/psychiatry.md](sources/psychiatry.md) | 約 580 | 精神 Ch01–Ch13、社區 Ch11、兒科 Ch17，順便收藥理 Ch03 鎮靜安眠與中樞興奮劑、社區 Ch08 失智、內外阿茲海默 | 中 | ✅ A–H 完成 2026-10-06(精神 898/898、15 章 100%；全部 4199/8960)；✅ Supabase 已寫回；✅ I 組 DSM 核對 2026-10-06 |
| 3 | 神經與感官＋ICP 監測等器材(拆 3a 解剖生理＋藥理、3b 神經疾病、3c 感官；開工前先做圖片盤點，見計畫檔) | 560 | 內外 Ch15、Ch17，生解 Ch05–06，藥理 Ch02，兒科 Ch13，病理 Ch18 | 中難 | ✅ A–K 完成 2026-10-14(26 篇；生解 Ch05 207/207、Ch06 33/36、藥理 Ch02–04 100%、內外 Ch15 215/221、Ch17 93/93、兒科 Ch13 75/75、病理 Ch18 33/33；全部 4780/8960)；剩 9 題腦下垂體留第 4 輪；Supabase 待寫回 |
| 4 | 內分泌續作(含第 3 輪留下的腦下垂體 9 題：經蝶骨手術、尿崩症、伽瑪刀、腦下垂體中風、雙顳側偏盲) | 420 | 內外 Ch08、藥理 Ch10、生解 Ch12、兒科 Ch15(甲狀腺、腎上腺、腦下垂體、尿崩症、類固醇) | 易 || ✅ 4-0＋A–J 完成 2026-10-14(22 篇新頁＋補 diabetes、insulin、glucose-homeostasis、hba1c；生解 Ch12、病理 Ch16、藥理 Ch10、內外 Ch08、兒科 Ch15 全部 100%；全部 5154/8960)；Supabase 寫回等代謝處理好再做 |
| 5 | 病理總論(Ch02 發炎與修復已移到 1.5 輪)＋**遺傳疾病跨科總整理**(依遺傳模式分類，盤點見 [sources/genetic-disorders-inventory.md](sources/genetic-disorders-inventory.md))；標籤合併補做癌症＋感染(＋精神補) | 約 100＋跨科約 80 | 病理 Ch01 細胞傷害、Ch03 循環障礙、Ch06 遺傳、Ch07 環境營養；兒科、產科的遺傳題 | 易 | ✅ 5-0＋A–E 完成 2026-10-15(8 篇；病理 Ch01、03、06、07 全部 100%，病理 79%；全部 5322/8960)；Supabase 已寫回、已部署 |
| 6 | 呼吸(氣喘已移到 1.5 輪)＋呼吸器/胸管/人工氣道器材頁＋給氧與呼吸道清潔技術頁；標籤合併呼吸＋免疫 | 約 274 | 內外 Ch09、生解 Ch08、藥理 Ch05、兒科 Ch08、病理 Ch11、**基護 Ch10 呼吸與氧氣兩節** | 中易 | 計畫已核准 2026-10-15(6-0＋A–I 組)；6-0a 標籤合併完成(91 題)；**全部完成 2026-10-15**(16 篇新頁，含第一批器材頁 chest-tube、mechanical-ventilation、artificial-airway 與第一批技術頁 oxygen-therapy、airway-clearance；呼吸相關 5 章 100%(藥理 Ch05 99%)；涵蓋 5586/8960；已寫回 Supabase 並部署) |
| 7 | 社區 A(＋標籤合併社區 5 章＋血液剩餘) | 321 | 社區 Ch01 衛生行政、Ch03 生命統計、Ch05 社區評估、Ch10 長照、Ch13 職業衛生 | 易 | 計畫已核准 2026-10-15(7-0a–c＋A–G、11 篇；計畫檔 `~/.claude/plans/a-peaceful-valiant.md`)；7-0a–c 完成 2026-10-15(標籤合併 17 題、來源包、taxonomy groups)；A–F 完成 2026-10-16(11 篇，社區 5 章 100%、社區 38% → 67%)；G 收尾 2026-10-16，已寫回 Supabase 並部署 ✅ |
| 8 | 基護 A(技術頁試做) | 390 | 基護 Ch13 給藥、Ch10 生命徵象(體溫、脈搏、血壓；**呼吸與氧氣兩節已移到第 6 輪**)、Ch14 體液供給 | 中 || ✅ 2026-10-20 全部完成(7 篇；基護 Ch02、10、13、14 100%；全部 6205/8960；已寫回 Supabase 並部署) |
| 9 | 腎與體液＋透析/CRRT | 430 | 內外 Ch04、Ch10，生解 Ch10–11，病理 Ch14，兒科 Ch12 | 中 || ✅ 2026-10-21 完成(11 篇；全部 6455/8960；已寫回並部署) |
| 10 | 基護 B | 670 | 基護 Ch07 舒適、Ch15 排泄、Ch12 營養、Ch11 冷熱、Ch08 活動、Ch01–04、06、09、16 | 中 || ✅ 2026-10-22 完成：基護 18 章 100%(1578/1578)、16 篇新頁、已寫回並部署 |
| 11 | 消化 | 430 | 內外 Ch07、生解 Ch09、病理 Ch12–13、藥理 Ch06、兒科 Ch11 | 中 || ✅ 2026-10-22 完成：6 章 100%、10 篇新頁、全部 7285/8960、已寫回並部署 |
| 12 | 血液(免疫與輸血反應已在 1.5 輪做完，只剩貧血、凝血、白血病以外的血液疾病與內外 Ch14 剩餘) | 約 120 | 內外 Ch14 血液、病理 Ch10、輸血相關 | 中 || ✅ 2026-10-23 完成：4 章 100%、5 篇新頁、全部 7374/8960、已寫回並部署 |
| 13 | 社區 B(拆 13a、13b；計畫見 [round-plans-13-17.md](round-plans-13-17.md)) | 剩約 360 | 社區 Ch02 流病、Ch04 衛教健促、Ch06 家庭、Ch07 婦幼、Ch08 中老年、Ch09 慢性病、Ch12 學校、Ch15 環境(Ch11 心衛已 100%) | 易 | ✅ 2026-10-23(13a、13b；**社區 15 章全部 100%**) |
| 14 | 肌肉骨骼與皮膚(含骨骼、肌肉解剖頁；拆 14a、14b，解剖圖先用表格，圖等全部建完再做) | 剩約 230 | 內外 Ch16、Ch12，生解 Ch02–04，病理 Ch17，兒科 Ch14 | 中難(要圖) | ✅ 2026-10-24(14a 6 篇、14b 4 篇) |
| 15 | 心血管補完(心律不整、休克、中風)＋CVC/A-line/IABP/ECMO(拆 15a、15b) | 剩約 240 | 生解 Ch07、內外 Ch13、Ch06 急重症、兒科 Ch09、藥理 Ch08 | 中 | ✅ 2026-10-27 全部完成：15a(blood-vessels、arrhythmias、antiarrhythmics)、15b(cpr、emergency-nursing、shock、central-venous-catheter、arterial-line、iabp-ecmo、congenital-heart-disease、peripheral-vascular-disease、valvular-heart-disease)；8133/8960；已寫回並部署 |
| 16 | 產科＋新生兒(拆 16a 生殖婦科、16b 妊娠期、16c 分娩、16d 產後、16e 新生兒) | 剩約 750 | 產科全部、兒科 Ch03–04、生解 Ch13–14、病理 Ch15(兒科 Ch01、02、05、16 移到第 17 輪) | 難 | |
| 17 | 兒科通論＋藥理與生解剩餘＋知識庫總收尾(拆 17a、17b) | 剩約 195 | 兒科 Ch01、02、05、16；藥理 Ch01 總論、Ch13 毒理；生解 Ch01 細胞；各科零星題(生解 Ch14 胚胎移到第 16 輪) | 中 | ✅ 2026-10-27(17a 4 篇、17b 3 篇；**全部 8960/8960，11 科 100%**) |

## 跨輪移交清單(不可漏做)

> 某一輪決定「留給後面某輪」的內容都記在這裡。**每輪開工前先看本表屬於該輪的列，寫進該輪計畫；做完在狀態欄打勾**。每輪收尾時，把新的移交項目加進來

| 從 | 移交給 | 內容 | 前一輪留下的頁(要連回) | 狀態 |
|---|---|---|---|---|
| 4 | 14 肌骨 | 骨質疏鬆疾病頁 | bone-calcium-drugs、calcium-phosphate | ✅ 2026-10-23 osteoporosis |
| 4 | 16 產科 | 家庭計畫護理、避孕方式比較 | sex-hormones | ✅ 2026-10-27 16a family-planning |
| 5 | 15 心血管補完 | 休克的臨床處置與護理(輸液、升壓劑、監測)；病理機轉不重寫 | edema-shock、sepsis、hypotension | ✅ 2026-10-27 disease/shock(hypotension#shock 改連過去) |
| 5 | 12 血液 | 海洋性貧血、血友病、類血友病、G6PD、鐮刀型與球形紅血球的治療與護理(輸血、鐵螯合、凝血因子)；遺傳部分不重寫 | single-gene-disorders、genetic-inheritance | ✅ 2026-10-22 anemias#thalassemia-care、#g6pd-care、#sickle-cell-care；bleeding-disorders#hemophilia、#vwd |
| 5 | 14 肌骨皮膚 | 燒傷照護(面積估計、輸液公式、傷口、植皮、復健)；機轉與深度分級不重寫 | environmental-injury | ✅ 2026-10-24 寫在 burns，environmental-injury 兩處改連結 |
| 5 | 17 藥理毒理 | 一氧化碳、鉛、酒精以外的中毒與解毒劑總表 | environmental-injury | ✅ 17b drug/antidotes(解毒劑總表)、drug/pharmacokinetics-pharmacodynamics(藥動學與交互作用) |
| 5 | 10 基護 B | 營養評估、治療飲食、管灌與 TPN；維生素缺乏總表不重寫 | nutritional-disorders | ✅ 2026-10-22 nutrition-assessment-diets、enteral-parenteral-nutrition(互連 nutritional-disorders) |
| 5 | 16 產科 | 唐氏症等染色體異常的產前篩檢(母血、NIPT、羊膜穿刺、絨毛取樣)、神經管缺陷與葉酸 | chromosomal-disorders、genetic-inheritance | ✅ 2026-10-27 16b prenatal-assessment、prenatal-care |
| 5 | 15、11、14 | 先天性心臟病(15)、幽門狹窄與唇顎裂(11)、髖關節發育不良(14)的照護；多因子遺傳與再發率不重寫 | genetic-inheritance | ⬜ 11 的部分 ✅ 2026-10-22 pediatric-gi#cleft、#pyloric-stenosis(genetic-inheritance 表格已連過去)；15 ✅ 2026-10-27 congenital-heart-disease；14 待做 |
| 5 | 12 血液 | 惡性貧血與維生素 B12、葉酸缺乏性貧血的照護(約 11 題)；出血疾病原因題(109-2_BM_044 等)；病理只寫了維生素表 | nutritional-disorders#water-soluble | ✅ 2026-10-22 anemias#megaloblastic、#pernicious；出血疾病原因 bleeding-disorders#causes(109-2_BM_044) |
| 5 | 16 產科 | 素食孕婦與哺乳營養(維生素 B12、鐵、葉酸)；唐氏症產前篩檢題(105-2_OP_006、107-2_OP_010、110-2_OP_003、111-1_OP_010、111-2_OP_005、112-3_OP_005、113-1_OP_004、108-1_OP_007) | chromosomal-disorders、genetic-inheritance#genetic-counseling | ✅ 2026-10-27 16b prenatal-assessment、prenatal-care |
| 5 | 10 基護 B | 冷療造成的組織傷害(112-1_FA_021)、燙傷標籤 10 題(熱療安全) | environmental-injury#heat-injury | ✅ 2026-10-22 heat-cold-therapy#complications(互連 environmental-injury#heat-injury) |
| 5 | 6 呼吸、15 心血管 | 肺栓塞臨床處置(6)；DVT 護理與預防、休克護理(保溫、輸液)(15) | thrombosis-embolism-infarction、edema-shock | 6 ✅ 2026-10-15(pulmonary-embolism-hypertension)；15 ✅ 2026-10-27(shock#temperature、peripheral-vascular-disease#venous-thrombosis 連 anticoagulants) |
| 5 | 11 消化 | 肝硬化腹水護理與穿刺；幽門狹窄、唇顎裂、食道閉鎖照護 | edema-shock#cirrhosis-ascites、genetic-inheritance#multifactorial | ✅ 2026-10-22 liver-cirrhosis#ascites、gi-diagnostic-procedures#paracentesis、pediatric-gi(edema-shock 與 genetic-inheritance 已改連結) |
| 5 | 12 血液 | 血友病關節出血、運動與居家照護(約 9 題)；海洋性貧血輸血與排鐵(114-1_OP_041) | single-gene-disorders#hemophilia、#thalassemia | ✅ 2026-10-22 bleeding-disorders#hemophilia；排鐵 anemias#thalassemia-care、hematinics#chelators(114-1_OP_041) |
| 5 | 6 呼吸 | 呼吸系統同義標籤合併(原本預設在 5-0a，使用者改為先補癌症與感染) | — | ✅ 2026-10-15 6-0a |
| 5 | 6 以後(找一輪) | 免疫範圍標籤合併(第 1.5 輪做過頁但沒合併過標籤)；腎、消化、泌尿生殖的同義標籤已記在 [tag-merge-round5.md](tag-merge-round5.md) 第六節，各輪合併時要一起處理 | — | 免疫 ✅ 2026-10-15 6-0a；腎 ✅ 2026-10-21 9-0a；消化、泌尿生殖 ⬜ |
| 6 | 7 社區 A | 勞工健康保護規則：粉塵作業特殊健康檢查項目(國考答案含肺功能檢查；法規附表待核對) | restrictive-lung-diseases#pneumoconiosis | ✅ 2026-10-15 7-0b(附表十第 23 項：胸部 X 光大片、肺功能；已回補) |
| 6 | 16 產科新生兒 | 新生兒呼吸窘迫症候群的呼吸部分已寫在 ards-respiratory-failure#neonatal-rds(含 CPAP、Silverman-Anderson、L/S 比)；第 16 輪早產兒頁連過去，不重寫；保溫、餵食、其他早產併發症在第 16 輪 | ards-respiratory-failure#neonatal-rds | ✅ 16e(preterm-infant#rds 連過去) |
| 6 | 15 急重症 | 心肺復甦術、異物哽塞急救(105-2_OP_041、107-1_OP_059、111-1_OP_042、107-2_MS_079)；甦醒球與插管已寫在 artificial-airway，不重寫；中心靜脈導管、動脈導管、IABP、ECMO 等其他器材頁(**CRRT 已在第 9 輪 dialysis-crrt#crrt**，第 15 輪只連過去) | artificial-airway#bag-valve-mask、mechanical-ventilation | ✅ 2026-10-27 cpr(含 fbao)、central-venous-catheter、arterial-line、iabp-ecmo |
| 6 | 16 產科新生兒 | 胎便吸入症候群(105-1_OP_054、106-1_OP_053、111-1_OP_055、113-3_OP_036、114-3_OP_035)、早產兒抽痰與給氧的新生兒數值、早產兒視網膜病變；給氧與抽痰原則連 oxygen-therapy、airway-clearance | oxygen-therapy、airway-clearance#suctioning | ✅ 16e(neonatal-disorders#meconium-aspiration、preterm-infant#rop) |
| 6 | 兒科心臟(15) | 心房中膈缺損與前列腺素 E1 的護理指導(106-1_OP_065，藥理 Ch05 唯一未收題) | — | ✅ 2026-10-27 congenital-heart-disease#left-to-right(ASD 不用 PGE1) |
| 6 | 7 社區 | 居家護理與長照的氣切、鼻胃管照護資源(108-2_PC_077、112-2_PC_075、111-2_PC_072、114-2_PC_047) | artificial-airway#tracheostomy | ✅ 2026-10-16 F 組(4 題收進 home-care-discharge-planning 與 long-term-care，互連 artificial-airway#tracheostomy) |
| 7 | 13 社區 B | 流行病學(Ch02)：發生率、盛行率、研究設計、篩檢指標；vital-statistics 只寫生命統計公式，流病頁要連回 | vital-statistics | ✅ 2026-10-23 13a care/epidemiology(vital-statistics 兩處改連結) |
| 7 | 13 社區 B | 中老年護理(Ch08)與慢性病(Ch09)：老人照顧、衰弱、社區慢性病照護；長照資源已寫在 long-term-care、long-term-care-services，不重寫 | long-term-care#assessment、long-term-care-services | ✅ 2026-10-23 13b care/older-adult-chronic-disease(連 long-term-care#assessment、long-term-care-services#prevention；long-term-care 的 SOF 列連回 #frailty) |
| 7 | 13 社區 B | 環境衛生(Ch15)：空氣、水、廢棄物、食品衛生；職業暴露與噪音已寫在 occupational-health-nursing | occupational-health-nursing#hazards、environmental-injury | ✅ 2026-10-23 13a care/environmental-food-hygiene(互連 occupational-health-nursing、environmental-injury) |
| 7 | 13 社區 B | 婦幼(Ch07)與學校衛生(Ch12)的預防保健時程(孕婦產檢 14 次、兒童預防保健)；已寫在 national-health-insurance#preventive-services，連回即可 | national-health-insurance#preventive-services | ✅ 2026-10-23 13b care/maternal-child-health、care/school-health(健保預防保健表加產檢補助與塗氟兩列連過去) |
| 7 | 13 社區 B | 衛生教育與健康促進(Ch04)：健康信念模式、跨理論模式、渥太華憲章；community-nursing-process 只寫社區健康營造 | community-nursing-process | ✅ 2026-10-23 13a care/health-promotion、care/health-education(community-nursing-process#evaluation 連過去) |
| 6 | 8 基護 A | 安全環境(火災 RACE、用氧安全，113-2_FA_004)；用氧安全已寫在 oxygen-therapy#precautions | oxygen-therapy#precautions | ✅ 2026-10-20 patient-safety-environment#fire |
| 8 | 10 基護 B | 約束技術已寫在 patient-safety-environment#restraint(Ch07、Ch08 約束題已收)；舒適、活動頁只連過去，不重寫；冷熱療法頁的發燒散熱連 body-temperature、燙傷預防連 patient-safety-environment#injury-types | patient-safety-environment#restraint、body-temperature | ✅ 2026-10-22 activity-immobility、positioning-body-mechanics 連 restraint；heat-cold-therapy 連 body-temperature 與 injury-types |
| 8 | 10 基護 B | 鼻胃管給藥已寫在 non-parenteral-medication；管灌與 TPN 頁連過去，TPN 走中心靜脈的原則連 iv-therapy | non-parenteral-medication、iv-therapy | ✅ 2026-10-22 enteral-parenteral-nutrition 互連 non-parenteral-medication#ng-tube-medication、iv-therapy#nutrition-routes |
| 8 | 13 社區 B | 老人跌倒危險因子(內因、外因)與居家防跌已寫在 patient-safety-environment#falls(收了 111-2_PC_078、113-3_PC_049、108-1_PC_055、111-1_PC_067)；衰弱評估與防跌健康促進題(114-1_PC_031、106-2_makeup_PC_064、114-2_PC_048)留社區 B | patient-safety-environment#falls | ✅ 2026-10-23 13b(114-1_PC_031、106-2_makeup_PC_064 已在 13a health-promotion；114-2_PC_048 在 older-adult-chronic-disease#frailty；patient-safety-environment 第 5 點改連結) |
| 8 | 14 肌骨皮膚 | 燒傷輸液 Parkland 公式已寫在 iv-therapy；燒傷照護頁連過去，不重寫公式 | iv-therapy | ✅ 2026-10-24 burns#resuscitation 連 iv-therapy#burn-fluids，iv-therapy 改連 burns |
| 8 | 15 心血管 | 心律不整標籤留給心律不整頁(pulse-blood-pressure 只寫脈律特徵)；心尖脈與脈搏短絀連 pulse-blood-pressure | pulse-blood-pressure | ✅ 2026-10-26 arrhythmias(dzTags 心律不整等；互連 pulse-blood-pressure#abnormal-pulse) |
| 8 | 16 產兒 | 新生兒體溫散失與保暖(body-temperature 只寫一般原則)；兒童注射部位與兒童餵藥已寫在 injections、non-parenteral-medication，兒科頁連過去 | body-temperature、injections | ✅ 16e 保暖(newborn-adaptation#thermoregulation、preterm-infant#thermoregulation)；兒童注射與餵藥連結留第 17 輪兒科頁(17a 新頁沒有給藥段，兒童給藥仍在 injections、non-parenteral-medication) |
| 8 | 17 藥理 | 藥動學與藥物交互作用深入內容(medication-administration-principles 只寫給藥相關的概述) | medication-administration-principles | ✅ 17b drug/antidotes(解毒劑總表)、drug/pharmacokinetics-pharmacodynamics(藥動學與交互作用) |
| 9 | 10 基護 B | 尿液與 24 小時尿液檢體已寫在 urinalysis#nursing(admission-discharge-specimens 只連過去)；尿滯留、導尿、膀胱訓練與凱格爾技術、基護 Ch15 尿失禁與尿滯留題寫在 urinary-elimination；做好後把 urologic-disorders 兩處「基本護理排泄頁另外整理」改成連結，並連 urologic-disorders#incontinence | urinalysis#nursing、urologic-disorders#incontinence | ✅ 2026-10-22 urinary-elimination(urologic-disorders 兩處改連結、互連 #incontinence) |
| 9 | 11 消化 | 腸阻塞的體液變化(106-2_MS_016)、肝硬化腹水護理(113-1_MS_007)；體液電解質機轉在 fluid-electrolytes，不重寫 | fluid-electrolytes | ✅ 2026-10-22 lower-gi-disorders#obstruction(連 fluid-electrolytes#volume-deficit)、liver-cirrhosis#ascites |
| 9 | 12 血液 | 造血藥物頁(EPO、鐵劑、葉酸)：CKD 頁腎性貧血段先寫文字，做好後回補連結 | chronic-kidney-disease#anemia | ✅ 2026-10-22 hematinics；chronic-kidney-disease#anemia 已回補連結 |
| 9 | 14 肌骨 | 骨質疏鬆與尿路結石(107-1_MS_020)；骨鬆疾病頁做好後把 urologic-disorders#stone-nursing 的骨鬆文字改成連結 | urologic-disorders#stone-nursing | ✅ 2026-10-23 urologic-disorders#stone-nursing 已改連 osteoporosis#clinical |
| 9 | 15 急重症 | 溺水照護(107-1_MS_078)；CRRT 已在 dialysis-crrt#crrt | dialysis-crrt#crrt | ✅ 2026-10-27 emergency-nursing#drowning |
| 9 | 16 產科(生解 Ch13) | 男性生殖：睪丸腫瘤(病理 Ch15 3 題)、男性生殖器解剖(生解 Ch13)、精索扭轉與靜脈曲張、成人包莖；前列腺疾病已在 urologic-disorders、兒童隱睪與包莖已在 pediatric-genitourinary | urologic-disorders#prostate-cancer、pediatric-genitourinary | ✅ 2026-10-27 16a male-reproductive-system、male-reproductive-disorders |
| 10 | 14 肌骨 | 骨折、石膏與牽引照護細節、拐杖以外的術後活動、關節置換術後擺位(基護只寫石膏 5P 與拐杖步態) | activity-immobility#cast-care、activity-immobility#crutches | ✅ 2026-10-23 fractures、osteoarthritis#tha |
| 10 | 10 基護 B(H、I 組) | 傷口分類、癒合、敷料與傷口護理(課本 Ch19)；壓力性損傷頁只寫分期與預防，傷口處理連過去 | pressure-injury#treatment | ✅ 2026-10-22 分類、顏色、癒合、評估寫在 bandaging#wounds；**敷料種類與換藥步驟移交第 14 輪**(題本基護無對應章) |
| 10 | 14 肌骨皮膚 | 敷料種類(紗布、透明膜、親水性膠體、藻酸鹽、泡棉)與換藥步驟；分類與評估已在 bandaging#wounds，連過去不重寫 | bandaging#wounds | ✅ 2026-10-24 寫在 wound-dressings，bandaging、pressure-injury 互連 |
| 10 | 16 產科 | 孕期與哺乳營養(DRIs 孕期增加量、葉酸、鐵)；基護營養頁只寫一般族群 | nutrition-assessment-diets#special-populations | ✅ 2026-10-27 16b prenatal-assessment、prenatal-care |
| 10 | 11 消化 | 傾倒症候群飲食、膽道閉鎖與兒童肝病飲食；管灌合併症與治療飲食已寫在基護營養兩頁 | enteral-parenteral-nutrition#complications、nutrition-assessment-diets#composition | ✅ 2026-10-22 upper-gi-disorders#dumping、pediatric-gi#biliary-atresia(nutrition-assessment-diets 已改連結) |
| 10 | 11 消化 | 痔瘡病因與痔瘡術後照護(108-1_MS_016、110-2_MS_017、113-3_MS_007、108-2_BM_040、108-1_BM_036)、瀉劑與止瀉劑藥理(105-1_BM_060、108-1_BM_062、108-2_BM_058、109-2_BM_061、105-2_BM_058、107-1_BM_061)；便秘護理與灌腸已寫在 bowel-elimination，只連過去 | bowel-elimination#constipation | ✅ 2026-10-22 lower-gi-disorders#hemorrhoids、gi-drugs#laxatives 與 #antidiarrheals |
| 10 | 16 產科 | 產後尿瀦留與膀胱評估(105-1_OP_014、106-1_OP_021、107-2_OP_021、111-2_OP_011、113-1_OP_014)、產後便秘與痔瘡(105-1_OP_024、106-2_makeup_OP_024)、母乳便(112-1_OP_022)；誘尿與凱格爾已寫在 urinary-elimination | urinary-elimination#postpartum-retention、urinary-elimination#kegel | ✅ 16d(postpartum-care#elimination；105-1_OP_014 在 intrapartum-care、106-2_makeup_OP_024 也放 postpartum-care#bowel) |
| 11 | 16 產科＋新生兒 | 早產兒與新生兒腸胃、成熟度、餵食與脫水題(105-1_OP_056、106-2_OP_056、110-1_OP_047、111-2_OP_053、112-1_OP_053、113-3_OP_034 等兒科 Ch03–04 未涵蓋題)、壞死性腸炎；pediatric-gi 只寫嬰兒腸胃特性與 109-2_OP_056(**16-0 拆分**：住院兒童的反應與術前準備(兒科 Ch05)已移第 17 輪，見下方新列) | pediatric-gi#infant-physiology、pediatric-gi#hernia | ✅ 16e(preterm-infant#feeding、#nec) |
| 11 | 12 血液 | 惡性貧血與 B12(113-2_MS_021 已放 lower-gi-disorders#malabsorption)、缺鐵性貧血與痔瘡出血；血液頁連過去 | lower-gi-disorders#malabsorption | ✅ 2026-10-22 anemias#pernicious、#iron-deficiency；lower-gi-disorders#malabsorption 已改連結 |
| 12 | 13 社區 B | 菸害防制：菸草使用障礙症 3 題(110-2_BM_055、114-3_PC_035、115-2_PC_035)與尼古丁戒斷症候群 1 題(111-1_PC_078)目前沒有頁面 dzTags 收，寫衛教健促或中老年頁時加進 dzTags | tag-merge-round12.md 第五節 | ✅ 2026-10-23 13a health-promotion dzTags(菸害防制法段，戒菸藥連 addiction-treatment-drugs#smoking-cessation) |
| 13 | 14 肌骨 | 骨質疏鬆社區衛教 10 題已在 older-adult-chronic-disease#osteoporosis(T 值、危險因子、負重運動)；骨鬆疾病頁做好後兩頁互連，社區那節保留衛教、病理與藥物連疾病頁 | older-adult-chronic-disease#osteoporosis | ✅ 2026-10-23 兩頁互連 |
| 13 | 14 肌骨 | 痛風社區衛教(高普林蔬菜、啤酒、喝水)已在 older-adult-chronic-disease#lifestyle；痛風疾病頁連過去 | older-adult-chronic-disease#lifestyle | ✅ 2026-10-23 osteoarthritis#gout 連過去 |
| 13 | 15 急重症 | 學校 CPR 題(106-1_PC_070，30 : 2)在 school-health#health-center，目前沒有 CPR 頁；CPR 頁做好後把「見第 15 輪內外急重症」改成連結 | school-health#health-center | ✅ 2026-10-27 已改連 [[cpr]] |
| 13 | 16 產科 | 婦幼頁已寫產檢 14 次、母嬰親善、哺乳法規、優生保健法、人工生殖法(社區角度)；產科頁做好後互連，產後哺乳護理與產檢細節寫產科頁 | maternal-child-health | 產檢細節 ✅ 16b(已互連)；產後哺乳 ✅ 16d(breastfeeding) |
| 14 | 16c 分娩 | 胎頭顱縫、囟門、胎頭徑線 3 題(114-3_OP_009、106-1_OP_014、108-2_OP_025，主章生解 Ch03 顱骨)；skeletal-system 只寫顱骨，胎頭寫在分娩機轉頁 | tag-merge-round14.md 第五節 | ✅ 2026-10-27 labor-process#fetal-skull |
| 14 | 16 產科 | 14-0 已合併產科標籤 57 題中的產科部分(正常分娩、妊娠合併心臟病、生產疼痛等)，16-0 不用再做產科標籤合併，只重查新增標籤 | tag-merge-round14.md | ✅ 2026-10-27 16-0 只重查生解 Ch13–14、病理 Ch15、兒科 Ch03–04，改 7 題(tag-merge-round16.md) |
| 14 | 17 兒科 | 兒科 Ch16 燒燙傷段 11 題已在 burns(嬰兒九分法、沖脫泡蓋送、兒童尿量、ABA 兒童分級、青少年隱私)；17 寫事故傷害頁時連 [[burns#pediatric]]，不重寫 | burns | ✅ 17a pediatric-injuries 連 burns#pediatric |
| 15 | 17 藥理毒理 | 中毒總表與解毒劑：emergency-nursing#poisoning 只寫處置原則、巴拉刈、強酸強鹼；有機磷在 cholinergic-drugs；17 的毒理頁寫解毒劑總表(中毒解毒劑 10 題)並互連 | emergency-nursing#poisoning、cholinergic-drugs#organophosphate-poisoning | ✅ 17b drug/antidotes(解毒劑總表)、drug/pharmacokinetics-pharmacodynamics(藥動學與交互作用) |
| 15 | 17 兒科通論 | 兒童誤食(鐵劑、乙醯胺酚、鉛、鹼水、清潔劑，115-2_OP_027、109-2_OP_045、109-1_OP_041、110-1_OP_054、114-2_OP_027 等)、兒童溺水與事故傷害；急救步驟連 cpr、溺水與低體溫連 emergency-nursing#drowning、#hypothermia | cpr、emergency-nursing | ✅ 17a pediatric-injuries#poisoning(emergency-nursing#poisoning 改成連過去) |
| 15 | 16 新生兒 | 新生兒與早產兒保暖題(112-1_OP_030、105-1_OP_029、112-2_OP_052、110-2_OP_053、106-1_OP_054，dz:低體溫)未收；成人意外低體溫在 emergency-nursing#hypothermia | body-temperature、emergency-nursing#hypothermia | ✅ 16e(5 題都收在 newborn-adaptation、preterm-infant) |
| 16 | 17 兒科通論 | 住院兒童的反應與術前準備(兒科 Ch05)：原本寫在第 11 輪移給 16 的列裡，兒科 Ch05 已移第 17 輪，16-0 拆出來 | pain-management(兒科 Ch05 疼痛) | ✅ 17a hospitalized-child |
| 16c | 16d 產後 | 產後出血(胎盤碎片殘留、子宮收縮劑比較)、會陰傷口照護、剖腹產術後護理：16c 頁留「(16d 待寫)」共 5 處(labor-process、intrapartum-care、labor-complications、pituitary-hormones) | intrapartum-care#fourth-stage-care、labor-complications#cesarean | ✅ 16d(連到 postpartum-care、postpartum-complications) |
| 16c | 16e 新生兒 | Apgar 表暫放 intrapartum-care#third-stage-care(含 107-1_OP_046)，16e 新生兒頁決定搬過去再嵌入；新生兒抽吸(106-2_OP_011)、產瘤與頭血腫比較、早產兒照護連結共 5 處「(16e 待寫)」 | intrapartum-care、labor-process、labor-complications | ✅ 16e(Apgar 搬到 newborn-assessment#apgar 並嵌入) |

## 版權優先與 UpToDate 使用原則(2026-10-04 起)

**內容以不碰版權為第一優先。** UpToDate、原文書、國考書都有版權，一視同仁：只當參考，內容用自己的話與結構重寫，不複製原文、不重製原圖或整張表。引用標注是誠信與追溯用，**不等於取得複製的授權**；照抄的段落就算有標注，仍然要改寫。

使用者不再為了新批次大量匯出 UpToDate(耗時，也有帳號被注意的風險)。權衡：UpToDate 的正確度通常最好，所以不放棄它，但改成「已匯出的照用、新增的少量確認」。從第 2 輪起：

1. **預設不要使用者搜尋 UpToDate。** 優先用已持有的資料(已匯出的 UpToDate、原文書與國考書、OpenStax)，再用公開指引、學會共識、衛福部與疾管署、PubMed 開放全文。
2. **只有真的需要才請使用者查**：持有的資料互相矛盾、或只有 UpToDate 才有的關鍵數字或流程。每輪結束時一次列出「需確認清單」(最多約 5 項，每項寫清楚要查哪個主題、要確認哪一句)，使用者用確認的方式回覆。2026-10-06 起不限 5 項，改為整輪結束列一次、不要太多。
3. **不因為少了 UpToDate 而降低正確度與深度**：
   - 每個主題先列「必備內容」(定義、機轉、診斷、治療、護理、併發症、國考考點)，逐項補齊；補不齊的標「待核對」，不要用印象填。
   - 數字、劑量、分期與分級，至少有一個權威來源；只有一個二手來源的，標注並列入確認清單。
   - 國考書與歷屆題的考點若與新指引不同，保留舊考點並標注新指引。
   - 每輪結束把「沒有 UpToDate 支持」的主題列在進度檔，方便日後抽查。
4. **標注規則**(各種文件都要做)：
   - 頁面：來源當行標注(篇名＋網址或書名頁碼)，frontmatter 的 sources 也要列。
   - 來源包 `多保命護理分章/sources/<批次>.md`：每個來源寫授權狀況(公開／付費訂閱／書籍有版權／CC)與使用方式(只參考／可引用數字)。
   - 進度檔與掃描報告：凡有版權疑慮的頁面(從付費來源整理、結構貼近原文、有圖表)標「版權注意」，寫明來源與處理(已改寫／待改寫／待決定)。
   - 圖與表：優先 PD、CC0、CC BY 或自己畫；CC BY-SA 可用但要登記在 `docs/image-license-review.md`(`scripts/image-license-review.py` 產生)，之後由使用者換成 AI 圖；NC、ND 與 OpenStax 的圖不用。
5. **既有頁面**：已引用 UpToDate 的約 60 篇不用重做，但依 1a 掃描處理版權風險。

### 第 1a 步：既有內容掃描(UpToDate 與其他受版權保護來源)

目的：確認發布的 App 內容是自己整理的文字，不是複製。

1. 範圍：`content/knowledge/` 全部 189 篇。先掃引用 UpToDate 的約 60 篇，再掃其餘。
2. 檢查項目(腳本 `scripts/source-scan.py`，2026-10-04 已跑完第一次，結果見 [uptodate-scan.md](uptodate-scan.md))：
   - 與 `相關資源/` 內 UpToDate 匯出檔（精神 38、癌症 40、感染 129、免疫）逐段比對，找連續相同的詞串（英文 8 字以上或中文 20 字以上）與整段結構幾乎照抄的段落。
   - 疑似直接翻譯原文的長段落（句句對應原文順序）。
   - 圖片、表格、流程圖：有沒有 UpToDate 的圖或整張表重製。
   - 引用格式：只留篇名與網址，不貼原文。
3. 處理：
   - 照抄或近似照抄 → 用自己的話與結構重寫，或換成公開來源。
   - 單純事實（數字、藥名、診斷標準）→ 可保留，保持來源標注。
   - 結果寫進 `docs/uptodate-scan.md`：每篇一行（無問題／已改寫／待決定），並附掃描腳本(放 `多保命護理分章/analysis/`)。
4. 之後每一輪的成品，在存檔前都先跑同一支比對腳本。
5. 免疫批次(1.5 輪)已匯出的資料照舊使用，不再追加。
6. 掃描範圍同時涵蓋原文書與國考書：有沒有整段翻譯或照抄；結果同樣記在 `docs/uptodate-scan.md`(檔名保留，內容含所有來源)。

## 各批次需要的資料

(2026-10-03 第 0 輪 0d 整理。資料放在 `多保命測驗/相關資源/` 對應的子資料夾。)

### 已經有的

| 資料 | 位置 | 可以用在 |
|---|---|---|
| OpenStax：解剖生理 2e、基護、臨床護理技術、內外、產科新生兒、精神、藥理、微生物、族群健康 | `相關資源/*.pdf` | 各批次撰寫參考(依授權規則只參考、不複製) |
| 國考書：精神、護理行政(捷徑)、兒科、內外上下冊 | `相關資源/國考書（最終參考用）/` | 最後核對考點 |
| UpToDate 匯出：精神 38、癌症 40、感染 129 篇、免疫 | `相關資源/精神科相關`、`癌症相關`、`感染相關`、`免疫相關` | 精神收尾可直接沿用；也是 1a 比對的基準 |
| 心血管指引：ACLS/BLS/PALS/NRP 流程圖、2025 ACS、2024 台灣心衰竭、2022 台灣高血壓、DAROC 第 1 型糖尿病 | `相關資源/相關指引/` | 心血管補完、產科新生兒(NRP) |
| 行政法規與評鑑資料 | `相關資源/行政/` | 已用完 |
| Williams Obstetrics(舊版) | 使用者手上 | 產科：解剖、妊娠生理、產程機轉 |

### 我可以自己上網拿的(不用你準備)

| 批次 | 公開資料 |
|---|---|
| 精神收尾 | 精神衛生法(全國法規)、失智症防治照護政策綱領、自殺防治中心資料 |
| 內分泌 | 內分泌學會公開的衛教與指引摘要 |
| 呼吸 | GINA 2025、GOLD 2025(官網免費下載)、胸腔暨重症醫學會指引 |
| 社區 A、B | 全國法規、長照 2.0、衛福部統計處生命統計、國健署、疾管署 |
| 腎與體液 | KDIGO 2024 CKD、KDIGO AKI(免費)、腎臟醫學會衛教 |
| 消化 | H. pylori 台灣共識、AASLD 指引(免費) |
| 血液免疫 | 輸血作業相關規範、風濕病醫學會衛教 |
| 神經 | 腦中風學會指引、Brain Trauma Foundation |
| 肌骨皮膚 | 骨質疏鬆學會指引；解剖圖用 Wikimedia Commons 的 Gray's Anatomy(PD)，或逐張確認授權為 CC BY 的 OpenStax 圖 |
| 產科 | 國健署孕婦健康手冊、兒童健康手冊 |
| 基護 | 醫學中心公開的衛教單張、藥品仿單 |

### 需要你補的(依需要的先後排序)

| 優先 | 資料 | 用在哪一輪 | 為什麼 |
|---|---|---|---|
| 1(改為視需要) | **UpToDate 確認**：精神收尾 — dementia(含 BPSD)、delirium、alcohol withdrawal、opioid use disorder、anorexia/bulimia、GAD、panic、OCD、PTSD、personality disorders、somatic symptom disorder | 2 | 現有 38 篇主要是思覺失調、情緒障礙 |
| 2(改為視需要) | **UpToDate 確認**：內分泌 — Graves/hyperthyroidism、hypothyroidism、thyroid storm、Cushing、adrenal insufficiency、diabetes insipidus、SIADH、pheochromocytoma、hyperparathyroidism | 4 | 台灣沒有完整的公開甲狀腺、腎上腺指引 |
| 3 | **病理學課本**(Robbins Basic Pathology 任何版本，或中文病理學課本)＋**病理國考書** | 5 | 發炎、細胞死亡、修復的深度需要病理課本；OpenStax 沒有病理 |
| 4 | **重症護理學課本**(中文或英文都可) | 6 起 | 呼吸器、胸管、CVC、A-line、CRRT、IABP、ECMO 這些器材頁沒有公開的護理資料 |
| 5 | **社區衛生護理學國考書** | 7 | 核對考點(其餘用政府資料) |
| 6 | ✅ 2026-10-20 已提供：**基本護理學上下冊**＋**內外科護理技術**(`國考書（最終參考用）/`，掃描檔要 OCR；技術書只當參考) | 8、10 | 技術步驟要以台灣課本的做法為準；OpenStax Clinical Nursing Skills 是美國做法 |
| 7 | ✅ 2026-10-23 已提供：**產科護理學**(`國考書（最終參考用）/產科_產科護理學.pdf`，掃描檔，第 13-0 背景 OCR)；Williams 如果可以，掃描或拍 PDF | 16 | 產科題數多(956 題)，目前只有 OpenStax |
| 8 | **生解、藥理國考書** | 14、17 | 最後核對考點 |
| 隨時 | 每輪結束的 **UpToDate 需確認清單**(整輪結束列一次，不限 5 項但不要太多) | 每批 | 不再整批匯出；見上方「UpToDate 使用原則」 |

沒有的話不會卡住：我會改用公開資料加上 OpenStax，並在進度檔標注「待用課本核對」。
