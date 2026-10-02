#!/usr/bin/env node
// 列出「想打好基礎」的候選概念,只輸出審閱檔,不改任何 .md。
//
//   node scripts/suggest-basics.mjs      → docs/basics-candidates.md
//
// 兩種來源:
//   A. 已經有現成段落:兩頁以上連到(或嵌入)同一個解剖&生理頁/段落 → 可直接 ![[slug#id|basics]]
//   B. 還沒有頁面:藥理頁內文出現、跨兩頁以上的機轉名詞(酵素、受體、通道、轉運蛋白…)
//      → 需要新寫的基礎內容。名詞清單是規則比對,會有雜訊,請審閱。
// 段落超過約 8 行(與 build-knowledge.mjs 的 BASICS_SECTION_WARN_CHARS 相同)會標 ⚠ 過長。
//
// 須先跑過 node scripts/build-knowledge.mjs(讀 src/data/knowledge/)。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/knowledge");
const OUT = path.join(ROOT, "docs/basics-candidates.md");
// 與 build-knowledge.mjs 相同:約 8 行
const BASICS_SECTION_WARN_CHARS = 320;

const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
const search = JSON.parse(fs.readFileSync(path.join(DATA, "search.json"), "utf8"));
const articles = index.articles;
const bodyOf = new Map(search.map((e) => [e.k, e.b ?? ""]));

const title = (key) => {
  const [slug, id] = key.split("#");
  return id ? `${articles[slug]?.title}〉${index.sections[key]?.title ?? id}` : articles[slug]?.title;
};
/** 段落全文長度(含子段落):search.json 每個知識點一筆,子段落以 key 前綴判斷不可靠,改用 sections 的 path */
function sectionLength(key) {
  const [slug, id] = key.split("#");
  if (!id) return null;
  const own = bodyOf.get(key) ?? "";
  const s = index.sections[key];
  if (!s) return own.length;
  let len = own.length;
  for (const [k, sec] of Object.entries(index.sections)) {
    if (k.startsWith(`${slug}#`) && k !== key && sec.path.includes(s.title) && sec.path.at(-1) !== undefined) {
      len += (bodyOf.get(k) ?? "").length;
    }
  }
  return len;
}

// ---------- A. 已有現成段落 ----------
const phys = new Set(Object.values(articles).filter((a) => a.category === "physiology").map((a) => a.slug));
const users = new Map(); // target → Set(slug)
const addUse = (target, from) => {
  const slug = target.split("#")[0];
  if (!phys.has(slug) || from === slug) return;
  if (!users.has(target)) users.set(target, new Set());
  users.get(target).add(from);
};
for (const [from, outs] of Object.entries(index.links)) for (const t of outs) addUse(t, from.split("#")[0]);
for (const [t, froms] of Object.entries(index.embeds)) for (const f of froms) addUse(t, f.split("#")[0]);
const existing = [...users.entries()]
  .map(([t, s]) => ({ target: t, pages: [...s] }))
  .filter((r) => r.pages.length >= 2)
  .sort((a, b) => b.pages.length - a.pages.length);

