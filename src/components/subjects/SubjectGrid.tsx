import Link from "next/link";
import type { Subject } from "@/lib/types";
import { groupSubjects, subjectGroup } from "@/lib/subject-groups";
import { subjectIcon } from "./subject-icons";
import { SubjectLink } from "./SubjectLink";

interface SubjectGridProps {
  subjects: Subject[];
  title: string;
  /** 產生每個科目卡的連結，例如 /subjects/xxx 或 /quiz/xxx */
  hrefFor: (subject: Subject) => string;
  /** 標題下方、科目清單上方的額外內容(例如 /quiz 的模擬考入口、「繼續上次」) */
  intro?: React.ReactNode;
  /**
   * 閱讀流程用：點科目直接進「上次讀到的 Ch」。
   * /quiz 不開，因為測驗要先選範圍，不該跳過設定頁。
   */
  rememberPosition?: boolean;
}

/**
 * /subjects 與 /quiz 共用的科目總覽。
 *
 * 間距刻意壓得比站內其他頁緊，而且 4 欄的斷點從 xl(1280) 降到 lg(1024)：
 * 這一頁的用途是「一眼看完 11 科再選一科」，要捲動才看得到後面幾科就失去意義了。
 * 13" 筆電(Safari 內容區約 830–870px)下全部內容約 750–780px，剛好一屏。
 *
 * 顏色機制：每個考科大類的 <section> 掛上 data-group，底下的
 * text-subj-deep / border-subj-accent 等 class 就會解析到該組顏色
 * (定義在 globals.css)，所以同一份 markup 能呈現五種配色。
 */
export function SubjectGrid({
  subjects,
  title,
  hrefFor,
  intro,
  rememberPosition = false,
}: SubjectGridProps) {
  const groups = groupSubjects(subjects);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5">
      <h1 className="mb-4 text-2xl font-bold text-body">{title}</h1>
      {intro}
      {groups.map((g) => (
        <section key={g.id} data-group={g.id} className="mb-5">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-subj-accent" />
            <h2 className="text-xl font-bold text-subj-deep">{g.label}</h2>
            <span className="text-sm text-muted">{g.subjects.length} 科</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {g.subjects.map((s) => {
              const Icon = subjectIcon(s.name);
              const cardClass =
                "group flex items-center gap-3 rounded-card border border-card-border bg-card px-3 py-2 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-subj-accent hover:shadow-md";
              const inner = (
                <>
                  {/* icon 方塊：平時淺色底＋深色線條；hover 時疊上的漸層層淡入、線條轉白。
                      漸層放在獨立的一層用 opacity 切換，因為背景色無法直接過渡成漸層 */}
                  <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-subj-light">
                    <span className="absolute inset-0 bg-linear-to-b from-subj-mid to-subj-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Icon
                      size={22}
                      strokeWidth={1.75}
                      className="relative text-subj-deep transition-colors duration-300 group-hover:text-white"
                    />
                  </span>
                  <span className="text-lg font-bold text-subj-deep">{s.name}</span>
                </>
              );

              return rememberPosition ? (
                <SubjectLink
                  key={s.id}
                  subjectId={s.id}
                  fallbackHref={hrefFor(s)}
                  data-group={subjectGroup(s)}
                  className={cardClass}
                >
                  {inner}
                </SubjectLink>
              ) : (
                <Link
                  key={s.id}
                  href={hrefFor(s)}
                  data-group={subjectGroup(s)}
                  className={cardClass}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
