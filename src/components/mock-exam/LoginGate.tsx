"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/mock-exam/login";
import { useIsClient } from "@/lib/use-is-client";
import { PageLoader } from "@/components/ui/PageLoader";

/**
 * 沒有經過模擬登入就導回登入頁(登入狀態只存在 sessionStorage，所以只能在 client 判斷)。
 *
 * keepLayout：確認前不換成載入畫面，而是照常排版但隱藏，確認後直接顯示，版面不會跳動。
 * 內容會先掛載，只給掛載時不會寫入資料的唯讀頁面用。
 */
export function LoginGate({
  children,
  keepLayout = false,
}: {
  children: React.ReactNode;
  keepLayout?: boolean;
}) {
  const isClient = useIsClient();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = isClient && isLoggedIn();

  useEffect(() => {
    if (isClient && !isLoggedIn()) {
      router.replace(`/mock-exam?next=${encodeURIComponent(pathname)}`);
    }
  }, [isClient, pathname, router]);

  if (keepLayout) {
    // 外層 div 一直都在，切換時只換 class，子元件不會重新掛載
    return (
      <div className={allowed ? undefined : "invisible"} aria-hidden={!allowed || undefined} inert={!allowed}>
        {children}
      </div>
    );
  }
  if (!allowed) {
    return <PageLoader />;
  }
  return <>{children}</>;
}
