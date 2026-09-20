import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * SSR 與 hydration 期間回傳 false，hydration 完成後回傳 true。
 *
 * 用來延後「只能在瀏覽器決定」的內容(localStorage、亂數排列)：
 * 在 true 之前不渲染它們，就不會跟 server 的 HTML 對不上。
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
