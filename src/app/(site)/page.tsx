import Link from "next/link";
import { Suspense } from "react";
import { HomeDashboardCard } from "@/components/dashboard/HomeDashboardCard";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-deep">多保命 護理國考題庫</h1>
      <p className="max-w-md text-muted">
        分章筆記 + 線上測驗，答錯自動收錄到我的題本，可依章節查看正確率。
      </p>

      {wasRedirected && (
        <div className="w-full max-w-md rounded-card border border-card-border bg-card p-4 text-sm text-body shadow-sm">
          <p className="font-medium text-deep">這個功能需要登入</p>
          <p className="mt-1 text-muted">
            測驗模式與錯題本需要記錄你的作答，登入後會直接回到剛才要去的頁面。
          </p>
        </div>
      )}

      {authError && (
        <p className="text-sm text-incorrect">登入沒有完成，請再試一次。</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/subjects"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-deep"
        >
          {wasRedirected ? "先去閱讀模式" : "開始練習"}
        </Link>
        {!user && <GoogleLoginButton next={wasRedirected ? nextPath : undefined} />}
      </div>

      {user && !wasRedirected && (
        <Suspense fallback={null}>
          <HomeDashboardCard />
        </Suspense>
      )}

      <Link href="/privacy" className="text-xs text-muted hover:text-deep">
        隱私說明
      </Link>
    </main>
  );
}
