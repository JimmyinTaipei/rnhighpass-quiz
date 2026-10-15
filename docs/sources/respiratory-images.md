# 第 6 輪呼吸：圖片盤點(6-0b)

> 2026-10-15 建立。做法沿用第 3–5 輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線逐點核對；左標籤 align end、右標籤 start、順序一致不交叉；**每組圖先截圖給使用者確認**
> 縮圖在 session scratchpad(`servier6/*_sheet*.png`)，**不進 repo**；選定後才轉檔放進 `public/knowledge-images/` 並登記 credits.json
> 器材(呼吸器、胸管、氧氣面罩、人工氣道)Servier 沒有，以原創 SVG 為主

## 一、來源與授權

| 來源 | 檔案 | 結果 |
|---|---|---|
| Servier Medical Art | `~/Downloads/ServierMedicalArt-all-kits/SMART-Respiratory-system.pptx`(23 張) | CC BY 4.0；呼吸道全景、鼻腔、肺、氣管支氣管、支氣管橫切面(正常／發炎)、肺葉(拆開)、肺泡與微血管、肺循環、吸吐氣胸廓、氣體交換、氣胸、肺栓塞 2 張、肺水腫、慢性支氣管炎、肺氣腫、肺癌、咳嗽、CRRT＋ECMO |
| Servier Medical Art | `SMART-ENT.pptx`(13 張) | CC BY 4.0；喉(前、後面)、聲帶(休息／發聲)、吞嚥(頭頸矢狀切面)、鼻竇 |
| Servier Medical Art | `SMART-Medical-acts.pptx`、`SMART-Medical-equipment.pptx`、`SMART-Emergency-equipment.pptx` | CC BY 4.0；只有復甦姿勢、口對口、CPR、聽診器；**沒有呼吸器、胸管、給氧裝置、人工氣道** |
| 既有圖 | `servier-brainstem.svg`(呼吸中樞)、`embolism-routes.svg`、`servier-thrombus-infarct.svg`、`servier-venous-thrombosis.svg`、`servier-edema-capillary.svg` | 沿用，連結過去 |

不可用：OpenStax 的圖(規則)；ICU Book 與國考書的圖(有版權，只參考)

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤

| # | 檔名(暫定) | 用在 | 內容與要標的 | 層 | 來源 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | servier-conducting-zone | respiratory-anatomy | 鼻、咽、喉、氣管、支氣管、細支氣管(上下呼吸道分界) | 2 | Respiratory 投影片 3 | 候選 |
| 2 | servier-larynx | respiratory-anatomy | 甲狀軟骨(喉結)、環狀軟骨、杓狀軟骨、會厭、氣管軟骨環；考題問軟骨位置與聲帶附著 | 2 | ENT 投影片 10 | 候選；**最重要的解剖圖之一**(喉 4 題全未收) |
| 3 | servier-vocal-cords | respiratory-anatomy | 聲帶休息(張開)與發聲(閉合)、聲門 | 2 | ENT 投影片 9 | 候選 |
| 4 | servier-lung-lobes | respiratory-anatomy | 右三葉、左二葉、斜裂、水平裂、右主支氣管較短寬直 | 2 | Respiratory 投影片 8 或 9 | 候選 |
| 5 | servier-alveoli | respiratory-anatomy、gas-exchange-transport | 終末細支氣管 → 呼吸性細支氣管 → 肺泡管 → 肺泡囊、肺泡周圍微血管 | 2 | Respiratory 投影片 11 | 候選 |
| 6 | alveolar-cells | respiratory-anatomy | 第一型肺泡細胞(交換)、第二型(表面張力素)、肺泡巨噬細胞、呼吸膜三層 | 1 | 原創 | 候選 |
| 7 | servier-breathing | ventilation-mechanics | 吸氣(橫膈下降、胸廓擴大) vs 呼氣 | 2 | Respiratory 投影片 13 | 候選 |
| 8 | spirogram | ventilation-mechanics | 潮氣容積、吸氣儲備、呼氣儲備、餘氣容積；吸氣容量、功能性餘氣量、肺活量、總肺量 | 1 | 原創 | 候選；**考 11 題，必做** |
| 9 | obstructive-restrictive-flow | ventilation-mechanics、copd | FEV1／FVC 阻塞型 vs 侷限型比較 | 表格 | — | 建議用表格 |
| 10 | oxygen-dissociation-curve | gas-exchange-transport | S 形曲線、P50、右移因子(CO2↑、H+↑、溫度↑、2,3-BPG↑)與左移(CO、胎兒血紅素) | 1 | 原創 | 候選；**必做** |
| 11 | co2-transport | gas-exchange-transport | 溶解、胺基甲醯血紅素、碳酸氫根(碳酸酐酶、氯轉移) | 1 | 原創 | 候選 |
| 12 | vq-matching | gas-exchange-transport、pulmonary-embolism-hypertension | 正常 V/Q、分流(肺泡塌陷)、無效腔(肺栓塞) | 1 | 原創 | 候選 |
| 13 | servier-gas-exchange | gas-exchange-transport | 肺循環與體循環的氣體交換 | 2 | Respiratory 投影片 14 | 候選；與 #12 擇一 |
| 14 | breathing-patterns | respiratory-assessment | 正常、陳施氏、庫斯毛耳氏、畢歐氏、喟嘆式、呼吸暫停的波形 | 1 | 原創 | 候選；基護 6 題 |
| 15 | breath-sounds-map | respiratory-assessment | 胸前胸後聽診位置；氣管音、支氣管音、支氣管肺泡音、肺泡音分布 | 1 | 原創 | 候選 |
| 16 | servier-bronchitis-emphysema | copd | 慢性支氣管炎(管壁增厚、黏液) vs 肺氣腫(肺泡壁破壞融合) 並排 | 2 | Respiratory 投影片 19＋20 | 候選 |
| 17 | servier-pulmonary-edema | ards-respiratory-failure | 肺泡積液 | 2 | Respiratory 投影片 18 | 候選；ARDS 可另加原創「透明膜」示意 |
| 18 | servier-pulmonary-embolism | pulmonary-embolism-hypertension | 下肢血栓 → 右心 → 肺動脈 | 2 | Respiratory 投影片 16、17 | 候選；與既有 embolism-routes 分工(那張講各種栓子) |
| 19 | servier-pneumothorax | pleural-chest-trauma | 正常肺 vs 氣胸肺塌陷 | 2 | Respiratory 投影片 15 | 候選 |
| 20 | pleural-space | pleural-chest-trauma | 臟層、壁層胸膜、肋膜腔；積水、積氣、積血、積膿的位置 | 1 | 原創 | 候選 |
| 21 | tension-pneumothorax | pleural-chest-trauma | 單向活瓣 → 縱膈腔偏向對側、氣管偏移 | 1 | 原創 | 候選 |
| 22 | flail-chest | pleural-chest-trauma | 反常呼吸：吸氣時連枷段內陷、呼氣時外凸 | 1 | 原創 | 候選 |
| 23 | chest-drainage-systems | chest-tube | 單瓶、雙瓶、三瓶(收集、水封、抽吸控制)；水封長管沒入 2 cm、液面隨呼吸起伏 | 1 | 原創 | 候選；**器材頁核心圖** |
| 24 | chest-tube-sites | chest-tube | 前胸第 2 肋間(排氣)、腋中線第 5–8 肋間(排液)；術後兩支胸管 | 1 | 原創 | 候選；108-2_MS_053 |
| 25 | oxygen-devices-table | oxygen-therapy | 鼻導管、簡單面罩、部分再吸入、非再吸入、Venturi、高流量鼻導管、氧氣帳與頭罩：流量與 FiO2 | 表格 | — | 用表格 |
| 26 | artificial-airways | artificial-airway | 口咽與鼻咽人工氣道的量法(口角至耳垂、鼻尖至耳垂)、氣管內管與氣切管(套囊、內外管) | 1 | 原創 | 候選 |
| 27 | ventilator-waveforms | mechanical-ventilation | 壓力–時間、流量–時間波形；PEEP、auto-PEEP、抽痰時的鋸齒狀波形 | 1 | 原創 | 待決定(國考少考，實習有用) |
| 28 | postural-drainage | airway-clearance | 各肺節的姿位引流姿勢(上葉、中葉、下葉) | 表格＋1 | 原創簡圖 | 候選；110-1_OP_063 |
| 29 | infant-airway | respiratory-anatomy | 嬰幼兒與成人呼吸道比較(舌大、會厭高、環狀軟骨最窄、耳咽管短平直) | 表格 | — | 用表格 |

