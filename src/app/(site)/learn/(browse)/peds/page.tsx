import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { OrganGroups } from "@/components/learn/OrganGroups";
import { byExamCount } from "@/lib/knowledge";
import { groupByOrgan } from "@/lib/knowledge/grouping";
import { pedsArticles } from "@/lib/knowledge/nav";
import { DOMAIN_KIND_LABELS, PEDS_NAV, type ArticleSummary } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: `${PEDS_NAV.label}|知識庫` };

/** 專屬頁不加註;一般頁標出是哪幾段小兒內容 */
const sectionNote = (a: ArticleSummary) =>
  a.peds || !a.pedsSections?.length ? undefined : `小兒段落:${a.pedsSections.map((s) => s.title).join("、")}`;

/**
 * 跨系統的「小兒」檢視。小兒是對象標記(peds)不是 domain:頁面仍屬原本的器官系統。
 * 收錄小兒專屬頁(peds: true)與含小兒段落的頁(建置時自動偵測),依系統分組。
 */
export default async function LearnPedsPage() {
  const showDraft = await isAdmin();
  const articles = pedsArticles();
  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>{DOMAIN_KIND_LABELS.cross}</span>
      </nav>
      <h1 className="mb-1 text-3xl font-bold text-strong">{PEDS_NAV.label}</h1>
      {articles.length === 0 ? (
        <ComingSoon description={PEDS_NAV.description} />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted">
            {articles.length} 篇・小兒專屬 {articles.filter((a) => a.peds).length} 篇，其餘是含小兒段落的頁面
          </p>
          <OrganGroups groups={groupByOrgan(articles, byExamCount, sectionNote)} showDraft={showDraft} />
        </>
      )}
    </div>
  );
}
