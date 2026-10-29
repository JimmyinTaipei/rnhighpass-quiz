import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterQuizRunner } from "@/components/quiz/ChapterQuizRunner";
import { requireUser } from "@/lib/auth";
import { getQuestionsByIds, getUserAnswers } from "@/lib/data";
import { currentMistakeIds } from "@/lib/notebook";
import { getDevMode } from "@/lib/dev-mode";
import { knowledgeIndex } from "@/lib/knowledge";
import { examStatsFor } from "@/lib/knowledge/exam";
import { shuffled } from "@/lib/quiz-utils";
import { knowledgeForQuestions } from "@/lib/knowledge/exam";

export async function generateMetadata(props: PageProps<"/learn/[slug]/quiz">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = knowledgeIndex.articles[slug];
  return { title: a ? `練習:${a.title}|知識庫` : "知識庫" };
}

/**
 * 知識頁的「練相關題」。題目範圍是建置時算好的相關題號(article-questions.json)，
 * URL 只帶 slug；?pool=wrong 只出這篇裡目前還在錯題本的題目(錯題本「先讀這幾篇」)。做完回到知識頁。
 */
export default async function KnowledgeQuizPage(props: PageProps<"/learn/[slug]/quiz">) {
  const [{ slug }, sp] = await Promise.all([props.params, props.searchParams]);
  const article = knowledgeIndex.articles[slug];
  if (!article) notFound();
  const wrongOnly = sp.pool === "wrong";
  const user = await requireUser(`/learn/${slug}/quiz${wrongOnly ? "?pool=wrong" : ""}`);

  const stats = examStatsFor(slug);
  let ids = stats?.ids ?? [];
  if (wrongOnly) {
    const mistakes = new Set(currentMistakeIds(await getUserAnswers()));
    ids = ids.filter((id) => mistakes.has(id));
  }
  const [devMode, list] = await Promise.all([getDevMode(), getQuestionsByIds(ids)]);
  // 打亂順序，避免照著題號順序背答案
  const questions = shuffled(list);
  const backHref = `/learn/${slug}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      {questions.length === 0 ? (
        <div>
          <h1 className="mb-2 text-3xl font-bold text-strong">
            {wrongOnly ? "這篇已經沒有錯題了" : "這個主題還沒有相關考題"}
          </h1>
          <p className="mb-4 text-sm text-muted">
            {wrongOnly
              ? `「${article.title}」的相關題目你都已經答對，可以練全部相關題複習。`
              : `分章題本裡還沒有直接考「${article.title}」的題目。`}
          </p>
          <Link
            href={backHref}
            className="rounded-btn bg-mid px-4 py-2 text-sm font-semibold text-on-mid"
          >
            回到知識頁
          </Link>
        </div>
      ) : (
        <ChapterQuizRunner
          scopeLabel={`${article.title}${wrongOnly ? "・錯題" : ""}・${questions.length} 題`}
          questions={questions}
          knowledgeByQuestion={knowledgeForQuestions(
            questions.map((q) => q.id),
            slug,
          )}
          isLoggedIn={!!user}
          devMode={devMode}
          reviewHref={backHref}
          reviewLabel="回到知識頁"
          mode="knowledge"
        />
      )}
    </main>
  );
}
