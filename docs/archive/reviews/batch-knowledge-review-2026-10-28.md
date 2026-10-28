# 知識頁 Batch 審稿紀錄(2026-10-28)

> Gemini 3.8 Flash batch(Vertex AI，思考 high)審 404 篇知識頁，產生候選問題；Claude 逐條對題庫(考選部答案)、法規原文與頁面來源查證後才改
> 用量與額度見 [batch-usage-log.md](../../batch-usage-log.md)；腳本 `scripts/batch-knowledge-review.py`，審稿指示 `scripts/batch/knowledge-review-prompt.md`
> batch 工作檔(requests、responses、reports)查證完已刪除，這份是唯一留存紀錄

## 結果

| 項目 | 數量 |
|---|---:|
| 有候選問題的頁 | 237 |
| 候選問題 | 549 |
| 改 | 262(動到 162 頁) |
| 誤報 | 282 |
| 待確認(已列入 [review-checklist.md](../../review-checklist.md)) | 5 |

## 常見誤報類型

1. 模型不知道新版指引或法規：2025 AHA、2026 ESC、GOLD／GINA 2026、2026 AHA/ACC 肺栓塞、115 年考題、2026 修正的學校衛生法與毒品分級、114 年起 A 肝時程
2. 和考選部答案衝突：頁面照國考答案寫(並註明現行說法)，模型當成錯誤；依規則考選部答案不改
3. 台灣課本與國外寫法不同：例如同側偏盲、第四次精神醫學革新是生物精神醫學
4. 引用的句子在頁面找不到或已寫對

## 修正原則

1. 能直接查證的直接改；國考答案和學理不同時保留考題答案，在同一行註明學理或現行說法
2. 法規一律對全國法規資料庫原文(精神衛生法第 20 條、學校衛生法第 6、11 條、護理人員法第 37 條、校園霸凌防制準則第 4 條、專科護理師辦法都已核對)
3. 改完跑 `normalize-punctuation.py --write` 與 `build-knowledge.mjs`

## 逐條紀錄

