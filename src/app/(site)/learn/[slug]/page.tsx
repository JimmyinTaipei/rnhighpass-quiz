import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/learn/ArticleShell";
import { ArticleToc } from "@/components/learn/ArticleToc";
import { TrackVisit } from "@/components/learn/TrackVisit";
import { ArticleView } from "@/components/learn/ArticleView";
import { buildToc } from "@/components/learn/toc";
import { getArticleSlugs, knowledgeIndex, loadArticle } from "@/lib/knowledge";

// 知識頁在 build 時預先產生(題目也在 build 時查好)，請求時直接回靜態檔，不在 Worker 上重新渲染：
// Cloudflare 免費方案每次請求 CPU 只有 10 ms(docs/deploy-size-plan.md)。
// 登入狀態、dev mode 由瀏覽器端的 ViewerProvider 決定；內容更新要重新 build 部署。
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

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
