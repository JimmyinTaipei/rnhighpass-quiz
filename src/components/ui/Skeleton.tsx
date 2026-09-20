/** 載入中的灰底方塊。基本款，之後可換成更精緻的骨架。 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-card-border/60 ${className}`} />;
}

/** 卡片形狀的骨架，給題目/章節列表用 */
export function SkeletonCard() {
  return (
    <div className="rounded-card border border-card-border bg-card p-5 shadow-sm">
      <Skeleton className="mb-3 h-4 w-28" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-4/5" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