// ---------- B. 機轉名詞 ----------
const TERM_PATTERNS = [
  { re: /[A-Za-z][A-Za-z0-9-]*(?:ase)\b/g, kind: "生化" },
  { re: /HMG-CoA|K-ATP|Na⁺\/K⁺-ATPase|PPAR-γ|GLUT\d|SGLT\d|DPP-4|GLP-1|cAMP|AMPK/g, kind: "生化" },
  { re: /[一-鿿A-Za-z0-9₁₂-]{1,8}(?:受體|受器)/g, kind: "生理" },
  { re: /[一-鿿A-Za-z0-9-]{1,6}(?:通道|幫浦|轉運蛋白)/g, kind: "生理" },
  { re: /[一-鿿A-Za-z0-9-]{1,6}(?:酵素|酶)/g, kind: "生化" },
  { re: /(?:近曲小管|遠曲小管|亨利氏環|集尿管|腎元|β 細胞|α 細胞|竇房結|房室結)/g, kind: "解剖" },
];
const NOISE = /^(?:的|與|和|及|或|在|是|為|會|可|不|一定|使用|強力|抑制|受體-)+/;
// 不是機轉的名詞(設備、藥名片段)
const SKIP = /輸液幫浦|腦啡肽酶/;
const terms = new Map(); // term → { kind, pages:Set }
for (const a of Object.values(articles).filter((x) => x.category === "drug")) {
  const text = [...bodyOf.entries()].filter(([k]) => k === a.slug || k.startsWith(`${a.slug}#`)).map(([, b]) => b).join(" ");
  for (const { re, kind } of TERM_PATTERNS) {
    for (const m of text.matchAll(re)) {
      const t = m[0].replace(NOISE, "").trim();
      if (t.length < 3 || SKIP.test(t)) continue;
      if (!terms.has(t)) terms.set(t, { kind, pages: new Set() });
      terms.get(t).pages.add(a.slug);
    }
  }
}
// 已經是解剖&生理頁段落標題的名詞,視為「已有現成段落」
const physTitles = Object.entries(index.sections)
  .filter(([k]) => phys.has(k.split("#")[0]))
  .map(([k, s]) => ({ key: k, title: s.title }));
const newTerms = [...terms.entries()]
  .map(([term, v]) => ({
    term,
    kind: v.kind,
    pages: [...v.pages],
    // 先找標題含此名詞的段落,再找內文提到它的段落(後者標「內文」)
    covered:
      physTitles.find((p) => p.title.includes(term))?.key ??
      (() => {
        const hit = physTitles.find((p) => (bodyOf.get(p.key) ?? "").includes(term));
        return hit ? `${hit.key}(內文)` : undefined;
      })(),
  }))
  .filter((r) => r.pages.length >= 2)
  .sort((a, b) => b.pages.length - a.pages.length || a.term.localeCompare(b.term));

// ---------- 輸出 ----------
let md = `# 想打好基礎:候選概念

由 \`scripts/suggest-basics.mjs\` 產生(重跑會覆蓋)。只是候選,不改任何頁面。

- **A 已有現成段落**:兩頁以上已經連到同一個解剖&生理頁或段落,可直接改寫成 \`![[slug#id|basics]]\`。
- **B 還沒有內容**:藥理頁內文中、跨兩頁以上出現的機轉名詞(規則比對,有雜訊)。要新寫基礎內容時參考。
- ⚠ 過長:段落超過約 8 行(${BASICS_SECTION_WARN_CHARS} 字),收合後展開會太長,考慮縮短、改引用子段落,或為該頁寫 summary 改用整頁引用。

## A. 已有現成段落(${existing.length} 個)

| 段落 | 用到的頁面 | 頁數 | 長度 |
|---|---|---|---|
`;
for (const r of existing) {
  const len = sectionLength(r.target);
  const lenText = len == null ? "整頁" : `${len} 字${len > BASICS_SECTION_WARN_CHARS ? " ⚠ 過長" : ""}`;
  md += `| \`${r.target}\` ${title(r.target)} | ${r.pages.map((s) => articles[s]?.title ?? s).join("、")} | ${r.pages.length} | ${lenText} |\n`;
}
md += `
## B. 還沒有內容的機轉名詞(${newTerms.length} 個,出現在 2 頁以上的藥理頁)

「現成段落」:解剖&生理頁中標題含此名詞的段落;標「(內文)」表示只在段落內文提到,不一定是專門解釋它的段落。

| 名詞 | 建議歸類 | 出現的藥理頁 | 頁數 | 現成段落 |
|---|---|---|---|---|
`;
for (const r of newTerms) {
  md += `| ${r.term} | ${r.kind} | ${r.pages.map((s) => articles[s]?.title ?? s).join("、")} | ${r.pages.length} | ${r.covered ? `\`${r.covered}\`` : "—"} |\n`;
}
md += `
建議歸類是依名詞字尾判斷(酵素/-ase → 生化;受體、通道、轉運蛋白 → 生理;構造名 → 解剖),請以內容為準調整。
`;
fs.writeFileSync(OUT, md);
console.log(`A ${existing.length} 個、B ${newTerms.length} 個 → ${path.relative(ROOT, OUT)}`);
