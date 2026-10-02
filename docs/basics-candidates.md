# 想打好基礎:候選概念

由 `scripts/suggest-basics.mjs` 產生(重跑會覆蓋)。只是候選,不改任何頁面。

- **A 已有現成段落**:兩頁以上已經連到同一個解剖&生理頁或段落,可直接改寫成 `![[slug#id|basics]]`。
- **B 還沒有內容**:藥理頁內文中、跨兩頁以上出現的機轉名詞(規則比對,有雜訊)。要新寫基礎內容時參考。
- ⚠ 過長:段落超過約 8 行(320 字),收合後展開會太長,考慮縮短、改引用子段落,或為該頁寫 summary 改用整頁引用。

## A. 已有現成段落(22 個)

| 段落 | 用到的頁面 | 頁數 | 長度 |
|---|---|---|---|
| `blood-pressure-regulation#raas` 血壓的生理調控〉腎素-血管張力素-醛固酮系統 | 高血壓、ACE 抑制劑、血管張力素 II 受體阻斷劑、血管收縮素受體-腦啡肽酶抑制劑、保鉀利尿劑、Thiazide 類利尿劑 | 6 | 665 字 ⚠ 過長 |
| `blood-pressure-regulation#autonomic-receptors` 血壓的生理調控〉自主神經受體與血壓 | α1 阻斷劑、β 阻斷劑、中樞 α2 致效劑、強心劑與升壓劑、心臟功能與心輸出量 | 5 | 582 字 ⚠ 過長 |
| `blood-pressure-regulation#baroreceptor` 血壓的生理調控〉壓力感受器反射 | 高血壓、鈣離子通道阻斷劑、直接血管擴張劑、硝酸鹽類 | 4 | 496 字 ⚠ 過長 |
| `coronary-circulation#oxygen-demand` 冠狀動脈循環與心肌氧供需〉心肌耗氧量的決定因素 | β 阻斷劑、鈣離子通道阻斷劑、硝酸鹽類、冠狀動脈疾病：心絞痛與心肌梗塞 | 4 | 893 字 ⚠ 過長 |
| `cardiac-output#conduction` 心臟功能與心輸出量〉傳導系統 | β 阻斷劑、鈣離子通道阻斷劑、毛地黃、12 導程心電圖判讀 | 4 | 733 字 ⚠ 過長 |
| `neurotransmitters-psychiatry#monoamine` 精神疾病的神經傳導物質與腦區〉血清素與正腎上腺素：單胺假說 | 雙相情緒障礙症、憂鬱症、抗憂鬱藥物 | 3 | 303 字 |
| `neoplasia` 腫瘤概論 | 癌症總論與癌症護理、腫瘤標記、微生物總論與致病機轉 | 3 | 整頁 |
| `cardiac-output#determinants` 心臟功能與心輸出量〉心輸出量的決定因素 | 心衰竭、強心劑與升壓劑、血壓的生理調控 | 3 | 910 字 ⚠ 過長 |
| `microbial-pathogenesis#replication` 微生物總論與致病機轉〉複製步驟 | 愛滋病毒感染與愛滋病、抗病毒藥物、RNA 病毒 | 3 | 464 字 ⚠ 過長 |
| `blood-pressure-regulation#determinants` 血壓的生理調控〉血壓的決定因素 | 低血壓、強心劑與升壓劑、Thiazide 類利尿劑 | 3 | 657 字 ⚠ 過長 |
| `coronary-circulation` 冠狀動脈循環與心肌氧供需 | 冠狀動脈疾病：心絞痛與心肌梗塞、12 導程心電圖判讀 | 2 | 整頁 |
| `neoplasia#key-genes` 腫瘤概論〉常考的基因 | 淋巴瘤與多發性骨髓瘤、抗腫瘤藥物 | 2 | 499 字 ⚠ 過長 |
| `neurotransmitters-psychiatry#dopamine-pathways` 精神疾病的神經傳導物質與腦區〉多巴胺四條路徑 | 思覺失調症、抗精神病藥物 | 2 | 871 字 ⚠ 過長 |
| `blood-pressure-regulation#drug-sites` 血壓的生理調控〉降血壓藥作用點 | ACE 抑制劑、高血壓 | 2 | 764 字 ⚠ 過長 |
| `microbial-pathogenesis#gene-transfer` 微生物總論與致病機轉〉細菌遺傳與基因轉移 | 抗生素總論、鏈球菌 | 2 | 224 字 |
| `neurotransmitters-psychiatry#receptor-side-effects` 精神疾病的神經傳導物質與腦區〉受體與副作用對照 | 抗憂鬱藥物、抗精神病藥物 | 2 | 613 字 ⚠ 過長 |
| `blood-pressure-regulation#natriuretic-peptides` 血壓的生理調控〉利鈉胜肽 | 血管收縮素受體-腦啡肽酶抑制劑、B 型利鈉胜肽 | 2 | 495 字 ⚠ 過長 |
| `glucose-homeostasis#incretin` 血糖恆定與胰島素作用〉腸泌素效應 | DPP-4 抑制劑、GLP-1 受體促效劑 | 2 | 287 字 |
| `cardiac-output#preload` 心臟功能與心輸出量〉前負荷 | 亨利氏環利尿劑、硝酸鹽類 | 2 | 401 字 ⚠ 過長 |
| `glucose-homeostasis#secretion-steps` 血糖恆定與胰島素作用〉葡萄糖刺激 β 細胞分泌胰島素 | Meglitinide 類、磺醯脲類 | 2 | 314 字 |
| `microbial-pathogenesis#gram-stain` 微生物總論與致病機轉〉革蘭氏染色 | 微生物培養與感受性試驗、革蘭氏陽性菌 | 2 | 497 字 ⚠ 過長 |
| `glucose-homeostasis#glut4` 血糖恆定與胰島素作用〉GLUT4 與葡萄糖攝取 | 糖尿病、TZD 類(胰島素增敏劑) | 2 | 293 字 |

