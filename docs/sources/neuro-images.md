# 第 3 輪神經與感官：圖片盤點(3-0b)

> 2026-10-06 建立。規則見 [knowledge-roadmap.md](../knowledge-roadmap.md)「圖與表」與 `content/knowledge/README.md`「圖片」；計畫檔 `~/.claude/plans/plan-glowing-sunset.md`
> 使用者決定：擬真解剖以 **Servier Medical Art** 為主、Gray's／Blausen 補缺；中文標籤用「標籤疊加元件」(`::labeled-figure`＋`public/knowledge-images/labels/*.json`)，底圖檔不寫中文
> 候選圖已下載到 session scratchpad(`servier/img/`、`servier/pptx_n/`、`commons/`)，**不進 repo**；選定後才轉檔放進 `public/knowledge-images/` 並登記 credits.json

## 一、授權查核結果

| 來源 | 查核方式 | 結果 |
|---|---|---|
| Servier Medical Art 官網 smart.servier.com | 首頁與每張投影片頁尾的授權聲明 | **CC BY 4.0**，可修改、可商用，需標示「Servier Medical Art(smart.servier.com)，CC BY 4.0」 |
| Servier 在 Wikimedia Commons 的副本 | Commons API extmetadata | 標成 **CC BY-SA 3.0**，而且多半只有 300–600px → **不用 Commons 副本，一律從官網下載** |
| Patrick J. Lynch 腦圖(Commons) | Commons API | **CC BY 2.5**，作者原圖；注意同系列有些語言版本被別人改成 CC BY-SA 3.0(it、vi 版)，只用作者原檔 |
| Blausen Medical(Commons) | Commons API | CC BY 3.0(英文標籤印在圖上)；同系列 ar 版是 CC BY-SA 4.0，不用 |
| NEI 視力模擬照(Commons) | Commons API＋來源 nei.nih.gov | Public Domain(美國政府) |
| Scientific Animations 血腫圖 | Commons API | CC BY-SA 4.0 → 不用，改原創 SVG |

## 二、解析度問題與做法

- Servier 官網單張 PNG 多數只有 **400–550px 寬**(例：腦外側面 543px、眼球 411px、脊髓切面 313px)，放大會糊
- 但官網另有每個系統的 **PowerPoint 檔**(例：SMART-Nervous-system.pptx，40 張投影片)，圖是 **PowerPoint 向量圖形**(整份只有 7 個點陣檔)
- **做法**：PPTX → LibreOffice(本機已有 `/Applications/LibreOffice.app`)轉 PDF／SVG → 只留圖形、刪掉投影片標題、背景與英文標籤 → 存成 SVG 底圖 → 中文標籤放 labels JSON
- 好處：任何放大倍率都清楚、檔案小；credits 的 `modified` 寫「由官方 PPTX 向量圖轉出，移除英文標籤與背景」
- 已確認的 PPTX：神經系統(SMART-Nervous-system.pptx)；聽覺、視覺系統的 PPTX 在 J 組前再下載確認

## 三、圖片清單

層：1＝原創 SVG 示意圖；2＝授權底圖＋中文標籤(疊加元件)；3＝NEI 照片(PD)

### 3a 解剖生理＋藥理

