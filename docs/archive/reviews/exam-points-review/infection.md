# 國考常考點分散建議:感染

由 scripts/suggest-exam-points.mjs 產生。把 `→` 後的段落 id 改成你要的(`keep` = 留在底部);確認後執行
`node scripts/suggest-exam-points.mjs --apply --only <slug|infection>`。

## aminoglycosides 胺基配醣體類(6 條)

可選段落:summary、mechanism、agents、indications、pharmacokinetics、monitoring(H3)、adverse-effects、interactions、nursing

### b01 → summary   (信心:高 22.9 重點摘要;備選:monitoring 14.4、nursing 12.6、adverse-effects 10.8)  <!--h:f8c46b-->
> - 需要**監測血中濃度**以避免**腎毒性**的抗生素：**gentamicin**(胺基配醣體)。

### b02 → agents   (信心:中 9.6 代表藥物;備選:nursing 7.8、summary 6.7、pharmacokinetics 6.7)  <!--h:1d3880-->
> - 胺基配醣體**胃腸吸收差**，口服無法達到全身殺菌濃度。

### b03 → interactions   (信心:高 18.7 交互作用;備選:monitoring 8.8、nursing 8.4、summary 5.5)  <!--h:eb7a08-->
> - **furosemide**(環利尿劑)增加 gentamicin 的**耳毒性**。

### b04 → mechanism   (信心:高 36.4 作用機轉;備選:agents 10.3、nursing 6.8、pharmacokinetics 6.1)  <!--h:7fdba9-->
> - 與 β-lactam(cefazolin、penicillin)併用有**協同作用**：β-lactam 讓胺基配醣體**容易進入**細菌。

### b05 → summary   (信心:中 10.3 重點摘要;備選:nursing 10.1、mechanism 2.1、agents 2.1)  <!--h:6a893d-->
> - gentamicin 要**稀釋後滴注**，不可推注。

### b06 → mechanism   (信心:高 8.9 作用機轉;備選:summary 4.4、interactions 4.4、pharmacokinetics 3.3)  <!--h:0b6794-->
> - 作用在**核糖體 30S**(vancomycin 不作用在核糖體)。

## anaerobes 厭氧菌(6 條)

可選段落:features、overview、clostridioides-difficile、clostridium-perfringens、bacteroides-fragilis、actinomyces、cutibacterium-acnes

### b01 → clostridioides-difficile   (信心:高 106.9 困難梭狀桿菌 Clostridioides difficile;備選:overview 51.9、clostridium-perfringens 10.6、actinomyces 8.6)  <!--h:01fae0-->
> - **困難梭狀桿菌**：**抗生素相關腹瀉**；**偽膜性**炎症；厭氧革蘭氏陽性桿菌，會形成**孢子**；高危險是年長者、住院、長期用抗生素；**首選口服**(不是靜脈) vancomycin；治療**不是**持續用廣效抗生素；腹瀉期間**接觸隔離**。

### b02 → clostridium-perfringens   (信心:高 46.7 產氣莢膜梭菌 Clostridium perfringens;備選:overview 27.4、features 11.4、bacteroides-fragilis 7.8)  <!--h:82aae3-->
> - **產氣莢膜梭菌**是**厭氧菌**，造成**氣性壞疽**與壞死性腸炎；傷口檢體中看不到白血球。

### b03 → bacteroides-fragilis   (信心:高 34.8 鬆脆類桿菌 Bacteroides fragilis;備選:overview 14.2、clostridium-perfringens 5.2、features 5.2)  <!--h:bc1181-->
> - **鬆脆類桿菌**：有莢膜、菌毛、分泌酵素；**生長慢的厭氧菌**、內毒素活性弱。

### b04 → actinomyces   (信心:中 27.9 放線菌 Actinomyces;備選:overview 21.6、cutibacterium-acnes 2.1、clostridium-perfringens 1.5)  <!--h:48d745-->
> - **放線菌**：**硫磺顆粒**，與口腔衛生不佳或牙科手術有關。

### b05 → cutibacterium-acnes   (信心:高 31.7 痤瘡丙酸桿菌 Cutibacterium acnes;備選:clostridioides-difficile 9.0、overview 8.4、bacteroides-fragilis 1.8)  <!--h:1934d4-->
> - 痤瘡丙酸桿菌造成的青春痘**無法**只靠清潔皮膚完全消除。

### b06 → overview   (信心:高 26.8 總覽比較表;備選:clostridioides-difficile 9.5、clostridium-perfringens 2.4、bacteroides-fragilis 1.8)  <!--h:9d9b4c-->
> - 嬰兒肉毒桿菌中毒可從**糞便**分離出細菌；破傷風預防需要**免疫球蛋白及疫苗**。

## antibiotics-overview 抗生素總論(10 條)

可選段落:summary、mechanism、bactericidal-bacteriostatic、pk-pd、principles、culture-first(H3)、empiric-definitive(H3)、duration(H3)、when-not(H3)、prophylaxis(H3)、special-populations(H3)、resistance、resistance-mechanisms(H3)、mdro(H3)、prevent-resistance(H3)、stewardship(H3)、normal-flora、c-difficile(H3)、interactions(H3)、combinations、allergy、nursing

### b01 → resistance-mechanisms   (信心:高 43.8 抗藥機轉;備選:mdro 16.7、combinations 13.8、mechanism 12.4)  <!--h:2624c8-->
> - 細菌對青黴素的主要抗藥機轉：產生 **β-內醯胺酶**。

### b02 → mechanism   (信心:高 67.8 作用機轉分類;備選:special-populations 11.3、interactions 11.3、pk-pd 4.6)  <!--h:783333-->
> - 奎諾酮類抑制 **DNA gyrase**，影響 **DNA 複製**；rifampin 抑制 **RNA 聚合酶**。

### b03 → culture-first   (信心:高 67.2 先採檢體再給藥;備選:summary 12.2、prevent-resistance 9.7、empiric-definitive 7.3)  <!--h:96a8d9-->
> - 選擇抗生素種類的依據：**培養與感受性試驗**(血液培養、尿液培養)，不是 CRP 或 ESR。

### b04 → culture-first   (信心:高 29.1 先採檢體再給藥;備選:summary 12.5、empiric-definitive 10.8、stewardship 7.4)  <!--h:811318-->
> - **先採檢體、再給抗生素**；敗血症時不要因採檢延誤給藥。

### b05 → summary   (信心:高 37.2 重點摘要;備選:prevent-resistance 24.4、nursing 24.1、duration 23.8)  <!--h:7d0c51-->
> - 抗生素**按時等間隔給藥**；**依醫囑完成療程**，症狀消失也不可自行停藥。

### b06 → combinations   (信心:高 75.5 合併使用;備選:pk-pd 42.4、nursing 35.0、special-populations 18.7)  <!--h:b54157-->
> - 胺基配醣體**口服幾乎不吸收**；與 β-lactam 併用有**協同作用**；與環利尿劑併用**耳毒性**增加；需要監測血中濃度(**腎毒性**)。

### b07 → special-populations   (信心:高 39.6 特殊族群;備選:mechanism 18.3、c-difficile 7.7、nursing 6.0)  <!--h:6e99ef-->
> - 新生兒感染較安全的選擇：**penicillin G**(chloramphenicol 會造成灰嬰症候群)。

### b08 → c-difficile   (信心:高 60.0 困難梭狀桿菌感染;備選:summary 18.0、mdro 17.1、combinations 12.3)  <!--h:02adc8-->
> - 困難梭狀桿菌腸炎：**停用廣效抗生素**，用**口服** vancomycin(不是靜脈注射)，接觸隔離，肥皂洗手。

### b09 → prevent-resistance   (信心:高 45.3 防止抗藥性;備選:prophylaxis 22.6、empiric-definitive 17.9、stewardship 10.8)  <!--h:d68a73-->
> - 防止抗藥性：**定期公告病原與抗生素感受性**，不要常規預防性或低劑量用藥。

### b10 → special-populations   (信心:高 21.8 特殊族群;備選:mechanism 7.5、nursing 5.0)  <!--h:b70fef-->
> - 肝功能異常時 **erythromycin** 會蓄積。

## antifungals 抗黴菌藥物(9 條)

可選段落:summary、mechanisms、polyenes、amphotericin-b(H3)、nystatin(H3)、azoles、echinocandins、dermatophyte-drugs、nursing

### b01 → summary   (信心:高 42.3 重點摘要;備選:mechanisms 18.8、echinocandins 7.8、nursing 2.6)  <!--h:bd33e8-->
> - 黴菌是真核生物，細胞膜含**麥角固醇**；細胞壁成分是**葡聚醣與幾丁質**，**不是胜肽聚糖**。

### b02 → summary   (信心:中 43.7 重點摘要;備選:mechanisms 33.4、echinocandins 12.1、nursing 10.7)  <!--h:2a1fa5-->
> - **azole** 類：**抑制細胞膜生成**(抑制麥角固醇合成)；**amphotericin B** 主要標的是**細胞膜**；**caspofungin 抑制細胞壁**生成。

### b03 → mechanisms   (信心:高 11.5 抗黴菌藥物作用部位;備選:summary 4.6、azoles 1.2、nursing 1.2)  <!--h:c81027-->
> - 與麥角固醇有關：**polyenes 及 azoles**。

### b04 → azoles   (信心:高 23.6 唑類;備選:echinocandins 16.7、mechanisms 5.4、summary 5.0)  <!--h:0deba5-->
> - **fluconazole 不適合**治療**克魯斯念珠菌**(天然抗藥)。

### b05 → nystatin   (信心:中 28.0 Nystatin;備選:nursing 21.6、summary 19.3、azoles 5.6)  <!--h:4b4761-->
> - **nystatin(Mycostatin)**：治療**白色念珠菌**，**含漱後吞服**，不是治療細菌感染；口腔念珠菌感染的含漱液首選 nystatin。

### b06 → nystatin   (信心:高 16.2 Nystatin;備選:summary 2.4、mechanisms 2.4、nursing 2.4)  <!--h:31ea84-->
> - nystatin 100,000 units/mL，給 250,000 units ＝ **2.5 mL**。

### b07 → nystatin   (信心:高 29.0 Nystatin;備選:azoles 1.4、nursing 1.4)  <!--h:098a74-->
> - 陰道栓劑推入深度不是 2 公分，要沿後壁推到約一個食指長。

### b08 → nursing   (信心:高 28.1 護理重點與衛教;備選:nystatin 11.4、azoles 5.7、summary 2.8)  <!--h:f7739b-->
> - 吸入型類固醇用後要**漱口**，避免口咽念珠菌感染。

### b09 → azoles   (信心:高 27.0 唑類;備選:mechanisms 6.9、nursing 4.5、summary 4.1)  <!--h:30e0c4-->
> - ketoconazole 是酵素**抑制**劑；最強的酵素誘導劑是 phenobarbital、rifampin。

## antiparasitics 抗寄生蟲藥物(11 條)

可選段落:summary、overview、antimalarials、antiprotozoals、anthelmintics、scabicides、nursing

### b01 → antimalarials   (信心:中 13.2 抗瘧疾藥物;備選:summary 10.0、overview 4.2、nursing 3.0)  <!--h:7da9e1-->
> - **primaquine** 對瘧疾的**紅血球外組織期(肝臟)**有效。

### b02 → summary   (信心:中 17.4 重點摘要;備選:antimalarials 15.3、overview 5.1、nursing 5.1)  <!--h:a640d4-->
> - 前往 **chloroquine 抗藥**地區，預防用 **mefloquine**。

### b03 → overview   (信心:高 19.5 寄生蟲與藥物總表;備選:antimalarials 9.1、antiprotozoals 9.1、summary 0.7)  <!--h:dd0a65-->
> - **pyrimethamine＋磺胺藥**治療**弓漿蟲**。

### b04 → overview   (信心:中 12.6 寄生蟲與藥物總表;備選:anthelmintics 12.6、summary 6.6、antiprotozoals 5.0)  <!--h:a5a1e2-->
> - **ivermectin** 是**蟠尾絲蟲(河盲症)**的首選、副作用最小。

### b05 → anthelmintics   (信心:高 26.3 驅蟲藥;備選:overview 13.8、summary 3.6、scabicides 1.2)  <!--h:e1d968-->
> - **中華肝吸蟲**：生食**淡水魚**感染，**有藥可治**(praziquantel)。

### b06 → antiprotozoals   (信心:高 20.9 抗原蟲藥物;備選:summary 13.0、overview 8.4、nursing 8.2)  <!--h:70b658-->
> - **metronidazole** 治療陰道滴蟲：**服藥期間不可飲酒**；**性伴侶一起治療**，不是無效後才治療；不需陰道沖洗。

### b07 → antimalarials   (信心:高 35.5 抗瘧疾藥物;備選:summary 24.4、nursing 19.6、scabicides 5.8)  <!--h:cba9bc-->
> - **chloroquine** 的視網膜病變停藥後**仍可能出現**；抗瘧藥(hydroxychloroquine)要定期檢查**眼睛**，**不是聽力**。

### b08 → anthelmintics   (信心:中 13.0 驅蟲藥;備選:summary 10.9、nursing 8.2、antimalarials 2.2)  <!--h:b7ec8a-->
> - 驅蟲劑**空腹**服用，不是飯後。

### b09 → scabicides   (信心:高 78.7 疥瘡與頭蝨用藥;備選:overview 12.7、summary 10.2、nursing 8.9)  <!--h:a15e90-->
> - **疥瘡**：benzyl benzoate 塗抹、**待乾再塗一次**、**24 小時後沖掉**、每晚或隔晚共 3 次；**晚上**塗藥；crotamiton 不塗頭臉；lindane 有**神經毒性**、不可每天使用。

### b10 → scabicides   (信心:高 44.9 疥瘡與頭蝨用藥;備選:summary 19.6、nursing 19.2、anthelmintics 8.9)  <!--h:4b8006-->
> - 疥瘡照護：**接觸隔離**(手套＋隔離衣)、家人同時治療、衣物 **60℃ 以上熱水 10 分鐘**或烘乾機、無法清洗者密封 **2 週**；抗疥藥要塗**全身**，不只是紅斑處。

### b11 → scabicides   (信心:高 28.9 疥瘡與頭蝨用藥;備選:antimalarials 6.9、summary 3.3、nursing 3.3)  <!--h:f71c06-->
> - 疥蟲離開人體**不會存活 2–3 週**；接觸後約 **4 週**才出現症狀；寵物的疥蟲也可能傳給人。

## antituberculars 抗結核藥物(8 條)

可選段落:summary、principles、standard-regimen(H3)、first-line、rifampin-interactions(H3)、drug-resistant、ltbi、leprosy-drugs、nursing

### b01 → drug-resistant   (信心:高 30.4 抗藥性結核;備選:principles 13.8、summary 8.7、first-line 5.1)  <!--h:e52e24-->
> - **MDR-TB**：對 **isoniazid 與 rifampin** 同時抗藥；以**進階都治**監控。

### b02 → rifampin-interactions   (信心:中 32.1 Rifampin 的交互作用;備選:first-line 30.3、nursing 14.5、ltbi 10.7)  <!--h:84260f-->
> - **rifampin**：尿液**橘紅色**；抑制 **RNA 聚合酶**；會**降低**蛋白酶抑制劑(愛滋藥)與避孕藥效果。

### b03 → first-line   (信心:高 31.9 第一線藥物;備選:summary 16.5、nursing 14.1)  <!--h:2a5c79-->
> - **ethambutol**：**視力模糊、紅綠色盲**；**不需監測肝功能**。

