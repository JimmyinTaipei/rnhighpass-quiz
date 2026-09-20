import json
import os

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


def get_connection():
    url = os.environ["SUPABASE_DB_URL"]
    return psycopg2.connect(url)


def upsert(
    cur,
    table: str,
    rows: list[dict],
    conflict_cols: list[str],
    json_cols: tuple[str, ...] = (),
    protect_columns: tuple[str, ...] = (),
    protect_flag_col: str = "edited_fields",
):
    """通用 upsert：以 conflict_cols 做 ON CONFLICT DO UPDATE，回傳寫入筆數。
    rows 為空時直接跳過（execute_values 不接受空 list）。

    protect_columns：這些欄位如果已經被網頁端手動編輯過，就不要用來源檔案覆蓋。
    判斷依據是資料庫該列的 protect_flag_col（預設 questions.edited_fields，
    內容是被改過的欄位名稱陣列）。目前只有 questions 會傳這個參數，
    其他表維持「一律以來源檔案為準」的行為。

    這個機制是必要的：同步是從 markdown 全量 upsert，沒有它的話網頁上改的東西
    下一次跑 sync_all.py 就會消失。
    """
    if not rows:
        return 0

    cols = list(rows[0].keys())
    update_cols = [c for c in cols if c not in conflict_cols]

    def to_value(col, v):
        if col in json_cols:
            return psycopg2.extras.Json(v)
        return v

    values = [tuple(to_value(c, row[c]) for c in cols) for row in rows]

    col_list = ", ".join(f'"{c}"' for c in cols)
    conflict_list = ", ".join(f'"{c}"' for c in conflict_cols)
    if update_cols:
        def update_expr(c: str) -> str:
            if c in protect_columns:
                # 該欄位被標記為手動編輯過 -> 保留資料庫現值，不吃 excluded
                return (
                    f'"{c}" = case when \'{c}\' = any(coalesce("{table}"."{protect_flag_col}", \'{{}}\'::text[])) '
                    f'then "{table}"."{c}" else excluded."{c}" end'
                )
            return f'"{c}" = excluded."{c}"'

        update_clause = ", ".join(update_expr(c) for c in update_cols)
        sql = (
            f'insert into "{table}" ({col_list}) values %s '
            f'on conflict ({conflict_list}) do update set {update_clause}'
        )
    else:
        sql = (
            f'insert into "{table}" ({col_list}) values %s '
            f'on conflict ({conflict_list}) do nothing'
        )

    psycopg2.extras.execute_values(cur, sql, values, page_size=500)
    return len(rows)
