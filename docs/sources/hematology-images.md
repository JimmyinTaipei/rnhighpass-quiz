# 第 12 輪血液：圖片盤點(12-0c)

> 2026-10-22 建立。做法沿用前幾輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線(`scripts/label-zoom-grid.py`)逐點核對；左標籤 align end、右標籤 start、順序一致不交叉；**每張圖做好先放進頁面，標「待使用者確認」**
> 縮圖在本 session scratchpad `r12/servier/sheet.png`(30 張)
> 課本(內外科護理學、兒科護理學)的圖有版權，不用

## 一、來源與授權

| 來源 | 檔案(`~/Downloads/ServierMedicalArt-all-kits/`) | 可用的投影片 |
|---|---|---|
| Servier Medical Art(CC BY 4.0) | `SMART-Blood-immunology.pptx`(30 張) | 3 紅血球生成(前紅血球母細胞 → 網狀紅血球 → 紅血球)、4–5 紅血球與異常形態(球形、棘狀)、**6 鐮刀型紅血球**、7 骨髓系生成、8–10 嗜中性／嗜酸性／嗜鹼性球、11 單核球與巨核細胞 → 血小板、12 血小板、13–14 單核球、15 淋巴系生成、16 淋巴球、**17 造血全圖**、28 纖維蛋白、**29 止血三階段(血管受損 → 血小板栓 → 纖維蛋白血塊)** |
| 既有圖 | `antithrombotic-drug-sites.svg`(原創，第 1 輪心血管)：血小板活化、凝血因子、纖溶與藥物作用點 | anticoagulants、antiplatelets、thrombolytics 已用；blood-hemostasis 連過去，不重做藥物版 |
| 既有圖 | `servier-thrombus-infarct.svg`、`servier-venous-thrombosis.svg`(第 5 輪病理) | thrombosis-embolism-infarction 已用 |

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤；表＝用表格就好

| # | 圖 | 層 | 用在 | 必做 | 備註 |
|---|---|---|---|---|---|
| 1 | 造血(多能幹細胞 → 骨髓系／淋巴系 → 紅血球、血小板、各白血球) | 2(s17) | blood-hemostasis | ✅ | 再生不良性貧血三系減少、EPO 作用點 |
| 2 | 凝血瀑布(內在、外在、共同路徑；維生素 K 依賴因子；PT 與 aPTT 測哪一段；纖維蛋白溶解與 D-dimer) | 1 | blood-hemostasis、coagulation-tests、bleeding-disorders | ✅ | 計畫指定的原創圖；血友病 VIII、IX 與 vWF 標在路徑上 |
| 3 | 止血三階段(血管收縮 → 血小板栓 → 纖維蛋白血塊) | 2(s29) | blood-hemostasis | — | 先用列點；thrombosis-embolism-infarction#hemostasis 已有文字 |
| 4 | 紅血球形態(正常、小球低色素、巨球、鐮刀、球形) | 表 | anemias | — | 用 MCV 分類表就好；s6 鐮刀型可當小圖，寫到再看 |
| 5 | 貧血分類(MCV 小、正、大) | 表 | anemias | — | complete-blood-count#anemia 已有，連過去 |
| 6 | 血友病關節出血好發部位 | 表 | bleeding-disorders | — | 膝 > 肘 > 踝；姿勢類先用表 |

## 三、待使用者確認

每張做好後列在 knowledge-progress.md「第 12 輪需確認清單」
