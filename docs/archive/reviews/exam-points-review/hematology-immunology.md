# 國考常考點分散建議:血液與免疫系統

由 scripts/suggest-exam-points.mjs 產生。把 `→` 後的段落 id 改成你要的(`keep` = 留在底部);確認後執行
`node scripts/suggest-exam-points.mjs --apply --only <slug|hematology-immunology>`。

## anticoagulants 抗凝血劑(12 條)

可選段落:summary、mechanism、agents、heparin(H3)、lmwh(H3)、warfarin(H3)、doac(H3)、parenteral-others(H3)、indications、adverse-effects、interactions、warfarin-food(H3)、warfarin-drugs(H3)、other-interactions(H3)、nursing、sc-injection(H3)、iv-heparin(H3)、warfarin-teaching(H3)、bleeding-precautions(H3)、vte-care(H3)

### b01 → summary   (信心:高 26.3 重點摘要;備選:heparin 18.4、mechanism 17.4、iv-heparin 16.8)  <!--h:2b43f3-->
> - **Heparin → aPTT、解毒 protamine sulfate;Warfarin → PT/INR、解毒維生素 K**。「heparin 監測 PT」「warfarin 監測 PTT」「PT 延長打 protamine」都是錯的。

### b02 → heparin   (信心:高 17.8 Heparin(未分化肝素);備選:summary 12.3、mechanism 5.1、iv-heparin 5.1)  <!--h:a64929-->
> - Heparin 使 aPTT 維持在正常的 **1.5–2.5 倍**。

### b03 → sc-injection   (信心:高 24.7 皮下注射(Heparin、LMWH);備選:adverse-effects 14.4、summary 10.8、heparin 10.8)  <!--h:797df3-->
> - Heparin **皮下注射**(可)、不肌肉注射、**不回抽、不按摩**;可以按摩的是肌肉注射的 Demerol，不是 heparin、insulin 或皮內試驗。

### b04 → summary   (信心:中 34.6 重點摘要;備選:warfarin-food 29.5、mechanism 17.0、other-interactions 11.7)  <!--h:c95104-->
> - Warfarin 機轉：拮抗維生素 K，抑制 II、VII、IX、X 合成 → 深綠色蔬菜**避免大量、保持穩定**;「鼓勵多吃菠菜」「菠菜會加強 warfarin」都錯。

### b05 → other-interactions   (信心:高 25.6 其他;備選:parenteral-others 12.1、summary 8.7、sc-injection 7.2)  <!--h:17f8f5-->
> - 使用 heparin 的病人**不需要**避免深色蔬菜。

### b06 → warfarin-food   (信心:中 27.1 Warfarin 與食物;備選:warfarin-drugs 21.2、warfarin-teaching 20.7、doac 6.8)  <!--h:c0d93b-->
> - Warfarin 漏吃**不可隔天吃雙倍**;銀杏、黑木耳、當歸會**增強**藥效;甲狀腺素會**增強**抗凝效果。

### b07 → bleeding-precautions   (信心:中 9.6 所有抗凝劑共通：出血預防與觀察;備選:mechanism 8.0、adverse-effects 6.6、vte-care 5.9)  <!--h:d02da2-->
> - 抗凝劑的目的是**抑制血栓生成**，不是溶解血栓、不是控制心跳。

### b08 → indications   (信心:高 33.8 適應症;備選:doac 18.6、summary 17.0、warfarin 16.0)  <!--h:052b8a-->
> - 心房顫動長期預防栓塞用**口服**抗凝劑(warfarin 或 DOAC),heparin 不能口服。

### b09 → mechanism   (信心:中 23.6 作用機轉;備選:doac 18.8、bleeding-precautions 18.5、warfarin-drugs 10.3)  <!--h:fbc26a-->
> - Rivaroxaban 是**抗凝血劑**(Xa 抑制劑);clopidogrel、tirofiban、aspirin 是抗血小板藥。

### b10 → parenteral-others   (信心:中 33.7 其他注射型;備選:mechanism 24.2、indications 15.8、doac 12.7)  <!--h:f3c82f-->
> - Argatroban 是**注射型**直接凝血酶抑制劑，用於 HIT，不需 antithrombin。

### b11 → adverse-effects   (信心:中 13.8 副作用與禁忌;備選:bleeding-precautions 11.2、indications 9.2、heparin 6.6)  <!--h:69da30-->
> - 主動脈剝離**不可**用抗凝劑。

