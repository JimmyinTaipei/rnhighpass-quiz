"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate, motion, useDragControls, useReducedMotion, type PanInfo } from "motion/react";
import { Maximize2, X } from "lucide-react";
import { EASE_DRAWER } from "@/lib/motion";

interface KnowledgePanelProps {
  title: string;
  /** 「開啟完整頁」連到的知識頁 */
  fullHref: string;
  children: React.ReactNode;
}

// iOS sheet 的手感:有一點彈性但不晃
const SPRING = { type: "spring", stiffness: 420, damping: 40, mass: 0.9 } as const;
// 退場比進場快，走同一條路回去
const EXIT = { duration: 0.2, ease: EASE_DRAWER } as const;
// 往下拉超過面板高度的 30%，或放開時往下的速度夠快(px/s，同 Vaul 的 0.4 px/ms)就關閉
const DISMISS_RATIO = 0.3;
const DISMISS_VELOCITY = 400;

/**
 * 知識面板的外框(內容由 ArticleView 提供，與知識頁相同)。
 *
 * md 以上是右側面板：不蓋暗底下的頁面，章節內容照樣能讀、能捲，方便對照。
 * 手機是底部拉起的 sheet，背景變暗、點背景關閉。
 * 關閉 = router.back():面板有自己的網址(/k/<slug>)，返回鍵也會關掉它，
 * 跟 iOS 用滑動返回關閉 sheet 的直覺一致。
 * 點關閉或背景時先播退場(手機滑回底部、md 以上滑回右邊)再 router.back();
 * 手機可以抓著上方標題列往下拉關閉。Esc 是鍵盤操作，直接關、不播動畫。
 */
export function KnowledgePanel({ title, fullHref, children }: KnowledgePanelProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  // 手機由下往上、md 以上由右往左。面板只在站內換頁時於瀏覽器端渲染(直接開 /k
  // 會轉到知識頁)，但仍防一下沒有 window 的情況
  const [wide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );
  const [closing, setClosing] = useState(false);
  // 減少動態：只淡入淡出，不滑動
  const hidden = reduce ? { opacity: 0 } : wide ? { x: "100%" } : { y: "100%" };
  const shown = reduce ? { opacity: 1 } : { x: 0, y: 0 };
  const transition = reduce ? { duration: 0.15 } : SPRING;
  const dragControls = useDragControls();
  // 退場用命令式 animate 等它播完再 router.back()(用 onAnimationComplete 會被其他屬性的完成事件提早觸發)
  const close = async () => {
    if (closing || !panelRef.current) return;
    setClosing(true);
    await animate(panelRef.current, hidden, reduce ? { duration: 0.15 } : EXIT);
    router.back();
  };

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    const height = panelRef.current?.offsetHeight ?? window.innerHeight;
    if (info.offset.y > height * DISMISS_RATIO || info.velocity.y > DISMISS_VELOCITY) close();
  };

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    // 手機 sheet 開著時鎖住底下頁面的捲動；md 以上的側邊面板不鎖(要能對照)
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [router]);


  return (
    <>
      <motion.button
        type="button"
        aria-label="關閉知識面板"
        onClick={close}
        className="fixed inset-0 z-40 bg-black/30 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: reduce ? 0.15 : 0.2 }}
      />
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label={title}
        className="on-white fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl outline-none md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-[min(560px,48vw)] md:rounded-none md:border-l md:border-card-border"
        initial={hidden}
        animate={shown}
        transition={transition}
        // 手機：從標題列往下拉，跟手 1:1;放開沒到門檻就彈回
        drag={wide || reduce || closing ? false : "y"}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 40 }}
        onDragEnd={onDragEnd}
      >
        <header
          className="flex shrink-0 touch-none items-center gap-2 border-b border-card-border px-3 py-2 md:touch-auto"
          onPointerDown={(e) => {
            if (!wide) dragControls.start(e);
          }}
        >
          {/* 手機 sheet 的抓取條：抓著標題列往下拉可以關閉 */}
          <span aria-hidden className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-card-border md:hidden" />
          <button
            type="button"
            onClick={close}
            aria-label="關閉"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-hover hover:text-deep active:scale-95"
          >
            <X size={18} />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-deep">{title}</p>
          <Link
            href={fullHref}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-surface-hover hover:text-deep"
          >
            <Maximize2 size={13} /> 完整頁面
          </Link>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-4">{children}</div>
      </motion.div>
    </>
  );
}
