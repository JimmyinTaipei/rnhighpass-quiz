import Link from "next/link";
import { BookOpen, FileQuestion } from "lucide-react";
import { SearchBox } from "@/components/search/SearchBox";
import { searchContent } from "@/lib/data";
import { Panel } from "@/components/ui/Panel";

export const metadata = { title: "搜尋 | 多保命" };

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const result = q ? await searchContent(q) : null;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 flex flex-col">
      <Panel className="flex-1">
      <h1 className="mb-4 text-3xl font-bold text-body">搜尋</h1>
      <div className="mb-6">
        <SearchBox initialQuery={q} />
      </div>

      {!result && (
        <p className="text-sm text-muted">可以搜尋題幹、考點，以及筆記卡的標題與條目。</p>
      )}

      {result && (
        <>
          <p className="mb-6 text-sm text-muted">
            「{q}」找到 {result.questions.length} 題、{result.cards.length} 張筆記卡
            {result.truncated && "（結果過多，僅顯示前 50 筆）"}
          </p>

          {result.questions.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-subj-deep">
                <FileQuestion size={18} className="text-subj-accent" />
                題目
              </h2>
              <div className="space-y-2">
                {result.questions.map(({ question, chapter, subjectName }) => (
                  <Link
                    key={question.id}
                    href={chapter ? `/chapters/${chapter.id}` : "#"}
                    className="block rounded-card border border-card-border bg-page p-4 shadow-sm transition-colors hover:border-subj-accent"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="rounded bg-page px-2 py-0.5">{question.source_text}</span>
                      {chapter && (
                        <span>
                          {subjectName} {chapter.chapter_no} {chapter.title}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-strong">{question.stem}</p>
                    {question.key_point && (
                      <p className="mt-1 text-xs text-muted">考點：{question.key_point}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {result.cards.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-subj-deep">
                <BookOpen size={18} className="text-subj-accent" />
                筆記卡
              </h2>
              <div className="space-y-2">
                {result.cards.map((c) => (
                  <Link
                    key={c.node_id}
                    href={c.chapter ? `/chapters/${c.chapter.id}` : "#"}
                    className="block rounded-card border border-card-border bg-page p-4 shadow-sm transition-colors hover:border-subj-accent"
                  >
                    {c.chapter && (
                      <p className="mb-1 text-xs text-muted">
                        {c.subjectName} {c.chapter.chapter_no} {c.chapter.title}
                      </p>
                    )}
                    <p className="text-sm font-medium text-subj-deep">{c.card_title}</p>
                    {c.matchedBullet && (
                      <p className="mt-1 text-xs leading-relaxed text-strong">
                        • {c.matchedBullet}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {result.questions.length === 0 && result.cards.length === 0 && (
            <p className="text-sm text-muted">沒有找到符合的內容。</p>
          )}
        </>
      )}
    </Panel>
    </main>
  );
}