### b04 → first-line   (信心:高 49.0 第一線藥物;備選:summary 8.2、drug-resistant 5.1、rifampin-interactions 4.8)  <!--h:d720df-->
> - **isoniazid**：作用在細胞壁分枝菌酸(**不是**干擾蛋白質合成)；副作用**肝毒性、周邊神經病變**，主要經肝臟代謝。

### b05 → nursing   (信心:中 21.9 護理重點與衛教;備選:principles 20.9、first-line 14.5、summary 10.2)  <!--h:a4b5bd-->
> - 結核治療**多藥合併**(不是單一抗生素)；**完成整個療程**才停藥；**青黴素不是**結核第一線藥。

### b06 → ltbi   (信心:高 27.4 潛伏結核感染治療;備選:principles 6.2、standard-regimen 3.9、summary 2.2)  <!--h:1a0e3e-->
> - 潛伏結核短程處方 **3HP**：**每週一次、12 劑、3 個月**。

### b07 → ltbi   (信心:高 29.9 潛伏結核感染治療;備選:drug-resistant 3.8、rifampin-interactions 3.1、first-line 1.4)  <!--h:ced498-->
> - 使用 **infliximab**(TNF-α 抑制劑)最容易使潛伏結核復發。

### b08 → nursing   (信心:高 35.7 護理重點與衛教;備選:summary 6.4、principles 6.4、drug-resistant 2.7)  <!--h:7e42cb-->
> - 病人無法規則服藥：請**照顧者監督定時服藥**(都治精神)。

## antivirals 抗病毒藥物(10 條)

可選段落:summary、overview、anti-herpes、anti-influenza、anti-rsv、anti-hbv、anti-hcv、interferon、anti-covid、nursing

### b01 → summary   (信心:中 12.9 重點摘要;備選:anti-hbv 11.7、overview 10.1、anti-influenza 6.9)  <!--h:bdc8d5-->
> - 抗病毒藥：**專一性低、易傷宿主細胞**；發展比抗菌藥慢、也會產生抗藥性。

### b02 → anti-influenza   (信心:高 36.2 抗流感病毒藥物;備選:overview 25.0、summary 22.0、nursing 8.7)  <!--h:9e7302-->
> - **神經胺酸酶抑制劑**(oseltamivir、zanamivir)用於**流感**，**不能**用於 HIV。

### b03 → anti-influenza   (信心:高 10.8 抗流感病毒藥物;備選:overview 7.3、nursing 4.8、summary 1.8)  <!--h:e8dd7c-->
> - **zanamivir 可治 A、B 型流感**；流感病毒是**分成八段的負股 RNA**。

### b04 → anti-influenza   (信心:高 19.8 抗流感病毒藥物;備選:overview 4.4、anti-rsv 3.8、interferon 3.1)  <!--h:da9b5b-->
> - H1N1 新型流感原本是**豬**流感；治療藥為 Tamiflu、Relenza；病原是 A 型流感病毒(不是「H 型」)。

### b05 → anti-herpes   (信心:高 23.0 抗疱疹病毒藥物;備選:overview 10.9、anti-rsv 7.1、summary 4.9)  <!--h:df868a-->
> - **foscarnet**：CMV 視網膜炎與**對 acyclovir 無效**的疱疹；CMV 不是用 Zovirax(acyclovir)治療。

### b06 → anti-hbv   (信心:高 13.8 抗 B 型肝炎病毒藥物;備選:summary 2.9、overview 2.9、anti-influenza 1.3)  <!--h:b06a4b-->
> - **adefovir** 不用於 HIV(是 B 肝藥)。

### b07 → anti-hbv   (信心:高 49.1 抗 B 型肝炎病毒藥物;備選:summary 4.2、anti-influenza 4.2、nursing 4.2)  <!--h:01d475-->
> - B 肝用**干擾素 α**；化療前 HBsAg 陽性要用 **lamivudine** 等預防 B 肝發作；母親 HBsAg、HBeAg 陽性，新生兒 24 小時內打 **HBIG**。

### b08 → interferon   (信心:高 28.2 干擾素;備選:summary 18.0、anti-influenza 11.8、anti-hbv 6.9)  <!--h:565fdd-->
> - **干擾素**最常見副作用：**類流感症狀**。

### b09 → overview   (信心:高 25.3 抗病毒藥物概論;備選:anti-hbv 7.9、anti-hcv 7.9、anti-herpes 7.0)  <!--h:da8f03-->
> - **輪狀病毒、腺病毒**沒有特定抗病毒藥可以治療；病毒性腦膜炎採症狀療法。

### b10 → anti-hcv   (信心:中 23.0 抗 C 型肝炎病毒藥物;備選:anti-rsv 18.4、overview 5.8、anti-influenza 5.5)  <!--h:0c425b-->
> - ribavirin **不可以靜脈推注**；吸入 ribavirin 可治 RSV；RSV 不是罕見病毒。

## atypical-bacteria 特殊病原菌(11 條)

可選段落:overview、spirochetes、borrelia-burgdorferi(H3)、borrelia-recurrentis(H3)、leptospira(H3)、mycoplasma-pneumoniae、rickettsiae、orientia-tsutsugamushi(H3)、rickettsia-typhi(H3)、rickettsia-prowazekii(H3)、rickettsia-rickettsii(H3)、coxiella-burnetii(H3)、chlamydiae、chlamydia-trachomatis(H3)、chlamydophila-pneumoniae(H3)、chlamydophila-psittaci(H3)

### b01 → mycoplasma-pneumoniae   (信心:高 96.6 肺炎黴漿菌 Mycoplasma pneumoniae;備選:overview 46.7、chlamydiae 13.3、rickettsiae 13.3)  <!--h:bdfc4f-->
> - **肺炎黴漿菌**：**缺乏細胞壁**，**青黴素無效**；細胞膜含**固醇**；荷包蛋狀菌落；**不是**絕對細胞內寄生；**沒有疫苗**。

### b02 → mycoplasma-pneumoniae   (信心:高 123.3 肺炎黴漿菌 Mycoplasma pneumoniae;備選:overview 14.4、chlamydia-trachomatis 11.4、leptospira 7.4)  <!--h:c89af4-->
> - **黴漿菌肺炎**：學童、**輕微發燒 < 39℃**、**持續乾咳**、**間質性浸潤**、家人也有類似症狀；**傳染性並不低**；白血球可能正常、**血清抗體上升**；用 **erythromycin 或 azithromycin**(抑制蛋白質合成)。

### b03 → mycoplasma-pneumoniae   (信心:高 45.4 肺炎黴漿菌 Mycoplasma pneumoniae;備選:overview 15.0、chlamydia-trachomatis 9.1、chlamydophila-pneumoniae 6.7)  <!--h:853909-->
> - 細菌性肺炎最常見致病原**不是**黴漿菌；社區型急性肺炎最常由**鏈球菌**引起。

### b04 → leptospira   (信心:中 32.2 鉤端螺旋體 Leptospira;備選:mycoplasma-pneumoniae 25.3、overview 23.0、chlamydophila-pneumoniae 18.2)  <!--h:e2503e-->
> - 非典型肺炎的病原：黴漿菌、**退伍軍人菌**、**肺炎披衣菌**；**李斯特菌**不是。

### b05 → borrelia-burgdorferi   (信心:高 109.9 伯氏疏螺旋體 Borrelia burgdorferi(萊姆病);備選:overview 54.0、borrelia-recurrentis 23.7、leptospira 8.5)  <!--h:0a1c6e-->
> - **萊姆病**：**伯氏疏螺旋體**、**硬蜱**傳播(不是蚊子、不是體蝨)，叮咬處**遊走性紅斑**(不是全身性丘疹)，未治療可引發神經症狀與關節炎，血清學檢驗。

### b06 → borrelia-recurrentis   (信心:高 68.0 回歸熱疏螺旋體 Borrelia recurrentis;備選:overview 40.4、rickettsia-prowazekii 11.0、borrelia-burgdorferi 10.3)  <!--h:b950d5-->
> - **疏螺旋體**另造成**回歸熱**，經**體蝨**傳播；反覆發燒是因**抗原變異**。

### b07 → orientia-tsutsugamushi   (信心:高 115.6 恙蟲病東方體 Orientia tsutsugamushi(恙蟲病);備選:overview 52.9、rickettsia-typhi 30.2、mycoplasma-pneumoniae 18.3)  <!--h:a32c35-->
> - **恙蟲病**(叢林型斑疹傷寒)：病原是**恙蟲病東方體**，**不是**立氏立克次體；**恙蟎**叮咬；潛伏期約 10–12 天；發燒、頭痛、肌肉痛、淋巴結腫大。恙蟎可傳播**斑疹傷寒**。

### b08 → overview   (信心:中 36.9 總覽比較表;備選:rickettsiae 29.9、mycoplasma-pneumoniae 27.9、chlamydiae 15.3)  <!--h:b1198d-->
> - **立克次體**與病毒相似：**絕對細胞內寄生**；立克次體感染**不是**性傳染病。

### b09 → chlamydiae   (信心:中 52.1 披衣菌 Chlamydia;備選:overview 51.2、chlamydophila-pneumoniae 39.9、chlamydia-trachomatis 35.1)  <!--h:7dd9a2-->
> - **披衣菌**：**絕對細胞內寄生**；**原質小體具感染力**、網狀小體複製；採檢要**含細胞**；**砂眼**不靠節肢動物；肺炎披衣菌感染細胞**會**形成包涵體、可能導致動脈硬化、**不經水傳播**。

### b10 → overview   (信心:高 37.7 總覽比較表;備選:rickettsia-typhi 13.6、borrelia-burgdorferi 6.9、borrelia-recurrentis 5.7)  <!--h:28c0b5-->
> - 可**直接人傳人**的是**梅毒螺旋體**，不是法蘭西氏菌、巴東氏菌、包氏螺旋體。

### b11 → rickettsia-typhi   (信心:高 35.4 地方性與流行性斑疹傷寒 Rickettsia typhi、Rickettsia prowazekii;備選:overview 20.8、rickettsia-prowazekii 18.2、orientia-tsutsugamushi 9.2)  <!--h:a3e454-->
> - 病媒蚊傳播的是黃熱病、瘧疾、茲卡；**流行性斑疹傷寒**靠體蝨、**炭疽病**不是病媒傳染。

## beta-lactams β-內醯胺類抗生素(9 條)

可選段落:summary、mechanism、resistance(H3)、agents、penicillins(H3)、cephalosporins(H3)、carbapenems(H3)、indications、pharmacokinetics、adverse-effects、cross-reactivity(H3)、skin-test、interactions、nursing

### b01 → summary   (信心:中 26.5 重點摘要;備選:mechanism 21.6、resistance 6.4、interactions 6.4)  <!--h:71dd35-->
> - 機轉：**抑制細胞壁合成**、殺菌；**黴漿菌沒有細胞壁**，青黴素無效。

### b02 → resistance   (信心:高 30.1 抗藥機轉;備選:summary 17.9、mechanism 12.4、carbapenems 12.3)  <!--h:d78216-->
> - 青黴素抗藥：**β-內醯胺酶**；**MRSA**：青黴素結合蛋白改變(不是產生 β-內醯胺酶)。

### b03 → indications   (信心:中 35.9 適應症;備選:penicillins 33.2、summary 17.0、adverse-effects 10.2)  <!--h:57acb1-->
> - **A 族鏈球菌**首選 **penicillin**；**猩紅熱**用青黴素後約 24 小時退燒；**梅毒**用青黴素。

### b04 → penicillins   (信心:高 41.7 青黴素類;備選:indications 25.0、resistance 12.5、cephalosporins 10.6)  <!--h:f083ec-->
> - **cloxacillin** 不易被葡萄球菌青黴素酶破壞；**piperacillin** 可治綠膿桿菌。

### b05 → indications   (信心:中 19.0 適應症;備選:adverse-effects 17.1、pharmacokinetics 8.9、summary 8.6)  <!--h:4f7819-->
> - amoxicillin 屬 β-lactam、殺菌、常見副作用腹瀉，**可以**與 clavulanate 併用(不是禁止)。

### b06 → indications   (信心:高 27.8 適應症;備選:penicillins 17.0、carbapenems 3.9、adverse-effects 3.9)  <!--h:eedca9-->
> - 幽門桿菌三合一療法：omeprazole＋clarithromycin＋amoxicillin(不含 erythromycin)。

### b07 → indications   (信心:高 15.1 適應症;備選:penicillins 8.9、pharmacokinetics 7.9、cephalosporins 4.5)  <!--h:51a3de-->
> - 新生兒感染較安全：**penicillin G**。

### b08 → skin-test   (信心:高 39.7 皮膚試驗;備選:adverse-effects 14.4、carbapenems 6.2、cross-reactivity 6.2)  <!--h:2c8d15-->
> - 青黴素過敏屬於**抗體**(IgE)媒介；皮試後**不可按摩**；水腫病人可改在**前胸鎖骨下方**做皮試。

### b09 → pharmacokinetics   (信心:高 18.3 藥動重點;備選:nursing 4.7、penicillins 2.7、indications 2.7)  <!--h:471000-->
> - 稀釋後的 penicillin G 要**冷藏**。

## candida 念珠菌(10 條)

可選段落:candida-albicans、diseases、non-albicans-candida、treatment

### b01 → diseases   (信心:高 25.1 念珠菌引起的疾病;備選:treatment 14.6、candida-albicans 10.0、non-albicans-candida 6.9)  <!--h:fc489f-->
> - **口腔內最常見的真菌感染**是**念珠菌**；吸入型類固醇用後要**漱口**避免念珠菌感染。

### b02 → candida-albicans   (信心:中 34.2 白色念珠菌 Candida albicans;備選:diseases 30.6、non-albicans-candida 5.8、treatment 3.1)  <!--h:0f0f6a-->
> - 白色念珠菌：**正常菌叢**、常見口腔與陰道黏膜感染、**酵母菌型態**、會形成**萌芽管**；**不是**最常造成真菌性腦膜炎的真菌。

### b03 → candida-albicans   (信心:高 29.4 白色念珠菌 Candida albicans;備選:non-albicans-candida 11.3、diseases 3.6、treatment 1.4)  <!--h:959e8f-->
> - 會產生**萌芽管**：**白色念珠菌**(光滑、克魯斯、熱帶念珠菌不會)。

### b04 → candida-albicans   (信心:高 44.4 白色念珠菌 Candida albicans;備選:diseases 9.1、non-albicans-candida 6.9、treatment 2.5)  <!--h:fbd844-->
> - 白色念珠菌是**二倍體**；呈色培養基中為**綠色**、可鑑定混合感染，但**不能**測藥物感受性。

### b05 → candida-albicans   (信心:高 22.0 白色念珠菌 Candida albicans;備選:diseases 2.7)  <!--h:2bb88d-->
> - 致病因子：黏附、蛋白酶、表現型轉換；**合成黑色素不是**。

### b06 → candida-albicans   (信心:高 15.1 白色念珠菌 Candida albicans;備選:diseases 3.9、non-albicans-candida 2.8、treatment 1.4)  <!--h:b9738a-->
> - 在**尿道**發現念珠菌表示已受感染。

### b07 → diseases   (信心:高 35.5 念珠菌引起的疾病;備選:treatment 3.6、candida-albicans 2.8、non-albicans-candida 2.8)  <!--h:a82fc2-->
> - **擴散性念珠菌症**：**惡性血液疾病並持續使用免疫抑制劑**的病人。

### b08 → non-albicans-candida   (信心:高 17.9 非白色念珠菌 Non-albicans Candida;備選:candida-albicans 5.0、diseases 4.5、treatment 3.1)  <!--h:e4f977-->
> - **克魯斯念珠菌**不建議用 fluconazole。

