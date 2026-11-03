# 臥位插畫製作與審核紀錄

> 2026-11-01｜內建 imagegen｜已通過：左側臥 v2、左辛氏 v2、仰臥 v1、俯臥 v2；半坐臥 v1／高坐臥 v2 已通過；第四批一般坐臥／端坐前傾位待審，全部尚未整合網站

## 使用者決定與範圍

- 非解剖圖優先，本批只製作側臥與辛氏臥位；皮膚及滑液關節不生成，其他臥位待這兩張確認後再排
- 線稿淡彩醫學教材插畫：細輪廓線、柔和色塊、簡化人物與少量陰影，維持明顯繪畫感
- 本批獨立文字生成，未輸入任何課本、照片或其他參考圖
- 僅生成無文字候選底圖；確認底圖後才處理中文標籤，標籤另行審核；不更換公開頁面、不部署
- 兩張臉部細節與視角尚未完全一致；先審姿勢，不視為同一人物與視角已完全鎖定

## 事實來源與規格

- [Clinical Procedures for Safer Patient Care：Positioning Patients in Bed](https://opentextbc.ca/clinicalskills/chapter/3-4-positioning-a-patient-in-bed/)：查文字擺位、支托與手臂不壓在身下等重點，未使用其圖片
- [Open RN Nursing Assistant：Moving and Positioning Clients](https://www.ncbi.nlm.nih.gov/books/NBK599393/)：查辛氏與側臥差異及下側手臂位置，未使用其圖片
- 左側臥：軀幹與骨盆側向、肩髖上下堆疊、雙膝適度彎曲、腿間支托、頭頸對齊
- 左辛氏：以左側為基礎、軀幹向前轉為半俯臥，上側腿前彎較多，下側腿較伸直，下側手臂置於身旁且不壓在身下
- 各教材擺臂與支托方式有差異；本批採上述配置，仍需使用者核對是否符合本網站要呈現的教學版本

## 候選版本

### 左側臥

- 狀態：待使用者審核；尚未製作標籤
- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/left-lateral/left-lateral-v1.png)
- SHA-256：c4f277647f025eefaf959ff42f63543c57316ddcc34bdd8b57dd8f2fce36114f

初查與待核對：

- 有呈現側臥、頭枕、前臂支撐及雙腿間枕頭
- 膝踝支撐範圍與下側肩臂是否受壓仍需使用者核對
- 枕頭與床墊接近畫面邊緣，未來若放標籤需增加留白

實際完整 prompt：

```text
Use case: scientific-educational, non-anatomical patient-position illustration.
Original nursing textbook illustration, unmistakably DRAWN 2D line-and-wash style: fine continuous dark gray contour lines, muted pale color fills, minimal soft watercolor shading, clean white background. Adult East Asian man in plain pale-blue short-sleeve patient shirt and loose knee-length shorts, simplified outlined face and hair, smooth skin color. No lifelike portrait, pores, glossy 3D, photographic lighting, patterned clothes or elaborate fabric texture. Simple hospital mattress on low bed base, no rail obstructing figure. Entire patient including hands and feet inside canvas, head to left and feet to right, elevated three-quarter view showing trunk rotation and both legs clearly. White margin for later labels. NO text, letters, labels, arrows, numbers, watermark or decorative borders. Two arms and two legs only. Independent composition from text, no published image as reference. Unapproved draft for nursing human review.
LEFT LATERAL SIDE-LYING, not Sims and not prone. Left side rests on mattress. Thorax and pelvis remain stacked on their sides, right shoulder directly above left shoulder and right hip above left hip, no forward chest rotation. Head/neck/spine aligned, head supported on a modest pillow, face turned naturally toward front edge of bed. Both knees gently flexed, right/top leg rests on a pillow separating knees and ankles from lower leg. Do not pull upper knee far in front of torso. Lower/left arm positioned comfortably in front of chest, not trapped under body; upper/right forearm rests on a small front pillow, both hands separately visible. A low support pillow behind back helps maintain side-lying and is visibly distinct from torso. Use just enough pillows to show support without obscuring the side-lying position. No cutaways or internal anatomy. Clearly show stacked shoulder/pelvis alignment and separation of supported legs. Wide landscape 16:9.
```

### 左辛氏臥位

- 狀態：待使用者審核；尚未製作標籤
- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/left-sims/left-sims-v1.png)
- SHA-256：07424604f1a5deacbcdd35a0078591cc7900b572c0a565e88113427b5179105c

初查與待核對：

- 有呈現軀幹前轉、上側腿前彎較多、下側腿較伸直
- 下側手出現在腰臀附近，整條手臂被軀幹遮擋，需核對其連續性與是否受壓
- 頭頸轉向、肩部負重及支托枕頭仍待確認
- 與側臥圖的鏡頭角度不完全一致，若製作比較組圖可再統一

實際完整 prompt：

```text
Use case: scientific-educational, non-anatomical patient-position illustration.
Original nursing textbook illustration, unmistakably DRAWN 2D line-and-wash style: fine continuous dark gray contour lines, muted pale color fills, minimal soft watercolor shading, clean white background. Adult East Asian man in plain pale-blue short-sleeve patient shirt and loose knee-length shorts, simplified outlined face and hair, smooth skin color. No lifelike portrait, pores, glossy 3D, photographic lighting, patterned clothes or elaborate fabric texture. Simple hospital mattress on low bed base, no rail obstructing figure. Entire patient including hands and feet inside canvas, head to left and feet to right, elevated three-quarter view showing trunk rotation and both legs clearly. White margin for later labels. NO text, letters, labels, arrows, numbers, watermark or decorative borders. Two arms and two legs only. Independent composition from text, no published image as reference. Unapproved draft for nursing human review.
LEFT SIMS SEMIPRONE POSITION, visibly distinct from pure lateral. Patient lies on left side with upper torso rotated FORWARD toward mattress, halfway from side-lying toward prone. Right/top shoulder rolled forward of left shoulder, right chest angled down toward mattress, not lying supine and not shoulders vertically stacked. Head gently turned to side on thin pillow with mouth/nose unobstructed and neck supported. Left/lower leg almost straight with only slight comfortable flexion; right/upper hip and knee distinctly flexed forward, right knee drawn forward and resting on a pillow placed in front of lower leg. Top leg flexion much greater than lower leg. Right/top forearm bent comfortably in front on a small pillow. Left/lower arm lies alongside body slightly behind the torso, visible and NOT trapped beneath chest or shoulder, not hyperextended; lower hand should remain visible near hip. The arm positions, forward torso rotation and unequal leg flexion must be readable. No blanket obscuring leg arrangement; modest shorts and shirt cover patient. No internal anatomy. Wide landscape 16:9.
```

