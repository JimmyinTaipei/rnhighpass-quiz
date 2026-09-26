import type { Metadata } from "next";
import { Library } from "lucide-react";
import { LearnIndex } from "@/components/learn/LearnIndex";
import { getArticleSummaries, searchKnowledge, taxonomy } from "@/lib/knowledge";
import { CATEGORY_LABELS, type KnowledgeCategory } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "知識庫" };

export default async function LearnPage(props: PageProps<"/learn">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const rawType = typeof sp.type === "string" ? sp.type : null;
  const type = rawType && rawType in CATEGORY_LABELS ? (rawType as KnowledgeCategory) : null;

  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold text-deep">
        <Library className="text-accent" /> 知識庫
      </h1>
      <p className="mb-6 text-sm text-body">
        以知識點為單位整理、依器官系統分類,彼此互相連結;每段下方附相關國考題。目前為糖尿病示範版。
      </p>
      <LearnIndex
        articles={getArticleSummaries()}
        domains={taxonomy.domains}
        query={q}
        type={type}
        results={searchKnowledge(q, type)}
      />
    </div>
  );
}
