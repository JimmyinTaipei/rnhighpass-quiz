import { Skeleton } from "@/components/ui/Skeleton";

/**
 * 章節頁的載入骨架。
 *
 * 這個 loading 被包在 chapters/layout.tsx 裡面，所以只蓋住右欄——左側的科目
 * 切換器與 Ch 列表在載入期間留在原地不動(節點樹另有 @tree/loading.tsx)。
 * 原本是整頁的 PageLoader，換章時會把剛畫好的側邊欄整個抹掉再重畫。
 */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-w-0">
      <span className="sr-only">章節載入中…</span>
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-4 h-9 w-80 max-w-full" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-card" />
        ))}
      </div>
    </div>
  );
}
