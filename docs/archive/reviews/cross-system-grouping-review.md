# 跨系統分組（腫瘤、感染、小兒、速查）

> 狀態：**已確認並套用**（2026-10）。規則只讀現有的 `system` 與 `alsoIn`，不需另外標記。
> 實作：`src/lib/knowledge/grouping.ts`。用到的頁面：`/learn/system/oncology`、`/learn/system/infection`、`/learn/peds`、`/learn/type/drug|lab|pathogen`。

## 規則

組的順序：器官系統（同側欄：神經 → 血液與免疫 → 生殖 → 產科 → 消化 → 心臟血管 → 呼吸 → 內分泌與代謝 → 泌尿 → 骨骼肌肉 → 皮膚 → 精神疾病）→ 護理專業（基本護理、護理行政、社區衛生）→ 一般。組內依相關題數由高到低。

1. 主分類是器官系統或護理專業 → 就放在該組。例如臨終照護、疼痛護理放「基本護理」。
2. **腫瘤（規則 A）**：取 alsoIn 中第一個器官系統，沒有就放「一般」。每頁只出現一次。
3. **感染與病原體（方案 B）**：alsoIn 中每個器官系統都列，第一個是主要歸屬，其他組會標「主要：X」。內容不複製。
4. 速查頁用同一個函式：主分類是感染的頁照方案 B，其他照規則 A。

## 已確認的決定

- 腫瘤概論（neoplasia）、抗腫瘤藥物（antineoplastics）暫時留在「血液與免疫」，之後再說。不新增 `organ` 欄位。
- end-of-life-care 臨終照護 → 基本護理。
- pain-management 疼痛護理 → 基本護理（使用者說神經或基本護理都可以，依規則 1 自然落在基本護理）。
- 感染頁列出病原體。

## 預覽（依目前資料自動產生）

### 腫瘤（規則 A）：23 篇

| 頁面 | 類型 | 主分類 | alsoIn | 分組 |
|---|---|---|---|---|
| antineoplastics 抗腫瘤藥物 | 藥理 | 腫瘤 | 血液與免疫 | 血液與免疫 |
| cancer 癌症總論與癌症護理 | 疾病 | 腫瘤 | 社區衛生 | 一般 |
| pain-management 疼痛護理 | 護理主題 | 基本護理（概念） | 神經、腫瘤 | 基本護理（概念） |
| opioids 鴉片類止痛藥 | 藥理 | 神經 | 腫瘤、精神疾病 | 神經 |
| neoplasia 腫瘤概論 | 解剖&生理 | 腫瘤 | 血液與免疫、感染 | 血液與免疫 |
| pediatric-cancers 兒童癌症 | 疾病 | 腫瘤 | 神經、泌尿、骨骼肌肉 | 神經 |
| end-of-life-care 臨終照護與安寧緩和療護 | 護理主題 | 基本護理（概念） | 腫瘤、社區衛生、精神疾病 | 基本護理（概念） |
| breast-cancer 乳癌 | 疾病 | 腫瘤 | 生殖、社區衛生 | 生殖 |
| gynecologic-cancers 婦科癌症 | 疾病 | 腫瘤 | 生殖、感染 | 生殖 |
| head-neck-cancers 頭頸癌 | 疾病 | 腫瘤 | 呼吸、消化、社區衛生 | 呼吸 |
| immunosuppressants 免疫抑制劑與免疫調節劑 | 藥理 | 血液與免疫 | 泌尿、腫瘤 | 血液與免疫 |
| tumor-markers 腫瘤標記 | 檢驗 | 腫瘤 | — | 一般 |
| leukemia 白血病 | 疾病 | 腫瘤 | 血液與免疫 | 血液與免疫 |
| lymphoma-myeloma 淋巴瘤與多發性骨髓瘤 | 疾病 | 腫瘤 | 血液與免疫 | 血液與免疫 |
| complete-blood-count 全血球計數 | 檢驗 | 血液與免疫 | 腫瘤、感染 | 血液與免疫 |
| colorectal-cancer 大腸直腸癌與腸造口護理 | 疾病 | 腫瘤 | 消化、社區衛生 | 消化 |
| human-papillomavirus 人類乳突病毒 | 病原體 | 感染 | 生殖、腫瘤 | 生殖 |
| helicobacter-pylori 幽門螺旋桿菌 | 病原體 | 感染 | 消化、腫瘤 | 消化 |
| antifungals 抗黴菌藥物 | 藥理 | 感染 | 腫瘤、皮膚 | 皮膚 |
| cancer-treatment-toxicities 癌症治療副作用與腫瘤急症護理 | 護理主題 | 腫瘤 | 血液與免疫、基本護理（概念） | 血液與免疫 |
| stem-cell-transplant 造血幹細胞移植護理 | 護理主題 | 血液與免疫 | 腫瘤 | 血液與免疫 |
| liver-cancer 肝癌 | 疾病 | 腫瘤 | 消化、感染 | 消化 |
| lung-cancer 肺癌 | 疾病 | 腫瘤 | 呼吸、社區衛生 | 呼吸 |

