"""把 explanation_text（考點/正解為何對(錯)/其餘選項為何對(錯)/延伸提醒 用換行接在一起
的純文字）拆成結構化欄位。sync pipeline 與 backfill script 共用。
"""

# 每個 marker 對應輸出欄位；同一欄位可能有兩種措辭（為何對 / 為何錯）
_MARKERS = [
    ("考點：", "key_point"),
    ("正解為何對：", "correct_reason"),
    ("正解為何錯：", "correct_reason"),
    ("其餘選項為何對：", "wrong_options_reason"),
    ("其餘選項為何錯：", "wrong_options_reason"),
    ("延伸提醒：", "extra_notes"),
]


def _match_marker(line: str):
    for marker, field in _MARKERS:
        if line.startswith(marker):
            return field, line[len(marker):]
    return None


def split_explanation(raw: str) -> dict:
    """回傳 {key_point, correct_reason, wrong_options_reason, extra_notes}，
    各值為 str 或 None（該段沒出現，或整段文字完全不符合已知格式）。
    """
    result = {"key_point": None, "correct_reason": None,
              "wrong_options_reason": None, "extra_notes": None}
    if not raw:
        return result

    current_field = None
    buffers: dict[str, list[str]] = {}
    for line in raw.splitlines():
        matched = _match_marker(line.strip())
        if matched is not None:
            current_field, first_content = matched
            buffers.setdefault(current_field, []).append(first_content)
        elif current_field is not None:
            buffers[current_field].append(line)

    for field, lines in buffers.items():
        text = "\n".join(lines).strip()
        if text:
            result[field] = text

    return result
