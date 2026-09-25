import { notFound } from "next/navigation";
import {
  dedupeTables,
  getChapter,
  getQuestionsByIds,
  getQuestionsByTopicIds,
  getSubject,
  getTablesForQuestions,
  getTopics,
} from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { parseNotebookSource, UNCATEGORIZED } from "@/lib/notebook";
import { idsForSubject, loadNotebookIndex } from "@/lib/notebook-data";
import type { Question } from "@/lib/types";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { answerLabel, PrintExplanation, PrintQuestion } from "@/components/print/PrintQuestion";
import { ComparisonTableView } from "@/components/tables/ComparisonTableView";

export const metadata = { title: "匯出題目 | 多保命" };

/** 勾選匯出的上限；也避免有人丟一個超長 id 清單進來 */
const MAX_IDS = 100;
const ID_RE = /^[\w-]{1,64}$/;

type AnswerMode = "inline" | "end" | "none";

export default async function PrintQuestionsPage(props: PageProps<"/print/questions">) {
  const sp = await props.searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const source = str(sp.source);
  const answerMode: AnswerMode = str(sp.ans) === "end" ? "end" : str(sp.ans) === "none" ? "none" : "inline";
  const withTables = str(sp.tables) === "1";

  let questions: Question[] = [];
  let title = "";

  if (source === "mistakes" || source === "favorites") {
    // 個人資料：一定要登入，而且題目清單由 server 依登入者計算
    const subjectId = str(sp.subject) ?? "";
    const self = `/print/questions?source=${source}&subject=${encodeURIComponent(subjectId)}`;
    await requireUser(self);
    const index = await loadNotebookIndex(parseNotebookSource(source));
    const ids = idsForSubject(index, subjectId);
    const byId = new Map((await getQuestionsByIds(ids)).map((q) => [q.id, q]));
    questions = ids.flatMap((id) => byId.get(id) ?? []);
    const name =
      subjectId === UNCATEGORIZED ? "未分類" : (index.subjects.find((s) => s.id === subjectId)?.name ?? "");
    title = `${source === "mistakes" ? "錯題本" : "收藏"}・${name}`;
  } else if (source === "chapter") {
    const chapterId = Number(str(sp.chapter));
    if (!Number.isInteger(chapterId)) notFound();
    const chapter = await getChapter(chapterId);
    if (!chapter) notFound();
    const [subject, topics] = await Promise.all([getSubject(chapter.subject_id), getTopics(chapterId)]);
    const all = await getQuestionsByTopicIds(topics.map((t) => t.id));
    // 依章節內的主題順序，與閱讀頁一致
    const order = new Map(topics.map((t, i) => [t.id, i]));
    questions = all.sort(
      (a, b) => (order.get(a.topic_id ?? -1) ?? 0) - (order.get(b.topic_id ?? -1) ?? 0) || a.id.localeCompare(b.id),
    );
    title = `${subject?.name ?? ""} ${chapter.chapter_no} ${chapter.title}`;
  } else if (source === "ids") {
    // 題目本身是公開內容，不需要登入；只做格式與數量限制
    const ids = (str(sp.ids) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => ID_RE.test(s))
      .slice(0, MAX_IDS);
    const byId = new Map((await getQuestionsByIds(ids)).map((q) => [q.id, q]));
    questions = ids.flatMap((id) => byId.get(id) ?? []);
    title = "自選題目";
  } else {
    notFound();
  }

  const tables = withTables && questions.length > 0
    ? dedupeTables(await getTablesForQuestions(questions.map((q) => q.id)))
    : [];

  // 工具列的選項連結：保留其他參數，只換一個
  const hrefWith = (key: string, value: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (typeof v === "string") q.set(k, v);
    q.set(key, value);
    return `/print/questions?${q.toString()}`;
  };
  const today = new Date().toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" });

  return (
    <>
      <style>{`@page { size: A4; margin: 14mm 12mm; }`}</style>
      <PrintToolbar
        title={`匯出 PDF・${questions.length} 題`}
        options={[
          {
            label: "答案與詳解",
            choices: [
              { label: "每題後面", href: hrefWith("ans", "inline"), active: answerMode === "inline" },
              { label: "附在文末", href: hrefWith("ans", "end"), active: answerMode === "end" },
              { label: "不附（空白考卷）", href: hrefWith("ans", "none"), active: answerMode === "none" },
            ],
          },
          {
            label: "相關比較表",
            choices: [
              { label: "不附", href: hrefWith("tables", "0"), active: !withTables },
              { label: "附在最後", href: hrefWith("tables", "1"), active: withTables },
            ],
          },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-6 print:max-w-none print:p-0">
        <header className="mb-4 border-b-2 border-deep pb-2">
          <h1 className="text-xl font-bold text-deep">{title}</h1>
          <p className="text-xs text-muted">
            多保命 護理國考題庫・共 {questions.length} 題・{today}
          </p>
        </header>

        {questions.length === 0 ? (
          <p className="text-sm text-muted">沒有題目可以匯出。</p>
        ) : (
          questions.map((q, i) => (
            <PrintQuestion key={q.id} question={q} no={i + 1} showAnswer={answerMode === "inline"} />
          ))
        )}

        {answerMode === "end" && questions.length > 0 && (
          <section className="break-before-page pt-4">
            <h2 className="mb-3 text-lg font-bold text-deep">答案</h2>
            <div className="mb-6 grid grid-cols-5 gap-x-4 gap-y-1 text-sm sm:grid-cols-10">
              {questions.map((q, i) => (
                <span key={q.id}>
                  <span className="text-muted">{i + 1}.</span> {answerLabel(q)}
                </span>
              ))}
            </div>
            <h2 className="mb-2 text-lg font-bold text-deep">詳解</h2>
            {questions.map((q, i) => (
              <div key={q.id} className="break-inside-avoid border-b border-card-border py-2 text-sm">
                <p className="font-bold text-deep">
                  {i + 1}. 答案 {answerLabel(q)}
                  <span className="ml-2 text-xs font-normal text-muted">{q.source_text}</span>
                </p>
                <PrintExplanation question={q} />
              </div>
            ))}
          </section>
        )}

        {tables.length > 0 && (
          <section className="break-before-page pt-4">
            <h2 className="mb-3 text-lg font-bold text-deep">相關比較表</h2>
            <div className="space-y-6">
              {tables.map((t) => (
                <div key={t.id} className="break-inside-avoid">
                  <h3 className="mb-2 font-bold text-deep">{t.title}</h3>
                  <ComparisonTableView table={t} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
