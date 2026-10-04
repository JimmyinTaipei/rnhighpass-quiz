"use client";

import { useSyncExternalStore } from "react";

/**
 * 「想打好基礎」區塊的顯示模式。
 * - collapsed(預設):只留一行可點的標題,點了才展開
 * - expanded:一律展開(想打好基礎的學生)
 * - hidden:整個區塊不顯示(給只想看重點的國考生)
 *
 * 存在 localStorage(使用者私有的閱讀偏好,不放網址),開關在 /me 設定頁。
 * SSR 與無法存取 storage 時一律是 collapsed。
 */
export type BasicsMode = "collapsed" | "expanded" | "hidden";

export const BASICS_MODES: BasicsMode[] = ["collapsed", "expanded", "hidden"];

export const DEFAULT_BASICS_MODE: BasicsMode = "collapsed";
const KEY = "kb:basics-mode";
const listeners = new Set<() => void>();

function read(): BasicsMode {
  try {
    const v = window.localStorage.getItem(KEY);
    return BASICS_MODES.includes(v as BasicsMode) ? (v as BasicsMode) : DEFAULT_BASICS_MODE;
  } catch {
    return DEFAULT_BASICS_MODE;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useBasicsMode(): BasicsMode {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_BASICS_MODE);
}

export function setBasicsMode(mode: BasicsMode): void {
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    // 存不了就維持預設,不影響閱讀
  }
  for (const l of listeners) l();
}
