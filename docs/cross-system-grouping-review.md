# 跨系統分組審閱清單（腫瘤、感染、速查）

> 狀態：**規則已實作，請審閱分組結果**。規則只讀現有的 `system` 與 `alsoIn`，沒有改任何頁面。
> 實作在 `src/lib/knowledge/grouping.ts`。用到它的頁面：`/learn/system/oncology`、`/learn/system/infection`，以及 `/learn/type/drug`、`lab`、`pathogen`。

## 規則

分組依「系統」組的順序：神經 → 血液與免疫 → 生殖 → 產科 → 消化 → 心臟血管 → 呼吸 → 內分泌與代謝 → 泌尿 → 骨骼肌肉 → 皮膚 → 精神疾病。沒有對應系統的頁面放在最後的「一般」。組內依相關題數由高到低排列。

1. 主分類本身是器官系統 → 放在該系統。例如 `opioids` 的主分類是神經，就放神經。
2. **腫瘤：規則 A**。取 alsoIn 中**第一個**器官系統；沒有就放「一般」。每篇只出現一次。
3. **感染：方案 B**。alsoIn 中的**每個**器官系統都列出，第一個是主要歸屬。在非主要的組別，列上會標「主要：X」。內容不複製，只是多一個入口。
4. 其他非器官系統的主分類（例如護理專業）→ 照規則 A。

速查頁（藥理、病原體、檢驗）也使用同一個函式，所以：

- 主分類是腫瘤的藥，照規則 A；
- 主分類是感染的藥與病原體，照方案 B。

下表中，◆ 表示規則 A 與方案 B 的結果不同。

## 從預覽看到的問題（請您決定）

1. **alsoIn 的順序變成有意義**。規則 A 只看第一個，方案 B 的「主要歸屬」也是第一個。目前 alsoIn 的順序是撰寫時隨手排的，所以有幾個不自然的結果：
   - `neoplasia 腫瘤概論`、`antineoplastics 抗腫瘤藥物`被放到「血液與免疫」。這兩篇是總論，應該放「一般」。
   - `end-of-life-care 臨終照護`在腫瘤頁被放到「精神疾病」。
   - `pain-management 疼痛護理`在腫瘤頁被放到「神經」。
   - 修正方式二選一：
     - (a) 調整這幾頁 alsoIn 的順序，或拿掉不適合當分組依據的器官。這是改 content/ 頁面，需要您同意。
     - (b) 新增選填欄位 `organ:`，明確指定跨系統頁要放在哪個器官（或 `general`），沒填才套用規則。
   - 我建議 (b)，因為 alsoIn 原本的用途是「也見於」，不該兼任分組。
2. **跨系統頁裡的 alsoIn 頁**（主分類在別處、只是 alsoIn 掛在腫瘤或感染的頁面）也會依它的主分類分組，並標「主分類：X」。例如肺炎在感染頁會出現在「呼吸」。確認這是您要的。
3. 感染頁採用方案 B 之後，`streptococci` 會同時出現在呼吸、心臟血管、泌尿、生殖四組，`gram-negative-bacteria`、`rna-viruses` 等頁也會重複多次。感染頁的列數（含重複）比頁數多。如果覺得太長，可以改成只在主要歸屬列出完整的列，其他組只列標題。
4. 生殖／產科拆分後，病原體的 alsoIn 會再調整（見產科文件，例如鏈球菌改掛產科），分組結果也會跟著變。

### 腫瘤（採用規則 A）：23 篇

