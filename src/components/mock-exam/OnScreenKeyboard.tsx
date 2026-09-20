"use client";

import { Delete } from "lucide-react";

const ROWS = ["1234567890".split(""), "ABCDEFGHIJKLM".split(""), "NOPQRSTUVWXYZ".split("")];

/**
 * 畫面鍵盤，按鍵排列比照考選部電腦化測驗登入頁。
 * 正式考場沒有實體鍵盤，所以登入只能靠這組按鍵輸入。
 */
export function OnScreenKeyboard({
  canPress,
  onKey,
  onBackspace,
  canBackspace,
}: {
  /** 這顆鍵目前能不能按(例如第 1 碼只能按字母) */
  canPress: (key: string) => boolean;
  onKey: (key: string) => void;
  onBackspace: () => void;
  canBackspace: boolean;
}) {
  const keyClass =
    "flex h-10 min-w-0 items-center justify-center rounded-btn border border-card-border bg-card text-base font-medium text-strong shadow-[0_2px_0_var(--color-card-border)] transition-all active:translate-y-0.5 active:shadow-none hover:border-accent hover:text-deep disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-card-border disabled:hover:text-strong sm:h-11";

  return (
    <div
      role="group"
      aria-label="畫面鍵盤"
      className="space-y-2 rounded-card border border-card-border bg-page p-3 sm:p-4"
    >
      {ROWS.map((row, i) => (
        <div
          key={i}
          className="grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${i === 0 ? 12 : 13}, minmax(0, 1fr))` }}
        >
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onKey(key)}
              disabled={!canPress(key)}
              className={keyClass}
            >
              {key}
            </button>
          ))}
          {i === 0 && (
            <button
              type="button"
              onClick={onBackspace}
              disabled={!canBackspace}
              aria-label="刪除一個字"
              className={`${keyClass} col-span-2`}
            >
              <Delete size={20} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
