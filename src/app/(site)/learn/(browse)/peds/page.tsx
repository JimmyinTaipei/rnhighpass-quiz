import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { DOMAIN_KIND_LABELS, PEDS_NAV } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: `${PEDS_NAV.label}|知識庫` };

/**
 * 跨系統的「小兒」檢視。小兒是對象標記(peds)不是 domain:頁面仍屬原本的器官系統。
 * 標記待審閱確認後才有資料,目前顯示即將推出說明。
 */
export default function LearnPedsPage() {
  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>{DOMAIN_KIND_LABELS.cross}</span>
      </nav>
      <h1 className="mb-4 text-3xl font-bold text-strong">{PEDS_NAV.label}</h1>
      <ComingSoon description={PEDS_NAV.description} />
    </div>
  );
}
