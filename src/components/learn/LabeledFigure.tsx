"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import type { FigureLabel } from "@/lib/knowledge/types";
import { ZoomableFigureImage } from "./ZoomableFigureImage";

type Mode = "zh" | "en" | "quiz";

const MODES: { id: Mode; label: string }[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
  { id: "quiz", label: "隱藏(自我測驗)" },
];

/**
 * 標籤疊加元件:底圖不寫字,標籤存在 public/knowledge-images/labels/*.json,
 * 在網頁上疊到圖上。可切換中文/英文/隱藏;隱藏時點編號才顯示名稱。
 * 座標是相對圖寬高的百分比:x,y 是構造位置,tx,ty(可省略)是文字位置,有寫就畫指線。
 */
export function LabeledFigure({ src, alt, labels }: { src: string; alt: string; labels: FigureLabel[] }) {
  const [mode, setMode] = useState<Mode>("zh");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const changeMode = (m: Mode) => {
    setMode(m);
    setRevealed(new Set());
  };
  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const overlay = (where: "inline" | "modal") => (
    <LabelLayer labels={labels} mode={mode} revealed={revealed} onToggle={toggle} where={where} />
  );

  return (
    <>
      <ZoomableFigureImage
        src={src}
        alt={alt}
        overlay={overlay}
        toolbar={<ModeSwitch mode={mode} onChange={changeMode} dark />}
      />
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <ModeSwitch mode={mode} onChange={changeMode} />
        <span className="flex items-center gap-1 text-xs text-muted">
          <Maximize2 size={12} />
          點圖可放大
        </span>
        {mode === "quiz" && (
          <button
            type="button"
            className="rounded-btn px-2 py-1 text-xs text-muted underline hover:text-deep"
            onClick={() => setRevealed(revealed.size === labels.length ? new Set() : new Set(labels.map((l) => l.id)))}
          >
            {revealed.size === labels.length ? "全部隱藏" : "全部顯示"}
          </button>
        )}
      </div>
      {/* 螢幕閱讀器用的標籤清單(圖上的字是裝飾層) */}
      <ul className="sr-only">
        {labels.map((l) => (
          <li key={l.id}>
            {l.zh}
            {l.en ? `(${l.en})` : ""}
          </li>
        ))}
      </ul>
    </>
  );
}

function ModeSwitch({ mode, onChange, dark = false }: { mode: Mode; onChange: (m: Mode) => void; dark?: boolean }) {
  return (
    <div
      role="radiogroup"
      aria-label="標籤顯示方式"
      className={`inline-flex shrink-0 overflow-hidden rounded-btn border text-xs ${dark ? "border-white/30" : "border-card-border"}`}
    >
      {MODES.map((m) => {
        const active = m.id === mode;
        const cls = dark
          ? active
            ? "bg-white/90 text-black"
            : "text-white/90 hover:bg-white/15"
          : active
            ? "bg-accent text-white"
            : "text-body hover:bg-surface-hover";
        return (
          <button key={m.id} type="button" role="radio" aria-checked={active} onClick={() => onChange(m.id)} className={`px-2.5 py-1.5 ${cls}`}>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

function LabelLayer({
  labels,
  mode,
  revealed,
  onToggle,
  where,
}: {
  labels: FigureLabel[];
  mode: Mode;
  revealed: Set<string>;
  onToggle: (id: string) => void;
  where: "inline" | "modal";
}) {
  // 字級跟著圖寬走(container query 單位),縮圖不擠、放大後也不會太小
  const fontSize = where === "inline" ? "clamp(10px, 2.6cqw, 15px)" : "clamp(11px, 1.8cqw, 22px)";
  return (
    <div className="pointer-events-none absolute inset-0" style={{ containerType: "inline-size" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {labels.map((l) =>
          l.tx !== undefined && l.ty !== undefined ? (
            <line
              key={l.id}
              x1={l.x}
              y1={l.y}
              x2={l.tx}
              y2={l.ty}
              stroke="#334155"
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
      </svg>
      {labels.map((l, i) => {
        const hasLeader = l.tx !== undefined && l.ty !== undefined;
        const left = hasLeader ? l.tx! : l.x;
        const top = hasLeader ? l.ty! : l.y;
        const shown = mode !== "quiz" || revealed.has(l.id);
        const text = mode === "en" ? l.en || l.zh : l.zh;
        return (
          <div key={l.id}>
            {hasLeader && (
              <span
                aria-hidden="true"
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700 ring-1 ring-white"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
              />
            )}
            <div
              className={`absolute -translate-y-1/2 ${l.align === "start" ? "" : l.align === "end" ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: `${left}%`, top: `${top}%`, fontSize }}
            >
              {mode === "quiz" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(l.id);
                  }}
                  className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 leading-none font-semibold whitespace-nowrap text-slate-800 shadow ring-1 ring-slate-400 hover:bg-white"
                  aria-label={shown ? `${i + 1}:${l.zh}` : `顯示第 ${i + 1} 個標籤`}
                >
                  <span className="tabular-nums">{i + 1}</span>
                  {shown && <span>{l.zh}</span>}
                </button>
              ) : (
                shown && (
                  <span
                    aria-hidden="true"
                    // 有指線的標籤加白底，指線的終點藏在字底下，不會穿過文字；只有往右延伸的標籤可以在圖邊換行
                    className={`block leading-tight font-semibold text-slate-900 ${hasLeader ? "rounded-sm bg-white/90 px-1" : ""} ${l.align === "start" ? "" : "whitespace-nowrap"}`}
                    style={{ textShadow: "0 0 3px #fff, 0 0 3px #fff, 0 0 2px #fff, 0 0 1px #fff" }}
                  >
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
