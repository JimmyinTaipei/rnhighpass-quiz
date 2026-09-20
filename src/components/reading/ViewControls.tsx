"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Eye, LayoutGrid, List } from "lucide-react";
import { VIEW_MODES, type ViewMode } from "@/lib/view-mode";

const VIEW_LABELS: Record<ViewMode, { label: string; Icon: typeof List }> = {
  quiz: { label: "題目", Icon: List },
  card: { label: "卡片", Icon: LayoutGrid },
};

/**
 * 顯示模式切換。
 *
 * 狀態放在 URL searchParams 而不是 localStorage：頁面是 Server Component，
 * searchParams 可以直接讀、可分享連結，也不會有 SSR/client 不一致的問題。
 */
export function ViewControls({ view, reveal }: { view: ViewMode; reveal: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-btn border border-card-border bg-card p-0.5">
        {VIEW_MODES.map((mode) => {
          const { label, Icon } = VIEW_LABELS[mode];
          const active = view === mode;
          return (
            <button
              key={mode}
              onClick={() => update({ view: mode === "quiz" ? null : mode })}
              className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-subj-light text-subj-deep"
                  : "text-muted hover:text-subj-deep"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => update({ reveal: reveal ? null : "1" })}
        className={`flex items-center gap-1 rounded-btn border px-3 py-1.5 text-sm font-medium transition-colors ${
          reveal
            ? "border-subj-accent bg-subj-light text-subj-deep"
            : "border-card-border bg-card text-body hover:border-subj-accent"
        }`}
        // 講清楚為什麼這個開關不會影響錯題本
        title="開啟後直接顯示答案與詳解，且不會記錄作答、不收錄錯題本"
      >
        <Eye size={14} />
        直接顯示答案
      </button>
    </div>
  );
}