| 頁面 | 類型 | 主分類 | alsoIn | 規則 A | 方案 B |
|---|---|---|---|---|---|
| antineoplastics 抗腫瘤藥物 | 藥理 | 腫瘤 | 血液與免疫 | 血液與免疫 | 血液與免疫 |
| cancer 癌症總論與癌症護理 | 疾病 | 腫瘤 | 社區衛生 | 一般 | 一般 |
| pain-management 疼痛護理 | 護理主題 | 基本護理（概念） | 神經、腫瘤 | 神經 | 神經 |
| opioids 鴉片類止痛藥 | 藥理 | 神經 | 腫瘤、精神疾病 | 神經 | 神經 |
| neoplasia 腫瘤概論 | 解剖&生理 | 腫瘤 | 血液與免疫、感染 | 血液與免疫 | 血液與免疫 |
| pediatric-cancers 兒童癌症 | 疾病 | 腫瘤 | 神經、泌尿、骨骼肌肉 | 神經 | 神經、泌尿、骨骼肌肉 ◆ |
| end-of-life-care 臨終照護與安寧緩和療護 | 護理主題 | 基本護理（概念） | 腫瘤、社區衛生、精神疾病 | 精神疾病 | 精神疾病 |
| breast-cancer 乳癌 | 疾病 | 腫瘤 | 生殖、社區衛生 | 生殖 | 生殖 |
| gynecologic-cancers 婦科癌症 | 疾病 | 腫瘤 | 生殖、感染 | 生殖 | 生殖 |
| head-neck-cancers 頭頸癌 | 疾病 | 腫瘤 | 呼吸、消化、社區衛生 | 呼吸 | 呼吸、消化 ◆ |
| immunosuppressants 免疫抑制劑與免疫調節劑 | 藥理 | 血液與免疫 | 泌尿、腫瘤 | 血液與免疫 | 血液與免疫 |
| tumor-markers 腫瘤標記 | 檢驗 | 腫瘤 | — | 一般 | 一般 |
| leukemia 白血病 | 疾病 | 腫瘤 | 血液與免疫 | 血液與免疫 | 血液與免疫 |
| lymphoma-myeloma 淋巴瘤與多發性骨髓瘤 | 疾病 | 腫瘤 | 血液與免疫 | 血液與免疫 | 血液與免疫 |
| complete-blood-count 全血球計數 | 檢驗 | 血液與免疫 | 腫瘤、感染 | 血液與免疫 | 血液與免疫 |
| colorectal-cancer 大腸直腸癌與腸造口護理 | 疾病 | 腫瘤 | 消化、社區衛生 | 消化 | 消化 |
| human-papillomavirus 人類乳突病毒 | 病原體 | 感染 | 生殖、腫瘤 | 生殖 | 生殖 |
| helicobacter-pylori 幽門螺旋桿菌 | 病原體 | 感染 | 消化、腫瘤 | 消化 | 消化 |
| antifungals 抗黴菌藥物 | 藥理 | 感染 | 腫瘤、皮膚 | 皮膚 | 皮膚 |
| cancer-treatment-toxicities 癌症治療副作用與腫瘤急症護理 | 護理主題 | 腫瘤 | 血液與免疫、基本護理（概念） | 血液與免疫 | 血液與免疫 |
| stem-cell-transplant 造血幹細胞移植護理 | 護理主題 | 血液與免疫 | 腫瘤 | 血液與免疫 | 血液與免疫 |
| liver-cancer 肝癌 | 疾病 | 腫瘤 | 消化、感染 | 消化 | 消化 |
| lung-cancer 肺癌 | 疾病 | 腫瘤 | 呼吸、社區衛生 | 呼吸 | 呼吸 |

### 感染（採用方案 B）：55 篇

