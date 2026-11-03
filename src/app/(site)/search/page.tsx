import { SearchExperience, SearchLoadingIndicator } from "@/components/search/SearchExperience";
import Link from "next/link";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { SearchBox } from "@/components/search/SearchBox";
import { KnowledgeResultList } from "@/components/search/KnowledgeResultList";
import { QuestionResults } from "@/components/search/QuestionResults";
import { TextResultList } from "@/components/search/TextResultList";
import { SearchPagination } from "@/components/search/SearchPagination";
import { Panel } from "@/components/ui/Panel";
import { getExamSittings, getCurrentUser } from "@/lib/data";
import { SearchRetryButton } from "@/components/search/SearchRetryButton";
import { groupKnowledgeResults } from "@/lib/knowledge/search-results";
import { loadKnowledgeTableIndex } from "@/lib/knowledge/tables";
import { searchKnowledge, knowledgeIndex, taxonomy } from "@/lib/knowledge";
import { CATEGORY_LABELS, type KnowledgeCategory } from "@/lib/knowledge/types";
import { parseSittingFilter, sittingLabel } from "@/lib/sitting-filter";
import { parseQuestionRef, SOURCE_EXAMPLE } from "@/lib/question-ref";
import { KNOWLEDGE_RESULT_KINDS, searchHref, pageNumber, pageOf, SEARCH_SCOPES, SEARCH_PAGE_SIZE, SEARCH_PREVIEW_SIZE, SEARCH_KNOWLEDGE_PREVIEW_SIZE, SEARCH_QUESTION_PREVIEW_SIZE, type SearchState, type SearchScope } from "@/lib/search";
import { getSearchContext, searchQuestionPage, searchNotePage, searchLegacyTableItems } from "@/lib/search-data";

