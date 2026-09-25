"use client";

import { useState } from "react";

interface Point {
  label: string;
  value: number;
  detail: string;
}

const W = 640;
const H = 150;
const PAD = { top: 10, right: 4, bottom: 20, left: 30 };

/** 單一數列的每日長條(站長統計的活躍人數)。hover 顯示當天明細。 */
export function UsageChart({ points, title }: { points: Point[]; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...points.map((p) => p.value));
  const niceMax = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(points.length, 1);
  const barW = Math.max(2, Math.min(16, slot - 2));
  const baseY = PAD.top + innerH;
  const every = Math.ceil(points.length / 8);

  return (
    <figure className="m-0">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-body">{title}</span>
        <span className="h-4 text-muted" aria-live="polite">
          {hover != null && `${points[hover].label}：${points[hover].detail}`}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title} onMouseLeave={() => setHover(null)}>
        {[0, niceMax / 2, niceMax].map((v) => {
          const y = baseY - (v / niceMax) * innerH;
          return (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#E3E6EC" />
              <text x={PAD.left - 6} y={y + 3} textAnchor="end" fontSize={10} fill="#888780">
                {v}
              </text>
            </g>
          );
        })}
        {points.map((p, i) => {
          const h = (p.value / niceMax) * innerH;
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={i}>
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill={hover === i ? "#ECEEF3" : "transparent"}
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(i)}
              />
              {h > 0 && (
                <path
                  d={`M${x},${baseY} L${x},${baseY - h + r} Q${x},${baseY - h} ${x + r},${baseY - h} L${x + barW - r},${baseY - h} Q${x + barW},${baseY - h} ${x + barW},${baseY - h + r} L${x + barW},${baseY} Z`}
                  fill="#6592CD"
                  pointerEvents="none"
                />
              )}
              {i % every === 0 && (
                <text x={PAD.left + slot * i + slot / 2} y={H - 5} textAnchor="middle" fontSize={10} fill="#888780">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
