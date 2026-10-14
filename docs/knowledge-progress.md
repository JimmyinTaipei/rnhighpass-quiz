# 知識庫製作進度(接續用)

> **任何知識庫工作開始前先讀這份檔案。** 每完成一篇或一個步驟就更新，暫停(額度用完、中斷)後，新的 session 讀這份就能接著做。
> 定位與寫作規則見 [positioning.md](positioning.md)；批次順序與資料需求見 [knowledge-roadmap.md](knowledge-roadmap.md)。

## 目前輪次

- **輪次**：第 3 輪 神經與感官(3a 解剖生理＋藥理、3b 神經疾病、3c 感官；含藥理 Ch04 止痛麻醉)；約 20 篇、3-0 準備＋A–K 組
- **計畫檔**：`~/.claude/plans/plan-glowing-sunset.md`(範圍、圖片做法與問題、標籤對照、頁面分組)
- **狀態**：計畫已核准(2026-10-06)；**3-0、A–K 組全部完成**(K 組 2026-10-14)；**Supabase 已寫回、workers.dev 已部署(2026-10-14)** → **第 3 輪全部完成**；下一輪是第 4 輪內分泌(含腦下垂體 9 題)
- **使用者決定(2026-10-06)**：
  1. 做「標籤疊加元件」(`::labeled-figure`＋`public/knowledge-images/labels/*.json`，中文／英文／隱藏切換；BY-SA 原圖不改檔)
  2. 第二層擬真解剖底圖以 Servier Medical Art(CC BY 4.0)為主，Gray's(PD)／Blausen(CC BY 3.0)補缺
  3. 藥理 Ch04 止痛麻醉併進本輪
  4. 標籤：腰椎椎間盤突出 → 椎間盤突出；腦動脈瘤 → 動脈瘤；普利昂蛋白疾病 → 庫賈氏病；子類型、症狀 vs 疾病、腦損傷、周邊神經病變 vs 損傷維持不合併；脊髓膜膨出與脊髓脊髓膜膨出是不同疾病，維持
  5. 3c 感官**照常做**(使用者 2026-10-06 決定；J 組在下次工作日，禮拜五或之後)
  6. 腦瘤**新增一頁** disease/brain-tumors(只收成人腦瘤與脊髓腫瘤)；**腦下垂體相關題目**(經蝶骨手術、尿崩症、伽瑪刀治腦下垂體腫瘤、腦下垂體中風、雙顳側偏盲)**留到內分泌輪**
- **規則**：沿用第 2 輪(動到 04／05 兩邊同步並記錄、Supabase 寫回前先問、整輪列一次需確認清單、圖片登記 credits 與 image-license-review)；每組圖先截圖給使用者目視確認再寫頁面

