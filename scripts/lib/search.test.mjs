import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const exports = {};
runInNewContext(ts.transpileModule(readFileSync(new URL("../../src/lib/search.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports, URLSearchParams });
const { searchHref, pageOf, pageNumber, searchFilter, matchSnippet } = exports;

const require = createRequire(import.meta.url);
const component = {};
runInNewContext(ts.transpileModule(readFileSync(new URL("../../src/components/search/SearchBox.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, {
  exports: component,
  require: (name) => name === "@/lib/search" ? exports : name === "./SearchExperience" ? { useSearchPending: () => false } : name === "@/lib/question-ref" ? { SOURCE_EXAMPLE: "113-1-基醫-4" } : require(name),
});

test("native search submission carries the typed query and filters before JavaScript is ready", () => {
  for (const state of [
    { scope: "all" },
    { scope: "all", subject: "07_內外", chapter: "42" },
    { scope: "questions", subject: "07_內外", from: "106-2", to: "106-2m" },
    { scope: "knowledge", type: "lab", resultKind: "tables", subject: "07_內外", from: "106-2", to: "106-2m" },
    { scope: "tables", subject: "07_內外" },
  ]) {
    const html = renderToStaticMarkup(React.createElement(component.SearchBox, { ...state, initialQuery: "舊關鍵字" }));
    assert.match(html, /<form\b[^>]*action="\/search"/);
    assert.doesNotMatch(html, /method="post"/);
    const fields = new URLSearchParams();
    for (const input of html.matchAll(/<input\b[^>]*>/g)) {
      const name = input[0].match(/\bname="([^"]*)"/)?.[1];
      const value = input[0].match(/\bvalue="([^"]*)"/)?.[1] ?? "";
      if (name) fields.append(name, value);
    }
    assert.equal(fields.get("q"), "舊關鍵字");
    // A user types into the DOM before hydration; native GET must serialize it.
    fields.set("q", "糖尿病 (DM), 100%_");
    const expected = new URL(searchHref({ ...state, q: fields.get("q") }), "http://localhost");
    assert.deepEqual([...fields].sort(), [...expected.searchParams].sort());
    assert.equal(fields.has("page"), false);
  }
});

test("knowledge result kinds separate tables from pages and require a real body match", () => {
  const article = { b: "血糖偏高，需要追蹤", tableId: undefined };
  const table = { b: "Diabetes diagnostic thresholds", tableId: "kb-diagnosis" };
  const titleOnly = { b: "這一段沒有目標詞" };
  assert.equal(exports.matchesKnowledgeResultKind(article, "pages", "糖"), true);
  assert.equal(exports.matchesKnowledgeResultKind(table, "pages", "糖"), false);
  assert.equal(exports.matchesKnowledgeResultKind(table, "tables", "diabetes"), true);
  assert.equal(exports.matchesKnowledgeResultKind(article, "tables", "糖"), false);
  assert.equal(exports.matchesKnowledgeResultKind(table, "body", "DIABETES"), true);
  assert.equal(exports.matchesKnowledgeResultKind(titleOnly, "body", "糖尿病"), false);
  const state = { q: "糖尿病", scope: "knowledge", type: "lab", resultKind: "tables", page: 2 };
  const url = new URL(searchHref(state), "http://localhost");
  assert.equal(url.searchParams.get("result"), "tables");
  assert.equal(url.searchParams.get("type"), "lab");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(new URL(searchHref({ ...state, scope: "questions" }), "http://localhost").searchParams.has("result"), false);
});

test("paging visits all 31 matches exactly once, with at most 15 per page", () => {
  const source = Array.from({ length: 31 }, (_, i) => `question-${i}`);
  const pages = [1, 2, 3].map((page) => pageOf(source, page));
  assert.deepEqual(pages.map((p) => p.items.length), [15, 15, 1]);
  assert.deepEqual(pages.flatMap((p) => p.items), source);
  assert.equal(pageOf(source, 999).page, 3);
  assert.equal(pageOf([], 999).page, 1);
  for (const invalid of ["-2", "0", "1.5", "NaN", "Infinity", "1e99"]) assert.equal(pageNumber(invalid), 1);
});

test("page links preserve subject and chapter; a knowledge switch removes unrelated ranges", () => {
  const state = { q: "糖尿病 (DM), 100%_", scope: "questions", subject: "07_內外", chapter: "42", page: 2 };
  const link = new URL(searchHref(state), "http://localhost");
  assert.equal(link.searchParams.get("q"), state.q);
  assert.equal(link.searchParams.get("subject"), state.subject);
  assert.equal(link.searchParams.get("chapter"), "42");
  assert.equal(link.searchParams.get("page"), "2");
  const knowledge = new URL(searchHref({ ...state, scope: "knowledge", type: "lab", page: 1 }), "http://localhost");
  assert.equal(knowledge.searchParams.has("subject"), false);
  assert.equal(knowledge.searchParams.has("chapter"), false);
  assert.equal(knowledge.searchParams.has("page"), false);
  assert.equal(knowledge.searchParams.get("type"), "lab");
});

test("commas, parentheses, quotes and wildcard characters remain literal filter values", () => {
  const query = 'a,b(c)"d\\e%_';
  const filter = searchFilter(["stem", "key_point"], query);
  // Each field value must stay a single quoted PostgREST literal.
  const parts = filter.match(/(?:stem|key_point)\.ilike\."(?:\\.|[^"\\])*"/g);
  assert.equal(parts?.length, 2);
  assert.equal(parts.join(","), filter);
  const pattern = JSON.parse(parts[0].slice("stem.ilike.".length));
  assert.equal(pattern, '%a,b(c)"d\\\\e\\%\\_%');
});

test("a case-insensitive explanation match keeps the original text and compact context", () => {
  const text = "x".repeat(100) + "Diabetes" + "y".repeat(200);
  const snippet = matchSnippet(text, "diabetes");
  assert.equal(snippet[1], "Diabetes");
  assert.ok(snippet.join("").length < 120);
  assert.equal(matchSnippet(text, "missing"), null);
});

test("every knowledge table has its own searchable title and a unique stable destination", () => {
  const entries = JSON.parse(readFileSync(new URL("../../public/knowledge-data/search.json", import.meta.url), "utf8"));
  const tables = JSON.parse(readFileSync(new URL("../../public/knowledge-data/table-index.json", import.meta.url), "utf8"));
  const tableEntries = entries.filter((e) => e.tableId);
  assert.equal(tableEntries.length, Object.keys(tables).length);
  assert.equal(new Set(tableEntries.map((e) => e.tableId)).size, tableEntries.length);
  for (const entry of tableEntries) {
    assert.equal(entry.t, tables[entry.tableId].title);
    assert.ok(entry.b.trim());
  }
});
