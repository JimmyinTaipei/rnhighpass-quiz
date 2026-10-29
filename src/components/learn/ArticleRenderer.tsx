import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { AlertTriangle, BookMarked, Info, Lightbulb, ListChecks } from "lucide-react";
import type { ChapterRef } from "@/lib/data";
import { hrefFor, imageCredits, knowledgeIndex, previewFor } from "@/lib/knowledge";
import type { FigureLabel, KnowledgeArticle, KnowledgeSection, KnowledgePreview } from "@/lib/knowledge/types";
import type { ComparisonTable, Question } from "@/lib/types";
import { CollapsibleSection } from "./CollapsibleSection";
import { SectionBodyEditor, SectionTitleEditor } from "./KnowledgeEditors";
import { BasicsBox } from "./BasicsBox";
import { EmbedBadge } from "./EmbedBadge";
import { KnowledgeLink } from "./KnowledgeLink";
import { LabeledFigure } from "./LabeledFigure";
import { QuestionList } from "./QuestionList";
import { ScrollableTable } from "./ScrollableTable";
import { ZoomableFigureImage } from "./ZoomableFigureImage";
import { isMergedExamPoints } from "./toc";

export interface RenderContext {
  article: KnowledgeArticle;
  questions: Map<string, Question[]>;
  tablesByQuestion: Map<string, ComparisonTable[]>;
  otherChaptersByQuestion: Map<string, ChapterRef[]>;
  diseaseTagsByQuestion: Map<string, string[]>;
  isLoggedIn: boolean;
  devMode: boolean;
  /** 本機 dev mode 可編輯時為本頁 slug(寫回 .md);否則 null */
  editSlug: string | null;
  /** 0 = 本文;>0 = 正在渲染嵌入內容 */
  embedDepth: number;
  /** 段落內文裡的 ::questions 不就地顯示，改由 SectionView 收集到整個階層最後(見 SectionQuestions) */
  hoistQuestions?: boolean;
}

// 巢狀嵌入超過這層就改成一般連結,避免內容無限展開
const MAX_EMBED_DEPTH = 2;

const CALLOUT_STYLE = {
  exam: { icon: BookMarked, label: "國考重點", cls: "border-accent bg-light/60" },
  tip: { icon: Lightbulb, label: "小技巧", cls: "border-correct bg-correct-bg/60" },
  warning: { icon: AlertTriangle, label: "注意", cls: "border-warning bg-[#FDF3E3]" },
  note: { icon: Info, label: "補充", cls: "border-card-border bg-page" },
} as const;

/** basics(只有本頁用到的「想打好基礎」)不是提示框外觀,改由 BasicsBox 呈現 */
type CalloutKind = keyof typeof CALLOUT_STYLE | "basics";

function Callout({ kind, title, children }: { kind: CalloutKind; title?: string; children: React.ReactNode }) {
  if (kind === "basics") return <BasicsBox title={title || "背景補充"}>{children}</BasicsBox>;
  const style = CALLOUT_STYLE[kind] ?? CALLOUT_STYLE.note;
  const Icon = style.icon;
  return (
    <aside className={`kb-callout my-4 rounded-r-btn border-l-4 px-4 py-3 ${style.cls}`}>
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-strong">
        <Icon size={16} className="shrink-0" />
        {title || style.label}
      </p>
      <div className="kb-callout-body">{children}</div>
    </aside>
  );
}

