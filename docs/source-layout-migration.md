# 護理來源目錄遷移（2026-10-23）

護理來源根目錄仍為 `多保命護理分章`，可用 `SOURCE_ROOT` 覆寫。

| 舊名稱 | 現用名稱 |
|---|---|
| `04_ID_Source_added` | `01_exam_papers` |
| `05_chaptered_books` | `02_chaptered` |
| `06_output_word` | `03_word` |
| `07_pdf_raw` | `04_pdf_raw` |
| `07_pdf` | `04_pdf` |
| `08_knowledge_cards` | `05_knowledge_cards` |
| `09_檔案pdf` | `06_pdf_assets` |
| `subject mappings` | `chapter_maps` |

歷史 tag-merge 文件中的 04／05 與 backup 路徑保留當時原貌。備份清理與還原索引見來源專案 `docs/backup_cleanup_manifest.json`、`docs/restructure_report.md`。

`醫事國考/`（含護理二技）不在目前護理匯入範圍。此次沒有執行資料庫同步或重建網站資料。

唯讀路徑預檢（在 database/ 執行）：

```sh
.venv/bin/python -c 'import sys; sys.path.insert(0, "scripts"); from lib.common import validate_source_paths; print(validate_source_paths())'
```

`sync_all.py` 也會在建立資料庫連線前檢查來源目錄。
