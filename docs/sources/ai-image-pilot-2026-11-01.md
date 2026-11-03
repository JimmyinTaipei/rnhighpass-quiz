# AI 醫學圖片首批製作與審核紀錄

> 2026-11-01｜內建 imagegen｜兩張皆未通過，未放入 public 或正式知識頁

## 共通流程與畫風

- 狀態：規格完成 → 已生成待初查 → 待使用者審核 → 待修改／底圖通過 → 標籤待審 → 可整合
- 本批初查發現具體疑點，狀態為「待修改／畫風待使用者確認」；使用者尚未核准任何底圖
- **最新畫風（v2）**：線稿淡彩醫學教材插畫，明確細輪廓線、低飽和色塊、少量柔和陰影、選擇性細節；人物簡化五官與皮膚質感，保留明顯手繪感。v1 的寫實方向已被使用者否定
- 使用者偏好接近 Gray’s Anatomy for Students 的閱讀感；v1、v2 實際生成只使用文字規格，未將書籍圖片送入生成工具；v2 依使用者提供的解剖圖與人物插畫，分析一般視覺特徵後改寫文字 prompt
- 不含文字、編號與箭頭，中文標籤與引線在底圖通過後另做；現有 Servier 圖保留
- 以解剖事實獨立構圖，未取得適用授權的書籍截圖不作重畫底圖；一般風格與具體畫作表達須區分，AI 重畫不等於取得授權（[智慧財產局](https://www.tipo.gov.tw/tw/copyright/692-16842.html)、[改作說明](https://www.tipo.gov.tw/tw/copyright/774-5057.html)）
- AI 輔助生成、人工審核中；不宣稱公領域、不自行套用 CC 授權；本批尚未加入網站 credits，未形成網站授權宣告
- 每張先生成一版，修改保留版本與原因，不覆寫；無明確確認維持待審，關鍵錯誤不能只用圖說免責

## 事實來源與擺位釐清

- 膝關節的骨骼、半月板及十字／副韌帶關係：[AAOS Common Knee Injuries](https://www.orthoinfo.org/diseases--conditions/common-knee-injuries)、[AAOS Collateral Ligament Injuries](https://www.orthoinfo.org/diseases--conditions/collateral-ligament-injuries/)；僅查文字事實，未將來源圖像交給生成工具
- 直線皮膚牽引的小腿下加墊、避免足跟壓床：[AO Surgery Reference](https://surgeryreference.aofoundation.org/orthopedic-trauma/adult-trauma/proximal-femur/basic-technique/basic-technique-skin-traction)；本批採此呈現，並非宣稱所有牽引配置均相同
- 舊 prompt 要腿自然平放，但既有標籤寫足跟懸空：新規格改為小腿下支撐、足跟卸壓，避免膝窩受壓；v1 未成功呈現，需修正

## 原始檔與版本

- 原始生成檔仍保存在 Codex 生成目錄，以下為另外保存的專案外審核副本
- 本文件記錄完整 prompt，旁存 prompt-v1.txt 與 review-v1.json（含 SHA-256 與空白核准欄位）
- 本文件連結供本機審核，未將圖片複製進 repo；其他電腦需另外取得相關資源檔案

## 右膝關節解剖樣張

- 狀態：**待修改／畫風待使用者確認**
- 版本：v1；生成方式：內建 imagegen；圖像參考：無；使用者核准：無
- 檔案：[knee-anatomy-v1.png](../../../相關資源/AI底圖/2026-11-01-pilot/knee-anatomy/knee-anatomy-v1.png)
- SHA-256：`4ffb2f9926f81b8ea27e0a72fea1e5df8040771a6115b8d21cada9b6be941281`

### 製作規格

- 用途：獨立畫風與解剖樣張，暫不替換既有授權圖
- 視角：成人右膝前方剖露、輕度屈曲，髕骨與伸膝裝置向上反折；腓骨位於觀看者左側
- 必查：左右側、ACL／PCL 附著及遮擋、MCL 到脛骨、LCL 到腓骨頭、半月板位於脛骨平台、反折髕骨仍有連續關係
- 預定標籤：股骨、脛骨、腓骨、髕骨（向上反折）、內側半月板、外側半月板、前十字韌帶、後十字韌帶、脛側副韌帶、腓側副韌帶

### 初查疑點

- 十字韌帶的實際股骨附著點被遮擋，不能只憑交叉外觀判定正確；下一版需讓附著關係可辨識
- 反折髕骨與伸膝裝置的連續關係不夠清楚，需核對並修正
- 副韌帶與半月板邊界需在局部放大後逐項核對，尚未通過解剖審核

### 實際送出的完整 prompt

```text
Use case: scientific-educational
Asset type: original nursing education anatomy illustration, unlabelled review candidate.
Create a realistic medical textbook illustration of an adult RIGHT knee, anterior dissected view in slight flexion. Independent composition, no reference images. Natural ivory bone, pale blue-white articular cartilage, pearly fibrous ligaments, restrained natural tissue colors, subtle hand-painted volumetric shading, crisp tissue boundaries, white background. Not a flat vector drawing, not a photograph, not a glossy 3D render.
Single coherent dissection centered with generous empty margins for later labels. Patient's lateral side appears on viewer's LEFT: fibula on viewer's left, tibia central. Show distal femur and proximal tibia/fibula. Show both crescent menisci seated on tibial plateau, lateral meniscus toward fibula. ACL runs from anterior intercondylar tibia to inner aspect of lateral femoral condyle, in front of the PCL; PCL runs from posterior intercondylar tibia to inner aspect of medial femoral condyle, partially obscured naturally. Broad flat MCL on medial/viewer-right side joins femur to tibia; separate cordlike LCL on lateral/viewer-left joins femur to fibular head, not to meniscus. Anterior capsule opened and patella with extensor apparatus reflected superiorly, still visibly attached, to expose intercondylar structures; no floating detached bones. Keep realistic proportions and natural occlusion; do not make hidden structures visible by inventing anatomy. Avoid decorative extra ligaments or structures.
NO text, labels, letters, numbers, arrows, watermark, publisher marks or panel borders. Landscape canvas approximately 3:2, enough vertical room for reflected patella. For human accuracy review, not yet approved for teaching.
```

### 使用者審核

- 畫風：待回覆
- 底圖：未通過，待修正與確認
- 標籤：尚未製作，等待底圖通過

## 勃克式牽引

- 狀態：**待修改／畫風待使用者確認**
- 版本：v1；生成方式：內建 imagegen；圖像參考：無；使用者核准：無
- 檔案：[msk-bucks-traction-v1.png](../../../相關資源/AI底圖/2026-11-01-pilot/msk-bucks-traction/msk-bucks-traction-v1.png)
- SHA-256：`40478b6c5ba9b534ab272d9ed974bf96457dc069804f17d499b4a69f3fddeaad`

### 製作規格

- 用途：底圖與標籤均通過後，才替換 fractures 頁的簡易示意圖
- 視角：成人仰臥、右腿前景、床側略俯視；頭在左、足在右
- 必查：皮膚腿套而非骨針、單根繃緊繩索沿腿長軸、滑輪正確轉向、重錘不接觸床架或地面、小腿支撐與足跟卸壓
- 預定標籤：皮膚牽引腿套、拉力方向與骨長軸平行、滑輪與繩索、重錘懸空、小腿支撐與足跟卸壓、體重形成反牽引

### 初查疑點

- 足跟看起來仍接觸床墊，沒有清楚呈現卸壓，下一版需修正
- 墊子偏近膝窩，需移至小腿下方並避免膝窩受壓
- 繩索經床尾板的穿行與滑輪接觸關係需放大核對；重錘懸空可見，但未畫明地面，無法量測離地間隙
- 頭側床架被裁切、腳側標籤留白較少，下一版需增加外框留白

### 實際送出的完整 prompt

```text
Use case: scientific-educational
Asset type: original nursing education clinical illustration, unlabelled review candidate.
Create a realistic medical textbook illustration of Buck's straight skin traction on an adult patient's RIGHT lower leg. Independent composition, no reference images. Natural tissue colors, muted blue hospital gown and linen, subtle hand-painted volumetric shading, clear crisp object boundaries on white background. Not flat vector, not a photograph, not glossy 3D.
Landscape 16:9 composition, whole hospital bed and adult patient in supine position, head on viewer LEFT and feet on viewer RIGHT. View from patient's right side slightly elevated so the traction-side leg is in foreground and the unaffected left leg is visible separately behind. Patient covered modestly, face neutral. Flat bed. The right leg aligned straight. Soft skin traction boot/wrap around right lower leg below knee, secure broad straps and plantar spreader attachment, no invasive skeletal pin. Small broad padded support under calf keeps right heel off mattress; leave visible clearance under heel, avoid pressure behind knee. Foot neutral.
One taut continuous rope attached centrally to plantar spreader runs toward foot of bed in line with long axis of leg, horizontally over a single grooved pulley attached securely to bed foot frame, then vertically down to one cylindrical weight. Show rope contacting pulley groove and changing direction correctly. Weight hangs freely beyond bed end, clearly above floor and touching neither floor nor bed/frame. No slack rope or extra traction hardware. Bed foot frame must not obscure rope, pulley or weight. Clear separation of both legs, plausible limbs and joints.
Leave empty margins for later annotation. NO text, labels, arrows, letters, numbers, watermark or decorative borders. For human accuracy review, not yet approved for teaching.
```

### 使用者審核

- 畫風：待回覆
- 底圖：未通過，待修正與確認
- 標籤：尚未製作，等待底圖通過

## 下一步與整合驗收

1. 使用者先回覆兩張畫風是否符合方向，並可補充初查以外的錯誤；先修正已列出的問題，不能把畫風確認視為解剖核准
2. 以新版本修正，重新核對解剖／照護事實；需要的局部放大在圖像編輯工具中另存，不覆寫原圖
3. 底圖通過後，沿用 ::figure 與 labels JSON，逐點重定位，提供格線及含標籤預覽；核對桌面與手機的裁切、字級、引線及重疊
4. 標籤通過後才輸出壓縮網站圖，登記 AI 生成及實際審核狀態，更新勃克式牽引頁面；膝關節維持獨立樣張
5. 整合後執行知識庫建置、來源掃描及授權檢查；本輪不部署
6. 本批兩張通過後再固化畫風模板；肌骨其餘七組每批最多兩組，多格圖逐子圖生成核對，再接基護、產科與急救缺圖

## 本輪驗證

- 已驗證兩張保存副本的 SHA-256、完整 prompt 一致、使用者核准欄為空，且候選圖未進入 public
- 知識庫建置通過：404 篇、5870 個知識點，章節涵蓋 660/660
- 來源掃描完成：既有 1 項逐字重疊、1 項數字序列重疊、20 項檢視；比對所有頁面的分類與分數均無變化，僅同分來源的列舉順序／選項不同；已保留原報告以避免無意義差異，未新增問題
- 圖片授權檢查完成：154 張、需替換 0 張，報告無差異；此檢查不代表本批候選圖已核准或取得特定授權
- git diff --check 通過；本輪只改工作流程與審核文件，未修改網站內容、標籤或 credits
- 網站標籤與手機實機驗收尚未進入：本批未整合網站

## v2 畫風修正

- 使用者明確要求教材插畫感，解剖與人物皆不可接近真人或擬真材質
- 名稱：**線稿淡彩醫學教材插畫**（contour-line medical illustration with soft color washes）
- 正向特徵：細輪廓線、淡彩色塊、少量陰影、簡化組織紋理與五官、清楚教學層次
- 避免：真人肖像、毛孔、細密骨孔、濕亮反光、攝影光影、3D 塑膠質感
- 使用者提供的兩張圖片僅用於辨識一般畫風特徵，未直接輸入 imagegen；新圖以文字獨立構圖，未複製圖上的標籤、版面或人物姿勢組圖
- v1 保留為歷史版本，v2 尚未得到使用者畫風或解剖核准，仍不可整合頁面

### knee-anatomy v2

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-pilot/knee-anatomy/knee-anatomy-v2.png)
- 狀態：待修改／畫風待使用者確認；尚未加標籤
- SHA-256：64d158aed90ef0b6c2ba3ae46119cd16b6a6dd4228e66b306abb2882a53e8638

初查疑點：

- 半月板與軟骨畫成多重盤狀層次，有誤導疑慮，需修正
- 反折髕骨／肌腱與內側副韌帶界線不清，仍需核對連續關係
- 十字韌帶股骨端附著仍有遮擋，尚未通過解剖審核

實際完整 prompt：

```text
Use case: scientific-educational. Original nursing education knee anatomy drawing, unlabelled v2 candidate.
STYLE IS THE PRIMARY REQUIREMENT: an unmistakably DRAWN 2D medical textbook illustration. Fine continuous warm dark-gray contour lines outline every important shape. Restrained pale watercolor/gouache washes, broad simple color areas, only a little soft airbrushed shading to explain form. Simplified smooth surfaces and selective details; visible illustrative linework. Cream/ochre bones, cool muted blue cartilage, pale blue-white ligaments. Clean white paper background. The result must read as an educational drawing at first glance, never as a photograph, photorealistic painting, surgical specimen, lifelike person or 3D render. No pores, tiny bone pits, wet reflections, cinematic lighting, photographic gradients, elaborate muscle textures, hyperrealistic eyes or skin. Anatomically proportionate rather than cartoon caricature. Create an independent composition from the description, without reproducing any published plate. NO text, letters, numbers, labels, leader lines, arrows, watermark or logos. Leave substantial white margin for later annotation.
One adult RIGHT knee in a single anterior opened view, with a slight elevated oblique viewpoint so the tibial plateau and intercondylar attachments are readable. Knee gently flexed. Viewer LEFT is lateral: slim fibula at viewer left, tibia central. Show distal femur, proximal tibia and fibula, medial and lateral menisci on tibial plateau, ACL and PCL, broad MCL on medial/viewer-right from femur to tibia, thin cordlike LCL on lateral/viewer-left from femur to fibular head, separated from lateral meniscus.
ACL connects ANTERIOR tibial intercondylar area to the inner/posterior surface of the LATERAL femoral condyle, crossing anterior to PCL. PCL connects POSTERIOR tibial intercondylar area to inner surface of MEDIAL femoral condyle. Preserve natural depth and attachment, do not draw an arbitrary X detached from bones. Use a few fine parallel strokes to suggest ligament fibers, not detailed realistic tissue.
Patella and extensor apparatus reflected SUPERIORLY as an attached flap, patellar tendon visibly continuous from tibial tuberosity to patella, retracted to one side enough to expose joint. If naturally occluded keep it occluded rather than inventing anatomy. No red exposed muscle mass framing the specimen. Moderate pedagogical simplification and flat pale colors with light shading; emphasize clear contour lines and distinguishable structures, like a hand-drawn diagram in a printed student textbook.
Landscape 3:2 with generous margins; joint smaller than canvas so all structures fit, no cropping. This is a review candidate, not approved teaching material.
```

### msk-bucks-traction v2

- [原尺寸候選圖](../../../相關資源/AI底圖/2026-11-01-pilot/msk-bucks-traction/msk-bucks-traction-v2.png)
- 狀態：待修改／畫風待使用者確認；尚未加標籤
- SHA-256：4dba3a159db1cc039de47473e76fc4a5c188afc7152be198d040df5c7f5326d3

初查疑點：

- 牽引繩由腳端向滑輪稍微上斜，需調整至與腿長軸一致
- 小腿支撐與足跟離床較 v1 清楚，但需核對支撐位置與膝窩卸壓
- 腳底連接板與腿套的固定方式仍需確認，不能因畫風更接近需求而視為操作圖已通過

實際完整 prompt：

```text
Use case: scientific-educational. Original nursing skills textbook illustration of Buck's straight skin traction, unlabelled v2 candidate.
STYLE IS THE PRIMARY REQUIREMENT: an unmistakably DRAWN 2D medical textbook illustration. Fine continuous warm dark-gray contour lines outline every important shape. Restrained pale watercolor/gouache washes, broad simple color areas, only a little soft airbrushed shading to explain form. Simplified smooth surfaces and selective details; visible illustrative linework. Cream/ochre bones, cool muted blue cartilage, pale blue-white ligaments. Clean white paper background. The result must read as an educational drawing at first glance, never as a photograph, photorealistic painting, surgical specimen, lifelike person or 3D render. No pores, tiny bone pits, wet reflections, cinematic lighting, photographic gradients, elaborate muscle textures, hyperrealistic eyes or skin. Anatomically proportionate rather than cartoon caricature. Create an independent composition from the description, without reproducing any published plate. NO text, letters, numbers, labels, leader lines, arrows, watermark or logos. Leave substantial white margin for later annotation.
Human figure MUST be a clearly drawn illustration: simple outlined face with only a few lines for eyes nose mouth, smooth peach fill with minimal shadow, stylized outlined hair mass, plain pale-blue gown, simple clean limb contours. NOT a real person's portrait. Same clear line-and-wash technique for bed and apparatus. No detailed fabric pattern, realistic wrinkles, metal reflections or photorealistic bedding.
Adult lying supine on a simple flat hospital bed, head on viewer left, feet right, right leg in foreground, left leg resting separately behind it. Side view slightly elevated. Show complete bed and figure, with white space at all edges, including beyond foot end and under weight. Modest gown and sheet cover trunk. Right leg straight. Soft skin traction boot with broad straps around lower leg below knee and a spreader at sole, no skeletal pin.
Place a LOW WIDE padded support under MIDDLE OF CALF, distinctly AWAY FROM knee crease. Right HEEL MUST FLOAT WITH A CLEAR WHITE GAP ABOVE THE MATTRESS. Support extends enough under calf to avoid making knee bend. Foot neutral and visible heel clear of bed. This is a crucial educational feature.
One taut continuous rope attached centrally to sole spreader, runs horizontally along leg long axis, through unobstructed space above a LOW foot rail, over ONE grooved pulley on a secure upright at foot end, then vertically down to ONE cylindrical weight hanging clear of bed/frame. Draw a short simple floor line far below the suspended weight so its clearance is unambiguous. Route rope visibly through pulley groove. No slack, no unexplained holes in footboard, no extra ropes. Correct leg proportions, two legs only.
Wide 16:9 independent composition, simplified 2D linework and pale colors, minimal light shading. Review candidate, not approved teaching material.
```

## 膝關節 v3 定點修改

- 使用者提出三點：移除 (62.3%,14.5%) 上方切骨狀組織、移除 (50%,37.8%) 額外小韌帶、修正 (55.1%,64.5%) 未連到髕骨的髕韌帶
- 第三點採使用者允許的「直接不生成髕韌帶」，連帶移除錯誤的上方反折裝置；本版髕骨與髕韌帶刻意省略，不代表完整膝前方伸膝裝置
- 初查：第一、第三項已移除；第二項髁間窩背景小白色突起經 v3、v3b 兩次編輯仍殘留，尚未完成
- 前後十字韌帶主要兩束保留；半月板層次與附著關係沿用既有待核對事項，未宣稱通過
- 狀態：待修改；使用者核准：無；尚未加標籤、未整合網站

### v3

- [候選圖](../../../相關資源/AI底圖/2026-11-01-pilot/knee-anatomy/knee-anatomy-v3.png)
- SHA-256：1ec32544b8c975dc9c31b174911669725b8f6621028deffdee6241c8a7d68d58

```text
Edit the provided knee anatomy illustration locally into version 3. Preserve its thin dark contour lines, pale watercolor textbook illustration style, colors, overall size, white background, view and placement. The user identified three unwanted structures using percentage coordinates measured from upper-left. Make these specific corrections without adding labels:
1. Around x62.3%, y14.5%: remove the entire anomalous reflected flap/extensor apparatus at the top and down the viewer-right side: the tan sliced-bone-like cap near top center-right and its long white fibrous ribbon wrapping over the medial side. Do not replace with another cut bone, patella, tendon or floating element. Cleanly continue the underlying distal femur with a simple intact superior shaft that fades naturally toward the top margin. Preserve the actual medial collateral ligament if discernible as a separate short femur-to-medial-tibia structure. This dissection intentionally omits the patella and patellar ligament to expose the joint.
2. Around x50%, y37.8%: remove ONLY the tiny extra isolated white ligament-like nub in the background of the intercondylar notch, behind/between the two main cruciate bundles. Fill with the surrounding recessed tan bone/shadow. Retain both main crossing anterior and posterior cruciate ligament bundles; do not interpret this request as removing them.
3. Around x55.1%, y64.5%: completely remove the disconnected white patellar-ligament-like band on the FRONT of the proximal tibia, extending from anterior tibial plateau toward tibial tuberosity. Replace with anatomically continuous ochre tibial bone surface and its subtle contours. No cut stump needed: user explicitly allowed omitting the ligament. Do not leave a ligament attached to tibia at both ends. Keep tibial tuberosity as a normal modest bony prominence.
Retain femoral condyles, central two main cruciate ligaments, menisci, tibia and fibula and lateral collateral ligament. Do not add new structures to fill removed space. No text, arrows, numbers or markers. This is an unapproved medical illustration revision for human review.
```

### v3b

- [候選圖](../../../相關資源/AI底圖/2026-11-01-pilot/knee-anatomy/knee-anatomy-v3b.png)
- SHA-256：b37391c9567e5b1bbe60c115134aa391659d5d6e2b5c141c3f2e567f52e8d400

```text
Precise local correction to provided knee drawing. At normalized x=0.493, y=0.389 (about pixel 758,398 on 1536x1024 canvas), a tiny isolated WHITE TRIANGULAR SPIKE peeks up in the dark gap BETWEEN the two main crossing cruciate ligament bundles. It remains from an earlier edit and the user specifically wants it removed. Erase that tiny white triangular protrusion and its outline, replacing it with recessed dark ochre/brown background consistent with surrounding intercondylar notch. Blend smoothly. Do not leave any isolated white point behind the crossing ligaments. Do NOT remove or change the two large crossing ligaments themselves. Everything else identical: preserve thin outlines, pale color wash, canvas, bones, menisci, collateral ligaments and no patella/patellar ligament. No text or arrows. This is a tiny localized cleanup, no new anatomy.
```

## 使用者暫定接受目前版本

- 使用者回覆：「可以 目前就先這樣 之後再處理那個小部分」
- 膝關節保留 v3b 作為目前版本，髁間窩的小白色突起延後處理，本輪不再修圖
- 此為暫定接受與延後修正的紀錄，不等同所有解剖項目已核對或標籤已通過
- 未新增標籤、未替換網站圖片、未部署；接續時先查看本紀錄，勿重做已接受的修改
