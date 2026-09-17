import json
import os

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


def get_connection():
    url = os.environ["SUPABASE_DB_URL"]
    return psycopg2.connect(url)


def upsert(cur, table: str, rows: list[dict], conflict_cols: list[str], json_cols: tuple[str, ...] = ()):
    """通用 upsert：以 conflict_cols 做 ON CONFLICT DO UPDATE，回傳寫入筆數。
    rows 為空時直接跳過（execute_values 不接受空 list）。"""
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
        update_clause = ", ".join(f'"{c}" = excluded."{c}"' for c in update_cols)
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
