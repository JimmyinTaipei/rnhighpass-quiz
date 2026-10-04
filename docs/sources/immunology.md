# 第 1.5 輪（免疫）來源包與雲端 session 交接

> 狀態：草稿(2026-10-04)。交給雲端 session 之前，使用者要先確認「待決定」各項。
> 原始資料(UpToDate 匯出 62 篇、指引 PDF 9 份)放在使用者電腦的 `相關資源/免疫相關/`，**不在這個 repo 裡，雲端 session 看不到**。
> 版權原則見 [knowledge-roadmap.md](../knowledge-roadmap.md)「版權優先與 UpToDate 使用原則」。

## 一、主題盤點（只列標題，不含內容）

### 免疫系統基礎（生理類頁）
- 先天免疫：An overview of the innate immune system；Antigen-presenting cells
- 後天免疫：The adaptive cellular immune response: T cells and cytokines；The adaptive humoral immune response；Normal B and T lymphocyte development
- 抗體與基因：Structure of immunoglobulins；Immunoglobulin genetics；Human leukocyte antigens (HLA): A roadmap
- 補體：Overview and clinical assessment of the complement system；Complement pathways；Regulators and receptors of the complement system；Inherited disorders of the complement system；Acquired disorders of the complement system
- 自體免疫與移植：Overview of autoimmunity；Transplantation immunobiology；Pathogenesis of graft-versus-host disease (GVHD)

### 過敏
- 過敏性鼻炎：Allergic rhinitis（臨床表現、診斷）；Pharmacotherapy of allergic rhinitis；Allergen avoidance in the treatment of asthma and allergic rhinitis；兒童過敏性鼻炎診療指引(PDF)
- 全身性過敏反應：Pathophysiology of anaphylaxis；Anaphylaxis: Acute diagnosis；Anaphylaxis: Emergency treatment；Fatal anaphylaxis
- 蕁麻疹與血管性水腫：New-onset urticaria；Chronic spontaneous urticaria（2 篇）；An overview of angioedema（2 篇）
- 接觸性皮膚炎與乳膠：Allergic contact dermatitis（4 篇）；Latex allergy（2 篇）

### 免疫缺乏
- Primary humoral immunodeficiencies: An overview；Agammaglobulinemia
- SCID：overview、X-SCID、Specific defects
- DiGeorge（22q11.2 deletion）：3 篇；Wiskott-Aldrich syndrome；Chronic granulomatous disease（2 篇）

### 自體免疫與風濕
- SLE：Epidemiology and pathogenesis；Clinical manifestations and diagnosis；Overview of the management and prognosis；Measurement and clinical significance of antinuclear antibodies
- 類風濕性關節炎：Epidemiology/risk factors；Pathogenesis；Diagnosis and differential diagnosis；Systemic and nonarticular manifestations；Initial pharmacologic management；Biologic markers
- 川崎氏症：Pathogenesis/epidemiology；Clinical features and diagnosis；Initial treatment and prognosis
- Overview of therapeutic monoclonal antibodies

### 輸血反應
- Approach to the patient with a suspected acute transfusion reaction；Hemolytic transfusion reactions；Allergic and anaphylactic transfusion reactions；Transfusion-related acute lung injury (TRALI)
- 台灣資料(PDF)：精實輸血手冊(2020)；輸血作業 SOP(1031225BT)

### 氣喘（**待決定要不要放在這一輪**）
- UpToDate：An overview of asthma management；Asthma evaluation and diagnosis；Beta-agonists in asthma；Diagnosis and management of asthma in older adults；Trigger control
- 指引(PDF)：GINA 2026；2022 台灣成人氣喘臨床照護指引；2023 台灣兒童氣喘診療指引；兒童氣喘診療指引；台灣兒童嚴重氣喘診療指引
- 路線圖原本把氣喘放在第 5 輪（呼吸）；資料已在手上，可以提前做。

## 二、建議的頁面規劃（草案，雲端 session 可微調，但新增頁要先登記在進度檔）

