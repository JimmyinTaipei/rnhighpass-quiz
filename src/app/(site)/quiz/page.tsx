import Link from "next/link";
import { AlertCircle, ChevronRight, MonitorCheck } from "lucide-react";
import { getSubjects } from "@/lib/data";
import { SubjectGrid } from "@/components/subjects/SubjectGrid";
import { requireUser } from "@/lib/auth";
import { loadNotebookIndex } from "@/lib/notebook-data";

/**
 * 「練習」分區首頁：跨章節的練習入口。
 * 單章的「讀」與「練」在科目頁與章節頁，這裡放模擬考、錯題重做、自選範圍出題。
 */
export default async function QuizPage() {
  await requireUser("/quiz");
  const [subjects, notebook] = await Promise.all([getSubjects(), loadNotebookIndex("mistakes")]);
  const mistakes = notebook.totals.mistakes;

  const cardClass =
    "group flex items-center gap-4 rounded-card bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md active:opacity-70";

  return (
    <SubjectGrid
      subjects={subjects}
      title="練習"
      hrefFor={(s) => `/quiz/${s.id}`}
      intro={
        <>
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <Link href="/mock-exam" className={cardClass}>
              <MonitorCheck size={30} className="shrink-0 text-deep" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-deep">歷年考題模擬</span>
                <span className="block text-sm text-body">選一次歷屆國考，比照考選部電腦化測驗作答，成績記錄到帳號</span>
              </span>
              <ChevronRight className="shrink-0 text-deep transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/mistakes" className={cardClass}>
              <AlertCircle size={30} className="shrink-0 text-incorrect" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-strong">錯題重做</span>
                <span className="block text-sm text-body">
                  {mistakes > 0 ? `題本裡有 ${mistakes} 題錯題` : "答錯的題目會自動收進題本"}
                </span>
              </span>
              <ChevronRight className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <h2 className="mb-3 text-lg font-bold text-strong">自選範圍出題</h2>
        </>
      }
    />
  );
}
