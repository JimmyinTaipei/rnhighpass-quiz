# 新梯次考題匯入流程

> 每次國考公布試題與答案後照這份做。兩個 repo：**題庫** `多保命護理分章/`(本地檔案是唯一真實來源)、**網站** `rnhighpass-quiz/`
> 試題版面有兩種，解析器都支援：**電腦化**(例 115-1、115-3，「1.題幹」「A.選項」)、**紙本**(例 114-2、116-2，題號自成一行、選項用私用區字元)
> 2026-10-29 建立。解析器拿 105-1～115-2 共 25 梯次驗證：答案 8,700 題只差 2 題(題庫自己的寫法不同)，113 年後每梯題目文字只有 0–4 題不同(題庫後來人工修過的字、承上題連結)

## 0. 開始前：先把網頁上的修改拉回本地

網頁 dev mode 改過的題目、比較表要先寫回本地，不然之後 sync 會跟本地檔案對不起來。平常也可以隨時跑。

```sh
cd rnhighpass-quiz
database/.venv/bin/python database/scripts/pull_web_edits.py          # 預覽
database/.venv/bin/python database/scripts/pull_web_edits.py --write  # 寫回 01、02、tables，清掉 edited_fields
```

寫回的紀錄在 `多保命護理分章/analysis/題目修正紀錄.md`。

## 1. 放 PDF

到考選部下載，放進 `多保命護理分章/_data_prep/00_exams_pdf_origin/<梯次>/`：

| 檔案 | 命名 |
|---|---|
| 試題(5 科) | 考選部原檔名，檔名要含「基礎醫學」「基本護理」「內外科」「產兒科」「精神科」 |
| 標準答案 | `ans_<梯次>_<BM/FA/MS/OP/PC>.pdf` |
| 更正答案(有才放) | `MOD_<梯次>_<科目>.pdf` |

更正答案通常比試題晚幾週公布；先用標準答案匯入，更正出來後見第 7 步。

## 2. 解析成題目骨架(題庫)

```sh
cd 多保命護理分章
.venv/bin/python scripts/_tools/import_exam_pdf.py --sitting 115-3          # 預覽，看報告
.venv/bin/python scripts/_tools/import_exam_pdf.py --sitting 115-3 --write  # 寫入 01_exam_papers(已存在不覆蓋)
```

產生 ID、source、ques、選項、ans；chap、tag、ref、sol 留空。報告 `analysis/import_exam_pdf_report.md` 會列：

- **有圖片的頁**：對照 PDF 找出附圖題，截圖放 `images/`，在題目加圖片連結(格式照既有附圖題)
- **重複圈號(①①)、「情況：」**：PDF 解析可能出錯，對照 PDF 修正
- **讀不到答案、看不懂的更正備註**：人工填 ans

另外要人工處理：題組的「承上題」照既有題目改成連結(`02_apply_continuation_links.py`)。

## 3. 分類與詳解(chap、xchap、tag、sol)

每題要填：

- `chap`：主章節，值要跟分章檔 H1 一樣(例 `內外-Ch09呼吸系統疾病`)
- `xchap`：跨章(可多個，逗號分隔)
- `tag`：`block:系統`、`dz:疾病`、`drug:藥物`、`adm:行政標籤`，用「, 」分隔，盡量用既有標籤
- `ref: AI生成`、`sol`：考點／正解為何對／其餘選項為何錯／延伸提醒(問「何者錯誤」的題目是正解為何錯／其餘選項為何對)

做法二選一(使用者決定；Batch 額度 2026-11-10 過期，之後不再用 Batch)：

