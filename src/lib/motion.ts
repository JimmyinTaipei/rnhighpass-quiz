import type { MotionProps } from "motion/react";

// 主站的動態規則(docs/motion-audit-2026-10-28.md)：
// 進場「先快後慢」、出場比進場快一點；怎麼進來就怎麼出去；只動 transform 與 opacity。
// CSS 那邊同一組值在 globals.css 的 --ease-* / --dur-*。

/** 先快後慢：出現、消失、一般介面 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** iOS 抽屜：底部面板、側邊面板 */
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/**
 * 彈出層的進出場：
 * - scrim：背景暗幕，淡入淡出
 * - sheet：手機底部面板，從底部滑上來、滑回底部
 * - dialog：置中對話框，從 96% 縮放淡入
 * - fade：全螢幕檢視(圖片放大)，只淡入淡出
 * - popover：從按鈕長出來的小選單；transform-origin 由呼叫端的 class 決定(例如 origin-top)
 * 偏好減少動態時一律只淡入淡出 150ms(保留「出現了」的提示，拿掉位移)。
 */
export type OverlayKind = "scrim" | "sheet" | "dialog" | "fade" | "popover";

/** 只回傳 initial／animate／exit，可以展開到任何 motion 元素(div、button…)上 */
export function overlayMotion(
  kind: OverlayKind,
  reduce: boolean | null,
): Pick<MotionProps, "initial" | "animate" | "exit"> {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    };
  }
  switch (kind) {
    case "sheet":
      return {
        initial: { transform: "translateY(100%)" },
        animate: { transform: "translateY(0%)", transition: { duration: 0.3, ease: EASE_DRAWER } },
        exit: { transform: "translateY(100%)", transition: { duration: 0.2, ease: EASE_DRAWER } },
      };
    case "dialog":
      return {
        initial: { opacity: 0, transform: "scale(0.96)" },
        animate: { opacity: 1, transform: "scale(1)", transition: { duration: 0.2, ease: EASE_OUT } },
        exit: { opacity: 0, transform: "scale(0.96)", transition: { duration: 0.15, ease: EASE_OUT } },
      };
    case "popover":
      return {
        initial: { opacity: 0, transform: "scale(0.95)" },
        animate: { opacity: 1, transform: "scale(1)", transition: { duration: 0.15, ease: EASE_OUT } },
        exit: { opacity: 0, transform: "scale(0.95)", transition: { duration: 0.1, ease: EASE_OUT } },
      };
    case "scrim":
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
      };
  }
}