## 三、使用者決定(2026-10-15)

1. 先畫 #8 肺容積、#10 氧解離曲線、#23 胸管引流瓶；其他原創圖跟著各組進度畫
2. #9、#25、#29 用表格(前提是表格夠清楚)
3. #27 呼吸器波形：畫正常、PEEP、抽痰鋸齒三種，**圖說標注「國考不考，實習用」**
4. 氣體交換用原創 #12 V/Q 圖，不用 #13 Servier 圖

## 四、製作紀錄

- 2026-10-15 A＋B 組完成：`servier-respiratory-tract`(#1)、`servier-larynx`(#2，杓狀軟骨在後方前面觀看不到，改用表格說明)、`servier-lung-lobes`(#4，用投影片 9 拆開圖)、`servier-alveoli`(#5)、`servier-breathing`(#7)＋標籤檔；原創 `spirogram`(#8)、`oxygen-dissociation-curve`(#10)、`co2-transport`(#11)、`vq-matching`(#12)；**全部待使用者確認**
- 不做：#3 聲帶(喉圖冠狀切面已標聲帶)、#6 肺泡細胞(改用表格)、#13 Servier 氣體交換(使用者選 #12)
- 2026-10-15 使用者看過 A、B 組圖：刪除呼吸道全景的「橫膈」標籤(原點位是胸部輪廓線，不是橫膈)、呼吸性細支氣管改指管壁
- 2026-10-15 C 組：原創 `breathing-patterns`(#14，**待使用者確認**)；#15 聽診位置改用表格
- 2026-10-15 F 組：`servier-pneumothorax`(#19，Respiratory 投影片 15＋標籤檔 pneumothorax，刪掉不必要的氣管標籤)；原創 `chest-drainage-systems`(#23)、`tension-pneumothorax`(#21)、`flail-chest`(#22)；#20 肋膜腔與 #24 胸管位置改用表格(肺切除兩支胸管位置在 lung-cancer 已有)
- 2026-10-15 G 組：原創 `ventilator-waveforms`(標「國考不考，實習用」，正常、PEEP、分泌物鋸齒)、`artificial-airway`(氣管內管與氣切管位置)；Servier 沒有呼吸器、給氧、胸管器材圖
- 2026-10-15 H 組：沒有新圖(給氧裝置用表格)
- D–H 組圖使用者先不審查