### b09 → diseases   (信心:高 31.0 念珠菌引起的疾病;備選:treatment 9.4、candida-albicans 8.1、non-albicans-candida 3.6)  <!--h:219a98-->
> - 念珠菌陰道炎：治療需停用口服避孕藥、抗生素與類固醇；分泌物濃稠白色乳酪狀。

### b10 → diseases   (信心:高 15.6 念珠菌引起的疾病;備選:treatment 9.9、candida-albicans 4.7、non-albicans-candida 2.8)  <!--h:81a4f7-->
> - 口腔念珠菌感染含漱：**nystatin**，含漱後吞服。

## childhood-infectious-diseases 兒童傳染病(9 條)

可選段落:exanthem-comparison、measles-virus、rubella-virus、congenital-rubella(H3)、mumps-virus、enteroviruses、enterovirus-warning-signs(H3)、enterovirus-care(H3)、other-vpd

### b01 → measles-virus   (信心:中 78.6 麻疹病毒 Measles virus;備選:exanthem-comparison 56.6、rubella-virus 23.3、other-vpd 12.4)  <!--h:d1f024-->
> - 麻疹：**人是唯一傳染窩**；**空氣**傳染；**3C**(咳嗽、鼻炎、結膜炎)＋**柯氏斑點**；疹子由**耳後、臉**往下；**出疹前後 4 天**有傳染力；退疹後**脫屑、色素沉著**；畏光要調暗光線；不用 aspirin；感染後終身免疫。

### b02 → rubella-virus   (信心:中 60.6 德國麻疹病毒 Rubella virus;備選:exanthem-comparison 51.4、measles-virus 10.5、congenital-rubella 9.1)  <!--h:5f6e89-->
> - 德國麻疹：**耳後、枕部淋巴結腫大**；臉部開始的粉紅斑丘疹，**3 天消退**；**不留色素**；年紀越小症狀越輕。

### b03 → congenital-rubella   (信心:高 78.4 先天性德國麻疹症候群;備選:enteroviruses 6.0、exanthem-comparison 4.9、rubella-virus 4.9)  <!--h:7cd8e0-->
> - 先天性德國麻疹：**第一孕期**感染 → **白內障、耳聾、先天性心臟病**；可經**胎盤**垂直感染；TORCH 不包括麻疹。

### b04 → congenital-rubella   (信心:高 54.4 先天性德國麻疹症候群;備選:exanthem-comparison 7.1、rubella-virus 5.7、enterovirus-care 4.9)  <!--h:7f4e59-->
> - 孕婦德國麻疹 **IgG 陰性**：最優先衛教；**懷孕中不可接種**(活性減毒)，**產後**接種；第一孕期避免接觸病人。

### b05 → mumps-virus   (信心:高 71.4 腮腺炎病毒 Mumps virus;備選:enteroviruses 21.1、measles-virus 12.7、exanthem-comparison 9.5)  <!--h:cd196d-->
> - 腮腺炎：**不會出疹**；最常見併發症**無菌性腦膜炎**；**避免酸性食物**；腮腺腫大起飛沫隔離約 9 天；不需腸道隔離、非病媒傳染。

### b06 → enterovirus-care   (信心:中 72.2 預防與照護;備選:enteroviruses 51.9、measles-virus 26.1、other-vpd 19.3)  <!--h:88a438-->
> - 腸病毒：**RNA** 病毒；糞口、飛沫、接觸；**發病前就有傳染力，發病後 1 週最強**；成人無症狀也會傳染；可重複感染；重症以 **71 型**為主；舊答案是「除小兒麻痺外尚無疫苗」(2023 年起有自費 71 型疫苗)，預防以**勤洗手**最重要；**酒精無效**，用漂白水；是國小校園最常見的傳染病，請假人數異常增加時要優先處理。

### b07 → enterovirus-warning-signs   (信心:高 54.5 重症前兆;備選:enteroviruses 15.1、measles-virus 5.2、exanthem-comparison 4.1)  <!--h:e21643-->
> - 腸病毒重症前兆：**嗜睡意識不清、肌躍型抽搐、持續嘔吐、呼吸急促或心跳加快**；持續 38°C 發燒不是。

### b08 → exanthem-comparison   (信心:高 28.2 出疹性疾病比較;備選:measles-virus 5.6、other-vpd 4.0、rubella-virus 3.3)  <!--h:4823c4-->
> - 嬰兒玫瑰疹：6 個月–2 歲、**高燒 3–5 天退燒後出疹**、HHV-6、熱痙攣；**不癢**。

### b09 → exanthem-comparison   (信心:高 20.3 出疹性疾病比較;備選:other-vpd 11.1、enterovirus-care 1.4)  <!--h:9d5b08-->
> - 水痘：各期皮疹並存、向心分布；**全部結痂才返校**。

## clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌(9 條)

可選段落:comparison、clostridium-botulinum、clostridium-tetani

### b01 → clostridium-botulinum   (信心:中 28.3 肉毒桿菌 Clostridium botulinum;備選:comparison 20.3、clostridium-tetani 2.8)  <!--h:da04d6-->
> - **肉毒桿菌毒素**：**神經毒素**，攻擊**神經細胞**；破壞 **SNARE 蛋白**、阻斷**乙醯膽鹼釋放** → 弛緩性麻痺；美容除皺同一機轉。

### b02 → clostridium-botulinum   (信心:高 59.3 肉毒桿菌 Clostridium botulinum;備選:comparison 7.8、clostridium-tetani 3.2)  <!--h:5b5d86-->
> - 肉毒桿菌中毒：**罐頭、真空包裝**(香腸、豆乾)、醃漬食品；**複視、眼瞼下垂、視力模糊、吞嚥困難、口乾**；**不發燒**；死因是**呼吸肌麻痺**，不是發炎。

### b03 → clostridium-botulinum   (信心:高 22.9 肉毒桿菌 Clostridium botulinum;備選:comparison 0.7、clostridium-tetani 0.7)  <!--h:d0a0c5-->
> - 毒素**不耐熱**：**100℃ 加熱 10 分鐘**可破壞；罐頭與真空包裝中**仍可存活**(厭氧)。

### b04 → clostridium-botulinum   (信心:高 17.8 肉毒桿菌 Clostridium botulinum;備選:clostridium-tetani 8.5、comparison 3.9)  <!--h:f3842a-->
> - 治療：**抗毒素**、洗胃灌腸；**不是**立即給疫苗；康復後**沒有**免疫力。

### b05 → clostridium-botulinum   (信心:高 22.8 肉毒桿菌 Clostridium botulinum;備選:comparison 4.1、clostridium-tetani 2.3)  <!--h:eb26ed-->
> - 嬰兒肉毒桿菌中毒：**蜂蜜**或奶粉中的芽孢；可從糞便分離出細菌。

### b06 → clostridium-botulinum   (信心:中 7.4 肉毒桿菌 Clostridium botulinum;備選:clostridium-tetani 7.1、comparison 6.7)  <!--h:23df27-->
> - 肉毒桿菌**不經呼吸道**感染；也**不會**造成水瀉或血便。

### b07 → clostridium-botulinum   (信心:高 11.0 肉毒桿菌 Clostridium botulinum;備選:comparison 2.5、clostridium-tetani 2.5)  <!--h:d947bf-->
> - 肉毒桿菌中毒潛伏期 12–72 小時，金黃色葡萄球菌食物中毒 1–6 小時，兩者**不同**。

### b08 → clostridium-tetani   (信心:高 30.4 破傷風桿菌 Clostridium tetani;備選:clostridium-botulinum 9.0、comparison 7.8)  <!--h:ad221c-->
> - 破傷風：**牙關緊閉**、面部痙攣、流汗、心律不整；破傷風桿菌**不在**吞噬細胞內生存；預防需要**免疫球蛋白與疫苗**(依傷口與接種史)。

### b09 → clostridium-tetani   (信心:高 22.8 破傷風桿菌 Clostridium tetani;備選:comparison 3.4、clostridium-botulinum 1.6)  <!--h:2edbf2-->
> - 已完成接種的幼兒被貓咬傷，**不需要**「儘快打破傷風抗毒素」。

## culture-and-sensitivity 微生物培養與感受性試驗(8 條)

可選段落:origin、interpretation、susceptibility(H3)、urine-colony-count(H3)、contamination(H3)、false-negative(H3)、blood-culture、urine-culture、midstream(H3)、catheter-specimen(H3)、sputum-culture、stool、other-specimens、interference、nursing

### b01 → urine-culture   (信心:高 18.1 尿液培養;備選:blood-culture 10.2、nursing 10.1、sputum-culture 9.4)  <!--h:313815-->
> - 可作為**選擇抗生素種類依據**的檢驗：**培養**(血液、尿液)，不是 CRP、ESR、D-dimer。

### b02 → nursing   (信心:高 9.9 護理重點;備選:blood-culture 6.0、false-negative 4.3、sputum-culture 4.3)  <!--h:4437f5-->
> - **先採檢體、再給抗生素**。

### b03 → blood-culture   (信心:高 51.4 血液培養;備選:catheter-specimen 11.0、other-specimens 7.5、origin 6.9)  <!--h:ba2633-->
> - 血液培養：**2 套、不同部位**；**不須禁食**；**瓶口用 70% 酒精**消毒；**空針注入時先厭氧瓶、後需氧瓶**；不可從輸液管路或輸液部位抽血。

### b04 → midstream   (信心:高 48.4 清潔中段尿;備選:stool 28.0、urine-colony-count 18.5、nursing 9.7)  <!--h:53bec7-->
> - 中段尿：先解前段、無菌容器接中段；**30 分鐘內送檢**，否則冷藏；月經期間用**單次導尿**；診斷標準 **≥ 10⁵ CFU/mL**。

### b05 → catheter-specimen   (信心:高 38.9 存留導尿管病人;備選:blood-culture 11.8、interference 11.3、other-specimens 8.5)  <!--h:5c57dc-->
> - 存留導尿管：**夾管 15–30 分鐘 → 消毒採檢口 → 無菌空針抽取**，不可從蓄尿袋取。

### b06 → sputum-culture   (信心:高 58.2 痰液培養;備選:blood-culture 14.5、interference 13.3、other-specimens 11.0)  <!--h:525f2c-->
> - 痰液：清晨、**清水漱口**、不用牙膏；氣切者**抽痰**取檢體；延遲送檢要**冷藏**不可放室溫；結核**至少 2 次、最好 3 次**。

### b07 → stool   (信心:高 21.6 糞便檢體;備選:interference 6.5、nursing 6.5、midstream 4.8)  <!--h:d3a960-->
> - 阿米巴：**保溫、30 分鐘內送檢**；蟯蟲：**早上洗澡前**膠帶採檢。

### b08 → sputum-culture   (信心:高 26.2 痰液培養;備選:nursing 8.3、origin 5.8、urine-culture 3.8)  <!--h:f41085-->
> - 確診肺結核最準確的方法：**痰液培養**。

## dna-viruses DNA 病毒(5 條)

可選段落:overview、adenovirus、poxviruses、variola-virus(H3)、mpox-virus(H3)、molluscum-contagiosum-virus(H3)、parvovirus-b19、jc-virus

### b01 → adenovirus   (信心:中 48.7 腺病毒 Adenovirus;備選:overview 40.1、parvovirus-b19 9.3、molluscum-contagiosum-virus 4.8)  <!--h:c4bd9b-->
> - **腺病毒**：**無套膜**(抵抗乙醚)；結膜炎、呼吸道感染、腸胃炎；**兒童感染居多**；**無特定抗病毒藥物**；在人類**不會增加**癌症機會。

### b02 → overview   (信心:中 10.6 總覽比較表;備選:adenovirus 9.1、parvovirus-b19 2.0、poxviruses 1.4)  <!--h:c47e77-->
> - 不具套膜的是**腺病毒**；單純疱疹、B 肝、流感病毒都有套膜。

### b03 → overview   (信心:中 33.8 總覽比較表;備選:variola-virus 30.6、poxviruses 16.5、molluscum-contagiosum-virus 13.9)  <!--h:5745dd-->
> - **天花**：已被消滅的 **DNA 病毒**；痘病毒雖是 DNA 病毒，**在細胞質複製**；天花與傳染性軟疣只感染人類；可用動物痘病毒製疫苗。

### b04 → mpox-virus   (信心:高 60.6 M 痘病毒 Mpox virus;備選:molluscum-contagiosum-virus 17.5、overview 13.7、variola-virus 8.9)  <!--h:41b53d-->
> - **M 痘**：病原不是天花病毒、**也會人傳人**；**JYNNEOS** 可降低感染機會；**傳染性軟疣不是** M 痘造成；M 痘須 24 小時內通報。

### b05 → overview   (信心:高 33.7 總覽比較表;備選:jc-virus 15.6、parvovirus-b19 3.6、molluscum-contagiosum-virus 3.0)  <!--h:283ae7-->
> - JC 病毒 → 進行性多灶性白質腦病；B 型肝炎病毒可造成細胞**永生化**形成腫瘤。

## fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥(7 條)

可選段落:summary、fluoroquinolones、fq-agents(H3)、fq-adverse(H3)、fq-interactions(H3)、sulfonamides、sulfa-mechanism(H3)、sulfa-uses(H3)、sulfa-adverse(H3)、burn-topicals(H3)、metronidazole、urinary-antiseptics、polymyxins、nursing

### b01 → summary   (信心:高 27.2 重點摘要;備選:fq-agents 17.0、metronidazole 3.5、burn-topicals 3.2)  <!--h:2e7172-->
> - **quinolones** 抑制 **DNA gyrase**，影響 **DNA 複製**。

### b02 → sulfa-adverse   (信心:高 19.4 副作用與禁忌;備選:summary 13.8、metronidazole 9.4、urinary-antiseptics 9.3)  <!--h:ec5973-->
> - **G6PD 缺乏症**：感染時**不可**以磺胺類藥物為首選(會溶血)。

### b03 → sulfa-uses   (信心:高 34.5 用途;備選:sulfonamides 4.4、summary 4.0、sulfa-mechanism 4.0)  <!--h:f9c072-->
> - 磺胺類與 **pyrimethamine** 合用治療**弓漿蟲**。

### b04 → sulfa-adverse   (信心:高 11.8 副作用與禁忌;備選:summary 7.6、metronidazole 4.2、sulfa-mechanism 4.2)  <!--h:81304f-->
> - 新生兒感染不選 sulfamethoxazole(核黃疸)，較安全是 penicillin G。

### b05 → metronidazole   (信心:高 39.8 Metronidazole;備選:nursing 24.6、summary 20.8、urinary-antiseptics 4.0)  <!--h:4b9b47-->
> - metronidazole 治**陰道滴蟲**最有效；服藥期間**不可飲酒**；性伴侶一起治療。

### b06 → burn-topicals   (信心:高 68.0 燒傷外用藥;備選:nursing 28.1、sulfa-adverse 10.3、fq-adverse 5.7)  <!--h:e15576-->
> - 燒傷：**silver sulfadiazine 不影響酸鹼電解質**、注意白血球減少；**silver nitrate 造成低血鈉**(不是高血鈉)；**Sulfamylon** 造成代謝性酸中毒。

### b07 → nursing   (信心:高 34.1 護理重點與衛教;備選:fq-agents 7.1、fq-interactions 3.5、summary 1.5)  <!--h:08d545-->
> - 兒童滴耳藥(ofloxacin)：2 歲把耳廓**向下向後**拉。

## fungi 真菌(11 條)

可選段落:overview、dermatophytes、malassezia、cryptococcus-neoformans、aspergillus、mucorales、pneumocystis-jirovecii、dimorphic-fungi

