import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const exports = {};
  runInNewContext(ts.transpileModule(readFileSync(new URL(`../../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, { exports, URL, URLSearchParams, require: (name) => mocks[name] ?? require(name) });
  return exports;
}
const search = load("src/lib/search.ts");
const grouping = load("src/lib/knowledge/search-results.ts");
const matcher = load("src/lib/knowledge/search-matching.ts", { "../search": search });
const sitting = load("src/lib/sitting-filter.ts");
const highlight = load("src/components/search/HighlightText.tsx", { "@/lib/search": search });
const snippet = load("src/components/search/MatchSnippet.tsx");
const { QuestionResults } = load("src/components/search/QuestionResults.tsx", {
  "./HighlightText": highlight,
  "./MatchSnippet": snippet,
  "@/components/quiz/QuestionCard": { QuestionCard: (props) => React.createElement("div", { "data-browse": String(props.browseMode), "data-shuffle": String(props.shuffleOptions) }, props.question.explanation_text) },
});

test("question results use native details and always expose answers without a quiz switch", () => {
  const item = { question: { id: "q1", stem: "糖尿病的診斷？", answer: "B", source_text: "115-1-內外-1", explanation_text: "完整解答" }, chapterLabel: "內外 Ch07", questionHref: "/chapters/42?view=quiz#question-q1" };
  const html = renderToStaticMarkup(React.createElement(QuestionResults, { items: [item, { ...item, question: { ...item.question, id: "q2" } }], isLoggedIn: false, query: "糖尿病" }));
  assert.equal((html.match(/<details\b/g) ?? []).length, 2);
  assert.equal((html.match(/<summary\b/g) ?? []).length, 2);
  assert.doesNotMatch(html, /小測驗|題目顯示方式/);
  assert.match(html, /答案：B/);
  assert.equal((html.match(/data-browse="true"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /data-browse="false"/);
  assert.match(html, /href="\/chapters\/42\?view=quiz#question-q1"/);
  assert.match(html, /前往此題（科目章節）/);
  assert.match(renderToStaticMarkup(React.createElement(QuestionResults, { items: [item], isLoggedIn: false })), /<details[^>]*\bopen=""/);
});

test("knowledge results distinguish an article from a nested section and highlight both paths", () => {
  const { KnowledgeResultList } = load("src/components/search/KnowledgeResultList.tsx", {
    "./HighlightText": highlight,
    "./MatchSnippet": snippet,
    "@/lib/search": search,
    "@/lib/knowledge/search-results": grouping,
    "@/lib/knowledge/types": { CATEGORY_LABELS: { disease: "疾病" } },
    "@/lib/knowledge": { knowledgeIndex: { sections: { "diabetes#diagnosis": { articleTitle: "糖尿病", path: [] } } } },
  });
  const html = renderToStaticMarkup(React.createElement(KnowledgeResultList, {
    groups: grouping.groupKnowledgeResults([{ k: "diabetes", t: "糖尿病", c: "disease", d: "endocrine" }, { k: "diabetes#diagnosis", t: "診斷標準", c: "disease", d: "endocrine" }], {
      articles: { diabetes: { title: "糖尿病", category: "disease", system: "endocrine" } },
      sections: { "diabetes#diagnosis": { title: "診斷標準", path: ["診斷與評估"] } },
    }),
    domainName: new Map([["endocrine", "內分泌與代謝"]]), state: { q: "糖尿病", scope: "knowledge" },
  }));
  const text = html.replace(/<[^>]+>/g, "");
  assert.match(text, /2 項符合/);
  assert.match(text, /段落/);
  assert.match(text, /內分泌與代謝 › 疾病/);
  assert.match(text, /診斷與評估/);
  assert.match(text, /診斷標準/);
  assert.equal((text.match(/糖尿病/g) ?? []).length, 1);
  assert.equal((html.match(/<a\b/g) ?? []).length, 2);
  assert.equal((html.match(/<mark\b/g) ?? []).length, 1);
});

test("table return links preserve the search page and reject external return destinations", () => {
  const state = { q: "糖尿病", scope: "tables", subject: "07_內外", page: 2 };
  const target = new URL(search.withSearchReturn("/tables/knowledge/kb-example", state), "http://localhost");
  assert.equal(target.searchParams.get("returnTo"), search.searchHref(state));
  assert.equal(search.searchReturnHref(target.searchParams.get("returnTo")), search.searchHref(state));
  for (const invalid of ["https://evil.test", "//evil.test", "/search-other", "/search?x=1\n", "/search?x=\\evil"]) assert.equal(search.searchReturnHref(invalid), "/search");
});

function splitLogic(text) {
  let depth = 0;
  let start = 0;
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") depth--;
    else if (text[i] === "," && depth === 0) { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  return parts;
}
function evaluateLogic(expression, row) {
  if (!expression) return true;
  for (const operator of ["and", "or"]) {
    if (expression.startsWith(`${operator}(`)) {
      const parts = splitLogic(expression.slice(operator.length + 1, -1));
      return operator === "and" ? parts.every((p) => evaluateLogic(p, row)) : parts.some((p) => evaluateLogic(p, row));
    }
  }
  const [field, operator, expected] = expression.split(".");
  const actual = String(row[field]);
  if (operator === "eq") return actual === expected;
  if (operator === "gt") return actual > expected;
  if (operator === "gte") return actual >= expected;
  if (operator === "lt") return actual < expected;
  if (operator === "lte") return actual <= expected;
  throw new Error(`Unexpected clause: ${expression}`);
}

test("database sitting boundaries agree with existing reading filters, including makeup exams", () => {
  const keys = [undefined, "106-1", "106-2", "106-2m", "107-1"];
  for (const from of keys) for (const to of keys) {
    if (from && to && from > to) continue;
    for (const exam_sitting of ["105-3", "106-1", "106-2", "107-1", "115-2"]) for (const is_makeup of [false, true]) {
      const row = { exam_sitting, is_makeup };
      assert.equal(evaluateLogic(search.sittingSearchClause(from, to), row), sitting.matchesSitting(row, { from: from ?? null, to: to ?? null }));
    }
  }
  assert.equal(search.sittingSearchClause("bad,value", "not-a-date"), null);
});


test("an article name or ancestor in the breadcrumb never creates a section or table hit", () => {
  const entry = { k: "diabetes", t: "糖尿病", s: "DM Diabetes mellitus", b: "", c: "disease", d: "endocrine" };
  assert.ok(matcher.matchKnowledgeEntry(entry, "糖尿病"));
  assert.ok(matcher.matchKnowledgeEntry(entry, "DM"));
  assert.equal(matcher.matchKnowledgeEntry({ ...entry, k: "diabetes#causes", t: "病因", s: "糖尿病 › 診斷", b: "胰島功能變化" }, "糖尿病"), null);
  assert.equal(matcher.matchKnowledgeEntry({ ...entry, k: "diabetes#table-kb-values", tableId: "kb-values", t: "糖尿病｜參考值", s: "糖尿病", b: "血糖正常範圍" }, "糖尿病"), null);
  const ownBody = matcher.matchKnowledgeEntry({ ...entry, k: "diabetes#diagnosis", t: "診斷標準", s: "糖尿病", b: "糖尿病需確認血糖" }, "糖尿病");
  assert.ok(ownBody);
  assert.equal(ownBody.result.snippet[1], "糖尿病");
  assert.equal(matcher.matchKnowledgeEntry(entry, "糖尿病", "body"), null);
});

test("grouping retains context only for true hits and article paging never splits a group's matches", () => {
  const results = Array.from({ length: 5 }, (_, i) => ({ k: `diabetes#s${i}`, t: `命中段落 ${i}`, c: "disease", d: "endocrine" }));
  const index = {
    articles: { diabetes: { title: "糖尿病", system: "endocrine", category: "disease" } },
    sections: Object.fromEntries(results.map((entry) => [entry.k, { title: entry.t, path: ["父層（僅供定位）"] }])),
  };
  const groups = grouping.groupKnowledgeResults([...results, results[0]], index);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].matchCount, 5);
  assert.equal(groups[0].children[0].hit, undefined);
  const partition = grouping.partitionKnowledgeTree(groups[0].children);
  const keys = (nodes) => nodes.flatMap((node) => [...(node.hit ? [node.key] : []), ...keys(node.children)]);
  assert.equal(keys(partition.preview).length, 3);
  assert.equal(keys(partition.remaining).length, 2);
  assert.equal(new Set([...keys(partition.preview), ...keys(partition.remaining)]).size, 5);
  assert.equal(search.pageOf(groups, 1, 1).items[0].matchCount, 5);
  const parentOnly = grouping.groupKnowledgeResults([{ k: "diabetes", t: "糖尿病", c: "disease", d: "endocrine" }], index);
  assert.equal(parentOnly[0].children.length, 0);
});

test("a matching table stays under its owning section without making the section a hit", () => {
  const table = { k: "diabetes#table-kb-diagnosis", tableId: "kb-diagnosis", t: "糖尿病｜診斷標準表", s: "糖尿病", c: "disease", d: "endocrine" };
  const groups = grouping.groupKnowledgeResults([table], {
    articles: { diabetes: { title: "糖尿病", system: "endocrine", category: "disease" } },
    sections: { "diabetes#evaluation": { title: "診斷與評估", path: [] } },
  }, { "kb-diagnosis": { sectionId: "evaluation" } });
  assert.equal(groups[0].matchCount, 1);
  assert.equal(groups[0].children[0].title, "診斷與評估");
  assert.equal(groups[0].children[0].hit, undefined);
  assert.equal(groups[0].children[0].children[0].hit.tableId, "kb-diagnosis");
  assert.equal(groups[0].children[0].children[0].title, "診斷標準表");
});

test("exact article titles precede partial names, section titles and body-only matches", () => {
  const base = { s: "", b: "", c: "disease", d: "endocrine" };
  const entries = [
    { ...base, k: "body", t: "其他疾病", b: "糖尿病是危險因子" },
    { ...base, k: "other#section", t: "糖尿病" },
    { ...base, k: "foot", t: "糖尿病足" },
    { ...base, k: "diabetes", t: "糖尿病" },
  ];
  const ranked = entries.map((entry) => matcher.matchKnowledgeEntry(entry, "糖尿病")).sort((a, b) => a.rank - b.rank);
  assert.deepEqual(ranked.map((hit) => hit.result.k), ["diabetes", "foot", "other#section", "body"]);
});

test("search reading state preserves position and details separately for each complete search", () => {
  const memory = load("src/lib/search-reading-state.ts");
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const original = "/search?q=diabetes&scope=knowledge&page=2&result=body";
  const state = { y: 1420, open: ["knowledge:diabetes", "question:115-1_MS_001"], restore: true };
  memory.saveSearchReading(storage, original, state);
  assert.deepEqual(JSON.parse(JSON.stringify(memory.loadSearchReading(storage, "/search?result=body&page=2&scope=knowledge&q=diabetes"))), state);
  assert.equal(memory.loadSearchReading(storage, "/search?q=diabetes&scope=knowledge&page=1&result=body"), null);
  assert.equal(memory.loadSearchReading(storage, "/search?q=diabetes&scope=knowledge&page=2&result=tables"), null);
  memory.saveSearchReading(storage, original, { ...state, restore: false });
  assert.equal(memory.loadSearchReading(storage, original).restore, false);
  assert.equal(memory.searchReadingKey("/search?scope=all&q=DM&page=1&subject="), memory.searchReadingKey("/search?q=DM"));
});

test("reading state tolerates blocked storage and discards old searches after twelve entries", () => {
  const memory = load("src/lib/search-reading-state.ts");
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(memory.loadSearchReading(blocked, "/search?q=DM"), null);
  assert.doesNotThrow(() => memory.saveSearchReading(blocked, "/search?q=DM", { y: 10, open: [], restore: true }));
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  for (let i = 0; i < 15; i++) memory.saveSearchReading(storage, `/search?q=term${i}`, { y: i, open: [], restore: true });
  assert.equal(memory.loadSearchReading(storage, "/search?q=term0"), null);
  assert.equal(memory.loadSearchReading(storage, "/search?q=term14").y, 14);
});
