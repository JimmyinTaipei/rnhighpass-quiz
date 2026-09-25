# database

把 `多保命護理分章`（章節題庫 / 知識卡 / 表格 / 圖片索引）匯入 Supabase Postgres 的 schema 與同步腳本。

## 資料來源與資料庫的關係

來源資料夾（預設 `/Users/jimmy/Projects/多保命護理分章`，可用 `SOURCE_ROOT` 環境變數覆寫）目前是唯一真實來源（single source of truth）。這裡的腳本是**單向**匯入：讀來源檔案 → upsert 進 Supabase。目前還沒有反向（從網站寫回來源檔案）的機制。

同步策略是「全量重建 + upsert」：每次執行都會重新讀取全部來源檔案，並用資料本身自帶的穩定 ID（題目 ID、`table_id`、知識卡 `node_id` 等）做 `ON CONFLICT DO UPDATE`。這代表：
- 重複執行是安全的（冪等），不會產生重複資料。
- 之後你在 `多保命護理分章` 修改/新增章節、題目、表格、圖片，只要重新執行 `sync_all.py` 就會自動反映到資料庫（新增的會 insert，改過的會 update）。
- 目前**不會刪除**資料庫裡「來源已經移除」的資料（例如你砍掉一個章節檔案，資料庫裡舊的題目不會自動消失）——這是刻意先求簡單安全；如果之後需要偵測「來源已刪除」的情況，可以在 `sync_runs` 記錄的基礎上再加一個 diff 報表。

## 第一次設定

```bash
cd database
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # 然後編輯 .env 填入 SUPABASE_DB_URL（不要 commit 這個檔案）
```

`.env` 需要的值：
- `SUPABASE_DB_URL`：Supabase Dashboard → Project Settings → Database → Connection string（Direct connection 的 URI 格式），把 `[YOUR-PASSWORD]` 換成你的資料庫密碼。

`migrations/0001_init_schema.sql` 只需要手動套用一次（之後改 schema 才需要重新跑）：

```bash
.venv/bin/python -c "
import os
from dotenv import load_dotenv; load_dotenv('.env')
import psycopg2
conn = psycopg2.connect(os.environ['SUPABASE_DB_URL'])
cur = conn.cursor()
cur.execute(open('migrations/0001_init_schema.sql', encoding='utf-8').read())
conn.commit()
"
```

## 執行同步

```bash
cd database
.venv/bin/python scripts/sync_all.py
```

跑完會印出每張表這次寫入/更新的筆數，並在 `sync_runs` 表留一筆紀錄（時間 + 各表筆數 JSON）方便回溯。

## 資料夾結構

```
database/
  migrations/0001_init_schema.sql   -- 完整 schema
  scripts/
    lib/
      common.py          -- 來源路徑常數、11 科清單、5 碼考科分類
      parse_chapters.py  -- 解析 05_chaptered_books/*.md -> chapters/topics/questions
      parse_cards.py     -- 解析 08_knowledge_cards/*_cards.json / *_concepts.json
      parse_tables.py    -- 解析 tables/*.json
      parse_images.py    -- 解析 images/images.json 系列 + 實際存在的 PNG
      db.py               -- Supabase 連線 + 通用 upsert
    sync_all.py           -- 主入口
```

## 已知的來源資料特例

- 少數題目 `ans:` 不是單一字母（如「送分」「B or D」「A(原為C)」），`questions.answer` 因此存成 `text` 而非強制 `A`-`D`，前端顯示時要能處理這些非典型值。
- 11 題的四個選項本身就是圖片（如 `105-2_PC_011`），`option_a`~`option_d` 會是空字串，需搭配 `images` 表（`source_kind='scanned_exam'`）取真正的選項圖檔。
- `images` 索引裡多數 AI 規劃圖（`source_kind='ai_generated'`）目前還沒有實際產生檔案，`storage_path` 會是 `NULL`；只有 17 張是已存在的真實掃描圖檔。
