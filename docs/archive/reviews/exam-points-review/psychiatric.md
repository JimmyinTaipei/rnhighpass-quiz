# 國考常考點分散建議:精神疾病

由 scripts/suggest-exam-points.mjs 產生。把 `→` 後的段落 id 改成你要的(`keep` = 留在底部);確認後執行
`node scripts/suggest-exam-points.mjs --apply --only <slug|psychiatric>`。

## antidepressants 抗憂鬱藥物(7 條)

可選段落:summary、mechanism、agents、indications、treatment-principles、adverse-effects、ssri-effects(H3)、suicidality-warning(H3)、discontinuation(H3)、serotonin-syndrome(H3)、tca-effects(H3)、maoi(H3)、interactions、nursing、nursing-administration(H3)、nursing-education(H3)

### b01 → mechanism   (信心:高 63.7 作用機轉;備選:maoi 36.6、summary 21.6、serotonin-syndrome 18.4)  <!--h:572342-->
> - 機轉：SSRI = 選擇性抑制**血清素**再回收(fluoxetine)；TCA = 抑制 **NE 與 5-HT** 再回收；MAOI = 抑制**單胺氧化酶**。

### b02 → ssri-effects   (信心:高 25.2 SSRI 與 SNRI;備選:suicidality-warning 15.5、tca-effects 10.0、mechanism 9.0)  <!--h:4fca05-->
> - 抗憂鬱劑 **2 週以上**才有療效；憂鬱症開始恢復時是自殺高風險期。

### b03 → ssri-effects   (信心:高 19.1 SSRI 與 SNRI;備選:maoi 13.1、mechanism 12.4、nursing-education 11.7)  <!--h:05a115-->
> - SSRI 副作用：**噁心、失眠、性功能障礙**；早上、飯後吃。

### b04 → tca-effects   (信心:高 34.7 三環抗憂鬱劑(TCA);備選:maoi 24.5、mechanism 21.6、agents 17.5)  <!--h:409875-->
> - TCA：**抗膽鹼**(蕈毒鹼受體)、姿勢性低血壓、**心臟毒性**，過量致命；老人不是首選。

### b05 → maoi   (信心:中 19.5 單胺氧化酶抑制劑(MAOI);備選:summary 17.4、mechanism 15.2、agents 11.9)  <!--h:1cedec-->
> - MAOI：**酪胺** → 高血壓危象；不可與 SSRI 併用。

### b06 → agents   (信心:中 28.9 代表藥物;備選:indications 28.9、maoi 14.2、summary 6.9)  <!--h:9cbd0a-->
> - **Bupropion**：戒菸；**fluvoxamine**：強迫症；**imipramine**：夜尿症、暴食症。

### b07 → tca-effects   (信心:中 16.5 三環抗憂鬱劑(TCA);備選:treatment-principles 15.1、summary 10.6、agents 8.6)  <!--h:6c9781-->
> - 老年憂鬱：**SSRI 第一線**；緩解後仍需維持用藥數月到一年以上，不可突然停藥。

## antipsychotics 抗精神病藥物(6 條)

可選段落:summary、mechanism、agents、fga(H3)、sga(H3)、indications、treatment-principles、adverse-effects、eps(H3)、nms(H3)、metabolic(H3)、cardiovascular(H3)、other-effects(H3)、clozapine、clozapine-agranulocytosis(H3)、clozapine-other(H3)、clozapine-interactions(H3)、lai、lai-indications(H3)、lai-technique(H3)、interactions、nursing、nursing-adherence(H3)、nursing-monitoring(H3)、nursing-education(H3)

### b01 → summary   (信心:高 51.3 重點摘要;備選:mechanism 32.2、indications 11.8、eps 11.3)  <!--h:bf175d-->
> - 機轉：阻斷 **D2**；幻覺妄想 = 中腦邊緣路徑；第二代同時擋 **5-HT2A**。

### b02 → indications   (信心:高 24.3 適應症;備選:summary 15.0、eps 12.4、fga 10.0)  <!--h:c5d71e-->
> - EPS 最多：**haloperidol**；止吐作用來自 **CTZ 的 D2** 阻斷。

### b03 → sga   (信心:高 44.0 第二代與部分致效劑;備選:other-effects 28.8、cardiovascular 25.5、fga 24.9)  <!--h:b1220f-->
> - 體重增加：**olanzapine、clozapine**；泌乳素上升：**risperidone**；QT 延長最嚴重：**thioridazine**；光敏感：**chlorpromazine**；選擇性 D2/D3：**amisulpride**。

### b04 → clozapine-interactions   (信心:高 39.5 交互作用;備選:sga 21.8、clozapine-agranulocytosis 19.9、other-effects 19.8)  <!--h:6b0164-->
> - Clozapine 的 EPS 少，是因為**對 D2 受體親和力低**；要監測**白血球**；併用 fluvoxamine 或 SSRI 增加**癲癇**風險。