function Figure({ src, alt, labels }: { src: string; alt: string; labels?: string }) {
  const name = src.replace("/knowledge-images/", "");
  const credit = imageCredits[name];
  // labels 是建置時從 labels/*.json 讀進來並檢查過的 JSON 字串(::figure 才有)
  const parsed = labels ? (JSON.parse(labels) as FigureLabel[]) : null;
  return (
    <figure className="my-5">
      {parsed ? <LabeledFigure src={src} alt={alt} labels={parsed} /> : <ZoomableFigureImage src={src} alt={alt} />}
      <figcaption className="mt-2 text-center text-sm text-body">
        {alt}
        {credit && (
          <span className="mt-0.5 block text-xs text-muted">
            圖:{credit.sourceUrl ? (
              <a href={credit.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-deep">
                {credit.author}
              </a>
            ) : (
              credit.author
            )}
            ,
            {credit.licenseUrl ? (
              <a href={credit.licenseUrl} target="_blank" rel="noreferrer" className="underline hover:text-deep">
                {credit.license}
              </a>
            ) : (
              credit.license
            )}
            {credit.modified && `(${credit.modified})`}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function questionKeysOf(root: Root): string[] {
  const keys: string[] = [];
  visit(root, "element", (n) => {
    if (n.tagName === "k-questions") keys.push(String(n.properties.qkey));
  });
  return keys;
}

/** 一個段落(含合併進來的國考常考點)自己的考題，多個 ::questions 合併去重 */
function sectionQuestions(section: KnowledgeSection, ctx: RenderContext): Question[] {
  const roots = [section.content, ...section.children.filter((c) => isMergedExamPoints(section, c)).map((c) => c.content)];
  const seen = new Set<string>();
  return roots
    .flatMap(questionKeysOf)
    .flatMap((k) => ctx.questions.get(k) ?? [])
    .filter((q) => !seen.has(q.id) && !!seen.add(q.id));
}

/** 段落考題區塊的錨點(標題旁的「N 題」跳到這裡) */
export const questionsAnchor = (sectionId: string) => `${sectionId}--questions`;

function QuestionBlock({
  questions,
  label,
  anchor,
  ctx,
}: {
  questions: Question[];
  label: string;
  anchor?: string;
  ctx: RenderContext;
}) {
  // 嵌入的內容不帶考題:考題屬於來源頁,放在嵌入處會讓疾病頁長到讀不完
  if (ctx.embedDepth > 0 || questions.length === 0) return null;
  const pick = <T,>(m: Map<string, T>) =>
    Object.fromEntries(questions.flatMap((q) => (m.has(q.id) ? [[q.id, m.get(q.id) as T]] : [])));
  return (
    <details id={anchor} className="kb-questions surface-white group my-4 scroll-mt-4 rounded-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-2.5 text-sm font-semibold text-deep md:px-4 select-none hover:bg-surface-hover [&::-webkit-details-marker]:hidden">
        <ListChecks size={16} className="shrink-0 text-accent" />
        <span className="min-w-0">{label}</span>
        <span className="ml-auto shrink-0 text-xs font-normal text-muted group-open:hidden">點開瀏覽</span>
        <span className="ml-auto hidden shrink-0 text-xs font-normal text-muted group-open:inline">收起</span>
      </summary>
      <div className="border-t border-card-border pt-3 md:p-4">
        <QuestionList
          questions={questions}
          isLoggedIn={ctx.isLoggedIn}
          devMode={ctx.devMode}
          // 比較表內容由 modal 按需載入，只傳 id 與標題給 client
          tables={Object.fromEntries(
            Object.entries(pick(ctx.tablesByQuestion)).map(([id, ts]) => [id, ts.map((t) => ({ id: t.id, title: t.title }))]),
          )}
          otherChapters={pick(ctx.otherChaptersByQuestion)}
          diseaseTags={pick(ctx.diseaseTagsByQuestion)}
        />
      </div>
    </details>
  );
}

/** 不在段落裡的 ::questions(開頭段、頁尾綜合考題)：就地顯示，只寫題數 */
function RelatedQuestions({ qkey, ctx }: { qkey: string; ctx: RenderContext }) {
  if (ctx.hoistQuestions) return null;
  const questions = ctx.questions.get(qkey) ?? [];
  return <QuestionBlock questions={questions} label={`${questions.length} 題`} ctx={ctx} />;
}

function EmbeddedBlock({ target, mode, ctx }: { target: string; mode?: string; ctx: RenderContext }) {
  const embed = ctx.article.embeds[target];
  const preview = previewFor(target);
  if (!embed || !preview) return null;

  // 「想打好基礎」:段落引用顯示整段,整頁引用顯示該頁 summary;預設收合
  if (mode === "basics") {
    const inner: RenderContext = { ...ctx, embedDepth: ctx.embedDepth + 1 };
    return (
      <BasicsBox title={embed.section?.title ?? embed.articleTitle} fullHref={hrefFor(target)}>
        {embed.section && ctx.embedDepth < MAX_EMBED_DEPTH ? (
          <EmbeddedSection section={embed.section} ctx={inner} root />
        ) : (
          <p className="whitespace-pre-line">{embed.summary || preview.summary}</p>
        )}
      </BasicsBox>
    );
  }
  if (!embed.section) return null;

  if (ctx.embedDepth >= MAX_EMBED_DEPTH) {
    return (
      <p>
        <KnowledgeLink href={hrefFor(target)} target={target} preview={preview}>
          {embed.section.title}
        </KnowledgeLink>
      </p>
    );
  }

  const places = (knowledgeIndex.embeds[target] ?? [])
    .map(previewFor)
    .filter((p): p is KnowledgePreview => p !== null);
  const inner: RenderContext = { ...ctx, embedDepth: ctx.embedDepth + 1 };

  return (
    <div className="kb-embed my-4 border-l-[3px] border-accent py-1 pl-4">
      <div className="mb-1.5 flex items-start justify-between gap-3">
        <Link href={hrefFor(target)} className="group min-w-0 text-sm">
          <span className="font-semibold text-deep group-hover:underline">{embed.section.title}</span>
          <span className="ml-2 text-xs text-muted">來自〈{embed.articleTitle}〉›</span>
        </Link>
        <EmbedBadge places={places} />
      </div>
      <EmbeddedSection section={embed.section} ctx={inner} root />
    </div>
  );
}

/**
 * 嵌入內容裡的段落:不編號、不可摺疊、不給 id(避免和本文的錨點撞名)。
 * 嵌入重點摘要(slug#summary)時略過「國考常考點」子段落,疾病頁裡的藥物卡片只放重點。
 */
function EmbeddedSection({ section, ctx, root = false }: { section: KnowledgeSection; ctx: RenderContext; root?: boolean }) {
  const children =
    section.id === "summary" ? section.children.filter((c) => c.id !== "exam-points") : section.children;
  return (
    <div className={root ? "" : "mt-3"}>
      {!root && <p className="mb-1 font-semibold text-strong">{section.title}</p>}
      {renderHast(section.content, ctx)}
      {children.map((c) => (
        <EmbeddedSection key={c.id} section={c} ctx={ctx} />
      ))}
    </div>
  );
}

export function renderHast(root: Root, ctx: RenderContext) {
  const components = {
    "k-link": ({ target, children }: { target: string; children: React.ReactNode }) => (
      <KnowledgeLink href={hrefFor(target)} target={target} preview={previewFor(target)}>
        {children}
      </KnowledgeLink>
    ),
    "k-embed": ({ target, mode }: { target: string; mode?: string }) => (
      <EmbeddedBlock target={target} mode={mode} ctx={ctx} />
    ),
    "k-questions": ({ qkey }: { qkey: string }) => <RelatedQuestions qkey={qkey} ctx={ctx} />,
    "k-callout": ({ kind, title, children }: { kind: CalloutKind; title?: string; children: React.ReactNode }) => (
      <Callout kind={kind} title={title}>
        {children}
      </Callout>
    ),
    "k-figure": ({ src, alt, labels }: { src: string; alt: string; labels?: string }) => (
      <Figure src={src} alt={alt} labels={labels} />
    ),
    table: (props: React.ComponentProps<"table">) => <ScrollableTable {...props} />,
  } as unknown as Components;

  return toJsxRuntime(root, { Fragment, jsx, jsxs, components });
}

export function SectionView({ section, ctx }: { section: KnowledgeSection; ctx: RenderContext }) {
  const slug = ctx.embedDepth === 0 ? ctx.editSlug : null;
  // 頁尾綜合考題本身就是考題，維持就地顯示；其他段落的考題收到整個階層最後(讀完再測)，
  // 標題旁顯示題數，點了跳到這裡
  const hoist = ctx.embedDepth === 0 && section.id !== "questions";
  const own = hoist ? sectionQuestions(section, ctx) : [];
  const inner: RenderContext = hoist ? { ...ctx, hoistQuestions: true } : { ...ctx, hoistQuestions: false };
  return (
    <CollapsibleSection
      id={section.id}
      depth={section.depth}
      number={section.number}
      title={section.title}
      questionCount={own.length}
      questionsAnchor={questionsAnchor(section.id)}
      titleEditor={slug ? <SectionTitleEditor key={section.title} slug={slug} id={section.id} /> : undefined}    >
      {slug && <SectionBodyEditor slug={slug} id={section.id} />}
      <div className="kb-prose">{renderHast(section.content, inner)}</div>
      {section.children.map((c) =>
        isMergedExamPoints(section, c) ? (
          // 國考常考點也是重點:不顯示子標題,條列直接接在重點後面(錨點留著,舊連結還能跳到這裡)
          <div key={c.id} id={c.id} className="kb-prose kb-merged-points">
            {renderHast(c.content, inner)}
          </div>
        ) : (
          <SectionView key={c.id} section={c} ctx={ctx} />
        ),
      )}
      <QuestionBlock
        questions={own}
        label={`${section.number.trim()}${section.title}的考題 ${own.length} 題`}
        anchor={questionsAnchor(section.id)}
        ctx={ctx}
      />
    </CollapsibleSection>
  );
}
