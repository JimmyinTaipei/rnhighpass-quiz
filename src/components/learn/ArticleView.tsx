import Link from "next/link";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { ChevronRight, FilePenLine, Stethoscope } from "lucide-react";
import { ExamPresence } from "@/components/learn/ExamPresence";
import { renderHast, SectionView, type RenderContext } from "@/components/learn/ArticleRenderer";
import { ArticleMetaEditor } from "@/components/learn/KnowledgeEditors";
import { RelatedCards } from "@/components/learn/RelatedCards";
import { SeeAlso, type CitingArticle } from "@/components/learn/SeeAlso";
import {
  getCurrentUser,
  getDiseaseTagsForQuestions,
  getOtherChaptersForQuestions,
  getQuestionsByIds,
  getTablesForQuestions,
  getTopicLinks,
} from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import {
  getDomain,
  getGroup,
  knowledgeIndex,
  previewFor,
  questionIdsFor,
  relatedGroupsFor,
  siblingArticles,
  usedByFor,
} from "@/lib/knowledge";
import { examStatsFor } from "@/lib/knowledge/exam";
import {
  CATEGORY_LABELS,
  chipKeyOf,
  type KnowledgeArticle,
  type KnowledgePreview,
  type KnowledgeSection,
  type TaxonomyDomain,
} from "@/lib/knowledge/types";

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

/**
 * 別頁引用本頁的地方(連結到整頁或任一段落、或嵌入任一段落),依來源頁分組。
 * 同一頁內的互相連結不算——那是本頁自己的結構。
 */
function citingArticles(slug: string, sections: KnowledgeSection[]): CitingArticle[] {
  const places = new Map<string, KnowledgePreview & { embedded: boolean }>();
  const add = (sources: string[] | undefined, embedded: boolean) => {
    for (const src of sources ?? []) {
      if (src === slug || src.startsWith(`${slug}#`)) continue;
      const prev = places.get(src);
      if (prev) {
        prev.embedded ||= embedded;
        continue;
      }
      const p = previewFor(src);
      if (p) places.set(src, { ...p, embedded });
    }
  };
  add(knowledgeIndex.backlinks[slug], false);
  walk(sections, (s) => {
    add(knowledgeIndex.backlinks[`${slug}#${s.id}`], false);
    add(knowledgeIndex.embeds[`${slug}#${s.id}`], true);
  });

  const bySource = new Map<string, CitingArticle>();
  for (const p of places.values()) {
    const src = p.key.split("#")[0];
    const entry = bySource.get(src) ?? { slug: src, title: p.articleTitle, places: [] };
    entry.places.push(p);
    bySource.set(src, entry);
  }
  return [...bySource.values()];
}

interface ArticleViewProps {
  slug: string;
  article: KnowledgeArticle;
  /**
   * page:知識頁本身。panel:章節頁等處打開的知識面板——內容完全相同，
   * 讓使用者在哪裡看到的都是同一個版型；只有外層(目錄、關閉鈕)由呼叫端決定。
   */
  variant?: "page" | "panel";
}

/**
 * 一篇知識頁的本體(麵包屑、標題、考題區塊、內文、參見、參考資料)。
 * 必須放在 ArticleShell 裡(段落收合與連結預覽靠它的 context)。
 */