### b01 → overview   (信心:高 26.2 真菌總論;備選:dermatophytes 4.7、malassezia 4.7、aspergillus 1.7)  <!--h:ab223e-->
> - 黴菌與人類細胞在結構上最大的差別：**細胞壁**；真菌細胞壁**不是**胜肽聚糖。

### b02 → overview   (信心:高 43.8 真菌總論;備選:dermatophytes 6.9、malassezia 4.7、aspergillus 1.7)  <!--h:a0a50d-->
> - 真菌是**真核**、有細胞核、**不行光合作用**、化合異營、可單細胞或多細胞、可有性或無性生殖；細菌皆單細胞，但黴菌**不是**皆多細胞。

### b03 → overview   (信心:高 14.3 真菌總論;備選:cryptococcus-neoformans 2.5、malassezia 0.8、aspergillus 0.8)  <!--h:605333-->
> - 真菌檢體常用 **PAS 染色**。

### b04 → overview   (信心:高 35.2 真菌總論;備選:aspergillus 23.6、dimorphic-fungi 5.6、pneumocystis-jirovecii 4.5)  <!--h:82fabe-->
> - 全身性真菌病最常經**吸入分生孢子**感染；麴菌常經**呼吸道**感染。

### b05 → dermatophytes   (信心:中 33.2 皮癬菌 Dermatophytes;備選:overview 28.2、malassezia 3.4、aspergillus 3.2)  <!--h:b16ed0-->
> - **足癬**是**皮膚性**黴菌病(不是表淺性)；是黴菌感染、穿不透氣鞋襪引起、可灑滑石粉保持乾燥。

### b06 → dermatophytes   (信心:高 38.3 皮癬菌 Dermatophytes;備選:overview 13.1、cryptococcus-neoformans 7.4、malassezia 3.5)  <!--h:9b6a37-->
> - 皮癬菌是表皮癬菌、毛髮癬菌、小芽孢菌；**隱球菌、絲孢酵母菌不是**。

### b07 → malassezia   (信心:高 37.0 馬拉色氏菌 Malassezia;備選:overview 13.7、mucorales 3.0、dermatophytes 2.1)  <!--h:2444fa-->
> - **花斑癬**：馬拉色氏菌是**嗜脂性**黴菌、健康人皮膚也有、**會形成菌絲**。

### b08 → cryptococcus-neoformans   (信心:高 62.0 新型隱球菌 Cryptococcus neoformans;備選:overview 10.3、dermatophytes 4.2、mucorales 3.3)  <!--h:87f2c5-->
> - **新型隱球菌**：**鴿糞**、有**莢膜**、黴菌性腦膜炎；**不只**感染免疫缺失者；快速診斷偵測**莢膜多醣體抗原**。

### b09 → aspergillus   (信心:高 37.8 麴菌 Aspergillus;備選:overview 6.5、cryptococcus-neoformans 4.0、pneumocystis-jirovecii 1.8)  <!--h:27dd26-->
> - 已治癒肺結核病人可移動的**真菌球** → **麴菌**；麴菌毒性與**葉酸酶**無關。

### b10 → mucorales   (信心:高 34.6 毛黴菌 Mucorales;備選:dermatophytes 11.2、cryptococcus-neoformans 6.8、pneumocystis-jirovecii 2.3)  <!--h:5eef08-->
> - **鼻腦接合菌症**主要發生在**糖尿病**病人。

### b11 → pneumocystis-jirovecii   (信心:高 74.0 肺囊蟲 Pneumocystis jirovecii;備選:cryptococcus-neoformans 11.7、overview 8.5、dermatophytes 1.7)  <!--h:c07d6e-->
> - **肺囊蟲肺炎**：愛滋病人最常見的伺機性感染、初期**乾咳**、肺泡內**泡沫狀嗜酸性物質**。

## glycopeptides 醣胜肽類與其他抗 MRSA 藥物(8 條)

可選段落:summary、mechanism、agents、indications、monitoring、adverse-effects、interactions、nursing

### b01 → indications   (信心:高 27.7 適應症;備選:mechanism 8.8、summary 5.6、agents 5.3)  <!--h:51eed3-->
> - 金黃色葡萄球菌**院內感染**(MRSA)最可能有效：**vancomycin**。

### b02 → mechanism   (信心:中 23.5 作用機轉;備選:summary 22.7、adverse-effects 4.5、agents 3.7)  <!--h:a54acb-->
> - vancomycin 作用在**細胞壁**，**不作用在核糖體**。

### b03 → mechanism   (信心:高 23.6 作用機轉;備選:summary 4.4、indications 3.1、adverse-effects 2.8)  <!--h:649825-->
> - 尿漿菌對 vancomycin 抗藥：**沒有細胞壁**。

### b04 → adverse-effects   (信心:高 18.2 副作用與禁忌;備選:summary 12.8、interactions 8.4、nursing 7.6)  <!--h:0257b7-->
> - 腎功能不良的高齡病人用 vancomycin：注意**耳毒性**(與腎毒性)。

### b05 → agents   (信心:中 14.2 代表藥物;備選:summary 10.4、nursing 9.4、indications 9.3)  <!--h:d882bf-->
> - 困難梭菌腸炎用**口服** vancomycin，**不是靜脈注射**。

### b06 → agents   (信心:高 22.7 代表藥物;備選:adverse-effects 7.8、mechanism 5.6、indications 5.6)  <!--h:93a917-->
> - MRSA **肺炎**不選 **daptomycin**(被表面張力素破壞)。

### b07 → monitoring   (信心:高 28.4 藥動與濃度監測;備選:nursing 5.1、adverse-effects 4.8、summary 1.3)  <!--h:c18b3b-->
> - 兒童劑量超過說明書安全量(例：18 公斤、40 mg/kg/day 上限 720 mg/day，醫囑 240 mg q6h＝960 mg/day)→ **向醫師提出疑問**。

### b08 → nursing   (信心:高 21.5 護理重點與衛教;備選:summary 1.7、mechanism 1.7、agents 1.7)  <!--h:385718-->
> - MRSA 病人：**接觸隔離**(手套、隔離衣)，不需負壓病房或過濾式口罩。

## gram-negative-bacteria 革蘭氏陰性菌(17 條)

可選段落:overview、neisseria、neisseria-meningitidis(H3)、enterobacteriaceae、escherichia-coli(H3)、salmonella(H3)、shigella(H3)、klebsiella-pneumoniae(H3)、proteus-mirabilis(H3)、yersinia-pestis(H3)、non-fermenters、pseudomonas-aeruginosa(H3)、acinetobacter-baumannii(H3)、burkholderia-pseudomallei(H3)、vibrio、vibrio-cholerae(H3)、vibrio-parahaemolyticus(H3)、vibrio-vulnificus(H3)、campylobacter-jejuni、haemophilus、haemophilus-influenzae(H3)、haemophilus-ducreyi(H3)、bordetella-pertussis、legionella-pneumophila、zoonotic、francisella-tularensis(H3)、brucella(H3)、bartonella-henselae(H3)、rat-bite-fever(H3)、pasteurella-multocida(H3)

### b01 → escherichia-coli   (信心:高 53.2 大腸桿菌 Escherichia coli;備選:enterobacteriaceae 29.8、neisseria 19.7、neisseria-meningitidis 17.4)  <!--h:a825b3-->
> - 革蘭氏陰性菌(番紅色)：有**內毒素**、缺少**壁脂酸**、**不產芽孢**；大腸桿菌的**敗血性休克**來自**內毒素**，不是外毒素。

### b02 → escherichia-coli   (信心:高 119.5 大腸桿菌 Escherichia coli;備選:overview 43.4、pseudomonas-aeruginosa 30.2、haemophilus-influenzae 29.7)  <!--h:5e95fa-->
> - **大腸桿菌**：婦女與幼兒**泌尿道感染**、**導尿管相關感染**最常見；**新生兒細菌性腦膜炎**最常見；**糞便污染指標**；各器官伺機性感染的主要細菌。

### b03 → escherichia-coli   (信心:高 74.8 大腸桿菌 Escherichia coli;備選:salmonella 18.3、enterobacteriaceae 14.3、shigella 13.3)  <!--h:702b88-->
> - **腸道出血性大腸桿菌**：未煮熟食物、出血性腹瀉；ETEC 是經食物飲水的旅行者腹瀉；EPEC 沒有志賀毒素。

### b04 → salmonella   (信心:高 81.6 沙門氏菌 Salmonella;備選:overview 16.6、vibrio-parahaemolyticus 16.1、escherichia-coli 15.9)  <!--h:381aea-->
> - **沙門氏菌**：**未煮熟的蛋**；腹瀉、噁心嘔吐、**發燒**；兒童大便含**血絲**；**飲食傳染**；潛伏期 6–72 小時(不是 1–3 小時，也不是 48–96 小時)。

### b05 → shigella   (信心:高 101.7 志賀氏菌 Shigella;備選:overview 45.4、escherichia-coli 29.7、neisseria 17.5)  <!--h:46996c-->
> - **志賀氏菌**：極少量即可感染；**志賀毒素抑制蛋白質合成**；腹瀉後可能併發**關節炎**；**桿菌性痢疾** 24 小時內通報。

### b06 → proteus-mirabilis   (信心:高 73.9 變形桿菌 Proteus mirabilis;備選:overview 21.4、escherichia-coli 14.5、enterobacteriaceae 13.9)  <!--h:94b236-->
> - **變形桿菌**：產生大量**尿素酶**、造成尿道感染，**不是**食物腹瀉的重要病菌。

### b07 → pseudomonas-aeruginosa   (信心:高 73.2 綠膿桿菌 Pseudomonas aeruginosa;備選:overview 36.8、escherichia-coli 13.4、klebsiella-pneumoniae 6.7)  <!--h:0e60b3-->
> - **綠膿桿菌**：**燒燙傷**病人最容易感染；**piperacillin** 可治療；與金黃色葡萄球菌並列院內感染常見菌。

### b08 → vibrio-cholerae   (信心:高 128.0 霍亂弧菌 Vibrio cholerae;備選:salmonella 18.1、shigella 13.9、francisella-tularensis 11.2)  <!--h:a9e44b-->
> - **霍亂**：**不發燒**、細菌**不進入血液**；補充電解質矯正脫水、酸中毒、低血鉀；**tetracycline** 縮短病程；霍亂毒素**不會**讓腸壁細胞穿孔；霍亂是細菌不是病毒。

### b09 → overview   (信心:中 51.1 總覽比較表;備選:vibrio-parahaemolyticus 44.9、vibrio-vulnificus 25.3、pseudomonas-aeruginosa 12.5)  <!--h:cf29ca-->
> - **腸炎弧菌**：**生鮮魚貝類**食物中毒；**創傷弧菌**經**傷口**感染造成敗血症。

### b10 → overview   (信心:中 27.0 總覽比較表;備選:campylobacter-jejuni 27.0、escherichia-coli 7.9、shigella 7.0)  <!--h:788a68-->
> - **空腸曲狀桿菌**：雞肉，併發 **Guillain-Barré 症候群**。

### b11 → neisseria-meningitidis   (信心:高 61.6 腦膜炎雙球菌 Neisseria meningitidis;備選:overview 39.1、haemophilus-influenzae 21.7、neisseria 20.0)  <!--h:cd8318-->
> - **腦膜炎雙球菌**：有莢膜、**飛沫**傳染、出血性皮疹，**不是**人畜共通；**淋病雙球菌沒有疫苗**。

### b12 → haemophilus-influenzae   (信心:高 82.5 流行性感冒嗜血桿菌 Haemophilus influenzae;備選:overview 52.9、haemophilus-ducreyi 46.4、escherichia-coli 19.0)  <!--h:6d55f4-->
> - **流感嗜血桿菌**：**幼童**細菌性腦膜炎的主要致病原(Hib 疫苗普及前)、**會厭炎**(採檢時備妥急救用物，不用壓舌板)；**杜克氏嗜血桿菌**造成**軟性下疳**。

### b13 → bordetella-pertussis   (信心:高 55.7 百日咳桿菌 Bordetella pertussis;備選:overview 15.0、yersinia-pestis 3.9、neisseria-meningitidis 1.1)  <!--h:a73638-->
> - **百日咳**：**黏膜期(卡他期)菌量最高、最具傳染力**。

### b14 → legionella-pneumophila   (信心:高 65.5 退伍軍人菌 Legionella pneumophila;備選:overview 22.8、shigella 2.4、yersinia-pestis 2.4)  <!--h:e5317d-->
> - **退伍軍人病**：**夏末和秋天**；經**水**傳播；龐提亞克熱**比較輕**。

### b15 → francisella-tularensis   (信心:高 73.9 土倫桿菌 Francisella tularensis(兔熱病);備選:brucella 36.3、overview 32.5、bartonella-henselae 24.3)  <!--h:4523a1-->
> - **土倫桿菌**：感染**巨噬細胞**、抑制吞噬體與溶酶體融合；A 型毒性較強。**布氏桿菌病**以**血清抗體**診斷。

### b16 → yersinia-pestis   (信心:高 45.5 鼠疫桿菌 Yersinia pestis;備選:overview 27.8、shigella 16.0、vibrio-cholerae 9.7)  <!--h:5c062e-->
> - **鼠疫**：跳蚤傳播，不是糞口傳播；**第一類**法定傳染病。

### b17 → acinetobacter-baumannii   (信心:中 15.5 鮑氏不動桿菌 Acinetobacter baumannii;備選:overview 12.0、enterobacteriaceae 4.7、vibrio-cholerae 2.8)  <!--h:70614a-->
> - **鮑氏不動桿菌不產孢子**。

## gram-positive-bacteria 革蘭氏陽性菌(7 條)

可選段落:overview、coagulase-negative-staphylococci、enterococcus、corynebacterium-diphtheriae、listeria-monocytogenes、bacillus-anthracis、bacillus-cereus、mycobacterium-leprae

### b01 → enterococcus   (信心:高 19.3 腸球菌 Enterococcus;備選:overview 3.4、listeria-monocytogenes 2.9、coagulase-negative-staphylococci 2.9)  <!--h:33c8c1-->
> - **腸球菌不屬於腸內桿菌科**。

### b02 → overview   (信心:高 32.2 總覽比較表;備選:corynebacterium-diphtheriae 18.7、enterococcus 13.9、bacillus-anthracis 13.9)  <!--h:926e00-->
> - 革蘭氏陽性**桿菌**：**白喉桿菌**、炭疽桿菌、肉毒桿菌；**大腸桿菌、綠膿桿菌、腸炎弧菌、腦膜炎雙球菌**都是革蘭氏陰性。

### b03 → corynebacterium-diphtheriae   (信心:高 65.9 白喉桿菌 Corynebacterium diphtheriae;備選:overview 18.6、mycobacterium-leprae 17.1、bacillus-anthracis 14.8)  <!--h:bfb1bd-->
> - **白喉**：呼吸道症狀外也可造成**皮膚感染**；不是人畜共通；要先治療(抗毒素)，不必等鑑定；感染後**不一定**有保護性免疫；**白喉毒素抑制蛋白質合成**；預防用 **DTP 類毒素疫苗**。

### b04 → listeria-monocytogenes   (信心:高 64.0 李斯特菌 Listeria monocytogenes;備選:overview 21.1、mycobacterium-leprae 8.1、bacillus-anthracis 4.7)  <!--h:46a619-->
> - **李斯特菌**：**未經完全消毒的乳製品**；主要感染孕婦、新生兒、老人與免疫低下者，**不是**主要感染健康人；與**非典型肺炎無關**。