### 感染（方案 B）：55 篇

| 頁面 | 類型 | 主分類 | alsoIn | 分組 |
|---|---|---|---|---|
| asepsis-sterilization 無菌技術與消毒滅菌 | 護理主題 | 基本護理（概念） | 感染 | 基本護理（概念） |
| notifiable-diseases 法定傳染病與傳染病防治 | 護理主題 | 社區衛生 | 感染、護理行政 | 社區衛生 |
| childhood-infectious-diseases 兒童傳染病 | 疾病 | 感染 | 社區衛生、皮膚 | 皮膚 |
| urinary-tract-infection 泌尿道感染 | 疾病 | 泌尿 | 感染、生殖 | 泌尿 |
| gram-negative-bacteria 革蘭氏陰性菌 | 病原體 | 感染 | 消化、呼吸、社區衛生 | 消化、呼吸 |
| hiv-aids 愛滋病毒感染與愛滋病 | 疾病 | 感染 | 血液與免疫、生殖、社區衛生 | 血液與免疫、生殖 |
| immunization 預防接種 | 護理主題 | 感染 | 社區衛生、血液與免疫 | 血液與免疫 |
| microbial-pathogenesis 微生物總論與致病機轉 | 解剖&生理 | 感染 | 血液與免疫、基本護理（概念） | 血液與免疫 |
| antibiotics-overview 抗生素總論 | 藥理 | 感染 | 基本護理（概念） | 一般 |
| neoplasia 腫瘤概論 | 解剖&生理 | 腫瘤 | 血液與免疫、感染 | 血液與免疫 |
| pediatric-respiratory-infections 兒童呼吸道與耳鼻喉感染 | 疾病 | 呼吸 | 感染、神經 | 呼吸 |
| sexually-transmitted-infections 性傳染病 | 疾病 | 生殖 | 感染、社區衛生 | 生殖 |
| gynecologic-cancers 婦科癌症 | 疾病 | 腫瘤 | 生殖、感染 | 生殖 |
| tuberculosis 結核病 | 疾病 | 呼吸 | 感染、社區衛生 | 呼吸 |
| helminths-ectoparasites 蠕蟲與體外寄生蟲 | 病原體 | 感染 | 消化、皮膚、社區衛生 | 消化、皮膚 |
| infectious-diarrhea 感染性腹瀉與食物中毒 | 疾病 | 感染 | 消化、社區衛生 | 消化 |
| culture-and-sensitivity 微生物培養與感受性試驗 | 檢驗 | 感染 | 基本護理（概念） | 一般 |
| atypical-bacteria 特殊病原菌 | 病原體 | 感染 | 呼吸、社區衛生 | 呼吸 |
| fungi 真菌 | 病原體 | 感染 | 皮膚、呼吸 | 皮膚、呼吸 |
| pneumonia 肺炎 | 疾病 | 呼吸 | 感染 | 呼吸 |
| vector-borne-zoonotic 病媒傳染病與人畜共通傳染病 | 疾病 | 感染 | 社區衛生 | 一般 |
| streptococci 鏈球菌 | 病原體 | 感染 | 呼吸、心臟血管、泌尿、生殖 | 呼吸、心臟血管、泌尿、生殖 |
| beta-lactams β-內醯胺類抗生素 | 藥理 | 感染 | 基本護理（概念） | 一般 |
| staphylococcus-aureus 金黃色葡萄球菌 | 病原體 | 感染 | 皮膚、骨骼肌肉、基本護理（概念） | 皮膚、骨骼肌肉 |
| herpesviruses 疱疹病毒 | 病原體 | 感染 | 皮膚、生殖、社區衛生 | 皮膚、生殖 |
| complete-blood-count 全血球計數 | 檢驗 | 血液與免疫 | 腫瘤、感染 | 血液與免疫 |
| viral-hepatitis 病毒性肝炎 | 疾病 | 消化 | 感染、社區衛生 | 消化 |
| clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌 | 病原體 | 感染 | 神經、社區衛生 | 神經 |
| candida 念珠菌 | 病原體 | 感染 | 生殖、皮膚 | 生殖、皮膚 |
| protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑 | 藥理 | 感染 | — | 一般 |
| infective-endocarditis 感染性心內膜炎與心臟發炎疾病 | 疾病 | 心臟血管 | 感染 | 心臟血管 |
| sepsis 敗血症與敗血性休克 | 疾病 | 感染 | 心臟血管、血液與免疫 | 心臟血管、血液與免疫 |
| antivirals 抗病毒藥物 | 藥理 | 感染 | 消化、呼吸 | 消化、呼吸 |
| human-papillomavirus 人類乳突病毒 | 病原體 | 感染 | 生殖、腫瘤 | 生殖 |
| protozoa 原蟲 | 病原體 | 感染 | 消化、生殖、社區衛生 | 消化、生殖 |
| infection-control 感染管制 | 護理主題 | 基本護理（概念） | 感染、護理行政 | 基本護理（概念） |
| helicobacter-pylori 幽門螺旋桿菌 | 病原體 | 感染 | 消化、腫瘤 | 消化 |
| antifungals 抗黴菌藥物 | 藥理 | 感染 | 腫瘤、皮膚 | 皮膚 |
| cns-infections 中樞神經系統感染 | 疾病 | 神經 | 感染 | 神經 |
| aminoglycosides 胺基配醣體類 | 藥理 | 感染 | 泌尿 | 泌尿 |
| infection-control-administration 醫院感染管制與傳染病通報的行政管理 | 護理行政 | 護理行政 | 感染 | 護理行政 |
| antituberculars 抗結核藥物 | 藥理 | 感染 | 呼吸、社區衛生 | 呼吸 |
| prions 普利昂蛋白 | 病原體 | 感染 | 神經 | 神經 |
| anaerobes 厭氧菌 | 病原體 | 感染 | 消化、皮膚 | 消化、皮膚 |
| rna-viruses RNA 病毒 | 病原體 | 感染 | 消化、呼吸、社區衛生 | 消化、呼吸 |
| glycopeptides 醣胜肽類與其他抗 MRSA 藥物 | 藥理 | 感染 | — | 一般 |
| respiratory-viral-infections 呼吸道病毒感染 | 疾病 | 感染 | 呼吸、社區衛生 | 呼吸 |
| antiparasitics 抗寄生蟲藥物 | 藥理 | 感染 | 皮膚、社區衛生 | 皮膚 |
| fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥 | 藥理 | 感染 | 泌尿 | 泌尿 |
| dna-viruses DNA 病毒 | 病原體 | 感染 | 呼吸、皮膚 | 呼吸、皮膚 |
| gram-positive-bacteria 革蘭氏陽性菌 | 病原體 | 感染 | — | 一般 |
| liver-cancer 肝癌 | 疾病 | 腫瘤 | 消化、感染 | 消化 |
| perinatal-infections 周產期感染 | 疾病 | 生殖 | 感染 | 生殖 |
| skin-bone-infections 皮膚、軟組織與骨骼感染 | 疾病 | 皮膚 | 感染、骨骼肌肉 | 皮膚 |
| inflammatory-markers 發炎指標 | 檢驗 | 感染 | 血液與免疫、骨骼肌肉 | 血液與免疫、骨骼肌肉 |

