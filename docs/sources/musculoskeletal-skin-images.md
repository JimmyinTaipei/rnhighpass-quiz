# 第 14 輪肌骨皮膚：圖片盤點(14-0)

> 2026-10-23 建立。依「圖先用表格」：14a、14b **先用表格寫完**，圖等知識庫全部建完(第 17 輪後)再做
> 三種來源：**S**＝Servier 現成向量圖＋中文標籤(不需要 AI)；**O**＝原創 SVG(我畫，簡單切面或流程)；**AI**＝人體姿勢、技術手勢，請使用者用 AI 生成底圖，之後照 im-injection-sites 做法疊中文標籤
> AI 底圖流程(記憶「解剖圖標籤準確度」)：AI 生成 → 裁外框、轉 JPG、英文檔名放 `public/knowledge-images/`，原圖移到 `相關資源/AI底圖/` → labels JSON 疊中文標籤＋格線核對；底圖畫錯的地方在圖說註明
> 縮圖在本 session scratchpad `r14/servier/sheet-*.png`

> **2026-10-27 已先做簡易示意圖**(使用者要求，AI 版還在製作)：`public/knowledge-images/msk-*.svg`＋`labels/msk-*.json`，由 `scripts/msk-sketch-figures.py` 產生，已放進頁面
> 對照：AI-1 msk-tha-precautions、AI-2 msk-burn-positioning、AI-3 msk-bucks-traction、AI-4 msk-rule-of-nines、AI-5 msk-pavlik-harness、AI-6 msk-scoliosis-adams、AI-7 msk-barlow-ortolani、AI-8 msk-exam-tests
> 換成 AI 圖時：AI 圖放 `public/knowledge-images/`，改頁面 `src` 與 labels 的 `image`，標籤沿用、依新底圖調座標(放大格線逐點核對)，圖說拿掉「簡易示意圖」字樣

## 一、給 AI 的共通指示(每張都貼在最前面)

```
Medical education illustration for a nursing exam study site.
Clean flat vector style, thin dark outlines, soft muted colors, plain white background.
NO text, NO letters, NO numbers, NO arrows with words anywhere in the image (labels will be added later).
Anatomically correct proportions, adult East Asian patient unless stated, hospital gown or plain clothes.
Landscape 16:9, subjects centered with empty margin around them for labels.
```

> 重點：**不要讓 AI 寫字**(AI 的字常常錯，我們之後疊中文)；要的話可以請 AI 留「空白箭頭」，但通常我自己加

## 二、需要 AI 底圖的(依優先順序)

| # | 圖 | 用在 | 題數 | 草圖 |
|---|---|---|---:|---|
| AI-1 | 全髖關節置換術後：3 個禁止＋1 個正確 | joint-replacement 段 | 9 | [ai01](musculoskeletal-skin-sketches/ai01-tha-precautions.svg) |
| AI-2 | 燒傷抗攣縮擺位(全身仰臥) | 燒傷頁復健期 | 5 | [ai02](musculoskeletal-skin-sketches/ai02-burn-antideformity.svg) |
| AI-3 | 勃克式牽引(側面) | fractures 牽引段 | 3 | [ai03](musculoskeletal-skin-sketches/ai03-bucks-traction.svg) |
| AI-4 | 九法則底圖(成人正背面，選做兒童) | 燒傷頁面積 | 5 | [ai04](musculoskeletal-skin-sketches/ai04-rule-of-nines.svg) |
| AI-5 | 帕米利克吊帶(嬰兒) | 兒童骨骼頁 DDH | 3 | [ai05](musculoskeletal-skin-sketches/ai05-pavlik-harness.svg) |
| AI-6 | 脊柱側彎站立背面＋前彎試驗 | 兒童骨骼頁 | 3 | [ai06](musculoskeletal-skin-sketches/ai06-adams-forward-bend.svg) |
| AI-7 | Barlow 與 Ortolani 手法 | 兒童骨骼頁 DDH | 4 | [ai07](musculoskeletal-skin-sketches/ai07-ortolani-barlow.svg) |
| AI-8 | 骨科檢查四格(Thomas、Phalen、Tinel、前抽屜) | 骨科檢查段 | 9 | [ai08](musculoskeletal-skin-sketches/ai08-msk-exam-tests.svg) |

草圖只是告訴你「構圖與要畫出哪些重點」，人物比例不用照草圖