export async function ArticleView({ slug, article, variant = "page" }: ArticleViewProps) {
  // ---- 考題:整篇一次查完,再依欄位分配 ----
  const qkeys = [...questionKeys(article.intro)];
  walk(article.sections, (s) => qkeys.push(...questionKeys(s.content)));
  const idsByKey = new Map(qkeys.map((k) => [k, questionIdsFor(k)]));
  const allIds = [...new Set([...idsByKey.values()].flat())];
  const examStats = examStatsFor(slug);

  const [
    user,
    admin,
    devMode,
    questionList,
    tablesByQuestion,
    otherChaptersByQuestion,
    diseaseTagsByQuestion,
    topicLinks,
  ] = await Promise.all([
      getCurrentUser(),
      isAdmin(),
      getDevMode(),
      getQuestionsByIds(allIds),
      getTablesForQuestions(allIds),
      getOtherChaptersForQuestions(allIds, null),
      getDiseaseTagsForQuestions(allIds),
      getTopicLinks(examStats?.chapters.map((c) => c.key) ?? []),
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
    // 知識庫來源是 repo 的 .md，只有本機 next dev 能改(見 knowledge-edit-actions.ts)
    editSlug: devMode && process.env.NODE_ENV === "development" ? slug : null,
    embedDepth: 0,
  };

  // ---- 分類與參見 ----
  const domain = getDomain(article.system);
  const group = getGroup(article.group);
  const alsoIn = article.alsoIn.map(getDomain).filter((d): d is TaxonomyDomain => d !== undefined);
  const citing = citingArticles(slug, article.sections);
  const siblings = siblingArticles(article);
  const summaryBits = [
    citing.length > 0 && `被 ${citing.length} 頁引用`,
    group && siblings.length > 0 && `其他${group.name} ${siblings.length} 頁`,
    alsoIn.length > 0 && `也見於 ${alsoIn.map((d) => d.name).join("、")}`,
  ].filter((x): x is string => !!x);

  // 基礎頁:哪些頁面以 |basics 引用了這頁或它的段落
  const basicsUsers = (knowledgeIndex.basicsUsedBy[slug] ?? [])
    .map((s) => knowledgeIndex.articles[s])
    .filter((a) => a !== undefined);

  const isPanel = variant === "panel";

  return (
    <article
      className={
        isPanel ? "px-4 pb-8 sm:px-6" : "on-white rounded-card bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-8"
      }
    >
      <nav aria-label="麵包屑" className="mb-2 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/learn" className="hover:text-deep">
          知識庫
        </Link>
        {domain && (
          <>
            <ChevronRight size={14} />
            <Link href={`/learn/system/${domain.id}`} className="hover:text-deep">
              {domain.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span>{CATEGORY_LABELS[article.category]}</span>
        {group && domain && (
          <>
            <ChevronRight size={14} />
            <Link
              href={
                domain.kind === "system" && chipKeyOf(article.category)
                  ? `/learn/system/${domain.id}?type=${chipKeyOf(article.category)}`
                  : `/learn/system/${domain.id}`
              }
              className="hover:text-deep"
            >
              {group.name}
            </Link>
          </>
        )}
      </nav>
      <header className="mb-6">
        <h1 className={`${isPanel ? "text-2xl" : "text-3xl"} font-bold text-deep`}>{article.title}</h1>
        {article.subtitle && <p className="mt-1 text-lg text-body">{article.subtitle}</p>}
        {ctx.editSlug && (
          <div className="mt-2">
            <ArticleMetaEditor key={`${article.title}|${article.subtitle ?? ""}`} slug={ctx.editSlug} />
          </div>
        )}
        {summaryBits.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            {summaryBits.join("・")}・
            <a href="#see-also" className="font-medium text-accent hover:text-deep hover:underline">
              參見 ↓
            </a>
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {/* 草稿標記只給管理者看,學生端不出現這個字樣 */}
          {admin && !article.reviewed && (
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
        </div>
        {examStats && <ExamPresence slug={slug} stats={examStats} links={topicLinks} />}
        {basicsUsers.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            這頁是以下頁面的「想打好基礎」：
            {basicsUsers.map((a, i) => (
              <span key={a.slug}>
                {i > 0 && "、"}
                <Link href={`/learn/${a.slug}`} className="font-medium text-accent hover:text-deep hover:underline">
                  {a.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>

      <div className="kb-prose">{renderHast(article.intro, ctx)}</div>

      <div className="mt-6">
        {article.sections.map((s) => (
          <SectionView key={s.id} section={s} ctx={ctx} />
        ))}
      </div>

      <RelatedCards groups={relatedGroupsFor(slug)} usedBy={usedByFor(slug)} showDraft={admin} />

      <SeeAlso citing={citing} group={group} siblings={siblings} alsoIn={alsoIn} />

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
  );
}
