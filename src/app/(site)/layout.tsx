import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isMockOnly } from "@/lib/site-mode";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { DevBanner } from "@/components/admin/DevBanner";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { DesktopBackBar } from "@/components/shell/DesktopBackBar";
import { MobileTabBar } from "@/components/shell/MobileTabBar";
import { MobileTopBar } from "@/components/shell/MobileTopBar";
import { NavHistoryTracker } from "@/components/shell/NavHistoryTracker";
import { ScrollTopButton } from "@/components/shell/ScrollTopButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserStatus } from "@/components/ui/UserStatus";

// 主站外框：md 以上是左側分區側邊欄(iPad 的 sidebar)，手機是頂部標題列＋底部頁籤(iPhone 的
// navigation bar + tab bar)。兩者讀同一份 lib/nav-items.ts，同一頁在兩種裝置上屬於同一個分區。
// 刻意不放在 root layout:/mock-exam 是模擬國考的全版介面，不應出現主站導覽。
export default function SiteLayout({
  children,
  panel,
}: {
  children: React.ReactNode;
  /** 知識面板(@panel slot，見 @panel/(.)k)：在目前頁面上疊一層，不換頁 */
  panel: React.ReactNode;
}) {
  // 模擬考站不該存在這些頁面。proxy 已經會導走，這裡是第二道防線
  // (預取、快取等情況下 proxy 不保證攔得到)。
  if (isMockOnly()) notFound();

  return (
    <FavoritesProvider>
      {/* data-ui="apple":主站的 Apple 風格 token(globals.css)，模擬考與列印頁不受影響 */}
      <div data-ui="apple" className="flex flex-1 flex-col">
        {/* 讀 cookie 的部分都包 Suspense：layout 讀 runtime 資料時 loading.tsx 不會顯示，
            導覽會卡到 layout 渲染完才換頁(Next 16 文件) */}
        <Suspense fallback={null}>
          <DevBanner />
        </Suspense>
        <div className="flex flex-1">
          <AppSidebar
            account={
              <Suspense fallback={<Skeleton className="h-9 w-full rounded-lg" />}>
                <UserStatus />
              </Suspense>
            }
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileTopBar
              trailing={
                <Suspense fallback={null}>
                  <UserStatus variant="mobile" />
                </Suspense>
              }
            />
            {/* 電腦版左上角返回(手機用上面 MobileTopBar 的返回鍵) */}
            <DesktopBackBar />
            {/* 手機底部頁籤 3.5rem + Home 指示條，內容不能被蓋住 */}
            <div className="flex flex-1 flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
              {children}
            </div>
          </div>
        </div>
        <MobileTabBar />
        <ScrollTopButton />
        <NavHistoryTracker />
        {panel}
      </div>
    </FavoritesProvider>
  );
}
