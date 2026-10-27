"use client";

import Link from "next/link";
import { useViewer } from "@/components/viewer/ViewerProvider";

/** DEV mode 開啟時頁面頂端的色帶，避免忘記關掉；也是管理頁的入口 */
export function DevBanner() {
  const { devMode } = useViewer();
  if (!devMode) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 bg-warning px-4 py-0.5 text-xs font-bold tracking-wider text-white">
      <span>DEV MODE・編輯會直接寫入正式資料庫</span>
      <Link href="/admin/reports" className="underline">
        回報管理
      </Link>
      <Link href="/admin/analytics" className="underline">
        使用統計
      </Link>
    </div>
  );
}
