import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { Root } from "hast";
import { AlertTriangle, BookMarked, Info, Lightbulb, ListChecks } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import type { ChapterRef } from "@/lib/data";
import { hrefFor, imageCredits, knowledgeIndex, previewFor } from "@/lib/knowledge";
import type { KnowledgeArticle, KnowledgeSection, KnowledgePreview } from "@/lib/knowledge/types";
import type { ComparisonTable, Question } from "@/lib/types";
import { CollapsibleSection } from "./CollapsibleSection";
import { EmbedBadge } from "./EmbedBadge";
import { KnowledgeLink } from "./KnowledgeLink";

export interface RenderContext {
  article: KnowledgeArticle;
  questions: Map<string, Question[]>;
  tablesByQuestion: Map<string, ComparisonTable[]>;
  otherChaptersByQuestion: Map<string, ChapterRef[]>;
  diseaseTagsByQuestion: Map<string, string[]>;
  isLoggedIn: boolean;
  devMode: boolean;
  /** 0 = 本文;>0 = 正在渲染嵌入內容 */
  embedDepth: number;
}

// 巢狀嵌入超過這層就改成一般連結,避免內容無限展開
const MAX_EMBED_DEPTH = 2;

const CALLOUT_STYLE = {
  exam: { icon: BookMarked, label: "國考重點", cls: "border-accent bg-light/60" },
  tip: { icon: Lightbulb, label: "小技巧", cls: "border-correct bg-correct-bg/60" },
  warning: { icon: AlertTriangle, label: "注意", cls: "border-warning bg-[#FDF3E3]" },
  note: { icon: Info, label: "補充", cls: "border-card-border bg-page" },
} as const;

type CalloutKind = keyof typeof CALLOUT_STYLE;

function Callout({ kind, title, children }: { kind: CalloutKind; title?: string; children: React.ReactNode }) {
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

function Figure({ src, alt }: { src: string; alt: string }) {
  const name = src.replace("/knowledge-images/", "");
  const credit = imageCredits[name];
  return (
    <figure className="my-5">
      {/* 圖多為 SVG 圖解,next/image 對 SVG 沒有最佳化效果,直接用 img */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="mx-auto max-h-[480px] w-auto max-w-full rounded-btn border border-card-border bg-white" />
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

function RelatedQuestions({ qkey, ctx }: { qkey: string; ctx: RenderContext }) {
  // 嵌入的內容不帶考題:考題屬於來源頁,放在嵌入處會讓疾病頁長到讀不完
  if (ctx.embedDepth > 0) return null;
  const questions = ctx.questions.get(qkey) ?? [];
  if (questions.length === 0) return null;
  return (
    <details className="kb-questions group my-4 rounded-card border border-card-border bg-page">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-semibold text-deep select-none hover:bg-surface-hover [&::-webkit-details-marker]:hidden">
        <ListChecks size={16} className="text-accent" />
        相關考題 {questions.length} 題
        <span className="ml-auto text-xs font-normal text-muted group-open:hidden">點開作答</span>
        <span className="ml-auto hidden text-xs font-normal text-muted group-open:inline">收起</span>
      </summary>
      <div className="border-t border-card-border p-3 sm:p-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            mode="learn"
            isLoggedIn={ctx.isLoggedIn}
            tables={ctx.tablesByQuestion.get(q.id)}
            otherChapters={ctx.otherChaptersByQuestion.get(q.id)}
            diseaseTags={ctx.diseaseTagsByQuestion.get(q.id)}
            devMode={ctx.devMode}
          />
        ))}
      </div>
    </details>
  );
}

function EmbeddedBlock({ target, ctx }: { target: string; ctx: RenderContext }) {
  const embed = ctx.article.embeds[target];
  const preview = previewFor(target);
  if (!embed || !preview) return null;

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

/** 嵌入內容裡的段落:不編號、不可摺疊、不給 id(避免和本文的錨點撞名) */
function EmbeddedSection({ section, ctx, root = false }: { section: KnowledgeSection; ctx: RenderContext; root?: boolean }) {
  return (
    <div className={root ? "" : "mt-3"}>
      {!root && <p className="mb-1 font-semibold text-strong">{section.title}</p>}
      {renderHast(section.content, ctx)}
      {section.children.map((c) => (
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
    "k-embed": ({ target }: { target: string }) => <EmbeddedBlock target={target} ctx={ctx} />,
    "k-questions": ({ qkey }: { qkey: string }) => <RelatedQuestions qkey={qkey} ctx={ctx} />,
    "k-callout": ({ kind, title, children }: { kind: CalloutKind; title?: string; children: React.ReactNode }) => (
      <Callout kind={kind} title={title}>
        {children}
      </Callout>
    ),
    "k-figure": ({ src, alt }: { src: string; alt: string }) => <Figure src={src} alt={alt} />,
    table: (props: React.ComponentProps<"table">) => (
      <div className="kb-table-wrap my-4 overflow-x-auto rounded-btn border border-card-border">
        <table {...props} />
      </div>
    ),
  } as unknown as Components;

  return toJsxRuntime(root, { Fragment, jsx, jsxs, components });
}

export function SectionView({ section, ctx }: { section: KnowledgeSection; ctx: RenderContext }) {
  return (
    <CollapsibleSection id={section.id} depth={section.depth} number={section.number} title={section.title}>
      <div className="kb-prose">{renderHast(section.content, ctx)}</div>
      {section.children.map((c) => (
        <SectionView key={c.id} section={c} ctx={ctx} />
      ))}
    </CollapsibleSection>
  );
}
