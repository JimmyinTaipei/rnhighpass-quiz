"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";

type HintProps = Omit<ComponentProps<"button">, "ref"> & {
  /** 短文字操作說明；連結、表單與網站教學應使用獨立元件 */
  content: string;
};

const OPEN_DELAY = 300;
const CLOSE_DELAY = 150;
const EDGE_GAP = 12;
const ANCHOR_GAP = 8;

/** 帶提示的按鈕：hover／鍵盤聚焦顯示，觸控點選同時保留原本操作 */
export function Hint({ content, children, onClick, onFocus, onBlur, onPointerDown, onPointerEnter, onPointerLeave, "aria-describedby": describedBy, ...props }: HintProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerType = useRef("mouse");
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  function clearTimer() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }

  function show() {
    clearTimer();
    setPortalTarget(trigger.current?.closest("[data-ui]") ?? document.body);
    setOpen(true);
  }

  function hide() {
    clearTimer();
    setOpen(false);
    setPosition(null);
  }

  function deferClose() {
    clearTimer();
    timer.current = setTimeout(hide, CLOSE_DELAY);
  }

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  useLayoutEffect(() => {
    if (!open || !trigger.current || !bubble.current) return;
    const anchor = trigger.current.getBoundingClientRect();
    const box = bubble.current.getBoundingClientRect();
    const left = Math.max(EDGE_GAP, Math.min(
      anchor.left + (anchor.width - box.width) / 2,
      window.innerWidth - box.width - EDGE_GAP,
    ));
    const above = anchor.top - box.height - ANCHOR_GAP;
    const top = above >= EDGE_GAP ? above : anchor.bottom + ANCHOR_GAP;
    // 實測文字框大小後定位，讓窄螢幕與長文字都不超出視窗
    setPosition({ left, top: Math.max(EDGE_GAP, Math.min(top, window.innerHeight - box.height - EDGE_GAP)) });
  }, [open, content]);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
      setOpen(false);
      setPosition(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    const onDown = (event: PointerEvent) => {
      if (!trigger.current?.contains(event.target as Node) && !bubble.current?.contains(event.target as Node)) dismiss();
    };
    const onScroll = (event: Event) => {
      if (!bubble.current?.contains(event.target as Node)) dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return (
    <>
      <button
        {...props}
        ref={trigger}
        type={props.type ?? "button"}
        aria-describedby={[describedBy, open ? id : undefined].filter(Boolean).join(" ") || undefined}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
          onPointerDown?.(event);
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (event.pointerType !== "mouse") return;
          clearTimer();
          timer.current = setTimeout(show, OPEN_DELAY);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          if (event.pointerType === "mouse") deferClose();
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (event.currentTarget.matches(":focus-visible")) show();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          hide();
        }}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (event.detail > 0 && (pointerType.current !== "mouse" || window.matchMedia("(hover: none)").matches)) {
            if (open) hide();
            else show();
          }
        }}
      >
        {children}
      </button>
      {open && portalTarget && createPortal(
        <div
          ref={bubble}
          id={id}
          role="tooltip"
          className="fixed z-50 w-max max-w-[min(20rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-y-auto break-words rounded-card border border-card-border bg-card px-3 py-2 text-sm leading-relaxed text-body shadow-lg"
          // 動態座標是浮層定位所需；外觀全部沿用既有 tokens
          style={{ left: position?.left ?? 0, top: position?.top ?? 0, visibility: position ? "visible" : "hidden" }}
          onPointerEnter={clearTimer}
          onPointerLeave={deferClose}
        >
          {content}
        </div>,
        // 保留主站的 data-ui tokens，同時避開段落收合容器的裁切
        portalTarget,
      )}
    </>
  );
}
