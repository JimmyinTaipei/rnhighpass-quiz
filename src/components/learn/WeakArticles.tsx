import Link from "next/link";
import { Library } from "lucide-react";
import { pillGray } from "@/lib/ui";
import type { WeakArticle } from "@/lib/knowledge/exam";

/** 錯題最多的知識頁：先讀那一篇，再只練那一篇的錯題(錯題本、統計頁共用) */
export function WeakArticles({ articles }: { articles: WeakArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="mb-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-deep">
        <Library size={18} className="text-accent" />
        先讀這幾篇
      </h2>
      <p className="mb-3 text-xs text-muted">你的錯題最集中的知識頁。讀完再練那一篇的錯題，比一題一題重做更有效。</p>
      <ol className="divide-y divide-card-border rounded-card bg-(--surface-inset)">
        {articles.map((a, i) => (
          <li key={a.slug} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
            <span className="w-5 shrink-0 text-sm text-muted tabular-nums">{i + 1}</span>
            <Link href={`/learn/${a.slug}`} className="min-w-0 flex-1 font-medium text-deep hover:underline">
              {a.title}
            </Link>
            <span className="text-xs text-muted tabular-nums">
              錯 {a.wrong} 題 / 共 {a.total} 題
            </span>
            <Link href={`/learn/${a.slug}/quiz?pool=wrong`} className={pillGray}>
              練這篇的錯題
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
