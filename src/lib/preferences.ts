"use client";

import { useSyncExternalStore } from "react";

// 使用者偏好設定。目前存在這台裝置(localStorage)，之後做設定頁時直接沿用：
// 新增一項 = 在 Preferences 加欄位、在 DEFAULTS 給預設值。
// 讀不到(SSR、無痕模式、資料被清)時一律回到預設值，不會讓頁面壞掉。

export interface Preferences {
  /** 練習時什麼時候看對錯與詳解 */
  feedback: "immediate" | "end";
  /** 練習時顯示計時 */
  timer: boolean;
  /** 作答前打亂選項順序 */
  shuffleOptions: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  feedback: "immediate",
  timer: false,
  shuffleOptions: true,
};

const KEY = "prefs:v1";
const listeners = new Set<() => void>();
let cache: Preferences | null = null;

function read(): Preferences {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    // 合併預設值：舊版存的資料少了新欄位時，新欄位用預設
    cache = { ...DEFAULT_PREFERENCES, ...(raw ? (JSON.parse(raw) as Partial<Preferences>) : {}) };
  } catch {
    cache = DEFAULT_PREFERENCES;
  }
  return cache;
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  cache = { ...read(), [key]: value };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // 存不了就只在這次瀏覽有效
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 其他分頁改了設定也同步
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_PREFERENCES);
}
