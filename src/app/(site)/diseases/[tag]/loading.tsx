import { Skeleton } from "@/components/ui/Skeleton";

// 與章節頁同一套：只蓋右欄，左側標籤清單留著
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-w-0">
      <span className="sr-only">題目載入中…</span>
      <Skeleton className="mb-4 h-9 w-64 max-w-full" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-card" />
        ))}
      </div>
    </div>
  );
}
