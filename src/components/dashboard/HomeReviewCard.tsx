import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/data";
import { loadReviewSchedule } from "@/lib/notebook-data";
import { pillTint } from "@/lib/ui";

/** 首頁「今天該複習 N 題」(間隔複習)。未登入、沒有錯題與收藏時不顯示 */
export async function HomeReviewCard() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { due, upcoming, graduated } = await loadReviewSchedule();
  const tomorrow = upcoming[0] ?? 0;
  if (due.length === 0 && tomorrow === 0 && graduated === 0) return null;

  return (
    <section className="w-full max-w-md rounded-card bg-card p-4 text-left shadow-sm">
      <div className="flex items-center gap-3">
        <CalendarCheck size={22} className="shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-deep">
            {due.length > 0 ? `今天該複習 ${due.length} 題` : "今天的複習都做完了"}
          </h2>
          <p className="text-xs text-muted">
            錯題與收藏依記憶間隔排程{tomorrow > 0 && `・明天 ${tomorrow} 題`}
            {graduated > 0 && `・已熟記 ${graduated} 題`}
          </p>
        </div>
        {due.length > 0 && (
          <Link href="/quiz/review?source=due" className={pillTint}>
            開始
          </Link>
        )}
      </div>
    </section>
  );
}