### b05 → bacillus-anthracis   (信心:高 53.0 炭疽桿菌 Bacillus anthracis;備選:overview 21.0、corynebacterium-diphtheriae 12.1、mycobacterium-leprae 6.2)  <!--h:8876e8-->
> - **炭疽桿菌**：很少引發肺炎(吸入型少見但最致命)；莢膜是**蛋白質**不是多醣體；皮膚型致死率**最低**；**不是**蚊子傳播。

### b06 → bacillus-cereus   (信心:高 47.6 蠟樣桿菌 Bacillus cereus;備選:overview 18.3、corynebacterium-diphtheriae 4.9、bacillus-anthracis 4.6)  <!--h:78a1a0-->
> - **蠟樣桿菌**：眼睛感染造成嚴重組織破壞；**不耐熱**腸毒素引發**腹瀉型**(不是嘔吐型)。

### b07 → mycobacterium-leprae   (信心:高 92.4 痲瘋分枝桿菌與漢生病 Mycobacterium leprae;備選:overview 33.6、corynebacterium-diphtheriae 10.7、bacillus-anthracis 4.5)  <!--h:838c32-->
> - **漢生病**：多重藥物合併療法；**無法**人工培養；**痲瘋瘤型**皮膚病變較明顯；不是人畜共通；照護採接觸及呼吸道隔離；病灶感覺喪失。

## helicobacter-pylori 幽門螺旋桿菌(7 條)

可選段落:helicobacter-pylori、transmission、diseases、diagnosis、treatment

### b01 → diseases   (信心:高 25.2 引起的疾病;備選:helicobacter-pylori 9.0、transmission 1.0)  <!--h:e1ad56-->
> - 與**消化性潰瘍**最有關聯的微生物：**幽門螺旋桿菌**；胃癌與幽門桿菌有關(**不是** HPV、CMV、大腸桿菌)。

### b02 → helicobacter-pylori   (信心:高 27.6 病原特性;備選:diagnosis 16.8)  <!--h:2a1aab-->
> - 在胃內定殖的關鍵：**尿素酶**；可用**尿素呼氣試驗**偵測。

### b03 → helicobacter-pylori   (信心:高 17.0 病原特性;備選:diseases 8.6、transmission 1.3)  <!--h:e91dd3-->
> - 幽門桿菌**不是**人畜共通傳染病。

### b04 → diseases   (信心:高 70.6 引起的疾病;備選:helicobacter-pylori 2.5)  <!--h:957b7c-->
> - 與幽門桿菌有關：**B 型慢性胃炎**、**消化性潰瘍**、**急性胃炎**；**A 型**慢性胃炎是自體免疫、會造成惡性貧血；胃食道逆流與它無關。

### b05 → diseases   (信心:高 34.7 引起的疾病;備選:treatment 3.9、helicobacter-pylori 2.2、diagnosis 2.0)  <!--h:20e817-->
> - 胃 **MALT 淋巴瘤**：與慢性胃炎有關、**B 細胞**淋巴瘤、低惡性度，除菌可治療。

### b06 → treatment   (信心:高 23.3 治療;備選:無)  <!--h:4d6d37-->
> - 三合一療法：**omeprazole＋clarithromycin＋amoxicillin**，不含 erythromycin。

### b07 → diseases   (信心:高 15.6 引起的疾病;備選:helicobacter-pylori 1.3)  <!--h:9b89ca-->
> - 幽門桿菌與**食道癌、大腸癌、膽囊炎**無關。

## helminths-ectoparasites 蠕蟲與體外寄生蟲(11 條)

可選段落:overview、nematodes、enterobius-vermicularis(H3)、ascaris-lumbricoides(H3)、hookworm(H3)、trichuris-trichiura(H3)、strongyloides-stercoralis(H3)、toxocara-canis(H3)、angiostrongylus-cantonensis(H3)、trichinella-spiralis(H3)、filariae(H3)、trematodes、clonorchis-sinensis(H3)、paragonimus-westermani(H3)、schistosoma(H3)、cestodes、taenia(H3)、other-cestodes(H3)、ectoparasites、sarcoptes-scabiei(H3)、pediculus(H3)、arthropod-vectors(H3)

### b01 → enterobius-vermicularis   (信心:高 36.1 蟯蟲 Enterobius vermicularis;備選:overview 14.9、other-cestodes 4.4、pediculus 2.5)  <!--h:5b925b-->
> - **蟯蟲**：透明膠帶試驗在**清晨尚未起床時**採檢；兒童常抓屁股。

### b02 → hookworm   (信心:中 19.4 鉤蟲 Hookworm;備選:overview 16.4、schistosoma 9.1、other-cestodes 8.0)  <!--h:ee3ee4-->
> - 赤腳到田裡玩泥巴、**貧血** → **鉤蟲**；鉤蟲成蟲感染最常見**貧血**。

### b03 → toxocara-canis   (信心:中 37.4 犬蛔蟲 Toxocara canis;備選:trichinella-spiralis 28.5、overview 27.4、sarcoptes-scabiei 15.2)  <!--h:b310cb-->
> - **旋毛蟲病**診斷**不需要**糞便檢體；**犬蛔蟲**幼蟲在人體**移行到肝、肺**，糞便找不到蟲卵。

### b04 → angiostrongylus-cantonensis   (信心:中 31.4 廣東住血線蟲 Angiostrongylus cantonensis;備選:overview 24.0、taenia 12.3、schistosoma 12.2)  <!--h:8f79c7-->
> - **廣東住血線蟲**：吃進含幼蟲的**陸螺、蛞蝓**；成蟲**不在**人腦；台灣**有**病例。

### b05 → clonorchis-sinensis   (信心:高 70.7 中華肝吸蟲 Clonorchis sinensis;備選:overview 43.1、other-cestodes 14.1、schistosoma 9.2)  <!--h:8ff0f6-->
> - **中華肝吸蟲**：生食**淡水魚**(鯉科)；與**膽管癌**最有關；台灣仍有病例、有藥可治。

### b06 → schistosoma   (信心:高 45.7 血吸蟲 Schistosoma;備選:overview 30.3、paragonimus-westermani 22.2、other-cestodes 7.5)  <!--h:4ec0b9-->
> - 生食淡水蝦蟹 → **衛氏肺吸蟲**；**游泳癢** → **非人類血吸蟲**；日本血吸蟲不需經肺。

### b07 → taenia   (信心:高 52.0 帶絛蟲 Taenia;備選:overview 27.6、toxocara-canis 12.7、angiostrongylus-cantonensis 12.0)  <!--h:f6af26-->
> - **有鉤絛蟲**幼蟲(囊尾蚴)**會**在人體造成病害、會侵入**腦部**；生食野生動物內臟 → **亞洲絛蟲**。

### b08 → filariae   (信心:中 24.8 絲蟲 Filariae;備選:overview 19.5、arthropod-vectors 2.1)  <!--h:666a74-->
> - 蟠尾絲蟲河盲症首選 **ivermectin**。

### b09 → sarcoptes-scabiei   (信心:高 89.7 人疥蟎 Sarcoptes scabiei;備選:overview 16.5、enterobius-vermicularis 14.2、taenia 12.5)  <!--h:22509c-->
> - **疥瘡**：接觸隔離要戴手套**並穿隔離衣**；家人一併治療；熱水與烘乾機都可用；密封 2 週；抗疥藥要塗**全身**(不只紅斑處)；常見於人口密集機構、**夜間**劇癢；40℃ 殺不死疥蟲；疥蟲離體**不會**活到 2–3 週。

### b10 → arthropod-vectors   (信心:高 107.7 病媒節肢動物 Arthropod vectors;備選:pediculus 36.9、filariae 4.6、sarcoptes-scabiei 3.1)  <!--h:d0c3e4-->
> - 病媒：**萊姆病**是蜱不是蚊子；**登革熱**是斑蚊不是三斑家蚊；**茲卡**是斑蚊不是蜱；**SARS** 不經蚊子；**回歸熱**與**流行性斑疹傷寒**是體蝨。

### b11 → arthropod-vectors   (信心:高 42.2 病媒節肢動物 Arthropod vectors;備選:schistosoma 2.5、overview 2.1、filariae 2.1)  <!--h:a3ede8-->
> - **布氏指數**以**每 100 戶**計算陽性容器數；埃及斑蚊**白天**叮咬。

## herpesviruses 疱疹病毒(9 條)

可選段落:overview、herpes-simplex-virus、varicella-zoster-virus、epstein-barr-virus、cytomegalovirus、human-herpesvirus-6、human-herpesvirus-8

### b01 → varicella-zoster-virus   (信心:中 32.7 水痘帶狀疱疹病毒 Varicella-zoster virus;備選:herpes-simplex-virus 30.5、overview 24.2、cytomegalovirus 5.6)  <!--h:3a9afe-->
> - 潛伏在**神經節神經細胞**：**單純疱疹病毒**、水痘帶狀疱疹病毒(**背根神經節**)；水痘復發時表現為**帶狀疱疹**。

### b02 → herpes-simplex-virus   (信心:高 56.1 單純疱疹病毒 Herpes simplex virus;備選:varicella-zoster-virus 16.0、cytomegalovirus 9.7、overview 9.4)  <!--h:adf613-->
> - 第一型單純疱疹：**容易復發**、潛伏於神經根節；**不是**水痘病毒造成、也**不**多感染會陰部；單純疱疹不會引起帶狀疱疹。

### b03 → herpes-simplex-virus   (信心:高 56.1 單純疱疹病毒 Herpes simplex virus;備選:overview 21.0、varicella-zoster-virus 9.9、cytomegalovirus 5.2)  <!--h:f76ee9-->
> - **疱疹性齦口炎**：HSV-1 初次感染兒童最常見；潰瘍在口腔**前半部**；acyclovir 越早用越好、不擠水泡。

### b04 → herpes-simplex-virus   (信心:高 57.6 單純疱疹病毒 Herpes simplex virus;備選:overview 9.2、cytomegalovirus 7.4、varicella-zoster-virus 4.3)  <!--h:274f14-->
> - 生殖器疱疹：性交傳染、新生兒經陰道感染、**可以哺餵母乳**、有病灶時避免陰道生產；**不會**造成骨盆腔感染。

### b05 → varicella-zoster-virus   (信心:高 65.0 水痘帶狀疱疹病毒 Varicella-zoster virus;備選:overview 11.6、herpes-simplex-virus 9.6、cytomegalovirus 5.1)  <!--h:11cd56-->
> - 水痘：**同一時間可見紅斑、水疱、膿疱**；傳染性極高(疱疹病毒中最小、飛沫與接觸)；隔離採**絕對隔離**(空氣＋接觸)，不是只有接觸隔離；化學治療期間不打水痘疫苗；水痘疫苗**皮下注射**。

### b06 → varicella-zoster-virus   (信心:高 70.9 水痘帶狀疱疹病毒 Varicella-zoster virus;備選:herpes-simplex-virus 14.4、overview 8.2、cytomegalovirus 4.6)  <!--h:633c56-->
> - 帶狀疱疹：沿**皮節**長水疱(不是全身紅疹)、神經痛、淋巴腺腫；衣物**具傳染力**；未得過水痘者避免接觸；痊癒後**不一定**終生免疫；神經痛用 **gabapentin**。

### b07 → epstein-barr-virus   (信心:高 48.0 EB 病毒 Epstein-Barr virus;備選:overview 23.0、varicella-zoster-virus 14.5、cytomegalovirus 7.1)  <!--h:9c2d64-->
> - **EB 病毒**：**鼻咽癌**、傳染性單核球增多症；感染過 EBV **不一定**罹患鼻咽癌；EBV **不**造成嗜伊紅性白血球增多。

### b08 → cytomegalovirus   (信心:高 45.3 巨細胞病毒 Cytomegalovirus;備選:overview 31.3、herpes-simplex-virus 3.6、epstein-barr-virus 2.7)  <!--h:01b604-->
> - **CMV**：輸血與**器官移植**後再活化；新生兒 **IgM** 升高；CMV 視網膜炎用 **foscarnet**、ganciclovir。

### b09 → human-herpesvirus-6   (信心:高 55.3 人類疱疹病毒第 6 型 Human herpesvirus 6;備選:overview 23.2、varicella-zoster-virus 13.3、herpes-simplex-virus 2.8)  <!--h:4690f8-->
> - **嬰兒玫瑰疹**：**燒退後**出疹、由**軀幹**開始、常見**熱性痙攣**、疹子 1–2 天消退；**不需**呼吸道隔離；病原是 HHV-6(不是第 1、2 型)。

## hiv-aids 愛滋病毒感染與愛滋病(12 條)

可選段落:human-immunodeficiency-virus、transmission、stages、diagnosis、opportunistic-infections、art、pep-prep、occupational-exposure(H3)、non-occupational(H3)、vertical-transmission、vaccination、nursing、public-health

### b01 → human-immunodeficiency-virus   (信心:高 63.1 人類免疫缺乏病毒 Human immunodeficiency virus(HIV);備選:art 18.5、stages 13.6、opportunistic-infections 12.0)  <!--h:a491cb-->
> - HIV 以 **gp120** 結合 **CD4**，主要破壞 **CD4 T 細胞** → CD4/CD8 比值**下降**；屬 RNA 反轉錄病毒；潛伏期 CD4 仍會**逐漸減少**。

### b02 → human-immunodeficiency-virus   (信心:高 24.4 人類免疫缺乏病毒 Human immunodeficiency virus(HIV);備選:art 14.0、stages 8.7、vertical-transmission 6.1)  <!--h:4dcd4f-->
> - 抗體**不能**阻止疾病進展；目前**沒有**能預防愛滋的疫苗。

### b03 → opportunistic-infections   (信心:高 119.1 伺機性感染與腫瘤;備選:stages 26.1、vaccination 12.8、vertical-transmission 9.3)  <!--h:3adea8-->
> - **CD4 < 200** 容易發生伺機性感染；**肺囊蟲肺炎最常見**，初期症狀是**乾咳**；**隱球菌**是最常見的中樞神經感染；**卡波西氏肉瘤**是最常見的惡性腫瘤；淋巴腺腫大**不是**伺機性感染。

### b04 → stages   (信心:高 36.2 自然病程與分期;備選:opportunistic-infections 20.9、diagnosis 9.2、human-immunodeficiency-virus 8.2)  <!--h:86274d-->
> - 急性感染(感染後 2–4 週)：發燒、淋巴結腫大等**類感冒症狀**；CD4 650 且抗體陽性 → **潛伏期**。

### b05 → art   (信心:高 69.3 抗愛滋病毒藥物;備選:opportunistic-infections 21.1、vertical-transmission 18.0、human-immunodeficiency-virus 11.9)  <!--h:1876ff-->
> - **AZT** 阻斷病毒**核酸複製**，可用於**預防母子垂直感染**；**rifampin** 降低蛋白酶抑制劑效果；**神經胺酸酶抑制劑**與 **adefovir** 不用於 HIV。

### b06 → art   (信心:高 51.2 抗愛滋病毒藥物;備選:opportunistic-infections 13.2、public-health 7.7、vaccination 6.0)  <!--h:f85fe5-->
> - 雞尾酒療法副作用：心血管疾病、糖尿病、骨質疏鬆，**不是**高密度膽固醇上升。

### b07 → transmission   (信心:高 39.3 傳染途徑;備選:nursing 9.6、vertical-transmission 8.4、public-health 8.2)  <!--h:70d706-->
> - 傳染途徑：性行為、血液、垂直感染；**飲食、共用餐具、親吻臉頰不會傳染**。

### b08 → vertical-transmission   (信心:中 45.5 母子垂直感染;備選:vaccination 44.4、diagnosis 9.7、public-health 9.7)  <!--h:3a80b1-->
> - 垂直感染：孕期完整治療、必要時剖腹產、新生兒口服預防藥；**不哺餵母乳**；新生兒可接種 B 肝、Hib、肺炎鏈球菌疫苗，**不可**接種**卡介苗**與口服沙賓疫苗。

