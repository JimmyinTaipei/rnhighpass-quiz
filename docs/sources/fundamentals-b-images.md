# 第 10 輪基護 B：圖片盤點(10-0c)

> 2026-10-22 建立。做法同第 8、9 輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)；原創 SVG 自己畫
> 標籤點位依「解剖圖標籤準確度」：放大格線逐點核對(`scripts/label-zoom-grid.py`)；左標籤 align end、右標籤 start、順序一致不交叉；**每組圖做好先放進頁面，標「待使用者確認」**
> 使用者 2026-10-21 起改用 AI 生成底圖：人體姿勢、技術手勢這類難畫準的圖，先用表格或簡單示意，**列在下表「可改 AI 底圖」欄**，等使用者提供底圖再補標籤，不自行反覆重畫
> 不可用：OpenStax 的圖；華杏《實用基本護理學》與《內外科護理技術》的照片、插圖、步驟圖；課本表 8-9 的 NPIAP 授權圖；國健署「我的餐盤」圖(用文字口訣)

## 一、Servier 可用的投影片(標題盤點)

| 套組 | 可用 |
|---|---|
| `SMART-Dermatology.pptx` | 3 皮膚分層(表皮、真皮、皮下)、10 燒傷分度、11 潰瘍 |
| `SMART-Digestive-system.pptx` | 3 消化道全景、28 結腸與直腸(造口位置底圖)、29 直腸、30 痔瘡 |
| `SMART-Urinary-system.pptx` | 3 泌尿道男女(第 9 輪已做 servier-urinary-tract，導尿頁沿用)、12 膀胱 |
| `SMART-Medical-equipment.pptx` | 7 尿液與糞便檢體瓶、8 集尿袋、22–23 骨科護具、24 病床、28 疼痛量表 |
| `SMART-People.pptx` | 15–18 老人、21–29 體重過重與肥胖(BMI 示意) |
| `SMART-Dietetics.pptx` | 食物分類圖示(六大類示意，非必要) |

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤；表＝用表格就好

| # | 檔名(暫定) | 用在(組) | 內容與要標的 | 層 | 可改 AI 底圖 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | pressure-injury-stages | pressure-injury(B) | 第一至四期、無法分期、深部組織損傷的皮膚切面；標表皮、真皮、皮下、肌肉、骨 | 1(Dermatology 3 只參考分層) | — | **必做**(分期題多) |
| 2 | pressure-points | pressure-injury(B) | 仰臥、側臥、俯臥、坐姿的受壓部位(枕骨、肩胛、薦骨、足跟、大轉子等) | 表(先做)；之後可改圖 | ✅ 人體姿勢 | 候選 |
| 3 | stoma-sites | bowel-elimination(E) | 升結腸、橫結腸、降結腸、乙狀結腸造口與迴腸造口位置，對照糞便性狀 | 2(Digestive 28) | — | ✅ 2026-10-22 servier-stoma-sites＋labels/stoma-sites.json(6 標籤)，**待使用者確認** |
| 4 | bandage-turns | bandaging(H) | 環形、螺旋、螺旋回折、8 字、人字、回反六種包紮法的示意 | 1(簡單線條) | ✅ 手臂底圖 | **必做**(種類題多) |
| 5 | ng-tube-measurement | enteral-parenteral-nutrition(D) | 鼻尖→耳垂→劍突(NEX)量長度；確認位置三法與現行 pH ≤ 5.5 | 1 | ✅ 頭頸側面 | 候選 |
| 6 | bed-positions | positioning-body-mechanics(A) | 平躺、半坐臥(Fowler)、側臥、辛氏臥位、膝胸臥位、截石臥位、垂頭仰臥 | 表(先做) | ✅ 人體姿勢 | 候選；**等 AI 底圖**，先用表 |
| 7 | heat-cold-effects | heat-cold-therapy(C) | 冷與熱對血管、代謝、神經傳導、肌肉張力的效應與反彈現象 | 表 | — | 用表 |
| 8 | enema-position | bowel-elimination(E) | 左側臥、肛管插入方向(先向臍、再沿直腸)與灌腸筒高度 | 表 | ✅ | 用表，等 AI 底圖 |
| 9 | catheter-female-male | urinary-elimination(E) | 女性與男性尿道長度、插入深度、男性提起陰莖角度 | 2(沿用 servier-urinary-tract)或表 | — | 候選 |
| 10 | braden-scale | pressure-injury(B) | 六項與總分分級 | 表 | — | 用表 |
| 11 | bmi-categories | nutrition-assessment-diets(D) | BMI 與腰圍切點 | 表 | — | 用表 |

## 三、決定

1. 必做 3 張：pressure-injury-stages(原創)、stoma-sites(Servier)、bandage-turns(原創)
2. 人體姿勢類(臥位、受壓部位、灌腸姿勢、鼻胃管量長度)**先用表格與文字**(使用者 2026-10-22 決定)；寫到該組時回報「建議製作哪些圖」，可以先畫簡單示意圖給使用者看，使用者再決定是否提供 AI 底圖
3. 既有圖沿用：servier-urinary-tract(導尿)、thermoregulation、fever-stages(冷熱療法連過去)