## 接續步驟與驗證

1. 使用者確認兩張底圖的姿勢、支托、肢體與畫風；有問題另存修正版，不覆寫 v1
2. 底圖通過後才加中文標籤與重點引線，提供格線核對及手機／桌面預覽
3. 標籤通過後才整合，記錄實際 AI 生成與人工審核狀態，不自行宣稱 PD 或 CC 授權
- 已核對保存副本 SHA-256、prompt 原文與未核准狀態，圖片未放 public
- 本輪只修改審核及流程文件，未修改知識庫頁面或網站程式；未重跑與此文件變更無關的網站建置

## v2 左右側修正

- 使用者指出 v1 兩張其實為右側，先前名稱與左右側判讀有誤；保留 v1 僅供歷史追溯，不能再作為左側臥示例
- v2 將全圖水平翻轉，頭在畫面右、足在左；側臥人物改為視線朝枕面、不看鏡頭
- 使用者對辛氏原姿勢回覆「整體是 OK 的」，本次保留姿勢、只改方向；這是對原姿勢的認可，v2 改向結果仍待確認
- 初查確認兩張已翻轉，側臥視線已偏離鏡頭；仍未加標籤／未整合網站

### left-lateral v2

- 左右翻轉為左側臥，眼睛改看向枕面，不與鏡頭對視
- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/left-lateral/left-lateral-v2.png)
- SHA-256：f74be0e0d46a96a7fc409d3fad65f5534d16b142241d709de3f022b77f97f00d

```text
Edit the supplied nursing side-lying drawing. HORIZONTALLY MIRROR the entire illustration, left-to-right, so patient's HEAD is now at the RIGHT side of canvas and FEET at the LEFT. This corrects the depicted right lateral position to LEFT lateral: patient's LEFT side down against mattress, RIGHT side uppermost. Keep precisely the original limb pose, pillows, bed, clothing, proportions, line-and-pale-watercolor style and white background, mirrored as a unit. Only additional change: patient's gaze should NOT meet viewer/camera. Draw eyes gently looking DOWN toward the pillow/mattress in front of the face, relaxed eyelids, neutral resting expression. Do not twist head or change neck alignment to achieve gaze. Do not alter torso rotation, leg flexion or add/remove limbs. No text, labels, arrows or watermark. Preserve canvas aspect ratio and drawing quality. Output a single full mirrored drawing, no before/after panels.
```

### left-sims v2

- 使用者認為原姿勢整體 OK，僅左右翻轉為左辛氏
- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/left-sims/left-sims-v2.png)
- SHA-256：b60814c3af3a8fd53df4278b393dfa1da00d192baf898ebe94ae598b3d2500f7

```text
Make one precise change to the supplied Sims positioning nursing illustration: HORIZONTALLY MIRROR the entire drawing left-to-right as a unit. Patient HEAD must now be at RIGHT side of canvas and FEET at LEFT. This corrects right Sims to LEFT Sims: left side down, right upper leg flexed forward with its pillow. Preserve the approved existing semiprone torso rotation, unequal leg flexion, arm positions, head position, closed/relaxed eyes, pillows, shirt and shorts, bed, white background, thin contour lines and pale watercolor fills. Do not redesign pose or add/remove any body parts. All illustrated objects mirror together. No text, labels, arrows or watermark. Same aspect ratio. Output a single full horizontally mirrored drawing, no comparison panels.
```

## 使用者確認 v2 底圖

- 使用者回覆：「這兩版可以」
- 左側臥 v2、左辛氏 v2 均為底圖通過，後續採這兩版，不再修改姿勢或視線
- 下一步：製作中文標籤與重點引線，提供預覽另行確認
- 此確認不包含尚未製作的標籤；未整合網站、未部署

## 第二批：仰臥與俯臥

