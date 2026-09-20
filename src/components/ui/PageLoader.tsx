import { MorphingSquare } from "@/components/ui/morphing-square";

/**
 * 換頁時的載入畫面(給各個 loading.tsx 與 client 端的等待狀態共用)。
 * 方塊用品牌色 accent；min-h 讓它在內容區大致置中，不會貼在頁首下方。
 */
export function PageLoader({ message = "載入中…" }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] w-full flex-1 items-center justify-center text-sm text-muted"
    >
      <MorphingSquare message={message} className="bg-accent" />
    </div>
  );
}