### AI-1 全髖關節置換術後姿勢

```
Four-panel illustration in one row, same adult patient (about 70 years old) after right total hip replacement, wearing a hospital gown.
Panel 1: patient sitting on a very low soft chair, bending forward deeply to reach the floor, hip flexed more than 90 degrees.
Panel 2: patient sitting upright on a chair with legs crossed, right thigh crossing over the left (hip adduction across midline).
Panel 3: patient standing, right foot and knee turned inward (hip internal rotation).
Panel 4: patient lying supine in bed with a triangular abduction foam pillow (wedge) between the legs, legs apart, toes pointing up.
Leave a small empty circle in the lower-left corner of each panel (for a red X or green check mark added later).
```

### AI-2 燒傷抗攣縮擺位

```
Top-down view of an adult patient lying supine on a hospital bed, positioned to prevent burn contractures.
Neck slightly extended with no pillow under the head (a small towel roll under the shoulders).
Both arms abducted about 90 degrees on arm boards, elbows fully straight, wrists slightly extended, hands in functional position resting on splints.
Hips straight (0 degrees flexion) and slightly apart, knees fully straight with knee splints, ankles at 90 degrees with foot splints so the toes point to the ceiling.
Body covered with light dressings, face visible. Neutral, calm expression.
```

### AI-3 勃克式牽引

```
Side view of an adult patient lying supine in a hospital bed with Buck's skin traction on the right lower leg.
A foam traction boot wraps the lower leg from below the knee to the ankle, with a spreader bar at the sole.
A rope runs straight from the boot, parallel to the long axis of the leg, over a pulley at the foot of the bed, and a cylindrical weight hangs freely in the air, not touching the floor or the bed frame.
The left leg rests normally on the mattress. The bed is flat.
```

> 足跟與膝窩要不要懸空，課本與題目(107-2_MS_017)待我核對；AI 圖先讓腿自然平放在床上就好

### AI-4 九法則底圖

```
Two full-body outline figures side by side: adult front view and back view, standing in anatomical position (arms slightly away from the body, palms forward).
Divide the body surface into flat-colored zones with thin boundary lines: head and neck (one color), each whole arm (one color), front trunk (one color), back trunk (another color), each whole leg (one color), and a tiny genital/perineal zone.
Minimal detail, no facial features needed, no clothing, gender-neutral smooth silhouette suitable for a medical chart.
```

選做兒童版：把第一行改成 `a 1-year-old child, front and back view, head noticeably larger relative to body, legs shorter`

### AI-5 帕米利克吊帶

```
Front view of a 2-month-old infant lying supine wearing a Pavlik harness (soft fabric straps).
Chest strap around the upper chest, two shoulder straps over the shoulders, stirrups around both lower legs and feet.
Both hips flexed about 90 to 100 degrees and gently abducted (frog-leg position), knees bent.
Anterior straps run from the chest strap to the front of the stirrups; posterior straps run to the back of the stirrups.
Diaper on, calm infant.
```

### AI-6 脊柱側彎

```
Two panels of the same 14-year-old girl seen from behind, wearing a sports bra and shorts.
Left panel: standing upright, right shoulder higher than the left, right shoulder blade more prominent, a visible S-shaped curve of the spine, uneven waist creases and a slightly tilted pelvis.
Right panel: Adams forward bend test — she bends forward at the waist about 90 degrees with arms hanging down and palms together; viewed from behind, the right side of the upper back (rib hump) is clearly higher than the left.
```

### AI-7 Barlow 與 Ortolani

```
Two panels of a newborn lying supine on an exam table, with an examiner's hands shown (gloved, no face).
Both panels: the baby's hips and knees are flexed 90 degrees. The examiner's thumb is on the inner thigh and the index and middle fingers are over the greater trochanter on the outer hip.
Left panel (Barlow): the examiner gently brings the thighs together toward the midline and pushes backward toward the table.
Right panel (Ortolani): the examiner gently spreads the thighs outward (abduction) while lifting the greater trochanter forward.
Draw small empty motion arrows (no text) showing the direction of movement in each panel.
```

### AI-8 骨科檢查四格