### b05 → eps   (信心:高 58.5 錐體外徑症候群(EPS);備選:cardiovascular 13.4、other-effects 8.5、treatment-principles 7.3)  <!--h:66640f-->
> - 類巴金森症狀在用藥**前 3 個月**就可能出現；TD 可能**不可逆**，發現要評估減量或換藥。

### b06 → lai-technique   (信心:高 50.2 劑型與注射技術;備選:nms 10.0、eps 8.2、nursing-monitoring 8.2)  <!--h:ab72e3-->
> - 長效針劑：深部肌肉注射、**不按摩**、推藥慢、輪換部位；第一代是**油性**、用 Z 字形。

## lithium-level 血中鋰濃度(4 條)

可選段落:origin、source(H3)、elimination(H3)、reference-range、high、high-causes(H3)、high-symptoms(H3)、high-management(H3)、low、interference、nursing、related

### b01 → interference   (信心:高 30.5 干擾因素;備選:nursing 11.2、high-symptoms 8.9、source 7.4)  <!--h:05f92c-->
> - 抽血：服藥後 **12 小時**(早上服藥前)；**服藥後 0.5–2 小時**是最高濃度、最容易出現副作用的時間，不是最佳抽血時間。

### b02 → reference-range   (信心:高 24.6 參考值;備選:related 7.7、nursing 4.1、low 2.7)  <!--h:fefca5-->
> - 治療範圍約 **0.6–1.2**；**> 1.5** 開始中毒；1.2 屬於治療範圍內 → 繼續服藥、密切監測。

### b03 → high-symptoms   (信心:中 22.6 表現與分級;備選:high-management 22.4、nursing 14.6、high-causes 4.1)  <!--h:0e1fea-->
> - 中毒徵象：**嘔吐、腹瀉、粗大顫抖、步態不穩、意識障礙**；處置：停藥、驗濃度、輸液，嚴重時**血液透析**。

### b04 → high-causes   (信心:高 18.7 原因;備選:elimination 11.0、nursing 7.5、high-management 6.4)  <!--h:eb76b7-->
> - 會使鋰濃度上升：**脫水、低鈉、thiazide、NSAIDs、ACEI**、腎功能差。

## mood-stabilizers 情緒穩定劑(6 條)

可選段落:summary、agents、lithium、lithium-pharmacokinetics(H3)、lithium-levels(H3)、lithium-adverse-effects(H3)、lithium-toxicity(H3)、lithium-interactions(H3)、lithium-monitoring(H3)、lithium-nursing(H3)、valproate、carbamazepine、lamotrigine、nursing

### b01 → lithium-pharmacokinetics   (信心:中 21.0 藥動;備選:lithium-nursing 16.7、lithium-toxicity 9.7、carbamazepine 8.9)  <!--h:dbaba7-->
> - 鋰鹽：分 2–3 次服用、隨餐吃可減少腸胃不適；**不需要嚴格限鹽**(限鹽反而會中毒)；**不是**由肝臟代謝；**不是**服藥 2 天就見效。

### b02 → lithium-pharmacokinetics   (信心:高 31.1 藥動;備選:lithium-nursing 17.1、summary 15.4、lithium-adverse-effects 5.9)  <!--h:8c1391-->
> - 鋰鹽服藥後 **0.5–2 小時**達最高濃度，此時最容易出現副作用；抽血要在服藥後 **12 小時**。

### b03 → lithium-toxicity   (信心:中 9.4 鋰中毒;備選:lithium-levels 7.5、valproate 7.3、lithium-pharmacokinetics 5.7)  <!--h:3c5168-->
> - 急性期濃度「2.0–2.5」「2.0 以上」都是錯的；「急性期 0.6–1.0」也是錯的(那是維持期的範圍)。

### b04 → summary   (信心:中 10.6 重點摘要;備選:lithium-monitoring 8.9、lithium-adverse-effects 8.6、agents 6.5)  <!--h:70c1d5-->
> - 長期監測：**腎功能、甲狀腺功能**。

### b05 → lithium-toxicity   (信心:中 24.9 鋰中毒;備選:lithium-interactions 21.0、summary 13.4、lithium-nursing 9.9)  <!--h:730e7d-->
> - 使鋰濃度上升：**ACEI、NSAIDs、thiazide**、脫水、低鈉。

### b06 → lithium-nursing   (信心:高 35.2 護理與衛教;備選:lithium-adverse-effects 12.4、nursing 6.8、lithium-toxicity 5.3)  <!--h:9ec731-->
> - 「鼓勵病人**大量喝水**來改善副作用」**不適當**：水分要**足夠且穩定**。

