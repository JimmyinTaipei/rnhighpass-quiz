import Link from "next/link";
import { ChevronRight, MonitorCheck } from "lucide-react";
import { getSubjects } from "@/lib/data";
import { SubjectGrid } from "@/components/subjects/SubjectGrid";
import { requireUser } from "@/lib/auth";

export default async function QuizPage() {
  await requireUser("/quiz");
  const subjects = await getSubjects();
  return (
    <SubjectGrid
      subjects={subjects}
      title="測驗"
      hrefFor={(s) => `/quiz/${s.id}`}
      intro={
        <Link
          href="/mock-exam"
          className="group mb-10 flex items-center gap-4 rounded-card border border-accent bg-light/60 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <MonitorCheck size={32} className="shrink-0 text-deep" />
          <span className="flex-1">
            <span className="block text-lg font-bold text-deep">線上模擬考（電腦化測驗）</span>
            <span className="block text-sm text-body">
              比照考選部電腦化測驗介面，一份考卷 60 分鐘，預設 115 年第二次試題。
            </span>
          </span>
          <ChevronRight className="shrink-0 text-deep transition-transform group-hover:translate-x-1" />
        </Link>
      }
    />
  );
}
