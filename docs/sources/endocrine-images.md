# 第 4 輪內分泌：圖片盤點(4-0b)

> 2026-10-14 建立。做法沿用第 3 輪([neuro-images.md](neuro-images.md))：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加，可切換中／英／隱藏)
> 計畫檔 `~/.claude/plans/supabase-golden-brook.md`；標籤點位依記憶「解剖圖標籤準確度」：放大格線逐點核對，每組圖先截圖給使用者確認
> 使用者 2026-10-14 確認 #1–#12 可用，另加 #14 下視丘核區圖
> 候選檔下載在 session scratchpad(`servier/`)，**不進 repo**；選定後才轉檔放進 `public/knowledge-images/` 並登記 credits.json

## 一、來源與授權

| 來源 | 檔案 | 結果 |
|---|---|---|
| Servier Medical Art 官網 | `https://smart.servier.com/wp-content/uploads/2016/10/SMART-Endocrinology.pptx`(14 張投影片) | CC BY 4.0(投影片頁尾聲明)；圖上沒有文字標籤，全是向量 |
| Servier Medical Art 官網 | `https://smart.servier.com/wp-content/uploads/2016/10/SMART-Diabetes.pptx`(13 張) | CC BY 4.0 |
| 既有原創圖 | `raas-drug-sites.svg`、`insulin-secretion-pd.svg`、`incretin-dpp4.svg`、`insulin-glut4-pd.svg`、`servier-brain-sagittal.svg` | 直接沿用，不重做 |

credits 的 `modified` 寫「由官方 PPTX 向量圖轉出，移除背景與英文標籤，中文標籤另疊加」

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤

| # | 檔名(暫定) | 用在 | 要標的 | 層 | 來源 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | servier-pituitary | hypothalamus-pituitary、pituitary-disorders | 下視丘神經核、漏斗柄、門脈系統、前葉、後葉 | 2 | Endocrinology 投影片 3(右圖) | 候選 |
| 2 | servier-thyroid | thyroid-parathyroid、parathyroid-disorders | 左右葉、峽部；後面圖標 4 個副甲狀腺 | 2 | Endocrinology 投影片 5(前後兩圖) | 候選 |
| 3 | servier-adrenal-kidney | adrenal-glands | 腎上腺位置、皮質、髓質(縱切面) | 2 | Endocrinology 投影片 6 | 候選 |
| 4 | servier-adrenal-layers | adrenal-glands、cushing-syndrome | 被膜、絲球帶(醛固酮)、束狀帶(皮質醇)、網狀帶(雄性素)、髓質(兒茶酚胺) | 2 | Endocrinology 投影片 8(左圖) | 候選 |
| 5 | servier-pancreas-islet | glucose-homeostasis(補)、endocrine-overview | 胰頭、體、尾；胰島 α、β、δ 細胞與外分泌腺泡 | 2 | Endocrinology 投影片 12 | 候選 |
| 6 | servier-goiter | hyperthyroidism、hypothyroidism | 正常甲狀腺 vs 甲狀腺腫(頸部位置、氣管) | 2 | Endocrinology 投影片 13 | 候選 |
| 7 | servier-thyroid-cancer | thyroid-nodules-cancer | 結節或腫瘤位置、氣管、甲狀軟骨 | 2 | Endocrinology 投影片 14 | 候選 |
| 8 | servier-diabetic-foot | diabetes(I 組補) | 足底壓力點潰瘍 | 2 | Diabetes 投影片 9 | 候選 |
| 9 | servier-monofilament | diabetes(I 組補) | 單股尼龍線檢查足底感覺、施力到線彎曲 | 2 | Diabetes 投影片 11 | 候選 |
| 10 | endocrine-glands-overview | endocrine-overview | 全身內分泌腺位置(下視丘、腦下垂體、松果腺、甲狀腺、副甲狀腺、胸腺、腎上腺、胰島、卵巢、睪丸) | 1 | 原創(Servier 沒有全身圖) | 待做 |
| 11 | hormone-feedback-axes | endocrine-overview、cushing-syndrome、hypothyroidism | 下視丘 → 腦下垂體 → 標的腺的負回饋；HPA(CRH-ACTH-皮質醇)、HPT(TRH-TSH-T3/T4)兩軸並列，標出原發與次發病變位置 | 1 | 原創 | 待做 |
| 12 | calcium-regulation | thyroid-parathyroid、parathyroid-disorders、bone-calcium-drugs | PTH、維生素 D、降鈣素對骨、腎、腸的作用 | 1 | 原創 | 待做 |
| 14 | hypothalamic-nuclei | hypothalamus-pituitary、brain-anatomy(回補) | 國考常考的下視丘核區：視上核與室旁核(ADH、催產素 → 後葉)、視交叉上核(晝夜節律)、弓狀核(釋放激素 → 門脈 → 前葉)、腹內側核(飽食中樞)、外側區(飢餓中樞)、前區(散熱)與後區(產熱)、乳頭體；與視交叉、腦下垂體前後葉的相對位置 | 1 | 原創(使用者 2026-10-14 要求；Servier 投影片 3 只有未標示的神經元點) | 待做 |
| 13 | adh-di-siadh | diabetes-insipidus-siadh | ADH 作用在集尿管；中樞性 DI、腎因性 DI、SIADH 的病變位置與尿量、血鈉 | 1 | 原創(若表格已夠清楚可不做) | 待決定(預設先用表格) |

不另做：RAAS 沿用 `raas-drug-sites.svg`；腦下垂體在腦中的位置沿用 `servier-brain-sagittal.svg`；視交叉受壓沿用 `visual-pathway.svg`(雙顳側偏盲)

## 三、不用的投影片

- Endocrinology 投影片 4 乳房、9 胸腺、10 子宮、11 睪丸：屬其他輪(胸腺可在 #10 全身圖用原創)
- Endocrinology 投影片 7、8 右圖血管：細胞層次比國考需要的深
- Diabetes 投影片 3 與 Endocrinology 12 重複；4–6 採血與試紙、7 視網膜病變(eye-disorders 已有內容)、8 腎病變、10、12、13：目前頁面用文字與表格即可
