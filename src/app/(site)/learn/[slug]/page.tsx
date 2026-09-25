import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { FilePenLine, Stethoscope } from "lucide-react";
import { ArticleShell } from "@/components/learn/ArticleShell";
import { ArticleToc } from "@/components/learn/ArticleToc";
import { renderHast, SectionView, type RenderContext } from "@/components/learn/ArticleRenderer";
import { RelatedRail, type SectionRelations } from "@/components/learn/RelatedRail";
import { buildToc } from "@/components/learn/toc";
import {
  getCurrentUser,
  getDiseaseTagsForQuestions,
  getOtherChaptersForQuestions,
  getQuestionsByIds,
  getTablesForQuestions,
} from "@/lib/data";
import { getDevMode } from "@/lib/dev-mode";
import { knowledgeIndex, loadArticle, previewFor, questionIdsFor } from "@/lib/knowledge";
import {
  CATEGORY_LABELS,
  type KnowledgePreview,
  type KnowledgeSection,
} from "@/lib/knowledge/types";

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = knowledgeIndex.articles[slug];
  return { title: a ? `${a.title}|知識庫` : "知識庫" };
}

function walk(sections: KnowledgeSection[], fn: (s: KnowledgeSection, ancestors: KnowledgeSection[]) => void, ancestors: KnowledgeSection[] = []) {
  for (const s of sections) {
    fn(s, ancestors);
    walk(s.children, fn, [...ancestors, s]);
  }
}

function questionKeys(root: Root): string[] {
  const keys: string[] = [];
  visit(root, "element", (n) => {
    if (n.tagName === "k-questions") keys.push(String(n.properties.qkey));
  });
  return keys;
}

const toPreviews = (keys: string[] | undefined) =>
  (keys ?? []).map(previewFor).filter((p): p is KnowledgePreview => p !== null);

function uniqueByKey(list: KnowledgePreview[]) {
  const seen = new Set<string>();
  return list.filter((p) => (seen.has(p.key) ? false : (seen.add(p.key), true)));
}

export default async function LearnArticlePage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  // ---- 考題:整篇一次查完,再依欄位分配 ----
  const qkeys = [...questionKeys(article.intro)];
  walk(article.sections, (s) => qkeys.push(...questionKeys(s.content)));
  const idsByKey = new Map(qkeys.map((k) => [k, questionIdsFor(k)]));
  const allIds = [...new Set([...idsByKey.values()].flat())];

  const [user, devMode, questionList, tablesByQuestion, otherChaptersByQuestion, diseaseTagsByQuestion] =
    await Promise.all([
      getCurrentUser(),
      getDevMode(),
      getQuestionsByIds(allIds),
      getTablesForQuestions(allIds),
      getOtherChaptersForQuestions(allIds, null),
      getDiseaseTagsForQuestions(allIds),
    ]);
  const byId = new Map(questionList.map((q) => [q.id, q]));
  const questions = new Map(
    [...idsByKey].map(([k, ids]) => [k, ids.map((id) => byId.get(id)).filter((q) => q !== undefined)]),
  );

  const ctx: RenderContext = {
    article,
    questions,
    tablesByQuestion,
    otherChaptersByQuestion,
    diseaseTagsByQuestion,
    isLoggedIn: !!user,
    devMode,
    embedDepth: 0,
  };

  // ---- 右欄關聯:子段落的關聯併進祖先 ----
  const relations: Record<string, SectionRelations> = {};
  const sectionTitles: Record<string, string> = {};
  const otherArticle = (p: KnowledgePreview) => !p.key.startsWith(`${slug}#`) && p.key !== slug;
  walk(article.sections, (s, ancestors) => {
    const key = `${slug}#${s.id}`;
    sectionTitles[s.id] = `${s.number}${s.title}`;
    const own: SectionRelations = {
      outgoing: toPreviews(knowledgeIndex.links[key]),
      incoming: toPreviews(knowledgeIndex.backlinks[key]).filter(otherArticle),
      embeddedIn: toPreviews(knowledgeIndex.embeds[key]),
    };
    for (const target of [s, ...ancestors]) {
      const r = (relations[target.id] ??= { outgoing: [], incoming: [], embeddedIn: [] });
      r.outgoing = uniqueByKey([...r.outgoing, ...own.outgoing]);
      r.incoming = uniqueByKey([...r.incoming, ...own.incoming]);
      r.embeddedIn = uniqueByKey([...r.embeddedIn, ...own.embeddedIn]);
    }
  });
  const articleIncoming = uniqueByKey(
    [
      ...toPreviews(knowledgeIndex.backlinks[slug]),
      ...Object.values(relations).flatMap((r) => [...r.incoming, ...r.embeddedIn]),
    ].filter(otherArticle),
  );

  const toc = buildToc(article.sections);

  return (
    <ArticleShell
      key={slug}
      slug={slug}
      toc={toc}
      tocPanel={<ArticleToc toc={toc} title={article.title} />}
      railPanel={
        <RelatedRail relations={relations} articleIncoming={articleIncoming} sectionTitles={sectionTitles} />
      }
    >
      <article className="rounded-card border border-card-border bg-card p-4 shadow-sm sm:p-8">
        <p className="mb-2 text-sm text-muted">
          <Link href="/learn" className="hover:text-deep">
            知識庫
          </Link>{" "}
          / {CATEGORY_LABELS[article.category]}
        </p>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-deep">{article.title}</h1>
          {article.subtitle && <p className="mt-1 text-lg text-body">{article.subtitle}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {!article.reviewed && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#FDF3E3] px-2.5 py-1 font-medium text-[#8A5200]"
                title="內容由 AI 協助整理,尚待人工審閱"
              >
                <FilePenLine size={13} /> 草稿・待審閱
              </span>
            )}
            {article.dzTags.map((tag) => (
              <Link
                key={tag}
                href={`/diseases/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-full bg-light px-2.5 py-1 font-medium text-deep hover:bg-mid"
              >
                <Stethoscope size={13} /> {tag} 考題
              </Link>
            ))}
            {article.aliases.length > 0 && (
              <span className="text-muted">別名:{article.aliases.join("、")}</span>
            )}
          </div>
        </header>

        <div className="kb-prose">{renderHast(article.intro, ctx)}</div>

        <div className="mt-6">
          {article.sections.map((s) => (
            <SectionView key={s.id} section={s} ctx={ctx} />
          ))}
        </div>

        {article.references.length > 0 && (
          <footer className="mt-10 border-t border-card-border pt-5 text-sm text-body">
            <h2 className="mb-2 font-semibold text-deep">參考資料</h2>
            <ol className="list-decimal space-y-1 pl-5">
              {article.references.map((r) => (
                <li key={r.title}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="underline hover:text-deep">
                      {r.title}
                    </a>
                  ) : (
                    r.title
                  )}
                  {r.note && <span className="text-muted">({r.note})</span>}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">
              本頁內容依上列指引與教科書重新整理撰寫,僅供國考複習,不可取代臨床判斷與最新指引。
              {article.updated && ` 最後更新:${article.updated}。`}
            </p>
          </footer>
        )}
      </article>
    </ArticleShell>
  );
}
