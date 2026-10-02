import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/learn/ArticleShell";
import { ArticleToc } from "@/components/learn/ArticleToc";
import { TrackVisit } from "@/components/learn/TrackVisit";
import { ArticleView } from "@/components/learn/ArticleView";
import { buildToc } from "@/components/learn/toc";
import { knowledgeIndex, loadArticle } from "@/lib/knowledge";

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = knowledgeIndex.articles[slug];
  return { title: a ? `${a.title}|知識庫` : "知識庫" };
}

export default async function LearnArticlePage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  const toc = buildToc(article.sections);

  return (
    <ArticleShell key={slug} slug={slug} toc={toc} tocPanel={<ArticleToc toc={toc} title={article.title} />}>
      <TrackVisit slug={slug} />
      <ArticleView slug={slug} article={article} />
    </ArticleShell>
  );
}