### b09 → occupational-exposure   (信心:高 21.6 職業暴露(針扎)處理;備選:non-occupational 11.6、vertical-transmission 6.5、public-health 6.0)  <!--h:701542-->
> - 針扎：24 小時內(不得晚於 72 小時)開始 PEP；風險 **HBV > HCV > HIV**。

### b10 → nursing   (信心:中 22.3 護理重點;備選:occupational-exposure 19.5、opportunistic-infections 9.7、vertical-transmission 9.7)  <!--h:e472a4-->
> - 血液污染環境**不是**用 1:1000 漂白水；照護不需要單獨房間；針頭**不回套**。

### b11 → nursing   (信心:高 23.2 護理重點;備選:opportunistic-infections 8.7、art 6.6、vaccination 5.2)  <!--h:09b631-->
> - 愛滋病人飲食：高熱量、高蛋白，**不是高纖**；食物煮熟、水煮沸。

### b12 → nursing   (信心:高 51.5 護理重點;備選:diagnosis 20.4、public-health 15.2、vertical-transmission 11.9)  <!--h:de6832-->
> - 醫師依法通報**不違反**保密原則；未經同意不可告知照顧者；**不可強制**篩檢；鼓勵孕婦產檢篩檢屬**次段**預防。

## human-papillomavirus 人類乳突病毒(8 條)

可選段落:human-papillomavirus、types、transmission、condyloma、prevention

### b01 → types   (信心:高 13.4 型別與疾病;備選:transmission 9.1、prevention 5.3、condyloma 4.1)  <!--h:5c8531-->
> - **子宮頸癌**與 **HPV** 最有關係，型別以 **16 型**最重要；陰莖鱗狀細胞癌也與 HPV 有關。

### b02 → condyloma   (信心:中 28.0 尖形濕疣 Condyloma acuminatum;備選:types 24.4、prevention 8.9、transmission 4.6)  <!--h:34de25-->
> - **HPV 6、11 型**是低危險型、造成**尖形濕疣**；**16、18 型**不是造成菜花的型別。

### b03 → types   (信心:高 29.0 型別與疾病;備選:human-papillomavirus 12.7、transmission 11.7、prevention 6.5)  <!--h:631aca-->
> - HPV-16 感染提高**子宮頸癌**與**口咽癌**風險；**E6** 是致癌基因；**傳染性軟疣不是** HPV 造成。

### b04 → human-papillomavirus   (信心:高 10.8 病原特性 Human papillomavirus;備選:types 2.6、transmission 2.6、prevention 2.6)  <!--h:1f3a1d-->
> - 外陰部病灶切片見**空凹細胞** → HPV 感染。

### b05 → transmission   (信心:高 18.5 傳染與危險因子;備選:prevention 8.9、types 3.9、condyloma 1.6)  <!--h:d3595a-->
> - HPV 主要經**性行為**傳染；免疫正常的年輕女性感染後**通常會自行痊癒**。

### b06 → prevention   (信心:高 30.3 預防;備選:types 4.5、transmission 3.5、condyloma 2.2)  <!--h:a64847-->
> - 疫苗對**未曾有性行為**或未感染者最有效；**接種後仍需定期抹片**；不是一劑終生有效；型別不含 30 型。

### b07 → condyloma   (信心:高 23.1 尖形濕疣 Condyloma acuminatum;備選:types 3.8、prevention 1.3)  <!--h:c80cf1-->
> - 尖形濕疣潛伏期約 2 週到 8 個月，治療有雷射、液態氮、藥物。

### b08 → human-papillomavirus   (信心:高 7.9 病原特性 Human papillomavirus;備選:types 2.5)  <!--h:6738b4-->
> - 乳突狀瘤(papilloma)的細胞來源是**上皮細胞**。

## immunization 預防接種(12 條)

可選段落:immunity-types、vaccine-types、childhood-schedule、adult-vaccination、contraindications、vaccine-specific-contraindications(H3)、administration、bcg、influenza-vaccine、cold-chain

### b01 → vaccine-types   (信心:中 26.7 疫苗種類;備選:contraindications 24.5、vaccine-specific-contraindications 22.5、childhood-schedule 15.2)  <!--h:37008e-->
> - **活性減毒**：**麻疹(MMR)**、**沙賓疫苗**；B 肝、百日咳、沙克、狂犬病、破傷風是不活化或類毒素。

### b02 → adult-vaccination   (信心:中 7.0 成人預防接種;備選:contraindications 7.0、vaccine-specific-contraindications 3.4、vaccine-types 2.0)  <!--h:fdd593-->
> - MMR＝**麻疹、腮腺炎、德國麻疹**。

### b03 → administration   (信心:高 46.5 接種途徑與部位;備選:vaccine-specific-contraindications 20.9、contraindications 10.0、childhood-schedule 9.6)  <!--h:86a1fa-->
> - 皮下注射：**麻疹疫苗**、肝素；**MMR、水痘**皮下注射；**HBIG** 肌肉注射於嬰兒**大腿前外側**；1 個月大打 B 肝選**股外側肌**。

### b04 → childhood-schedule   (信心:高 18.3 台灣兒童常規接種時程;備選:vaccine-specific-contraindications 6.3、administration 3.6、contraindications 2.7)  <!--h:b14045-->
> - **HBIG 不是所有嬰兒都要打**。

### b05 → contraindications   (信心:高 39.8 禁忌與注意事項;備選:adult-vaccination 23.8、childhood-schedule 16.4、vaccine-types 15.2)  <!--h:37ebce-->
> - 孕婦**可以**打**流感疫苗**；麻疹、水痘、日本腦炎不行；備孕婦女要打**德國麻疹疫苗**；預計 3 個月內懷孕者不宜打 MMR(國考舊答案，現行為 4 週)。

### b06 → contraindications   (信心:高 32.2 禁忌與注意事項;備選:vaccine-specific-contraindications 17.1、childhood-schedule 11.7、influenza-vaccine 10.5)  <!--h:7b0fbb-->
> - 長期類固醇的腎病症候群兒童可接種**流感疫苗**；化療病童**不宜**接種水痘疫苗。

### b07 → childhood-schedule   (信心:中 18.1 台灣兒童常規接種時程;備選:influenza-vaccine 17.0、vaccine-specific-contraindications 14.5、adult-vaccination 11.7)  <!--h:e4d846-->
> - 嬰兒最早滿 **6 個月**接種流感疫苗；流感疫苗是**不活化**、保護約一年。

### b08 → childhood-schedule   (信心:高 11.2 台灣兒童常規接種時程;備選:adult-vaccination 7.0、vaccine-specific-contraindications 5.1、contraindications 4.5)  <!--h:ff713f-->
> - 國小新生未接種 MMR：**補接種 2 劑**。

### b09 → adult-vaccination   (信心:中 9.5 成人預防接種;備選:vaccine-specific-contraindications 8.0、vaccine-types 7.6、contraindications 7.2)  <!--h:da018c-->
> - 接種麻疹疫苗是**提升宿主免疫力**；老人打流感疫苗是**保護易感宿主**；疫苗屬**初段預防的特殊保護**。

### b10 → immunity-types   (信心:高 11.8 免疫的種類;備選:vaccine-types 5.9、administration 4.7、contraindications 3.5)  <!--h:e08079-->
> - 最快而有效誘發抗體：**加入佐劑**；多次注射後產生的免疫反應**比較快**。

### b11 → vaccine-types   (信心:高 39.6 疫苗種類;備選:vaccine-specific-contraindications 16.6、contraindications 4.8、influenza-vaccine 2.6)  <!--h:215f75-->
> - 沒有疫苗：**C 型肝炎**、梅毒、淋病、愛滋；有疫苗的 RNA 肝炎病毒是 **A 型**。

### b12 → administration   (信心:高 26.0 接種途徑與部位;備選:childhood-schedule 4.4、vaccine-specific-contraindications 3.7、adult-vaccination 1.5)  <!--h:f92bf5-->
> - 接種五合一後讓媽媽**擁抱並給安撫奶嘴**。

## infectious-diarrhea 感染性腹瀉與食物中毒(8 條)

可選段落:types、pathogens、food-poisoning、dehydration、nursing

### b01 → nursing   (信心:高 61.4 護理措施;備選:food-poisoning 6.2、pathogens 3.9、types 3.6)  <!--h:814ea9-->
> - 兒童急性腹瀉：給**口服葡萄糖電解質液**；**不要**泡濃配方奶、不用雞湯取代；可改無乳糖配方；吸附劑不要與食物一起吃。

### b02 → dehydration   (信心:高 30.6 脫水評估;備選:nursing 7.1、types 1.3、pathogens 0.8)  <!--h:31391c-->
> - 脫水：體重下降 **5–10%** 為**中度**(10→9.2 公斤、9→8.3 公斤)；中度脫水有囟門凹陷、黏膜乾燥、脈搏快、少尿。

### b03 → nursing   (信心:高 41.3 護理措施;備選:food-poisoning 3.8、types 3.2、dehydration 1.3)  <!--h:bc6f8f-->
> - 腹瀉護理：補充**鈉、鉀與水分**；**不要限制水分**；注意活動安全與肛門皮膚護理；肛門周圍**不塗類固醇**。

### b04 → dehydration   (信心:高 18.8 脫水評估;備選:types 8.1)  <!--h:ba645b-->
> - 體液容積缺失與**血壓上升**、**白血球**無關。

### b05 → nursing   (信心:高 39.8 護理措施;備選:types 7.2、food-poisoning 3.0、pathogens 2.0)  <!--h:4a2b43-->
> - **loperamide** 是抑制腸蠕動的止瀉藥；**bismuth subsalicylate** 可預防旅行者腹瀉、降低腸道水分分泌；magnesium hydroxide 制酸劑易造成腹瀉。

### b06 → food-poisoning   (信心:高 42.2 食物中毒的處理;備選:nursing 7.3、pathogens 6.1、types 4.3)  <!--h:0cddb2-->
> - 食物中毒：**24 小時內**通報；檢體**冷藏**不是冷凍；**先處理休克與脫水**，不必先確認是何種食物；嚴重度與毒素量**正相關**。

### b07 → food-poisoning   (信心:中 16.0 食物中毒的處理;備選:types 15.4、pathogens 11.4、nursing 3.4)  <!--h:63b6d3-->
> - 葡萄球菌腸毒素食物中毒潛伏期**短**(不是 24 小時以上)，有嘔吐、噁心、腹瀉。

### b08 → keep   (信心:低;備選:pathogens 2.8、types 1.0、nursing 1.0)  <!--h:15d1ac-->
> - 痢疾的傳染途徑是**媒介物傳染**。

## inflammatory-markers 發炎指標(9 條)

可選段落:origin、kinetics(H3)、reference-range、high、crp-high(H3)、esr-high(H3)、pct-high(H3)、lactate-high(H3)、wbc(H3)、low、clinical-use、interference、nursing

### b01 → low   (信心:中 9.4 降低的意義;備選:esr-high 8.6、origin 7.7、wbc 7.1)  <!--h:fa61ff-->
> - 與感染相關的檢驗：**CRP、ESR、白血球**；**α-胎兒蛋白**(AFP)是腫瘤標記，與感染無關。

### b02 → clinical-use   (信心:中 16.3 臨床應用;備選:esr-high 14.3、crp-high 12.8、kinetics 9.1)  <!--h:ac569c-->
> - **急性腎盂腎炎**：**ESR 上升、CRP 上升**；ESR、CRP **不是用來評估腎衰竭**的指標。

### b03 → wbc   (信心:中 10.1 白血球變化;備選:clinical-use 9.7、crp-high 7.5、reference-range 7.3)  <!--h:849ce8-->
> - 診斷敗血症的檢驗：**細菌培養、白血球、CRP**(血糖不是)。

### b04 → kinetics   (信心:中 16.5 上升與下降的速度;備選:origin 11.9、low 9.2、esr-high 7.3)  <!--h:c57e24-->
> - **SLE**：ESR **上升**、補體 C3、C4 **下降**、ANA 陽性。

### b05 → esr-high   (信心:高 36.2 ESR 升高;備選:crp-high 9.2、kinetics 6.3、origin 3.1)  <!--h:a5b71f-->
> - **風濕熱**：ESR 上升；**骨性關節炎**：ESR 正常。

### b06 → esr-high   (信心:高 32.2 ESR 升高;備選:kinetics 8.2、origin 7.8、clinical-use 5.9)  <!--h:6d4b8d-->
> - **川崎氏症**亞急性期：ESR 與**血小板上升**(不是下降)。

### b07 → wbc   (信心:高 33.7 白血球變化;備選:crp-high 4.7、kinetics 4.1、clinical-use 3.8)  <!--h:79efcf-->
> - **重症流感**：**淋巴球減少**，CRP、LDH 上升。

### b08 → clinical-use   (信心:高 28.9 臨床應用;備選:nursing 7.7、esr-high 5.6、origin 3.7)  <!--h:45d6e8-->
> - 選擇抗生素的依據是**培養**，不是 CRP 或 ESR。

### b09 → clinical-use   (信心:高 8.5 臨床應用;備選:crp-high 5.6、esr-high 3.8、kinetics 3.2)  <!--h:498753-->
> - CEA 用來追蹤大腸癌復發，CRP 不是腫瘤標記([[tumor-markers]])。

## microbial-pathogenesis 微生物總論與致病機轉(8 條)

可選段落:classification、bacteria-vs-fungi(H3)、koch-postulates(H3)、bacterial-structure、gram-stain(H3)、surface-structures(H3)、growth(H3)、gene-transfer(H3)、pathogenesis、invasiveness(H3)、toxins(H3)、viruses、virus-structure(H3)、replication(H3)、tropism(H3)、infection-patterns(H3)、virus-transmission(H3)、prions、fungi-parasites-overview、chain-of-infection、chain-links(H3)、infection-stages(H3)、host-defense(H3)、microbial-control

### b01 → gram-stain   (信心:高 71.1 革蘭氏染色;備選:surface-structures 15.8、classification 8.8、bacteria-vs-fungi 8.1)  <!--h:1360ed-->
> - 革蘭氏陽性菌：**紫色**、胜肽聚醣**厚**、有脂壁酸、**沒有脂多醣**、只有它會形成**芽孢**。

### b02 → toxins   (信心:高 52.8 外毒素與內毒素;備選:infection-patterns 10.8、gram-stain 10.4、prions 5.2)  <!--h:ec1a19-->
> - 內毒素是 **G− 的脂多醣**，**細菌死亡後釋出**，會**活化補體、引起發燒與敗血性休克**。

### b03 → toxins   (信心:高 93.3 外毒素與內毒素;備選:invasiveness 14.2、replication 11.0、microbial-control 9.7)  <!--h:ab0ad2-->
> - 白喉毒素**抑制蛋白質合成**；破傷風與肉毒桿菌毒素是**神經毒素**；霍亂毒素使 cAMP 上升造成水瀉，不會讓腸細胞穿孔。

### b04 → gene-transfer   (信心:高 51.6 細菌遺傳與基因轉移;備選:surface-structures 10.4、toxins 8.5、virus-structure 7.5)  <!--h:56ea8c-->
> - 噬菌體傳遞基因＝**導入作用**；肺炎雙球菌實驗證明遺傳物質是 **DNA**。

### b05 → surface-structures   (信心:高 21.1 表面構造與芽孢;備選:invasiveness 7.3、gram-stain 2.2、toxins 2.2)  <!--h:4a0cf4-->
> - 莢膜(多醣)**抵抗吞噬**。