### b12 → indications   (信心:高 35.1 適應症;備選:warfarin 14.3、warfarin-teaching 8.2、summary 7.3)  <!--h:76f55c-->
> - 機械瓣 → 終身 warfarin;生物瓣 → 短期;計畫懷孕與高齡者選生物瓣。

## antiplatelets 抗血小板藥(10 條)

可選段落:summary、mechanism、agents、aspirin(H3)、p2y12(H3)、others(H3)、indications、dapt(H3)、adverse-effects、interactions、nursing

### b01 → summary   (信心:中 19.2 重點摘要;備選:dapt 19.0、aspirin 14.7、nursing 14.2)  <!--h:941c33-->
> - 冠心病、心肌梗塞、中風/TIA 服用 aspirin 的目的 → **抑制血小板凝集**，不是止痛、不是溶解血栓、不是降低耗氧量。

### b02 → summary   (信心:中 12.6 重點摘要;備選:mechanism 10.1、aspirin 7.1、nursing 5.5)  <!--h:a39b8f-->
> - 低劑量 aspirin 抑制 **thromboxane A₂** 的生成(不可逆抑制 COX-1)。

### b03 → p2y12   (信心:高 39.3 P2Y12 抑制劑;備選:mechanism 16.3、summary 9.8、interactions 8.1)  <!--h:579ad7-->
> - Clopidogrel → **不可逆抑制 P2Y12 ADP 受體**;是**前驅藥**，CYP2C19 弱代謝者效果差。

### b04 → others   (信心:高 31.3 其他;備選:mechanism 17.5、adverse-effects 13.3、nursing 4.6)  <!--h:c97c45-->
> - Abciximab → **GP IIb/IIIa 抑制劑**;dipyridamole → **PDE 抑制劑**。

### b05 → interactions   (信心:高 19.9 交互作用;備選:summary 10.8、aspirin 8.0、mechanism 7.9)  <!--h:3f7f7e-->
> - **Ibuprofen** 會降低 aspirin 預防動脈血栓的效果;aspirin 與 **warfarin** 併用最危險。

### b06 → mechanism   (信心:高 14.4 作用機轉;備選:aspirin 8.0、interactions 5.2、nursing 5.1)  <!--h:64bbaa-->
> - aspirin 作用中「抗發炎」需要劑量最高;aspirin 沒有「止血」作用。

### b07 → adverse-effects   (信心:中 27.0 副作用與禁忌;備選:aspirin 24.9、summary 20.2、interactions 3.5)  <!--h:a6fef8-->
> - 兒童病毒感染(水痘、流感)用 aspirin → **Reye 症候群**(血氨上升)。

### b08 → nursing   (信心:中 28.2 護理重點與衛教;備選:adverse-effects 23.2、aspirin 6.1、dapt 4.8)  <!--h:592575-->
> - 血友病、ITP、血小板低下、登革熱、G-6-PD 缺乏、痛風 → 避免 aspirin。

### b09 → dapt   (信心:高 13.7 雙重抗血小板治療(DAPT);備選:adverse-effects 6.4、mechanism 5.8、aspirin 4.4)  <!--h:49c342-->
> - 支架置放後說「病好了不用吃藥」→ 以不批判態度傾聽，說明支架作用與持續服藥的重要性。

### b10 → adverse-effects   (信心:高 15.4 副作用與禁忌;備選:mechanism 10.1、dapt 9.1、aspirin 7.6)  <!--h:a7a1ba-->
> - PPI **可以**治療與預防 aspirin 引起的潰瘍;misoprostol 可預防。

## complete-blood-count 全血球計數(7 條)

可選段落:reference-range、differential(H3)、anc、anc-examples(H3)、high-low、wbc(H3)、anemia(H3)、hematocrit(H3)、platelets(H3)、chemotherapy、specimen、nursing

### b01 → differential   (信心:高 25.6 白血球分類;備選:anc-examples 11.5、anc 6.9、reference-range 3.8)  <!--h:994835-->
> - 白血球中**數量最多是嗜中性球**，**體積最大是單核球**。

### b02 → anc   (信心:高 60.7 絕對嗜中性白血球數(ANC);備選:anc-examples 31.3、differential 14.3、reference-range 8.1)  <!--h:d36ffd-->
> - **ANC = WBC × (seg% + band%)**；**ANC < 500/μL** 感染風險最高，國考答案採**保護性隔離**；**嗜中性球比白血球總數更能反映感染風險**。

### b03 → platelets   (信心:高 74.5 血小板;備選:anc-examples 8.2、chemotherapy 4.6、reference-range 3.4)  <!--h:1df711-->
> - 血小板 **< 50,000** 受傷易出血、**< 20,000** 自發性出血、**< 10,000** 評估**意識狀態**(顱內出血)；**8 萬不是正常值**。

