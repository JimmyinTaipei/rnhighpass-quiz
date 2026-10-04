"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Maximize2, Minus, Plus, Shrink, X } from "lucide-react";

const ZOOMS = [1, 1.5, 2, 3, 4];
/** 拖曳超過這個距離就不算「點一下」 */
const DRAG_THRESHOLD = 4;

/**
 * 知識庫的圖:點縮圖開全螢幕檢視,可放大後拖曳/捲動查看細節。
 * 倍率 1 = 符合視窗;放大是以「符合視窗時的寬度」為基準。
 */
export function ZoomableFigureImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [fitWidth, setFitWidth] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // 換倍率前記下畫面中心落在圖的哪個比例位置,換完後捲回同一點
  const centerRatio = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);

  const zoom = ZOOMS[zoomIndex];

  const close = useCallback(() => {
    setOpen(false);
    setZoomIndex(0);
    triggerRef.current?.focus();
  }, []);

  const changeZoom = useCallback((next: number) => {
    const el = viewportRef.current;
    if (el) {
      centerRatio.current = {
        x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
        y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
      };
    }
    setZoomIndex(Math.max(0, Math.min(ZOOMS.length - 1, next)));
  }, []);

  // 符合視窗時量一次圖寬,作為放大的基準;視窗大小改變時回到符合並重量
  const measure = useCallback(() => {
    if (imgRef.current) setFitWidth(imgRef.current.clientWidth);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      setZoomIndex(0);
      requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, measure]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    const ratio = centerRatio.current;
    if (!el || !ratio) return;
    centerRatio.current = null;
    el.scrollLeft = ratio.x * el.scrollWidth - el.clientWidth / 2;
    el.scrollTop = ratio.y * el.scrollHeight - el.clientHeight / 2;
  }, [zoomIndex]);

  // Esc 關閉、+/- 縮放、開啟時鎖住背景捲動
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") changeZoom(zoomIndex + 1);
      else if (e.key === "-") changeZoom(zoomIndex - 1);
      else if (e.key === "0") changeZoom(0);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, zoomIndex, close, changeZoom]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const toolButton =
    "flex h-9 min-w-9 items-center justify-center rounded-btn px-2 text-white/90 transition-colors hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`放大檢視:${alt}`}
        className="group relative mx-auto block max-w-full cursor-zoom-in"
      >
        {/* 圖多為 SVG 圖解,next/image 對 SVG 沒有最佳化效果,直接用 img */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="mx-auto max-h-[480px] w-auto max-w-full rounded-btn border border-card-border bg-white" />
        <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-btn bg-black/60 px-2 py-1 text-xs text-white opacity-80 transition-opacity group-hover:opacity-100">
          <Maximize2 size={13} />
          點擊放大
        </span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={alt}>
            <div className="flex shrink-0 items-center gap-1 px-2 py-2 sm:px-4">
              <p className="mr-auto line-clamp-1 min-w-0 px-1 text-sm text-white/90">{alt}</p>
              <button type="button" className={toolButton} onClick={() => changeZoom(zoomIndex - 1)} disabled={zoomIndex === 0} aria-label="縮小">
                <Minus size={18} />
              </button>
              <span className="w-12 text-center text-sm text-white/90 tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                className={toolButton}
                onClick={() => changeZoom(zoomIndex + 1)}
                disabled={zoomIndex === ZOOMS.length - 1}
                aria-label="放大"
              >
                <Plus size={18} />
              </button>
              <button type="button" className={toolButton} onClick={() => changeZoom(0)} disabled={zoomIndex === 0} aria-label="符合畫面">
                <Shrink size={18} />
              </button>
              <a href={src} target="_blank" rel="noreferrer" className={toolButton} aria-label="在新分頁開啟原圖">
                <ExternalLink size={18} />
              </a>
              <button ref={closeRef} type="button" className={toolButton} onClick={close} aria-label="關閉">
                <X size={20} />
              </button>
            </div>

            <div
              ref={viewportRef}
              className={`flex min-h-0 flex-1 overflow-auto p-2 sm:p-4 ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
              // 點背景關閉;用 e.target === e.currentTarget 避免點到圖也被關掉
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
              onPointerDown={(e) => {
                // 觸控用原生捲動平移;滑鼠才自己處理拖曳
                if (e.pointerType !== "mouse" || zoom === 1) return;
                const el = e.currentTarget;
                drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false };
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d) return;
                const dx = e.clientX - d.x;
                const dy = e.clientY - d.y;
                if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) d.moved = true;
                e.currentTarget.scrollLeft = d.left - dx;
                e.currentTarget.scrollTop = d.top - dy;
              }}
              onPointerUp={() => {
                // moved 留到 click 事件判斷完才清掉
                setTimeout(() => {
                  drag.current = null;
                });
              }}
            >
              {/* m-auto:圖比視窗小時置中,放大後也不會被裁掉左上角 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                draggable={false}
                onLoad={measure}
                onClick={() => {
                  if (drag.current?.moved) return;
                  changeZoom(zoom === 1 ? ZOOMS.indexOf(2) : 0);
                }}
                style={zoom > 1 && fitWidth ? { width: fitWidth * zoom, maxWidth: "none", maxHeight: "none" } : undefined}
                className={`m-auto max-h-full max-w-full rounded-btn bg-white select-none ${zoom === 1 ? "cursor-zoom-in" : ""}`}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
