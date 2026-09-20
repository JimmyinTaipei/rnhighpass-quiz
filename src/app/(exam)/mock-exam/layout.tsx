import type { Metadata } from "next";
import { House } from "lucide-react";
import { SITE_HOME } from "@/lib/mock-exam/labels";
import { isMockOnly } from "@/lib/site-mode";

export const metadata: Metadata = {
  title: "多保命 護理師線上模擬考",
  description: "比照考選部國家考試電腦化測驗介面的護理師國考模擬測驗",
};

// 模擬考專用外框：刻意不放主站導覽列，只留一個「回主畫面」連結(SITE_HOME)，
// 讓這個資料夾之後可以整包搬到獨立網站(見 src/lib/mock-exam/README.md)。
export default function MockExamLayout({ children }: { children: React.ReactNode }) {
  // 模擬考站沒有其他頁面，「回主畫面」改成連回多保命主站
  const home = isMockOnly() ? { href: "https://rnhighpass.com", label: "多保命首頁" } : SITE_HOME;

  return (
    <>
      <header className="border-b border-card-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="shrink-0 text-lg font-bold tracking-wide text-deep">多保命</span>
            <span className="truncate text-sm text-body">護理師線上模擬考・電腦化測驗練習</span>
          </div>
          {home && (
            <a
              href={home.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-card-border px-3 py-1.5 text-sm text-body transition-colors hover:border-accent hover:text-deep"
            >
              <House size={16} />
              {home.label}
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <footer className="px-4 py-6 text-center text-xs text-muted">
        本系統為模擬練習，介面與實際考試可能不同，正式考試以考選部公告為準。
      </footer>
    </>
  );
}