### b04 → chemotherapy   (信心:高 17.3 化學治療前後的判讀;備選:anc 10.1、anc-examples 5.1、differential 3.7)  <!--h:62617f-->
> - 要考慮暫停化療：**白血球 1,500、ANC 1,000**。

### b05 → anemia   (信心:高 29.8 紅血球、血紅素與 MCV：貧血的分類;備選:reference-range 7.2、wbc 3.3、chemotherapy 1.4)  <!--h:2164a6-->
> - **MCV 小於 80** 的孕婦 → 先讓**配偶驗 MCV**(海洋性貧血帶因篩檢)。

### b06 → hematocrit   (信心:高 24.4 血比容;備選:reference-range 5.8、wbc 3.2、differential 1.2)  <!--h:a43157-->
> - 脫水時 **Hct 上升**，體液過量時 Hct 下降。

### b07 → differential   (信心:高 30.6 白血球分類;備選:anc-examples 8.1、anc 4.2、reference-range 2.9)  <!--h:0ab2ca-->
> - 感染性單核球症：EBV 感染 **B 細胞**，血中**非典型淋巴球是活化的 T 細胞**。

## immunosuppressants 免疫抑制劑與免疫調節劑(8 條)

可選段落:summary、transplant-immunology、tissue-typing(H3)、rejection(H3)、kidney-transplant(H3)、classes、cni(H3)、biologics、nursing

### b01 → summary   (信心:中 24.0 重點摘要;備選:classes 21.2、nursing 13.7、cni 12.9)  <!--h:2ceeda-->
> - **Cyclosporine**：與 **cyclophilin** 結合，**降低 IL-2**；**腎毒性與高血壓**；肝腎毒性、長期致癌；**腎功能穩定也不可停藥**。

### b02 → classes   (信心:高 55.8 藥物分類;備選:nursing 6.0、biologics 5.7、rejection 3.5)  <!--h:5bcb91-->
> - **Mycophenolate**：**抑制 purine 生合成**；**sirolimus**：**抑制 mTOR**；**alemtuzumab**：人化單株抗體、誘導治療。

### b03 → cni   (信心:高 21.2 鈣調磷酸酶抑制劑的使用重點;備選:summary 2.8、classes 2.8)  <!--h:4d979a-->
> - **Tacrolimus 持續性藥效膠囊：整顆吞服**。

### b04 → biologics   (信心:高 64.4 生物製劑與其他免疫調節劑;備選:summary 31.1、classes 10.6、cni 4.5)  <!--h:2aba0b-->
> - **Infliximab → 潛伏結核復發**；**etanercept 結合 TNF-α**；**adalimumab 是 TNF-α 抑制劑**(克隆氏症)；**anakinra 阻斷 IL-1**；**干擾素 α** 治療 B 型肝炎、副作用**類流感**。

### b05 → rejection   (信心:高 72.5 排斥反應的類型;備選:nursing 11.6、classes 10.8、tissue-typing 9.6)  <!--h:087153-->
> - 排斥：**超急性 = ABO 血型不合**、儘快移除；**急性 = T 淋巴球與巨噬細胞**、**預後最好**；急性排斥不是只用利尿劑；急性排斥**體重增加**(不是下降)。

### b06 → tissue-typing   (信心:高 39.9 組織配對;備選:rejection 14.7、classes 3.6、kidney-transplant 1.4)  <!--h:a52466-->
> - 組織配對：**HLA、混合淋巴球反應、交叉配對**；梅毒、C 肝、HIV 不屬於組織配對。

### b07 → nursing   (信心:高 29.9 護理重點與衛教;備選:summary 20.7、cni 2.4、biologics 2.4)  <!--h:9c4314-->
> - 移植後：**避免曬太陽**、避免公共場所、戴口罩、**不可自行停藥**。

### b08 → kidney-transplant   (信心:高 34.2 腎臟移植補充;備選:classes 8.2、rejection 6.7、biologics 6.5)  <!--h:8d062c-->
> - 腎移植：移植腎放在**髂窩**，**不移除原來的腎**；**感染**(肺部)常見；類固醇 → 胃潰瘍。

## stem-cell-transplant 造血幹細胞移植護理(6 條)

可選段落:types、donor-types(H3)、cell-sources(H3)、process、complications、vod(H3)、gvhd(H3)、nursing、infection-prevention(H3)、transfusion(H3)、psychosocial(H3)