### 速查・藥理：主分類不是器官系統的 11 篇

| 頁面 | 主分類 | alsoIn | 分組 |
|---|---|---|---|
| aminoglycosides 胺基配醣體類 | 感染 | 泌尿 | 泌尿 |
| antibiotics-overview 抗生素總論 | 感染 | 基本護理（概念） | 一般 |
| antifungals 抗黴菌藥物 | 感染 | 腫瘤、皮膚 | 皮膚 |
| antineoplastics 抗腫瘤藥物 | 腫瘤 | 血液與免疫 | 血液與免疫 |
| antiparasitics 抗寄生蟲藥物 | 感染 | 皮膚、社區衛生 | 皮膚 |
| antituberculars 抗結核藥物 | 感染 | 呼吸、社區衛生 | 呼吸 |
| antivirals 抗病毒藥物 | 感染 | 消化、呼吸 | 消化、呼吸 |
| beta-lactams β-內醯胺類抗生素 | 感染 | 基本護理（概念） | 一般 |
| fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥 | 感染 | 泌尿 | 泌尿 |
| glycopeptides 醣胜肽類與其他抗 MRSA 藥物 | 感染 | — | 一般 |
| protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑 | 感染 | — | 一般 |

### 速查・病原體：主分類不是器官系統的 17 篇

