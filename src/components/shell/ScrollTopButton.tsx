"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useHideOnScrollDown } from "@/lib/use-hide-on-scroll";

/**
 * 右下角「回到頂端」。捲超過一個畫面高度才出現，往下捲(在讀內文)時收起、往上捲才出現，
 * 不擋字；手機放在底部頁籤上方。
 * 偏好減少動態效果時直接跳到頂端，不用平滑捲動。
 */
export function ScrollTopButton() {
  const [pastFirstScreen, setPastFirstScreen] = useState(false);
  const hiddenByScroll = useHideOnScrollDown();
  const show = pastFirstScreen && !hiddenByScroll;

  useEffect(() => {
    const onScroll = () => setPastFirstScreen(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="回到頂端"
      title="回到頂端"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed right-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] z-30 flex size-11 items-center justify-center rounded-full border border-card-border bg-card/90 text-accent shadow-md backdrop-blur-xl transition-[opacity,translate] duration-200 ease-out hover:bg-surface-hover motion-reduce:transition-none md:right-6 md:bottom-6 ${
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.2} />
    </button>
  );
}