### b01 → process   (信心:高 64.2 移植過程;備選:infection-prevention 17.6、donor-types 13.0、vod 9.2)  <!--h:f1abf7-->
> - 預處理高劑量化療：**破壞骨髓與癌細胞，讓幹細胞有生長空間**；幹細胞輸注後約 **14–28 天**才開始造血；移植過程採**保護性隔離**。

### b02 → cell-sources   (信心:高 108.6 依幹細胞來源;備選:gvhd 28.3、process 27.3、donor-types 14.8)  <!--h:59552b-->
> - **周邊血液幹細胞**：捐贈者**連續數天**打 G-CSF、**不需麻醉**、收集後休息無不適**可返家**；受贈者**較易有慢性 GVHD**；**懷孕哺乳、血栓病史、自體免疫病**是禁忌。

### b03 → cell-sources   (信心:高 14.1 依幹細胞來源;備選:donor-types 4.4、process 3.8、infection-prevention 3.7)  <!--h:b89341-->
> - **骨髓捐贈**：抽出過濾後**可立即輸注**。

### b04 → gvhd   (信心:高 93.8 移植物對抗宿主疾病(GVHD);備選:complications 11.8、vod 10.2、psychosocial 7.3)  <!--h:93b64a-->
> - **急性 GVHD**：傳統在 **100 天內**，**皮膚、腸胃道、肝**：**紅疹、腹瀉、膽紅素上升**，**不是便秘**、不是藥物過敏；病理是 **T 細胞媒介的上皮損傷**；**骨髓移植**最易發生 GVHD。

### b05 → vod   (信心:高 46.0 肝靜脈阻塞疾病(竇狀隙阻塞症候群);備選:complications 19.8、gvhd 11.2、cell-sources 4.5)  <!--h:2ac2b4-->
> - **肝靜脈阻塞疾病**：移植後約 2–3 週 **右上腹痛、黃疸、腹水、體重增加**；移植前**肝炎**會增加風險。

### b06 → complications   (信心:高 27.7 移植後的主要併發症;備選:infection-prevention 13.1、gvhd 4.9、vod 4.7)  <!--h:f2faf3-->
> - 移植後 **2 週內**的感染以**細菌**為主，**不是 CMV**。

## thrombolytics 血栓溶解劑(5 條)

可選段落:summary、mechanism、agents、indications、stemi(H3)、stroke(H3)、pe(H3)、adverse-effects、contraindications(H3)、interactions、nursing、before(H3)、after(H3)、reperfusion(H3)

### b01 → summary   (信心:高 42.8 重點摘要;備選:mechanism 24.8、agents 14.3、pe 7.8)  <!--h:16dd8f-->
> - 機轉：**活化與纖維蛋白結合的胞漿素原 → 胞漿素**，溶解**已形成**的血栓;「streptokinase 用來**預防**血栓形成」是錯的。

### b02 → pe   (信心:高 34.2 肺栓塞;備選:stroke 14.8、stemi 13.8、mechanism 9.5)  <!--h:c1cfe4-->
> - 肺栓塞能**快速溶解血塊**的是 streptokinase(血栓溶解劑);aspirin、heparin、warfarin 都不能溶栓。

### b03 → stemi   (信心:中 27.4 ST 段上升心肌梗塞(STEMI);備選:summary 24.2、pe 8.7、mechanism 6.5)  <!--h:36c6b4-->
> - STEMI 可在發作 **12 小時內**給血栓溶解劑(無法及時 PCI 時)。

### b04 → contraindications   (信心:高 32.1 禁忌(STEMI 溶栓，依 ACC/AHA);備選:stroke 15.7、agents 14.3、summary 11.4)  <!--h:ee2e2a-->
> - 缺血性中風 rt-PA:**3 小時內(可延至 4.5 小時)**;「8 小時內」錯誤;有動脈瘤、動靜脈畸形、嚴重肝病者不適用;**出血性中風禁用**。

### b05 → stemi   (信心:中 51.0 ST 段上升心肌梗塞(STEMI);備選:summary 42.1、contraindications 39.5、reperfusion 30.9)  <!--h:27bbeb-->
> - 心肌梗塞急性期治療：國考答案為 morphine 止痛、血栓溶解劑、抗凝血劑;**不補充維生素 K**、不用 10 L/min 鼻導管。現行指引：morphine 只用於其他抗缺血藥無效的胸痛，氧氣只給 SpO₂ < 90% 者(來源：[2025 ACC/AHA 急性冠心症指引](https://doi.org/10.1161/CIR.0000000000001309))。