| 頁面 | 主分類 | alsoIn | 分組 |
|---|---|---|---|
| anaerobes 厭氧菌 | 感染 | 消化、皮膚 | 消化、皮膚 |
| atypical-bacteria 特殊病原菌 | 感染 | 呼吸、社區衛生 | 呼吸 |
| candida 念珠菌 | 感染 | 生殖、皮膚 | 生殖、皮膚 |
| clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌 | 感染 | 神經、社區衛生 | 神經 |
| dna-viruses DNA 病毒 | 感染 | 呼吸、皮膚 | 呼吸、皮膚 |
| fungi 真菌 | 感染 | 皮膚、呼吸 | 皮膚、呼吸 |
| gram-negative-bacteria 革蘭氏陰性菌 | 感染 | 消化、呼吸、社區衛生 | 消化、呼吸 |
| gram-positive-bacteria 革蘭氏陽性菌 | 感染 | — | 一般 |
| helicobacter-pylori 幽門螺旋桿菌 | 感染 | 消化、腫瘤 | 消化 |
| helminths-ectoparasites 蠕蟲與體外寄生蟲 | 感染 | 消化、皮膚、社區衛生 | 消化、皮膚 |
| herpesviruses 疱疹病毒 | 感染 | 皮膚、生殖、社區衛生 | 皮膚、生殖 |
| human-papillomavirus 人類乳突病毒 | 感染 | 生殖、腫瘤 | 生殖 |
| prions 普利昂蛋白 | 感染 | 神經 | 神經 |
| protozoa 原蟲 | 感染 | 消化、生殖、社區衛生 | 消化、生殖 |
| rna-viruses RNA 病毒 | 感染 | 消化、呼吸、社區衛生 | 消化、呼吸 |
| staphylococcus-aureus 金黃色葡萄球菌 | 感染 | 皮膚、骨骼肌肉、基本護理（概念） | 皮膚、骨骼肌肉 |
| streptococci 鏈球菌 | 感染 | 呼吸、心臟血管、泌尿、生殖 | 呼吸、心臟血管、泌尿、生殖 |

### 速查・檢驗：主分類不是器官系統的 3 篇

| 頁面 | 主分類 | alsoIn | 分組 |
|---|---|---|---|
| culture-and-sensitivity 微生物培養與感受性試驗 | 感染 | 基本護理（概念） | 一般 |
| inflammatory-markers 發炎指標 | 感染 | 血液與免疫、骨骼肌肉 | 血液與免疫、骨骼肌肉 |
| tumor-markers 腫瘤標記 | 腫瘤 | — | 一般 |
