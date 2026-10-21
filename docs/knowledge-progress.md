# 知識庫製作進度(接續用)

> **任何知識庫工作開始前先讀這份檔案。** 每完成一篇或一個步驟就更新，暫停(額度用完、中斷)後，新的 session 讀這份就能接著做。
> 定位與寫作規則見 [positioning.md](positioning.md)；批次順序與資料需求見 [knowledge-roadmap.md](knowledge-roadmap.md)。

## 目前輪次

- **輪次**：第 10 輪 基護 B(拆 10a、10b，各自收尾寫回)＋標籤合併(基護其餘章＋產兒)
- **計畫**：[round-plans-8-12.md](round-plans-8-12.md)「第 10 輪」(2026-10-20 核准)
- **每輪一個新對話**(使用者 2026-10-20)：開工先讀本檔 → round-plans-8-12.md 第 10 輪 → 路線圖跨輪移交清單；收尾時本檔換到下一輪並建步驟表
- **範圍**(未涵蓋，計畫時)：基護 Ch07 舒適 91、Ch15 排泄 90、Ch12 營養 80、Ch11 冷熱 72、Ch08 活動 50、Ch06 護理過程 47、Ch04 記錄 40、Ch03 觀察溝通 39、Ch01 緒論 32、Ch18 出入院 27、Ch16 繃帶 25、Ch02 環境剩餘、Ch09 睡眠 9；開工時重跑涵蓋報告更新數字
- **跨輪移交(交給本輪，見路線圖)**：
   1. 第 5 輪：營養評估、治療飲食、管灌與 TPN(連 nutritional-disorders)；冷療組織傷害(112-1_FA_021)與燙傷 10 題(連 environmental-injury#heat-injury)
   2. 第 8 輪：約束已在 patient-safety-environment#restraint，舒適與活動頁只連過去；鼻胃管給藥已在 non-parenteral-medication，管灌與 TPN 頁連過去、TPN 走中心靜脈連 iv-therapy
   3. 第 9 輪：尿液與 24 小時尿液檢體已寫在 urinalysis#nursing(admission-discharge-specimens 只連過去)；urinary-elimination 收尿滯留、導尿、膀胱訓練與凱格爾技術、基護 Ch15 尿失禁與尿滯留題，做好後把 urologic-disorders 兩處「基本護理排泄頁另外整理」改成連結並連 urologic-disorders#incontinence；第 8 輪留下的安胎藥物 vs 安胎用藥(tag-merge-round8.md 第五節)
- **課本 OCR**：基本護理學上下冊、內外科護理技術、內外科護理學上下冊、兒科護理學已全書 OCR 在 `相關資源/國考書（最終參考用）/ocr/`(含 PDF 頁↔書頁對照 tsv)
- **圖片**：使用者會用 AI 生成底圖，再由我裁切、改名放進 `public/knowledge-images/` 並補中文標籤(第 9 輪 G 組 im-injection-sites 的做法；原圖移到 `相關資源/AI底圖/`)
- **狀態**：⬜ 尚未開工

## 第 10 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 10-0a | 標籤合併：基護其餘章＋產兒(產科全部、兒科 Ch01–05、16)；只合併真正同義，拿不準的列待決定；含安胎藥物 vs 安胎用藥 | ⬜ |
| 10-0b | 來源包 `sources/fundamentals-b.md`(課本 OCR 對應章；國健署飲食指南、治療飲食、腸造口與導尿衛教單張、NPIAP 2019) | ⬜ |
| A | `procedure/hygiene-comfort-care`、`procedure/positioning-body-mechanics` | ⬜ |
| B | `care/activity-immobility`、`disease/pressure-injury`、`care/sleep-rest` | ⬜ |
| C | `procedure/heat-cold-therapy`(含冷療傷害與燙傷移交題) | ⬜ |
| D | `care/nutrition-assessment-diets`、`procedure/enteral-parenteral-nutrition`；**10a 收尾＋寫回 Supabase＋部署** | ⬜ |
| E | `procedure/bowel-elimination`、`procedure/urinary-elimination`(第 9 輪移交) | ⬜ |
| F | `care/nursing-process`、`care/documentation-orders` | ⬜ |
| G | `care/observation-communication`、`care/nursing-concepts-health` | ⬜ |
| H | `procedure/bandaging`、`procedure/admission-discharge-specimens`；**10b 收尾＋寫回 Supabase＋部署** | ⬜ |

## 第 9 輪摘要(已完成)

- **輪次**：第 9 輪 腎與體液＋透析／CRRT＋標籤合併(腎泌尿＋體液電解質)
- **計畫**：[round-plans-8-12.md](round-plans-8-12.md)「第 9 輪」(2026-10-20 核准)
- **每輪一個新對話**(使用者 2026-10-20)：開工先讀本檔 → round-plans-8-12.md 第 9 輪 → 路線圖跨輪移交清單；收尾時本檔換到下一輪並建步驟表
- **本週目標**：第 8、9、10 輪做完；額度夠再做 11、12
- **範圍**(未涵蓋，計畫時)：內外 Ch10 119、Ch04 36、生解 Ch10 51、Ch11 29、病理 Ch14 22、兒科 Ch12 25、藥理 Ch07 9
- **跨輪移交(交給本輪)**：tag-merge-round5.md 第六節的腎與泌尿同義標籤；第 8 輪留下的尿路感染 vs 泌尿道感染、腎衰竭 vs 腎臟衰竭、電解質用藥 3 個變體(tag-merge-round8.md 第五節)
- **課本 OCR**：三本基護與技術書已 OCR 在 `相關資源/國考書（最終參考用）/ocr/`；內外科護理學上下冊若沒有文字層，照 8-0b 的 ocr.swift＋pagemap.py 做
- **狀態**：**第 9 輪全部完成(2026-10-21)**：生解 Ch10、Ch11、病理 Ch14、兒科 Ch12 100%，內外 Ch10 99%、Ch04 98%、藥理 Ch07 95%；全部 6205 → 6455/8960；11 篇新頁；已寫回 Supabase(刪 73 筆舊標籤)並部署 workers.dev；需確認清單見下；下一輪第 10 輪基護 B

- **收尾要記得**(A–C 組留下，✅ G 組已做)：kidney-urinary-physiology 回補連到 fluid-electrolytes、acute-kidney-injury、chronic-kidney-disease(EPO 段、老年段)；urinalysis 與 renal-function-tests 的「AKI 頁」字樣改成連結；CKD 的造血藥物頁留第 12 輪；路線圖新增移交列給第 10 輪：尿液與 24 小時尿液檢體已寫在 urinalysis#nursing，admission-discharge-specimens 只連過去

## 第 9 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 9-0a | 標籤合併：腎泌尿＋體液電解質＋移交的同義標籤，04／05 同步改 **73 題**(慢性腎衰竭、末期腎疾病→慢性腎臟病；急性腎損傷→急性腎衰竭；尿路感染→泌尿道感染；尿瀦留→尿滯留；應力性→壓力性尿失禁；前列腺肥大 4 個變體→良性前列腺肥大；泌尿道結石→尿路結石；利尿劑用藥→利尿劑；電解質調節劑等→高血鉀用藥等 21 組＋逐題 9 題)；範圍內無標籤 58 題都是解剖生理與檢查題，不補標；頁面舊名(urinary-tract-infection 的尿路感染、taxonomy 利尿劑用藥)收尾寫回後移除；對照見 [tag-merge-round9.md](tag-merge-round9.md) | ✅ 2026-10-21(Supabase 收尾寫回；無待決定) |
| 9-0b | 來源包 [sources/renal.md](sources/renal.md)：內外科護理學上下冊、兒科護理學全書 OCR(到 `ocr/`，後面幾輪共用)；本輪書頁(上冊 Ch3 體液酸鹼 109–151、下冊 Ch19 泌尿 765–868、Ch20 BPH 932、兒科泌尿生殖約 582–)；ICU Book Ch10–11、31–38 PDF 頁；**KDIGO 現況**：AKI 仍 2012 版(2026 AKI／AKD 草案徵詢已結束、未出版)、CKD 2024(2027 用藥更新草案徵詢中)、**貧血 2026 正式版(Hb ≤ 11.5)**、IgAN／IgAV 2025、兒童腎病症候群 2025；2024 台灣腎病年報(資料年 2022)；北醫瘻管衛教；新舊說法表 8 項；公開文件存 `相關資源/腎臟相關/` | ✅ 2026-10-21 |
| 9-0c | taxonomy renal 加 description 與 4 個 groups(kidney-physiology、kidney-diseases、urologic-diseases、dialysis-transplant(device))，urinary-tract-infection 歸 urologic-diseases；build 通過(296 篇)；圖片盤點 [sources/renal-images.md](sources/renal-images.md)(Servier 泌尿套組 12 張看過縮圖；必做 9 張：泌尿道全景、腎臟切面、腎小體(Servier)、腎元分段、體液分布、透析原理、血液透析迴路、瘻管、腹膜透析(原創)；既有 diuretic-sites-nephron、raas-drug-sites 沿用) | ✅ 2026-10-21 |
| A | `physiology/kidney-urinary-physiology`(構造、腎元與過濾屏障、GFR 決定因素表、各段再吸收分泌表、清除率表、逆流倍增與交換、激素表、腎臟內分泌與酸鹼、輸尿管三狹窄、排尿反射神經表、妊娠新生兒老年；約 57 題)；**lab 拆成三篇**以符合 method：`lab/renal-function-tests`(blood：BUN、Cr、BUN/Cr 表、CCr 公式與例題、eGFR 分期；課本 BUN 5–25、Cr 0.7–1.4、CCr 男 90–139 vs 國考 95–135 並列；約 13 題)、`lab/urinalysis`(specimen：基護表 15-2 與內外表 19-7 參考值並列、顏色表、血尿、中段尿、導尿管採檢、兒童集尿袋、24 小時尿液；收基護 Ch18 尿液檢體題；約 21 題)、`lab/urologic-diagnostic-procedures`(invasive：KUB、IVP、逆行性腎盂攝影、腎動脈攝影、腎切片(穿刺點第 12 肋骨與腸骨嵴之間)、膀胱鏡、尿流速、CMG；約 12 題)；新圖 Servier 3 張(泌尿道、腎臟切面、腎小體，標籤逐點核對)＋原創 nephron-functions(**待使用者確認**)；**生解 Ch10 31% → 100%**、內外 Ch10 39% → 52%、基護 Ch18 72%；**全部 6205 → 6283/8960**；build(300 篇)、resolver、source-scan(4 篇無重疊)、本機 4 頁與 4 張圖 200(測完已關) | ✅ 2026-10-21 |
| B | `physiology/fluid-electrolytes`(體液分布表、移動機轉表、調節表、容積缺失三型表、兒童脫水分級(兒科課本表 10-8)、容積過量與水中毒、燒傷休克期與利尿期表、電解質總覽表、低／高血鈉、鎂；約 30 題)；**abg** 新增「酸鹼的調節機轉」(緩衝系統、三道防線、尿 pH)與「代謝性酸中毒與代謝性鹼中毒」(原因症狀處置表、判讀練習表)；**potassium** 高血鉀處置補 5 題；**生解 Ch11 69% → 100%、內外 Ch04 79% → 98%**(剩 106-2_MS_080 送分題、106-2_MS_016 腸阻塞留第 11 輪) | ✅ 2026-10-21 |
| C | `disease/acute-kidney-injury`(三類原因表、KDIGO 2012 分期表＋2026 草案註記、四期病程表、少尿期表現表、腎前性 vs 腎性指標表、液體計算、透析適應症表、兒童(兒科課本 p.610–611)；約 14 題)、`disease/chronic-kidney-disease`(定義與 CGA、分期與課本護理指導表 19-16、全身表現表 19-17、血壓新舊並列(國考 130/85、課本 130/80、KDIGO 2021 收縮壓 < 120)、腎性貧血 KDIGO 2026、鈣磷骨病變、飲食表 19-18 與 KDIGO 2024 蛋白質 0.8 並列、台灣年報；約 30 題)；新規則：chapters 的 H3 要該 H3 ≥ 15 題才能單獨對照；**內外 Ch10 52% → 66%**、兒科 Ch12 51%、病理 Ch14 58%；**全部 6283 → 6351/8960**；build(303 篇)、resolver、source-scan(5 篇無重疊)、本機 5 頁 200(測完已關) | ✅ 2026-10-21 |
| D | `device/dialysis-crrt`(透析原理表與透析液設計、血液透析流程、血管通路表(雙腔、Perm Cath、AVF、AVG)、瘻管照護(握球：課本術後 24 小時 vs 北醫第 3 天並列)、通路併發症、透析前中後護理、乾體重(課本 5–6%、國考 5%)、HD 合併症表(低血壓、不平衡症候群、痙攣、出血)、腹膜透析步驟與飲食、PD 合併症表＋ISPD 2022 腹膜炎診斷、HD vs PD 比較表、CRRT(ICU Book、KDIGO 2012 局部檸檬酸)、兒童透析、腎移植一節(排斥與用藥連 immunosuppressants)；chapters 用 H3「透析治療與腎臟移植」(24 題)；新圖 4 張：servier-hemodialysis(標籤 4 個，格線核對)、原創 dialysis-principles、av-fistula、peritoneal-dialysis(**待審核**)；透析題 13 題全收；AKI、CKD 的「透析頁」字樣已改成連結；**全部 6351 → 6364** | ✅ 2026-10-21 |
| E | `disease/glomerular-diseases`(腎炎 vs 腎病症候群比較表、AGN 機轉檢查照護、慢性腎絲球腎炎、腎病症候群機轉與成人兒童檢查值、**KDIGO 2025 兒童首次類固醇 8 或 12 週**與課本療程並列、RPGN、IgA 腎病變、多囊腎；C3 下降(課本寫 C3、C4 都降，註記 C4 多正常))、`disease/pediatric-genitourinary`(兒童腎功能與尿量、VCUG、VUR 分級表＋課本 AAP 2011 與 RIVUR 2014 並列、隱睪症(課本 2 歲前 vs AUA 2014 18 個月前、不建議荷爾蒙)、尿道下裂術後、尿道上裂、包莖、Wilms 連 pediatric-cancers)；loop-diuretics 補 1 題；**兒科 Ch12 51% → 100%**、病理 Ch14 87%、藥理 Ch07 88%、內外 Ch10 78%(剩下都是 F 組：結石、BPH、TURP、膀胱癌、腎癌、尿失禁)；**全部 6364 → 6407/8960**；build(306 篇)、resolver、source-scan(4 篇無重疊) | ✅ 2026-10-21 |
| F | `disease/urologic-disorders`(結石成分與 pH 表、腎絞痛、ESWL／PCNL 等處置表、預防復發(課本每天 3,000–4,000 mL、EAU 尿量 2.0–2.5 L)、水腎與阻塞後利尿、BPH 病理與 IPSS、藥物第一線、TURP 術後(三腔導尿管、CBI 用生理食鹽水、TUR 症候群、逆行性射精多為永久、3 個月衛教)、前列腺癌、膀胱癌與膀胱灌注(至少 2 小時、每 15 分翻身)、尿路改道表與造口照護、腎細胞癌、尿失禁六型比較表與藥物、凱格爾與膀胱訓練、勃起障礙 cGMP；國考 113-2 與 113-3 對 BPH 頻尿夜尿是否最早出現答案不一致，頁面並列)；新圖：servier-hydronephrosis(只留切面，5 個標籤格線核對)、原創 bladder-irrigation(**待審核**)；**內外 Ch10 78% → 99%、病理 Ch14 87% → 100%、藥理 Ch07 95%**；**全部 6407 → 6455/8960**；build(307 篇)、resolver、source-scan(無重疊)；剩下的範圍內題目都屬他系統：107-1_MS_078 溺水、113-1_MS_007 肝硬化與 106-2_MS_016 腸阻塞(第 11 輪)、107-1_MS_020 骨鬆(肌骨輪)、106-2_MS_080 送分；**移交**：睪丸腫瘤(病理 Ch15 3 題)、前列腺與男性生殖解剖(生解 Ch13)留生殖輪；尿滯留、導尿、膀胱訓練技術與基護 Ch15 尿失禁題留第 10 輪 urinary-elimination(本頁文字寫「基本護理排泄頁另外整理」，第 10 輪做好後改成連結) | ✅ 2026-10-21 |
| G | 收尾＋使用者看圖後修改：im-injection-sites 改用使用者 AI 底圖(裁外框、轉 JPG、11 個標籤格線核對；圖說註明腹臀肌手勢只示意；原圖移到 `相關資源/AI底圖/`；舊 SVG 刪除)；servier-hemodialysis 因通路畫在肘窩附近而**刪除**(頁面、標籤檔、credits 一併移除)；bladder-irrigation 重畫成沖洗液接到三腔導尿管體外端的流入腔；5 處回補連結(kidney-urinary-physiology 連 fluid-electrolytes、AKI、CKD#anemia、CKD#staging；urinalysis、renal-function-tests 的「AKI 頁」改連 AKI#diagnosis；AKI、CKD 的透析頁字樣 D 組已改)；11 篇補縮寫英文全名 116 處；路線圖：第 6 輪 CRRT 列改為已在 dialysis-crrt、標籤合併列腎打勾、新增 6 列(第 10、11、12、14、15、16 輪)；`sync_all.py` 寫回(questions 8960、question_tags 16687)、刪除 73 筆 9-0a 合併前的舊標籤列(DB＝來源 16687)；urinary-tract-infection dzTags 移除尿路感染、taxonomy diuretics 移除利尿劑用藥；重跑 build(307 篇)、resolver、export、source-scan(新增 3 筆檢視都是 KDIGO 全名)、image-license-review(113 張、需替換 0)；部署 workers.dev，11 篇新頁與 injections、新圖線上 200 | ✅ 2026-10-21 |

### 第 9 輪需確認清單

1. 圖片待審核：A 組 servier-urinary-tract、servier-kidney-section、servier-renal-corpuscle、nephron-functions；D 組 dialysis-principles、av-fistula、peritoneal-dialysis；F 組 servier-hydronephrosis；G 組重畫的 bladder-irrigation、改用 AI 底圖的 im-injection-sites(腹臀肌手勢與教科書不同，已在圖說註明)；fluid-electrolytes 沒做體液分布圖，用表格
2. 台灣活體捐腎年齡：國考題寫 20 歲以上，《人體器官移植條例》現行年齡規定未核對(dialysis-crrt#transplant 寫「待核對」)
3. CRRT 照護「注意體溫」標為一般照護原則、待核對(dialysis-crrt#crrt)
4. 急性腎絲球腎炎補體：內外科課本寫 C3、C4 都下降，兒科課本只寫 C3；頁面註記 PSGN 的 C4 多正常，沒有附來源(glomerular-diseases#agn-diagnosis)
5. 硫酸鎂監測數值(呼吸 ≥ 12–16 次／分、尿量約 25–30 mL/h)依臨床常用寫法，產科輪再對產科課本(fluid-electrolytes)
6. 國健署護腎「三少」(少鹽、少油、少糖)依國考答案，國健署原始衛教未核對(chronic-kidney-disease)
7. 已並列、不需確認但提醒：CKD 血壓目標(國考 130/85、課本 < 130/80、KDIGO 2021 收縮壓 < 120)；CKD 蛋白質(課本 0.6、KDIGO 2024 0.8 g/kg)；腎性貧血(課本 Hct 33–36%、KDIGO 2026 Hb ≤ 11.5)；握球運動開始時間(課本 24 小時、北醫第 3 天)；兒童腎病症候群類固醇(課本療程、KDIGO 2025 8 或 12 週)；VUR 預防性抗生素(課本 AAP 2011、RIVUR 2014)；隱睪手術時機(課本 2 歲前、AUA 2014 18 個月前)；BPH 頻尿夜尿是否最早出現(113-2 與 113-3 國考答案不一致)

## 第 8 輪摘要(已完成)

- **輪次**：第 8 輪 基護 A(給藥、體溫脈搏血壓、體液供給＋安全環境)＋標籤合併(基護 Ch10、13、14＋肌骨皮膚)
- **計畫**：[round-plans-8-12.md](round-plans-8-12.md)「第 8 輪」(2026-10-20 核准；第 8–12 輪共用一份計畫，共通規則與收尾順序也在裡面)
- **每輪一個新對話**(使用者 2026-10-20)：開工先讀本檔 → round-plans-8-12.md 對應的輪 → 路線圖跨輪移交清單；收尾時本檔換到下一輪並建步驟表
- **本週目標**：第 8、9、10 輪做完；額度夠再做 11、12
- **範圍**(未涵蓋，2026-10-20)：基護 Ch13 給藥 116、Ch10 體溫 32／脈搏 22／血壓 10／綜合 11、Ch14 體液供給 65、Ch02 醫療環境控制 18
- **課本**：`相關資源/國考書（最終參考用）/基本護理學上冊.pdf`(552 頁)、`下冊.pdf`(593 頁)、`內外科護理技術.pdf`(477 頁，只當參考)；三本都沒有文字層，要 Vision OCR(第 7 輪的 ocr.swift 在舊 scratchpad，要重寫)；PDF 頁 ≠ 書頁，8-0b 建對照表
- **跨輪移交(交給本輪)**：安全環境(火災 RACE、用氧安全，113-2_FA_004)
- **狀態**：**第 8 輪全部完成(2026-10-20)**：基護 Ch02、10、13、14 全部 100%、基護 47% → 65%、全部 5906 → 6205/8960；7 篇新頁；已寫回 Supabase 並部署 workers.dev；8 張原創圖全部**待審核**(肌肉注射部位、脈搏部位之後改用使用者的 AI 底圖再補標籤)；需確認清單見下；下一輪第 9 輪腎與體液

## 第 8 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 8-0a | 標籤合併：基護 Ch10、13、14＋肌骨皮膚，04／05 同步改 **67 題**(基護 A 9 組：便祕→便秘、體液不平衡等→體液失衡、體溫過低→低體溫、浸潤 4 個名稱→靜脈注射浸潤、解熱鎮痛 3 個變體→解熱鎮痛用藥等；肌骨皮 8 組：骨性關節炎等→退化性關節炎、腔隙症候群等→腔室症候群、**壓傷→壓力性損傷**(依 NPIAP 譯名，非題數)、牛皮癬→乾癬、痛風性關節炎→痛風、痛風用藥 2 個變體等)；範圍內無標籤題(基護 A 144、肌骨皮 118)逐題看過都是技術或解剖題，不補標；腎泌尿與產兒的同義標籤記在第五節留給第 9、10 輪；對照見 [tag-merge-round8.md](tag-merge-round8.md) | ✅ 2026-10-20(Supabase 收尾寫回；無待決定) |
| 8-0b | 三本課本全書 OCR(上冊 552、下冊 593、內外科護理技術 477 頁；macOS Vision)，文字與 PDF↔書頁對照表存 `相關資源/國考書（最終參考用）/ocr/`(本機，第 10 輪也用)；來源包 [sources/fundamentals-a.md](sources/fundamentals-a.md)：本輪章節書頁、課本現況摘記、管制藥品管理條例、**115–116 年醫院版病安目標**(2026-03-18 公告，課本引的是 2022–2023 版)、ISMP 錯誤縮寫、醫院血品文件、約束衛教、新舊說法表 8 項(三讀五對 vs 七對、腹臀肌優先、IM 回抽 vs CDC 疫苗不回抽、水銀體溫計停售等)；公開文件存 `相關資源/基護相關/` | ✅ 2026-10-20 |
| 8-0c | taxonomy fundamentals 加 description 與 4 個 groups(medication-administration、vital-signs、fluids-transfusion 為 procedure；safety-infection-control 為 care，infection-control、asepsis-sterilization 已歸入)；體溫頁改為 `procedure/body-temperature`；build 通過(289 篇)；圖片盤點 [sources/fundamentals-a-images.md](sources/fundamentals-a-images.md)(18 項：原創 9、Servier 5、表格 4；必做：注射角度、肌肉注射部位、發燒分期、脈搏部位；本機沒有 LibreOffice，Servier 只用投影片標題盤點，寫到該組再轉 SVG 看) | ✅ 2026-10-20 |
| A | `procedure/medication-administration-principles`(藥名、劑型與吸收快慢、交互作用與食物、依賴性、兒童劑量公式；醫囑種類 St／S.O.S.／p.r.n.、口頭醫囑；縮寫表加 ISMP 避免使用欄；常規給藥時間；三讀五對(課本：單一劑量藥車的三讀時機)、條碼給藥流程；劑量計算 12 例；給藥系統、保存溫度與開封期限；高警訊與 KCl、管制藥品四級；給藥安全與拒服漏服處理；約 68 題) | ✅ 2026-10-20 |
| B | `procedure/injections`(共通原則、抽藥、四種注射比較、四個肌肉注射部位、回抽的國考 vs CDC 疫苗、Z 字形與預留氣泡、皮下胰島素與肝素、皮內與 PST／TST、IV push 法規、兒童注射；約 23 題)、`procedure/non-parenteral-medication`(口服禁忌與特殊藥、鐵劑、兒童餵藥與量藥、鼻胃管給藥、肛門栓劑步驟表(深度：國考 6.4–7.6 cm 與課本 2–4 cm 並列)、陰道、吸入、眼耳鼻滴入、Fentanyl 貼片；約 20 題)；新圖 injection-angles、im-injection-sites、z-track(原創，**待使用者確認**) | ✅ 2026-10-20 |
| C | `procedure/body-temperature`(調節與四種散熱、影響因素、測量部位表、發燒分期與型態、發燒護理、熱衰竭 vs 中暑、低體溫分級與回溫；約 32 題)、`procedure/pulse-blood-pressure`(脈搏四特性、異常脈律表、部位表、心尖脈時機、MAP 與決定因素、壓脈帶與步驟表、誤差表、兒童生命徵象、綜合判斷；約 43 題)；新圖 thermoregulation、fever-stages、pulse-sites、korotkoff-sounds(原創，**待使用者確認**) | ✅ 2026-10-20 |
| D | `procedure/iv-therapy`(體液評估、張力表與各溶液注意、選靜脈與讓靜脈明顯、設備與套管滴數、滴速計算 11 例、輸液中照護、併發症表(浸潤濕熱敷；靜脈炎課本濕冷敷與國考溫敷並列)、燒傷 Parkland、營養途徑；約 65 題)；**blood-transfusion 不另開**(既有 transfusion-reactions 已涵蓋，補 1 題)；新圖 iv-fluid-tonicity(原創，**待使用者確認**)；**基護 Ch10、13、14 全部 100%**、基護 47% → 64%、**全部 5906 → 6173/8960**；build(295 篇)、resolver、source-scan(6 頁無重疊)、image-license-review(104 張需替換 0)、本機 3005 埠 7 頁與 8 張圖 200(測完已關) | ✅ 2026-10-20 |
| E | `care/patient-safety-environment`(舒適環境表、傷害分類、跌倒危險因子與預防表(課本「浴室門口放地毯」「厚底鞋」與國考並列)、約束(CTMS、1–2 指、平結綁床架、兒童手肘約束與雙套結；課本 15–30 分鐘與北醫 30–60 分鐘並列)、火災 RACE 與 PASS＋滅火器分類表、放射線(109-1_FA_016 MRI 雙解註記)、地震、病房廢棄物判斷、病人單位與汙漬；dzTags 跌倒；**RACE 移交完成**；約 32 題，另收 Ch01、Ch08 約束題與社區 Ch08 老人跌倒 4 題)；infection-control 手部衛生補 107-2_FA_004；delirium 約束結的註記改依華杏課本(平結)；**基護 Ch02 63% → 100%**、基護 65%、**全部 6205/8960**；build(296 篇)、resolver、source-scan 無重疊、本機 3 頁 200(測完已關) | ✅ 2026-10-20 |
| F | 收尾：11 頁回補連結(oxygen-therapy RACE 預告改連結、hypertension、digoxin、blood-pressure-regulation、insulin、anticoagulants、patient-safety-reporting、potassium、respiratory-assessment、sepsis、hospital-safety-environment、environmental-injury)；6 篇補縮寫英文全名；路線圖移交清單 RACE 打勾並新增 7 列(第 10、13、14、15、16、17 輪)；`sync_all.py` 寫回(questions 8960、question_tags 16693)、刪除 69 筆 8-0a 合併前的舊標籤列(DB＝來源 16693)；頁面與 taxonomy 沒有舊名要清；重跑 build(296 篇)、resolver、export、source-scan(新頁只有 CDC 全名片語)、image-license-review(104 張、需替換 0)；部署 workers.dev，8 頁與 8 張圖線上 200；**圖片先用目前版本上線**(使用者 2026-10-20：AI 底圖之後再換) | ✅ 2026-10-20 |

### 第 8 輪需確認清單

1. 8 張原創圖(injection-angles、im-injection-sites、z-track、thermoregulation、fever-stages、pulse-sites、korotkoff-sounds、iv-fluid-tonicity)全部待審核；**im-injection-sites(✅ 2026-10-21 已換使用者 AI 底圖)、pulse-sites** 等使用者提供 AI 底圖後重做文字標籤(照解剖圖標籤準確度規則逐點核對)
2. 肛門栓劑深度：課本 2–4 cm vs 國考答案成人約 6.4–7.6 cm(non-parenteral-medication，兩者並列)
3. 靜脈炎濕冷敷(課本)vs 110-1_MS_029 溫敷為正確(iv-therapy，兩者並列)
4. S.O.S. 醫囑 12 小時有效、digoxin 漏服 4 小時內補服：只有考題與詳解為依據，未找到院方規範原文(medication-administration-principles)
5. 結核菌素測驗(TST)判讀切點依課本，CDC 原文未取得(injections)
6. 手術室溫溼度：國考 20–27 ℃、50–70% vs 課本 20–28 ℃、50–80%(patient-safety-environment)
7. 《執行精神疾病病人拘束身體或限制行動自由處置辦法》(2024-12-14)原文未下載核對；新頁只寫一般病房約束，精神科連到 schizophrenia#restraint


## 第 7 輪摘要(已完成)

- **輪次**：第 7 輪 社區 A＋標籤合併(社區 5 章＋血液剩餘)；計畫檔 `~/.claude/plans/a-peaceful-valiant.md`
- **範圍**(2026-10-15)：社區 Ch01 73/82、Ch03 44/49、Ch05 90/96、Ch10 79/102、Ch13 35/51 未涵蓋，共 321 題(259 題沒有標籤，用 chapters＋`::questions{ids}` 收錄，照 community-mental-health 做法，不建 com: 標籤)
- **狀態**：計畫已核准(2026-10-15)；**第 7 輪全部完成(2026-10-16)**：社區 Ch01、03、05、10、13 全部 100%、社區 38% → 67%、全部 5906/8960；已寫回 Supabase 並部署 workers.dev；需確認清單見下；下一輪第 8 輪基護 A
- **使用者決定(2026-10-15)**：
  1. 標籤合併額外帶**血液剩餘**
  2. **第 7 輪本週做完**；下週從第 8 輪基護 A 做到第 10 或 11 輪；本週剩下額度給生物化學，組數不要拉長
- **跨輪移交(交給本輪)**：粉塵作業特殊健檢項目(✅ 7-0b 已查到並回補 restrictive-lung-diseases)、居家氣切與鼻胃管資源 4 題(F 組)、admin/hospital-safety-environment 互連(F 組)

## 第 7 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 7-0a | 社區 A＋血液剩餘同義標籤合併：04／05 同步改 **17 題**(社區 2：噪音性→職業性聽力損失、老年衰弱症→衰弱症；血液 15：貧血用藥、排鐵劑用藥、凝血功能異常、特發性血小板減少性紫斑症、血小板減少症、溶血性輸血反應、血液疾病)；社區範圍 259 題無標籤，14 題提到疾病都是選項或情境，不補標；taxonomy antianemics 加排鐵劑用藥(舊別名抗貧血用藥收尾寫回後移除)；對照見 [tag-merge-round7.md](tag-merge-round7.md) | ✅ 2026-10-15(Supabase 收尾寫回；第四節 1 項待決定) |
| 7-0b | 來源包 [sources/community-a.md](sources/community-a.md)：華杏《社區衛生護理學》2021(掃描檔，Vision OCR 到 scratchpad `r7/txt/`，PDF 頁 ≠ 書頁)本輪對應章頁碼；全國法規 18 部(條文在 scratchpad `r7/law_txt/`)；**新舊說法**：勞工健康保護規則 2026-06-26 全文修正(一般健檢改 60 歲以上每年、40–59 每 2 年、未滿 40 每 3 年，2028-01-01 施行)、衛福部組織法 2026-09-30 公布新設兒少及家庭支持署與社會發展及長期照顧署(施行日待定)、長照給付辦法三階段(2025-09、2026-01、2026-07)、健保部分負擔 2023-07 新制；**移交項目完成**：附表十粉塵作業檢查項目(胸部 X 光大片、肺功能 FVC／FEV1.0／比值)已寫進 restrictive-lung-diseases#pneumoconiosis | ✅ 2026-10-15 |
| 7-0c | taxonomy community 加 description 與 5 個 care groups(community-health-system、community-statistics、community-assessment、long-term-care、occupational-environmental)；build 通過(278 篇)；圖片以表格為主，社區評估架構、長照服務體系兩張原創圖在 D、E 組視需要畫 | ✅ 2026-10-15 |
| A | `care/vital-statistics`(group community-statistics，alsoIn obstetrics；比、比例與率、性比與生命指數、人年、發生率與盛行率與計算例、死亡率與致死率、婦嬰死亡指標表(周產期 28 週＋7 天、孕產婦 42 天每 10 萬活產；ICD-10 周產期 22 週並列)、粗率與直接、間接標準法(SMR)、生育與繁殖率、自然與社會增加率、扶養比與老化指數(2025 年底換算約略值)、高齡化分級(臺灣 1993／2018／2025 年底 20.06%)、平均餘命與健康平均餘命、臺灣近況(114 年十大死因、標準化死亡率 395.2、平均壽命 81.27、TFR 0.695)、統計資料來源；收 Ch03 49 題＋Ch08 高齡化分級 5 題)；課本第 11 章 OCR 核對；**社區 Ch03 100%**、社區 38% → 42%；全部 5586 → **5635/8960**；build、resolver(要用 `database/.venv/bin/python`)、source-scan(只有 ICD-10 英文全名「檢視」)通過；使用者回覆：性比 2013 年起低於 100(國發會人口推估查詢系統)、高齡社會只寫 2018 年；2025 年底扶養比 46.13、扶老比 29.31、扶幼比 16.82、老化指數 174.25 用內政部戶籍人數算出(國發會網站對程式回 403；**使用者 2026-10-15 核對：扶養比、扶老比、扶幼比正確；老化指數 174.25 使用者暫時找不到資料，頁面維持依內政部人數換算**) | ✅ 2026-10-15 |
| B | `care/community-health-nursing-intro`(名稱與定義、熱氣球模式、Spradley 三階段、臺灣公衛重點變遷、7 項特性、綜合性與專科化、8 分科與台灣護理學會 5 場域、13 種角色表(含照護協調者)、WHO 特質與核心能力、White 3E、阿瑪阿塔與 4A、HiAP、2025 白皮書、Bullock 政策 6 步驟；28 題含 Ch04 1 題)、`care/health-administration-system`(衛福部 10 司 6 處與所屬署(依處務規程 2024-05-21 與衛福部網站 2026-06)、各司職掌表、**2026-09-30 組織法修正(兒少及家庭支持署、社會發展及長期照顧署，施行日待定)**、地方衛生局與衛生所四階段與三類型、群體醫療執業中心、社區醫療群、三段照護體系、各子體系、2025 擴大五癌篩檢(二手資料，細節留第 13 輪)、偏鄉離島(IDS、醫師動病人不動、在地醫療為主空中轉診為輔)；17 題)；課本第 1、6、9 章 OCR 核對；**社區 Ch01 緒論、行政組織、照護體系、健康政策 4 個 H2 100%**(Ch01 11% → 60%)；社區 42% → 46%；全部 → **5676/8960**；build、resolver、source-scan(兩頁無重疊)、本機頁面 200 | ✅ 2026-10-15 |
| C | `care/national-health-insurance`(alsoIn administration；強制社會保險、單一保險人、六類被保險人(健保法第 10 條)、費率 5.17%／補充 2.11%、眷屬三口、補充保費六類、財源、欠費第 37 條、給付七大類與第 51 條不給付表、第 55 條核退、部分負擔法定比率與 2023-07 新制、免部分負擔、支付制度表(RUGs 國考答案與實務並列)、總額、預防保健新舊對照(2025 成人健檢 30–39 歲每 5 年，國健署)、健康照護經濟(道德危害 vs 逆選擇)；21 題)、`care/health-equity`(健康不平等定義、2020 白皮書三面向、2025 白皮書弱勢照顧、弱勢族群分類、可近性策略、原住民族(55 歲健檢、40 歲肝炎、全額保費補助條件依課本、文健站 55 歲、107 年原鄉策略)、新住民、身障鑑定(身權法第 5–7 條、ICF)、遊民、WHO、SDGs 3.1／3.2／3.4；17 題)；課本第 7、8、23 章 OCR 核對；**社區 Ch01 100%**(82/82)；社區 46% → 49%；全部 → **5709/8960**；build、resolver、source-scan(無重疊)、本機頁面 200；使用者補充(2026-10-15)：孕婦產檢現行 **14 次**、國健署 114 年擴大五癌公告內容、健保署 112-07-01 部分負擔新聞稿 PDF(`相關資源/`)，三項已寫入 national-health-insurance 與 health-administration-system，不再待核對 | ✅ 2026-10-15 |
| D | `care/community-assessment`(社區定義與四要素、Ross 三類型(病友團體＝互動性，依國考)、Warren 五功能表、健康社區、評估內容三方向、Anderson 與 McFarlane 社區核心＋8 次系統表、評估步驟、9 種評估方法表、有形與無形資源(3M、人力最易取得最難掌控)、資源屬性與 7A；62 題含綜合題)、`care/community-nursing-process`(社區為夥伴、White 3P 與 3E、Stanhope 模式、MAPP、Omaha、8 項排序準則與 Freeman 五原則、Muecke／Stanhope／Vilnius 計分與 PEARL、RUMBA 與 5W、Warren 社區動力、評值四種類與第三類錯誤、夥伴關係與賦權、社區健康營造緣起與精神、步驟(國考 115-1 五步與課本四步並列)、4 期程、健康社區評估三面向、資源運用原則、健康城市、安全社區、高齡友善城市、部落社區健康營造；34 題)；課本第 2、3、5 章 OCR 核對；**社區 Ch05 100%**(96/96)；社區 49% → 57%；全部 → **5796/8960**；build、resolver、source-scan(無重疊)、本機頁面 200 | ✅ 2026-10-15 |
| E | `care/long-term-care`(42 題：6 個月定義、評估工具表、居家／社區／機構住宿式、護理之家與老福機構人力 1:15、1:5、失智型 1:3)、`care/long-term-care-services`(35 題：申請資格新舊對照(2026-01-01 起失智不限年齡、PAC)、四包錢額度與附表五部分負擔、喘息 32,340／48,510 元、ABC、失智資源、長照 3.0 已施行配套並列，計畫內容標待核對)；法規附表從全國法規下載核對 | ✅ 2026-10-16 |
| F | `care/home-care-discharge-planning`(28 題：健保居家收案條件、每月 2 次、RUGs、出院準備流程、照專與個管師分工；移交 4 題併入並連 artificial-airway#tracheostomy)、`care/occupational-health-nursing`(51 題：勞工健康保護規則 2026 修正與 2028 健檢新制並列、附表三人力、附表六 52 小時、四級管理、噪音 85／90 dBA(112-2 詳解誤寫 85 標示，法規為 90)、母性保護與哺乳)；Ch10 102/102、Ch13 51/51；社區 57% → 67%、全部 5906/8960 | ✅ 2026-10-16 |
| G | 收尾：使用者提供資料更新(家托含失能家屬不超過 4 人、居家醫療整合計畫主治醫師每 3 個月至少訪視 1 次與國考「每 2 個月」並列、長照 3.0 行政院 2025-12-31 核定)；3 題 AI 詳解更正(112-2_PC_071、108-2_PC_048 噪音 85／90 dBA，106-2_PC_072 第三級管理定義)；7 頁回補連結(dementia、end-of-life-care、community-mental-health、environmental-injury、restrictive-lung-diseases、artificial-airway、hospital-safety-environment)；5 篇補縮寫全名；路線圖移交清單打勾並新增 5 列給第 13 輪社區 B；`sync_all.py` 寫回(questions 8960、question_tags 16698)、刪除 17 筆合併前的舊標籤列(DB＝來源 16698)、taxonomy 移除舊別名抗貧血用藥；重跑 build、resolver、export、image-license-review(96 張、需替換 0)；部署 workers.dev，11 篇線上 200 | ✅ 2026-10-16 |

### 第 7 輪需確認清單

1. 老化指數 174.25(vital-statistics)：由內政部人口數自算，找不到官方公告值
2. 健保居家照護醫師訪視「每 2 個月 1 次」(home-care-discharge-planning)：國考答案，支付標準第五部第一章原文未取得
3. 長照 3.0 八大方向(long-term-care-services#ltc-3)：來自衛福部 2025 簡報的轉述，核定本內容未逐條核對
4. 出院銜接長照平均天數 51 → 4 天、目標 2 天(long-term-care-services#ltc-3)：二手轉述行政院 2026-04 新聞稿
5. 標籤：紅血球增多症 vs 真性紅血球增多症是否合併(建議維持兩個)
6. 衛生福利部組織法新設兩署的施行日：行政院公告後要改 health-administration-system、long-term-care

## 第 6 輪摘要(已完成)

- **輪次**：第 6 輪 呼吸系統＋呼吸器材＋標籤合併(呼吸＋免疫)；計畫檔 `~/.claude/plans/6-tag-tag-melodic-babbage.md`
- **範圍**(未涵蓋，2026-10-15)：內外 Ch09 119/201、生解 Ch08 81/89、基護 Ch10「呼吸」與「氧氣治療與呼吸道清潔技術」29/41、兒科 Ch08 25/81、病理 Ch11 19/45、藥理 Ch05 1/69，約 274 題＋跨科同標籤與器材題
- **狀態**：計畫已核准(2026-10-15)；**第 6 輪全部完成(2026-10-15)**，已寫回 Supabase 並部署；使用者看過 F–H 的圖後提出 3 點調整已完成(其餘圖可以)；仍待使用者：結核病 vs 肺結核是否合併(建議維持)；下一輪第 7 輪社區 A
- **使用者決定(2026-10-15)**：
  1. 本輪額外合併的系統：**免疫**(跨輪移交清單點名的那列)
  2. 基護 Ch10「呼吸」與「氧氣治療與呼吸道清潔技術」兩節**放第 6 輪**；第 8 輪基護 A 只做體溫、脈搏、血壓
  3. 器材頁先用公開資料，另參考 `相關資源/The ICU Book, 5th edition ... .pdf`(Marino 第 5 版，2025；只參考、不複製；Ch22–31 呼吸與酸鹼，沒有胸管專章)；讀不到或數字只有單一來源時列清單請使用者下載或截圖
- **跨輪移交(交給本輪)**：肺栓塞臨床處置(E 組)、呼吸標籤合併(6-0a)、免疫標籤合併(6-0a)


## 第 6 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 6-0a | 呼吸＋免疫同義標籤合併：04／05 同步改 **91 題**(呼吸 21 組、免疫 12 組)，逐題記在題目修正紀錄；範圍內無標籤 63 題(去重)都是解剖、生理、技術題，不補疾病標籤；sle、autoimmune-diseases、transfusion-reactions、primary-immunodeficiency 補 dzTags，taxonomy respiratory-drugs 加鎮咳祛痰用藥；build 通過；對照見 [tag-merge-round6.md](tag-merge-round6.md) | ✅ 2026-10-15(Supabase 收尾寫回；第五節 1 項待決定) |
| 6-0b | 圖片盤點 [sources/respiratory-images.md](sources/respiratory-images.md)：看過 Servier 5 套(Respiratory-system 23 張、ENT 13、Medical-acts、Medical-equipment、Emergency-equipment；縮圖在 scratchpad `servier6/`)；候選 29 項(Servier 12 張：呼吸道、喉、聲帶、肺葉、肺泡、呼吸動作、慢支與肺氣腫、肺水腫、肺栓塞、氣胸等；原創 13 張：肺泡細胞、spirogram、氧解離曲線、CO2 運輸、V/Q、呼吸型態、聽診位置、肋膜腔、張力性氣胸、連枷胸、胸管引流瓶、胸管位置、人工氣道；表格 4)；器材圖 Servier 沒有，全部原創；4 項待決定 | ✅ 2026-10-15(**等使用者看清單**) |
| 6-0c | 來源包 [sources/respiratory.md](sources/respiratory.md)：確認 GOLD 2026(v1.3)、2023 ARDS 全球定義、**2026 AHA/ACC 急性肺栓塞指引(A–E 新分類，AHA 優先，ESC 2019 並列)**、BTS 給氧 2017(仍現行)、BTS 肋膜 2023、AARC 抽痰 2022、健保署呼吸器依賴定義(連續 21 天、中斷 ≤ 5 天)；ICU Book 5e 各章 PDF 頁碼；醫學中心胸管與氣切衛教 7 份；新舊說法表 8 項；台灣 COPD 指引與疾管署 VAE 中文定義找不到 | ✅ 2026-10-15 |
| 6-0d | 器材資料缺口清單(來源包第六節，6 項：套囊壓、胸管抽吸壓與夾管、健保 NIV 6 小時原文、疾管署 VAE／VAP 定義、北榮衛教、台灣 COPD 指引)；寫到 F、G 組時再請使用者下載 | ✅ 2026-10-15 |
| A | `physiology/respiratory-anatomy`(分區、喉、氣管與支氣管樹、肺葉與肺門、肺泡與呼吸膜、胸膜、嬰幼兒特徵、胎兒肺發育；約 30 題)、`physiology/ventilation-mechanics`(呼吸肌、壓力、順應性與表面張力素、肺容積、阻塞性與限制性、無效腔與肺泡通氣量、換氣過度與不足；約 28 題)；taxonomy 新增 respiratory-physiology 組；pediatric-respiratory-infections#anatomy 改嵌入 respiratory-anatomy#infant；圖：Servier 呼吸道全景、喉、肺葉、肺泡、呼吸動作＋5 個標籤檔(已用格線核對點位)，原創 spirogram(**待使用者確認**) | ✅ 2026-10-15 |
| B | `physiology/gas-exchange-transport`(分壓與擴散、V/Q 與低氧性肺血管收縮、氧解離曲線、CO₂ 運送、呼吸中樞與化學接受器、高海拔；約 21 題)；`lab/abg` 擴寫(判讀與代償表、呼吸性酸鹼中毒與護理、紙袋重複呼吸新舊說法(Callaham 1989，PMID 2499228 已核對)、氧合切點、採檢考點；約 23 題；chapters 改為內外 Ch04 酸鹼 H2、內外 Ch09 評估 H2、生解 Ch11 酸鹼不平衡)；圖：原創 oxygen-dissociation-curve、vq-matching、co2-transport(**待使用者確認**)；**生解 Ch08 9% → 99%**(剩 112-1_MS_054 呼吸音留 C 組)、內外 Ch09 41% → 55%、內外 Ch04 70%、兒科 Ch08 74%；**全部 5322 → 5425/8960**；build 通過、source-scan 4 頁無重疊、image-license-review 88 張需替換 0 | ✅ 2026-10-15 |
| C | `care/respiratory-assessment`(呼吸測量與各年齡速率(OpenStax 基護 7.2)、影響因素、呼吸型態、視觸叩聽、正常與異常呼吸音、語音、呼吸困難與缺氧徵象、脈衝式血氧(FDA 2021)、痰液、影像與肺功能、支氣管鏡、胸腔穿刺(BTS 2023，放液約 1.5 L 以醫囑為準)、吸入性傷害評估；約 30 題)；圖：原創 breathing-patterns(**待使用者確認**)；呼吸音位置改用表格；A 組使用者修正：呼吸道全景刪除「橫膈」標籤(那是胸部線條)、呼吸性細支氣管指到管子上；**生解 Ch08 100%、基護 Ch10 呼吸 97%、內外 Ch09 61%、兒科 Ch08 79%；全部 5455/8960**；給氧、抽痰、姿位引流、人工氣道題(105-1_MS_056、107-2_MS_056、110-1_MS_054、114-1_MS_035、112-3_MS_036、108-2_OP_069、110-1_OP_063、109-2_MS_055、106-2_MS_052、112-2_MS_076)留 G、H 組 | ✅ 2026-10-15 |
| D | `disease/copd`(慢支與肺氣腫比較、評估、GOLD 1–4 與 **ABE 分組(2026 版 E 組改為中度急性惡化 ≥ 1 次)**、初始用藥、急性惡化、控制性給氧與長期氧療(PaO₂ ≤ 55 或 SaO₂ ≤ 88%、> 15 小時)、呼吸訓練、營養、出院；支氣管擴張症、囊性纖維化；約 27 題；GOLD 2026 v1.3 PDF 已下載核對，只引用事實)、`disease/restrictive-lung-diseases`(原因表、間質性肺病、塵肺症連 environmental-injury、石綿相關疾病(IARC 100C)、肺擴張不全；約 5 題)；**內外 Ch09 61% → 74%(下呼吸道 98%)、病理 Ch11 84%；全部 5487/8960**；給氧裝置題(107-2_MS_056、108-1_OP_068)留 H 組、自發性氣胸(107-2_MS_053)留 F 組、早期呼吸衰竭(106-2_makeup_MS_054)留 E 組；**待核對**：勞工健康保護規則粉塵作業特殊健檢項目(國考答案含肺功能，法規附表未查到，移交第 7 輪) | ✅ 2026-10-15 |
| E | `disease/ards-respiratory-failure`(呼吸衰竭兩型與早晚期徵象、ARDS 原因與病生理、1994／Berlin 2012／2023 全球定義並列、肺保護性通氣與 PEEP 與俯臥(ATS 2017)、護理；**新生兒 RDS 也收在本頁**(含 CPAP、Silverman-Anderson、L/S 比)；約 17 題)、`disease/pulmonary-embolism-hypertension`(**跨輪移交：肺栓塞臨床處置** ✅；2026 AHA/ACC A–E 分類對照 ESC 2019(原文網站 403，依多篇摘要交叉核對)、DOAC 優先、LMWH 優於 UFH、溶栓限 E 類；肺水腫比較；肺高壓 2022 ESC/ERS 新定義 mPAP > 20 與五類；肺心症護理；約 10 題)；thrombosis-embolism-infarction 回補連結；C 組補收 112-1_MS_043、115-2_FA_026；**內外 Ch09 74% → 82%(血管性 100%、肺實質 97%)、病理 Ch11 91%；全部 5514/8960**；呼吸器警報與插管題(109-2_MS_054、115-1_MS_033、107-1_MS_075、112-1_MS_075)留 G 組；氧氣題留 H 組；使用者表示本組先不審查 | ✅ 2026-10-15 |
| F | `disease/pleural-chest-trauma`(肋膜炎、積水與 Light 準則、膿胸、氣胸六型、開放性與張力性氣胸(針刺位置：傳統第 2 肋間鎖骨中線＋ICU Book 5e 第 5 肋間腋中線前)、血胸、肋骨骨折、連枷胸、肺挫傷；約 25 題)、`device/chest-tube`(第一個呼吸器材頁；三瓶原理、液面波動與氣泡判讀、夾管與擠壓原則、拔管、胸腔手術術後、異常處理表；約 20 題)；**胸管資料缺口已用公開資料補齊，不用請使用者下載**：ICU Book 5e Ch28(水封 2 cm、抽吸 −20)、NHS Borders 2012 指引(10–20 cmH₂O、冒泡中不可夾、拔管 Valsalva 或吐氣末)、台北慈濟單張(低於胸腔 45–60 cm、每日 < 200 mL)、長庚兒童單張(長管 2–3 cm、深吸氣閉氣拔管)；新圖 4 張(servier-pneumothorax＋原創 chest-drainage-systems、tension-pneumothorax、flail-chest)；C–F 組的「第 6 輪 X 組製作」預告已改連結；**內外 Ch09 82% → 93%(胸廓與肋膜 39/39)、病理 Ch11 96%；全部 5540/8960**；115-1_MS_033 高壓警報留 G 組 | ✅ 2026-10-15 |
| G | `device/mechanical-ventilation`(侵襲與非侵襲、A/C／SIMV／PSV／CPAP、設定表(ICU Book：VT 8→6 mL/kg、平台壓 ≤ 30、I:E ≥ 1:2)、波形圖、高低壓警報表、VAP 組合式照護(IHI 五項＋Cochrane 床頭抬高證據很低)、脫離(SBT 條件 FiO₂ ≤ 50%、PEEP ≤ 8、RSBI ≤ 105、T 型管)、健保呼吸器依賴 21 天)、`device/artificial-airway`(插管與確認位置、門齒 21／23 cm、管尖隆凸上 3–5 cm、套囊 20–30 cmH₂O 與 ICU Book ≤ 25 mmHg、Sellick 標 AHA 不建議常規、氣切照護與意外脫管、甦醒球)；新圖 ventilator-waveforms、artificial-airway；約 20 題(多數已被其他頁自動收錄，新收 6 題) | ✅ 2026-10-15 |
| H | **第一次用 procedure 類型**：`procedure/oxygen-therapy`(裝置表依 ICU Book Table 25.2、BTS 2017 目標、兒童頭罩與氧氣帳、用氧安全、氧中毒)、`procedure/airway-clearance`(深呼吸咳嗽與誘發性肺量計、噴霧、胸腔物理治療順序與姿位引流表、叩擊震顫、抽痰步驟表(AARC 2022：只在需要時、抽前給氧、< 15 秒、成人 < 200／兒童 < 120 mmHg、不常規灌食鹽水)與國考數值)；約 35 題；本機頁面截圖確認(3000 埠 dev 是原本就在跑的，沒有關)；全部 G／H 預告改連結；**內外 Ch09 99%、生解 Ch08 100%、病理 Ch11 96%、兒科 Ch08 96%、基護 Ch10 呼吸與氧氣兩節 100%；全部 5573/8960** | ✅ 2026-10-15 |
| I | 收尾：使用者看圖後調整(co2-transport 加 Band 3 交換蛋白；ventilator-waveforms 依 ICU Book Ch23、Ch27 與 AARC 2022 核對，壓力曲線改成先跳阻力壓再上升、鋸齒改寫成抽痰指標；chest-tube 新增單瓶、雙瓶、三瓶比較表與圖 chest-drainage-1-2-bottle(Zisis 2015 Ann Transl Med)；15 篇第一次出現的縮寫補英文全名)；補收 7 題到 asthma(PEF 例題、學校)、lung-cancer(小細胞癌)、allergic-rhinitis(鼻息肉)、pediatric-respiratory-infections(新增急性鼻咽炎節)、artificial-airway(口咽與鼻咽人工氣道尺寸)、mechanical-ventilation(阻塞型睡眠呼吸中止)；9 頁回補連結(edema-shock、anticoagulants、thrombolytics、heart-failure、environmental-injury、pneumonia、tuberculosis、icp-monitoring、pediatric-respiratory-infections)；跨輪移交新增 5 列；**Supabase 已寫回**(sync_all：question_tags 16698；刪 91 筆合併掉的舊標籤，DB＝來源；清 7 處舊名：stem-cell-transplant、immunosuppressants、antihistamines-autacoids、taxonomy 三個 group)；resolver、export 重跑；source-scan 新增 3 筆「檢視」都是 FEV1 英文全名術語；image-license-review 96 張需替換 0；**內外 Ch09、生解 Ch08、病理 Ch11、兒科 Ch08 100%，藥理 Ch05 99%；全部 5586/8960**；部署 workers.dev | ✅ 2026-10-15 |

### 第 6 輪需確認清單(有空再看，不影響上線)

1. 2026 AHA/ACC 肺栓塞指引原文(網站 403)：A–E 分類是用多篇摘要交叉核對的，能下載 PDF 就再核一次(pulmonary-embolism-hypertension)
2. ✅ 勞工健康保護規則附表：粉塵作業特殊健康檢查項目(restrictive-lung-diseases；第 7 輪 7-0b 已查到附表十並回補)
3. 健保署呼吸器依賴支付方式原文：「連續 21 天、中斷不超過 5 天」來自健保署頁面摘要；「非侵襲性呼吸器每天 > 6 小時」頁面沒寫(mechanical-ventilation)
4. 兒童抽痰壓力與時間：國考各題的數值互相不一致(早產兒「不可超過 60」與「80–100」都被判錯)，頁面以 AARC 2022 上限＋國考答案並列；若有台灣兒科護理課本的標準數值可提供(airway-clearance)
5. 姿位引流角度：下葉上段國考答案是「俯臥頭低 15 度」，多數教材寫俯臥平躺腹下墊枕，頁面兩者並列(airway-clearance)
6. 大量血胸開胸條件的時間窗(每小時 200 mL 持續 2–4 小時，各來源不一)(pleural-chest-trauma)
7. 新生兒 CPAP 4–7 cmH₂O 是國考答案的數值(ards-respiratory-failure)

## 第 5 輪摘要(已完成)


- **輪次**：第 5 輪 病理總論＋遺傳疾病總整理(病理 Ch01 12、Ch03 38、Ch06 31、Ch07 19，共約 100 題未涵蓋；加上各科同標籤題與遺傳疾病跨科題，約 180–200 題)；5-0＋A–E 組、8 篇新頁
- **狀態**：**第 5 輪全部完成(2026-10-15)**：5-0＋A–E、8 篇；病理 Ch01、03、06、07 100%；Supabase 已寫回、**workers.dev 已部署(2026-10-15，版本 434a028f；第一次因硬碟滿失敗，使用者清出空間後重跑成功)**；使用者已看過圖與內容(只補兩個待核對數字)；**下一輪第 6 輪呼吸**(開工前先對 roadmap「跨輪移交清單」，含呼吸標籤合併、肺栓塞臨床處置)
- **使用者決定(2026-10-15)**：
  1. 標籤寫回 Supabase：**第 5 輪病理全部結束後再一起寫回**
  2. 遺傳譜系圖**依遺傳模式分開**(每個模式一張，放在對應段落)
  3. 壞死型態、Punnett 方格、維生素缺乏**用表格**，不畫圖
  4. 燒傷深度圖**本輪先畫**，第 14 輪共用
  5. 「院內感染」改為疾管署用詞「**醫療照護相關感染**」(已改 19 題，`2026-10-15_hai_rename.jsonl`)
  6. 圖片照 B＋C＋D(第 4 輪)做法：先做好放進頁面、標「待使用者確認」，使用者起床再一起看
- **分類**：taxonomy 新增跨系統 domain `general-pathology`(病理總論與遺傳)，groups：pathology-basics(physiology)、genetics(physiology)、genetic-disorders(disease)
- **第 4 輪**：全部完成、Supabase 已寫回、workers.dev 已部署(2026-10-14，版本 94a642c0)；舊的目前輪次內容移到下方「第 4 輪摘要」
- **使用者決定(2026-10-14)**：
  1. 範圍界線照提案(休克、血友病等血液疾病、燒傷、中毒、維生素、唐氏症產前篩檢)，**移交項目已寫進 roadmap「跨輪移交清單」，每輪開工前要對一次，不可漏做**
  2. **遺傳疾病要跨科整理**：單基因為主、加少數常見多因子遺傳，補上依遺傳模式的分類架構；盤點見 [sources/genetic-disorders-inventory.md](sources/genetic-disorders-inventory.md)
  3. 沒有中文病理國考書；Robbins 9th(國考書資料夾)只參考，考點以題庫本身為準
  4. **標籤合併改為先補前幾輪沒合併過的系統**(使用者 2026-10-14)：癌症、感染(微免)，精神只補待決定項目；沒有標籤的題目要補標；呼吸改到第 6 輪自己處理

## 第 5 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 5-0a | 病理總論＋遺傳疾病跨科＋**癌症＋感染**＋精神補合併：04／05 同步改 **337 題**(合併＋補標 19 題)，逐題記在題目修正紀錄；對照與決定見 [tag-merge-round5.md](tag-merge-round5.md)；`apply_tag_merge.py` 新增 `add` 欄位；4 頁 dzTags／`::questions` 補標準名；build 通過、涵蓋 5155/8960 不變；遺傳盤點已更正誤判(SMA 實際 1 題、雷特氏症 0 題) | ✅ 2026-10-14(**Supabase 寫回待使用者決定**；第五節 3 項待決定) |
| 5-0b | 圖片盤點 [sources/pathology-images.md](sources/pathology-images.md)：看過 Servier 7 套(Genetics、Veins、Atherothrombosis、Tissues、Intracellular、Nucleic-acids、Cell-membrane)，縮圖在 scratchpad `servier5/`；候選 19 張(Servier 8 張：化生、水腫、靜脈血栓、動脈血栓、梗塞、核型、染色體與對偶基因；原創 9 張：細胞適應、傷害壞死凋亡、Starling、休克分期、Virchow、栓塞路徑、不分離、譜系、Punnett；表格 2)；3 個待決定 | ✅ 2026-10-14(**等使用者看清單**；轉檔與標籤在各組寫頁時做，先截圖確認) |
| 5-0c | 來源包 [sources/pathology-general.md](sources/pathology-general.md)：確認**國健署 2026-06-26：2026-07-01 起新生兒公費篩檢 22 項(加 SMA)、全額 750 元；產前遺傳診斷最高 7,000 元**；優生保健法仍是現行法名(改名草案未見三讀，寫頁時再查)；熱傷害依國健署；一氧化碳、鉛、輻射、罕病名單、DRIs 列為寫頁時查；新舊說法表；pediatric-endocrine 已把 21 項改為 21→22 項並附新聞稿 | ✅ 2026-10-14 |
| A | `physiology/cell-injury-adaptation`(Ch01 全部 H2；收 Ch01 未收 12 題＋跨科 3 題：106-2_makeup_BM_017 凋亡溶小體、106-2_makeup_BM_018 屍僵 ATP、106-2_BM_042 巴瑞特腸化生；已在別頁的題目不重收，改用連結)；圖：原創 cell-adaptation.svg、cell-injury-death.svg(**待使用者確認**)；Servier 化生圖改由原創圖的化生格取代；壞死型態用表格；taxonomy 新增 general-pathology | ✅ 2026-10-15 |
| B | `physiology/edema-shock`(水腫機轉、腎病與肝硬化水腫、充血鬱血、休克分類／代償／分期、ATLS 失血分級；32 題)、`physiology/thrombosis-embolism-infarction`(止血、Virchow、靜脈血栓、DIC、栓塞含脂肪／氣體／羊水、紅白梗塞；24 題)；收 Ch03 未收 38 題＋跨科休克、DIC、脂肪栓塞、腹水機轉題；**休克護理(保溫、燒傷補液)、腹水護理、DVT 護理不收**(留第 15、11 輪)；109-1_BM_033 國考答案「心因性」與現行「阻塞性」並列說明；圖：原創 starling-edema、virchow-triad、embolism-routes，Servier venous-thrombosis、thrombus-infarct、edema-capillary＋labels(**待使用者確認**)；休克分期用表格不畫圖 | ✅ 2026-10-15 |
| C | `physiology/genetic-inheritance`(名詞、五種模式各一張譜系圖、多因子、遺傳性腫瘤、遺傳諮詢與優生保健法第 9 條、**全部遺傳疾病分類總表**)、`disease/chromosomal-disorders`(不分離、唐氏、三體 18／13、透納、柯林菲特、巴氏體、缺失症候群、X 脆折)、`disease/single-gene-disorders`(AR／AD／X 性聯分節，共 18 種)；收 Ch06 全部＋跨科遺傳題約 40 題；**產前篩檢方法、血友病照護、幽門狹窄／唇顎裂／髖關節照護不收**(第 16、12、11、14 輪)；圖：原創 pedigree-ad／ar／xr／xd／mito、nondisjunction，Servier karyotype＋labels(**待使用者確認**)；涵蓋 Ch01、Ch03、Ch06 都 100%，全部 5275/8960 | ✅ 2026-10-15 |
| D | `physiology/environmental-injury`(輻射與防護、紫外線、熱傷害四型、燒傷深度、CO、鉛、重金屬與水汙染、菸、酒、PM 與塵肺；約 28 題)、`physiology/nutritional-disorders`(消瘦症與紅孩兒病、脂溶性與水溶性維生素總表、肥胖；5 題)；**惡性貧血、素食孕婦營養、營養評估與 TPN、冷療傷害不收**(第 12、16、10 輪)；圖：原創 burn-depth.svg(**待使用者確認**)；**病理 Ch01、Ch03、Ch06、Ch07 全部 100%**；病理 61% → 79%；全部 5155 → 5309/8960 | ✅ 2026-10-15 |
| E | 收尾：使用者提供資料更新 CO 半衰期(台灣急診醫學通訊 2019：室內空氣 250–320 分、100% 氧 90 分、高壓氧 20–30 分)與海洋性貧血帶因率(衛福部 2017：約 6%、甲型較多)，8 篇已無待核對；16 頁回補連結(sepsis、hypotension、anticoagulants、thrombolytics、inflammation-repair、neoplasia、pediatric-endocrine、primary-immunodeficiency、intellectual-disability、pediatric-cancers、end-of-life-care、heart-failure、alcohol-use-disorder、special-senses、parkinson-disease、complete-blood-count)；跨輪移交清單新增 6 列；**Supabase 已寫回**(刪 343 筆舊 question_tags、清 51 處舊名)；resolver、export、source-scan、image-license-review(79 張、需替換 0)；**涵蓋 5322/8960**；部署 workers.dev | ✅ 2026-10-15 |

## 第 5 輪：使用者確認紀錄(2026-10-15，已確認)

1. **新圖共 17 張，全部待確認**(已放進頁面)
   1. 原創：cell-adaptation、cell-injury-death、starling-edema、virchow-triad、embolism-routes、pedigree-ad／ar／xr／xd／mito、nondisjunction、burn-depth
   2. Servier＋中文標籤：servier-edema-capillary、servier-venous-thrombosis、servier-thrombus-infarct、servier-karyotype(標籤已用格線核對，venous-thrombosis 已在本機頁面截圖確認)
   3. 休克分期、壞死型態、Punnett、維生素用表格(使用者決定)；Servier 化生圖改由原創圖的化生格取代
2. **內容上要使用者知道的判斷**
   1. 109-1_BM_033 肺栓塞致死，國考答案「心因性休克」；頁面同時寫現行分類「阻塞性休克」與作答原則
   2. 112-1_MS_017 脂肪栓塞時間：國考答案認為「72 小時」錯、多在 24–48 小時；頁面寫「24–72 小時內、多數 24–48 小時」
   3. ATLS 失血分級表的心跳、呼吸數值是第 9 版；第 10 版改用趨勢描述，頁面已註明
   4. 優生保健法第 9 條已依全國法規資料庫原文改寫(最新修正 2009-07-08)
3. **待核對**(寫進頁面的)：一氧化碳 COHb 半衰期數值、台灣海洋性貧血帶因率
4. 新增 taxonomy domain `general-pathology`(病理總論與遺傳)：側欄會多一個跨系統分類

## E 組待做(收尾，✅ 2026-10-15 已完成)

1. 回補連結：sepsis、hypotension(#shock)、anticoagulants、thrombolytics、inflammation-repair、neoplasia(#abnormal-growth 連 cell-injury-adaptation)、pediatric-endocrine(#inborn-errors 連 single-gene-disorders)、primary-immunodeficiency、intellectual-disability(唐氏症、X 脆折)、pediatric-cancers、end-of-life-care(#postmortem-changes 連屍僵機轉)、heart-failure(#edema-mechanism 連 edema-shock)、alcohol-use-disorder(連 environmental-injury#alcohol)
2. 跨輪移交清單：第 5 輪各列確認寫入；新增「惡性貧血(12)、素食孕婦營養(16)、冷療組織傷害(10)、DVT 臨床照護與肺栓塞(6、15)、產前篩檢題 8 題(16)」
3. 跑 resolver、export_knowledge_questions(需 Supabase；寫回後再跑)
4. 列第 5 輪需確認清單
5. 問使用者：5-0a＋改名共 356 題標籤寫回 Supabase

## 第 4 輪摘要(已完成)

- **輪次**：第 4 輪 內分泌與代謝(約 410 題未涵蓋：內外 Ch08 138、生解 Ch12 103、藥理 Ch10 95、兒科 Ch15 43、病理 Ch16 22、第 3 輪留下腦下垂體 9 題)；4-0 準備＋A–J 組、約 21 篇新頁＋3 篇補充
- **計畫檔**：`~/.claude/plans/supabase-golden-brook.md`(範圍表、標籤同義組初稿、頁面分組、第 5–7 輪接續)
- **狀態**：計畫已核准(2026-10-14)；第 3 輪 Supabase 寫回已由另一個 agent 完成；**4-0、A–D 組完成(2026-10-14)；B＋C＋D 連續執行完畢，等使用者回家確認圖與下方清單；E–G 組也完成；使用者再說「再生成三輪，到結尾前一輪」→ H、I 也完成；**J 組收尾也完成(使用者說「開始製作」)→ **第 4 輪內容全部完成，內分泌 5 章 100%**；BCD 圖使用者已確認；補合併 7 題已套用(愛迪生氏危機保留子類型)；**4-0a＋補合併已寫回 Supabase 並清掉舊名(2026-10-14)**；**已部署 workers.dev(2026-10-14，版本 94a642c0)**；下一輪第 5 輪病理總論**
- **使用者決定(2026-10-14)**：
  1. 性激素、避孕藥、更年期荷爾蒙療法的藥物頁放本輪；家庭計畫護理與避孕方式比較留第 16 輪產科
  2. 鈣磷調節與骨鈣藥放本輪；骨質疏鬆疾病頁留第 14 輪肌骨
  3. 第 6 輪呼吸器、胸管等器材頁：沒有重症課本，用公開資料先寫，數字標待核對
  4. **4-0a 標籤合併加入心血管**；之後每輪的標籤合併都另外加一個前面沒合併過的系統
- **本週目標**：第 4 輪做完，視額度接第 5 輪病理總論、第 6 輪呼吸、第 7 輪社區 A

## 第 4 輪步驟

| 步 | 內容 | 狀態 |
|---|---|---|
| 4-0a | 內分泌＋心血管同義標籤合併：04／05 同步改 267 題(內分泌 113、心血管 154)，逐題記在題目修正紀錄；對照與決定見 `docs/tag-merge-endocrine.md`、`docs/tag-merge-cardio.md`；備份 `_archive/backup_20261014_endo_cardio_tags_04／05`；`apply_tag_merge.py` 改為可讀多個對照表，並處理重複題 tag 欄黏著 `master_id:` 行的問題；taxonomy 新增 pituitary-drugs、sex-hormones、bone-calcium-drugs；5 頁 dzTags 與 2 個 `::questions` 補標準名；build 通過、涵蓋 4780/8960 不變 | ✅ 2026-10-14(**Supabase 寫回待使用者決定**；寫回後依兩份 tag-merge 檔最後一節收尾，再重跑 resolver 與 export) |
| 4-0b | 圖片盤點 `docs/sources/endocrine-images.md`：Servier SMART-Endocrinology.pptx(14 張)與 SMART-Diabetes.pptx(13 張)，圖上無文字、全向量、CC BY 4.0；選 9 張(腦下垂體、甲狀腺前後、腎上腺與腎、皮質三層、胰島、甲狀腺腫、甲狀腺癌、糖尿病足、單股尼龍線)；原創 3–4 張(全身內分泌腺、回饋軸、鈣磷調節、ADH 待決定)；RAAS、腦矢狀切面、視覺徑路沿用 | ✅ 2026-10-14(使用者確認 #1–#12；另加 #14 下視丘核區原創圖；ADH 圖預設用表格) |
| 4-0c | 來源包 `docs/sources/endocrine.md`：確認 ATA 2016 甲亢、2025 分化型甲狀腺癌(不再涵蓋結節)、2022 尿崩症改名 AVP-D／AVP-R、2025 原發性醛固酮症(所有高血壓篩檢)、2024 類固醇腎上腺功能不全、2023 泌乳素瘤共識、2024 高血糖危象共識、NAMS 2022、US MEC 2024；新舊說法表 10 項；待查：新生兒篩檢完整項目、放射碘出院規定(核安會研析中)、骨鬆學會最新版 | ✅ 2026-10-14 |
| A | physiology/endocrine-overview(32 題)、physiology/hypothalamus-pituitary(35 題)；taxonomy 新增 endocrine-physiology 組；圖：servier-pituitary＋labels/pituitary.json、原創 hypothalamic-nuclei(使用者要求，位置參考使用者提供的核區圖)、endocrine-glands-overview(頭部側面、標前後)、hormone-feedback-axes；生解 Ch12 總論、松果腺、性腺與其他 100%，下視丘與腦下垂體 38/41(剩 3 題留 C 組)；綜合題型骨密度 2 題留 B 組 | ✅ 2026-10-14 |
| B | physiology/thyroid-parathyroid(29 題)、physiology/adrenal-glands(21 題)；圖 servier-thyroid、servier-adrenal-kidney、servier-adrenal-layers＋labels、原創 calcium-regulation(**待使用者確認**)；生解 Ch12 甲狀腺與副甲狀腺、腎上腺、綜合 100%(Ch12 整章 95%)；A 組 endocrine-overview 的鈣磷連結已回補 | ✅ 2026-10-14 |
| C | disease/pituitary-disorders(18 題)、disease/diabetes-insipidus-siadh(27 題)；內外 Ch08 腦下垂體與下視丘 38/38、病理 Ch16 腦下垂體 5/5、**內外 Ch15 221/221(第 3 輪留下的腦下垂體題全收)**；回補連結：hypothalamus-pituitary(3 處)、brain-tumors(2)、head-injury、special-senses；無新圖 | ✅ 2026-10-14 |
| D | disease/hyperthyroidism(25 題)、disease/hypothyroidism(10 題)、disease/thyroid-nodules-cancer(6 題，oncology)；圖 servier-goiter、servier-thyroid-cancer＋labels(**待使用者確認**)；endocrine-overview 加 PCOS 1 題；內外 Ch08 甲狀腺與副甲狀腺 39/51(剩 12 題副甲狀腺留 E 組)、病理 Ch16 甲狀腺 7/7；thyroid-parathyroid 的疾病連結已回補 | ✅ 2026-10-14 |
| E | disease/parathyroid-disorders(22 題)、lab/calcium-phosphate(25 題，renal 的 acid-base-labs)、lab/thyroid-function-tests(9 題，新 group endocrine-labs)；內外 Ch08 甲狀腺與副甲狀腺 **51/51**；hyperthyroidism、thyroid-parathyroid 的純文字已改連結；沒有新圖 | ✅ 2026-10-14 |
| F | disease/cushing-syndrome(13 題，含腎上腺切除術)、disease/adrenal-insufficiency(13 題，含危象、生病日規則、類固醇減量)、disease/pheochromocytoma-aldosteronism(16 題，alsoIn cardiovascular)；內外 Ch08 腎上腺 **29/29**、病理 Ch16 腎上腺 7/7(胰島剩 107-2_BM_035、105-2_BM_048 留 I 組)；dzTags 先把庫辛氏／康氏等舊名一起列；adrenal-glands、pituitary-disorders、hypertension 已回連；沒有新圖 | ✅ 2026-10-14 |
| G | drug/thyroid-drugs(26 題)、drug/corticosteroids(20 題，含效價表、壓力劑量、抑制劑)、drug/pituitary-hormones(22 題，含催產素引產監測)；藥理 Ch10 腦下垂體 **21/21**、甲狀腺 **19/19**、類固醇 18/20(剩 CAH 2 題留 I 組)；7 處「之後整理在…藥物頁」已改連結；沒有新圖 | ✅ 2026-10-14 |
| H | drug/sex-hormones(28 題：雌激素與黃體素、荷爾蒙避孕與 CDC US MEC 2024 禁忌、事後避孕與 RU486、更年期荷爾蒙療法依 NAMS 2022、SERM、抗雄性素、不孕症用藥)、drug/bone-calcium-drugs(16 題：雙磷酸鹽服法、denosumab、teriparatide、鈣與維生素 D)；pituitary-hormones 加麥角鹼與前列腺素子宮收縮劑(7 題)；藥理 Ch10 性激素 **33/33**、骨鈣 **6/6**；taxonomy sex-hormones 加避孕用藥、不孕症用藥、荷爾蒙製劑；沒有新圖 | ✅ 2026-10-14 |
| I | disease/pediatric-endocrine(30 題：新生兒篩檢、先天性甲低、CAH、性早熟、先天代謝異常、兒童甲狀腺與副甲狀腺、兒童糖尿病、兒童肥胖)、care/chronically-ill-children(9 題)；補既有頁：diabetes(+28 題 ids)、insulin(+7)、glucose-homeostasis(+4，加胰臟外分泌與體制素、升糖素作用在肝)、hba1c(+1)；5 處「之後整理在兒童內分泌頁」已改連結；**內分泌 5 章全部 100%**(生解 Ch12 129/129、病理 Ch16 29/29、藥理 Ch10 138/138、內外 Ch08 240/240、兒科 Ch15 53/53)；全部 5154/8960；沒有新圖 | ✅ 2026-10-14 |
| J | 收尾：依使用者提供資料更新(ulipristal 台灣有上市；RU486 依臺北榮總衛教 7 週內；teriparatide 健保 5.6.2 與郭綜合醫院藥品資訊；2025 台灣骨鬆指引更新鈣 1200／1000 mg、維生素 D 800 IU、降鈣素鼻噴劑 2013 停用、藥物假期、牙科時機、接續療法；Pitressin 為台灣現有的水溶性 vasopressin)；回補連結 brain-anatomy、increased-icp、loop-diuretics、potassium-sparing-diuretics、eye-disorders、immunosuppressants、asthma-drugs、brain-tumors，另清掉其他輪 6 處舊純文字；diabetes 認領「高血糖高滲透壓狀態」「糖尿病足」、pituitary-drugs 認領子宮收縮劑各寫法；所有留給後面組的題目已確認涵蓋；涵蓋 5154/8960、image-license-review 63 張需替換 0 | ✅ 2026-10-14 |

## B＋C＋D 連續執行計畫(2026-10-14 使用者外出時做)

> 使用者要求 B、C、D 三組一次做完，**中間不用等「下一輪」**；**圖片先做好、放進頁面，標「待使用者確認」，回家再一起看**(這次例外，不等確認才寫頁)
> 每寫完一篇就更新本檔(額度用完時下個 session 從這裡接)；每組結束跑一次 build、resolver、export、source-scan、涵蓋報告

### 範圍與題目分配

| 組 | 頁面 | 收題來源(題數) | 圖 |
|---|---|---|---|
| B | `physiology/thyroid-parathyroid` | 生解 Ch12 甲狀腺與副甲狀腺 27(功能與異常 12、副甲狀腺異常 5、甲狀腺構造 5、副甲狀腺構造 5)＋綜合題型骨密度 2(112-3_BM_016、105-2_MS_019) | servier-thyroid(前後兩圖，標左右葉、峽部、副甲狀腺)；原創 calcium-regulation(PTH、降鈣素、活性維生素 D 對骨腎腸) |
| B | `physiology/adrenal-glands` | 生解 Ch12 腎上腺 21(構造 2、皮質激素 15、壓力反應 3、髓質 1) | servier-adrenal-kidney、servier-adrenal-layers(皮質三層＋髓質)；RAAS 沿用 raas-drug-sites.svg |
| C | `disease/pituitary-disorders` | 內外 Ch08 前葉疾病 17＋第 3 輪留下 9 題(內外 Ch15 腦瘤 6、生解 Ch06 視交叉 3)＋A 組留下 2 題(107-2_MS_076、105-2_MS_073)＋病理 Ch16 前葉 3＋兒科腦下腺 2 | 不新做；沿用 servier-pituitary、servier-brain-sagittal、visual-pathway |
| C | `disease/diabetes-insipidus-siadh` | 內外 Ch08 後葉疾病 24＋108-1_MS_059＋病理 Ch16 後葉 2；含 112-1_OP_070 兒童禁水試驗 | 不畫圖，用比較表(4-0b 預設) |
| D | `disease/hyperthyroidism` | 內外 Ch08 甲亢與甲狀腺風暴 22＋病理甲亢 | servier-goiter(正常 vs 甲狀腺腫) |
| D | `disease/hypothyroidism` | 內外 Ch08 甲低、甲狀腺炎 13 的一部分＋病理甲低 | 沿用 servier-goiter |
| D | `disease/thyroid-nodules-cancer` | 內外甲狀腺腫瘤＋病理甲狀腺腫瘤 5(oncology，alsoIn endocrine) | servier-thyroid-cancer |

**不在這次**：內外副甲狀腺疾病 16 題(E 組 parathyroid-disorders)；兒科甲狀腺 17 題與先天性甲狀腺低下(I 組 pediatric-endocrine)；藥理 Ch10 的純藥理題(G 組藥物頁)；腎上腺疾病(F 組)

### 事先定好的做法(不用等使用者)

1. **題目歸屬**：問疾病、症狀、護理的放疾病頁；只問藥理機轉或副作用的留給 G 組藥物頁；同一題不重複放兩頁(用連結)
2. **甲狀腺切除術**的術前準備、術後併發症(出血與呼吸道、喉返神經、低血鈣與手足抽搐、甲狀腺風暴)寫在 hyperthyroidism；thyroid-nodules-cancer 連過去；低血鈣的詳細機轉留 E 組
3. **甲狀腺風暴**寫在 hyperthyroidism；**黏液水腫昏迷**寫在 hypothyroidism；先天性甲狀腺低下只寫一段並說明之後在兒童內分泌頁
4. **尿崩症名稱**：標題用尿崩症，括號附 2022 新名 AVP-D／AVP-R；和 SIADH、腦耗鹽症候群用比較表
5. **新舊說法並列**(依 `docs/sources/endocrine.md` 第五節)：PTU vs methimazole、泌乳素瘤 bromocriptine vs cabergoline、vasopressin tannate 舊藥
6. **沒有可靠來源的數字標「待核對」**：放射碘治療後的隔離天數與距離(台灣無公告門檻，用醫學中心衛教單張)、甲狀腺術後血鈣監測的時間點
7. **答案鍵有爭議**：不改考選部答案，頁面加 note，記在本輪例外清單
8. **還沒寫的頁**用純文字，記在「之後要回補的連結」；A 組留下的純文字(腦下垂體疾病、尿崩症與 SIADH、甲狀腺與副甲狀腺生理)在 C、B 組寫完時順手補成連結
9. **圖片**：Servier 圖照 A 組方法(PPTX 轉 SVG → 格線逐點核對 → labels JSON)；原創圖用 scratchpad 的 `svg/common.py` 風格；做完把預覽放到**桌面「內分泌BCD組圖」資料夾**；頁面先放圖，進度檔標「圖待確認」
10. **遇到真的需要使用者決定的事**：不停下來，先用保守做法寫，列在下方「回家要確認」

### 執行順序

1. B 組：圖(thyroid、adrenal 兩張、calcium-regulation) → thyroid-parathyroid → adrenal-glands → 驗證 → 回補 A 組連結
2. C 組：pituitary-disorders → diabetes-insipidus-siadh → 驗證 → 回補 A 組、brain-tumors、head-injury、eye-disorders 的連結
3. D 組：圖(goiter、thyroid-cancer) → hyperthyroidism → hypothyroidism → thyroid-nodules-cancer → 驗證
4. 收尾：涵蓋報告、image-license-review、桌面預覽、本檔「回家要確認」清單、記憶更新

### 留給後面組的題目(使用者 2026-10-14 要求：之後一定要覆蓋到)

- E 組：內外 Ch08 副甲狀腺功能亢進與低下 16 題、病理 Ch16 副甲狀腺 1 題；J 組收尾時用涵蓋報告逐小節確認
- F 組：內外 Ch08 腎上腺疾病 30 題、病理 Ch16 腎上腺 7 題
- G 組：藥理 Ch10 腦下垂體激素 21、類固醇 20、甲狀腺 19
- I 組：兒科 Ch15 甲狀腺與副甲狀腺 17、腎上腺與性腺與胰島 19、代謝異常 4、肥胖 1；慢性病兒童 9；**先天性腎上腺增生 113-2_OP_043、106-2_OP_071**(藥理 Ch10 類固醇最後 2 題)；先天性甲低 107-2_OP_074(加答案註記)、114-2_OP_046；病理 Ch16 胰島 107-2_BM_035、105-2_BM_048
- 第 16 輪產科：引產與產程處置題(109-1_OP_031 等)、避孕方式比較與家庭計畫護理；麥角鹼與前列腺素藥理題已在 H 組放進 pituitary-hormones#other-uterotonics
- B–D 組：生解 Ch12、內外 Ch08 腦下垂體、病理 Ch16 腦下垂體與甲狀腺的題目**全部放進頁面**；生解 Ch12 胰島 4 題留 I 組(glucose-homeostasis)；內外 Ch08 綜合題 110-2_MS_066(代謝性酸中毒)、114-3_FA_025(喟嘆式呼吸)目前由自動配對涵蓋，I 組補 diabetes 時再確認

### 回家要確認(做的時候往下加)

1. **圖**(桌面「內分泌BCD組圖」)：B1 甲狀腺前後面(錐狀葉、峽部、上下副甲狀腺)、B2 腎上腺與腎臟(皮質、髓質)、B3 腎上腺皮質分層(絲球、束狀、網狀、髓質)、B4 鈣磷調節(原創)
2. **4-0a 漏掉的同義標籤**：「庫辛氏症候群」(106-2_makeup_BM_024)→庫欣氏症候群、「康氏症候群」(112-1_MS_069)→原發性醛固酮過多症；建議 F 組前補合併(要動 04／05)
3. **答案鍵可疑**：110-2_BM_027(選錯誤者，答案 D)依生理學 C 才是錯的敘述；頁面已加註，不改答案
4. **D 組圖**：D1 甲狀腺腫與萎縮(正常、腫大、萎縮三格)、D2 甲狀腺癌(舌骨、甲狀軟骨、腫瘤、氣管)
5. **又發現 4-0a 漏掉的標籤**：「格雷氏病」(115-1_MS_046、109-1_MS_070)→葛瑞夫茲氏病；「庫辛氏病」(109-1_BM_048)→庫欣氏病；頁面 dzTags 已先把舊名一起列上，合併後再清；F 組再發現「醛固酮過多症」(1 題)→原發性醛固酮過多症、「愛迪生氏危機」(1 題)可併入愛迪生氏病或保留子類型
6. **待核對(頁面已標)**：放射碘治療後的隔離天數與距離(台灣無公告門檻)；vasopressin tannate 油性懸浮液在台灣是否仍有供應
7. **頁面寫法的判斷**：111-2_MS_070 選項「SIADH 頭部平躺」依教科書是為了增加靜脈回流、減少 ADH 分泌，頁面寫床頭平放或不超過約 10 度；110-2_MS_071 詳解說術後「終身」不可彎腰不合理，頁面寫依醫囑一段時間
8. **E 組**：107-2_OP_074(先天性甲低，答案 A)選項 B「暫停母乳以正確測得甲狀腺素」依現行指引也不對，疑似兩個錯誤選項；留到 I 組放進兒童內分泌頁時加註，不改答案
9. **E 組待核對**：游離鈣參考值(各院不同)、慢性副甲狀腺功能低下的血鈣目標值、甲狀腺素調整後複驗 TSH 的週數(頁面寫教科書通則 6–8 週)
10. **F、G 組待核對與判斷**：類固醇效價表為教科書通則；催產素起始與調升劑量(mU/min)依各院流程未寫數字；腎上腺危象 hydrocortisone 100 mg 後每天 200 mg 依 Endocrine Society 2016(未讀全文)；甲亢藥在懷孕的新舊說法(ATA 2016 只第一孕期優先 PTU，國考答 PTU)已在頁面並列
11. **H、I 組待核對與判斷**：ulipristal 在台灣是否上市、RU486 現行使用週數、teriparatide 療程年限與健保條件、鈣與維生素 D 建議量(骨鬆指引最新見到 2021 版)；答案註記：106-1_OP_068(PKU 終身飲食控制，ACMG 2014 已建議終身)、107-2_OP_074(暫停母乳)已在頁面加 note；107-1_OP_052 公布答案把「先天性甲低是體染色體隱性」當正確，和 107-1_OP_028(不是典型隱性)互相矛盾，頁面寫多數為散發
12. **J 組要做的事(先記下)**：涵蓋報告逐小節確認、整輪需確認清單、image-license-review、roadmap 與進度檔；另發現其他輪留下的純文字「之後整理在…頁」但頁已存在(immune-system-basics 3 處、helminths-ectoparasites、milieu-therapy、antiparasitics)，可在 J 組順手回連

## 第 4 輪需確認清單(2026-10-14 J 組整理；已依使用者提供資料更新)

**已解決**：ulipristal 台灣有上市；RU486 依臺北榮總衛教懷孕 7 週內；teriparatide 健保條件與 2 年上限；鈣與維生素 D 建議量依 2025 台灣骨鬆指引；vasopressin 台灣現有水溶性 Pitressin(油性 tannate 頁面寫為舊劑型)；Supabase 寫回時機(代謝處理好再一起)

**仍待使用者**(2026-10-14 使用者回覆：圖 OK、標籤合併 OK 且愛迪生氏危機保留子類型、待核對項目暫時找不到資料維持現狀)
1. ✅ **圖**：桌面「內分泌BCD組圖」6 張(B1 甲狀腺前後面、B2 腎上腺與腎臟、B3 皮質分層、B4 鈣磷調節、D1 甲狀腺腫、D2 甲狀腺癌)
2. ✅ **補合併同義標籤**(已套用 7 題並寫回，見 tag-merge-endocrine.md 第八節)：庫辛氏症候群→庫欣氏症候群、庫辛氏病→庫欣氏病、康氏症候群與醛固酮過多症→原發性醛固酮過多症、格雷氏病→葛瑞夫茲氏病；愛迪生氏危機併入愛迪生氏病或保留子類型
3. **答案鍵或選項有疑義**(頁面已加註，不改答案)：110-2_BM_027、107-2_OP_074(暫停母乳)、106-1_OP_068(PKU 終身飲食)、107-1_OP_052 與 107-1_OP_028(先天性甲低遺傳方式互相矛盾)
4. **頁面寫法的判斷**：111-2_MS_070(SIADH 床頭平放或 ≤10 度)、110-2_MS_071(經蝶骨術後彎腰限制依醫囑一段時間)

**仍待核對(頁面已標，找不到台灣公開數字)**
1. 放射碘治療後的隔離天數與距離
2. 游離鈣參考值、慢性副甲狀腺功能低下的血鈣目標值
3. 甲狀腺素調整後複驗 TSH 的週數(寫教科書通則 6–8 週)
4. 催產素起始與調升劑量(依各院流程)
5. 類固醇效價表(教科書通則)；腎上腺危象 hydrocortisone 劑量依 Endocrine Society 2016(未讀全文)

## 進行中(第 4 輪)

- **A 組完成(2026-10-14)**
  - 新頁：`physiology/endocrine-overview`(激素分類與受體訊息、腺體與激素表、胚胎來源、兼有內分泌的器官、回饋與前饋、松果腺、睪丸與卵巢細胞、雄性素不敏感症、胎盤 hCG 與 hPL、更年期)；`physiology/hypothalamus-pituitary`(位置與視交叉、前後葉比較、門脈系統、前葉染色、下視丘核區表、激素與體溫、釋放抑制激素、前葉激素、生長激素調控與作用、泌乳素與催產素與哺乳、ADH)
  - 圖已經使用者目視確認：腦下垂體標籤加「(示意，非實際位置)」、核區位置依使用者參考圖調整、全身圖頭部改側面並標前後
  - **之後要回補的連結**(目前是純文字)：腦下垂體疾病頁(C 組，腫瘤、經蝶骨手術、巨人症)、尿崩症與 SIADH 頁(C 組)、甲狀腺與副甲狀腺生理頁(B 組，鈣磷)、性激素藥物頁(H 組)、腦下垂體激素藥物頁(G 組，催產素)；brain-anatomy#hypothalamus 可回連 hypothalamus-pituitary#nuclei
  - 驗證：題號 67 個都在 04、build 通過(236 篇)、resolver 與 export 重跑、source-scan 兩頁無重疊、兩頁本機回 200 並截圖確認標籤疊加；涵蓋 4837/8960(生解 Ch12 20% → 60%)

## 第 3 輪摘要(已完成)

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
