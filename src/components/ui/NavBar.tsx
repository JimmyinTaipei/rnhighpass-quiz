import Link from "next/link";
import { Suspense } from "react";
import { NavLinks } from "./NavLinks";
import { MobileTabBar } from "./MobileTabBar";
import { UserStatus } from "./UserStatus";
import { Skeleton } from "./Skeleton";

export function NavBar() {
  return (
    <>
      <header className="border-b border-card-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold tracking-wide text-deep">
              多保命
            </Link>
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          {/* UserStatus 會呼叫 cookies()(透過 supabase-server)。它在 root layout 裡，
              而 Next 16 文件明講：layout 讀 runtime 資料時 loading.tsx 不會顯示 fallback，
              導覽會卡到 layout 渲染完才換頁。包一層 Suspense 把它從阻塞路徑上移開，
              各頁的 loading.tsx 才會真的出現。 */}
          <Suspense fallback={<Skeleton className="h-9 w-20 rounded-full" />}>
            <UserStatus />
          </Suspense>
        </div>
      </header>
      <MobileTabBar />
    </>
  );
}
