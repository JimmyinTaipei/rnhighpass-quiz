/** 相關國考題數膠囊(與 chip 選中狀態同色同形、略小);0 題不顯示 */
export function ExamPill({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-deep px-2 py-0.5 text-xs font-medium tabular-nums text-on-accent">
      {count} 題
    </span>
  );
}