| 頁面 | 類型 | 主分類 | alsoIn | 規則 A | 方案 B |
|---|---|---|---|---|---|
| asepsis-sterilization 無菌技術與消毒滅菌 | 護理主題 | 基本護理（概念） | 感染 | 一般 | 一般 |
| notifiable-diseases 法定傳染病與傳染病防治 | 護理主題 | 社區衛生 | 感染、護理行政 | 一般 | 一般 |
| childhood-infectious-diseases 兒童傳染病 | 疾病 | 感染 | 社區衛生、皮膚 | 皮膚 | 皮膚 |
| urinary-tract-infection 泌尿道感染 | 疾病 | 泌尿 | 感染、生殖 | 泌尿 | 泌尿 |
| gram-negative-bacteria 革蘭氏陰性菌 | 病原體 | 感染 | 消化、呼吸、社區衛生 | 消化 | 消化、呼吸 ◆ |
| hiv-aids 愛滋病毒感染與愛滋病 | 疾病 | 感染 | 血液與免疫、生殖、社區衛生 | 血液與免疫 | 血液與免疫、生殖 ◆ |
| immunization 預防接種 | 護理主題 | 感染 | 社區衛生、血液與免疫 | 血液與免疫 | 血液與免疫 |
| microbial-pathogenesis 微生物總論與致病機轉 | 解剖&生理 | 感染 | 血液與免疫、基本護理（概念） | 血液與免疫 | 血液與免疫 |
| antibiotics-overview 抗生素總論 | 藥理 | 感染 | 基本護理（概念） | 一般 | 一般 |
| neoplasia 腫瘤概論 | 解剖&生理 | 腫瘤 | 血液與免疫、感染 | 血液與免疫 | 血液與免疫 |
| pediatric-respiratory-infections 兒童呼吸道與耳鼻喉感染 | 疾病 | 呼吸 | 感染、神經 | 呼吸 | 呼吸 |
| sexually-transmitted-infections 性傳染病 | 疾病 | 生殖 | 感染、社區衛生 | 生殖 | 生殖 |
| gynecologic-cancers 婦科癌症 | 疾病 | 腫瘤 | 生殖、感染 | 生殖 | 生殖 |
| tuberculosis 結核病 | 疾病 | 呼吸 | 感染、社區衛生 | 呼吸 | 呼吸 |
| helminths-ectoparasites 蠕蟲與體外寄生蟲 | 病原體 | 感染 | 消化、皮膚、社區衛生 | 消化 | 消化、皮膚 ◆ |
| infectious-diarrhea 感染性腹瀉與食物中毒 | 疾病 | 感染 | 消化、社區衛生 | 消化 | 消化 |
| culture-and-sensitivity 微生物培養與感受性試驗 | 檢驗 | 感染 | 基本護理（概念） | 一般 | 一般 |
| atypical-bacteria 特殊病原菌 | 病原體 | 感染 | 呼吸、社區衛生 | 呼吸 | 呼吸 |
| fungi 真菌 | 病原體 | 感染 | 皮膚、呼吸 | 皮膚 | 皮膚、呼吸 ◆ |
| pneumonia 肺炎 | 疾病 | 呼吸 | 感染 | 呼吸 | 呼吸 |
| vector-borne-zoonotic 病媒傳染病與人畜共通傳染病 | 疾病 | 感染 | 社區衛生 | 一般 | 一般 |
| streptococci 鏈球菌 | 病原體 | 感染 | 呼吸、心臟血管、泌尿、生殖 | 呼吸 | 呼吸、心臟血管、泌尿、生殖 ◆ |
| beta-lactams β-內醯胺類抗生素 | 藥理 | 感染 | 基本護理（概念） | 一般 | 一般 |
| staphylococcus-aureus 金黃色葡萄球菌 | 病原體 | 感染 | 皮膚、骨骼肌肉、基本護理（概念） | 皮膚 | 皮膚、骨骼肌肉 ◆ |
| herpesviruses 疱疹病毒 | 病原體 | 感染 | 皮膚、生殖、社區衛生 | 皮膚 | 皮膚、生殖 ◆ |
| complete-blood-count 全血球計數 | 檢驗 | 血液與免疫 | 腫瘤、感染 | 血液與免疫 | 血液與免疫 |
| viral-hepatitis 病毒性肝炎 | 疾病 | 消化 | 感染、社區衛生 | 消化 | 消化 |
| clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌 | 病原體 | 感染 | 神經、社區衛生 | 神經 | 神經 |
| candida 念珠菌 | 病原體 | 感染 | 生殖、皮膚 | 生殖 | 生殖、皮膚 ◆ |
| protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑 | 藥理 | 感染 | — | 一般 | 一般 |
| infective-endocarditis 感染性心內膜炎與心臟發炎疾病 | 疾病 | 心臟血管 | 感染 | 心臟血管 | 心臟血管 |
| sepsis 敗血症與敗血性休克 | 疾病 | 感染 | 心臟血管、血液與免疫 | 心臟血管 | 心臟血管、血液與免疫 ◆ |
| antivirals 抗病毒藥物 | 藥理 | 感染 | 消化、呼吸 | 消化 | 消化、呼吸 ◆ |
| human-papillomavirus 人類乳突病毒 | 病原體 | 感染 | 生殖、腫瘤 | 生殖 | 生殖 |
| protozoa 原蟲 | 病原體 | 感染 | 消化、生殖、社區衛生 | 消化 | 消化、生殖 ◆ |
| infection-control 感染管制 | 護理主題 | 基本護理（概念） | 感染、護理行政 | 一般 | 一般 |
| helicobacter-pylori 幽門螺旋桿菌 | 病原體 | 感染 | 消化、腫瘤 | 消化 | 消化 |
| antifungals 抗黴菌藥物 | 藥理 | 感染 | 腫瘤、皮膚 | 皮膚 | 皮膚 |
| cns-infections 中樞神經系統感染 | 疾病 | 神經 | 感染 | 神經 | 神經 |
| aminoglycosides 胺基配醣體類 | 藥理 | 感染 | 泌尿 | 泌尿 | 泌尿 |
| infection-control-administration 醫院感染管制與傳染病通報的行政管理 | 護理行政 | 護理行政 | 感染 | 一般 | 一般 |
| antituberculars 抗結核藥物 | 藥理 | 感染 | 呼吸、社區衛生 | 呼吸 | 呼吸 |
| prions 普利昂蛋白 | 病原體 | 感染 | 神經 | 神經 | 神經 |
| anaerobes 厭氧菌 | 病原體 | 感染 | 消化、皮膚 | 消化 | 消化、皮膚 ◆ |
| rna-viruses RNA 病毒 | 病原體 | 感染 | 消化、呼吸、社區衛生 | 消化 | 消化、呼吸 ◆ |
| glycopeptides 醣胜肽類與其他抗 MRSA 藥物 | 藥理 | 感染 | — | 一般 | 一般 |
| respiratory-viral-infections 呼吸道病毒感染 | 疾病 | 感染 | 呼吸、社區衛生 | 呼吸 | 呼吸 |
| antiparasitics 抗寄生蟲藥物 | 藥理 | 感染 | 皮膚、社區衛生 | 皮膚 | 皮膚 |
| fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥 | 藥理 | 感染 | 泌尿 | 泌尿 | 泌尿 |
| dna-viruses DNA 病毒 | 病原體 | 感染 | 呼吸、皮膚 | 呼吸 | 呼吸、皮膚 ◆ |
| gram-positive-bacteria 革蘭氏陽性菌 | 病原體 | 感染 | — | 一般 | 一般 |
| liver-cancer 肝癌 | 疾病 | 腫瘤 | 消化、感染 | 消化 | 消化 |
| perinatal-infections 周產期感染 | 疾病 | 生殖 | 感染 | 生殖 | 生殖 |
| skin-bone-infections 皮膚、軟組織與骨骼感染 | 疾病 | 皮膚 | 感染、骨骼肌肉 | 皮膚 | 皮膚 |
| inflammatory-markers 發炎指標 | 檢驗 | 感染 | 血液與免疫、骨骼肌肉 | 血液與免疫 | 血液與免疫、骨骼肌肉 ◆ |

