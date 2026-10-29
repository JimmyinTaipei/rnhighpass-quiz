import Link from "next/link";
import { BookOpen, FileQuestion, Library } from "lucide-react";
import { SearchBox, type SearchScope } from "@/components/search/SearchBox";
import { KnowledgeResultList } from "@/components/search/KnowledgeResultList";
import { QuestionResults, type QuestionResultItem } from "@/components/search/QuestionResults";
import { getCurrentUser, searchContent, searchQuestionsByRef, type QuestionHit } from "@/lib/data";
import { searchKnowledge, taxonomy } from "@/lib/knowledge";
import { CATEGORY_LABELS, type KnowledgeCategory } from "@/lib/knowledge/types";
import { parseQuestionRef, SOURCE_EXAMPLE } from "@/lib/question-ref";
import { Panel } from "@/components/ui/Panel";

export const metadata = { title: "搜尋 | 多保命" };

const TYPE_ORDER: KnowledgeCategory[] = ["disease", "care", "admin", "physiology", "pathogen", "drug", "lab", "procedure", "device"];
/** 「全部」裡每一區先列幾筆，其餘點「看全部」切到該範圍 */
const PREVIEW = 5;

const SCOPES: { key: SearchScope; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "knowledge", label: "知識庫" },
  { key: "questions", label: "考古題" },
];

