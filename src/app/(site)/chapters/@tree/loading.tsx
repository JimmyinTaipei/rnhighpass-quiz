import { Skeleton } from "@/components/ui/Skeleton";

// 只是側邊欄裡的一小塊，用幾條灰線頂著就好，不要整頁的 spinner
export default function Loading() {
  return (
    <div className="space-y-2 py-1 pl-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}
