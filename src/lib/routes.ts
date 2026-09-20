// 路由權限相關的純函式。刻意不 import 任何 server-only 模組，
// 因為 src/proxy.ts (Edge runtime) 與 Server Component 兩邊都要用。

/** 需要登入才能使用的路徑：測驗模式與錯題本/統計。閱讀模式維持公開。 */
export function isProtectedPath(pathname: string): boolean {
  if (pathname === "/quiz" || pathname.startsWith("/quiz/")) return true;
  if (pathname === "/mistakes" || pathname.startsWith("/mistakes/")) return true;
  if (pathname === "/stats" || pathname.startsWith("/stats/")) return true;
  // 章節「閱讀」頁公開，只有它底下的 /quiz 需要登入
  if (pathname.startsWith("/chapters/") && pathname.endsWith("/quiz")) return true;
  return false;
}

/**
 * 把外部傳進來的回跳路徑收斂成「站內相對路徑」。
 *
 * 沒有這層的話 ?next=https://evil.example 會讓登入流程變成 open redirect
 * (原本 auth/callback 是直接 `${origin}${next}` 串接)。
 */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  // 必須是單斜線開頭的相對路徑；'//host' 會被瀏覽器當成 protocol-relative URL
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  // 反斜線在部分瀏覽器等同斜線，一併排除
  if (raw.includes("\\")) return "/";
  return raw;
}

/** 未登入時要導向的位置(首頁 + 記住原本想去哪) */
export function loginRedirectPath(nextPath: string): string {
  const safe = safeNextPath(nextPath);
  return safe === "/" ? "/" : `/?next=${encodeURIComponent(safe)}`;
}