| # | 檔名(暫定) | 用在 | 要表達 | 層 | 候選來源 | 授權 | 狀態 |
|---|---|---|---|---|---|---|---|
| 1 | neuron-structure | neuron-synapse | 樹突、細胞體、軸丘、軸突、髓鞘、蘭氏結、軸突終端 | 2 | Servier neuron(PPTX 神經細胞投影片或 2657px PNG) | CC BY 4.0 | ✅ servier-neuron.svg |
| 2 | glial-cells | neuron-synapse | 星狀膠細胞、寡突膠細胞、微膠細胞、室管膜細胞(＋許旺細胞) | 2 | Servier astrocyte／oligodendrocyte／microglia／ependymal-cell 拼成一張 | CC BY 4.0 | ✅ servier-neural-tissue.svg(Neural cells 投影片 12) |
| 3 | action-potential | neuron-synapse | 靜止膜電位、去極化、再極化、過極化、閾值與離子通道 | 1 | 原創 | 原創 | ✅ action-potential.svg |
| 4 | chemical-synapse | neuron-synapse | 突觸小泡、突觸間隙、受體、回收 | 2 | Servier synapse-view | CC BY 4.0 | ✅ servier-synapse.svg |
| 5 | neuromuscular-junction | neuron-synapse、cholinergic-drugs | 運動終板、ACh、AChE、NMB 與 AChEI 作用點 | 2 | Servier neuromuscular-synapse-sagittal | CC BY 4.0 | ✅ servier-neuromuscular-junction.svg |
| 6 | spinal-cord-cross-section | spinal-cord-spinal-nerves | 前角、後角、側角、白質柱、中央管、前後根、背根神經節 | 2 | Servier spinal cord sections(PPTX 投影片 23–25) | CC BY 4.0 | ✅ servier-spinal-cord-section.svg |
| 7 | spinal-tracts | spinal-cord-spinal-nerves | 皮質脊髓徑、脊髓視丘徑、後柱內側蹄系的交叉位置 | 1 | 原創 | 原創 | ✅ spinal-tracts.svg |
| 8 | reflex-arc | spinal-cord-spinal-nerves | 受器 → 感覺神經元 → 中間神經元 → 運動神經元 → 動器；膝反射 | 1 | 原創 | 原創 | ✅ reflex-arc.svg |
| 9 | dermatomes | spinal-cord-spinal-nerves、spinal-cord-injury | C6 拇指、T4 乳頭、T10 肚臍、L1 鼠蹊、L4 膝前、S1 足外側 | 2 | Servier dermatomes(PPTX 投影片 26) | CC BY 4.0 | ✅ servier-dermatomes.svg |
| 10 | brain-lobes | brain-anatomy | 額、頂、顳、枕葉、小腦、腦幹與中央溝、外側溝 | 2 | Servier brain-area(彩色腦葉) | CC BY 4.0 | ✅ servier-brain-lobes.svg |
| 11 | brain-functional-areas | brain-anatomy | 初級運動區、初級體感覺區、布洛卡區、韋尼克區、視覺與聽覺皮質、前額葉 | 2 | 改用 #10 四葉圖＋labels/brain-functional-lobes.json(使用者認為 Servier 功能區圖的聽覺區、韋尼克區位置不準，2026-10-06) | CC BY 4.0 | ✅ servier-brain-lobes.svg |
| 12 | brain-sagittal | brain-anatomy | 胼胝體、視丘、下視丘、腦下垂體、中腦、橋腦、延腦、小腦、第四腦室 | 2 | Servier brain-sagittal／whole-brain | CC BY 4.0 | ✅ servier-brain-sagittal.svg |
| 13 | brain-horizontal | brain-anatomy | 基底核(尾核、殼核、蒼白球)、內囊、視丘、側腦室、第三腦室 | 2 | Servier brain-coronal(官網命名是 coronal，實際是水平切面)／Brain sections 投影片 18–19 有真正冠狀切面再比較 | CC BY 4.0 | ✅ servier-brain-horizontal.svg |
| 14 | brainstem | brain-anatomy、cranial-nerves | 中腦、橋腦、延腦與腦神經出處 | 2 | Servier brainstem(投影片 21–22) | CC BY 4.0 | ✅ servier-brainstem.svg |
| 15 | csf-ventricles | brain-anatomy、increased-icp | 側腦室 → 室間孔 → 第三腦室 → 導水管 → 第四腦室 → 蜘蛛膜下腔 → 蜘蛛膜顆粒 | 2 | Servier cerebrospinal-fluid(投影片 13)＋流向箭頭 | CC BY 4.0 | ✅ servier-csf-ventricles.svg |
| 16 | meninges | brain-anatomy、head-injury | 頭皮、顱骨、硬腦膜、蜘蛛膜、蜘蛛膜下腔、軟腦膜 | 2 | Servier meninges(投影片 27) | CC BY 4.0 | ✅ servier-meninges.svg |
| 17 | circle-of-willis | brain-anatomy、stroke | 前交通、前大腦、內頸、後交通、後大腦、基底、椎動脈 | 2 | Servier circle-of-willis(投影片 17) | CC BY 4.0 | ✅ servier-circle-of-willis.svg |
| 18 | cranial-nerves-base | cranial-nerves | 腦底觀 12 對腦神經(第 I–XII 對) | 2 | Patrick J. Lynch「Brain human cranial nerves.svg」(無文字、依神經上色、風格與 Servier 接近) | CC BY 2.5 | ✅ lynch-cranial-nerves.svg |
| 18a | limbic-system | brain-anatomy | 扣帶迴、穹窿、乳頭體、杏仁核、海馬迴 | 2 | Servier Brain (5) | CC BY 4.0 | ✅ servier-limbic-system.svg |
| 19 | autonomic-nervous-system | autonomic-nervous-system | 交感(胸腰)與副交感(腦薦)的起源、神經節位置、目標器官效應 | 1 | 原創(Servier 交感／副交感投影片 31–32 只有器官圖示，缺神經節與受體，可借器官小圖) | 原創＋CC BY 4.0 | 待畫 |
| 20 | autonomic-receptors | autonomic-nervous-system、cholinergic／adrenergic-drugs | 節前 ACh(N)、節後 ACh(M)／NE(α、β)、腎上腺髓質、藥物作用點 | 1 | 原創 | 原創 | 待畫 |