### 速查・藥理：主分類不是器官系統的 11 篇

| 頁面 | 主分類 | alsoIn | 規則 A | 方案 B |
|---|---|---|---|---|
| aminoglycosides 胺基配醣體類 | 感染 | 泌尿 | 泌尿 | 泌尿 |
| antibiotics-overview 抗生素總論 | 感染 | 基本護理（概念） | 一般 | 一般 |
| antifungals 抗黴菌藥物 | 感染 | 腫瘤、皮膚 | 皮膚 | 皮膚 |
| antineoplastics 抗腫瘤藥物 | 腫瘤 | 血液與免疫 | 血液與免疫 | 血液與免疫 |
| antiparasitics 抗寄生蟲藥物 | 感染 | 皮膚、社區衛生 | 皮膚 | 皮膚 |
| antituberculars 抗結核藥物 | 感染 | 呼吸、社區衛生 | 呼吸 | 呼吸 |
| antivirals 抗病毒藥物 | 感染 | 消化、呼吸 | 消化 | 消化、呼吸 ◆ |
| beta-lactams β-內醯胺類抗生素 | 感染 | 基本護理（概念） | 一般 | 一般 |
| fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥 | 感染 | 泌尿 | 泌尿 | 泌尿 |
| glycopeptides 醣胜肽類與其他抗 MRSA 藥物 | 感染 | — | 一般 | 一般 |
| protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑 | 感染 | — | 一般 | 一般 |

