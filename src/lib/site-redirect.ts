import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "./routes";

/** Preserve the browser's origin, not the dev server's 0.0.0.0 bind address. */
export function redirectWithinSite(path: string): NextResponse {
  return new NextResponse(null, {
    status: 307,
    headers: { Location: safeNextPath(path) },
  });
}

/** Next's proxy requires absolute redirects; recover the local browser host only for dev bind URLs. */
export function redirectFromProxy(path: string, request: NextRequest): NextResponse {
  const target = new URL(safeNextPath(path), request.url);
  if (process.env.NODE_ENV === "development" && ["0.0.0.0", "[::]"].includes(target.hostname)) {
    const host = request.headers.get("host");
    if (host) {
      try {
        const browser = new URL(`${target.protocol}//${host}`);
        const local = browser.hostname === "localhost" || browser.hostname === "127.0.0.1" || browser.hostname.endsWith(".local") ||
          /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(browser.hostname);
        if (local && !browser.username && !browser.password && browser.pathname === "/" && !browser.search && !browser.hash) {
          target.host = browser.host;
        }
      } catch {
        // Malformed or external Host headers cannot override the request origin.
      }
    }
  }
  return NextResponse.redirect(target);
}
