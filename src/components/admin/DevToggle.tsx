"use client";

import { useState, useTransition } from "react";
import { Wrench } from "lucide-react";
import { setDevMode } from "@/lib/actions";

/**
 * dev mode 開關。只會被 UserStatus 在「已確認是 admin」時渲染，
 * 非 admin 的頁面 payload 裡不會有這個元件。
 * 切換後 server action 設定 cookie，Next 會在同一次往返重新渲染頁面。
 */
export function DevToggle({ enabled }: { enabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await setDevMode(!enabled);
      if (!result.ok) setError(result.reason ?? "切換失敗");
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={enabled}
      title={error ?? (enabled ? "關閉 DEV mode" : "開啟 DEV mode")}
      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50 ${
        enabled
          ? "border-warning bg-warning text-white"
          : "border-card-border bg-card text-muted hover:border-warning hover:text-warning"
      }`}
    >
      <Wrench size={12} />
      DEV
    </button>
  );
}
