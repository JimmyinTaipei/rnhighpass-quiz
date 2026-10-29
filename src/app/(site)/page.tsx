import Link from "next/link";
import { Suspense } from "react";
import { HomeDashboardCard } from "@/components/dashboard/HomeDashboardCard";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";
import { HomeBackdrop } from "@/components/home/HomeBackdrop";
import { ContinueReading } from "@/components/subjects/ContinueReading";
import { getCurrentUser } from "@/lib/data";
import { safeNextPath } from "@/lib/routes";

export default async function Home(props: PageProps<"/">) {
  const [user, searchParams] = await Promise.all([
    getCurrentUser(),
    props.searchParams,
  ]);

  const rawNext = searchParams.next;
  const nextPath = safeNextPath(typeof rawNext === "string" ? rawNext : null);
  // 有 next 代表使用者是被 proxy/requireUser 從受保護頁面導回來的
  const wasRedirected = nextPath !== "/" && !user;
  const authError = searchParams.error === "auth";

  return (
    // 背景要鋪滿整個寬度，所以外層不設 max-w；內容區再收回 max-w-3xl。
    // pb 留出海浪的高度，內容不會壓在波紋上。
    <main className="relative isolate flex w-full flex-1 flex-col overflow-hidden">
      <HomeBackdrop />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 pt-16 pb-44 text-center md:pb-56">
        <h1 className="text-3xl font-bold tracking-tight text-deep">多保命 護理國考題庫</h1>
        <p className="max-w-md text-muted">
          分章筆記 + 線上測驗，答錯自動收錄到我的題本，可依章節查看正確率。
        </p>

        {wasRedirected && (
          <div className="w-full max-w-md rounded-card bg-card p-4 text-sm text-body shadow-sm">
            <p className="font-medium text-deep">這個功能需要登入</p>
            <p className="mt-1 text-muted">
              測驗模式與錯題本需要記錄你的作答，登入後會直接回到剛才要去的頁面。
            </p>
          </div>
        )}

        {authError && (
          <p className="text-sm text-incorrect">登入沒有完成，請再試一次。</p>
        )}

        {/* 主次：一般情況「開始讀書」是主要動作、登入是次要；從需要登入的頁面被導回來時反過來。
            手機上下排、同寬，電腦版並排 */}
        <div className="flex w-full max-w-sm flex-col items-center gap-3 md:max-w-none md:flex-row md:justify-center">
          <Link
            href="/subjects"
            className={`flex h-12 w-full items-center justify-center rounded-full px-6 text-[0.9375rem] transition-colors md:w-[220px] ${
              wasRedirected
                ? "border border-card-border bg-card font-medium text-deep hover:bg-surface-hover"
                : "bg-mid font-semibold text-on-mid hover:bg-accent"
            }`}
          >
            {wasRedirected ? "先去閱讀模式" : "開始讀書"}
          </Link>
          {!user && (
            <GoogleLoginButton
              next={wasRedirected ? nextPath : undefined}
              tone={wasRedirected ? "primary" : "secondary"}
            />
          )}
        </div>
        {!user && !wasRedirected && <p className="-mt-3 text-xs text-muted">登入後才會記錄作答與錯題</p>}

        {/* 閱讀位置存在這台裝置上，未登入也有；沒有紀錄時整列不出現 */}
        {!wasRedirected && (
          // 沒有閱讀紀錄時 ContinueReading 不渲染，empty:hidden 讓空的外框不再多佔一段間距
          <div className="w-full max-w-md text-left empty:hidden">
            <ContinueReading />
          </div>
        )}

        {user && !wasRedirected && (
          <Suspense fallback={null}>
            <HomeDashboardCard />
          </Suspense>
        )}

        <Link href="/privacy" className="-my-2 px-3 py-3 text-xs text-muted hover:text-deep">
          隱私說明
        </Link>
      </div>
    </main>
  );
}
