import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { getDevMode } from "@/lib/dev-mode";
import type { Viewer } from "@/components/viewer/ViewerProvider";

// 目前使用者(登入、名稱、admin、dev mode)。外框與考題卡在瀏覽器端讀這支,
// 讓知識頁可以預先產生成靜態頁,不必每次請求都讀 cookie(docs/deploy-size-plan.md)。
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store" };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    const body: Viewer = { loggedIn: false, displayName: null, admin: false, devMode: false };
    return NextResponse.json(body, { headers: noStore });
  }
  const [admin, devMode] = await Promise.all([isAdmin(), getDevMode()]);
  // 顯示 Google 名稱而不是 email：截圖分享時不會把 email 露出去
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
  const body: Viewer = {
    loggedIn: true,
    displayName: meta?.full_name ?? meta?.name ?? "已登入",
    admin,
    devMode,
  };
  return NextResponse.json(body, { headers: noStore });
}
