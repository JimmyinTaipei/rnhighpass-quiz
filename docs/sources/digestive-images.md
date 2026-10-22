# 第 11 輪消化：圖片盤點(11-0c)

> 2026-10-22 建立。做法沿用前幾輪：Servier 官網 PPTX 向量圖 → `scripts/servier-pptx-to-svg.py` 去掉文字與背景 → 中文標籤放 `public/knowledge-images/labels/*.json`(`::figure` 疊加)
> 標籤點位依記憶「解剖圖標籤準確度」：放大格線(`scripts/label-zoom-grid.py`)逐點核對；左標籤 align end、右標籤 start、順序一致不交叉；**每張圖做好先放進頁面，標「待使用者確認」**
> 這次縮圖看過 12 張(本 session scratchpad `r11/servier/sheet.png`)
> 課本(內外科護理學、兒科護理學、內外科護理技術)的圖有版權，不用；需要示意時自己畫；兒科先天異常與姿勢類先用表格(記憶「圖先用表格」)，寫到時再回報建議

## 一、來源與授權

| 來源 | 檔案(`~/Downloads/ServierMedicalArt-all-kits/`) | 可用的投影片 |
|---|---|---|
| Servier Medical Art(CC BY 4.0) | `SMART-Digestive-system.pptx`(40 張) | 3 消化道全景、6–7 口腔、10 唾液腺、12 牙齒、**13 胃分區**、14 胃淋巴、**15 胃壁細胞(主細胞、壁細胞、黏液頸細胞)**、16 蠕動、17 肝臟、**18 肝小葉**、19 膽汁分泌、20–22 胰臟、24–25 小腸、**26 絨毛**、27 分節運動、**28 大腸分段**(第 10 輪已用於 stoma-sites)、29 直腸、**30 痔瘡**、31 胃潰瘍、**32 裂孔疝氣三型**、**33 GERD 括約肌開關**、34 肝腫大、**35 肝硬化**、**36 Crohn 病**、37 息肉、38 大腸癌分期、**39 膽結石與膽囊炎** |
| 既有圖 | `public/knowledge-images/servier-stoma-sites.svg`(第 10 輪，待使用者確認) | 腸造口位置；lower-gi-disorders 連 bowel-elimination#stoma，不重做 |

## 二、圖片清單

層：1＝原創 SVG；2＝Servier 底圖＋中文標籤；表＝用表格就好

| # | 圖 | 層 | 用在 | 必做 | 備註 |
|---|---|---|---|---|---|
| 1 | 消化道全景(食道、胃、肝、膽囊、胰、十二指腸、小腸、大腸、闌尾、直腸) | 2(s3 右) | gi-anatomy-physiology | ✅ | 只留一個人形，裁掉左半 |
| 2 | 胃分區(賁門、胃底、胃體、胃竇、幽門、十二指腸) | 2(s13 左) | gi-anatomy-physiology、upper-gi-disorders | ✅ | 胃潰瘍好發胃小彎、十二指腸潰瘍好發球部 |
| 3 | 胃腺細胞(壁細胞：HCl、內在因子；主細胞：胃蛋白酶原；黏液頸細胞) | 2(s15 右三個細胞) | gi-anatomy-physiology | ✅ | 106-2_MS_013、生解胃 14 題只涵蓋 1 |
| 4 | 小腸絨毛(上皮、杯狀細胞、微血管、乳糜管) | 2(s26) | gi-anatomy-physiology | ✅ | 脂肪經乳糜管吸收 |
| 5 | 肝小葉(中央靜脈、肝竇、庫佛氏細胞、門脈三聯) | 2(s18) | liver-biliary-pancreas | ✅ | 中英標籤都在 PPT 上，可直接換中文 |
| 6 | 胰臟外分泌與蘭氏小島 | 2(s21 局部)或表 | liver-biliary-pancreas | — | 寫到再看；內分泌部分已在 glucose-homeostasis |
| 7 | 膽汁與膽紅素代謝、三型黃疸(溶血性、肝細胞性、阻塞性) | 1 | liver-biliary-pancreas、lab/liver-function | ✅ | 原創流程圖：血紅素 → 非結合膽紅素 → 肝結合 → 膽汁 → 尿膽素原 → 糞膽素；三型黃疸的血、尿、糞變化用表 |
| 8 | 胃食道逆流(下食道括約肌閉合與鬆弛) | 2(s33) | upper-gi-disorders | ✅ | |
| 9 | 裂孔疝氣三型(滑動型、食道旁型、混合型) | 2(s32) | upper-gi-disorders | ✅ | 111-1_MS_013 滑動型占多數 |
| 10 | 痔瘡(內痔、外痔與齒狀線) | 2(s30) | lower-gi-disorders | ✅ | 移交題 5 題 |
| 11 | Crohn 病與正常大腸(跳躍性病灶) | 2(s36) | lower-gi-disorders | — | Crohn 與 UC 比較用表為主，圖是加分 |
| 12 | 肝硬化與門脈高壓側枝循環(食道靜脈曲張、海蛇頭、痔) | 1 | liver-cirrhosis | ✅ | 原創：門靜脈、脾靜脈、側枝三處；s35 肝硬化外觀可當小圖 |
| 13 | 膽結石與膽囊炎 | 2(s39) | biliary-pancreatic | — | |
| 14 | 兒科先天消化道異常(食道閉鎖五型、幽門狹窄、巨結腸症、腸套疊) | 表 | pediatric-gi | — | 先用表；食道閉鎖 C 型最常見(近端盲端＋遠端瘻管)，寫到時回報是否要原創示意 |
| 15 | 胃切除重建(Billroth I／II) | 1 或表 | upper-gi-disorders | — | 傾倒症候群機轉；寫到再決定 |
| 16 | 內視鏡與檢查(胃鏡、大腸鏡、ERCP、肝切片姿勢) | 表 | gi-diagnostic-procedures | — | 姿勢類先用表 |

## 三、待使用者確認

每張做好後列在 knowledge-progress.md「第 11 輪需確認清單」