1. **在對話中請 Claude 做**：一科 50 題一批，Claude 讀題目、參考 `chapter_maps/` 與既有標籤直接寫進 01
2. **上傳給線上 AI**：把題目(ID、題幹、選項、答案)貼或上傳給線上 AI，提示詞用 `batch/templates/solution_prompt.md` 與 `classification_prompt.md`，請它**只輸出「ID 對照結果」的 JSONL**，一行一題：
   - 詳解：`{"id": "115-3_BM_001", "sol": "考點：…\n 正解為何對：…\n 其餘選項為何錯：…\n 延伸提醒：…"}`
   - 分類：`{"id": "115-3_BM_001", "chap": "…", "xchap": "…", "tag": "…"}`
   下載後放進 `batch/nursing/normalized/`，用 `02_apply_sol.py --jsonl <檔> --dry-run`、`02_apply_chap_tag_xchap.py --jsonl <檔> --dry-run` 預覽再套用(依 ID 對應，不依順序)

做完跑檢查，問題清單清到 0(新標籤要確認是不是錯字)：

```sh
.venv/bin/python scripts/_tools/check_new_sitting.py --sitting 115-3
```

## 4. 放進分章檔(題庫)

```sh
.venv/bin/python scripts/02_place_new_questions.py --sitting 115-3          # 預覽，看 analysis/02_place_new_questions_report.md
.venv/bin/python scripts/02_place_new_questions.py --sitting 115-3 --write
.venv/bin/python scripts/02_sync_01_to_02.py --dry-run                      # 應該沒有差異
```

依題目(含詳解)跟各小節現有題目的相似度選小節。驗證(拿 114-3～115-2 的題目挖空重放)：整體放對約 75%，沒標「需確認」的約 88–90%。

報告裡「需確認」的，看前幾名小節自己決定：在 01 那一題加一行 `section: 小節標題` 再跑一次 `--write`(寫入後 `section:` 會自動拿掉)。

做完 commit 題庫 repo。

## 5. 寫進網站(網站)

```sh
cd rnhighpass-quiz
cd database && .venv/bin/python scripts/sync_all.py && cd ..                    # 題目、標籤、小節寫進 Supabase
database/.venv/bin/python database/scripts/resolve_knowledge_questions.py        # 知識頁各段落的規則重查(新題會進來)
database/.venv/bin/python database/scripts/export_knowledge_questions.py         # 知識頁「N 題相關考題」
```

新題被規則抓到頁尾「綜合考題」的，分進段落：

```sh
W=<暫存資料夾>
database/.venv/bin/python scripts/section-questions/export_questions.py $W
python3 scripts/section-questions/classify.py $PWD $W     # scores.json，可抽查
python3 scripts/section-questions/apply.py $PWD $W
node scripts/build-knowledge.mjs
```

涵蓋報告(有沒有新標籤、新疾病沒有知識頁)：`python3 ../多保命護理分章/scripts/knowledge_coverage.py`，新出現的標籤照標籤合併規則處理，沒有知識頁的列給使用者決定要不要寫。

## 6. 模擬考站與部署

- 主站「歷年考題模擬」直接讀 Supabase，不用改
- 模擬考站(exam.rnhighpass.com)：`database/scripts/export_mock_papers.py` 的 `SITTINGS` 加新梯次(目前放最近 3 梯)，跑完另外部署 exam 站
- 主站部署照 [deploy-size-plan.md](deploy-size-plan.md)，commit 網站 repo
- 更新 [knowledge-progress.md](knowledge-progress.md) 的「目前狀態」(題數、涵蓋)

## 7. 更正答案出來之後

把 `MOD_<梯次>_<科目>.pdf` 放進同一資料夾，重新解析答案並比對：

```sh
.venv/bin/python scripts/_tools/import_exam_pdf.py --validate 115-3
```

列出的「答案不同」就是更正的題目：照考選部更正改 01 的 ans(「A or B」「送分」「A(原為C)」)，跑 `02_sync_01_to_02.py`、`sync_all.py`。詳解要跟著改的(例如原本解釋 C、更正成 A)，在詳解加註更正。

## 已知限制

- 105–109 年舊 PDF 的圈號字(①②)解析不可靠，那幾年不能拿 PDF 當準；新梯次沒有這個問題
- 比對題庫時，選項只看 `ques:` 到 `ans:` 之間：詳解常有「（C）…」開頭的行，不是選項(網站、Word 的解析器也是這樣讀)
