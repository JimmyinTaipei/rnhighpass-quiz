"use client";

import { useState } from "react";

interface Day {
  day: string;
  label: string;
  correct: number;
  wrong: number;
}

// 答對用品牌藍而不是綠：綠/紅對紅綠色盲幾乎無法分辨(驗證 ΔE 2.1)，藍/紅是 19.5
const CORRECT = "#6592CD";
const WRONG = "#E24B4A";

const W = 560;
const H = 160;
const PAD = { top: 12, right: 4, bottom: 22, left: 28 };
const GAP = 2; // 堆疊段之間的間隙

/**
 * 近 14 天每日作答：答對 / 答錯堆疊長條，單一 y 軸(題數)。
 * 正確率不另外疊一條線(那會變成雙 y 軸)，放在 hover 提示裡。
 */
export function DailyChart({ days }: { days: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.correct + d.wrong));
  const niceMax = max <= 5 ? 5 : Math.ceil(max / 10) * 10;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / days.length;
  const barW = Math.min(22, slot * 0.6);
  const y = (v: number) => (v / niceMax) * innerH;
  const baseY = PAD.top + innerH;

  const hovered = hover != null ? days[hover] : null;
  const total = hovered ? hovered.correct + hovered.wrong : 0;

  return (
    <figure className="m-0">
      <div className="mb-2 flex items-center gap-4 text-xs text-body">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CORRECT }} />
          答對
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: WRONG }} />
          答錯
        </span>
        <span className="ml-auto h-4 text-muted" aria-live="polite">
          {hovered &&
            `${hovered.label}：${total} 題，答對 ${hovered.correct}・答錯 ${hovered.wrong}${
              total ? `（${Math.round((hovered.correct / total) * 100)}%）` : ""
            }`}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="近 14 天每日作答題數"
        onMouseLeave={() => setHover(null)}
      >
        {[0, niceMax / 2, niceMax].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={baseY - y(v)}
              y2={baseY - y(v)}
              stroke="#E3E6EC"
              strokeWidth={1}
            />
            <text x={PAD.left - 6} y={baseY - y(v) + 3} textAnchor="end" fontSize={10} fill="#888780">
              {v}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const cx = PAD.left + slot * i + slot / 2;
          const hc = y(d.correct);
          const hw = y(d.wrong);
          const gap = d.correct > 0 && d.wrong > 0 ? GAP : 0;
          const showLabel = i % 2 === 1 || days.length <= 7;
          return (
            <g key={d.day}>
              {/* 命中區比長條大，方便滑鼠與手指點 */}
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill={hover === i ? "#ECEEF3" : "transparent"}
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(i)}
              />
              {d.correct > 0 && (
                <path
                  d={roundedTopBar(cx - barW / 2, baseY - hc, barW, hc, d.wrong > 0 ? 0 : 4)}
                  fill={CORRECT}
                  pointerEvents="none"
                />
              )}
              {d.wrong > 0 && (
                <path
                  d={roundedTopBar(cx - barW / 2, baseY - hc - gap - hw, barW, hw, 4)}
                  fill={WRONG}
                  pointerEvents="none"
                />
              )}
              {showLabel && (
                <text x={cx} y={H - 6} textAnchor="middle" fontSize={10} fill="#888780">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* 螢幕閱讀器用的表格版本 */}
      <table className="sr-only">
        <caption>近 14 天每日作答</caption>
        <thead>
          <tr>
            <th>日期</th>
            <th>答對</th>
            <th>答錯</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.day}>
              <td>{d.label}</td>
              <td>{d.correct}</td>
              <td>{d.wrong}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** 只有上緣圓角的長條(底部貼齊基線) */
function roundedTopBar(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}
