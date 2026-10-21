# 第 8 輪基護 A：圖片盤點(8-0c)

> 2026-10-20 建立。做法沿用第 3–6 輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線逐點核對；左標籤 align end、右標籤 start、順序一致不交叉；**每組圖做好先放進頁面，標「待使用者確認」**
> 這次只用投影片標題盤點(本機沒有 LibreOffice，不能出縮圖)；寫到該組時轉成 SVG 看過再決定用不用
> 技術步驟圖不用課本與《內外科護理技術》的照片或插圖(有版權)；需要示意時自己畫

## 一、來源與授權

| 來源 | 檔案(`~/Downloads/ServierMedicalArt-all-kits/`) | 可用的投影片 |
|---|---|---|
| Servier Medical Art(CC BY 4.0) | `SMART-Medical-acts.pptx`(11 張) | 3 量血壓、4 橈動脈與頸動脈脈搏、5 肱動脈與股動脈脈搏 |
| 同上 | `SMART-Arteries-physiology.pptx`(31 張) | 3 全身動脈(脈搏部位底圖)、30–31 動脈脈波 |
| 同上 | `SMART-Dermatology.pptx`(11 張) | 3 皮膚分層(表皮、真皮、皮下組織)：注射深度圖的底圖 |
| 同上 | `SMART-Muscles.pptx`(12 張) | 3 全身肌肉(三角肌、臀肌、股外側肌)：肌肉注射部位的底圖 |
| 同上 | `SMART-Veins.pptx`(34 張) | 6 淺層靜脈、9–10 靜脈、32 靜脈炎 |
| 同上 | `SMART-Drugs.pptx`(19 張) | 4–7 錠劑膠囊顆粒、8 眼藥水、9 吸入器、11 栓劑、15 注射液、16 軟膏、17 貼片、19 點滴 |
| 同上 | `SMART-Medical-equipment.pptx`(28 張) | 4 針筒、9 點滴、10 血壓計、19 體溫計 |
| 既有圖 | `public/knowledge-images/` 的 oxygen-therapy、airway-clearance、artificial-airway 圖 | 安全環境的用氧安全連過去，不重畫 |

不可用：OpenStax 的圖(規則)；華杏《實用基本護理學》與《內外科護理技術》的照片、插圖、步驟圖(有版權，只參考做法)

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤；表＝用表格就好

| # | 檔名(暫定) | 用在 | 內容與要標的 | 層 | 來源 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | injection-angles | injections | 皮內 10–15 度、皮下 45 度(可捏起者 90 度)、肌肉 90 度、靜脈 15–30 度；針尖到達的層次(表皮、真皮、皮下、肌肉) | 1(可用 Dermatology 3 當分層參考) | 原創 | 候選；**必做**(角度題多) |
| 2 | im-injection-sites | injections | 腹臀肌(大轉子、髂前上棘、髂嵴的 V 字定位)、背臀肌(外上四分之一，避開坐骨神經)、股外側肌(大轉子到膝的中 1/3 外側)、三角肌(肩峰下 2–3 橫指) | 1 | 原創；Muscles 3 只參考位置 | 候選；**必做** |
| 3 | z-track | injections | Z 字注射：拉開皮膚 → 注射 → 放開，藥物封在肌肉內 | 1 | 原創 | 候選 |
| 4 | servier-dosage-forms | non-parenteral-medication | 錠劑、膠囊、栓劑、眼藥水、吸入器、貼片 | 2 | Drugs 4、6、8、9、11、17 | 候選；可有可無 |
| 5 | eye-ear-instillation | non-parenteral-medication | 眼藥點在下結膜囊(下眼瞼拉成囊袋)、耳藥成人耳廓往上往後、3 歲以下往下往後 | 表 | — | 建議用表格 |
| 6 | thermoregulation | body-temperature | 下視丘體溫調節中樞、產熱(代謝、顫抖)與散熱(輻射、傳導、對流、蒸發) | 1 | 原創 | 候選 |
| 7 | fever-stages | body-temperature | 發燒三期：畏寒期(設定點上升)、發熱期、退熱期(出汗)；體溫曲線與設定點 | 1 | 原創 | 候選；**必做**(分期題多) |
| 8 | fever-patterns | body-temperature | 稽留熱、弛張熱、間歇熱、回歸熱的體溫曲線 | 1 | 原創 | 候選 |
| 9 | servier-pulse-sites | pulse-blood-pressure | 顳、頸、肱、橈、股、膕、脛後、足背動脈 | 2 | Arteries-physiology 3 或 Medical-acts 4–5 | 候選；**必做** |
| 10 | servier-bp-measurement | pulse-blood-pressure | 壓脈帶位置(肘窩上 2–3 cm)、聽診器放肱動脈、手臂與心臟同高 | 2 | Medical-acts 3 | 候選 |
| 11 | korotkoff-sounds | pulse-blood-pressure | 柯氏音五期與收縮壓、舒張壓的對應；聽診間隙 | 1 | 原創 | 候選 |
| 12 | bp-errors | pulse-blood-pressure | 壓脈帶太窄、手臂低於心臟、放氣太慢等誤差方向 | 表 | — | 建議用表格 |
| 13 | iv-fluid-tonicity | iv-therapy | 等張、低張、高張溶液與紅血球水分移動 | 1 | 原創 | 候選 |
| 14 | servier-phlebitis | iv-therapy | 正常靜脈與靜脈炎 | 2 | Veins 32 | 候選 |
| 15 | iv-complications | iv-therapy | 浸潤、外滲、靜脈炎、空氣栓塞、循環負荷過量的徵象與處置 | 表 | — | 建議用表格 |
| 16 | drip-rate | iv-therapy | 滴速公式(總量 × 滴數係數 ÷ 分鐘)與例題 | 表 | — | 用公式＋例題 |
| 17 | blood-products | blood-transfusion | 各血品保存溫度、輸注速度與時間 | 表 | — | 用表格 |
| 18 | fire-race-pass | patient-safety-environment | RACE 與 PASS 步驟 | 表 | — | 用表格 |

## 三、待決定

1. #4 劑型圖：國考考點多是給藥方法，劑型圖不一定需要；寫 B 組時看篇幅再決定
2. #9 用全身動脈圖(一張標 8 個部位)或 Medical-acts 的測量手勢圖(只有 4 個部位)：轉成 SVG 看過再選