### b06 → replication   (信心:中 36.3 複製步驟;備選:virus-structure 26.8、infection-patterns 16.3、microbial-control 10.0)  <!--h:15fc1b-->
> - **腺病毒**沒有套膜，能抵抗乙醚；病毒一定要借用宿主核糖體**轉譯**。

### b07 → replication   (信心:高 21.8 複製步驟;備選:toxins 5.1、infection-patterns 4.8、virus-transmission 4.8)  <!--h:9286d2-->
> - 病毒複製順序：附著穿入 → 去殼 → 合成 → 組合 → 釋出。

### b08 → koch-postulates   (信心:高 35.3 科霍假說;備選:infection-stages 5.0、gram-stain 2.6、surface-structures 2.6)  <!--h:90d7c5-->
> - 科霍假說不適用於**非感染性疾病**(帕金森氏症)。

## prions 普利昂蛋白(7 條)

可選段落:prion、diseases、clinical、infection-control

### b01 → diseases   (信心:高 14.9 普利昂疾病;備選:prion 7.9、clinical 0.8)  <!--h:16f5d2-->
> - 狂牛病的病原是**普利子蛋白**；最小的人類病原體是**普利昂蛋白**。

### b02 → prion   (信心:高 35.0 病原特性 Prion;備選:diseases 4.4、infection-control 2.2)  <!--h:2c28bb-->
> - 普利昂**不具核酸**、**不引起免疫反應**、**無發炎與發燒**；**不能**用一般消毒滅菌或 100℃ 加熱清除；**潛伏期很長**。

### b03 → prion   (信心:高 9.2 病原特性 Prion;備選:diseases 3.3、clinical 1.1)  <!--h:4187fb-->
> - 病理：大腦**海綿狀轉化**(空泡化)，不是脫髓鞘或腦膿瘍。

### b04 → diseases   (信心:高 15.6 普利昂疾病;備選:clinical 6.4、infection-control 2.7)  <!--h:36f98b-->
> - 可由**污染物或食物**攝入傳播、可經**侵入性醫療器械**傳染；目前**無藥可用**。

### b05 → diseases   (信心:高 27.5 普利昂疾病;備選:prion 6.0、infection-control 3.3、clinical 1.1)  <!--h:ea0688-->
> - 庫賈氏病：**大部分**病人**沒有**暴露於狂牛症；無法用血液檢驗檢出。

### b06 → diseases   (信心:高 36.1 普利昂疾病;備選:prion 10.3、infection-control 3.3)  <!--h:3c3138-->
> - 新型庫賈氏病：與牛海綿狀腦病有關、好發年輕族群、病程較長、以**精神症狀**開始；**不是** Negri 小體突變。

### b07 → infection-control   (信心:高 26.9 感染管制與通報;備選:diseases 3.3、clinical 1.1)  <!--h:d1b3e0-->
> - 庫賈氏病：**第四類**、**1 個月內**通報、遺體火化。

## protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑(9 條)

可選段落:summary、mechanism、tetracyclines、tetracycline-uses(H3)、tetracycline-administration(H3)、tetracycline-adverse(H3)、macrolides、macrolide-uses(H3)、macrolide-adverse(H3)、macrolide-interactions(H3)、chloramphenicol、clindamycin、nursing

### b01 → summary   (信心:高 30.3 重點摘要;備選:macrolide-uses 11.8、mechanism 7.1、macrolide-interactions 6.7)  <!--h:9c4324-->
> - **clarithromycin**：干擾細菌**蛋白質**合成(巨環類，不是青黴素類)。

### b02 → macrolide-uses   (信心:高 30.1 代表藥與用途;備選:summary 15.4、macrolide-interactions 11.5、macrolide-adverse 8.0)  <!--h:e0a019-->
> - **黴漿菌肺炎**：erythromycin 或 **azithromycin**(療程短、副作用少)；**β-lactam 無效**(沒有細胞壁)。

### b03 → macrolide-adverse   (信心:高 27.8 副作用與禁忌;備選:nursing 8.0、summary 6.0、tetracycline-adverse 5.0)  <!--h:8c068b-->
> - 巨環類**最不易**引起**癲癇**；會引起腸胃不適、黃疸、耳毒性。

### b04 → macrolide-interactions   (信心:高 29.3 交互作用;備選:nursing 10.1、chloramphenicol 6.3、macrolide-uses 5.0)  <!--h:605046-->
> - 肝功能異常時會蓄積：**erythromycin**；erythromycin 會升高 **triazolam** 濃度。

### b05 → summary   (信心:中 21.0 重點摘要;備選:tetracycline-adverse 15.9、tetracycline-administration 13.2、nursing 7.2)  <!--h:d5bf7c-->
> - tetracycline **不可與牛奶同服**；服用後**避免曬太陽**。

### b06 → tetracycline-uses   (信心:高 21.0 代表藥與用途;備選:summary 2.6、tetracycline-administration 2.6、tetracycline-adverse 2.6)  <!--h:8c9163-->
> - 霍亂：以**補充液體與電解質**為主，tetracycline 可**縮短病程**；霍亂病人**通常不發燒**。

### b07 → tetracycline-uses   (信心:高 38.7 代表藥與用途;備選:macrolide-uses 5.0、mechanism 3.5、tetracyclines 3.5)  <!--h:f3ac79-->
> - SIADH 使用 demeclocycline(四環素類)是為了**造成腎因性尿崩**，不是預防感染。

### b08 → chloramphenicol   (信心:高 32.2 Chloramphenicol;備選:summary 9.5、nursing 6.2、tetracycline-uses 3.8)  <!--h:4926d2-->
> - 新生兒感染**不選 chloramphenicol**(灰嬰症候群)。

### b09 → macrolide-uses   (信心:高 19.2 代表藥與用途;備選:tetracycline-uses 10.6、macrolide-adverse 4.8、summary 4.6)  <!--h:615521-->
> - 幽門桿菌三合一療法**不含 erythromycin**。

## protozoa 原蟲(8 條)

可選段落:overview、entamoeba-histolytica、giardia-lamblia、trichomonas-vaginalis、toxoplasma-gondii、plasmodium、trypanosoma、leishmania、cryptosporidium、free-living-amoebae

### b01 → entamoeba-histolytica   (信心:高 77.2 痢疾阿米巴 Entamoeba histolytica;備選:overview 13.5、toxoplasma-gondii 8.8、plasmodium 5.4)  <!--h:c078b8-->
> - 大腸**燒瓶狀潰瘍** → **痢疾阿米巴**(吞入被污染的食物或飲水)；腸外阿米巴最常侵犯**肝臟**；精神病院、難民營、擁擠日間照護中心要注意**痢疾阿米巴**。

### b02 → entamoeba-histolytica   (信心:高 54.2 痢疾阿米巴 Entamoeba histolytica;備選:free-living-amoebae 5.0、overview 3.8、toxoplasma-gondii 2.5)  <!--h:745fc3-->
> - 阿米巴糞便檢體：**保持近體溫、30 分鐘內送檢**；採檢前**先排空膀胱**；糞便培養驗不出阿米巴。

### b03 → entamoeba-histolytica   (信心:高 21.4 痢疾阿米巴 Entamoeba histolytica;備選:giardia-lamblia 11.3、overview 7.0、plasmodium 6.9)  <!--h:dfa15a-->
> - 阿米巴原蟲**不是**副傷寒的致病原；鞭毛蟲是寄生蟲病的致病原。

### b04 → trichomonas-vaginalis   (信心:高 120.7 陰道滴蟲 Trichomonas vaginalis;備選:overview 24.6、entamoeba-histolytica 5.8、toxoplasma-gondii 2.9)  <!--h:d21875-->
> - **陰道滴蟲**：**黃綠色泡沫狀有異味**分泌物、子宮頸**草莓狀紅點**；**metronidazole 最有效**、**性伴侶同治**、服藥期間**不可喝酒**、不需陰道沖洗；不是只透過直接接觸、停經後婦女也會感染。

### b05 → toxoplasma-gondii   (信心:高 21.9 弓漿蟲 Toxoplasma gondii;備選:overview 12.9、giardia-lamblia 5.9、plasmodium 4.4)  <!--h:899c34-->
> - 會經**胎盤**造成先天性感染的寄生蟲：**弓蟲**。

### b06 → toxoplasma-gondii   (信心:高 17.3 弓漿蟲 Toxoplasma gondii;備選:overview 9.0)  <!--h:8bf257-->
> - 弓漿蟲用 **pyrimethamine**＋磺胺藥。

### b07 → plasmodium   (信心:中 16.1 瘧原蟲 Plasmodium;備選:overview 14.5、trypanosoma 4.4、toxoplasma-gondii 2.4)  <!--h:9e114b-->
> - 惡性瘧疾：檢查**血液**抹片；瘧疾經**病媒蚊**傳染(同樣經蚊子的還有日本腦炎、登革熱、黃熱病、茲卡)。

### b08 → trypanosoma   (信心:高 36.8 錐蟲 Trypanosoma;備選:overview 5.4、giardia-lamblia 1.8、plasmodium 1.5)  <!--h:655d5f-->
> - 非洲錐蟲病急性期：**發熱、肌肉與關節疼痛、淋巴結腫大**。

## respiratory-viral-infections 呼吸道病毒感染(9 條)

可選段落:influenza-virus、novel-influenza-a、sars-cov-2、sars-cov、mers-cov、common-cold

### b01 → influenza-virus   (信心:高 48.6 流行性感冒病毒 Influenza virus;備選:novel-influenza-a 15.9、sars-cov-2 5.5、common-cold 3.2)  <!--h:beab70-->
> - 流感病毒是**單股 RNA**、分 8 段；以**血球凝集素**附著細胞；**抗原移型**是大流行的主因；最容易引起大流行的是 **A 型**；亞型由 HA 與 NA 決定。

### b02 → novel-influenza-a   (信心:高 18.6 新型 A 型流感 Novel influenza A;備選:sars-cov-2 8.8、influenza-virus 7.5、common-cold 3.6)  <!--h:76513c-->
> - 流感有疫苗與藥物可治療；H5N1 人類重症**不是**每年上萬人。

### b03 → influenza-virus   (信心:高 11.3 流行性感冒病毒 Influenza virus;備選:sars-cov-2 5.5、common-cold 4.4、novel-influenza-a 3.6)  <!--h:03d7cc-->
> - 流感臨床表現：發燒發冷、喉嚨痛、畏光、肌肉痠痛；**沒有紅疹搔癢**。

### b04 → influenza-virus   (信心:高 38.9 流行性感冒病毒 Influenza virus;備選:common-cold 14.6、sars-cov-2 9.2、novel-influenza-a 5.9)  <!--h:c350d6-->
> - 一般感冒**沒有**疫苗；流感傳染力較高、全身症狀較明顯；兩者都是飛沫與接觸傳染。

### b05 → novel-influenza-a   (信心:中 13.1 新型 A 型流感 Novel influenza A;備選:influenza-virus 12.5、sars-cov-2 3.1、mers-cov 2.8)  <!--h:66f245-->
> - 疑似新型流感住院：最先衛教病人**勤洗手並戴口罩**。

### b06 → novel-influenza-a   (信心:高 25.0 新型 A 型流感 Novel influenza A;備選:sars-cov 8.0、sars-cov-2 7.2、influenza-virus 5.3)  <!--h:d436f4-->
> - 照護 H5N1 病人量生命徵象**不需要無菌隔離衣**；外科口罩**不是**固定每 8 小時更換。

### b07 → novel-influenza-a   (信心:高 29.0 新型 A 型流感 Novel influenza A;備選:influenza-virus 8.8、sars-cov-2 8.7、mers-cov 6.8)  <!--h:edb44b-->
> - 新型 A 型流感(禽流感)：**不是**多數經人傳人；經吸入與接觸傳染；避免接觸禽鳥。

### b08 → sars-cov-2   (信心:高 40.2 新型冠狀病毒 SARS-CoV-2;備選:sars-cov 10.2、novel-influenza-a 6.6、influenza-virus 6.3)  <!--h:ca795d-->
> - 嚴重特殊傳染性肺炎(COVID-19)主要經**空氣或飛沫**傳染；照護避免 **nebulizer**；**俯臥與體液負平衡**有助氧合；類固醇不是常規。

### b09 → sars-cov   (信心:高 18.8 SARS 冠狀病毒 SARS-CoV;備選:sars-cov-2 5.8、influenza-virus 5.3、common-cold 2.2)  <!--h:993a41-->
> - SARS：發病期**不常見肺部鈣化**；照護需負壓單獨病房且全程穿戴防護用具。

## rna-viruses RNA 病毒(11 條)

可選段落:overview、rotavirus、norovirus、poliovirus、rabies-virus、rabies-pep(H3)、hantavirus、ebola-virus、respiratory-syncytial-virus、parainfluenza-virus、human-t-lymphotropic-virus

### b01 → overview   (信心:中 7.1 總覽比較表;備選:ebola-virus 6.5、human-t-lymphotropic-virus 5.1、rotavirus 4.0)  <!--h:7cfa94-->
> - RNA 病毒突變率高：**RNA 聚合酶**(RNA 依賴性 RNA 聚合酶或反轉錄酶)**缺乏校正**。

### b02 → overview   (信心:高 29.6 總覽比較表;備選:ebola-virus 3.9、rabies-virus 2.9、human-t-lymphotropic-virus 2.9)  <!--h:373c87-->
> - 病毒複製順序：辨認細胞 → 附著穿入 → 去殼 → 巨分子合成 → 組合 → 釋出。

### b03 → overview   (信心:高 28.1 總覽比較表;備選:poliovirus 15.1、rotavirus 12.4、norovirus 6.9)  <!--h:a88c21-->
> - 經糞口傳染的病毒多是**無套膜**病毒；套膜**不會**讓病毒更耐乾燥與酸。

### b04 → overview   (信心:中 32.6 總覽比較表;備選:ebola-virus 28.4、human-t-lymphotropic-virus 7.0、rotavirus 4.0)  <!--h:9d2a96-->
> - 反轉錄病毒是**正股** RNA；**伊波拉病毒**複製不經反轉錄。

### b05 → rotavirus   (信心:高 83.8 輪狀病毒 Rotavirus;備選:overview 37.0、norovirus 18.8、poliovirus 15.9)  <!--h:e0db83-->
> - **輪狀病毒**：嬰幼兒嚴重腹瀉、**無抗病毒藥物**、**口服**疫苗(不是注射)、**糞口**傳染、常併上呼吸道感染；補充電解質後**繼續哺餵母乳**；8 公斤降到 7.4 公斤是**中度**脫水。

### b06 → norovirus   (信心:高 45.0 諾羅病毒 Norovirus;備選:overview 17.6、rotavirus 5.2、rabies-pep 3.7)  <!--h:03fb06-->
> - **諾羅病毒**：所有年齡層、好發於學校與機構等人口密集處、**嘔吐明顯**、**無疫苗**、**酒精乾洗手無效**。

### b07 → poliovirus   (信心:高 57.6 小兒麻痺病毒 Poliovirus;備選:overview 16.6、rotavirus 16.6、rabies-pep 9.8)  <!--h:d33ae1-->
> - **沙克**疫苗注射、**沙賓**疫苗口服(活性減毒)；小兒麻痺主要**糞口**傳染；台灣已根除但仍常規接種。

### b08 → ebola-virus   (信心:中 54.4 伊波拉病毒 Ebola virus;備選:overview 50.0、rabies-virus 44.9、hantavirus 32.1)  <!--h:6379c1-->
> - **狂犬病**：**Negri 小體**、**恐水症**；**漢他病毒**：**囓齒類**傳播；**伊波拉**：**血液、體液**傳播，**不是空氣傳染**，照護不用外科口罩。

