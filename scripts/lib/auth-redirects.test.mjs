import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import { NextRequest, NextResponse } from "next/server.js";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../", import.meta.url));
function load(file, mocks = {}) {
  const code = ts.transpileModule(readFileSync(resolve(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  runInNewContext(code, {
    exports, URL, process: { env: { NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test", NODE_ENV: "development" } },
    require: (name) => mocks[name] ?? require(name),
  });
  return exports;
}
const routes = load("src/lib/routes.ts");
const redirects = load("src/lib/site-redirect.ts", { "./routes": routes, "next/server": { NextResponse } });
function callback(exchange) {
  return load("src/app/(site)/auth/callback/route.ts", {
    "@/lib/routes": routes,
    "@/lib/site-redirect": redirects,
    "@/lib/supabase-server": { createClient: async () => ({ auth: { exchangeCodeForSession: exchange } }) },
  }).GET;
}
function request(path) {
  return new NextRequest(`http://0.0.0.0:3000${path}`, { headers: { host: "macbook-air.local:3000" } });
}

test("relative redirects retain the browser's .local origin", () => {
  const response = redirects.redirectWithinSite("/mistakes?tab=tables");
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "/mistakes?tab=tables");
  assert.equal(new URL(response.headers.get("location"), "http://macbook-air.local:3000/auth/callback").host, "macbook-air.local:3000");
});

test("external, protocol-relative and control-character targets cannot escape the site", () => {
  for (const target of ["https://evil.example", "//evil.example", "/\\evil.example", "/\t/evil.example", "/\n/evil.example", "/\r/evil.example", "/\u0000/evil.example"]) {
    assert.equal(redirects.redirectWithinSite(target).headers.get("location"), "/", JSON.stringify(target));
  }
  assert.equal(routes.safeNextPath("/search?q=%E8%A1%A8%E6%A0%BC"), "/search?q=%E8%A1%A8%E6%A0%BC");
});

test("successful OAuth exchange redirects to the validated path rather than 0.0.0.0", async () => {
  let calls = 0;
  const GET = callback(async (code) => { assert.equal(code, "test-code"); calls++; return { error: null }; });
  const response = await GET(request("/auth/callback?code=test-code&next=%2Fmistakes%3Ftab%3Dtables"));
  assert.equal(calls, 1);
  assert.equal(response.headers.get("location"), "/mistakes?tab=tables");
});

test("missing or failed OAuth code returns a same-site error page", async () => {
  const missing = await callback(() => assert.fail("must not exchange without a code"))(request("/auth/callback"));
  assert.equal(missing.headers.get("location"), "/?error=auth");
  const failed = await callback(async () => ({ error: new Error("invalid code") }))(request("/auth/callback?code=test-code"));
  assert.equal(failed.headers.get("location"), "/?error=auth");
  const unsafe = await callback(async () => ({ error: null }))(request("/auth/callback?code=test-code&next=%2F%2Fevil.example"));
  assert.equal(unsafe.headers.get("location"), "/");
});

function proxy({ loggedIn = false, mock = false } = {}) {
  return load("src/proxy.ts", {
    "next/server": { NextResponse },
    "@/lib/routes": routes,
    "@/lib/site-redirect": redirects,
    "@/lib/site-mode": { isMockOnly: () => mock },
    "@supabase/ssr": { createServerClient: (_url, _key, options) => ({ auth: { getClaims: async () => {
      options.cookies.setAll([{ name: "test-session", value: "refreshed", options: { path: "/", sameSite: "lax" } }]);
      return { data: { claims: loggedIn ? { sub: "test-user" } : null } };
    } } }) },
  }).proxy;
}

test("protected-page redirects preserve the path and refreshed cookies", async () => {
  const response = await proxy()(request("/mistakes?tab=tables"));
  assert.equal(response.headers.get("location"), "http://macbook-air.local:3000/?next=%2Fmistakes%3Ftab%3Dtables");
  assert.equal(response.cookies.get("test-session")?.value, "refreshed");
});

test("authenticated pages remain accessible and mock-site redirects retain the browser host", async () => {
  const authorized = await proxy({ loggedIn: true })(request("/mistakes"));
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers.get("location"), null);
  assert.equal(authorized.cookies.get("test-session")?.value, "refreshed");
  const mock = await proxy({ mock: true })(request("/subjects"));
  assert.equal(mock.headers.get("location"), "http://macbook-air.local:3000/mock-exam");
});


test("proxy ignores untrusted Host and preserves production request origin", () => {
  const foreign = new NextRequest("http://0.0.0.0:3000/mistakes", { headers: { host: "evil.example" } });
  assert.equal(redirects.redirectFromProxy("/", foreign).headers.get("location"), "http://0.0.0.0:3000/");
  const production = new NextRequest("https://quiz.example/mistakes", { headers: { host: "evil.example" } });
  assert.equal(redirects.redirectFromProxy("/", production).headers.get("location"), "https://quiz.example/");
});
