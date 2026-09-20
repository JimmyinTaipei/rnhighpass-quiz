"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/mock-exam/login";
import { useIsClient } from "@/lib/use-is-client";
import { PageLoader } from "@/components/ui/PageLoader";

/** 沒有經過模擬登入就導回登入頁(登入狀態只存在 sessionStorage，所以只能在 client 判斷) */
export function LoginGate({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = isClient && isLoggedIn();

  useEffect(() => {
    if (isClient && !isLoggedIn()) {
      router.replace(`/mock-exam?next=${encodeURIComponent(pathname)}`);
    }
  }, [isClient, pathname, router]);

  if (!allowed) {
    return <PageLoader />;
  }
  return <>{children}</>;
}