### 3b 神經疾病

| # | 檔名(暫定) | 用在 | 要表達 | 層 | 候選來源 | 授權 | 狀態 |
|---|---|---|---|---|---|---|---|
| 21 | gcs-pupils-posture | neuro-assessment | 瞳孔大小與對光反射(含單側散大)、去皮質 vs 去大腦姿勢 | 1 | 原創 | 原創 | 待畫 |
| 22 | monro-kellie | increased-icp | 腦組織、血液、腦脊髓液三者代償 | 1 | 原創 | 原創 | 待畫 |
| 23 | brain-herniation | increased-icp | 扣帶迴下、天幕下(鉤迴)、小腦扁桃體、中央型 | 1 | 原創(底圖可用 #13 冠狀切面輪廓) | 原創 | 待畫 |
| 24 | icp-waveform | icp-monitoring | P1、P2、P3 與順應性下降時 P2 > P1 | 1 | 原創 | 原創 | 待畫 |
| 25 | evd-setup | icp-monitoring | 腦室引流管、零點(外耳道／Monro 孔)、滴室高度 | 1 | 原創 | 原創 | 待畫 |
| 26 | epidural-vs-subdural | head-injury | 雙凸透鏡狀 vs 新月狀、動脈 vs 靜脈、清醒期 | 1 | 原創(Commons 現成圖是 CC BY-SA，不用) | 原創 | 待畫 |
| 27 | sci-levels-function | spinal-cord-injury | C3–C5 呼吸、C6–C7、T6 以上自主神經反射異常、各層級功能 | 1 | 原創(可疊在 #9 皮節底圖) | 原創 | 待畫 |
| 28 | stroke-types | stroke | 缺血性 vs 出血性 | 2 | Servier ischemic／hemorrhagic stroke(投影片 34–35) | CC BY 4.0 | 候選 |
| 29 | stroke-territories | stroke | 前、中、後大腦動脈供應區與對應症狀 | 1 | 原創(用 #10 外側面輪廓上色) | 原創 | 待畫 |
| 30 | parkinson-substantia-nigra | parkinson-disease | 正常 vs 巴金森黑質色素流失 | 2 | Servier parkinson(投影片 38) | CC BY 4.0 | 候選 |
| 31 | sciatic-disc | cranial-nerve-spine-disorders | 坐骨神經走向、椎間盤突出壓迫神經根 | 2 | Servier sciatic-nerve(投影片 30)＋原創椎間盤示意 | CC BY 4.0＋原創 | 候選 |
| 32 | neural-tube-defects | pediatric-neuro | 隱性脊柱裂、脊髓膜膨出、脊髓脊髓膜膨出比較 | 1 | 原創 | 原創 | 待畫 |

### 3c 感官

| # | 檔名(暫定) | 用在 | 要表達 | 層 | 候選來源 | 授權 | 狀態 |
|---|---|---|---|---|---|---|---|
| 33 | eye-structure | special-senses、eye-disorders | 角膜、虹膜、瞳孔、水晶體、睫狀體、玻璃體、視網膜、黃斑、視神經盤 | 2 | Servier SMART-Ophthalmology.pptx 投影片 5 | CC BY 4.0 | ✅ servier-eye-section.svg＋labels/eye-section.json |
| 34 | aqueous-flow-glaucoma | eye-disorders | 房水流向、隅角、隅角開放 vs 隅角閉鎖 | 2 | Servier SMART-Ophthalmology.pptx 投影片 16(左右分開) | CC BY 4.0 | ✅ servier-glaucoma-open-angle.svg、servier-glaucoma-closed-angle.svg＋labels |
| 35 | retina-layers | special-senses | 桿細胞、錐細胞、雙極細胞、神經節細胞 | 2 | Servier smart-retina | CC BY 4.0 | 候選 |
| 36 | visual-pathway-defects | special-senses | 視神經、視交叉、視徑、外側膝狀體、視放射與各處損傷的視野缺損 | 1 | 原創 | 原創 | ✅ visual-pathway.svg(含四處損傷的視野圖) |
| 37 | refraction-errors | special-senses | 正視、近視、遠視、散光的焦點位置 | 2 | 改為原創 | 原創 | ✅ refraction.svg |
| 38 | extraocular-muscles | special-senses | 六條眼外肌與支配神經(LR6 SO4) | 2 | Servier eye-muscles | CC BY 4.0 | 候選 |
| 39 | lacrimal-apparatus | special-senses | 淚腺、淚點、淚小管、鼻淚管 | 2 | Servier tear-duct | CC BY 4.0 | 候選 |
| 40 | vision-simulation | eye-disorders | 正常、青光眼(視野縮窄)、白內障、黃斑部退化、糖尿病視網膜病變看到的畫面 | 3 | NEI Eye disease simulation 系列 | Public Domain | 候選(青光眼、正常已確認；其餘待查) |
| 41 | ear-structure | special-senses、ear-disorders | 外耳、鼓膜、三小聽骨、耳咽管、耳蝸、半規管 | 2 | Servier SMART-ENT.pptx 投影片 11 | CC BY 4.0 | ✅ servier-ear.svg＋labels/ear.json |
| 42 | inner-ear | special-senses、ear-disorders | 耳蝸、前庭、半規管、聽神經；柯蒂氏器 | 2 | Servier inner-ear、organ-of-corti | CC BY 4.0 | 候選 |

## 四、合計

- 第一層原創 SVG：17 張(#3、7、8、19–27、29、32、36 等)
- 第二層授權底圖＋中文標籤：24 張(Servier 23、Lynch 1)
- 第三層 NEI 照片：1 組
- CC BY-SA：**0 張**(找到的 BY-SA 版本都有 CC BY 或 PD 的替代)

## 五、使用者決定(2026-10-06)

1. ✅ Servier 風格可以
2. ✅ #11 腦功能區沿用 Servier 分區上色，英文標籤刪除，改用中文正確名稱(前運動區與初級運動區分開)
3. ✅ #9 皮節只標 6 個標誌點：C6 拇指、T4 乳頭、T10 肚臍、L1 鼠蹊、L4 膝前、S1 足外側