export const metadata = { title: "搜尋 | 多保命" };
const ARTICLE_PAGE_SIZE = 10;
const TYPES: KnowledgeCategory[] = ["disease", "care", "admin", "physiology", "pathogen", "drug", "lab", "procedure", "device"];

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const value = (key: string) => typeof sp[key] === "string" ? sp[key] as string : "";
  const q = value("q").trim();
  const scope: SearchScope = SEARCH_SCOPES.find((s) => s.key === value("scope"))?.key ?? "all";
  const type = scope === "knowledge" && TYPES.includes(value("type") as KnowledgeCategory) ? value("type") as KnowledgeCategory : null;
  const resultKind = scope === "knowledge" ? KNOWLEDGE_RESULT_KINDS.find((kind) => kind.key === value("result"))?.key ?? "all" : "all";
  const subject = scope === "knowledge" ? "" : value("subject");
  const chapter = scope === "knowledge" ? "" : value("chapter");
  const sitting = scope === "all" || scope === "questions" ? parseSittingFilter(sp) : { from: null, to: null };
  const from = sitting.from ?? undefined;
  const to = sitting.to ?? undefined;
  const state: SearchState = { q, scope, subject, chapter, type: type ?? undefined, resultKind, from, to, page: pageNumber(value("page")) };
  const size = scope === "all" ? SEARCH_PREVIEW_SIZE : SEARCH_PAGE_SIZE;
  const questionSize = scope === "all" ? SEARCH_QUESTION_PREVIEW_SIZE : SEARCH_PAGE_SIZE;
  const ref = q ? parseQuestionRef(q) : null;
  const showKnowledge = scope === "knowledge" || (scope === "all" && !subject && !chapter);
  const showQuestions = scope === "questions" || scope === "all";
  const showNotes = scope === "notes" || scope === "all";
  const showTables = scope === "tables" || scope === "all";
  const change = (next: Partial<SearchState>) => searchHref({ ...state, page: 1, ...next });
  const [contextResult, sittingsResult] = await Promise.allSettled([
    scope === "knowledge" ? Promise.resolve({ subjects: [], chapters: [] }) : getSearchContext(),
    scope === "all" || scope === "questions" ? getExamSittings() : Promise.resolve([]),
  ]);
  const sittings = sittingsResult.status === "fulfilled" ? sittingsResult.value : [];
  const subjects = contextResult.status === "fulfilled" ? contextResult.value.subjects : [];
  const chapters = contextResult.status === "fulfilled" ? contextResult.value.chapters : [];
  const subjectName = subjects.find((s) => s.id === subject)?.name;
  const currentChapter = chapters.find((c) => String(c.id) === chapter && (!subject || c.subject_id === subject));
  const invalidRange = !!((subject && !subjectName) || (chapter && !currentChapter));
  const [knowledgeResult, questionResult, noteResult, tableResult, userResult] = await Promise.allSettled([
    q && !invalidRange && showKnowledge ? searchKnowledge(q, type, { all: true, resultKind }) : Promise.resolve([]),
    q && !invalidRange && showQuestions ? searchQuestionPage({ ...state, page: scope === "all" ? 1 : state.page }, questionSize) : Promise.resolve(null),
    q && !invalidRange && showNotes ? searchNotePage({ ...state, page: scope === "all" ? 1 : state.page }, size) : Promise.resolve(null),
    q && !invalidRange && showTables ? Promise.all([
      !subject && !chapter ? searchKnowledge(q, null, { tablesOnly: true, all: true }) : Promise.resolve([]),
      searchLegacyTableItems(state),
    ]) : Promise.resolve(null),
    q && showQuestions ? getCurrentUser() : Promise.resolve(null),
  ]);
  const knowledge = knowledgeResult.status === "fulfilled" ? knowledgeResult.value : [];
  const tableIndex = knowledge.some((entry) => entry.tableId) ? await loadKnowledgeTableIndex().catch(() => null) : null;
  const knowledgeGroups = groupKnowledgeResults(knowledge, knowledgeIndex, tableIndex ?? {});
  const knowledgeSize = scope === "all" ? SEARCH_KNOWLEDGE_PREVIEW_SIZE : ARTICLE_PAGE_SIZE;
  const knowledgePage = pageOf(knowledgeGroups, scope === "all" ? 1 : state.page ?? 1, knowledgeSize);
  const questions = questionResult.status === "fulfilled" ? questionResult.value : null;
  const notes = noteResult.status === "fulfilled" ? noteResult.value : null;
  const tableItems = tableResult.status === "fulfilled" && tableResult.value ? [
    ...tableResult.value[0].map((table) => ({ id: table.tableId!, title: table.t, location: `${table.s} · 知識庫表格`, href: `/tables/knowledge/${encodeURIComponent(table.tableId!)}`, snippet: table.snippet })),
    ...tableResult.value[1],
  ] : [];
  const tables = pageOf(tableItems, scope === "all" ? 1 : state.page ?? 1, size);
  const domainName = new Map(taxonomy.domains.map((d) => [d.id, d.name]));
  const total = knowledgePage.total + (questions?.total ?? 0) + (notes?.total ?? 0) + tables.total;
  const failures = [knowledgeResult, questionResult, noteResult, tableResult].some((r) => r.status === "rejected");
  const rangeLabel = currentChapter ? `${subjectName ?? ""} ${currentChapter.chapter_no} ${currentChapter.title}` : subjectName ?? (subject || chapter ? "指定範圍" : scope === "knowledge" ? "知識庫文字與表格" : scope === "questions" ? "所有科目的考古題" : scope === "notes" ? "所有科目的章節筆記" : scope === "tables" ? "全站表格" : "全站");
  const sittingDescription = from || to ? `${from ? sittingLabel(from) : "最早"} 至 ${to ? sittingLabel(to) : "最新"}` : "";
  const activeRangeLabel = sittingDescription ? `${subject || chapter ? `${rangeLabel} 或 ` : ""}考試 ${sittingDescription}` : rangeLabel;
  const more = (target: SearchScope, count: number) => scope === "all" && count > (target === "questions" ? SEARCH_QUESTION_PREVIEW_SIZE : SEARCH_PREVIEW_SIZE) ? <Link href={change({ scope: target })} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline">查看全部 {count} 筆 →</Link> : null;
  const unavailable = (result: PromiseSettledResult<unknown>, label: string) => result.status === "rejected" ? <p role="alert" className="my-4 rounded-btn border border-card-border bg-card p-4 text-sm text-body">{label}暫時無法載入，請<SearchRetryButton /></p> : null;

  return <SearchExperience stateKey={searchHref(state)}><main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
    <Panel className="flex-1">
      <h1 className="mb-4 text-3xl font-bold text-strong">搜尋</h1>
      <SearchBox key={searchHref(state)} initialQuery={q} scope={scope} subject={subject} chapter={chapter} type={type ?? undefined} resultKind={resultKind} label={`搜尋範圍：${activeRangeLabel}`} from={from} to={to} autoFocus={!q} className="mb-4" />
      <nav aria-label="搜尋內容種類" className="mb-4 flex flex-wrap gap-1.5">
        {SEARCH_SCOPES.map((s) => <Link key={s.key} href={change({ scope: s.key, type: undefined })} aria-current={scope === s.key ? "page" : undefined} className={`inline-flex items-center rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-accent ${scope === s.key ? "border-transparent bg-deep font-medium text-on-accent" : "border-card-border bg-card text-body hover:bg-surface-hover"}`}>{s.label}</Link>)}
      </nav>
      {scope !== "knowledge" && <form key={`${subject}|${chapter}|${from}|${to}`} action="/search" className="mb-4 flex flex-wrap items-end gap-2">
        <input type="hidden" name="q" value={q} />
        <input type="hidden" name="scope" value={scope} />
        <label className="flex min-w-0 flex-col gap-0.5 text-xs text-body">科目範圍
          <NativeSelect density="compact" name="subject" defaultValue={subject}>
            <option value="">{from || to ? "未限定科目（僅依梯次）" : "所有科目"}</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </NativeSelect>
        </label>
        {(scope === "all" || scope === "questions") && <>
          <label className="flex flex-col gap-0.5 text-xs text-body">考試梯次：從
            <NativeSelect density="compact" name="from" defaultValue={from ?? ""}>
              <option value="">不限起點</option>
              {sittings.map((key) => <option key={key} value={key}>{sittingLabel(key)}</option>)}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-0.5 text-xs text-body">到
            <NativeSelect density="compact" name="to" defaultValue={to ?? ""}>
              <option value="">不限終點</option>
              {[...sittings].reverse().map((key) => <option key={key} value={key}>{sittingLabel(key)}</option>)}
            </NativeSelect>
          </label>
        </>}
        <button type="submit" className="min-h-9 rounded-btn border border-card-border bg-card px-3 text-sm font-medium text-deep hover:bg-surface-hover">套用範圍</button>
        {(from || to) && <Link href={change({ from: undefined, to: undefined })} className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">清除梯次</Link>}
        {subject && <Link href={change({ subject: "", chapter: "" })} className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">取消科目限制</Link>}
        {subject && !chapter && <details data-search-detail="chapter-range" className="w-full text-sm text-body"><summary className="cursor-pointer py-2">限定章節（選填）</summary><div className="mt-1 flex flex-wrap gap-2">{chapters.filter((c) => c.subject_id === subject).map((c) => <Link key={c.id} className="inline-flex min-h-11 items-center rounded-btn border border-card-border px-3 hover:bg-surface-hover" href={change({ chapter: String(c.id) })}>{c.chapter_no} {c.title}</Link>)}</div></details>}
        {chapter && <Link href={change({ chapter: "" })} className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">取消章節限制</Link>}
      </form>}
      {(scope === "all" || scope === "questions") && <p className="mb-4 text-sm leading-relaxed text-body">
        {sittingDescription && (subject || chapter) ? `考古題符合關鍵字，且符合「${rangeLabel}」或「${sittingDescription}」其中之一即列入，同一題只列一次。` : "考古題可依科目或考試梯次篩選；兩者都有設定時使用 OR（符合任一範圍）。"}
        {scope === "all" && " 梯次只篩選考古題；筆記與表格仍依科目範圍搜尋。"}
      </p>}
      {scope === "knowledge" && <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-body">顯示內容</p>
        <nav aria-label="知識庫結果種類" className="flex flex-wrap gap-2">
          {KNOWLEDGE_RESULT_KINDS.map((kind) => <Link key={kind.key} href={change({ resultKind: kind.key })} aria-current={resultKind === kind.key ? "page" : undefined} className={`inline-flex items-center rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-accent ${resultKind === kind.key ? "border-transparent bg-deep text-on-accent" : "border-card-border bg-card text-body hover:bg-surface-hover"}`}>{kind.label}</Link>)}
        </nav>
      </div>}
      {scope === "knowledge" && <div className="mb-5">
        <p id="knowledge-type-label" className="mb-2 text-sm font-medium text-body">類型篩選</p>
        <nav aria-labelledby="knowledge-type-label" className="flex flex-wrap gap-2">
        {[null, ...TYPES].map((t) => <Link key={t ?? "all"} href={change({ type: t ?? undefined })} aria-current={type === t ? "page" : undefined} className={`inline-flex items-center rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-accent ${type === t ? "border-transparent bg-deep text-on-accent" : "border-card-border bg-card text-body hover:bg-surface-hover"}`}>{t ? CATEGORY_LABELS[t] : "全部類型"}</Link>)}
        </nav>
      </div>}
      <SearchLoadingIndicator />
      {(scope === "notes" || scope === "tables") && <p className="mb-6 text-sm leading-relaxed text-muted">{subject || chapter ? "搜尋此範圍的題目與解答、章節筆記、比較表；題目依章節閱讀的歸屬計算，同一題只列一次。" : scope === "notes" ? "搜尋章節筆記的標題與條目，同一則筆記只列一次。" : "搜尋知識庫表格與比較表的名稱、表頭及內容。"} 每頁最多顯示 15 筆。</p>}
      {!q && <p className="text-sm leading-relaxed text-body">輸入關鍵字開始搜尋。也可輸入題號，例如 {SOURCE_EXAMPLE}；只寫到科目（113-1-基醫）可查整卷。</p>}
      {invalidRange && <p role="alert" className="my-4 text-sm text-body">指定的科目或章節不存在，或範圍資料暫時無法載入。請<Link className="text-accent underline" href={change({ subject: "", chapter: "" })}>取消範圍限制</Link>後重試。</p>}
      {q && scope === "knowledge" && ref && <p className="mb-4 text-sm text-body">你輸入的內容像是題號。<Link href={change({ scope: "questions", type: undefined })} className="text-accent underline">改查考古題</Link></p>}
      {unavailable(contextResult, "科目與章節範圍")}{unavailable(sittingsResult, "考試梯次選項")}{unavailable(knowledgeResult, "知識庫結果")}{unavailable(questionResult, "考古題結果")}{unavailable(noteResult, "章節筆記結果")}{unavailable(tableResult, "表格結果")}
      {q && !invalidRange && showKnowledge && knowledgePage.total > 0 && <section className="mb-8" aria-labelledby="knowledge-results">
        <h2 id="knowledge-results" className="mb-3 text-xl font-bold text-deep">知識庫 <span className="text-sm font-normal text-muted">{knowledgePage.total} 篇文章 · {knowledge.length} 項符合</span></h2>
        <KnowledgeResultList groups={knowledgePage.items} domainName={domainName} state={state} />
        {scope !== "all" && <SearchPagination state={state} total={knowledgePage.total} page={knowledgePage.page} size={knowledgeSize} unit="篇" />}{scope === "all" && knowledgePage.total > knowledgeSize && <Link href={change({ scope: "knowledge" })} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline">查看全部 {knowledgePage.total} 篇文章 →</Link>}
      </section>}
      {q && questions && questions.total > 0 && <section className="mb-8" aria-labelledby="question-results">
        <h2 id="question-results" className="mb-3 text-xl font-bold text-deep">{ref ? "題號查詢" : "考古題"} <span className="text-sm font-normal text-muted">共 {questions.total} 題</span></h2>
        <QuestionResults key={`${searchHref(state)}:questions`} items={questions.items} query={q} isLoggedIn={userResult.status === "fulfilled" && !!userResult.value} />
        {scope !== "all" && <SearchPagination state={state} total={questions.total} page={questions.page} />}{more("questions", questions.total)}
      </section>}
      {q && notes && notes.total > 0 && <section className="mb-8" aria-labelledby="note-results">
        <h2 id="note-results" className="mb-3 text-xl font-bold text-deep">章節筆記 <span className="text-sm font-normal text-muted">共 {notes.total} 則</span></h2>
        <TextResultList items={notes.items} state={state} />
        {scope !== "all" && <SearchPagination state={state} total={notes.total} page={notes.page} />}{more("notes", notes.total)}
      </section>}
      {q && tables.total > 0 && <section className="mb-8" aria-labelledby="table-results">
        <h2 id="table-results" className="mb-3 text-xl font-bold text-deep">表格 <span className="text-sm font-normal text-muted">共 {tables.total} 張</span></h2>
        <TextResultList items={tables.items} state={state} />
        {scope !== "all" && <SearchPagination state={state} total={tables.total} page={tables.page} />}{more("tables", tables.total)}
      </section>}
      {q && !invalidRange && !failures && total === 0 && <div className="rounded-card border border-card-border bg-card p-5 text-sm text-body">
        <p className="font-medium text-strong">目前範圍{type ? `（${CATEGORY_LABELS[type]}）` : ""}找不到「{q}」</p>
        <p className="mt-2">試試較短的關鍵字、英文或縮寫，也可以調整上方的篩選。</p>
        <div className="mt-3 flex flex-wrap gap-4">{resultKind !== "all" && <Link href={change({ resultKind: "all" })} className="inline-flex min-h-11 items-center text-accent underline">顯示全部內容種類</Link>}{type && <Link href={change({ type: undefined })} className="inline-flex min-h-11 items-center text-accent underline">清除類型篩選</Link>}<Link href={searchHref({ q, scope: "all" })} className="inline-flex min-h-11 items-center text-accent underline">改搜全站</Link></div>
      </div>}
    </Panel>
  </main></SearchExperience>;
}