### b09 → respiratory-syncytial-virus   (信心:高 34.6 呼吸道融合病毒 Respiratory syncytial virus;備選:overview 7.3、poliovirus 6.3、rotavirus 5.0)  <!--h:355727-->
> - **RSV** 不是罕見病毒、可用 ribavirin 吸入與單株抗體；採**鼻內分泌物**檢驗。

### b10 → parainfluenza-virus   (信心:高 42.8 副流行性感冒病毒 Parainfluenza virus;備選:overview 5.6、respiratory-syncytial-virus 4.9、ebola-virus 3.6)  <!--h:12971b-->
> - **哮吼**：狗吠式咳嗽、聲音沙啞，喘鳴在**吸氣**時；**不宜抽痰**；不是鏈球菌引起。

### b11 → human-t-lymphotropic-virus   (信心:高 23.0 人類嗜 T 淋巴球病毒 Human T-lymphotropic virus;備選:overview 16.2、respiratory-syncytial-virus 3.0、rabies-virus 1.5)  <!--h:8b561c-->
> - **HTLV-1** 與成人 T 細胞白血病有關，不是慢性淋巴性白血病。

## sepsis 敗血症與敗血性休克(11 條)

可選段落:definitions、pathophysiology、mechanism(H3)、hemodynamics(H3)、manifestations、diagnosis、hour-1-bundle、nursing

### b01 → mechanism   (信心:高 54.2 致病機轉;備選:diagnosis 4.3、hour-1-bundle 4.3、nursing 3.8)  <!--h:0845b4-->
> - 引起敗血症全身反應的主要因子：**TNF-α**；腫瘤壞死因子活化可產生**微小血栓**(DIC)。

### b02 → mechanism   (信心:高 49.1 致病機轉;備選:manifestations 24.4、hemodynamics 12.8、hour-1-bundle 9.6)  <!--h:7a3080-->
> - 敗血症不是全身循環血量增加，而是**微血管通透性增加、有效循環血量下降**；會出現**尿量減少、代謝性酸中毒**，不會出現血壓上升或尿量增加。

### b03 → mechanism   (信心:高 38.6 致病機轉;備選:pathophysiology 13.5、definitions 5.3、hemodynamics 5.3)  <!--h:6ab31a-->
> - **大腸桿菌**最常引起敗血性休克；機轉是**內毒素**，不是外毒素。

### b04 → hemodynamics   (信心:高 49.3 血行動力學：暖休克與冷休克;備選:hour-1-bundle 8.6、mechanism 7.2、nursing 5.4)  <!--h:b3b023-->
> - 敗血性休克屬於**分布性休克**(與過敏性、神經性同類)；早期**心輸出量增加**、**皮膚溫暖潮紅**；**CVP 不會升高**。

### b05 → mechanism   (信心:高 24.1 致病機轉;備選:hour-1-bundle 10.8、definitions 8.8、hemodynamics 8.6)  <!--h:156706-->
> - ARDS 最常見的危險因子：**敗血性休克**。

### b06 → manifestations   (信心:高 16.7 臨床表現;備選:definitions 3.4、mechanism 3.4、hemodynamics 2.3)  <!--h:8937c4-->
> - 發燒型態：敗血症常見**間歇熱**。

### b07 → nursing   (信心:高 41.5 護理措施;備選:diagnosis 22.4、hour-1-bundle 12.7、manifestations 1.1)  <!--h:caa1a0-->
> - **先抽血液培養再給抗生素**；兩套**不同部位**；空針抽血先注入**厭氧瓶**。

### b08 → hour-1-bundle   (信心:高 48.9 治療：1 小時組合照護;備選:definitions 12.4、nursing 5.8、diagnosis 3.7)  <!--h:3048f5-->
> - Hour-1 bundle：晶體液 **30 mL/kg**(不是 40)、**MAP ≥ 65 mmHg**(不是 60)；廣效抗生素療程約 **7–10 天**。

### b09 → definitions   (信心:高 25.5 定義：新舊比較;備選:hour-1-bundle 10.5、diagnosis 7.2、mechanism 5.2)  <!--h:a5c280-->
> - 器官功能障礙指標：**血小板 < 100,000/μL**(> 140,000 是正常)、尿量 < 0.5 mL/kg/h、收縮壓 < 90 mmHg。

### b10 → hour-1-bundle   (信心:高 15.2 治療：1 小時組合照護;備選:diagnosis 6.4、mechanism 4.3、nursing 2.2)  <!--h:892314-->
> - DIC：**優先治療敗血症的原因**。

### b11 → hour-1-bundle   (信心:中 8.5 治療：1 小時組合照護;備選:nursing 7.2、pathophysiology 6.8、hemodynamics 3.3)  <!--h:37d186-->
> - 導管感染：**儘速拔除中心靜脈管路**。

## staphylococcus-aureus 金黃色葡萄球菌(8 條)

可選段落:staphylococcus-aureus、virulence、diseases、food-poisoning(H3)、toxic-shock-syndrome(H3)、scalded-skin-syndrome(H3)、mrsa、diagnosis、prevention、comparison

### b01 → diseases   (信心:高 27.9 引起的疾病;備選:mrsa 14.4、staphylococcus-aureus 13.2、diagnosis 11.1)  <!--h:0a3fd9-->
> - 院內感染最常見的致病菌：**金黃色葡萄球菌**(與綠膿桿菌)；外生性院內感染最常見也是金黃色葡萄球菌。

### b02 → diseases   (信心:高 39.1 引起的疾病;備選:virulence 11.5、diagnosis 10.0、mrsa 7.3)  <!--h:ff8769-->
> - **骨髓炎**、**乳腺炎**最常見致病菌；心內膜炎最常見致病菌之一。

### b03 → virulence   (信心:高 36.9 致病因子與毒素;備選:staphylococcus-aureus 12.2、mrsa 12.0、diagnosis 9.9)  <!--h:9db4c4-->
> - **凝固酶**使血漿凝固(形成纖維蛋白)；**心內膜炎**不是毒素造成。

### b04 → food-poisoning   (信心:高 64.2 食物中毒;備選:diagnosis 15.2、virulence 12.8、diseases 8.8)  <!--h:b054aa-->
> - 食物中毒：**耐熱腸毒素**，高溫烹煮不易破壞；**潛伏期最短**；**不發燒、無血便**，不建議抗生素；2–4 小時多人嘔吐腹瀉 → 葡萄球菌，**不是**沙門氏菌。

### b05 → toxic-shock-syndrome   (信心:高 32.6 毒性休克症候群;備選:diseases 16.0、virulence 15.5、staphylococcus-aureus 6.5)  <!--h:cc8f13-->
> - 衛生棉條相關**毒性休克症候群** → 金黃色葡萄球菌。

### b06 → mrsa   (信心:高 45.2 抗藥性：MRSA;備選:virulence 10.1、diagnosis 5.6、prevention 5.6)  <!--h:b596d3-->
> - **MRSA** 抗藥機轉：染色體突變造成**青黴素結合蛋白改變**；治療用 **vancomycin**；**daptomycin 不適合 MRSA 肺炎**。

### b07 → prevention   (信心:高 33.0 預防與感染管制;備選:scalded-skin-syndrome 15.0、mrsa 6.8、virulence 2.5)  <!--h:46b40c-->
> - MRSA 隔離：**接觸隔離**(手套、隔離衣)，不需負壓病房與過濾式口罩；照護順序最後照護 MRSA 病人。

### b08 → diseases   (信心:高 12.0 引起的疾病;備選:無)  <!--h:b89904-->
> - 乳腺炎可繼續哺乳。

## streptococci 鏈球菌(10 條)

可選段落:classification、overview、streptococcus-pyogenes、streptococcus-agalactiae、streptococcus-pneumoniae、viridans-streptococci、streptococcus-suis(H3)

### b01 → classification   (信心:高 25.9 分類;備選:streptococcus-pyogenes 8.6、overview 7.4、streptococcus-agalactiae 4.0)  <!--h:21757c-->
> - 化膿性鏈球菌屬 **β 溶血**(透明環)；**沒有鞭毛、不產芽孢**。

### b02 → streptococcus-pyogenes   (信心:中 26.7 A 族鏈球菌 Streptococcus pyogenes;備選:overview 19.2、streptococcus-pneumoniae 14.4、streptococcus-agalactiae 10.5)  <!--h:ae77e1-->
> - A 族鏈球菌感染**首選青黴素**；**扁桃腺炎**最常見致病菌是鏈球菌。

### b03 → streptococcus-pyogenes   (信心:中 33.0 A 族鏈球菌 Streptococcus pyogenes;備選:overview 27.5、streptococcus-agalactiae 6.7、streptococcus-pneumoniae 6.5)  <!--h:9ac539-->
> - A 族鏈球菌引起：扁桃腺炎、**風濕熱**、**急性腎絲球腎炎**；**哮吼**不是(多為病毒)。

### b04 → streptococcus-pyogenes   (信心:高 59.4 A 族鏈球菌 Streptococcus pyogenes;備選:overview 20.1、streptococcus-agalactiae 11.9、viridans-streptococci 6.3)  <!--h:de753d-->
> - **風濕熱**來自**咽喉**感染(不是皮膚)；好發 5–15 歲，**不是** 65 歲以上；最常侵犯**二尖瓣**；需要**抗生素**；心衰竭時低鹽；**不宜**多運動。

### b05 → streptococcus-pyogenes   (信心:高 77.7 A 族鏈球菌 Streptococcus pyogenes;備選:streptococcus-pneumoniae 4.0、streptococcus-agalactiae 2.5、viridans-streptococci 1.5)  <!--h:70415f-->
> - 瓊斯氏主要標準：心臟炎、多發性關節炎、舞蹈症、邊緣性紅斑、皮下結節(**無痛**)；**白血球增多**與**凝血時間延長**不是。

### b06 → streptococcus-pyogenes   (信心:高 52.3 A 族鏈球菌 Streptococcus pyogenes;備選:overview 8.2、streptococcus-agalactiae 4.5、streptococcus-pneumoniae 4.0)  <!--h:28499f-->
> - **ASO** 用於診斷**急性風濕熱**；**阿孝夫氏小體**是風濕熱的特徵；猩紅熱**不是**自體免疫疾病。

### b07 → streptococcus-pyogenes   (信心:高 33.9 A 族鏈球菌 Streptococcus pyogenes;備選:overview 6.2、streptococcus-agalactiae 4.7、streptococcus-pneumoniae 3.2)  <!--h:5c801e-->
> - 猩紅熱：青黴素治療後 **24 小時內退燒**；先白色草莓舌再紅色草莓舌；科氏斑點是**麻疹**。

### b08 → streptococcus-agalactiae   (信心:高 55.9 B 族鏈球菌 Streptococcus agalactiae;備選:overview 32.2、viridans-streptococci 13.5、streptococcus-pneumoniae 13.1)  <!--h:daf3de-->
> - **B 族鏈球菌**是女性生殖道**正常菌叢**；孕婦陽性時新生兒經產道可能併發**敗血症**；篩檢在 **35–37 週**，不是第一孕期；產時才給抗生素。

### b09 → streptococcus-pneumoniae   (信心:高 55.6 肺炎鏈球菌 Streptococcus pneumoniae;備選:overview 16.4、streptococcus-pyogenes 14.5、streptococcus-agalactiae 13.3)  <!--h:44837e-->
> - **肺炎鏈球菌**：**社區型肺炎最常見**致病菌、**鐵鏽色痰**；常伴隨呼吸道感染；Griffith 實驗添加的是 **DNA**。

### b10 → streptococcus-pneumoniae   (信心:高 29.5 肺炎鏈球菌 Streptococcus pneumoniae;備選:overview 6.5、streptococcus-agalactiae 3.8、classification 3.6)  <!--h:8c0429-->
> - 65 歲以上可接種公費**肺炎鏈球菌疫苗**與**流感疫苗**。

## vector-borne-zoonotic 病媒傳染病與人畜共通傳染病(9 條)

可選段落:overview、dengue-virus、japanese-encephalitis-virus、zika-virus、chikungunya-virus、yellow-fever-virus、west-nile-virus、sfts-virus

### b01 → dengue-virus   (信心:中 40.0 登革熱 Dengue virus;備選:overview 37.3、japanese-encephalitis-virus 16.9、zika-virus 16.5)  <!--h:1813ec-->
> - 登革熱最常藉由**埃及斑蚊**傳播(另有白線斑蚊)；病媒是**蚊子**，不是三斑家蚊、鳥類、蟑螂或老鼠；登革病毒有 **4 型**、**不是**小 RNA 病毒、會產生**病毒血症**(不是菌血症)。

### b02 → dengue-virus   (信心:高 37.8 登革熱 Dengue virus;備選:overview 6.3、japanese-encephalitis-virus 3.4、chikungunya-virus 2.7)  <!--h:dcb380-->
> - **感染不同型**登革病毒時較容易重症；先後感染**同型**不會。

### b03 → dengue-virus   (信心:高 89.7 登革熱 Dengue virus;備選:zika-virus 15.9、overview 15.0、chikungunya-virus 11.4)  <!--h:91315f-->
> - 登革熱：**第二類**、24 小時內通報；潛伏期約 3–8 天(不是 1–2 天)；**馬鞍狀發燒**；可用 **NS1** 快篩；沒有特效藥；避免 **aspirin**、indomethacin；**不需接觸隔離**、不需穿隔離衣與口罩，採血液體液防護；使用蚊帳是**阻斷傳染途徑**；發病期間不能捐血；可垂直傳染。

### b04 → dengue-virus   (信心:高 28.6 登革熱 Dengue virus;備選:overview 1.1、japanese-encephalitis-virus 1.1、zika-virus 1.1)  <!--h:50bdaa-->
> - 「**巡、倒、清、刷**」阻斷**感染窩**、著重**環境**；噴殺蟲劑是**傳播媒介控制**。

### b05 → dengue-virus   (信心:中 17.3 登革熱 Dengue virus;備選:overview 12.9、zika-virus 3.6、japanese-encephalitis-virus 1.3)  <!--h:811aa3-->
> - 埃及斑蚊**白天**叮咬；布氏指數以每 100 戶計算。

### b06 → japanese-encephalitis-virus   (信心:高 71.7 日本腦炎 Japanese encephalitis virus;備選:dengue-virus 22.2、overview 19.3、west-nile-virus 2.4)  <!--h:270d89-->
> - **日本腦炎**：**三斑家蚊**、黃昏避免外出；**不需要**隔離血液分泌物；腦脊髓液**蛋白質上升**。

### b07 → zika-virus   (信心:高 40.9 茲卡病毒 Zika virus;備選:dengue-virus 15.4、overview 14.8、chikungunya-virus 5.8)  <!--h:44e0e7-->
> - **茲卡**病媒是**斑蚊**不是蜱；孕婦從疫區返國要觀察 2 週內是否有紅疹、發燒、關節痛。

### b08 → overview   (信心:中 17.0 總覽比較表;備選:dengue-virus 15.6、japanese-encephalitis-virus 12.2、zika-virus 9.0)  <!--h:9116dd-->
> - 病媒蚊傳播：日本腦炎、瘧疾、登革熱、黃熱病、茲卡；霍亂、A 肝、SARS、小兒麻痺、炭疽**不是**。

### b09 → overview   (信心:中 5.1 總覽比較表;備選:chikungunya-virus 2.5、dengue-virus 1.8、yellow-fever-virus 1.8)  <!--h:ed4bdf-->
> - 漢他病毒由**囓齒類**傳播。