## B. 還沒有內容的機轉名詞(28 個,出現在 2 頁以上的藥理頁)

「現成段落」:解剖&生理頁中標題含此名詞的段落;標「(內文)」表示只在段落內文提到,不一定是專門解釋它的段落。

| 名詞 | 建議歸類 | 出現的藥理頁 | 頁數 | 現成段落 |
|---|---|---|---|---|
| SGLT2 | 生化 | 血管收縮素受體-腦啡肽酶抑制劑、毛地黃、GLP-1 受體促效劑、亨利氏環利尿劑、雙胍類(Metformin)、情緒穩定劑、保鉀利尿劑、SGLT2 抑制劑 | 8 | `glucose-homeostasis#glucose-transporters(內文)` |
| GLP-1 | 生化 | DPP-4 抑制劑、GLP-1 受體促效劑、胰島素製劑、雙胍類(Metformin)、情緒穩定劑 | 5 | `glucose-homeostasis#secretion-regulators(內文)` |
| 蛋白酶 | 生化 | 抗腫瘤藥物、抗結核藥物、抗病毒藥物、鈣離子通道阻斷劑、Statin 類降血脂藥 | 5 | — |
| 集尿管 | 解剖 | 奎諾酮類、磺胺類與其他抗菌藥、亨利氏環利尿劑、保鉀利尿劑、Thiazide 類利尿劑、TZD 類(胰島素增敏劑) | 5 | `blood-pressure-regulation#raas(內文)` |
| cAMP | 生化 | 抗血小板藥、β 阻斷劑、強心劑與升壓劑、硝酸鹽類 | 4 | `cardiac-output#myocyte(內文)` |
| β 細胞 | 解剖 | GLP-1 受體促效劑、Meglitinide 類、雙胍類(Metformin)、磺醯脲類 | 4 | `glucose-homeostasis#secretion-steps` |
| 自主神經受體 | 生理 | α1 阻斷劑、β 阻斷劑、中樞 α2 致效劑、強心劑與升壓劑 | 4 | `blood-pressure-regulation#autonomic-receptors` |
| 血管收縮素受體 | 生理 | ACE 抑制劑、血管張力素 II 受體阻斷劑、毛地黃、亨利氏環利尿劑 | 4 | — |
| DPP-4 | 生化 | DPP-4 抑制劑、GLP-1 受體促效劑、雙胍類(Metformin) | 3 | `glucose-homeostasis#incretin(內文)` |
| K-ATP | 生化 | 強心劑與升壓劑、Meglitinide 類、磺醯脲類 | 3 | `glucose-homeostasis#secretion-steps(內文)` |
| 二氫葉酸還原酶 | 生化 | 抗生素總論、抗腫瘤藥物、奎諾酮類、磺胺類與其他抗菌藥 | 3 | — |
| 亨利氏環 | 解剖 | 直接血管擴張劑、亨利氏環利尿劑、Thiazide 類利尿劑 | 3 | `blood-pressure-regulation#drug-sites(內文)` |
| 壓力感受器 | 生理 | 鈣離子通道阻斷劑、直接血管擴張劑、硝酸鹽類 | 3 | `blood-pressure-regulation#baroreceptor` |
| 房室結 | 解剖 | β 阻斷劑、鈣離子通道阻斷劑、毛地黃 | 3 | `blood-pressure-regulation#autonomic-receptors(內文)` |
| 竇房結 | 解剖 | β 阻斷劑、鈣離子通道阻斷劑、情緒穩定劑 | 3 | `blood-pressure-regulation#autonomic-receptors(內文)` |
| 聚合酶 | 生化 | 抗生素總論、抗結核藥物、抗病毒藥物 | 3 | `microbial-pathogenesis#replication(內文)` |
| 肝臟酵素 | 生化 | 抗結核藥物、奎諾酮類、磺胺類與其他抗菌藥、四環黴素、巨環類與其他蛋白質合成抑制劑 | 3 | — |
| 近曲小管 | 解剖 | 保鉀利尿劑、SGLT2 抑制劑、Thiazide 類利尿劑 | 3 | `blood-pressure-regulation#adh(內文)` |
| 鈣離子通道 | 生理 | β 阻斷劑、直接血管擴張劑、硝酸鹽類 | 3 | — |
| -內醯胺酶 | 生化 | 抗生素總論、β-內醯胺類抗生素 | 2 | — |
| ATPase | 生化 | 毛地黃、保鉀利尿劑 | 2 | `cardiac-output#myocyte(內文)` |
| GLUT4 | 生化 | 胰島素製劑、TZD 類(胰島素增敏劑) | 2 | `glucose-homeostasis#glut4` |
| gyrase | 生化 | 抗生素總論、奎諾酮類、磺胺類與其他抗菌藥 | 2 | — |
| 分解酶 | 生化 | 抗生素總論、β-內醯胺類抗生素 | 2 | — |
| 拓撲異構酶 | 生化 | 抗生素總論、奎諾酮類、磺胺類與其他抗菌藥 | 2 | — |
| 排出幫浦 | 生理 | 抗生素總論、β-內醯胺類抗生素 | 2 | — |
| 敏感性鉀通道 | 生理 | 直接血管擴張劑、磺醯脲類 | 2 | `glucose-homeostasis#secretion-steps(內文)` |
| 遠曲小管 | 解剖 | 亨利氏環利尿劑、Thiazide 類利尿劑 | 2 | `blood-pressure-regulation#raas(內文)` |

建議歸類是依名詞字尾判斷(酵素/-ase → 生化;受體、通道、轉運蛋白 → 生理;構造名 → 解剖),請以內容為準調整。
