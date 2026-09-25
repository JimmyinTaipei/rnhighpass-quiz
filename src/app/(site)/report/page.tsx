import Link from "next/link";
import { getCurrentUser, getMyReports } from "@/lib/data";
import { Panel } from "@/components/ui/Panel";
import { ReportForm } from "@/components/report/ReportForm";
import { MyReportList } from "@/components/report/MyReportList";

export const metadata = { title: "回報錯誤 | 多保命" };

export default async function ReportPage() {
  const user = await getCurrentUser();
  const reports = user ? await getMyReports() : [];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <Panel>
        <h1 className="mb-2 text-2xl font-bold text-deep">回報錯誤</h1>
        <p className="mb-6 text-sm text-muted">
          題目、答案或詳解有問題，建議直接按題目右上角的旗子圖示回報，會自動附上題號。
          這裡適合回報網站問題或提供建議。
        </p>
        <ReportForm loggedIn={!!user} defaultCategory="site" />
        <p className="mt-6 text-xs text-muted">
          想了解我們收集哪些資料？請看
          <Link href="/privacy" className="ml-1 text-deep underline">
            隱私說明
          </Link>
          。
        </p>
      </Panel>

      {user && (
        <Panel>
          <h2 className="mb-3 text-lg font-bold text-deep">我的回報</h2>
          <MyReportList reports={reports} />
        </Panel>
      )}
    </main>
  );
}
