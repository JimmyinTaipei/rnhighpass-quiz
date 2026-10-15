# 第 5 輪病理總論與遺傳：圖片盤點(5-0b)

> 2026-10-14 建立。做法沿用第 3、4 輪([neuro-images.md](neuro-images.md)、[endocrine-images.md](endocrine-images.md))：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線逐點核對；**每組圖先截圖給使用者確認**
> 候選縮圖在 session scratchpad(`servier5/*_sheet.png`)，**不進 repo**；選定後才轉檔放進 `public/knowledge-images/` 並登記 credits.json
> 病理概念圖(細胞變化、壞死型態、遺傳譜系)在 Servier 裡大多沒有，以原創 SVG 為主

## 一、來源與授權

| 來源 | 檔案 | 結果 |
|---|---|---|
| Servier Medical Art | `~/Downloads/ServierMedicalArt-all-kits/SMART-Veins.pptx`(34 張) | CC BY 4.0；水腫、靜脈血栓、靜脈瓣、微血管可用 |
| Servier Medical Art | `SMART-Arteries-atherothrombosis.pptx`(28 張) | CC BY 4.0；動脈粥樣到血栓、血栓位置與後果(梗塞) |
| Servier Medical Art | `SMART-Genetics.pptx`(7 張) | CC BY 4.0；核型、染色體與對偶基因、減數與有絲分裂 |
| Servier Medical Art | `SMART-Intracellular-components.pptx`、`SMART-Tissues.pptx`、`SMART-Cell-membrane.pptx`、`SMART-Nucleic-acids.pptx` | CC BY 4.0；粒線體、細胞核、動物細胞全圖、上皮種類(化生用) |
| 既有圖 | `antithrombotic-drug-sites.svg`、`frank-starling.svg` | 沿用；血栓頁連到抗血栓藥作用位置圖 |

不可用：OpenStax 的圖(規則)；Robbins 的圖(有版權，只參考)

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤

| # | 檔名(暫定) | 用在 | 內容與要標的 | 層 | 來源 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | cell-adaptation | cell-injury-adaptation | 正常細胞 → 肥大、增生、萎縮、化生四格；每格一句定義與例子 | 1 | 原創 | 候選 |
| 2 | servier-metaplasia | cell-injury-adaptation | 偽複層纖毛柱狀上皮 → 複層鱗狀上皮(吸菸者支氣管)；柱狀 → 鱗狀 | 2 | Tissues 投影片 9、8 | 候選 |
| 3 | cell-injury-necrosis-apoptosis | cell-injury-adaptation | 可逆傷害(腫脹、泡狀凸出、粒線體腫脹) → 壞死(核濃縮→碎裂→溶解、膜破裂、發炎) vs 凋亡(皺縮、凋亡小體、無發炎) | 1 | 原創；粒線體、細胞核可參考 Intracellular 投影片 5、9 | 候選 |
| 4 | necrosis-types | cell-injury-adaptation | 凝固性(心肌)、液化性(腦、膿瘍)、乾酪性(結核)、脂肪性(胰臟)、纖維蛋白樣(血管)比較表＋小圖示 | 1(表格為主) | 原創 | 候選；可能只用表格 |
| 5 | starling-edema | edema-shock | 微血管動脈端與靜脈端的靜水壓、膠體滲透壓箭頭；水腫四機轉(靜水壓↑、膠體壓↓、通透性↑、淋巴阻塞) | 1 | 原創；底圖參考 Veins 投影片 31 | 候選 |
| 6 | servier-edema | edema-shock | 皮下組織正常 vs 水腫 | 2 | Veins 投影片 27–28 | 候選 |
| 7 | shock-stages | edema-shock | 休克分類(低血容、心因、分布性、阻塞)與代償期 → 進行期 → 不可逆期 | 1 | 原創 | 候選 |
| 8 | virchow-triad | thrombosis-embolism-infarction | 血流停滯、內皮傷害、高凝血狀態三角形，各角舉臨床例 | 1 | 原創 | 候選 |
| 9 | servier-venous-thrombosis | thrombosis-embolism-infarction | 靜脈瓣後方血栓形成到阻塞 | 2 | Veins 投影片 34 | 候選 |
| 10 | servier-atherothrombosis | thrombosis-embolism-infarction | 斑塊破裂 → 動脈血栓 | 2 | Atherothrombosis 投影片 14 | 候選 |
| 11 | servier-infarct | thrombosis-embolism-infarction | 血栓位置與下游缺血(梗塞範圍) | 2 | Atherothrombosis 投影片 18 | 候選 |
| 12 | embolism-routes | thrombosis-embolism-infarction | 下肢 DVT → 右心 → 肺栓塞；左心或頸動脈 → 腦、腎、脾；脂肪、空氣、羊水栓子 | 1 | 原創 | 候選 |
| 13 | servier-karyotype | chromosomal-disorders、genetic-inheritance | 正常核型；標 21 號、性染色體 | 2 | Genetics 投影片 3 | 候選 |
| 14 | nondisjunction | chromosomal-disorders | 減數分裂不分離 → 三體／單體 | 1 | 原創；細胞外觀參考 Genetics 投影片 6 | 候選 |
| 15 | pedigree-patterns | genetic-inheritance | 五種譜系：體染色體顯性、體染色體隱性、X 性聯隱性、X 性聯顯性、粒線體(母系) | 1 | 原創 | 候選；最重要的一張 |
| 16 | punnett-carrier | genetic-inheritance | 帶因者 × 帶因者(隱性 1/4)、X 性聯帶因母親 × 正常父親 | 1 | 原創 | 候選；可能用表格 |
| 17 | servier-chromosome-alleles | genetic-inheritance | 染色體、基因座、對偶基因 | 2 | Genetics 投影片 5 | 候選 |
| 18 | vitamin-deficiency-table | nutritional-disorders | 維生素缺乏總表(A、B1、B3、B12、葉酸、C、D、K) | 表格 | — | 用表格，不畫圖 |
| 19 | burn-depth | environmental-injury | 皮膚分層與燒傷深度(表淺、淺二度、深二度、三度) | 1 或 2 | 原創，或 Dermatology kit(未盤點) | 候選；照護內容在第 14 輪，圖可共用 |

## 三、待使用者決定

1. #15 譜系圖要五種放在一張，還是每個遺傳模式各一張放在對應段落(建議分開，比較好對照)
2. #4、#16、#18 用表格就好，還是要做圖
3. #19 燒傷深度圖要在本輪畫，還是留到第 14 輪(建議本輪先畫，第 14 輪共用)
