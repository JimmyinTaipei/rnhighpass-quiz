# 第 9 輪腎與體液：圖片盤點(9-0c)

> 2026-10-21 建立。做法沿用前幾輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線(`scripts/label-zoom-grid.py`)逐點核對；左標籤 align end、右標籤 start、順序一致不交叉；**每張圖做好先放進頁面，標「待使用者確認」**
> 這次用 qlmanage 出縮圖看過 12 張(縮圖在本 session scratchpad `r9/servier/`)
> 課本(內外科護理學、兒科護理學)與 ICU Book 的圖有版權，不用；需要示意時自己畫

## 一、來源與授權

| 來源 | 檔案(`~/Downloads/ServierMedicalArt-all-kits/`) | 可用的投影片 |
|---|---|---|
| Servier Medical Art(CC BY 4.0) | `SMART-Urinary-system.pptx`(21 張) | 3 泌尿道全景(男女)、5 腎臟冠狀切面與外觀、6 腎臟血管、7 腎元與皮質髓質、8 腎元單獨、9 腎元分段上色、10 腎小體、11 入球小動脈、12 膀胱、13 膀胱炎、14 腎病變、15 腎絲球腎炎外觀、16 腎盂腎炎、17 腎血管性高血壓、18 水腎、19 血液透析(病人與機器)、20 透析器、21 尿液試紙 |
| 同上 | `SMART-Respiratory-system.pptx` 23 | CRRT＋ECMO(第 6 輪已盤點，CRRT 示意可參考) |
| 同上 | `SMART-Medical-equipment.pptx` 7、25 | 尿液檢體瓶、透析機 |
| 既有原創圖 | `public/knowledge-images/diuretic-sites-nephron.svg`、`sglt2-nephron.svg`、`raas-drug-sites.svg`、`iv-fluid-tonicity.svg` | 腎元藥物作用點、RAAS、輸液張力；新頁連過去或沿用，不重畫 |

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤；表＝用表格就好

| # | 圖 | 層 | 用在 | 必做 | 備註 |
|---|---|---|---|---|---|
| 1 | 泌尿道全景(腎、輸尿管、膀胱、尿道、攝護腺；男女並列) | 2(s3) | kidney-urinary-physiology | ✅ | 輸尿管三個狹窄處(腎盂輸尿管交界、跨髂動脈、膀胱入口)標在圖上，對應 114-1_BM_015 |
| 2 | 腎臟冠狀切面(皮質、髓質、腎錐體、腎柱、腎乳頭、腎盞、腎盂、輸尿管、腎門) | 2(s5 左) | kidney-urinary-physiology | ✅ | 113-1_BM_016、107-2_BM_011 |
| 3 | 腎元分段與功能(腎小體、近曲小管、亨利氏環降支／升支、遠曲小管、集尿管；各段再吸收與水通透性) | 1 | kidney-urinary-physiology | ✅ | 原創：用 s9 分段配色的概念重畫，每段加「再吸收什麼、對水是否通透」；考題最多(近曲小管 65% 鈉水、升支不透水、ADH 作用在集尿管) |
| 4 | 腎小體與過濾屏障(內皮、基底膜、足細胞；入球／出球小動脈；近腎絲球器) | 2(s10)或 1 | kidney-urinary-physiology | ✅ | GFR 決定因素(入球擴張、出球收縮)用表 |
| 5 | 排尿反射(副交感 S2–S4 骨盆內臟神經、交感 T11–L2、陰部神經) | 1 | kidney-urinary-physiology | — | 寫到再看要不要圖，可能用表就夠 |
| 6 | 體液分布(細胞內液 2/3、細胞外液 1/3：組織間液、血漿) | 1 | fluid-electrolytes | ✅ | 簡單方塊圖；107-1_BM_029 計算題 |
| 7 | 酸鹼判讀流程 | 表 | abg(既有) | — | abg 已有，補題不另畫 |
| 8 | KDIGO CKD 分期 G1–G5 × A1–A3 風險格 | 表 | chronic-kidney-disease | ✅ | 用表格＋顏色字，不重製 KDIGO 原圖 |
| 9 | AKI 腎前性、腎性、腎後性 | 表 | acute-kidney-injury | — | 表格 |
| 10 | 透析原理(擴散、超過濾、對流) | 1 | dialysis-crrt | ✅ | 原創：半透膜兩側濃度梯度與壓力；不用 ICU Book 圖 34.4 |
| 11 | 血液透析迴路(動脈端、幫浦、透析器、靜脈端、動靜脈瘻管) | 2(s19)＋標籤 | dialysis-crrt | ✅ | s19 病人與機器，標籤標管路方向 |
| 12 | 動靜脈瘻管與人工血管(前臂橈動脈與頭靜脈吻合) | 1 | dialysis-crrt | ✅ | 原創；照護重點(震顫、雜音、禁止量血壓)用表 |
| 13 | 腹膜透析(導管、灌入、留置、引流) | 1 | dialysis-crrt | ✅ | 原創 |
| 14 | 腎絲球腎炎與腎病症候群比較 | 表 | glomerular-diseases | ✅ | 表格(水腫、蛋白尿、血尿、高血壓、補體) |
| 15 | 水腎 | 2(s18) | urologic-disorders | ✅ | 只留切面，5 個標籤(2026-10-21) |
| 16 | 攝護腺肥大壓迫尿道、TURP 與膀胱連續沖洗 | 1 | urologic-disorders | ✅ | 原創 bladder-irrigation(三腔導尿管與 CBI)(2026-10-21) |
| 17 | 膀胱輸尿管逆流分級、尿道下裂、隱睪 | 表 | pediatric-genitourinary | — | 表格為主 |

必做 9 張(原創 5、Servier 4)；其餘寫到該組再決定

## 三、不用

- OpenStax 的圖(規則)
- 課本、ICU Book 的圖與整張表(有版權，只參考)
- KDIGO 原圖(CKD 風險熱圖)：改成自己的表格
