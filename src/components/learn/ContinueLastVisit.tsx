import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getLastVisit } from "@/lib/last-visit";

/**
 * 首頁的「繼續閱讀」:只有登入者、且有紀錄時才出現。
 * 只指向上次開啟的那一頁,不計算閱讀進度。
 */
export async function ContinueLastVisit() {
  const last = await getLastVisit();
  if (!last) return null;
  return (
    <Link
      href={`/learn/${last.slug}`}
      className="mb-6 flex items-center gap-3 rounded-card bg-sidebar px-4 py-3 transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
    >
      <BookOpen size={18} className="shrink-0 text-muted" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted">繼續閱讀</span>
        <span className="block truncate text-sm font-medium text-body">{last.title}</span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-muted" />
    </Link>
  );
}