| 類型 | 頁面(slug) | 主要來源 |
|---|---|---|
| 生理 | immune-system-basics（先天／後天免疫、APC、淋巴球發育） | UpToDate 基礎 6 篇 |
| 生理 | immunoglobulins-hla（抗體結構與基因、HLA） | 3 篇 |
| 生理 | complement-system | 補體 5 篇 |
| 疾病 | allergic-rhinitis | 鼻炎 3 篇＋兒童指引 |
| 疾病 | anaphylaxis（含急救步驟，依 2025 AHA／世界過敏組織急救原則，**不可編造劑量**） | 4 篇 |
| 疾病 | urticaria-angioedema | 5 篇 |
| 疾病 | allergic-contact-dermatitis-latex | 6 篇 |
| 疾病 | primary-immunodeficiency（總覽＋各型比較表） | 免疫缺乏 11 篇 |
| 疾病 | sle | 4 篇 |
| 疾病 | rheumatoid-arthritis | 6 篇 |
| 疾病 | kawasaki-disease（既有 infective-endocarditis 頁有一小段，需連結） | 3 篇 |
| 護理 | transfusion-reactions（含輸血護理） | 輸血 4 篇＋台灣手冊 |
| 藥物 | monoclonal-antibodies | 1 篇＋既有 immunosuppressants 頁 |
| 疾病(待決定) | asthma | 見上 |

> 既有相關頁：`drug/immunosuppressants`、`care/stem-cell-transplant`、`care/immunization`、`lab/inflammatory-markers`、`lab/complete-blood-count`。新頁要和它們互相連結，不要重複寫。

## 三、這輪的資料要怎麼處理（避免版權與正確度問題）

使用者與助理 2026-10-04 的決定：

1. **雲端 session 看不到原始匯出檔**。有兩個做法，使用者擇一：
   - **A（建議）**：先在本機做「來源包」，每個主題一份，只寫**用自己的話整理的事實、數字、分類與流程**，並註明來自哪一篇（篇名＋網址）。來源包進 repo，雲端 session 依來源包寫頁。原始匯出檔留在本機。
   - **B**：雲端 session 只用公開資料（疾管署、國健署、學會指引、WHO／GINA、PubMed 開放全文）寫頁，UpToDate 內容只由使用者事後在本機核對。正確度較低，一定要在進度檔標「待核對」。
   - **不建議**：把 UpToDate 匯出檔放進 GitHub。匯出檔含防複製的形似字元記號，且 repo 可能對外發布。
2. 頁面一律用自己的話與結構重寫，**不貼原文、不逐句翻譯**。
3. 數字、劑量、診斷切點、急救步驟：必須有權威來源（指引或仿單），來源當行標注；沒有就標「待核對」，不要用印象補。
4. 每個主題寫完，在 [knowledge-progress.md](../knowledge-progress.md) 登記，並列入「需確認清單」（最多約 5 項，具體到要確認哪一句，讓使用者在本機對 UpToDate 查）。

## 四、雲端 session 的工作規則

- 開工前先讀 AGENTS.md 指到的四份文件，再讀本檔。
- 依 [positioning.md](../positioning.md) 的範本與「分層列點」格式寫；每頁都要有 `## 重點摘要 {#summary}`（3–5 點）與 `### 國考常考點 {#exam-points}`。
- 考題連結用 `::questions{tag="…"}`，標籤要先用現有的 dzTags 與 `knowledge_coverage` 的標籤對照；**不要自己編題號**。
- 新增頁要跑 `node scripts/build-knowledge.mjs`；必須通過。
- 可以跑 `python3 scripts/source-scan.py`，但雲端沒有匯出檔，只會檢查形似字元；**英文與數字比對要使用者回本機再跑**。
- 不要動 `content/knowledge/taxonomy.yml` 以外的共用設定；要新增 system、類型、分組時，只改 taxonomy 並在進度檔註明。
- 一個 session 做一組主題（例如只做補體＋免疫基礎），分支名稱帶主題，PR 小一點，方便使用者在本機審閱。
