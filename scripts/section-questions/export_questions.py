"""從 Supabase 匯出段落考題分配要用的題目文字(id、題幹、選項、考點)到工作目錄的 questions.json。

用法(在 rnhighpass-quiz/)：
  database/.venv/bin/python scripts/section-questions/export_questions.py <工作目錄>
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "database" / "scripts"))
from lib.db import get_connection  # noqa: E402

out_dir = Path(sys.argv[1])
out_dir.mkdir(parents=True, exist_ok=True)
cur = get_connection().cursor()
cur.execute("select id, stem, option_a, option_b, option_c, option_d, key_point from questions")
cols = [d[0] for d in cur.description]
rows = [dict(zip(cols, r)) for r in cur.fetchall()]
(out_dir / "questions.json").write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
print(f"{len(rows)} 題 → {out_dir / 'questions.json'}")
