import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/learn/ComingSoon";
import { OrganGroups } from "@/components/learn/OrganGroups";
import { articlesOfType, byExamCount } from "@/lib/knowledge";
import { groupByOrgan } from "@/lib/knowledge/grouping";
import { BROWSE_TYPES } from "@/lib/knowledge/types";

function browseType(type: string) {
  return BROWSE_TYPES.find((t) => t.type === type);
}

export async function generateMetadata(props: PageProps<"/learn/type/[type]">): Promise<Metadata> {
  const { type } = await props.params;
  const t = browseType(type);
  return { title: t ? `${t.label}|知識庫` : "知識庫" };
}

/**
 * 速查(藥理、檢驗、病原體、護理技術):同一類型的頁面,依器官系統分組(順序同側欄,
 * 最後是「一般」),組內依相關題數。分組規則見 lib/knowledge/grouping.ts。
 */
export default async function LearnTypePage(props: PageProps<"/learn/type/[type]">) {
  const { type } = await props.params;
  const t = browseType(type);
  if (!t) notFound();
  const showDraft = await isAdmin();
  const articles = articlesOfType(t.type);
  const groups = groupByOrgan(articles, byExamCount);

  return (
    <div>
      <nav aria-label="麵包屑" className="mb-1 flex items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        <ChevronRight size={14} />
        <span>速查</span>
      </nav>
      <h1 className="mb-1 text-3xl font-bold text-strong">{t.label}</h1>
      {articles.length > 0 && <p className="mb-6 text-sm text-muted">{articles.length} 篇</p>}

      {articles.length === 0 ? <ComingSoon description={t.description} /> : <OrganGroups groups={groups} showDraft={showDraft} />}
    </div>
  );
}