```
Four-panel grid (2 x 2), clinical examination of adult patients, examiner's hands shown where needed.
Panel 1 (Thomas test): patient supine on an exam table hugging one knee to the chest; the opposite thigh lifts off the table (hip flexion contracture).
Panel 2 (Phalen test): close-up of two hands with the backs of the hands pressed together and wrists fully flexed, fingers pointing down.
Panel 3 (Tinel sign): close-up of a forearm palm-up; the examiner's finger or reflex hammer taps the palm side of the wrist over the median nerve.
Panel 4 (anterior drawer test): patient supine with knee bent 90 degrees and foot flat on the table; the examiner sits lightly on the foot and pulls the upper shin forward with both hands.
```

## 三、Servier 現成圖(S，不需要 AI)

| # | 圖 | Servier 檔／投影片 | 用在 | 備註 |
|---|---|---|---|---|
| S-1 | 全身骨骼(正面) | Bones s3、s5 | skeletal-system | 標主要骨 15–20 個 |
| S-2 | 顱骨(正面、側面) | Bones s7 | skeletal-system | 顱骨題 14 題；小構造(孔、裂)不標，用表 |
| S-3 | 脊柱側面(彎曲) | Bones s8 | skeletal-system | 頸前凸、胸後凸、腰前凸、薦後凸 |
| S-4 | 典型脊椎骨 | Bones s10 | skeletal-system | 椎體、棘突、橫突、椎孔 |
| S-5 | 男女骨盆 | Bones s11 | skeletal-system | 恥骨弓角度 |
| S-6 | 膝關節 | Bones s15–16 | skeletal-system、骨科檢查 | 半月板、十字韌帶、側副韌帶、髕韌帶 |
| S-7 | 長骨構造與骨化 | Bone-structure s10、Bones s19 | skeletal-system | 骨骺板、骨幹、骨膜 |
| S-8 | 骨單位(哈氏系統) | Bone-structure s3 | skeletal-system | |
| S-9 | 骨質疏鬆骨小樑 | Bone-structure s21 | osteoporosis | |
| S-10 | 骨折種類 | Bone-fractures s3–5 | fractures | 斜、粉碎、螺旋、開放、青枝、橫斷 |
| S-11 | 骨折癒合 | Bone-fractures s19 | fractures | 血腫 → 骨痂 → 重塑 |
| S-12 | OA vs RA 關節 | Bones s29、s30(Heberden) | osteoarthritis | |
| S-13 | 人工關節 | Bones s36 | joint-replacement | 髖、膝 |
| S-14 | 脊柱側彎／駝背／前凸 | Bones s32 | 兒童頁 | |
| S-15 | 肌肉層級(肌束 → 肌纖維 → 肌原纖維) | Muscles s6 | muscular-system | |
| S-16 | 肌節與肌絲滑動 | Muscles s10–12 | muscular-system | 標 Z 線、I 帶、A 帶、H 區 |
| S-17 | 全身肌肉 | Muscles s3 | muscular-system | 正背面各標 10–15 條 |
| S-18 | 皮膚分層 | Dermatology s3–4 | skin 頁 | 表皮、真皮、皮下、毛囊、汗腺、皮脂腺 |
| S-19 | 表皮細胞 | Dermatology s5 | skin 頁 | 黑色素細胞、蘭氏細胞、Merkel |
| S-20 | 燒傷深度 | Dermatology s10 | 燒傷頁 | 一、二、三度 |
| S-21 | 黑色素瘤 ABCDE | Dermatology s8 | 皮膚癌 | |

## 四、原創 SVG(O)

| # | 圖 | 用在 | 備註 |
|---|---|---|---|
| O-1 | 滑液關節構造(關節囊、滑膜、關節軟骨、關節腔) | skeletal-system | 簡單切面 |
| O-2 | 腔室症候群惡性循環(腫脹 → 壓力 ↑ → 灌流 ↓ → 缺血 → 更腫) | fractures | 流程圖 |
| O-3 | 截肢殘肢 8 字彈繃 | fractures 截肢段 | 先查 bandaging 是否已有 |

## 五、用表格就好(不做圖)

主要骨骼肌的起止與動作、旋轉肌袖、股三角邊界、顱骨孔裂與通過構造、6P、石膏與牽引照護、皮膚原發與續發病灶、燒傷深度比較、嚴重度分級、敷料種類

## 六、待使用者確認

1. 上面 AI-1 到 AI-8 要不要都做、優先順序對不對
2. 生成後放 `相關資源/AI底圖/`，告訴我檔名，我再疊標籤(等知識庫建完)