| 頁 | # | 結果 | 說明 |
|---|---:|---|---|
| abg | 0 | 改 | 呼吸性鹼中毒代償寫法易誤讀，改為「腎臟多排出 HCO₃⁻，HCO₃⁻ ↓」 |
| accreditation-evaluation | 0 | 誤報 | 115 年度基準是現行版，模型知識過時 |
| accreditation-evaluation | 1 | 改 | 章節英文 Nursing audit（稽核）→ nursing evaluation |
| accreditation-evaluation | 2 | 誤報 | 醫策會用 Patient Focus Method |
| activity-immobility | 0 | 誤報 | 照 108-2_FA_047 答案 B |
| activity-immobility | 1 | 改 | 助行器「約一臂長」→「向前約一步」；腰（股骨大轉子）照 115-2 題意保留 |
| activity-immobility | 2 | 誤報 | 照 111-2_FA_047 答案 A |
| activity-immobility | 3 | 誤報 | 照 108-2_FA_046 答案 D |
| addiction-treatment-drugs | 0 | 誤報 | 國健署現行用藥原則允許 bupropion＋NRT 合併 |
| admission-discharge-specimens | 0 | 改 | 維生素 C 造成偽陰性，分開寫 |
| adrenergic-agonists | 0 | 誤報 | 照 108-1_BM 答案 B（唾液分泌減少） |
| alcohol-use-disorder | 0 | 誤報 | 107-2_PC_005 答案 B 原文就是「增加」，頁面已註明分歧 |
| antituberculars | 0 | 改 | 台灣人多為快乙醯化者 |
| antivirals | 0 | 誤報 | 照 106-2_BM 答案 B（專一性低） |
| airway-clearance | 0 | 誤報 | 照 110-1_OP 答案 D（俯臥頭低 15 度） |
| airway-clearance | 1 | 改 | 國考答案保留，改寫為「擺好姿勢後、引流期間配合叩擊」 |
| airway-clearance | 2 | 改 | 理由寫錯，改為順序本身符合原則、官方答案是另一選項 |
| allergic-contact-dermatitis-latex | 0 | 改 | ACD 可擴散超出接觸處 |
| allergic-contact-dermatitis-latex | 1 | 改 | 貼膚試驗判讀時間 48 小時、第 3–4 天、第 7 天 |
| anemias | 0 | 誤報 | 照 106-2_OP 答案 B |
| anemias | 1 | 改 | 改為平時不需臥床不動、危機時休息 |
| anemias | 2 | 改 | 慢性病貧血多為正球性，表格兩列補註 |
| anemias | 3 | 改 | ATG／ALG 全名分開 |
| antiarrhythmics | 0 | 改 | 第 1 期與第 2 期分開 |
| antiarrhythmics | 1 | 改 | 不明原因寬 QRS 與 WPW＋AF 分開寫，adenosine 可用於規則單形性 |
| antiarrhythmics | 2 | 誤報 | 2025 AHA 指引已發布，模型知識過時 |
| anticoagulants | 0 | 改 | 霍曼氏徵象改為腿伸直、支托膝膕（107-2_OP_026 只考支托膝膕＋背屈） |
| antidotes | 0 | 改 | 補註氨基甲酸鹽可逆、以 atropine 為主、通常不需 PAM |
| antipsychotics | 0 | 改 | Risperdal Consta 口服併用 3 週 |
| antipsychotics | 1 | 誤報 | FDA 已於 2025 年取消 clozapine REMS |
| anxiety-disorders | 0 | 改 | 紙袋保留國考答案、標注現行急救指引不建議 |
| anxiety-disorders | 1 | 誤報 | 照 109-2_PC_027 答案 C（電梯、地下室＝特定場所畏懼症） |
| ards-respiratory-failure | 0 | 誤報 | 2017 ATS/ESICM/SCCM 是「每天 12 小時以上」 |
| arni | 0 | 誤報 | 2026 ESC 心衰竭指引已發布（頁面有 DOI），模型知識過時 |
| arrhythmias | 0 | 改 | 節律器術後拿掉爬牆運動（會舉高過肩） |
| arrhythmias | 1 | 誤報 | 台灣基護「二重脈」就是二聯律的脈搏 |
| arrhythmias | 2 | 誤報 | 頁面依 2025 AHA，模型知識過時 |
| arterial-line | 0 | 誤報 | 頁面已標待核對，5–15 秒為常見寫法 |
| arterial-line | 1 | 改 | 阻尼不足原因去掉「太軟」、補舒張壓偏低 |
| artificial-airway | 0 | 誤報 | 未成熟造口先由口插管、成熟後才用管芯，符合 ICU Book |
| artificial-airway | 1 | 改 | 107-1_MS 錯誤與正確敘述分開寫 |
| artificial-airway | 2 | 改 | 保留 114-2_FA 國考說法，加註實務上只拆氣切內管 |
| asepsis-sterilization | 0 | 誤報 | 照 110-2_FA_001 答案 C（2% 碳酸鈉） |
| asepsis-sterilization | 1 | 改 | 同上加註 |
| asepsis-sterilization | 2 | 誤報 | 115-1 考題存在 |
| asthma | 0 | 改 | 呼吸性酸中毒原因改為 CO₂ 滯留，保留 112-3_OP 國考敘述 |
| asthma | 1 | 改 | 早晚各 2 puffs 寫清楚 |
| asthma | 2 | 改 | 同 #0 |
| asthma-drugs | 0 | 改 | codeine 12 歲以下禁用 |
| asthma-drugs | 1 | 改 | 保留 108-1_FA_021 題目醫囑，加註短效一天 3–4 次 |
| asthma-drugs | 2 | 改 | fenoterol 改為 β2 選擇性較低 |
| asthma-drugs | 3 | 誤報 | GINA 2026 已發布、depemokimab 已上市，模型知識過時 |
| atypical-bacteria | 0 | 改 | 照 113-2_BM 答案保留，註明是叢林型斑疹傷寒 |
| atypical-bacteria | 1 | 誤報 | 照 113-2_BM（恙蟎不是完全變態） |
| autonomic-nervous-system | 0 | 誤報 | 照 108-1_BM 答案 B |
| b-lymphocytes | 0 | 改 | 照 108-1_MS 答案保留，標「國考說法」 |
| bandaging | 0 | 誤報 | 照 113-1_FA_030 答案 A（①④） |
| bandaging | 1 | 誤報 | 同上 |
| biliary-pancreatic | 0 | 誤報 | 頁面已註明 114-1 國考答案 |
| bipolar-disorder | 0 | 誤報 | 頁面已註明 109-2 國考答案 |
| bipolar-disorder | 1 | 誤報 | 照 115-1_PC_013 答案 A |
| bipolar-disorder | 2 | 誤報 | 照 112-1_PC_019 題目情境（發燒住隔離室） |
| blood-hemostasis | 0 | 改 | O 型人有 IgG 抗 A、抗 B |
| bnp | 0 | 誤報 | 2026 ESC 已發布 |
| body-temperature | 0 | 誤報 | 照 107-1_FA 答案 B（術後傷口感染＝回歸熱） |
| body-temperature | 1 | 誤報 | 同上 |
| body-temperature | 2 | 改 | 凍瘡改 37–39 ℃ 回溫，舊課本 10–15 ℃ 並列 |
| body-temperature | 3 | 誤報 | 傳導包含接觸熱物，表格例子不影響 |
| bone-calcium-drugs | 0 | 誤報 | 條件邏輯模型自己也不確定，維持原文（健保 5.6.2） |
| bowel-elimination | 0 | 誤報 | 照 107-1_FA_031 答案 A |
| bowel-elimination | 1 | 改 | 拿掉沒有依據的「生理食鹽水最常用」 |
| bowel-elimination | 2 | 改 | 補「心跳變慢」（109-1_FA 詳解） |
| brain-anatomy | 0 | 誤報 | 台灣教科書與其他頁都用「同側偏盲」 |
| brain-anatomy | 1 | 誤報 | 114-2 基醫有這題 |
| brain-tumors | 0 | 改 | 天幕下術後避免仰臥壓迫傷口 |
| breast-cancer | 0 | 誤報 | 頁面寫依醫囑，台灣教科書早期梳頭屬日常活動 |
| breast-cancer | 1 | 誤報 | 照 112-1_FA 答案（健康促進） |
| breast-cancer | 2 | 誤報 | 月經結束後 5–7 天與「來潮後 7–10 天」相近 |
| burns | 0 | 誤報 | 照 114-1_MS 答案 C（肩部俯臥） |
| burns | 1 | 誤報 | 同上 |
| burns | 2 | 誤報 | 照 112-2_MS 題意（阻力大越易受傷、骨骼阻力大於血管） |
| burns | 3 | 誤報 | 同上 |
| burns | 4 | 改 | 嬰兒單側下肢 13.5%，總和 100% |
| calcium-phosphate | 0 | 改 | 前列腺癌骨轉移多為成骨性 |
| cancer | 0 | 誤報 | 講的是手術可切除原發或轉移腫瘤（轉移灶切除），不是根治性手術 |
| cancer | 1 | 改 | Port-A 封管：生理食鹽水 10 mL＋heparin 3–5 mL |
| cancer | 2 | 誤報 | 頁面依國健署 112 年癌登 |
| cancer | 3 | 誤報 | 腋靜脈也是 Port-A 常用路徑 |
| cancer-treatment-toxicities | 0 | 改 | 保留 111-1_MS 國考答案，加註照射前清掉 |
| cancer-treatment-toxicities | 1 | 誤報 | 照 114-2_MS 答案 A（色素沉著不是急性反應） |
| cancer-treatment-toxicities | 2 | 誤報 | 同上 |
| cancer-treatment-toxicities | 3 | 改 | 紅血球不在 7–14 天 nadir |
| candida | 0 | 改 | 「刮不掉」改「不易擦掉」 |
| candida | 1 | 改 | 同上 |
| cardiac-catheterization | 0 | 改 | 怕身體受傷改為學齡前兒童為主 |
| cardiac-output | 0 | 誤報 | 2026 ESC 已發布 |
| cardiac-output | 1 | 改 | Frank–Starling 不是改變收縮性 |
| cardiac-output | 2 | 改 | EF 正常值統一 50–70% |
| central-venous-catheter | 0 | 改 | 消毒範圍要大於敷料 |
| chest-tube | 0 | 誤報 | 照 108-1_FA 答案 D（1–2 吋） |
| chest-tube | 1 | 改 | 脫開時以無菌水水封為首選，夾管只短暫 |
| child-adolescent-mental-health | 0 | 誤報 | 已查法規：113 年第 4 條第 5 款仍含校長、教職員工對學生 |
| child-growth-development | 0 | 改 | 2 歲以下心尖在左鎖骨中線稍外 |
| child-growth-development | 1 | 改 | 羅文菲爾特分期照 109-1_OP 詳解：塗鴉期 2–4（命名 3–3.5）、前圖式 4–7、圖式 7–9 |
| child-growth-development | 2 | 改 | 6 個月改為雙手撐著坐 |
| child-growth-development | 3 | 改 | 氣質比例改 40／10／15＋35% 混合型 |
| childhood-infectious-diseases | 0 | 改 | 保留 113-2_PC 答案，註明更精確是季節變動 |
| childhood-infectious-diseases | 1 | 改 | 猩紅熱標註沒有疫苗 |
| childhood-infectious-diseases | 2 | 改 | 腮腺炎 9 天後註美國 CDC 5 天 |
| childhood-infectious-diseases | 3 | 誤報 | 疾管署水痘可傳染期是出疹前 5 天起，頁面已註通常 1–2 天 |
| childhood-infectious-diseases | 4 | 改 | 「由軀幹向外」改「軀幹多、四肢少」 |
| chronic-kidney-disease | 0 | 誤報 | 依台灣 CKD 衛教分期表 |
| chronic-kidney-disease | 1 | 誤報 | 台灣腎臟病飲食衛教把米粉列為低氮澱粉 |
| chronic-kidney-disease | 2 | 改 | 黃豆製品屬高生物價 |
| cns-stimulants | 0 | 改 | 保留 107-1_PC_032 答案，加註主要機轉是抑制回收 |
| coagulation-tests | 0 | 改 | warfarin 重疊使用的原因寫正確 |
| colorectal-cancer | 0 | 改 | 拿掉大腸鏡禁忌症「剛切除瘜肉」（沒有依據） |
| colorectal-cancer | 1 | 改 | 低渣飲食改「術後初期約 6 週內，依醫囑」，全頁同步 |
| colorectal-cancer | 2 | 改 | 造口水腫 6–8 週，全頁同步 |
| community-assessment | 0 | 誤報 | 照 109-2_PC_050 詳解（擋風玻璃式屬主觀） |
| community-assessment | 1 | 改 | 教育次系統拿掉教育程度 |
| community-assessment | 2 | 改 | 獨居老人共餐改歸健康及社會服務 |
| community-health-nursing-intro | 0 | 誤報 | 照 106-1_PC_043 答案（顧問 counselor） |
| community-health-nursing-intro | 1 | 誤報 | 同上 |
| community-health-nursing-intro | 2 | 誤報 | 同題選項（協調者 collaborator） |
| community-mental-health | 0 | 改 | 社區心理衛生篩檢移到次級預防 |
| community-mental-health | 1 | 改 | 居家治療註明醫師參與、以護理師家訪為主 |
| community-nursing-process | 0 | 誤報 | 115-1 考題存在 |
| community-nursing-process | 1 | 改 | Stanhope 與 Lancaster 計分法寫正確 |
| complement-system | 0 | 改 | 急性腎絲球腎炎移到「C3 下降、C4 正常」 |
| complement-system | 1 | 改 | 同上 |
| complement-system | 2 | 改 | 同上 |
| complement-system | 3 | 改 | 同上 |
| complete-blood-count | 0 | 改 | 血小板 11 萬改為略低但未達暫停標準 |
| conflict-change-management | 0 | 改 | 雙避衝突例子換掉（原例子是雙趨） |
| congenital-heart-disease | 0 | 改 | 107-2_OP 考的是主動脈狹窄，補註 COA 要用 PGE1 |
| congenital-heart-disease | 1 | 改 | ASD 約 10% |
| congenital-heart-disease | 2 | 改 | 同上 |
| congenital-heart-disease | 3 | 誤報 | 表格列名問題，內容寫三階段，不影響 |
| copd | 0 | 誤報 | 頁面依 GOLD 2026，已並列 2023–2025 舊條件 |
| copd | 1 | 改 | α1-抗胰蛋白酶不是酵素 |
| cpr | 0 | 誤報 | 2025 AHA 嬰兒改單手掌根或雙拇指環抱，模型知識過時 |
| cpr | 1 | 誤報 | 同上 |
| cpr | 2 | 誤報 | 同上 |
| cpr | 3 | 誤報 | 2025 AHA 成人哽塞改背擊＋腹推交替 |
| cpr | 4 | 誤報 | 2025 AHA 生存之鏈已統一 |
| cranial-nerve-spine-disorders | 0 | 誤報 | 照 113-3_BM_034 答案 D（atogepant） |
| cranial-nerves | 0 | 誤報 | 台灣腦死判定準則有頭眼反射 |
| cranial-nerves | 1 | 誤報 | 同上 |
| decision-making | 0 | 待確認 | 單純／非結構性／結構性複雜問題對應管理層級，頁面與管理學一般說法相反，查無考題，需看課本原文 |
| decision-making | 1 | 誤報 | 照 110-2_FA_060 選項「名義／記名式團體法」 |
| delegation-empowerment | 0 | 誤報 | 照 113-3_FA_045 答案 B（A 不對） |
| delirium | 0 | 誤報 | 照 110-2_FA_049 答案 A |
| dementia | 0 | 誤報 | 照 108-2_PC 答案 B（立即→近期→遠期） |
| dementia | 1 | 誤報 | 同上 |
| depressive-disorder | 0 | 誤報 | 照 115-1_PC_023 答案 D（紊亂期） |
| depressive-disorder | 1 | 改 | 改為超我強、自我弱，註明 109-2_PC 錯誤選項 |
| diabetes | 0 | 改 | 蘇莫吉效應改「給睡前點心」 |
| diabetes | 1 | 誤報 | 照 114-3_OP 答案（注射後 60–90 分鐘再運動） |
| diabetes | 2 | 改 | 血鉀 < 3.5 補鉀速率 10–20 mEq/h（2024 共識） |
| diabetes | 3 | 改 | 靜脈延遲時改肌肉注射 |
| diabetes-insipidus-siadh | 0 | 改 | 保留 113-3_MS 說法，補註床邊備水、靠 desmopressin 調整 |
| dialysis-crrt | 0 | 改 | 補註實際每次換液先引流再灌入 |
| digoxin | 0 | 改 | phenytoin 限 VPC、VT，VF 要電擊 |
| digoxin | 1 | 誤報 | 2026 ESC 已發布 |
| digoxin | 2 | 改 | 心搏過緩是表現不是原因 |
| documentation-orders | 0 | 誤報 | 依課本，查無反證（109-1_FA_004 沒考這點） |
| documentation-orders | 1 | 誤報 | 同上 |
| documentation-orders | 2 | 誤報 | 醫療法第 68 條第 3 項就是口頭醫囑 24 小時內補書面 |
| documentation-orders | 3 | 誤報 | 依課本，查無反證 |
| documentation-orders | 4 | 誤報 | 依課本，查無反證 |
| documentation-orders | 5 | 誤報 | 115 年考題存在 |
| documentation-orders | 6 | 誤報 | 醫療法第 68 條第 2 項有增刪畫線規定 |
| echocardiography | 0 | 誤報 | 2026 ESC 已發布 |
| echocardiography | 1 | 誤報 | 同上 |
| emergency-nursing | 0 | 改 | 凍瘡改凍傷；body-temperature 同步改凍傷、溫度與內外課本一致 |
| emergency-nursing | 1 | 改 | 血紅素尿移到淡水溺水 |
| emergency-nursing | 2 | 誤報 | TTAS 輕度呼吸窘迫是第 3 級 |
| end-of-life-care | 0 | 誤報 | 安寧緩和醫療條例第 5 條第 2 項有醫療委任代理人 |
| end-of-life-care | 1 | 誤報 | 現行第 7 條第 5 項依順位，模型引用 2011 年舊法的多數決 |
| end-of-life-care | 2 | 改 | 瀕死保暖避免熱水袋、電毯 |
| enteral-parenteral-nutrition | 0 | 誤報 | 照 110-1_FA_050 答案 D（PPN 等張算對） |
| enteral-parenteral-nutrition | 1 | 改 | PPN 改「接近等張」並註國考說法、滲透壓 < 900 |
| enteral-parenteral-nutrition | 2 | 改 | 中央靜脈拿掉外頸 |
| enteral-parenteral-nutrition | 3 | 誤報 | 115-2 考題存在 |
| enteral-parenteral-nutrition | 4 | 誤報 | 同上 |
| enteral-parenteral-nutrition | 5 | 誤報 | 114-2_FA_028 存在（A or D） |
| environmental-injury | 0 | 改 | 照 109-2_OP 改寫清楚 |
| epilepsy | 0 | 誤報 | ILAE 2025 已發布，模型知識過時 |
| family-nursing | 0 | 誤報 | 照 106-2_PC 答案 B（先設目標再排優先順序） |
| family-nursing | 1 | 誤報 | 照 111-1_PC 詳解（第六階段稱空巢期／離家期） |
| family-planning | 0 | 誤報 | 照 111-2_OP_026 答案 B（最長 − 10） |
| family-planning | 1 | 改 | 男用、女用保險套都能預防性病 |
| family-violence | 0 | 改 | 非同居親密關係暴力是 2015 年修法 |
| family-violence | 1 | 改 | 修法重點分年份 |
| family-violence | 2 | 改 | 家庭成員補直系姻親 |
| family-violence | 3 | 改 | 緊急保護令「得不經審理程序」 |
| fertilization-embryology | 0 | 改 | 雙板胚胎是上胚層＋下胚層 |
| fertilization-embryology | 1 | 改 | 胚胎期結束改妊娠 10 週（受精後 8 週） |
| fertilization-embryology | 2 | 改 | 「見 16e」改連到 newborn-assessment |
| fluid-electrolytes | 0 | 改 | 滲透壓公式拿掉 K⁺ |
| fluid-electrolytes | 1 | 改 | 姿位性低血壓改標準定義 |
| fluid-electrolytes | 2 | 改 | 無感性流失改每天 600–900 mL |
| fluid-electrolytes | 3 | 改 | 1 kg ≈ 1 L |
| fractures | 0 | 誤報 | 照 114-1_FA 答案 D（殘肢回反摺形＋環形） |
| fractures | 1 | 誤報 | 照 107-2_MS_017 答案 D（B 下背痛算對） |
| fractures | 2 | 改 | 改為「石膏固定 3 個月、剛拆石膏時」 |
| gi-anatomy-physiology | 0 | 改 | 絨毛是黏膜突起 |
| gi-anatomy-physiology | 1 | 改 | 骨骼肌部位補口腔與肛門外括約肌 |
| gi-diagnostic-procedures | 0 | 改 | 剛切除息肉改為鋇劑灌腸禁忌 |
| gi-diagnostic-procedures | 1 | 改 | 肝切片部位一般寫腋中線，並列課本腋前線 |
| gi-diagnostic-procedures | 2 | 誤報 | 台灣課本寫右肋緣下墊沙袋 |
| gi-diagnostic-procedures | 3 | 改 | 大腸鏡左側臥，膝胸臥限乙狀結腸鏡（111-1_FA） |
| glomerular-diseases | 0 | 改 | 腹圍改每天同一時間量 |
| glomerular-diseases | 1 | 改 | 蛋不是高鉀；尿量 1–2 mL/kg/h 改為正常值說明 |
| glomerular-diseases | 2 | 改 | 腎病症候群蛋白質正常量 |
| glucose-homeostasis | 0 | 改 | 體抑素（體制素） |
| glucose-homeostasis | 1 | 改 | 胰凝乳蛋白酶 |
| group-family-therapy | 0 | 誤報 | 照 108-2_PC_011 答案 D（情感宣洩） |
| group-family-therapy | 1 | 誤報 | 照 107-2_PC_009 答案 D（②③④） |
| group-family-therapy | 2 | 改 | 表格列名改心理治療團體，註明會心團體偏重此時此刻 |
| gynecologic-cancers | 0 | 待確認 | 女陰切除術後「大腿外展 45 度、屈膝」，查無考題，模型說應內收；需看課本原文 |
| gynecologic-cancers | 1 | 待確認 | 同上 |
| head-neck-cancers | 0 | 誤報 | 照 111-1_MS 答案（可依醫囑塗氧化鋅） |
| head-neck-cancers | 1 | 改 | 全喉切除後嗅覺喪失，不強調香氣 |
| health-administration-system | 0 | 改 | 五癌是 2022 年加入肺癌，2025 年是擴大年齡與 HPV |
| health-education | 0 | 誤報 | 115-1 考題存在 |
| health-equity | 0 | 改 | 改為新住民發展基金 |
| health-promotion | 0 | 改 | 自我解放歸行為歷程 |
| health-promotion | 1 | 誤報 | 學校衛生法 2026-09-23 修正，模型知識過時 |
| health-promotion | 2 | 改 | 意圖期拿掉自我解放 |
| health-promotion | 3 | 改 | 未成年人改未滿 20 歲 |
| heart-failure | 0 | 改 | 嗎啡移出降後負荷，註明主要降前負荷 |
| heat-cold-therapy | 0 | 誤報 | 依課本表格 |
| heat-cold-therapy | 1 | 改 | 脹奶移出冷療禁忌 |
| heat-cold-therapy | 2 | 改 | 溫水拭浴不擦部位改前胸、腹部（112-2_FA_028 後背要擦） |
| heat-cold-therapy | 3 | 誤報 | 照 112-1_FA_027 答案 A（靜脈炎用冷） |
| heat-cold-therapy | 4 | 改 | 轉換的例子拿掉電暖器 |
| helminths-ectoparasites | 0 | 改 | 保留國考答案，加註實際仍經過肺血管 |
| helminths-ectoparasites | 1 | 改 | 同上 |
| hematinics | 0 | 誤報 | 照 111-1_FA_052 答案 B，頁面已標待核對 |
| herpesviruses | 0 | 誤報 | 頁面已註明是國考答案寫法 |
| high-risk-pregnancy | 0 | 誤報 | 台灣課本先兆性又稱脅迫性，迫切性指不可避免流產 |
| high-risk-pregnancy | 1 | 誤報 | 同上 |
| home-care-discharge-planning | 0 | 誤報 | 健保居家照護核定期間 4 個月 |
| home-care-discharge-planning | 1 | 誤報 | 國考題寫法（照專擬定照顧計畫） |
| home-care-discharge-planning | 2 | 誤報 | 依課本引健保署條件 |
| hospitalized-child | 0 | 改 | 服藥時間依醫囑（108-2_OP_041） |
| hospitalized-child | 1 | 誤報 | 依華杏書頁 212 |
| hospitalized-child | 2 | 改 | 漂白水濃度改寫，並列課本 10% |
| hr-management-recruitment | 0 | 改 | 工作抽樣法是隨機時間點瞬間觀察 |
| hr-management-recruitment | 1 | 誤報 | 原文講就業服務法，沒有混淆 |
| hygiene-comfort-care | 0 | 誤報 | 照 111-2_FA_035 答案 B（先中間再小陰唇、大陰唇） |
| hygiene-comfort-care | 1 | 誤報 | 同上 |
| hygiene-comfort-care | 2 | 誤報 | 同上 |
| hyperthyroidism | 0 | 誤報 | 頁面已標待核對 |
| hypotension | 0 | 改 | 延遲型要站超過 3 分鐘 |
| immune-system-basics | 0 | 改 | 胸腺相對大小幼年最大、絕對重量青春期最大 |
| immune-system-basics | 1 | 改 | 胎兒自行合成以 IgM 為主 |
| immunization | 0 | 誤報 | 114 年起 A 肝改 18、27 個月，模型知識過時 |
| immunization | 1 | 誤報 | 依疾管署間隔表 |
| immunization | 2 | 誤報 | 照 112-3_FA_009 答案 A |
| immunization | 3 | 改 | Tdap 統一 28–36 週（疾管署），gram-negative-bacteria 同步 |
| immunoglobulins-hla | 0 | 改 | IgA 第二、IgM 第三，補百分比 |
| immunoglobulins-hla | 1 | 改 | 改為受血者原有 IgM 造成溶血 |
| increased-icp | 0 | 改 | 兒童顱內壓護理活動分散進行 |
| infection-control | 0 | 改 | 改 48–72 小時，保留 107-1_FA 72 小時算對 |
| infection-control | 1 | 改 | 同上 |
| infection-control-administration | 0 | 誤報 | 110-2_FA 確有這題，答案 A |
| infection-control-administration | 1 | 誤報 | 傳染病防治法第 39 條有這項規定 |
| infection-control-administration | 2 | 改 | 腰椎穿刺戴口罩主要保護病人 |
| infective-endocarditis | 0 | 誤報 | 現行瓊斯氏標準沒有白血球增多 |
| infertility | 0 | 改 | 補睪丸受損時 FSH 升高 |
| inflammation-repair | 0 | 誤報 | 健康肉芽組織不易出血，易出血是感染徵象 |
| injections | 0 | 誤報 | 疾管署接觸者檢查：有卡介苗 10 mm、未接種 5 mm |
| injections | 1 | 誤報 | 依課本 |
| injections | 2 | 改 | 法源改為護理人員法第 24 條 |
| insulin | 0 | 改 | 不可縮寫 U、IU |
| insulin | 1 | 改 | 超速效起效與持續時間修正 |
| intrapartum-fetal-monitoring | 0 | 改 | 晚期減速改為最低點落在宮縮高峰之後 |
| intrapartum-fetal-monitoring | 1 | 誤報 | 台灣課本寫可放入一指，查無反證 |
| intrapartum-fetal-monitoring | 2 | 誤報 | 國考題寫法 |
| iv-therapy | 0 | 改 | 空氣栓塞改「留在右心、不阻塞肺動脈出口」 |
| iv-therapy | 1 | 改 | D5 0.225% NaCl 移出治顱內壓高 |
| iv-therapy | 2 | 改 | 反抽不會推入血塊，改為加壓沖洗 |
| ketones | 0 | 誤報 | 照 2024 高血糖危象共識原文 |
| labor-complications | 0 | 改 | 前次剖腹產不用前列腺素 |
| labor-complications | 1 | 誤報 | 枕後位側臥於胎背對側（胎背朝上）是常見建議 |
| labor-process | 0 | 誤報 | 台灣課本用「頭產式、臀產式」指 presentation |
| labor-process | 1 | 改 | 保留 107-2_OP 答案，補完整順序 |
| legal-liability-disputes | 0 | 誤報 | 依醫預法條文，查無反證 |
| legal-liability-disputes | 1 | 誤報 | 醫療法第 82 條第 2 項民事也有逾越合理臨床專業裁量 |
| legal-liability-disputes | 2 | 誤報 | 依醫預法條文 |
| legal-liability-disputes | 3 | 誤報 | 115-1 考題存在 |
| leukemia | 0 | 誤報 | 照 112-1_MS_042 答案 A，頁面已註明疑義 |
| lipid-profile | 0 | 誤報 | 照 115-2_FA_030（脂肪製劑滴完 8 小時後抽 TG） |
| lithium-level | 0 | 誤報 | 慢性中毒分級各來源不同，頁面已標「慢性中毒的參考」 |
| lithium-level | 1 | 改 | 降低鋰濃度的利尿劑改為滲透性與碳酸酐酶抑制劑 |
| liver-cancer | 0 | 改 | 73 年先高危險群、75 年全面 |
| liver-cirrhosis | 0 | 誤報 | 依課本表格 |
| liver-cirrhosis | 1 | 誤報 | 同上 |
| liver-cirrhosis | 2 | 改 | 三腔管放鬆間隔改依醫囑、課本 6–12 小時 |
| long-term-care | 0 | 改 | 巴氏量表 10 項補個人衛生、移位不重複 |
| long-term-care | 1 | 誤報 | 法規出處小差異，內容正確 |
| long-term-care-services | 0 | 誤報 | 頁面標明是國考答案 |
| long-term-care-services | 1 | 改 | 第一類拿掉中低收入戶 |
| long-term-care-services | 2 | 誤報 | 同 #0 |
| loop-diuretics | 0 | 誤報 | 2026 ESC 已發布 |
| lower-gi-disorders | 0 | 誤報 | 照 107-1_FA_031 答案 A |
| lower-gi-disorders | 1 | 誤報 | 同上 |
| lung-cancer | 0 | 改 | 側臥時在上方的術側肺擴張 |
| lymphoma-myeloma | 0 | 誤報 | 照 112-1_MS 答案 D（含血紅素低） |
| lymphoma-myeloma | 1 | 改 | 骨髓瘤不用 rituximab |
| management-theories | 0 | 誤報 | 照 108-1_FA Z 理論題（集體責任算對） |
| management-theories | 1 | 誤報 | 國考選項出現的 L 理論，頁面照課本列 |
| maternal-child-health | 0 | 誤報 | 優生保健法施行細則第 15 條原文就是「住院施行」 |
| maternal-child-health | 1 | 改 | 1 歲以下以窒息最多 |
| mechanical-ventilation | 0 | 改 | 嘆息改每小時數次 |
| mechanical-ventilation | 1 | 改 | 同上 |
| mechanical-ventilation | 2 | 改 | SBT 呼吸次數改 < 35 |
| medical-records-consent | 0 | 改 | MRI 不是侵入性檢查，換例子 |
| medical-records-consent | 1 | 誤報 | 醫療法第 70 條原文有「其餘病歷繼續保存 6 個月以上始得銷燬」 |
| medical-records-consent | 2 | 誤報 | 依辦法條文，查無反證 |
| medication-administration-principles | 0 | 改 | Coumadin 醫囑寫清楚，對應 110-2_FA 第 5 天 0.5 顆 |
| medication-administration-principles | 1 | 改 | 牛奶抑制鐵劑吸收、使 Dulcolax 腸衣提早溶解 |
| medication-administration-principles | 2 | 改 | 胰島素未開封 2–8 ℃ |
| medication-administration-principles | 3 | 誤報 | 依課本表格 |
| microbial-pathogenesis | 0 | 改 | Griffith 用加熱殺死的菌，Avery 證實 DNA |
| microbial-pathogenesis | 1 | 改 | 中心體不是膜狀胞器，分開寫 |
| milieu-therapy | 0 | 誤報 | 依國考題寫法 |
| milieu-therapy | 1 | 誤報 | 表格分開列不影響 |
| milieu-therapy | 2 | 改 | milieu 字義改「周圍環境」 |
| mood-stabilizers | 0 | 改 | 降低鋰濃度的利尿劑改為滲透性與碳酸酐酶抑制劑 |
| motivation-theories | 0 | 誤報 | 依課本分類 |
| motivation-theories | 1 | 誤報 | 課本用詞 |
| national-health-insurance | 0 | 待確認 | 論人計酬的例子寫「慢性呼吸照護病房」，模型說 RCW 是論日計酬；需看課本原文 |
| national-health-insurance | 1 | 改 | 菸酒健康福利捐改菸品健康福利捐 |
| neuro-assessment | 0 | 誤報 | 台灣 GCS 記號：氣管內管 E、氣切 T |
| neuro-assessment | 1 | 誤報 | 照 108-1_MS 題（B 侵入性是錯的） |
| neuron-synapse | 0 | 改 | 過極化時 Na⁺ 通道多已恢復 |
| newborn-adaptation | 0 | 改 | 動脈導管功能性關閉 10–15 小時 |
| newborn-adaptation | 1 | 改 | 戴帽子移到輻射列 |
| newborn-assessment | 0 | 誤報 | 113-1_OP 題目用「皮膚飽和度」 |
| newborn-assessment | 1 | 改 | turgor 那行改「皮膚彈性」 |
| newborn-care | 0 | 誤報 | 照 105-2_OP（75% 酒精）與 110-2_OP（95% 再 75% 錯） |
| newborn-care | 1 | 誤報 | 國健署聽力篩檢補助出生 3 個月內 |
| newborn-care | 2 | 誤報 | 2026-07-01 起 22 項，模型知識過時 |
| non-parenteral-medication | 0 | 誤報 | 照 110-1_FA 答案 C（6.4–7.6 cm） |
| non-parenteral-medication | 1 | 改 | 陰道栓劑 7.5–10 cm，並列課本概念圖 |
| non-parenteral-medication | 2 | 改 | 滴鼻後約 5 分鐘 |
| notifiable-diseases | 0 | 誤報 | 疾管署把 HIV 列第三類 |
| notifiable-diseases | 1 | 誤報 | IPD 是第四類 |
| notifiable-diseases | 2 | 誤報 | 頁面是 105-1 題說明，沒有寫錯 |
| notifiable-diseases | 3 | 誤報 | 同 #0 |
| nsaids-acetaminophen | 0 | 改 | 止痛劑腎病改腎乳頭壞死，與下文一致 |
| nurse-staffing-policy | 0 | 誤報 | 2026-05-08 醫療法修正三讀，模型知識過時 |
| nurse-staffing-policy | 1 | 誤報 | 同上 |
| nurse-staffing-policy | 2 | 誤報 | 同上 |
| nurse-staffing-policy | 3 | 誤報 | 同上 |
| nurse-staffing-policy | 4 | 誤報 | 同上 |
| nursing-administration-overview | 0 | 改 | 規劃寫「制定護理標準與作業規範」、控制寫「績效標準」，分清楚 |
| nursing-administration-overview | 1 | 改 | 拿掉「金馬設衛生院」，改各鄉鎮市區設衛生所 |
| nursing-care-models | 0 | 誤報 | 照 114-3_FA 答案 A（隔離病房全責護理） |
| nursing-care-models | 1 | 誤報 | 同上 |
| nursing-care-models | 2 | 誤報 | 同上 |
| nursing-care-models | 3 | 誤報 | 依課本 |
| nursing-concepts-health | 0 | 誤報 | 頁面已並列 Winslow 與 Leavell & Clark |
| nursing-concepts-health | 1 | 誤報 | Bevis 分期年代依課本 |
| nursing-concepts-health | 2 | 誤報 | 護理人員法第 11 條第 2 項有停業一年為限 |
| nursing-cost-analysis | 0 | 誤報 | 依課本定義 |
| nursing-personnel-act | 0 | 誤報 | 依現行專科護理師分科 |
| nursing-personnel-act | 1 | 誤報 | 已查法規：第 37 條第 2 項仍是 1.5 萬至 15 萬 |
| nursing-personnel-act | 2 | 誤報 | 第 30-1 條原文就有租借給他人處 2–10 萬 |
| nursing-personnel-act | 3 | 誤報 | 已查法規：辦法原文為「專科護理師執行醫療業務委員會」 |
| nursing-process | 0 | 改 | 置中心靜脈導管改為協助醫師置管 |
| nursing-process | 1 | 誤報 | 依課本 p.251 |
| nursing-workload-productivity | 0 | 誤報 | 依課本分類 |
| nursing-workload-productivity | 1 | 誤報 | 115-1 考題存在 |
| nutrition-assessment-diets | 0 | 改 | 由口進食側臥改為偏癱者臥向健側 |
| nutrition-assessment-diets | 1 | 改 | 男性腰臀比 0.90 |
| nutrition-assessment-diets | 2 | 改 | 運鐵蛋白不是急性指標，補前白蛋白 |
| nutrition-assessment-diets | 3 | 誤報 | 依課本 |
| nutrition-assessment-diets | 4 | 改 | UUN 與氮平衡寫清楚 |
| nutrition-assessment-diets | 5 | 改 | 胺基酸 20 種、必需 9 種，並列課本說法 |
| observation-communication | 0 | 改 | 綠膿桿菌傷口氣味改甜腥、葡萄汁味 |
| observation-communication | 1 | 誤報 | 115-1 考題存在 |
| observation-communication | 2 | 誤報 | 114-3 考題存在 |
| observation-communication | 3 | 誤報 | 114-1 考題存在 |
| obsessive-compulsive-disorder | 0 | 誤報 | 照 110-1_PC_020 答案 D（評估自傷、可戴手套洗手） |
| obsessive-compulsive-disorder | 1 | 誤報 | 同上 |
| obsessive-compulsive-disorder | 2 | 誤報 | 照 106-2_makeup_PC 答案 D（理智化） |
| obsessive-compulsive-disorder | 3 | 誤報 | 同 #0 |
| obstetric-nursing-foundations | 0 | 誤報 | 照 107-1_OP 答案 A（母嬰親善列入評鑑） |
| obstetric-nursing-foundations | 1 | 誤報 | 同題詳解（可雙重執業登錄） |
| occupational-health-nursing | 0 | 誤報 | 依 2026 年修正的勞工健康保護規則，模型知識過時 |
| occupational-health-nursing | 1 | 誤報 | 勞動部公式就是「失能傷害人次數」 |
| older-adult-chronic-disease | 0 | 誤報 | 頁面依 112-2 題並標待核對 |
| organization-structure | 0 | 誤報 | 照 112-1_FA_076 答案 A |
| organization-structure | 1 | 誤報 | 照 109-1_FA_065 答案 B（階層完整化不是集權優點） |
| organization-structure | 2 | 誤報 | 同上 |
| organizational-communication | 0 | 誤報 | 照 106-2_makeup_FA 答案 D（斜行） |
| organizational-communication | 1 | 誤報 | 依課本 |
| osteoarthritis | 0 | 改 | 保留 107-1_MS 國考說法，註明實際目的 |
| osteoarthritis | 1 | 改 | 同上 |
| osteoporosis | 0 | 改 | T 值用於停經後婦女 |
| osteoporosis | 1 | 誤報 | 依 2025 台灣骨鬆指引 |
| osteoporosis | 2 | 改 | 臥床者改等長運動、能下床再漸進負重 |
| oxygen-therapy | 0 | 改 | 補註照公式 6 L/min ≈ 44% |
| oxygen-therapy | 1 | 改 | 非再吸入面罩限短期的原因改氧中毒與吸收性肺擴張不全 |
| pain-management | 0 | 改 | 改紙袋，塑膠袋＋O₂ 是錯的 |
| parathyroid-disorders | 0 | 誤報 | 照 112-1_MS 答案 B（含嗜睡） |
| parathyroid-disorders | 1 | 誤報 | 同上 |
| patient-safety-environment | 0 | 改 | 燙傷室溫稍低標為課本說法，加註實務偏暖 |
| patient-safety-environment | 1 | 誤報 | 照 110-2_FA_049（平結算對） |
| patient-safety-reporting | 0 | 誤報 | 115–116 年度目標已公告，模型知識過時 |
| patient-safety-reporting | 1 | 誤報 | 同上 |
| patient-safety-reporting | 2 | 誤報 | 病人自殺列入警訊事件（TJC 定義） |
| patient-safety-reporting | 3 | 改 | 自殺或意外死亡先通知醫師診視 |
| patient-safety-reporting | 4 | 誤報 | 同 #0 |
| patient-safety-reporting | 5 | 誤報 | 同 #0 |
| patient-safety-reporting | 6 | 誤報 | 同 #0 |
| pediatric-endocrine | 0 | 改 | 保留國考早上給，補臨床睡前劑量 |
| pediatric-endocrine | 1 | 改 | 慢性腎衰竭兒童不是多喝水，改限磷補維生素 D |
| pediatric-endocrine | 2 | 誤報 | 照 106-1_OP_068 答案 A（頁面已並列 ACMG 終身治療） |
| pediatric-genitourinary | 0 | 誤報 | 照 112-3_OP 答案 D（固定腹部或大腿） |
| pediatric-genitourinary | 1 | 改 | 解便時內層也要換 |
| pediatric-gi | 0 | 改 | 腭裂術後用杯子餵，不用湯匙 |
| pediatric-injuries | 0 | 改 | 只有恆牙放回 |
| pediatric-injuries | 1 | 誤報 | 道路交通安全規則第 39 條之 1 就是幼童安全椅 |
| pediatric-injuries | 2 | 改 | 血鉛參考值 3.5 μg/dL |
| pediatric-musculoskeletal | 0 | 誤報 | 台灣兒科課本：小尿布塞進石膏會陰開口邊緣 |
| pediatric-musculoskeletal | 1 | 誤報 | 寫法不影響 |
| pediatric-musculoskeletal | 2 | 改 | 皮肌炎深部肌腱反射多正常、不會亢進 |
| pediatric-musculoskeletal | 3 | 改 | 同上 |
| pediatric-neuro | 0 | 誤報 | 依課本（軟、小孔奶嘴） |
| pediatric-neuro | 1 | 誤報 | 同上 |
| pediatric-neuro | 2 | 誤報 | Wong 教材吸吮反射約 10–12 個月轉為自主 |
| pediatric-nursing-foundations | 0 | 改 | 2012 年主管機關是衛生署 |
| pediatric-nursing-foundations | 1 | 改 | 腹瀉不常規稀釋成半奶 |
| pediatric-respiratory-infections | 0 | 改 | 青黴素不能預防腎絲球腎炎 |
| performance-appraisal | 0 | 誤報 | 照 114-1_FA 答案 D（觸角效應） |
| peripheral-vascular-disease | 0 | 改 | 剝離性動脈瘤註明不是真性 |
| peripheral-vascular-disease | 1 | 改 | 靜脈潰瘍表淺、紅色肉芽 |
| pheochromocytoma-aldosteronism | 0 | 改 | 強直性痙攣歸因鹼中毒 |
| pneumonia | 0 | 改 | 消解期以巨噬細胞為主 |
| pneumonia | 1 | 誤報 | 依課本定義 |
| positioning-body-mechanics | 0 | 誤報 | 台灣基護截刀式寫雙腳著地 |
| positioning-body-mechanics | 1 | 誤報 | 照 107-1_FA_031（腸阻塞灌腸膝胸臥） |
| positioning-body-mechanics | 2 | 改 | 手握捲軸是防手指攣縮，垂腕用副木或砂袋 |
| positioning-body-mechanics | 3 | 改 | 粗隆捲軸拿掉「或外展」 |
| positioning-body-mechanics | 4 | 改 | 腰椎穿刺後去枕平躺 |
| postpartum-adaptation | 0 | 誤報 | 依課本（每天降一指，一週約到恥骨上） |
| postpartum-adaptation | 1 | 誤報 | 115-1 考題存在 |
| potassium-sparing-diuretics | 0 | 誤報 | 2026 ESC 已發布 |
| potassium-sparing-diuretics | 1 | 改 | H⁺ 由插入細胞分泌 |
| prenatal-assessment | 0 | 誤報 | 照 114-2_OP_002 答案 C（妊娠囊算確實徵象） |
| prenatal-assessment | 1 | 誤報 | 台灣課本 20 週約平臍 |
| prenatal-care | 0 | 誤報 | 照 112-2_OP 題（臍上一橫指符合週數） |
| prenatal-care | 1 | 誤報 | 同上 |
| prenatal-care | 2 | 誤報 | 國考題寫法 |
| prenatal-care | 3 | 誤報 | 照 109-2_OP 答案 C（共同做決定不適當） |
| pressure-injury | 0 | 改 | 床頭不超過 30 度，並列課本 45 度 |
| pressure-injury | 1 | 誤報 | 照 106-2_FA_048 答案 D（膝內側算對） |
| pressure-injury | 2 | 誤報 | 同上 |
| pressure-injury | 3 | 改 | 補「臨床每 2 小時翻身」 |
| primary-immunodeficiency | 0 | 誤報 | 高 IgM 依課本歸抗體缺陷 |
| primary-immunodeficiency | 1 | 改 | SCID 改列 T＋B，摘要同步 |
| psychiatric-nursing-foundations | 0 | 誤報 | 照 106-2 第四次革新＝生物精神醫學 |
| psychiatric-nursing-foundations | 1 | 誤報 | 同上 |
| psychiatric-nursing-foundations | 2 | 誤報 | 同上 |
| psychodynamic-theories | 0 | 改 | Peplau 四期改認識、認同、工作、結束（108-1 題） |
| psychodynamic-theories | 1 | 改 | schizophrenia 由 Bleuler 命名 |
| pulmonary-embolism-hypertension | 0 | 誤報 | 頁面已寫現行是阻塞性 |
| pulmonary-embolism-hypertension | 1 | 誤報 | 依 2026 AHA/ACC |
| pulmonary-embolism-hypertension | 2 | 改 | C1 改為「C 類中風險較低者」，與分類表一致 |
| pulse-blood-pressure | 0 | 改 | 保留 112-2 答案，註實務快速打氣 |
| pulse-blood-pressure | 1 | 改 | 第 4 肋間是第 4–5 肋骨之間 |
| pulse-blood-pressure | 2 | 改 | 保留 111-2 答案，註學理是徵象 |
| quality-improvement-tools | 0 | 誤報 | 依辦法是通報完成後 45 日 |
| quality-improvement-tools | 1 | 改 | 系統圖拿掉因果箭頭 |
| quality-improvement-tools | 2 | 改 | FOCUS-PDCA 的 A |
| quality-management-concepts | 0 | 改 | 年份不確定，刪除 |
| respiratory-viral-infections | 0 | 改 | COVID 主要飛沫與接觸 |
| restrictive-lung-diseases | 0 | 改 | 保留 111-1 題，註嘆息頻率 |
| rna-viruses | 0 | 待確認 | 免疫不全者狂犬病疫苗時程（頁面 0天2劑、7、21 vs 模型 5 劑），疾管署 2019 指引網頁讀不到 |
| rna-viruses | 1 | 改 | 免疫球蛋白剩餘劑量打在遠離疫苗部位 |
| rna-viruses | 2 | 改 | 伊波拉照護要 N95 |
| schizophrenia | 0 | 誤報 | 精神衛生法第 20 條：一年至三年（已查法規） |
| schizophrenia | 1 | 誤報 | 照 109-1 題②「先約束再開醫囑」錯 |
| schizophrenia | 2 | 誤報 | 同上 |
| school-health | 0 | 誤報 | 第 11 條有聽力不良（已查法規） |
| school-health | 1 | 誤報 | 第 6 條第 3 項 115-09-23 修正（已查法規） |
| school-health | 2 | 改 | 註明五級第三級屬次段預防 |
| school-health | 3 | 誤報 | 114-2_psych_comm 有此題 |
| sepsis | 0 | 誤報 | 照考題答案間歇熱 |
| sex-hormones | 0 | 改 | 月經來潮頭 7 天 |
| sex-hormones | 1 | 改 | 400 μg＝200 μg 2 顆 |
| shock | 0 | 誤報 | 照 105-1 詳解主動脈剝離列阻塞性 |
| shock | 1 | 改 | 嗎啡降前負荷與後負荷 |
| skeletal-system | 0 | 改 | 十字韌帶改列關節囊內、滑膜外 |
| skeletal-system | 1 | 改 | 顴骨顳突 |
| sleep-rest | 0 | 改 | 睡眠效率成人 < 85%、老人 < 80% |
| sleep-rest | 1 | 改 | 同上 |
| sleep-rest | 2 | 改 | 同上 |
| sleep-rest | 3 | 改 | 不論哪一期中斷都從 NREM 1 開始 |
| sleep-rest | 4 | 誤報 | 照 106-1 題（第四期磨牙） |
| special-senses | 0 | 誤報 | 照 113-2_BM 答案 A（橢圓囊與球囊） |
| spinal-cord-injury | 0 | 誤報 | 照 107-1_MS 答案 D（漸進移除） |
| spinal-cord-injury | 1 | 改 | C3 以上無法自行呼吸、C4 常需呼吸器 |
| spinal-cord-injury | 2 | 改 | Credé 方向 |
| staphylococcus-aureus | 0 | 誤報 | 照 108-1_MS 答案冷敷 |
| staphylococcus-aureus | 1 | 誤報 | 照 107-1_FA 答案 |
| staphylococcus-aureus | 2 | 改 | MRSA 是取得 mecA |
| streptococci | 0 | 改 | Griffith 與 Avery 分開寫 |
| stroke | 0 | 誤報 | 照 105-2_FA 答案 D（足背、足後跟） |
| stroke | 1 | 誤報 | 同上 |
| substance-use-disorders | 0 | 誤報 | 2026-06-27 升列第一級（頁面已附來源） |
| substance-use-disorders | 1 | 誤報 | 同上 |
| substance-use-disorders | 2 | 誤報 | 同上 |
| thiazide-diuretics | 0 | 誤報 | 2022 台灣指引原文 |
| thiazide-diuretics | 1 | 改 | 鋰鹽與低血鉀分開寫 |
| transfusion-reactions | 0 | 改 | 註明台灣單位 250 mL |
| transfusion-reactions | 1 | 誤報 | 北榮 SOP，加註來源 |
| transfusion-reactions | 2 | 改 | 溫血器上限 42℃ |
| tuberculosis | 0 | 誤報 | 疾管署切點：未接種卡介苗 ≥ 5 mm |
| turnover-absenteeism | 0 | 改 | 穩定率分母改期初人數 |
| tzd | 0 | 誤報 | ADA 表 9.2 原文 |
| upper-gi-disorders | 0 | 改 | 內視鏡後是考慮進食不是稀釋 |
| urinalysis | 0 | 改 | 保留 111-1 答案，註 B2 |
| urinalysis | 1 | 改 | 保留 111-2 答案，註血紅素尿 |
| urinalysis | 2 | 誤報 | 109-1_OP 題就是 4 歲 |
| urinary-elimination | 0 | 改 | 見尿後再插入 2.5–5 cm 才打水球 |
| urinary-elimination | 1 | 誤報 | 頁面沒有寫冰生理食鹽水 |
| urinary-elimination | 2 | 改 | 消毒理由改寫 |
| urinary-tract-infection | 0 | 誤報 | 依台灣 2015 指引 |
| urologic-diagnostic-procedures | 0 | 改 | 腎動脈攝影是動脈打顯影劑 |
| urologic-disorders | 0 | 改 | TURP 活動限制 6–8 週（並列課本 3 個月） |
| urologic-disorders | 1 | 誤報 | 頁面已寫稀釋醋清結晶 |
| urologic-disorders | 2 | 改 | 膀胱灌藥停留 1–2 小時（105-2 詳解） |
| valvular-heart-disease | 0 | 改 | TR 是高尖 P 波 |
| viral-hepatitis | 0 | 誤報 | 2014 起 B 肝篩檢提前到第 1 次產檢 |
| viral-hepatitis | 1 | 誤報 | 同上 |
| viral-hepatitis | 2 | 改 | A 肝註明 114 年起 18、27 個月 |
| viral-hepatitis | 3 | 誤報 | 114 年起時程 |
| viral-hepatitis | 4 | 誤報 | 同 #0 |
| vital-statistics | 0 | 改 | 新發生「至少」50 人 |
| vital-statistics | 1 | 改 | TFR 要 ÷ 1,000 |
| vital-statistics | 2 | 改 | 周產期分母加死產 |
| wound-dressings | 0 | 改 | 保留課本、註明藻膠多用於中到大量 |