## 第 3 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 3-0a | 神經範圍同義標籤統一(`docs/tag-merge-neuro.md`、`analysis/tag_fixes/2026-10-06_neuro_*`)：04／05 同步改 162 題、逐題記錄、備份在 `_archive/backup_20261006_neuro_tags_04/05`；taxonomy neuro 拆出 nsaids、anesthetics、cholinergic-drugs、adrenergic-drugs，nsaids-acetaminophen 改用 nsaids 組；build 通過；**追加跨系統合併 76 題**(心臟衰竭、高低血鈉鉀鈣、肥胖、解毒劑、食物中毒，見 tag-merge-neuro.md 第七節) | ✅ 2026-10-06(**Supabase 等神經做到一段落再寫回**(使用者決定)，待使用者決定；同步後依 tag-merge-neuro.md 第六節收尾) |
| 3-0b | 圖片盤點 `docs/sources/neuro-images.md`＋候選縮圖總覽：42 張(原創 17、Servier 23、Lynch 1、NEI 1 組)，BY-SA 0 張；Servier 從官網 PPTX 取向量圖 | ✅ 2026-10-06(使用者已同意 Servier 風格、#11 重標、皮節 6 點) |
| 3-0c | 來源包 `docs/sources/neuro.md`(已確認 AHA/ASA 2026 AIS、台灣腦中風學會 2025 溶栓與 2023 取栓、ILAE 2025 發作分類、BTF 第 4 版、腦死判定準則；新舊說法並列表) | ✅ 2026-10-06 |
| 3-0d | 標籤疊加元件：`::figure` 指令(build-knowledge 讀取並檢查 `public/knowledge-images/labels/*.json`)、`LabeledFigure.tsx`(中文／English／隱藏自我測驗)、`ZoomableFigureImage` 加 overlay 與 toolbar(手機改第二列)；試做 servier-brain-lobes.svg(由 PPTX 向量轉出)放在 dementia#types；`scripts/servier-pptx-to-svg.py`；桌機與手機截圖、一般圖回歸測試通過 | ✅ 2026-10-06(待使用者目視確認) |
| A | physiology/neuron-synapse、physiology/spinal-cord-spinal-nerves(生解 Ch05 總論、神經組織學、神經生理學基礎、脊髓與脊神經四節 82 題全部 100%；圖 9 張：Servier 6、原創 3) | ✅ 2026-10-06(圖待使用者目視確認) |
| B | physiology/brain-anatomy、physiology/cranial-nerves(生解 Ch05 腦與腦神經 79、運動途徑與整合功能 15、綜合題型 3 全部 100%；圖 9 張：Servier 8、Lynch 1) | ✅ 2026-10-06(圖待使用者目視確認) |
| C | physiology/autonomic-nervous-system、drug/cholinergic-drugs、drug/adrenergic-agonists(生解 Ch05 自主神經系統 28 題、藥理 Ch02 86 題全部 100%；原創圖 autonomic-pathways；β、α 阻斷劑頁補題號) | ✅ 2026-10-06 |
| D | drug/antiepileptics、drug/antiparkinson-drugs(含 ALS)、drug/anesthetics、drug/gout-drugs(Ch04 痛風一併處理)；nsaids-acetaminophen、opioids、anxiolytics-hypnotics 補題號(藥理 Ch03 150/150、Ch04 105/106，剩偏頭痛 CGRP 1 題留 H 組) | ✅ 2026-10-06 |
| E | care/neuro-assessment、disease/increased-icp、device/icp-monitoring(第一篇 device 頁)；內外 Ch15 評估 32/32、常見問題 31/31，另含兒科 GCS 與兒童顱內壓題 | ✅ 2026-10-06 |
| F | disease/head-injury、disease/spinal-cord-injury(內外 Ch15 創傷 38/43，剩椎間盤突出 5 題留 H 組；另含基護、兒科、社區相關題) | ✅ 2026-10-06 |
| G | disease/stroke、disease/epilepsy(內外 Ch15 腦血管 22/22、其他腦神經 17/18(剩叢集性頭痛留 H)、綜合 5/5；另含基護中風擺位與關節運動、兒科癲癇題) | ✅ 2026-10-06 |
| H | disease/parkinson-disease、disease/neuromuscular-demyelinating、disease/cranial-nerve-spine-disorders(內外 Ch15 除「腫瘤與感染」外全部 100%；藥理 Ch04 106/106) | ✅ 2026-10-06 |
| I | disease/pediatric-neuro；另加 disease/brain-tumors(使用者決定；腦下垂體題留內分泌輪)(兒科 Ch13 75/75、內外 Ch15 215/221(剩 6 題腦下垂體)、病理 Ch18 32/33(剩眼睛 1 題留 J)) | ✅ 2026-10-06 |
| J | physiology/special-senses、disease/eye-disorders、disease/ear-disorders(生解 Ch06 33/36(剩 3 題腦下垂體留內分泌)、內外 Ch17 93/93、病理 Ch18 33/33；另含基護與兒科點眼點耳、早產兒視網膜病變、學童視力、職業性白內障與噪音) | ✅ 2026-10-06 |
| K | 收尾：回補連結 37 處(38 條)、涵蓋報告、需確認清單、image-license-review(53 張需替換 0)；眼耳等標籤圖修正 | ✅ 2026-10-14(Supabase 已寫回、已部署) |

## 進行中(第 3 輪)

- **K 組完成(2026-10-14)**
  - **使用者回報的圖修正**：眼球切面前段(角膜、前房、虹膜三點互換)重放、視網膜與脈絡膜指標線交叉、耳咽管點落在膜上、文字壓在指標線上；左側標籤改 align end、右側改 align start，同側文字順序和點一致
  - 元件 `LabeledFigure.tsx`：有指線的標籤加白底(線終點藏在字下，18 個 labels 檔都受惠)；往右延伸的標籤碰到圖邊可換行；青光眼兩圖右側標籤改從左起頭；「前庭耳蝸神經(VIII)」改為「前庭耳蝸神經」(手機放不下)
  - 回補連結 37 處：dementia、cns-infections(×3)、delirium、pediatric-cancers(×2)、thrombolytics、antiplatelets、hypertension、aminoglycosides、loop-diuretics、glycopeptides、cancer-treatment-toxicities、antipsychotics(×2)、anxiolytics-hypnotics、mood-stabilizers、pediatric-respiratory-infections(×2)、diabetes、autoimmune-diseases、anti-dementia-drugs、inotropes、antihistamines-autacoids、antidepressants、clostridium-botulinum-tetani、head-neck-cancers、end-of-life-care、blood-pressure-regulation、cardiac-output、neurotransmitters-psychiatry(×2)、pain-management、beta-blockers、asthma-drugs、nsaids-acetaminophen
  - 待核對解決：癲癇駕照依道路交通安全規則第 64 條(最近 2 年以上未發作的診斷證明)；溶栓後 < 180 確認(2026 AHA／ASA 以 < 140 對照 < 180)
  - 驗證：build 通過(234 篇、1620 條連結)、resolver 與 export 重跑、source-scan 第 3 輪頁面無重疊、image-license-review 53 張需替換 0 張；涵蓋 4780/8960

## 第 3 輪需確認清單(2026-10-14 K 組整理)

1. ✅ **Supabase 寫回(2026-10-14)**：`sync_all.py` 完成(questions 8960、question_tags 16730)；scratchpad `prune_tags.py` 刪除 259 筆來源已不存在的 question_tags(本輪合併掉的舊名)，刪後 DB＝來源 16730；taxonomy 移除 92 個已無題目的舊名(止痛、麻醉、巴金森、膽鹼、擬交感、心衰竭用藥等)並刪掉空的 autonomic-drugs 組；pediatric-cancers、heart-failure、potassium、pediatric-neuro、parkinson-disease、bnp、echocardiography、arni、loop-diuretics、digoxin、inotropes、potassium-sparing-diuretics、nitrates 的 dzTags 與 tag= 舊名清掉(keyword 正規式保留)；重跑 build、resolver、export。仍有題目在用、所以保留的舊名：中樞神經作用藥物、止痛用藥、膽鹼性藥物
   - 部署：`NODE_OPTIONS=--max-old-space-size=8192 CLOUDFLARE_ACCOUNT_ID=… pnpm cf:deploy`(預設記憶體在 TypeScript 檢查時會 OOM)→ https://rnhighpass-quiz.jimmyni312.workers.dev
2. **溶栓前血壓 < 185/110**：2026 AHA／ASA 指引的數值在圖表裡，網頁轉述沒寫出來(stroke 頁已標)
3. **周邊神經再生速度每天 1–3 毫米**：依記憶寫(neuron-synapse 頁已標)
4. 以下頁面寫成「教科書參考值／依醫囑／依各院規範」，不影響考題答案，有空再核對
   1. phenytoin、carbamazepine、valproate 治療濃度
   2. 新生兒各反射消失時間
   3. 膀胱訓練成功的餘尿標準(< 50–100 mL)
   4. ritodrine 母親心跳通知門檻(約 120 次／分)
   5. 局部麻醉加 epinephrine 用在手指的現行做法
5. **未做的圖**：NEI 視力模擬照、視網膜分層圖、淚器圖(內容用表格；要的話再找)

- **J 組完成(2026-10-06)**
  - 新頁：`physiology/special-senses`(接受器、味覺嗅覺與舌乳頭表、眼球三層表、房水循環、桿錐細胞比較、調節與屈光表、視覺徑路與損傷表、淚器、耳的三部分、傳導性與感覺神經性比較、平衡)；`disease/eye-disorders`(白內障、青光眼兩型比較、視網膜剝離、糖尿病視網膜病變與黃斑部退化、早產兒視網膜病變、結膜炎、兒童視力保健依國健署 Eye 眼 6 招、點眼藥步驟)；`disease/ear-disorders`(聽力喪失兩型與音叉試驗、聽力分級、與聽障者溝通、梅尼爾氏症、BPPV 等眩暈表、外耳與中耳疾病表、滴耳藥)
  - 圖：Servier 眼科與耳鼻喉 PPTX 轉出 4 張(眼球切面、開放隅角、閉鎖隅角、耳朵)＋labels；原創 visual-pathway、refraction；標籤逐點放大格線核對(虹膜、角膜、鞏膜三層、視神經、鼓膜、聽小骨已修正)
  - 既有頁補題：pediatric-respiratory-infections(鼻部手術 2 題，補鼻樑冰敷與鼻出血就醫)、head-neck-cancers(鼻咽癌 1 題)
  - **留到內分泌輪**：生解 Ch06 視覺 3 題腦下垂體腫瘤壓迫視交叉(110-2_MS_003、105-2_MS_006、112-1_BM_001)
  - 未做：NEI 視力模擬照、視網膜分層圖、淚器圖(內容用表格與文字)
  - 驗證：build 通過(233 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、image-license-review 53 張需替換 0 張；涵蓋 4780/8960

- **I 組完成(2026-10-06)，神經部分全部做完**
  - 新頁：`disease/pediatric-neuro`(腦性麻痺分型表與進食擺位、水腦與 V-P shunt、神經管缺陷表與術前後護理、葉酸依國健署、早產兒腦室內出血、雷氏症候群、新生兒反射表)；`disease/brain-tumors`(oncology、alsoIn neuro；種類表、依位置的症狀表、手術與放療含伽瑪刀與 I-125、temozolomide、dexamethasone、開顱術後天幕上下姿勢、尿崩症與 SIADH、脊髓腫瘤)
  - 既有頁補充：spinal-cord-spinal-nerves 新生兒反射改連到 pediatric-neuro 並統一擁抱反射時間；pediatric-cancers 補髓母細胞瘤特徵與 2 題；parkinson-disease 補杭汀頓氏病 1 題；stroke 補液化壞死 1 題
  - **留到內分泌輪**：腦下垂體相關 6 題(110-2_MS_071、109-2_MS_007、108-1_MS_073、112-1_MS_001、111-2_MS_004、110-2_MS_003)
  - **待核對**：新生兒各反射消失時間為教科書參考值(頁面已標)
  - 驗證：build 通過(231 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、image-license-review 47 張需替換 0 張；涵蓋 4697/8960

- **H 組完成(2026-10-06)**
  - 新頁：`disease/parkinson-disease`(病理與次發性原因含錳中毒、四大主徵表、非動作症狀、治療、護理十項、亨丁頓舞蹈症)；`disease/neuromuscular-demyelinating`(四病比較總表、重症肌無力、肉毒桿菌中毒、格林-巴利、漸凍人、多發性硬化症)；`disease/cranial-nerve-spine-disorders`(三種頭痛比較表與 CGRP 藥、三叉神經痛、貝爾氏麻痺、椎間盤突出與術後背架、腦死判定準則全流程)
  - 既有頁：cranial-nerves 的腦死「待核對」已依《腦死判定準則》(101-12-17 修正)全文補上來源
  - 頁面已註明：riluzole「唯一」是舊說法；GBS 類固醇無效(EAN／PNS 2023)
  - **未涵蓋**：內外 Ch15「腦瘤與脊髓腫瘤」8 題(成人腦瘤、腦下垂體腫瘤與經蝶骨手術、伽瑪刀、腦下垂體中風)沒有對應頁；待使用者決定 K 組是否新增 disease/brain-tumors(腦下垂體部分也可留內分泌輪)
  - 驗證：build 通過(229 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、DOI 可連；涵蓋 4661/8960

- **G 組完成(2026-10-06)**
  - 新頁：`disease/stroke`(種類表、危險因子、TIA、左右腦比較、急性期溶栓與取栓、出血性與蜘蛛膜下腔出血、吞嚥、擺位表與關節運動、安全與單側忽略、排泄)；`disease/epilepsy`(2025 ILAE 與舊稱對照、強直陣攣過程、發作時處置、重積狀態、長期衛教、兒童與生酮飲食；熱性痙攣連到 pediatric-respiratory-infections)
  - 頁面已註明新舊說法：溶栓 4.5 小時內 tenecteplase 0.25 mg/kg 或 alteplase 0.9 mg/kg(2026 AHA／ASA；舊題 3 小時)、取栓經影像篩選最長 24 小時、溶栓或取栓後不把收縮壓強降到 < 140；重積狀態舊定義 30 分鐘、現在 5 分鐘
  - **待核對**：溶栓前後血壓門檻(< 185/110、24 小時 < 180/105)是否為 2026 版數值
  - **格式修正(使用者回報)**：子項目寫成字母 `a.` 時 Markdown 不認得是清單，會黏成一段；README 規定第二層要寫 `1.` 縮排 3 格(畫面自動顯示 a.)。已把 25 個檔案共 284 行的 `a.`～`g.` 改成數字(含第 1.5 輪免疫舊頁)，脊髓損傷類固醇一段另拆成四點；之後寫頁一律用數字
  - 驗證：build 通過(226 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、DOI 可連；涵蓋 4630/8960

- **F 組完成(2026-10-06)**
  - 新頁：`disease/head-injury`(分類、顱骨骨折與顱底骨折兩表、腦脊髓液漏處理、腦震盪與挫傷、三種血腫比較表、急救、併發症表含尿崩症／SIADH／腦耗鹽、護理)；`disease/spinal-cord-injury`(平面與功能表、完全與不完全、不完全型態表、脊髓休克與神經性休克比較、固定與牽引、類固醇新舊意見、自主神經反射異常處置、兩型神經性膀胱與膀胱訓練、護理與長照、圓滾木翻身與脊椎術後)
  - 頁面已註明新舊說法：脊髓損傷高劑量類固醇(AANS／CNS 2013 不建議；AOSpine 2017 8 小時內 24 小時療程為選項；考題答案可用)；頭部外傷輸液考題答案 D5S、臨床多用 0.9% NaCl；BTF phenytoin 只預防 7 天內早期抽搐
  - **待核對**：膀胱訓練成功的餘尿標準(各書不同，頁面寫 < 50–100 mL)
  - 驗證：build 通過(224 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、DOI 可連；涵蓋 4586/8960

- **E 組完成(2026-10-06)**
  - 新頁：`care/neuro-assessment`(意識程度、成人與兒童 GCS 表與記號 E/T/C、心智狀態、瞳孔表、頭眼反射、肌力 0–5 與運動、病理反射、小腦與腦膜刺激徵象表、診斷檢查表)；`disease/increased-icp`(Monro-Kellie 與 CPP 計算、腦水腫三型、原因、早期與晚期表現、庫欣氏三徵、腦疝脫表、BTF 第 4 版目標值、降腦壓藥表、過度換氣與手術、護理九項、兒童)；`device/icp-monitoring`(**第一篇 device 頁**：種類比較、零點耳屏＝室間孔、數值與波形、護理、警示表)
  - 圖：原創 `icp-waveform.svg`；其他計畫中的圖(GCS、瞳孔、姿勢、腦疝、Monro-Kellie)改用表格，姿勢與呼吸型態連到 brain-anatomy
  - 頁面已註明新舊說法：BTF 第 4 版 ICP > 22、CPP 60–70、收縮壓依年齡 ≥ 100／110(國考常見 ICP < 20、CPP ≥ 50、SBP ≥ 90)；不建議預防性過度換氣；頭部外傷不用類固醇；Romberg 實際是本體感覺測試但國考列為小腦評估
  - 兒童 GCS 語言分數各書不同，頁面用與 105-1_OP_076、114-1_OP_050 答案一致的版本
  - 驗證：build 通過(222 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、image-license-review 47 張需替換 0 張；涵蓋 4549/8960

- **D 組完成(2026-10-06)**
  - 新頁：`drug/antiepileptics`(機轉表、依發作類型選藥、phenytoin 濃度與靜脈給藥、其他藥表含 HLA-B*1502、用藥原則與懷孕兒童、重積狀態流程依 AES 2016)；`drug/antiparkinson-drugs`(作用位置表、levodopa 短長期副作用與飲食交互作用、其他藥表、生活指導、ALS 的 riluzole 與 edaravone)；`drug/anesthetics`(全身麻醉、吸入劑與 MAC、靜脈麻醉劑、局部麻醉藥酯類與醯胺類、LAST、脊髓與硬膜外比較、減痛分娩、麻醉後頭痛)；`drug/gout-drugs`(musculoskeletal 的 gout-drugs group；急性發作、降尿酸藥、尿酸結石；依 2020 ACR)
  - 既有頁補題號：nsaids-acetaminophen(5 題；questions 的 group 改成 nsaids)、opioids(膽絞痛 2 題)、anxiolytics-hypnotics(睡眠 1 題)
  - 頁面已註明新舊說法：減痛分娩時機(ACOG PB 209：產婦要求即可)；脊髓麻醉後平躺 6–8 小時(Cochrane 2016：常規臥床無法預防)；riluzole「唯一」是舊說法；108-1_OP_013 考選部更正答案；110-2_OP_025 送分
  - **待核對**：台灣癲癇病人考駕照的年限(道路交通安全規則)；phenytoin／carbamazepine／valproate 治療濃度為教科書參考值
  - 未涵蓋：113-3_BM_034(CGRP 拮抗劑 atogepant，偏頭痛)留 H 組頭痛
  - 驗證：build 通過(219 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、image-license-review 需替換 0 張；涵蓋 4490/8960

- **C 組完成(2026-10-06)**
  - 新頁：`physiology/autonomic-nervous-system`(與體神經比較、交感與副交感起源、交感走法與內臟神經、顱部副交感神經節表、膽鹼性與腎上腺素性纖維、受體表 N／M1–3／α1／α2／β1–3／D1、各器官作用表、壓力反應、排尿與排便反射、神經性膀胱兩型、自主神經反射異常、藥物總覽)；`drug/cholinergic-drugs`(擬膽鹼藥、抗膽鹼酯酶藥表、重症肌無力用藥護理與兩種危象比較、有機磷中毒、抗膽鹼藥與副作用、青光眼用藥表、神經肌肉阻斷劑兩型)；`drug/adrenergic-agonists`(受體選擇性表、去敏感化、epinephrine 與局部麻醉併用、dopamine 劑量、dobutamine、α1 致效劑、β2 致效劑與 ritodrine、瘦肉精)
  - 既有頁：beta-blockers、alpha-blockers 補上 Ch02 未涵蓋的 9 題
  - 圖：原創 `autonomic-pathways.svg`(五列：副交感、交感、交感汗腺、腎上腺髓質、體運動)
  - 頁面已註明新舊說法：有機磷中毒的催吐與洗胃(考題選項列為可做；AACT／EAPCCT 2013 立場不常規洗胃、不催吐)；atropine 目標心跳 > 80(Eddleston 2008 Lancet)；Tensilon test 現已少用
  - **待核對**：ritodrine 母親心跳通知門檻(頁面寫「約 120 次／分，依醫囑」)；安胎藥比較留給產科輪；局部麻醉加 epinephrine 用在手指的現行做法(頁面寫依各院規範)
  - 驗證：build 通過(215 篇)、resolver 與 export 重跑、source-scan 新頁無重疊、image-license-review 需替換 0 張；涵蓋 4420/8960；生解 Ch05 207/207、藥理 Ch02 86/86

- **B 組完成(2026-10-06)**
  - 新頁：`physiology/brain-anatomy`(各葉功能表、語言區與失語、白質連結、腦代謝、邊緣系統、錐體與錐體外路徑、基底核、視丘、下視丘功能表、體溫調節、上視丘、腦幹三部分表、腦幹病變與姿勢、呼吸型態對應、小腦、三層腦膜與空間、硬膜外與硬膜下血腫比較、腦脊髓液循環與正常值、腰椎與腦池穿刺、Monro-Kellie 代償、血液供應與 ACA／MCA／PCA 表、意識、腦波、睡眠週期)；`physiology/cranial-nerves`(出腦位置、12 對總表、眼外肌、副交感腺體、舌乳頭與味覺、吞嚥、腦幹反射)
  - 圖：servier-brain-sagittal、servier-limbic-system、servier-brain-horizontal(slide 18 中間水平切面加白邊)、servier-brainstem、servier-meninges、servier-csf-ventricles、servier-circle-of-willis；lynch-cranial-nerves(位置對照同作者拉丁文標籤版)；brain-lobes 也用在本頁，並以 `brain-functional-lobes` 標籤標功能區
  - **使用者校正(2026-10-06)**：Servier 功能區圖的聽覺區、韋尼克區位置不準 → 改用四葉圖標功能區(依使用者提供的參考圖：中央前後回、布洛卡、初級聽覺、韋尼克、角迴、視覺)，已刪除 servier-brain-functional-areas；CN IX 改指淡紫色那條(原本指到 VIII)、VII 與 III 指標微調；腦幹圖補上動眼神經(上方分岔兩條)與滑車神經(較外側兩條)、橄欖體改到延腦外側的卵圓隆起；腦脊髓液圖第三腦室指藍色區、導水管指管子、第四腦室往上；軟腦膜指綠色膜；矢狀切面下視丘改到藍綠色區、腦下垂體改到綠色；皮節 L4 往右
  - 標籤位置做法：把官方原圖(含英文標籤)依乾淨圖的範圍裁切並畫格線(scratchpad `refgrid.py`)，讀出原指標位置後再放中文
  - 已在頁面註明：106-2_OP_078(延腦受損的呼吸型態，考選部答案陳施氏呼吸，與典型對應不同)、114-2_BM_014(送分)
  - **待核對**：腦死判定準則的腦幹反射完整項目與最新版條文；腦幹腹側圖的上方兩條神經無法確認是否為動眼神經，已不標
  - 驗證：build 通過(212 篇)、resolver 與 export 重跑、source-scan 兩頁無重疊、image-license-review 46 張需替換 0 張；涵蓋 4345/8960；生解 Ch05 187/207(只剩自主神經系統 28 題，C 組)

- **A 組完成(2026-10-06)**
  - 新頁：`physiology/neuron-synapse`(神經系統分類與腸道神經系統、神經元構造與分類、膠細胞表、髓鞘與纖維分類、損傷與再生、靜止膜電位、動作電位各期與特性、Na⁺ 通道阻斷、電性與化學性突觸、EPSP／IPSP、神經肌肉接合處與毒素藥物表、神經傳遞物質分類)；`physiology/spinal-cord-spinal-nerves`(脊椎特徵、脊髓範圍與固定、腰椎穿刺位置、切面構造、三條徑路與 Brown-Séquard、UMN／LMN、神經叢表、皮節、轉移痛、產痛傳導、門閥控制、反射弧、反射種類、DTR 節段與分級、硫酸鎂、新生兒反射、脊髓休克與神經性休克)
  - taxonomy：neuro 新增 `neuro-physiology` group
  - 圖：servier-neuron、servier-neural-tissue、servier-synapse(左右加白邊)、servier-neuromuscular-junction、servier-spinal-cord-section、servier-dermatomes(以上 PPTX 向量轉出＋labels JSON)；原創 action-potential、reflex-arc、spinal-tracts
  - 元件調整：有疊加層時不顯示角落「點擊放大」(改在切換列顯示「點圖可放大」)；標籤可設 `align: start|end`；縮圖字級下限 10px；`servier-pptx-to-svg.py` 新增「左右留白」參數(圖太窄時用)，並移除直線指標線形狀
  - 一題兩答已在頁面註明：107-2_BM_018(沙林、有機磷)
  - **待核對**：周邊神經再生速度每天 1–3 毫米(依記憶)；新生兒反射消失時間只列考題出現的(其餘留 I 組用兒科課本核對)
  - 驗證：build 通過(210 篇)、resolver(用 `database/.venv/bin/python`)與 export 重跑、tsc 與 eslint 通過、source-scan 兩頁無重疊、image-license-review 37 張需替換 0 張；涵蓋 4262/8960；生解 Ch05 107/207(總論、神經組織學、神經生理學基礎、脊髓與脊神經四節 100%)

## 第 2 輪(已完成)

### 第 2 輪摘要

- **輪次**：第 2 輪 精神收尾(精神 13 章＋社區 Ch11＋兒科 Ch17 共 15 章做到 100%)；25 篇新頁、A–H 八組
- **計畫檔**：`~/.claude/plans/idempotent-scribbling-starfish.md`；頁面表、來源授權見 [sources/psychiatry.md](sources/psychiatry.md)
- **狀態**：第 0、0.5 步與 **A–H 組＋收尾修正完成(2026-10-06)**；Supabase 已寫回；I 組 DSM 核對完成 → **第 2 輪全部完成**，下一輪是第 3 輪神經(先做圖片盤點 `docs/sources/neuro-images.md`)(之後每組都等「下一輪」)；待使用者決定：標籤合併的 DB 同步、`docs/tag-merge-psychiatry.md` 第三節的待決定標籤
- **規則**：精神相關藥物內容只寫在藥物頁、其他頁連結；動到 04／05 一定兩邊同步並記在 `題目修正紀錄.md`；整輪結束列一次「需確認清單」(不限 5 項但不要太多)；圖片可用 CC BY-SA，要登記到 `docs/image-license-review.md`
- **DSM 核對方式(2026-10-06 使用者決定)**：A–G 組的 DSM 時間條件與分級先依記憶寫、標待核對；H 組整理成清單，I 組用使用者提供的 DSM-5-TR 原文核對
- **排程變動(2026-10-06)**：神經與感官前移為第 3 輪，內分泌以後順延

### 第 2 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 0 | roadmap 順序、psychiatry 來源包、CC BY-SA 清單腳本(`scripts/image-license-review.py`→`docs/image-license-review.md`)、規則檔更新(AGENTS／positioning／README) | ✅ 2026-10-06 |
| 0.5 | 精神範圍同義標籤合併(`docs/tag-merge-psychiatry.md`；04／05 同步改 142 題；逐題記錄在題目修正紀錄；JSONL、對照表、diff 在 `analysis/tag_fixes/`；taxonomy 新增 3 個 group 並保留舊別名) | ✅ 2026-10-06(**尚未寫回 Supabase**，待使用者決定；同步後要重跑 resolver 與 export_knowledge_questions，並移除 taxonomy 舊別名) |
| A | psychodynamic-theories、individual-cognitive-behavioral-therapy、group-family-therapy、milieu-therapy | ✅ 2026-10-06 |
| B | anxiety-disorders、obsessive-compulsive-disorder、trauma-stress-disorders、somatic-dissociative-disorders、anxiolytics-hypnotics | ✅ 2026-10-06 |
| C | autism-spectrum-disorder、intellectual-disability、adhd、cns-stimulants、eating-disorders、child-adolescent-mental-health | ✅ 2026-10-06 |
| D | dementia、anti-dementia-drugs、delirium | ✅ 2026-10-06 |
| E | substance-use-disorders、alcohol-use-disorder、addiction-treatment-drugs | ✅ 2026-10-06 |
| F | personality-disorders、family-violence | ✅ 2026-10-06 |
| G | community-mental-health、psychiatric-nursing-foundations | ✅ 2026-10-06 |
| H | 補完既有頁、重複藥理改連結、跑 coverage 確認 15 章 100%、列需確認清單；**另列「DSM-5-TR 待核對清單」**(各頁依記憶寫的診斷條件、時間與分級，標明頁面與段落，讓使用者找原文) | ✅ 2026-10-06 |
| I | 使用者提供 DSM-5-TR 原文後逐條核對 H 組清單：只改錯的數字與條件，仍用自己的話寫，不照抄準則原文 | ✅ 2026-10-06 |

**例外清單**(答案鍵可疑、未放入頁面的題號)：(尚無)


## 第 2 輪需確認清單(2026-10-06 H 組整理；同日依使用者提供資料更新)

1. ✅ **Supabase 寫回**：2026-10-06 完成，紀錄見下方「收尾修正」
2. **標籤合併待決定**：`docs/tag-merge-psychiatry.md` 第三節(未動)
3. ✅ **DSM-5-TR 核對(I 組)**：2026-10-06 完成，結果在 `docs/dsm-check-psychiatry.md`
4. ✅ 已解決：BZD／Z 類／興奮劑管制等級(食藥署分級表)；替代治療年齡(18 歲優先、20 歲為原條文備註)；家暴法緊急保護令 4 小時與家庭成員範圍；校園霸凌準則 113 版；失智綱領 3.0；丁基原啡因懷孕(UpToDate)；二代戒菸補助條件；CIWA-Ar 切點(期刊)；厭食症增重(聯醫)；社區實務能力分類與日間留院分級(社區衛生護理學課本)；失智照顧型機構收住條件(使用者決定不追)
5. **仍待核對**：lecanemab、donanemab 的健保給付現況(2025 年已核准、當時自費)；AUDIT 與 SPMSQ 切點(使用者也未找到)；amphetamine 類在台灣的實際可及性；四段七級模式出處(社區課本第 18 章未提及)；遊民三階段官方文字；Menninger 態度治療、Yalom 療效因子、Erikson 年齡切分、四次革新分法(精神科國考書可核對)
6. **答案鍵有爭議、已放頁面加 note(不改考選部答案)**：111-1_PC_012、108-2_PC_011、105-1_PC_024、108-2_BM_051、114-2_PC_020、110-2_FA_049、107-2_PC_005、111-1_PC_028；一題兩答：106-2_PC_026、112-1_PC_001

## 進行中

- **第 2 輪 I 組完成(2026-10-06)**
  - 依本機 DSM-5-TR PDF 核對 `docs/dsm-check-psychiatry.md` 17 項，結果已填入該檔：13 項吻合、9 處修正或補充(都只改數字與條件，文字為改寫)
  - 修正：depressive-disorder(延長哀傷兒青 6 個月)、somatic-dissociative-disorders(刪除「1 個月」)、anxiety-disorders(恐慌發作 4/13 項)、adhd(6 項／17 歲以上 5 項)、autism-spectrum-disorder(發展早期，國考 3 歲前並列；三方面＋兩類)、child-adolescent-mental-health(行為規範 12 個月 3 項與 10 歲分型、學習障礙 6 個月)、eating-disorders(BMI 16 為重度以上)、delirium(混合型定義)、personality-disorders(未滿 18 歲少數可診斷、需 1 年，反社會型除外)
  - 另補：anti-dementia-drugs 加 lecanemab(樂意保)、donanemab(欣智樂)2025 年核准與自費現況(科技新報)
  - 驗證：build 通過、source-scan 無新增重疊、7 頁回 200；未動題號，不需重跑 DB

- **第 2 輪收尾修正完成(2026-10-06)**
  - ①食藥署管制藥品分級表(品項表 108-12 版＋歷次修正摘要至 115-09-11)：anxiolytics-hypnotics 新增 #controlled-class(第三級 flunitrazepam、triazolam、nimetazepam、短效巴比妥；第四級多數 BZD、zolpidem、zopiclone 含 eszopiclone、zaleplon、phenobarbital)；cns-stimulants(amphetamine、lisdexamfetamine 第二級、modafinil 第四級、atomoxetine 不列管)；substance-use-disorders(一粒眠 2010 年已改第三級；依托咪酯管制藥品第四級 vs 毒品第一級)
  - ②替代治療收案：未滿 18 歲為主，原條文「未滿二十歲」為備註
  - ③依 `相關資源/精神科相關/` 新資料更新：dementia(失智綱領 3.0：2026–2035、12 部會、21 方案、63 指標、全齡全病程全支持、年輕型失智納入長照 3.0)；family-violence(家暴法 112-12-06 原文：第 2、3 條定義與家庭成員、第 63-1 條 16 歲、通常保護令 2 年、緊急保護令 4 小時)；child-adolescent-mental-health(霸凌準則 113-04-17 第 4 條)；eating-disorders(聯醫：門診每週 0.5–1 公斤、住院可 1.5 公斤、30–40 → 70–100 大卡)；addiction-treatment-drugs(戒菸補助對象與療程、varenicline 與 bupropion 起始、合併用藥補助；懷孕期美沙冬加量或分次、不建議孕期換丁基原啡因、丁基原啡因含 naloxone 複方可用)；alcohol-use-disorder(CIWA-Ar 期刊切點 ≤15／16–20／≥21)；community-mental-health(社區衛生護理學課本第 18 章：#visit-levels 一到五級訪視、就業三類、實務能力七項、六大需求、復元三要素、日間留院屬末段)
  - ④**Supabase 已寫回**：`sync_all.py` 完成(questions 8960、question_tags 16752 等)；另用 scratchpad `prune_tags.py` 刪除 210 筆來源已不存在的 question_tags(本輪合併掉的舊標籤、早期 other 類舊藥物標籤、含「master_id:」的解析殘留列)，刪後 DB＝來源 16752 筆；taxonomy.yml 精神科 group 移除舊別名、成癮組加入「戒酒用藥」；重跑 build、resolver、export，group 自動抓題正常
  - 驗證：build 通過(208 篇)、source-scan 無新增重疊、8 頁回 200

- **第 2 輪 H 組完成(2026-10-06)**
  - ①補題：Ch04 24 題補進 schizophrenia#communication(新增 #communication-extra：Sullivan、Peplau、溝通特徵、會談環境、同理心、各期任務、情感轉移、交流分析三型、行為過程紀錄)；108-1_PC_013 進 #delusions、109-1_PC_003 進 #nursing-community(補出院衛教)；110-2_PC_008、115-2_BM_033 進 antipsychotics#sga
  - ②藥理去重：schizophrenia、depressive-disorder、bipolar-disorder 的治療段已是 1–3 點＋嵌入藥物頁摘要，無需搬移
  - ③涵蓋：**精神 898/898(100%)，15 章(精神 Ch01–13、社區 Ch11、兒科 Ch17)全部 100%**；藥理 Ch03 精神科治療藥物 76/76、鎮靜安眠 15/15、興奮劑 9/9、神經退化 7/20(巴金森與 ALS 留第 3 輪)；藥理 Ch13 成癮藥物 36/36；社區 Ch08 17/65(其餘為老化、骨鬆、跌倒等，留社區輪)；全部 4199/8960(47%)；**例外清單 0 題**(可疑答案鍵都已放進頁面並加 note)
  - ④清單：`docs/dsm-check-psychiatry.md`(17 項，I 組用)；需確認清單見下方「第 2 輪需確認清單」；`image-license-review.py` 重跑：27 張、需替換 0 張(本輪無新圖)
  - 驗證：build 通過(208 篇)、source-scan 無新增重疊、schizophrenia／antipsychotics 回 200、resolver 與 export 已重跑

- **第 2 輪 G 組完成(2026-10-06)**
  - 新頁：`care/community-mental-health`(system community、alsoIn psychiatric；意義與特性、去機構化與機構化、西方與台灣發展、三級預防表、三段五級、四段七級、資源選擇表、社區復健中心／康復之家／精神護理之家／居家治療／庇護工場／會所、社區心理衛生中心與精神衛生法第 28 條、服務困境、個案管理與 ACT、復元與賦能、社區護理角色與實務能力、遊民三階段)、`care/psychiatric-nursing-foundations`(四次革新、護理發展、台灣與學會認證、基本認識、理論模式表、團隊、主責護理與個案管理、角色、工作範圍)
  - 回補連結：milieu-therapy#rehabilitation → community-mental-health；substance-use-disorders#behavioral-addictions → community-mental-health
  - 題號 93 個(81＋12)，04 題本索引驗證都存在；build 通過(208 篇)、source-scan 兩頁無重疊、四頁回 200
  - 涵蓋：精神 Ch01 31/31、Ch06 112/112、Ch12 157/157、社區 Ch11 89/89 都到 100%；Ch13 121/122；精神整體 97%、全部 4172/8960(47%)
  - **剩給 H 組**：精神 Ch04 74/98(剩 24)、Ch05 61/62、Ch07 104/105、Ch13 121/122
  - 已核對(網路)：精神衛生法第 28 條社區心理衛生中心辦理事項與人員(衛福部)；精神復健機構分日間型與住宿型
  - **待核對**：四段七級模式的出處(依歷屆題詳解整理)；社區實務能力分類名稱；遊民三階段的官方文字；精神衛生護理學會現行認證項目(學會網站未讀)；四次革新各書分法
  - 考選部 A、D 都給分：112-1_PC_001(頁面已註明)

- **第 2 輪 F 組完成(2026-10-06)**
  - 新頁：`disease/personality-disorders`(DSM-5 一般特徵、自我協調、病因(ego 薄弱、5-HIAA 低、肛門期、客體關係)、A／B／C 十型比較表與照護要點、邊緣型的分裂、投射性認同、操縱、DBT、強迫型 vs 強迫症、治療目標、照護原則、操縱與分化處理、自傷與不自傷約定 vs 安全計畫、各群照護、家屬)、`care/family-violence`(peds: true；家暴定義與 2023 修法、型態、暴力週期、成因、迷思、兒虐類型與身體表徵、嬰兒搖晃症候群、兒虐護理、老人與身障者虐待、性侵害急診照護、責任通報 24 小時表、保護令三種、評估、處置、安全計畫)
  - 回補連結：obsessive-compulsive-disorder → personality-disorders#cluster-c；psychodynamic-theories → #borderline；child-adolescent-mental-health → #cluster-b；alcohol-use-disorder → family-violence
  - 題號 44 個(24＋20)，04 題本索引驗證都存在；build 通過(206 篇)、source-scan 兩頁無重疊、六頁回 200
  - 涵蓋：精神 Ch11 24/24(100%)、Ch13 95/122(78%，剩綜合題型等留 H 組)；兒科 Ch17 43/43(100%)；dz 人格障礙症各型、家庭暴力、兒童虐待 100%；精神整體 91%、全部 4083/8960
  - 目前 15 章狀態：Ch02、03、08、09、10、11、Ch17 已 100%；Ch05 98%、Ch07 99%、Ch12 99%(剩 105-1_PC_030)、Ch06 96%(剩 4 題 G 組)、Ch04 74%、Ch13 78%、Ch01 16%、社區 Ch11 17%(G 組)
  - 已核對(網路)：家暴法第 50 條 24 小時與 2023 修法重點(衛福部)；兒少權法 53、性侵害犯罪防治法 11、兒少性剝削 7、老人福利法 43、身權法 76 皆 24 小時(責任通報彙整)
  - **考題觀點並列**：109-1_PC_026(依行為治療訂不自傷約定為正解) vs 108-1_PC_028(訂契約保證不自殺非最適當) → 頁面寫安全計畫為現行建議
  - **待核對**：緊急保護令核發時限(條文 4 小時，依記憶)；家暴法家庭成員範圍與親密關係暴力適用年齡的現行條文；性侵害驗傷採證時限與緊急避孕時間(頁面未寫數字)；DSM 人格障礙症一般特徵與十型項目(列入 H 組 DSM 清單)
  - **之後要回補的連結**：family-violence ↔ G 組 community-mental-health(社區 Ch11 家暴題已放本頁)

- **第 2 輪 E 組完成(2026-10-06)**
  - 新頁：`drug/addiction-treatment-drugs`(**美沙冬維持治療加深**：為什麼有效、台灣制度(減害計畫 2005、95 年引進、執行機構、收案、監督當場服用、丁基原啡因限量攜回 2 週、入案檢查、尿篩、兩週未服終止)、劑量與導入(前 10 天風險最高、漏服 3 天、嘔吐補半量、減量速度)、副作用與 QT、禁忌、CYP 交互作用、naloxone 作用較短、懷孕、護理、社會常見誤解；丁基原啡因、美沙冬 vs 丁基原啡因比較；naloxone、naltrexone；disulfiram、acamprosate、BZD、thiamine；戒菸藥與電子煙禁令；group addiction-treatment-drugs)、`disease/substance-use-disorders`(名詞、DSM-5 四面向、病因、台灣毒品分級與觀察勒戒、鴉片類、鎮靜劑、興奮劑、K 他命與 PCP、迷幻劑與大麻、NPS 與依托咪酯(2026-06-27 升列一級)、嗜賭、治療階段、MI 與改變階段、減害、護理與照護四期)、`disease/alcohol-use-disorder`(代謝與 ALDH2、AUDIT／CAGE、急性中毒、戒斷機轉與時間軸、CIWA-Ar、戒斷治療、Wernicke–Korsakoff、身體合併症、長期治療、護理目標)
  - 回補連結：cns-stimulants → substance-use-disorders#stimulants；anxiolytics-hypnotics、opioids → addiction-treatment-drugs；delirium → alcohol-use-disorder
  - 題號 65 個(41＋14＋10)，04 題本索引驗證都存在；build 通過(204 篇)、source-scan 三頁無重疊、六頁回 200、截圖檢查 addiction-treatment-drugs
  - 涵蓋：精神 Ch12 物質相關 47/47(100%)；藥理 Ch13 成癮藥物 36/36、Ch03 其他中樞神經作用藥物 4/4；dz 物質使用障礙症、酒精使用障礙症 100%；精神整體 87%
  - 已核對(網路與官方文件)：衛福部 2012 替代治療臨床指引全文(劑量、導入、漏服、嘔吐、減量、丁基原啡因導入與轉換、作業基準)、臺北聯醫美沙冬用藥單張、疾管署減害計畫成效數字、衛福部美沙冬與丁基原啡因補助計畫、法務部毒品分級與觀察勒戒、依托咪酯升列一級(公視)、長庚急診酒精戒斷流程指引(6–36 小時、DT 5% 於 48–96 小時、CIWA-Ar > 16 住院、低鉀低鎂)、菸害防制法 2023 禁電子煙、QTc 與 80 mg 劑量(PMC)
  - **考題分歧(已加 note)**：107-2_PC_005 酒精戒斷「增加鎂離子」(臨床為低血鎂)；106-2_PC_026 考選部 A、C 都給分(已在考點註明)；111-1_PC_028 naloxone 矯正乙醇昏迷(頁面註明只在懷疑合併鴉片類時有效)
  - **待核對**：替代治療作業基準現行條文(未成年年齡 20→18、是否有修正)；丁基原啡因懷孕使用的台灣現行建議；take-home naloxone 在台灣的推行狀況(頁面未寫)；AUDIT 與 CIWA-Ar 分級切點；二代戒菸補助條件；DSM-5 物質使用障礙症嚴重度項目數(列入 H 組 DSM 清單)
  - **之後要回補的連結**：substance-use-disorders#behavioral-addictions 的「之後的社區心理衛生頁」純文字(G 組)；alcohol-use-disorder 家暴 → F 組 family-violence

- **第 2 輪 D 組完成(2026-10-06)**
  - 新頁：`disease/dementia`(DSM 認知範疇、記憶種類與喪失順序、四大類型與可逆原因、阿茲海默病理、預防、三期分法、BPSD、與譫妄和假性失智鑑別、MMSE／CDR／SPMSQ／AD8、非藥物治療、照護原則與溝通、BPSD 處理、日常照顧、照顧者、台灣失智照護資源、老年精神健康)、`drug/anti-dementia-drugs`(AChEI 三藥與 memantine、中樞與周邊膽鹼酯酶抑制劑區別、副作用、交互作用、健保 1.3.3、BPSD 用藥原則、護理；group anti-dementia-drugs)、`disease/delirium`(核心特徵、三型、病因與易發因子、CAM、三方鑑別、預後、治療、護理、約束)
  - 補題：depressive-disorder#late-life 加 115-1_PC_005、114-1_PC_020(並註明日落症候群屬失智)；回補連結：anxiolytics-hypnotics → delirium、anti-dementia-drugs；neurotransmitters-psychiatry → anti-dementia-drugs
  - 題號 88 個(67＋16＋5)，04 題本索引驗證都存在；build 通過(201 篇)、source-scan 無新增重疊、三頁回 200、截圖檢查 dementia
  - 涵蓋：精神 Ch12 認知類障礙症 45/45(100%)、老年精神衛生 12/13(剩 105-1_PC_030 慢性精神病社區照護，留 G 組)；dz 標籤阿茲海默症、譫妄 100%，失智症 90%(剩下多為社區 Ch10 長照通則與流病題，留社區那一輪)；藥理神經退化性疾病藥物 7/20(巴金森留第 3 輪)；精神整體 83%、全部 3990/8960(45%)
  - 已核對(網路)：健保藥品給付規定 1.3.3(114/10/1 版：中重度限 memantine 10≦MMSE≦14 或 CDR 2；重度限 donepezil、memantine 或併用；換用與併用條件)、輕中度 MMSE 10–26 或 CDR 1–2(臺大醫院電子報)；衛福部失智共照中心與失智據點功能；長照 2.0 納入 50 歲以上失智者；失智症防治照護政策綱領 3.0 自 2026 起併入長照 3.0；NICE CG103 抗精神病藥短期(通常 1 週內)使用
  - **考題分歧(已在頁面加 note)**：114-2_PC_020 日落症候群列為早期 vs 教科書中期；110-2_FA_049 約束用平結 vs 活結
  - **待核對**：失智症防治照護政策綱領 3.0 的具體內容；抗類澱粉蛋白單株抗體(lecanemab、donanemab)在台灣的核准與給付；SPMSQ 計分切點與教育校正、CDR 分級對應三期(教科書通則)；DSM 認知範疇與重度／輕型區分、譫妄核心特徵(依記憶摘要，列入 H 組 DSM 清單)；失智照顧型機構與團體家屋收住條件的最新法規文字
  - **之後要回補的連結**：dementia#taiwan-resources ↔ G 組 community-mental-health；delirium ↔ E 組 alcohol-use-disorder(震顫性譫妄)

- **第 2 輪 C 組完成(2026-10-06)**
  - 新頁(都 peds: true)：`drug/cns-stimulants`(methylphenidate 各劑型、amphetamine、atomoxetine、α2 促效劑、modafinil、咖啡因與甲基黃嘌呤、副作用與生長監測、管制等級、給藥時間)、`disease/adhd`、`disease/autism-spectrum-disorder`、`disease/intellectual-disability`(含台灣早療四階段流程)、`disease/eating-disorders`(厭食、暴食、嗜食比較、身體併發症、再餵食症候群、行為約定)、`care/child-adolescent-mental-health`(DSM 分類、照護原則、學習障礙、妥瑞氏症、排泄障礙、行為規範障礙、嵌入 depressive-disorder#youth、校園霸凌、慢性病青少年)
  - 題號 90 個(9＋12＋26＋8＋18＋17)，04 題本索引驗證都存在；build 通過(198 篇)、source-scan 無新增重疊、六頁回 200
  - 涵蓋：精神 Ch12 兒童及青少年 52/52(100%)；兒科 Ch17 42/43(98%，剩兒童虐待 111-1_PC_034 留 F 組 family-violence)；藥理 Ch03 中樞神經興奮劑 9/9(100%)；精神整體 78%、兒科 40%
  - 已核對(網路)：methylphenidate 台灣第三級管制藥品與各劑型(臺大醫院電子報)、atomoxetine 濫用風險低、衛福部早療四階段與通報轉介中心、聯合評估中心、個案管理中心；NICE 再餵食危險因子(BMI < 16、3–6 個月體重降 > 15%、10 天以上幾乎未進食、餵食前鉀磷鎂低)
  - **待核對**：厭食症住院每週體重增加目標(國考常見 0.5–1.5 公斤，指引多為 0.5–1 公斤)；methylphenidate 各劑型作用時間；amphetamine 類在台灣的可及性；atomoxetine 管制等級；智能不足各級智商範圍(DSM-IV 參考值)；DSM 時間條件(ADHD 6 個月、12 歲前；妥瑞 18 歲前、超過 1 年；遺尿 5 歲、每週 2 次 3 個月；遺糞 4 歲；暴食症每週 1 次 3 個月)依記憶整理；校園霸凌防制準則最新修正條文
  - **之後要回補的連結**：substance-use-disorders(E 組，cns-stimulants 內「之後整理在物質使用障礙頁」純文字)、personality-disorders(F 組，行為規範障礙→反社會型)、family-violence(F 組，兒虐)；child-adolescent-mental-health 與 milieu-therapy 可互連

- **第 2 輪 B 組完成(2026-10-06)**
  - 新頁：`drug/anxiolytics-hypnotics`(BZD 機轉與半衰期分類、buspirone、Z 類、ramelteon、orexin 拮抗劑、巴比妥、戒斷與減量、flumazenil、交互作用、護理衛教)、`disease/anxiety-disorders`(Peplau 四級、焦慮類型與因應、評估、病因、恐慌、畏懼症三類、GAD、分離焦慮、治療、恐慌發作處置)、`disease/obsessive-compulsive-disorder`(症狀、病識感、相關疾病與 OCPD 區分、防衛機轉、SSRI＋ERP、護理)、`disease/trauma-stress-disorders`(壓力生理與 GAS、PTSD 四群症狀、ASD 與適應障礙、治療、創傷知情照護、災難倖存者反應)、`disease/somatic-dissociative-disorders`(身體症狀障礙、罹病焦慮、轉化症、人為障礙與詐病、原始與附帶收穫、解離症三類、護理)
  - 題號 120 個(21＋30＋22＋29＋18)，04 題本索引驗證都存在；build 通過(192 篇)、source-scan 無新增重疊、五頁回 200、截圖檢查 anxiety-disorders
  - 涵蓋：精神 Ch09 59/59(100%)、Ch10 16/16(100%)；藥理 Ch03 鎮靜安眠藥 15/15(100%)；精神整體 72%
  - 藥物內容依規則放在藥物頁，疾病頁只寫用藥原則並連結 anxiolytics-hypnotics、antidepressants
  - 已核對(網路)：ASAM 2025 BZD 減量(每 2–4 週減 5–10%、兩週內不超過 25%)、flumazenil 用法與痙攣風險、zolpidem 為台灣第四級管制藥品；OpenStax Pharmacology 13.4 核對 BZD 分類、禁忌、交互作用、Z 類與 ramelteon
  - **答案鍵爭議、放入頁面加 note**：108-2_BM_051(公布答案 zolpidem，ramelteon 也符合「無肌肉鬆弛、不易耐受」)
  - **新舊觀點並列**：安心團體(debriefing)國考視為急性期標準措施；NICE NG116 不建議常規單次減壓會談
  - **待核對**：各 BZD 半衰期(教科書約略值)、其他 BZD 與 Z 類在台灣的管制等級、orexin 拮抗劑在台灣的可及性、門寧格以外的 DSM 時間條件(依 DSM-5-TR 記憶整理，未讀原文：恐慌 1 個月、畏懼症與 GAD 6 個月、分離焦慮兒童 4 週、ASD 3 天至 1 個月、PTSD 超過 1 個月、適應障礙 3 個月內出現 6 個月內緩解)、藥物催眠會談(amobarbital)臨床現況
  - **之後要回補的連結**：delirium(D 組，BZD 避免)、addiction-treatment-drugs(E 組，BZD 用於酒精戒斷)、personality-disorders(F 組，OCPD)；obsessive-compulsive-disorder 與 somatic-dissociative-disorders 內「之後的人格障礙頁」純文字待改連結
  - 已回補：psychodynamic-theories(Peplau 四級、強迫症、轉化症)、individual-cognitive-behavioral-therapy(ERP)連到 B 組頁面

- **第 2 輪 A 組完成(2026-10-06)**
  - 新頁(都在 `care/`，system psychiatric)：`psychodynamic-theories`(致病三因子與生物心理社會、Freud 地形與結構與心性發展、情感轉移、防衛機轉 21 種＋易混淆配對＋疾病對應、Sullivan／Peplau／Erikson／Piaget、客體關係與依附、精神護理概念模式)、`individual-cognitive-behavioral-therapy`(個別心理治療類型、IPT、動機式晤談、行為治療增強與代幣與逐步養成與 SST 與暴露技術、貝克認知扭曲、CBT、REBT、現實治療、學派比較)、`group-family-therapy`(Yalom 11 因子、團體階段、各型團體、家庭系統與 Bowen／Minuchin／策略性、家庭評估與護理)、`milieu-therapy`(環境治療五功能、硬體設計、依疾病調整、門寧格態度治療、日間留院與康復之家等機構選擇、活動治療)
  - 題號 139 個(32＋49＋32＋26)，DB 以 04 題本索引驗證都存在；build 通過(187 篇)、source-scan 無重疊、四頁回 200、已截圖檢查 psychodynamic-theories
  - 涵蓋：精神 Ch03 75/80(94%)、Ch06 108/112(96%)、Ch01 5/31(16%)；精神整體 64%
  - **留給後面組的題目**：Ch06 剩 4 題＝綜合題型的復元與賦能(114-2_PC_021、110-2_PC_036、110-1_PC_033、107-1_PC_035，放 G 組 community-mental-health)；Ch03 剩 5 題(神經傳導物質等生物因素，放 H 組補進 neurotransmitters-psychiatry)
  - **答案鍵爭議、已放入頁面並加 note(依考選部公布答案)**：111-1_PC_012(負向增強題，考選部由 A 更正為 B，學理上有爭議)、108-2_PC_011(團體療效因子，公布答案情緒宣洩，描述更貼近人際學習)；105-1_PC_024(解離症答潛抑)在防衛機轉頁加 note
  - **待核對**：Yalom 療效因子與團體發展階段、米紐慶與策略性家庭治療、Menninger 態度治療完整分類(「堅定溫和」列為待核對)、環境治療五大功能、各心性發展與 Erikson 年齡切分(各書不同)、客體關係(Klein、Mahler)與依附類型(教科書通則，歷屆題極少考)、精神分析對恐懼症的防衛機轉(教科書通則)；OpenStax 只核對了 Freud、Sullivan、Peplau、Erikson、Bowen 與治療性社區
  - **之後要回補的連結**：焦慮症頁(Peplau 焦慮四級，B 組)寫完後，psychodynamic-theories#peplau 與防衛機轉表的恐懼症／強迫症改連結；認知行為治療頁連到強迫症頁(ERP)、飲食障礙症頁；人格障礙頁(F 組)連 psychodynamic-theories#object-relations-attachment 與 splitting；community-mental-health(G 組)連 milieu-therapy#rehabilitation；schizophrenia 的 #communication 與 psychosocial-treatment 與 psychodynamic-theories 互相連結；既有疾病頁的防衛機轉敘述可改連結 psychodynamic-theories#defense-mechanisms

- **第 1.5 輪 F 組完成(2026-10-05)，本輪收尾**
  - 新頁：`disease/primary-immunodeficiency`(B、T、吞噬細胞、補體缺陷比較表、警訊、續發性、護理)、`lab/immunology-labs`(Ig、IgE、補體、ANA 與特定自體抗體、庫姆斯、淋巴球亞群、過敏檢查)、`drug/monoclonal-antibodies`(命名規則、標的總表、輸注反應、感染風險、護理)、`care/transfusion-reactions`(血品與時效、輸血前核對、輸注、各型反應與處理、特殊血品、Rh 免疫球蛋白)
  - 題號 72 題 DB 驗證存在；build 通過(183 篇)、source-scan 無重疊、四頁回 200；涵蓋：微免 100%、病理 52%、藥理 57%、內外 42%、兒科 37%、全部 40%
  - 已核對：精實輸血手冊(血品保存溫度與效期、FFP 解凍與用量、血紅素閾值、PTR 定義、輻射與去白血球)、北榮輸血 SOP(備血檢體 3 天、領血 30 分鐘、4 小時、前 15 分鐘 ≤20 滴/分、15 分鐘後 10–50 滴/分、完成後觀察 1 小時、300 mmHg、37℃)；UpToDate 輸血反應(處理步驟、FNHTR 定義與比例、過敏發生率、TACO 與 TRALI 時間窗、BNP 區分、血壓下降 >30 mmHg、過敏輸血反應腎上腺素 0.3 mg、不建議常規前處理)；PID 各型、ANA 的 HEp-2 與 1:160 約 5%；RhIG 28 週與產後 72 小時(網路搜尋核對 ACOG PB 181 的二手整理，未讀原文)
  - **待核對**：XLA 的 IVIG 間隔與劑量；輸血前 15 分鐘速度(北榮 ≤20 滴/分 與護理考題 20–40 滴/分並列)；Rh 免疫球蛋白 ACOG 原文；輸血後紫斑與輸血相關 GVHD 的時間窗(通則)；單株抗體命名表的舊式標的詞
  - **答案或詳解**：本組沒有修改 04/05；109-1_FA_010 答案欄為「C or D」，115-1_MS_030 為「B or C」(使用者確認是考選部最終公布，不處理)
  - 已把 B～E 組的純文字連結改成實際連結
  - **整輪回顧見使用者對話中的進度分析**

- **第 1.5 輪 E 組完成(2026-10-05)**
  - 新頁：`disease/autoimmune-diseases`(耐受、成因、機轉、疾病總表、硬皮病、乾燥症、類澱粉)、`sle`、`rheumatoid-arthritis`、`kawasaki-disease`
  - 題號 76 題 DB 驗證存在；build 通過(179 篇)、source-scan 無重疊、四頁回 200；涵蓋報告：微免 100%、病理 52%、藥理 57%、內外 42%、兒科 36%
  - 已核對匯出檔：川崎氏症診斷準則、IVIG 2 g/kg 與時機、阿斯匹靈劑量、IVIG 無效定義(36 小時)、Reye、台灣病例數；SLE 的 2019 EULAR/ACR 進入條件與 ≥10 分、防曬 SPF ≥55、懷孕穩定 ≥6 個月、羥氯奎寧眼科追蹤、活性疫苗禁忌；RA 的 MTX 首選與最大 25 mg/週、不用 TNF 抑制劑做初始單藥、吸菸為最強環境因子、2010 ACR/EULAR
  - **待核對**：IVIG 後活性減毒疫苗延後 11 個月與長期阿斯匹靈者打流感疫苗(通則，匯出檔未找到)；川崎氏症阿斯匹靈高劑量(80–100 mg/kg/天)與 UpToDate 的 30–50 並列；RA 健保生物製劑給付條件(DAS28)；苜蓿芽與 SLE；RA 2010 標準的計分細項、SLE 的 ACR 1997 項目屬教科書通則；EULAR/ACR 原文未讀
  - **本組沒有修改 04/05 題目**；115-1_MS_030 答案欄為「B or C」(兩個答案)，未處理
  - **之後要回補的連結**：免疫檢驗頁(ANA、RF、anti-CCP、補體)、單株抗體頁(RA 生物製劑)、神經系統的重症肌無力頁、心血管批次的風濕熱頁

- **第 1.5 輪 D 組完成(2026-10-05)**
  - 新頁：`disease/asthma`(病生理、診斷標準、PEF、控制評估、GINA 2026 兩條路徑、急性發作、兒童、護理)、`drug/asthma-drugs`(SABA／LABA、ICS、LTRA、茶鹼與咖啡因、抗膽鹼、cromolyn、生物製劑、吸入器、去鼻充血與鎮咳祛痰)
  - 題號 63 題 DB 驗證存在；build 通過(175 篇)、source-scan 無重疊、兩頁回 200；涵蓋報告：微免 99%、病理 49%、藥理 57%、內外 41%、兒科 36%
  - 已核對 GINA 2026 與台灣指引：診斷標準(FEV1 ≥12% 且 ≥200 mL、PEF 日變異 >10%／兒童 >13%)、控制評估 4 題、Track 1 原則與 55% 降低、急性發作處置(SABA 每 20 分鐘×3、血氧 93–95%、prednisolone 劑量、ipratropium、硫酸鎂、不需常規 X 光與抗生素)、SABA 毒性、沉默肺、降階 3 個月、omalizumab(≥6 歲、健保 IgE 30–1300、每 2–4 週)、新生物製劑 depemokimab；台灣盛行率(約 200 萬人、學齡兒童約 15%)；茶鹼 10–20 μg/mL(OpenStax 藥理)
  - **待核對**：PEF 綠黃紅燈切點(指引未列，國內衛教常用)、茶鹼較新建議 5–15 μg/mL、montelukast 神經精神警語在台灣仿單、zileuton 與 benzonatate 在台灣的可及性、兒童吸入器年齡分級(通則)、MDI 兩下間隔
  - **詳解修正(使用者 2026-10-05 同意)**：115-2_BM_044(RA 同屬第Ⅲ型)與 106-2_MS_048(補體下降屬Ⅲ型而非單純Ⅰ型)的 AI 詳解已改，答案鍵不動，已用 05_apply_sol.py 同步 04 與 05；**尚未寫回 Supabase**(需要時跑 sync_all.py，先問使用者)
  - **之後要回補的連結**：單株抗體頁、輸血反應頁；嬰幼兒氣喘與 COPD 若之後做呼吸系統批次，要與本頁分工

- **第 1.5 輪 C 組完成(2026-10-05)**
  - 新頁：`physiology/hypersensitivity-reactions`(四型總表與各型、異位性、檢查)、`disease/anaphylaxis`、`allergic-rhinitis`、`urticaria-angioedema`、`allergic-contact-dermatitis-latex`、`drug/antihistamines-autacoids`
  - 題號取自病理 Ch05、微免 Ch03、內外 Ch02、藥理 Ch05 的分章對照檔，66 題 DB 驗證存在；build 通過(173 篇)、source-scan 無新增重疊、六頁回 200
  - 來源已核對匯出檔：過敏性休克腎上腺素劑量與體重分級、重複間隔、輸液量、觀察時間、雙相反應、類胰蛋白酶採血時間、診斷準則 BP 切點；蕁麻疹病程與 4 倍劑量、omalizumab；貼膚試驗 48 小時與延遲判讀；乳膠管理；鼻炎用藥階梯；塵蟎寢具熱水清洗
  - **待核對(通則，未在匯出檔找到)**：皮膚點刺 15–20 分鐘判讀、血清病 1–2 週、結核菌素 48–72 小時、第Ⅱ到Ⅳ型的時間；腎上腺素自動注射筆與鼻噴劑在台灣的可及性；靜脈給藥最初 15–30 分鐘觀察；疫苗後留觀時間；抗組織胺作用時間；前列腺素藥物用途(依藥理教科書通則，F 組單株抗體頁前再用仿單核對)；WAO 2020 準則只用 UpToDate 轉述，未讀原文
  - **答案鍵可疑、未放入頁面**：106-2_MS_048；115-2_BM_044(RA 與亞急性心內膜炎都是Ⅲ型，答案給心內膜炎)
  - **之後要回補的連結**：asthma(氣喘頁)、asthma-drugs(肥大細胞穩定劑與白三烯)、transfusion-reactions(輸血過敏)、primary-immunodeficiency、單株抗體；b-lymphocytes 與 immunoglobulins-hla 的純文字「過敏反應」可改成 `[[hypersensitivity-reactions]]`

- **第 1.5 輪 B 組完成(2026-10-04)**
  - 新頁：`physiology/t-lymphocytes`(胸腺選擇、MHC I／II 與處理路徑、三訊號與檢查點、Th1／Th2／Th17／Treg／Tfh、CTL、記憶、細胞激素總表、超抗原)、`b-lymphocytes`(骨髓發育、T 依賴與非依賴、生發中心、類別轉換、初次與二次反應、體液與細胞性免疫比較)、`immunoglobulins-hla`(抗體構造、五類 Ig、多樣性、HLA 與疾病與藥物、血清學、ABO 與 Rh)
  - 題目 `::questions` 取自分章對照檔(微免 Ch02 後天免疫各小節)，79 題都在 DB 驗證存在
  - 驗證：build 通過(167 篇)、source-scan 只有引用行篇名重疊、三頁本機回 200
  - 來源：UpToDate(T 細胞、APC、發育、體液、Ig 構造、Ig 基因、HLA、移植免疫)皆改寫；半衰期與 Ig 分子量已對照匯出檔，其餘為教科書通則
  - **待核對**：Rh 免疫球蛋白給藥時機(28 週與產後 72 小時，ACOG 常規，F 組輸血頁再用公開來源核對)；初次與二次反應的天數為教科書常見值；HLA-B*1502、B*5701、B*5801 的藥物關聯待在藥理頁用仿單或衛福部資料補來源
  - **之後要回補的連結**：b-lymphocytes 與 immunoglobulins-hla 提到的「原發性免疫缺陷、過敏反應、單株抗體、輸血反應」目前是純文字，C、F 組完成後改成 `[[...]]`；t-lymphocytes 的第四型過敏、CD8 與 HIV 連結同理

- **第 1.5 輪 A 組完成(2026-10-04)**
  - 新頁：`physiology/immune-system-basics`、`complement-system`(原創 SVG `complement-pathways.svg`，已登記 credits)、`inflammation-repair`；taxonomy 新增 4 個 group；既有頁補連結(microbial-pathogenesis、sepsis、inflammatory-markers)
  - 驗證：build-knowledge 通過(164 篇)、resolver 與 export_knowledge_questions 已跑、source-scan 只抓到引用行篇名(無內文重疊)、本機 `/learn/<slug>` 三頁回 200 並截圖檢查
  - 來源：UpToDate(innate 總論、補體 5 篇)、Simon 2015、Chen 2018、Landén 2016、Shah 2017 肉芽腫、OpenStax A&P 2e／Microbiology／Med-Surg 核對；皆改寫
  - **Robbins 核對(2026-10-04，使用者提供 `國考書（最終參考用）/Robbins Basic Pathology 9th`)**：`inflammation-repair` 逐段核對，主線正確；修正與補強：嗜中性球 6–24 小時、單核球 24–48 小時取代、血管通透性機轉、外滲分子、介質(血清素血管收縮、白三烯)、細胞再生分類、一期與二期癒合時間軸、傷口強度、延遲癒合因素(感染、維生素 C、類固醇)、蟹足腫、肉芽腫三種形成情況
  - **仍待單一來源核對**：肥厚性疤痕與蟹足腫的區分(Robbins Basic 沒收錄)；`immune-system-basics` 的白血球分類比例(Robbins 沒有，來自一般血液學)與胸腺位置(OpenStax A&P 已核對)
  - **答案鍵可疑、未放入頁面**：106-2_MS_048(過敏性疾病檢查，選項把「C3、C4 補體下降」列為正確)；107-2_BM_027(扁桃體位置，已在頁面加 note 並依公布答案)
  - 補體頁已預留，之後要回補的連結：過敏反應頁(第二、三型)、輸血反應頁(溶血)、原發性免疫缺陷頁(CGD、補體缺乏)、蕁麻疹與血管性水腫頁(遺傳性血管性水腫)、SLE 頁

- **第 1 輪 1a 掃描：腳本與報告完成(2026-10-04)**，接著做 1b。
  - 腳本：`python3 scripts/source-scan.py`；報告：[uptodate-scan.md](uptodate-scan.md)。
  - 結果：161 篇頁面比對 198 篇 UpToDate 匯出檔(精神、癌症、感染、免疫)。**0 篇含形似字元、0 篇英文逐字重疊**；1 篇數字序列重疊(sepsis：SIRS 標準值，屬事實性數字，保留)、1 篇零星重疊(HPV，不處理)。
  - **發現**：UpToDate 匯出檔的英文字母夾雜西里爾、希臘、亞美尼亞形似字元(例：`Ιmmսոοglоbսlins`)，是防複製／追蹤記號。腳本比對前會還原。之後新匯入的資料若要貼進頁面，會帶著這些記號，所以一律改寫，不貼原文。
  - **限制**：中文翻譯式近似照抄抓不到；國考書 PDF 是掃描圖檔沒文字層，無法比對(需 OCR)；圖表重製要人工看。
  - 人工抽查：antipsychotics 對 UpToDate 兩篇 SGA／FGA，結構、表格、藥名與考點都是重新整理，沒有翻譯式照抄。
  - ~~待做：1b 先抽查 5–8 篇引用 UpToDate 最多的頁面(antipsychotics、depressive-disorder、schizophrenia、sepsis 等)，人工看有沒有翻譯式近似照抄；之後每輪存檔前跑 `source-scan.py`。~~(已抽查 antipsychotics；其餘引用多的頁面在 1b 改寫時順便看)

- **第 1 輪 1b 進度(2026-10-04)**
  - 試做 3 篇：lung-cancer、lithium-level、candida，使用者已同意格式。
  - **重點摘要補條列：142 頁全部完成**(癌症 13、病原體 17、感染疾病 16、care 6、lab 10、行政 33、先前試做 3 與其他)。做法：只用頁面內已有的事實濃縮成 3–5 點，不加新資訊；`build-knowledge` 通過，`source-scan.py` 無新增重疊。
  - **19 頁原本沒有「重點摘要」的頁面也補完(2026-10-04)**：diabetes、blood-glucose、hba1c、ketones、ogtt、uacr、glucose-homeostasis、hypertension、heart-failure、coronary-artery-disease、hypotension、blood-pressure-regulation、cardiac-output、coronary-circulation、schizophrenia、bipolar-disorder、depressive-disorder、neurotransmitters-psychiatry、abg。每頁加「重點摘要」(4–6 點)與「國考常考點」(整理自頁內 `:::exam` 方塊與各段考點，不新增事實)，插在導言段與第一個 H2 之間。**全部 161 頁現在都有重點摘要**，build 與 source-scan 通過。
  - **密集句改分層列點(2026-10-04 完成主要部分)**：重新量測後，原先估的 605 行是高估(引用網址的括號被算進去)；扣掉引用後約 273 行，其中 136 行是「國考常考點」的壓縮條列(刻意保持緊湊，考前掃讀用)，其餘 137 行在內文。已改寫約 100 行：hypertension(22)、diabetes(12)、heart-failure(14)、end-of-life-care、cancer-treatment-toxicities、admin 11 頁、drug 與 pathogen 與 physiology 約 40 行等，全部改成 1. → a. 分層列點，引用保留。**未改**：①導言段(說明性短文，連結多)；②約 25 行附有長引用或國考與新指引對照的敘述(改動容易傷到引用，之後遇到再改)；③「國考常考點」的壓縮條列。
  - **1b 結論**：161 頁都有重點摘要；主要密集句已拆；build 與 source-scan 通過。
  - 下一步：第 1.5 輪免疫，**預計交給雲端 session**，交接說明與來源包規劃在 [sources/immunology.md](sources/immunology.md)；交出去之前要先 commit 並 push 本機的修改。

## 備註

- 頁首的 frontmatter 摘要框已在第 0.5 輪拿掉；frontmatter summary 只給預覽卡用(metformin 有寫)。頁面唯一的重點區塊是 `## 重點摘要 {#summary}`。
- 137 頁的頁尾「國考常考點」已合併到重點摘要底下的 `### 國考常考點`；其中 98 頁的重點摘要只有國考常考點，**第 1 輪要補上 3–5 點重點條列**。
- 全專案 `pnpm lint` 會記憶體不足當掉；改用 `NODE_OPTIONS=--max-old-space-size=8192 npx eslint <檔案>` 只檢查改過的檔。

## 下一步

- 等使用者：①目視確認 0c 畫面(metformin 頁頁首、手機寬度的「出現在」、/me 的「想打好基礎」切換)②回覆資料需求清單(roadmap「需要你補的」)
- 等使用者目視確認第 0.5 輪畫面：重點摘要卡片(國考點直接接在重點後面、沒有子標題)、系統頁/章節頁搜尋、「返回」=回上一頁(電腦版只在章節頁與知識頁出現；手機頂欄標籤改為「返回」)、右下「回到頂端」
- 第 1 輪先做 **1a 既有內容掃描**(UpToDate 與受版權保護來源比對，結果寫 `docs/uptodate-scan.md`，細節見 roadmap「UpToDate 使用原則」)，再做 1b：舊頁分層列點改寫＋重點摘要補條列(先試改 3 篇給使用者看)；之後是 **1.5 輪免疫**，然後才是第 2 輪精神收尾

## 待使用者決定

- **版權優先與 UpToDate 新原則(2026-10-04 使用者決定)**：內容以不碰版權為第一優先，有疑慮就在各文件標注來源與處理；免疫批次已抓的 UpToDate 照用，之後不再請使用者搜尋，除非真的需要確認，每輪結束只列「需確認清單」；不因此降低正確度與深度。免疫輪插在第 1 與第 2 輪之間(1.5 輪)。

- 行政 A–E 輪約 39 題 AI 詳解更正 **尚未 sync_all**(使用者指示：整輪做完再問)
- 資料庫 36 列含 master_id 的舊髒列＋13 列 other 型引號題號，刪除 SQL 已給使用者，未回覆
- 「詳解有更新的題目」清單(新的行政 F 輪)：使用者會再決定要不要開始

## 已完成輪次(摘要)

| 批次 | 篇數 | 完成日 |
|---|---:|---|
| 心血管 | — | 2026-09 |
| 精神 A–C | 8 | 2026-09 |
| 癌症 A–F | 21 | 2026-09 |
| 感染 | — | 2026-09 |
| 護理行政 A–E | 33 | 2026-10-01 |
| 第 0 輪：定位、範本、進度機制 | — | 2026-10-03 |
| 第 0.5 輪：重點摘要合併(137 頁)、搜尋、返回與回到頂端 | — | 2026-10-03 |
| 第 1.5 輪：免疫 A–F | 22 | 2026-10-05 |
| 第 2 輪：精神收尾 A–I | 25 | 2026-10-06 |

## 更新規則

1. 每寫完一篇：存檔 → 在「本輪步驟」或批次表把該篇標完成 → 寫下「下一步」。
2. 寫到一半要停：在「進行中」寫檔名、已完成的 H2、還缺什麼、來源包位置。
3. 一輪結束：跑 build-knowledge、resolver、`knowledge_coverage.py`，把涵蓋數寫進 roadmap，本檔換到下一輪。
- Supabase 寫回：精神整輪完成後一併做(使用者 2026-10-06 決定)
