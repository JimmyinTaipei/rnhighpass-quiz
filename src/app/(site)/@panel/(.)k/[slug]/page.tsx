import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/learn/ArticleShell";
import { ArticleView } from "@/components/learn/ArticleView";
import { KnowledgePanel } from "@/components/learn/KnowledgePanel";
import { buildToc } from "@/components/learn/toc";
import { loadArticle } from "@/lib/knowledge";

/** 站內打開 /k/<slug> 時，在目前頁面上疊一個知識面板(內容與知識頁相同) */
export default async function KnowledgePanelPage(props: PageProps<"/k/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const article = await loadArticle(slug);
  if (!article) notFound();
  const section = typeof searchParams.s === "string" ? searchParams.s : undefined;

  return (
    <KnowledgePanel title={article.title} fullHref={`/learn/${slug}${section ? `#${section}` : ""}`}>
      <ArticleShell key={`${slug}#${section ?? ""}`} slug={slug} toc={buildToc(article.sections)} variant="panel" initialId={section}>
        <ArticleView slug={slug} article={article} variant="panel" />
      </ArticleShell>
    </KnowledgePanel>
  );
}
