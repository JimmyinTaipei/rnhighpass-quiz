import Link from "next/link";
import type { Subject } from "@/lib/types";
import { groupSubjects, subjectGroup } from "@/lib/subject-groups";
import { subjectIcon } from "./subject-icons";

interface SubjectGridProps {
  subjects: Subject[];
  title: string;
  /** 產生每個科目卡的連結，例如 /subjects/xxx 或 /quiz/xxx */
  hrefFor: (subject: Subject) => string;
  /** 標題下方、科目清單上方的額外內容(例如 /quiz 的模擬考入口) */
  intro?: React.ReactNode;
}

/**
 * /subjects 與 /quiz 共用的科目總覽。
 *
 * 顏色機制：每個考科大類的 <section> 掛上 data-group，底下的
 * text-subj-deep / border-subj-accent 等 class 就會解析到該組顏色
 * (定義在 globals.css)，所以同一份 markup 能呈現五種配色。
 */
export function SubjectGrid({ subjects, title, hrefFor, intro }: SubjectGridProps) {
  const groups = groupSubjects(subjects);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-body">{title}</h1>
      {intro}
      {groups.map((g) => (
        <section key={g.id} data-group={g.id} className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-subj-accent" />
            <h2 className="text-xl font-bold text-subj-deep">{g.label}</h2>
            <span className="text-sm text-muted">{g.subjects.length} 科</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.subjects.map((s) => {
              const Icon = subjectIcon(s.name);
              return (
                <Link
                  key={s.id}
                  href={hrefFor(s)}
                  data-group={subjectGroup(s)}
                  className="group flex items-center gap-4 rounded-card border border-card-border bg-card px-3 py-2.5 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-subj-accent hover:shadow-md"
                >
                  {/* icon 方塊：平時淺色底＋深色線條；hover 時疊上的漸層層淡入、線條轉白。
                      漸層放在獨立的一層用 opacity 切換，因為背景色無法直接過渡成漸層 */}
                  <span className="relative flex size-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-subj-light">
                    <span className="absolute inset-0 bg-linear-to-b from-subj-mid to-subj-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Icon
                      size={30}
                      strokeWidth={1.75}
                      className="relative text-subj-deep transition-colors duration-300 group-hover:text-white"
                    />
                  </span>
                  <span className="text-xl font-bold text-subj-deep">{s.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