function toItems(hits: QuestionHit[]): QuestionResultItem[] {
  return hits.map(({ question, chapter, subjectName }) => ({
    question,
    chapterLabel: chapter ? `${subjectName} ${chapter.chapter_no} ${chapter.title}` : "",
  }));
}

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const scope: SearchScope = sp.scope === "knowledge" || sp.scope === "questions" ? sp.scope : "all";
  const rawType = typeof sp.type === "string" ? sp.type : null;
  const type = rawType && rawType in CATEGORY_LABELS ? (rawType as KnowledgeCategory) : null;

  const href = (next: { scope?: SearchScope; type?: KnowledgeCategory | null }) => {
    const params = new URLSearchParams({ q });
    const s = next.scope ?? scope;
    if (s !== "all") params.set("scope", s);
    const t = next.type === undefined ? type : next.type;
    if (t && s === "knowledge") params.set("type", t);
    return `/search?${params}`;
  };

  // 題號(ID 或 Source)直接查題，不跑全文搜尋
  const ref = q ? parseQuestionRef(q) : null;
  const [user, knowledge, content, refHits] = q
    ? await Promise.all([
        getCurrentUser(),
        ref ? [] : searchKnowledge(q, type),
        ref ? null : searchContent(q),
        ref ? searchQuestionsByRef(ref) : null,
      ])
    : [null, [], null, null];
  const questions = toItems(refHits ?? content?.questions ?? []);
  const cards = content?.cards ?? [];
  const domainName = new Map(taxonomy.domains.map((d) => [d.id, d.name]));
  const typedId = ref?.kind === "id" && q.includes("_");
  const counts = { knowledge: knowledge.length + cards.length, questions: questions.length };
  const nothing = q && counts.knowledge === 0 && counts.questions === 0;

  const showKnowledge = !ref && scope !== "questions";
  const showQuestions = scope !== "knowledge" || !!ref;
  const limit = (n: number) => (scope === "all" ? PREVIEW : n);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 flex flex-col">
      <Panel className="flex-1">
        <h1 className="max-md:sr-only mb-4 text-3xl font-bold text-strong">搜尋</h1>
        <SearchBox key={`${q}|${scope}`} initialQuery={q} scope={ref ? "all" : scope} autoFocus={!q} className="mb-3" />

        {q && !ref && (
          <div className="segmented mb-6" role="group" aria-label="搜尋範圍">
            {SCOPES.map((s) => (
              <Link key={s.key} href={href({ scope: s.key, type: null })} aria-current={scope === s.key ? "true" : undefined}>
                {s.label}
                {s.key !== "all" && <span className="ml-1 text-xs text-muted tabular-nums">{counts[s.key]}</span>}
              </Link>
            ))}
          </div>
        )}

        {!q && (
          <div className="space-y-2 text-sm text-muted">
            <p>一次搜尋知識庫（疾病、藥物、檢驗、照護…）與歷屆考古題的題幹、考點。</p>
            <p>
              找特定題目請輸入題號，例如 <span className="font-medium text-body">{SOURCE_EXAMPLE}</span>
              （年度-次別-科目-題號）；只寫到科目（113-1-基醫）會列出那一卷全部題目。
            </p>
          </div>
        )}

        {ref && (
          <div className="mb-6">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-subj-deep">
              <FileQuestion size={18} className="text-subj-accent" />
              題號查詢
            </h2>
            {typedId && ref.kind === "id" && (
              <p className="mb-3 text-sm text-muted">
                建議改用考卷上的題號搜尋：<span className="font-medium text-body">{ref.source}</span>
              </p>
            )}
            {questions.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                找不到 {ref.kind === "id" ? ref.source : ref.prefix.replace(/-$/, "")}。請確認年度、次別與科目（基醫、基護、內外、產兒、精社），或那一年是否有這一次考試。
              </p>
            ) : (
              <>
                {ref.kind === "paper" && <p className="mb-3 text-sm text-muted">共 {questions.length} 題</p>}
                <QuestionResults items={questions} isLoggedIn={!!user} />
              </>
            )}
          </div>
        )}

        {showKnowledge && knowledge.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-subj-deep">
              <Library size={18} className="text-subj-accent" />
              知識庫
              <span className="text-sm font-normal text-muted">{knowledge.length} 筆{knowledge.length >= 50 && "以上"}</span>
            </h2>
            {scope === "knowledge" && (
              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                {[null, ...TYPE_ORDER].map((t) => (
                  <Link
                    key={t ?? "all"}
                    href={href({ type: t })}
                    className={`rounded-full px-3 py-1 ${
                      type === t ? "bg-deep text-on-accent" : "border border-card-border bg-card text-body hover:bg-surface-hover"
                    }`}
                  >
                    {t ? CATEGORY_LABELS[t] : "全部類型"}
                  </Link>
                ))}
              </div>
            )}
            <KnowledgeResultList results={knowledge.slice(0, limit(knowledge.length))} domainName={domainName} />
            {scope === "all" && knowledge.length > PREVIEW && (
              <Link href={href({ scope: "knowledge" })} className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                看全部知識庫結果 →
              </Link>
            )}
          </section>
        )}

        {showQuestions && !ref && questions.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-subj-deep">
              <FileQuestion size={18} className="text-subj-accent" />
              考古題
              <span className="text-sm font-normal text-muted">
                {questions.length} 題{content?.truncated && "以上"}
              </span>
            </h2>
            <QuestionResults items={questions.slice(0, limit(questions.length))} isLoggedIn={!!user} />
            {scope === "all" && questions.length > PREVIEW && (
              <Link href={href({ scope: "questions" })} className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                看全部考古題結果 →
              </Link>
            )}
          </section>
        )}

        {/* 舊版章節筆記卡：知識庫範圍才列，放最後 */}
        {scope === "knowledge" && cards.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-subj-deep">
              <BookOpen size={16} className="text-subj-accent" />
              章節筆記卡
            </h2>
            <div className="space-y-2">
              {cards.map((c) => (
                <Link
                  key={c.node_id}
                  href={c.chapter ? `/chapters/${c.chapter.id}` : "#"}
                  className="block rounded-card bg-(--surface-inset) p-4 transition-colors hover:bg-surface-hover"
                >
                  {c.chapter && (
                    <p className="mb-1 text-xs text-muted">
                      {c.subjectName} {c.chapter.chapter_no} {c.chapter.title}
                    </p>
                  )}
                  <p className="text-sm font-medium text-subj-deep">{c.card_title}</p>
                  {c.matchedBullet && <p className="mt-1 text-xs leading-relaxed text-strong">• {c.matchedBullet}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 沒結果不留一片空白：給下一步(L7) */}
        {(nothing || (q && !ref && scope !== "all" && counts[scope] === 0)) && (
          <div className="rounded-card bg-(--surface-inset) p-5 text-sm text-body">
            <p className="mb-2 font-medium text-strong">
              {nothing ? `找不到「${q}」` : `${scope === "knowledge" ? "知識庫" : "考古題"}裡找不到「${q}」`}
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>檢查有沒有錯字，或改用較短的關鍵字（例如「心衰竭」而不是「心衰竭的護理措施」）</li>
              <li>試試英文或縮寫，例如 DKA、COPD</li>
              {!nothing && (
                <li>
                  <Link href={href({ scope: "all" })} className="font-medium text-accent hover:underline">
                    改搜全部範圍
                  </Link>
                </li>
              )}
              <li>找特定題目請輸入題號，例如 {SOURCE_EXAMPLE}</li>
            </ul>
          </div>
        )}
      </Panel>
    </main>
  );
}