### 速查・病原體：主分類不是器官系統的 17 篇

| 頁面 | 主分類 | alsoIn | 規則 A | 方案 B |
|---|---|---|---|---|
| anaerobes 厭氧菌 | 感染 | 消化、皮膚 | 消化 | 消化、皮膚 ◆ |
| atypical-bacteria 特殊病原菌 | 感染 | 呼吸、社區衛生 | 呼吸 | 呼吸 |
| candida 念珠菌 | 感染 | 生殖、皮膚 | 生殖 | 生殖、皮膚 ◆ |
| clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌 | 感染 | 神經、社區衛生 | 神經 | 神經 |
| dna-viruses DNA 病毒 | 感染 | 呼吸、皮膚 | 呼吸 | 呼吸、皮膚 ◆ |
| fungi 真菌 | 感染 | 皮膚、呼吸 | 皮膚 | 皮膚、呼吸 ◆ |
| gram-negative-bacteria 革蘭氏陰性菌 | 感染 | 消化、呼吸、社區衛生 | 消化 | 消化、呼吸 ◆ |
| gram-positive-bacteria 革蘭氏陽性菌 | 感染 | — | 一般 | 一般 |
| helicobacter-pylori 幽門螺旋桿菌 | 感染 | 消化、腫瘤 | 消化 | 消化 |
| helminths-ectoparasites 蠕蟲與體外寄生蟲 | 感染 | 消化、皮膚、社區衛生 | 消化 | 消化、皮膚 ◆ |
| herpesviruses 疱疹病毒 | 感染 | 皮膚、生殖、社區衛生 | 皮膚 | 皮膚、生殖 ◆ |
| human-papillomavirus 人類乳突病毒 | 感染 | 生殖、腫瘤 | 生殖 | 生殖 |
| prions 普利昂蛋白 | 感染 | 神經 | 神經 | 神經 |
| protozoa 原蟲 | 感染 | 消化、生殖、社區衛生 | 消化 | 消化、生殖 ◆ |
| rna-viruses RNA 病毒 | 感染 | 消化、呼吸、社區衛生 | 消化 | 消化、呼吸 ◆ |
| staphylococcus-aureus 金黃色葡萄球菌 | 感染 | 皮膚、骨骼肌肉、基本護理（概念） | 皮膚 | 皮膚、骨骼肌肉 ◆ |
| streptococci 鏈球菌 | 感染 | 呼吸、心臟血管、泌尿、生殖 | 呼吸 | 呼吸、心臟血管、泌尿、生殖 ◆ |

### 速查・檢驗：主分類不是器官系統的 3 篇

| 頁面 | 主分類 | alsoIn | 規則 A | 方案 B |
|---|---|---|---|---|
| culture-and-sensitivity 微生物培養與感受性試驗 | 感染 | 基本護理（概念） | 一般 | 一般 |
| inflammatory-markers 發炎指標 | 感染 | 血液與免疫、骨骼肌肉 | 血液與免疫 | 血液與免疫、骨骼肌肉 ◆ |
| tumor-markers 腫瘤標記 | 腫瘤 | — | 一般 | 一般 |
