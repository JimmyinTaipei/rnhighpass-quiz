import type { Metadata } from "next";
import { Library } from "lucide-react";
import { LearnIndex } from "@/components/learn/LearnIndex";
import { getArticleSummaries } from "@/lib/knowledge";

export const metadata: Metadata = { title: "知識庫" };

export default function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold text-deep">
        <Library className="text-accent" /> 知識庫
      </h1>
      <p className="mb-6 text-sm text-body">
        以知識點為單位整理,彼此互相連結;每段下方附相關國考題。目前為糖尿病示範版。
      </p>
      <LearnIndex articles={getArticleSummaries()} />
    </div>
  );
}
