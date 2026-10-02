"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Eye, List, Map as MapIcon } from "lucide-react";
import { VIEW_MODES, type ViewMode } from "@/lib/view-mode";
import { pillGray, pillSubjectSoft } from "@/lib/ui";

const VIEW_LABELS: Record<ViewMode, { label: string; Icon: typeof List }> = {
  map: { label: "考點地圖", Icon: MapIcon },
  quiz: { label: "題目瀏覽", Icon: List },
};

/**
 * 顯示模式切換。
 *
 * 狀態放在 URL searchParams 而不是 localStorage：頁面是 Server Component，
 * searchParams 可以直接讀、可分享連結，也不會有 SSR/client 不一致的問題。
 */
export function ViewControls({
  view,
  reveal,
  defaultView = "quiz",
  modes = VIEW_MODES,
}: {
  view: ViewMode;
  reveal: boolean;
  /** 可切換的模式。疾病頁只有題目，只剩一種時不顯示切換 */
  modes?: readonly ViewMode[];
  /** 這一章沒帶 ?view= 時的模式；切回它時把參數拿掉，網址保持乾淨 */
  defaultView?: ViewMode;
}) {
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
      {modes.length > 1 && (
        <div className="segmented">
          {modes.map((mode) => {
            const { label, Icon } = VIEW_LABELS[mode];
            const active = view === mode;
            return (
              <button
                key={mode}
                onClick={() => update({ view: mode === defaultView ? null : mode })}
                aria-pressed={active}
                className="flex items-center gap-1"
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* 地圖不直接顯示題目，這個開關沒有作用 */}
      {view !== "map" && (
        <button
          onClick={() => update({ reveal: reveal ? null : "1" })}
          aria-pressed={reveal}
          className={reveal ? pillSubjectSoft : pillGray}
          // 講清楚為什麼這個開關不會影響錯題本
          title="開啟後直接顯示答案與詳解，且不會記錄作答、不收錄錯題本"
        >
          <Eye size={14} />
          直接顯示答案
        </button>
      )}
    </div>
  );
}