- 使用者同意開始下一批，本輪只做仰臥、俯臥；已通過的左側臥與左辛氏 v2 不更動
- 文字規格與初查來源：[Clinical Procedures for Safer Patient Care](https://opentextbc.ca/clinicalskills/chapter/3-4-positioning-a-patient-in-bed/) 之仰臥背部朝床、俯臥腹部朝床且頭轉側等基本特徵；支托配置並參照本站 positioning-body-mechanics 一般臥位段落，未輸入來源圖片
- 兩張維持頭右、腳左、眼睛閉合、淡藍短衣褲與線稿淡彩風格；不是特殊術後臥位、ARDS 俯臥通氣操作或完整照護流程
- 本批候選：仰臥 v1、俯臥 v2；俯臥 v1 因額外手臂淘汰保留追溯
- 兩張仍待使用者確認，未加中文標籤、未放 public、未部署；皮膚與其他解剖圖未生成

### supine v1

- 狀態：待使用者審核底圖
- [原尺寸圖片](../../../相關資源/AI底圖/2026-11-01-positions/supine/supine-v1.png)
- SHA-256：f4dcd46f51d11d2b6c9dc29ebabc36e9225278015cc9f0bd81b721711cbe99db

- 胸腹朝上、床面平躺、手臂置身旁、雙眼閉合
- 需核對頭枕厚度與頸部角度，以及小腿枕的範圍、足跟卸壓與腳部中立位置

實際完整 prompt：

```text
Use case: scientific-educational. Basic SUPINE nursing patient position, unlabelled draft v1.
Original nursing education illustration in the approved contour-line and pale-color-wash style. Clearly drawn 2D illustration, fine dark-gray outlines, pale blue and cream color areas, very light watercolor shading. Adult East Asian male with short dark hair in plain pale-blue short sleeve patient shirt and loose knee-length shorts. Simplified face and limbs, no photorealism, detailed skin texture, glossy surfaces, dramatic lighting or 3D rendering. White background. One simple flat mattress and low bed base. Landscape 16:9, elevated three-quarter side view, HEAD on canvas RIGHT, FEET on canvas LEFT. Entire body, bed and all supports inside frame with white margins. Two arms, two legs, normal hands/feet. Eyes gently closed, relaxed face, no eye contact with viewer. No text, labels, arrows, numbers or watermark. No cutaway anatomy. Independent composition from text, for human review.
Patient lies FLAT ON HIS BACK, back resting on mattress, chest and face upwards. Do not elevate bed head or bend him into sitting. Head, neck and trunk aligned. Small low pillow under head supports neck without chin flexing onto chest. Arms relaxed alongside body slightly separated, hands visible resting comfortably on mattress, not behind head or beneath torso. Legs extended comfortably and slightly apart, no crossed legs, toes pointing upward rather than strongly falling outward. ONE LOW BROAD soft pillow under middle-to-lower CALVES, well away from knee creases, supports both calves and raises both heels just clear of mattress; clearly show slight heel clearance. Do not place a pillow directly under knees. Keep knees nearly straight and feet neutral, no exaggerated knee flexion. No devices, restraints, invasive tubes, knee splints or unnecessary extra pillows. Composition shows shoulder/back contact, both legs and calf support clearly. Basic comfortable supported supine position, not a specific post-procedure protocol.
```

### prone v1

- 狀態：淘汰候選：多出手臂，已另產 v2
- [原尺寸圖片](../../../相關資源/AI底圖/2026-11-01-positions/prone/prone-v1.png)
- SHA-256：ce50e729ec91527a5cc4a8a8515349f83f6ea547973ec2fa1312f2e0119a540f

- 近側多出一條平伸手臂，不能用於教學

實際完整 prompt：

```text
Use case: scientific-educational. Basic PRONE nursing patient position, unlabelled draft v1.
Original nursing education illustration in the approved contour-line and pale-color-wash style. Clearly drawn 2D illustration, fine dark-gray outlines, pale blue and cream color areas, very light watercolor shading. Adult East Asian male with short dark hair in plain pale-blue short sleeve patient shirt and loose knee-length shorts. Simplified face and limbs, no photorealism, detailed skin texture, glossy surfaces, dramatic lighting or 3D rendering. White background. One simple flat mattress and low bed base. Landscape 16:9, elevated three-quarter side view, HEAD on canvas RIGHT, FEET on canvas LEFT. Entire body, bed and all supports inside frame with white margins. Two arms, two legs, normal hands/feet. Eyes gently closed, relaxed face, no eye contact with viewer. No text, labels, arrows, numbers or watermark. No cutaway anatomy. Independent composition from text, for human review.
Patient lies FLAT ON HIS STOMACH with chest, abdomen and pelvis facing mattress, shoulders and pelvis level, back upwards, not side-lying and not Sims. BOTH legs extend straight behind him side-by-side, no unilateral hip flexion or knee drawn forward. Head turned gently to viewer-facing side with unobstructed nose and mouth, on a very thin soft head support, no extreme neck twist. The arm on face-facing side bends comfortably with hand next to head, elbow not far above shoulder; opposite arm lies relaxed alongside torso, hand visible near hip. Neither arm trapped beneath trunk. Use a SMALL LOW soft pillow under distal lower legs/ankles so toes do not press into mattress, not a high knee bolster. Keep legs nearly straight, no forced knee bend or foot hyperextension. Show the pillow beneath ankles clearly, chest and pelvis support, straight legs, and both arms. No blankets hide pose. Basic prone position, not ventilated ARDS proning or operating-room positioning, no tubes or invasive devices.
```

### prone v2

- 狀態：待使用者審核底圖
- [原尺寸圖片](../../../相關資源/AI底圖/2026-11-01-positions/prone/prone-v2.png)
- SHA-256：b023814f02e1a07fa2a2bfca236d23bc90d9d3a07e6b4ad462cd48267096a725

- 已移除近側額外平伸手臂，面向側手臂彎曲置頭旁，另一臂於遠側被軀幹部分遮擋
- 需核對遠側手臂的可辨識程度、頭頸轉向及踝下枕頭支托
- 胸腹與骨盆朝床、雙腿伸直，與辛氏單側腿前彎不同

實際完整 prompt：

```text
Precise local correction of the supplied prone nursing drawing. There is an EXTRA ARM on the FRONT/NEAR edge of the torso: a long horizontal bare arm running along the lower edge of the shirt at approximately x47%-75%, y48%-55%, ending in a palm-up hand near the hip at x48%, y51%. REMOVE THAT ENTIRE EXTRA NEAR-SIDE STRAIGHT ARM AND ITS PALM-UP HAND. Fill the removed area with the underlying white mattress and a clean continuous pale-blue shirt edge where appropriate. The near-side shoulder must have ONLY ONE ARM: the existing bent arm with elbow at lower-right and hand next to face, preserve that arm and hand exactly. Keep the far-side arm visible as a narrow strip along the far upper side of torso, which lies alongside the body; do not add hands or new limbs. Final count TWO arms total, NOT three. Preserve everything else: head at right feet left, prone face-down torso and pelvis, straight legs, pillows, bed, thin contour lines and pale color washes, canvas size. No text or arrows. Do not change pose or regenerate extra body parts.
```

## 第二批底圖確認

- 使用者回覆：「好的 修正後 兩版都可以 哈哈 可以再來下一批了」
- 仰臥 v1、俯臥 v2 底圖通過，後續採這兩版；俯臥 v1 仍淘汰
- 尚未製作的中文標籤不包含在此次底圖確認中

## 第三批：半坐臥與高坐臥

- 經使用者同意接續下一批，兩張各生成 v1，均待使用者審核
- 沿用頭右腳左、閉眼、淡藍衣褲與線稿淡彩插畫；獨立文字生成，未上傳來源圖片
- 規格角度參照本站一般臥位表格；prompt 選 35／80 度作構圖目標，非新增的臨床門檻；AI 未精確遵守，後續不得直接按 prompt 數字標示角度
- 審核重點：床頭抬高差別、頭頸支托、腰臀與鉸鏈位置、膝部角度、前臂支托與肢體連續性
- 不加入臨床適應症或特殊照護宣稱；未加標籤、未放 public、未部署

### 半坐臥 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/semi-fowler/semi-fowler-v1.png)
- SHA-256：eadecb653fcd194e353381e7a36b0fcf676ab79bf6f441b2bbd253de672d1beb

- 目標為半坐臥，prompt 指定約 35 度；生成床架目測較接近範圍上緣，不能當成精確 35 度
- 床頭、骨盆與頭枕的支托，以及膝部是否過伸需核對
- 與高坐臥比較，床頭較低，但兩床外觀與手臂枕頭未完全一致

實際完整 prompt：

```text
Use case: scientific-educational. SEMI-FOWLER / semi-sitting nursing position, unlabelled v1.
Original nursing education contour-line illustration with pale color washes. Clearly DRAWN 2D: fine dark-gray outlines, pale blue/cream fills and minimal soft watercolor shading. Adult East Asian man, short dark hair, plain pale-blue short-sleeve patient shirt and loose knee-length shorts, simplified face, eyes softly closed, relaxed expression. Same restrained style as a student nursing textbook; no photograph, lifelike skin, glossy 3D, cinematic light or detailed fabric patterns. One simple adjustable hospital bed with visible mattress segments and backrest hinge at HIP level; white mattress, cream low base, no rails blocking posture. HEAD at canvas RIGHT, FEET at LEFT. Near-side view very slightly elevated to show both arms and legs, but mattress/backrest angle must be easy to judge against horizontal bed base. Entire patient, all feet, headrest and bed fit with generous white margin. Clean white background. Two arms and two legs only. NO text, labels, angle markings, numbers, arrows, watermark or panel border. Review candidate, independent text composition.
Backrest and supported torso raised APPROXIMATELY 35 DEGREES ABOVE HORIZONTAL, clearly a LOW RECLINE, not near-upright and not 60 degrees. Draw a LONG shallow inclined backrest: horizontal run longer than vertical rise. Straight neck and spine supported along raised backrest, thin pillow behind head not pushing chin onto chest. Pelvis rests at hinge between backrest and horizontal seat/mattress, no gap under lower back. Upper body inclined as one unit with head aligned, no curling forward.
Thighs rest on mostly horizontal lower mattress, knees only mildly flexed on a very shallow articulated knee section; not a tall pillow beneath knee creases. Lower legs supported along mattress, feet relaxed in neutral position, toes not dangling over edge. Both arms relaxed alongside torso: near forearm rests on thin cushion beside hip/thigh, far forearm visible at far side, hands distinct. No arms crossed on abdomen, no medical devices. Keep torso/trunk proportionate. Emphasize supported shallow raised bed head and relaxed semi-reclined posture. Landscape 16:9.
```

### 高坐臥 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/high-fowler/high-fowler-v1.png)
- SHA-256：bacdd1dcda3dfe40984948b52df54b62eab020dc4064492f1005860d7aef8a77

- 目標為高坐臥，prompt 指定約 80 度；實際床架沒有精確符合該數字，未量測前不標 80 度
- 軀幹較直立、雙前臂有支托；腰臀與床頭轉折位置待核對
- 小腿、膝部與腳部角度仍待使用者審核

實際完整 prompt：

```text
Use case: scientific-educational. HIGH-FOWLER / high-sitting nursing position, unlabelled v1.
Original nursing education contour-line illustration with pale color washes. Clearly DRAWN 2D: fine dark-gray outlines, pale blue/cream fills and minimal soft watercolor shading. Adult East Asian man, short dark hair, plain pale-blue short-sleeve patient shirt and loose knee-length shorts, simplified face, eyes softly closed, relaxed expression. Same restrained style as a student nursing textbook; no photograph, lifelike skin, glossy 3D, cinematic light or detailed fabric patterns. One simple adjustable hospital bed with visible mattress segments and backrest hinge at HIP level; white mattress, cream low base, no rails blocking posture. HEAD at canvas RIGHT, FEET at LEFT. Near-side view very slightly elevated to show both arms and legs, but mattress/backrest angle must be easy to judge against horizontal bed base. Entire patient, all feet, headrest and bed fit with generous white margin. Clean white background. Two arms and two legs only. NO text, labels, angle markings, numbers, arrows, watermark or panel border. Review candidate, independent text composition.
Backrest and supported torso raised APPROXIMATELY 80 DEGREES ABOVE HORIZONTAL, nearly UPRIGHT like sitting in bed, NOT low recline. Draw a steep near-vertical backrest, very short horizontal run compared with vertical rise. Straight neck and spine comfortably supported against backrest, small thin pillow behind head, chin neutral not flexed onto chest. Pelvis at backrest hinge, buttocks securely supported, no sliding down, no gap behind lumbar region. Shoulders relaxed, no forward hunch.
Thighs remain on mostly horizontal seat/mattress, knees only slightly flexed using shallow articulated bed knee section. Lower legs extend supported on mattress; feet at left, fully visible, not hanging off bed. Two arms relaxed with elbows gently bent, BOTH forearms supported on low cushions beside thighs, hands visible separately. No table, chair, slings, straps, tubes or devices. Should visually match the same simple bed and patient style as a semi-Fowler chart, with the high upright torso angle as the main difference. Landscape 16:9.
```

## 圖片用量查看方式

- 本輪查閱 [官方圖片生成說明](https://learn.chatgpt.com/docs/image-generation) 與 [官方用量說明](https://learn.chatgpt.com/docs/pricing?codex-pricing-plans=individual)
- 內建生成共用一般 Codex 用量，不是固定按張數額度；到 [用量頁面](https://chatgpt.com/codex/settings/usage) 查看目前剩餘用量及重設時間，CLI 可用 /status
- 此紀錄不包含帳戶餘額，也未使用另計費的 API 路徑

## 高坐臥 v2：前臂枕頭修正

- 使用者指出 (69.4%,59%) 厚墊像沙發扶手；採其允許的改為枕頭方案，兩側均改為柔軟白色枕套與可見皺褶
- 初查已呈現枕套縫線及柔軟輪廓，保留前臂支托，未刻意改變原姿勢；床頭精確角度仍未核對
- 狀態：v2 待使用者確認；半坐臥 v1 尚未收到明確核准；未加標籤、未整合網站
- [高坐臥 v2 原圖](../../../相關資源/AI底圖/2026-11-01-positions/high-fowler/high-fowler-v2.png)
- SHA-256：1681fee3ef47452e6b11b59f8ad5351a13051599a193bc0fc31f8f8f6d7db997

實際完整 prompt：

```text
Edit the supplied high-Fowler nursing illustration locally. Replace the two thick rectangular foam blocks beneath the patient's forearms, particularly the foreground block centered at x69.4%, y59%, with ordinary SOFT THIN WHITE BED PILLOWS in fabric pillowcases. They must visibly look like loose hospital sleeping pillows lying on the mattress beside thighs, not integral sofa/chair armrests. Draw rounded slightly irregular corners, a fine pillowcase seam, a few gentle cloth folds and shallow compression where forearms rest. Make cushions thinner and less box-shaped, with softly tapered ends. Adjust forearms and hands slightly downward only as needed to rest naturally on thinner pillows, with elbows still relaxed and hands visible. Far-side forearm support should match as a soft pillow, not an upholstered armrest. Do not add a new extra pillow on top of existing foam blocks: remove blocks and REPLACE them. Preserve the current patient, upright high-sitting posture, head/neck, backrest angle, legs, clothing, head pillow, bed frame, canvas, fine contour linework, pale color washes and white background. No other pose changes. No text, arrows, labels, numbers or watermark.
```

## 第三批底圖確認

- 使用者回覆：「兩張 坐臥的圖片都OK了 請幫我繼續下一批」
- 半坐臥 v1、高坐臥 v2 均底圖通過；此確認不包含未量測的精確角度或未製作的中文標籤

## 第四批：一般坐臥與端坐前傾位

- 依既定排程製作兩張無文字候選，各 v1 待使用者確認；未加標籤、未放 public、未部署
- 基本姿勢查閱 [Clinical Procedures for Safer Patient Care](https://opentextbc.ca/clinicalskills/chapter/3-4-positioning-a-patient-in-bed/)：坐臥抬高床頭、端坐前傾位採床邊坐姿及床上桌與枕頭支托；未輸入其圖片
- 一般坐臥依本站坐臥分類，以約 55 度作構圖目標；實際生成仍未量測，不能直接標成 55 度
- 端坐前傾位採床邊坐姿，不強行套用臥床圖的頭右腳左構圖，以完整呈現桌面與腳部支撐

### 一般坐臥 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/fowler/fowler-v1.png)
- SHA-256：d8a9ac108cccd60a878504ac37e8c7f453095669a15379e88392701e3a9f1cbe
- 生成圖像參考：high-fowler-v2.png

- 沿用已通過高坐臥 v2 圖片編輯，降低床頭；實際角度仍未量測，不直接標 prompt 的 55 度
- 需比較與已通過半坐臥的差別是否足夠清楚，若太接近再調整
- 前臂枕頭、頭頸對齊、腰臀支托待使用者確認

實際完整 prompt：

```text
Use the supplied high-Fowler drawing as the edit target and preserve its illustrated patient, thin gray outlines, pale watercolor washes, cream adjustable hospital bed, white fabric pillows and clean white background. Create a STANDARD FOWLER nursing position by lowering the backrest and patient's supported torso to approximately 55 degrees ABOVE HORIZONTAL, noticeably lower than this upright source but higher than a low semi-recline. Change the backrest mechanism and head pillow placement coherently to follow that lower backrest angle. Keep head/neck aligned with supported torso, eyes closed, pelvis at backrest hinge, thighs and lower legs supported on the mostly horizontal mattress. Do not slide hips forward or bend neck onto chest. Both forearms relaxed on ordinary soft white sleeping pillows with visible pillowcase seams, gentle folds and compression; NOT rectangular sofa armrests. Near-side view slightly elevated, HEAD RIGHT, FEET LEFT, entire bed and body inside canvas with white margin. Two arms/two legs only, hands/feet unchanged unless adjustment required for natural support. No text, arrows, numbers or angle marks. Review candidate, do not render photorealistically.
```

### 端坐前傾位 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/orthopneic/orthopneic-v1.png)
- SHA-256：78eb118806726e8d9a81037d8808ee12fad661fd55b0c074c580ed62a8005d8e
- 生成圖像參考：無，獨立文字生成

- 已呈現床邊坐姿、向前靠桌面枕頭、雙腳著地
- 雙手部分被枕頭與頭部遮擋，需核對手臂連續性、桌面高度與口鼻是否受壓
- 病床右側有裁切，後續標籤版需評估版面留白

實際完整 prompt：

```text
Use case: scientific-educational. An original nursing textbook drawing of ORTHOPNEIC FORWARD-LEANING POSITION, non-anatomical, unlabelled candidate.
Fine dark gray contour lines, muted pale blue and cream color fills, minimal soft watercolor shading, white background. Clearly drawn 2D illustration, not photograph, not lifelike portrait or glossy 3D. Adult East Asian man with short dark hair, simplified face, eyes softly closed, wearing plain pale-blue short-sleeve patient shirt and loose knee-length shorts. Match a calm student nursing textbook illustration.
Patient sits securely on SIDE EDGE of a simple low hospital bed with buttocks and thighs supported. Both knees bent comfortably around a right angle, both FEET FLAT ON FLOOR, not dangling. Bed is behind pelvis at canvas RIGHT. Patient faces canvas LEFT toward an overbed table immediately in front of him. Side three-quarter view slightly elevated, entire patient, feet, bed and table base visible with white margins.
Torso leans FORWARD moderately from hips toward table, not reclining backward. Overbed table top is positioned just below chest level, height adjusted to support BOTH FOREARMS on TWO SOFT WHITE PILLOWS. Pillows visibly have fabric pillowcases, seams, a few folds, rounded corners and slight compression under arms, no sofa-armrest blocks. Elbows comfortably bent on pillow support, shoulders relaxed. Forehead gently rests on top pillow/forearms with face turned slightly sideways, mouth/nose visible and unobstructed, neck not sharply flexed. Chest not pressed against table edge. Both hands readable, no extra limbs.
Table has a single stable upright support and a C-shaped wheeled base extending under bed so it cannot appear to float; no impossible overlapping tabletop through body. Simple uncluttered nursing scene. No clinician, oxygen tubing, medical devices, cutaways, labels, text, arrows, numbers or watermark. Wide landscape 16:9. This is an independent composition from text for human review, not a treatment instruction.
```

## 第四批調整：一般坐臥改低坐臥

- 使用者指出一般坐臥與半坐臥差別不明顯，要求若無獨立用途則改低坐臥
- 內容盤點：positioning-body-mechanics 的 general-positions 表格列出低坐、半坐、坐臥、高坐角度；未找到需要一般坐臥專屬底圖的段落，因此本批改低坐臥以補足比較層次，原圖保留不刪
- [低坐臥 v1 原圖](../../../相關資源/AI底圖/2026-11-01-positions/low-fowler/low-fowler-v1.png)；狀態：待使用者確認，未加標籤／未整合
- SHA-256：a99d0a0a8de120b9477711adcd6141d85f8896eeb453f24ef5152d12b3302e72
- 約 20 度是構圖目標，實際尚未量測，不宣稱精確數字

### 端坐前傾位用途與表情決定

- 本站 COPD 頁 copd.md 約第 202 行，以及 respiratory-assessment.md 約第 151、220 行，描述呼吸困難時的前傾支撐姿勢
- respiratory-assessment.md 約第 300 行的胸腔穿刺準備也使用床緣坐、雙腳支撐、頭臂靠桌面枕頭的類似姿勢
- [Cleveland Clinic：Tripod position](https://my.clevelandclinic.org/health/treatments/tripod-position) 說明前傾支撐可協助多種原因的呼吸困難，不是只對應 orthopnea 症狀
- 依使用者「若不止用於端坐呼吸則忽略加喘促表現」的條件，端坐前傾位 v1 保留中性表情，本輪不重生成、不新增病況徵象；仍待確認

### 低坐臥實際完整 prompt

```text
Edit the supplied nursing position illustration to LOW FOWLER, replacing this standard Fowler candidate. Keep same patient, soft white fabric forearm pillows (not sofa blocks), plain pale-blue shirt and shorts, cream adjustable bed, thin gray contour lines, pale watercolor washes, white background. HEAD at RIGHT and FEET LEFT. The essential change is a VERY LOW BACKREST: approximately 20 DEGREES ABOVE HORIZONTAL. The backrest is a shallow long ramp, almost flat, NOT a 40/45-degree slope. Its horizontal run must be about 2.7 times its vertical rise in near-side view. Lower the entire supported torso AND head together to this shallow incline, while pelvis stays at the mattress hinge. Head/neck aligned, eyes gently closed, thin head pillow follows low backrest and does not push chin to chest. Chest visibly much nearer horizontal than original. Adjust bed support mechanism to the low backrest. Lower mattress mostly horizontal, thighs and legs comfortably supported, knees not hyperextended; feet visible at left. Lower/soften forearm pillows as needed to keep arms naturally supported at sides. Do not simply shorten neck, bend torso forward or rotate whole canvas. Preserve two arms/two legs, natural hands, anatomy, clothing, background and line-and-wash style. Zoom out slightly so the longer shallow backrest, whole bed, head and feet fit with white margin. NO text, arrows, labels, numbers or angle marks. Single illustration, independent low-recline teaching candidate, no clinical indications included.
```

## 低坐臥底圖確認

- 使用者回覆：「低坐臥可以了 幫我進行下一批」
- 低坐臥 v1 底圖通過；不包含尚未量測的角度與未製作的中文標籤
- 端坐前傾位 v1 未收到明確核准，仍待確認，未因要求下一批而自動核准

## 第五批：屈膝仰臥與膝胸臥位

- 延續每批兩張製作，兩張均為 v1 待使用者確認；頭右腳左、閉眼、淡藍短衣褲及線稿淡彩風格
- 屈膝仰臥規格：背部與骨盆貼床、雙膝彎曲、腳底踏床，不是截石臥位；參考 [Carter Center／EPHTI Basic Clinical Nursing Skills](https://www.cartercenter.org/resources/pdfs/health/ephti/library/lecture_notes/nursing_students/ln_clin_nursing_final.pdf) 的文字定義，未使用原圖
- 膝胸臥位規格：以膝與胸部接觸床面支撐、臀部抬高，非仰臥抱膝運動；參考 [NLM MeSH Knee-Chest Position](https://meshb.nlm.nih.gov/record/ui?dcmsLinks=true&ui=D056446) 定義及本站 exam-positions 段落，未使用來源圖像
- 這批只畫姿勢，沒有直接照搬本站表格的適應症或治療建議；未加標籤、未放 public、未部署

### 屈膝仰臥 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/dorsal-recumbent/dorsal-recumbent-v1.png)
- SHA-256：4ecffdd2bac6a3445713697fbd15351be402a5d2b6791fd60f6048165d3a6794

- 已呈現背部與骨盆貼床、雙膝彎曲、兩腳踏床；沒有腳架或橋式抬臀
- 遠側手臂被軀幹遮擋，後續需核對是否需提高可辨識度
- 需確認膝髖彎曲程度、頭枕與衣褲遮蔽是否符合教學用途

實際完整 prompt：

```text
Use case: scientific-educational. Nursing DORSAL RECUMBENT WITH KNEES FLEXED, not ordinary straight-leg supine and not lithotomy.
Original nursing textbook illustration, fine continuous dark-gray contour lines, restrained pale blue and cream color fills with only gentle watercolor shading. Clearly drawn 2D human illustration, no photorealism, glossy 3D, detailed skin, dramatic lighting or dense fabric textures. Adult East Asian man with short dark hair, plain pale-blue short-sleeve patient shirt and loose modest knee-length shorts, simplified face, eyes gently closed, not looking at camera. Clean white background. Simple FLAT horizontal hospital mattress on low cream bed base, no obstructing rails. HEAD at canvas RIGHT, FEET at LEFT. Elevated three-quarter side view makes all major contacts and both legs readable. Entire patient and bed fit with white margins. Exactly two arms, two legs, normal hands/feet. No internal anatomy, nudity, genital exposure, clinician, invasive equipment or examination procedure. NO text, arrows, numbers, labels, watermark or decorative border. Independent composition from textual facts, unapproved positioning draft for human review.
Patient lies on his BACK, head/shoulders/back/pelvis supported on flat mattress. Thin pillow under head supports neck neutrally. BOTH knees flexed and pointing up, thighs modestly separated to roughly hip width, not spread widely. BOTH SOLES FLAT ON THE MATTRESS, feet drawn toward buttocks enough to bend knees comfortably. Make the two separate grounded feet and bent knees clearly visible without impossible leg overlap. Do not lift legs into air or put them in stirrups. No pillow/bolster under knees or calves obscures the foot contact. Pelvis remains down, not bridge exercise. Two arms relaxed alongside torso with hands on mattress, both visible; no hands holding knees. Modest shorts cover pelvis fully while both knees and feet remain visible. Keep all bed sections flat, no bed-head elevation. Landscape 16:9, clothing same as rest of nursing position series.
```

### 膝胸臥位 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/knee-chest/knee-chest-v1.png)
- SHA-256：fb5efbeb553f825d5e9a45838a947183561b0b108a98234c49867a84eb47f581

- 已呈現兩膝與胸部接床、臀部抬高、雙前臂置頭側及下腿沿床面
- 需核對胸部接觸點、腰背曲線、膝部間距與遠側肢體連續性
- 只呈現基本臥位，不加入胎位矯正或其他治療效果宣稱

實際完整 prompt：

```text
Use case: scientific-educational. Nursing KNEE-CHEST / GENUPECTORAL position, NOT a supine knees-to-chest exercise, NOT hands-and-knees and NOT child's pose.
Original nursing textbook illustration, fine continuous dark-gray contour lines, restrained pale blue and cream color fills with only gentle watercolor shading. Clearly drawn 2D human illustration, no photorealism, glossy 3D, detailed skin, dramatic lighting or dense fabric textures. Adult East Asian man with short dark hair, plain pale-blue short-sleeve patient shirt and loose modest knee-length shorts, simplified face, eyes gently closed, not looking at camera. Clean white background. Simple FLAT horizontal hospital mattress on low cream bed base, no obstructing rails. HEAD at canvas RIGHT, FEET at LEFT. Elevated three-quarter side view makes all major contacts and both legs readable. Entire patient and bed fit with white margins. Exactly two arms, two legs, normal hands/feet. No internal anatomy, nudity, genital exposure, clinician, invasive equipment or examination procedure. NO text, arrows, numbers, labels, watermark or decorative border. Independent composition from textual facts, unapproved positioning draft for human review.
Patient kneels on BOTH KNEES on the flat firm mattress, knees separated about hip width. BOTH upper thighs rise approximately vertically from grounded knees toward elevated hips/buttocks. Lower legs lie along mattress toward canvas LEFT, knees bent about a right angle. HIPS/BUTTOCKS are elevated high over knees, distinctly higher than shoulders. Upper torso slopes down toward canvas RIGHT, CHEST rests on the mattress. Head turned gently to visible side with nose/mouth unobstructed, cheek on a very thin cloth pad. Chest and both knees are contact/support points. Abdomen is not curled into sitting on heels: visible gap between pelvis and heels, no buttocks resting on calves. Do not put weight on extended straight arms, do not show headstand, no extreme spinal arch.
Both elbows bent comfortably, forearms and hands on mattress beside head, hands separately identifiable; shoulders not forced into extreme extension. Exactly two arms. Show near knee and far knee with distinct outlines and both lower legs, no extra legs. Modest loose shorts and shirt fully cover body; shirt follows lowered torso without exposure. No large chest pillow that lifts chest off mattress or obscures pose. Broad side three-quarter view for clear knees/chest/hips relationship. Landscape 16:9. Basic clothed position only, no claimed treatment indication.
```

## 膝胸臥位頭部朝向：待完成

- 使用者要求只把膝胸圖的頭轉向另一側，靠鏡頭呈現頭髮／後腦，其他圖片不動
- 兩次內建 imagegen 編輯均在輸出安全檢查被 sexual 分類擋下，沒有產生修正版；未改用其他工具重繪或宣稱完成
- 原 v1 保留且仍待審；沒有 v2 圖片，失敗請求與完整 prompt 保存於相關資源/AI底圖/2026-11-01-positions/knee-chest/head-edit-request.json
- 請求 ID：4c6af435-3e70-4661-a492-957dc33bc20f、c2d937a4-7bcc-40ba-b371-12ecac6dd7ad

## 使用者提供 Gemini 膝胸候選版

- 使用者回覆：「有用gemini 畫了 還是差不多 不過比原本好」
- 保存 [Gemini 候選原圖](../../../相關資源/AI底圖/2026-11-01-positions/knee-chest/knee-chest-gemini-v1.jpg)，原始下載檔保留
- 來源：使用者以 Gemini 生成；實際 prompt 未提供，不推測或補寫
- SHA-256：0eb4fe798b63e7aaae186670b28130ca41d71a65289c41ac47edd0ac5795dd48
- 目視：臉部較朝床面，但仍可見面部，尚未轉成後腦與頭髮朝鏡頭
- 狀態：使用者認為較原版好，保存候選，尚未收到明確底圖通過；未加標籤／未整合，其他圖片未改動

## 第六批：截石臥位與垂頭仰臥

- 使用者要求繼續下一輪，按原排程製作兩張候選，各 v1 待確認
- 本輪不把繼續製作當成對前批圖像的核准；屈膝仰臥 v1、膝胸 Gemini 候選及端坐前傾位仍維持各自原審核狀態
- 查閱 [StatPearls Anatomy, Patient Positioning](https://www.ncbi.nlm.nih.gov/books/NBK513320/) 及 [擺位傷害預防綜述](https://pmc.ncbi.nlm.nih.gov/articles/PMC11460411/) 的文字概念，未輸入來源圖像
- 截石構圖：仰臥、髖膝彎曲、雙腿由腳架支托，骨盆仍由床面支持；衣褲與遮巾保留，無操作示範
- 垂頭仰臥構圖：整個床面為同一斜平面、頭低腳高，床座水平；只是姿勢辨識，不宣稱休克處置或完整手術安全流程
- 兩張均內建 imagegen 文字生成，線稿淡彩、頭右腳左；未加標籤、未放 public、未部署

### 截石臥位 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/lithotomy/lithotomy-v1.png)
- SHA-256：399da7d034796eda96816c428f1ed2a71204f21377955570afd5d525f31c532a

- 已呈現仰臥、髖膝彎曲與兩側帶墊腳架，衣褲及遮巾保留
- 透視造成兩腳架畫面高度不同，仍需核對實際設定是否對稱與支架連接是否合理
- 骨盆與臀部支撐、腿架接觸位置、遠側手臂遮擋仍待確認
- 床座下緣被裁切，後續排版需評估留白

實際完整 prompt：

```text
Use case: scientific-educational. Standard LITHOTOMY position educational diagram.
Original nursing textbook illustration, fine dark-gray contour lines, pale blue and cream flat color areas with gentle watercolor shading. Clearly DRAWN 2D, simplified adult East Asian male face with short dark hair and softly closed eyes, plain pale-blue patient shirt and loose modest shorts. No photorealism, glossy 3D, detailed skin or dramatic lighting. Clean white background. Cream medical examination table and white mattress, head on canvas RIGHT and feet LEFT, near-side elevated three-quarter view. Entire patient and essential apparatus visible within white margins. Exactly two arms and two legs, natural hands/feet. Fully clothed educational posture only, no internal anatomy or exposed private areas, no medical procedure being performed. No text, labels, arrows, numbers, watermark or panels. Independent text-based composition for human review.
Patient supine on horizontal examination table. Head/shoulders/back/pelvis rest on table, head neutral on thin pillow, arms comfortably beside torso, both hands visible. Pelvis near foot-end of table but SACRUM AND BUTTOCKS FULLY SUPPORTED ON MATTRESS, not hanging off edge. Table foot extension removed/shortened to allow leg-support apparatus.
Both hips flexed, thighs modestly abducted symmetrically and knees bent around a right angle. Both lower legs elevated and each supported in a PADDED BOOT-STYLE LEG HOLDER, cradle contacting lower calf and heel/foot, with visible padding; no bare metal contact. Both stirrups adjusted to equal height. Each holder attaches via its own clearly drawn support rod to table side rail; no floating holder or impossible rod through body. Lower legs distinct, not fused, heels/feet supported and visible enough to explain apparatus. No unsupported dangling legs, no hands holding knees. Maintain moderate non-extreme hip flexion/abduction.
Blue shorts plus a small plain sheet draped over pelvis and proximal thighs for modesty while leaving knees, lower legs and padded holders visible. View from SIDE three-quarter, not directly between legs. Focus is difference from dorsal recumbent: feet supported ABOVE mattress by leg holders rather than planted on bed. No genital detail, no clinician, instruments, tubes or surgical scene. Landscape 16:9.
```

### 垂頭仰臥 v1

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-positions/trendelenburg/trendelenburg-v1.png)
- SHA-256：e61059f82df01cc616c802c2c8c3a453a53f83d2aee51f65037c1095ceaa77b6

- 已呈現整床同平面傾斜，頭在右下、足在左上，床座水平
- 大腿固定帶、身體與床面的連續支撐、遠側手臂遮擋待核對
- 15–20 度為構圖目標，未量測、不標精確角度；本圖不是完整手術擺位與防滑操作指引
- 不在圖說宣稱它是休克或低血壓的一般處置

實際完整 prompt：

```text
Use case: scientific-educational. TRENDELENBURG / head-down supine tilt teaching drawing.
Original nursing textbook illustration, fine dark-gray contour lines, pale blue and cream flat color areas with gentle watercolor shading. Clearly DRAWN 2D, simplified adult East Asian male face with short dark hair and softly closed eyes, plain pale-blue patient shirt and loose modest shorts. No photorealism, glossy 3D, detailed skin or dramatic lighting. Clean white background. Cream medical examination table and white mattress, head on canvas RIGHT and feet LEFT, near-side elevated three-quarter view. Entire patient and essential apparatus visible within white margins. Exactly two arms and two legs, natural hands/feet. Fully clothed educational posture only, no internal anatomy or exposed private areas, no medical procedure being performed. No text, labels, arrows, numbers, watermark or panels. Independent text-based composition for human review.
Entire flat examination tabletop and its mattress tilt as ONE STRAIGHT PLANE approximately 15-20 degrees: FEET at canvas LEFT clearly HIGHER, HEAD at canvas RIGHT clearly LOWER. Patient lies on BACK, entire straight trunk and legs supported along this same inclined mattress; no separate raised backrest or flexed knee segment, no bent sitting posture. Show the whole head-to-foot table surface aligned with the body. Neck neutral, face up, eyes closed. Use no pillow or thick head bolster that would hide head-down configuration.
Both arms lie alongside torso, hands visible supported on mattress. Legs comfortably extended, not crossed, feet neutral. Plain pale-blue shirt and modest shorts; no tubes or medical devices. A broad flat padded safety belt across thighs holds body on table without looking like torso restraint; no shoulder braces or pressure at neck. Clearly show mattress/tabletop tilted on a central adjustable pedestal while the large TABLE BASE remains level on a visible short horizontal floor baseline. This horizontal base is needed to distinguish actual table tilt from camera rotation. Stable mechanical support under tilted table, no floating mattress.
Low-to-moderate whole-table slope, head lower than feet, not reverse Trendelenburg, not leg-elevation on pillows. Both ends of table entirely inside canvas, ample white margin. No angle numbers, text or arrows. Basic positioning geometry only, no claim of treating shock or low blood pressure. Landscape 16:9.
```

## 第六批確認與追加病床抬腿版

- 使用者確認截石臥位 v1、整床傾斜垂頭仰臥 v1「兩張圖片都可以」，兩張底圖通過，標籤待製作
- 另要求能由一般病床調整達成、下肢抬高的版本；截圖僅用於理解需求，未輸入生成工具
- 新候選命名：病床抬腿式仰臥（改良式垂頭仰臥，Modified Trendelenburg），以頭背水平、抬高腿段區分整床傾斜式
- [Cleveland Clinic：Trendelenburg variations](https://my.clevelandclinic.org/health/procedures/trendelenburg-position) 明列改良式為抬腿而頭背保持水平；僅查文字定義，未使用來源圖片
- 本圖不等同標準化被動抬腿試驗的操作流程，亦不加休克／低血壓一般處置宣稱
- [病床抬腿候選 v1](../../../相關資源/AI底圖/2026-11-01-positions/modified-trendelenburg/modified-trendelenburg-v1.png)；待使用者確認，未加標籤／未整合
- 初查：已呈現頭背段水平、腿段抬高，床座水平；膝髖彎曲較明顯、床段轉折與頭枕高度需核對，遠側肢體部分遮擋
- SHA-256：8de3ecb4c56139e15323531d2b71db2e2dec0f2e84dcf5673240f27e10263d36

實際完整 prompt：

```text
Use case: scientific-educational. Original nursing textbook illustration of BED-LEG-ELEVATION SUPINE / MODIFIED TRENDELENBURG configuration, not a whole-table tilt.
Clearly DRAWN 2D nursing illustration: fine dark-gray contour lines, pale blue and cream fills, minimal soft watercolor shading, clean white background. Adult East Asian man with short dark hair, simplified face, softly closed eyes, plain pale-blue short-sleeve patient shirt and modest knee-length shorts, two arms/two legs. No photorealism, glossy 3D or detailed skin.
Patient HEAD at canvas RIGHT, FEET at LEFT, elevated side three-quarter view. Show a NORMAL adjustable hospital bed on a level wheeled base, not an operating table pedestal. Head, shoulders, BACK AND PELVIS lie on a FLAT HORIZONTAL head/torso mattress segment; no raised backrest. One thin head pillow only, neck neutral. Arms rest comfortably at sides, hands visible.
ONLY the articulated LEG/FOOT END of bed is raised by its bed mechanism: from HIP hinge at center, the THIGH mattress segment rises toward a moderately elevated knee platform at canvas LEFT; distal calf/foot mattress segment is near-horizontal at this raised level, so both calves and heels are supported HIGHER than torso/head. Knees gently flexed at transition, not tightly bent upright like dorsal recumbent. Feet at left clearly elevated above head level, legs remain resting on mattress continuously, not held in air. Buttocks remain fully on horizontal central mattress, do not raise hips into a bridge. Smooth mattress transitions and physically plausible bed joints.
Clearly distinguish this split-bed shape from the previous straight-plane head-down table: head/back segment horizontal, thigh segment rises, lower-leg platform elevated. Whole bed base remains level on a faint horizontal floor baseline; show the raised leg mechanism under mattress. No pillow stack to lift legs, no stirrups, no leg holders, no foot restraints, no extra bolsters or side armrest blocks. Near-side rail lowered/omitted so mattress geometry and leg support remain visible.
Independent composition from description, do not copy any textbook photograph, published diagram or room background. Entire bed, patient, feet and mechanism within canvas with generous white margins. No text, labels, numbers, arrows or watermark. Landscape 16:9. Position-identification draft for review; no treatment claims and not a standardized passive-leg-raise test protocol.
```

## 本輪圖片製作收尾

- 使用者確認病床抬腿式仰臥（改良式垂頭仰臥）v1 底圖通過，並表示本輪做到這裡即可
- 本輪停止新增圖片及修圖；保留全部原圖、版本、完整 prompt、來源及審核紀錄
- 已明確通過：左側臥 v2、左辛氏 v2、仰臥 v1、俯臥 v2、半坐臥 v1、高坐臥 v2、低坐臥 v1、截石 v1、整床傾斜垂頭仰臥 v1、病床抬腿式仰臥 v1
- 端坐前傾位 v1、屈膝仰臥 v1、膝胸 Gemini 候選保留既有狀態，不將本輪收尾自動視為逐張核准
- 中文標籤、網站整合與部署尚未進行，留待後續另行安排
