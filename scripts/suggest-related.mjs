#!/usr/bin/env node
// 為疾病頁產生 related 欄位的「建議」,只輸出審閱檔,不改任何 .md。
//
//   node scripts/suggest-related.mjs            → docs/related-review/<system>.md(每個系統一份)
//
// 證據來源(寫在每一條後面,方便你判斷):
//   link×N  疾病頁內文有 N 個段落連到該頁([[slug]])
//   dz      兩頁有相同的 dzTags(題庫疾病標籤)
// 沒有證據的頁面不會出現。已經寫了 related 的疾病頁會標註「已設定」並只列出尚未收錄的候選。
// 審閱後把想要的 slug 抄進該疾病頁 frontmatter 的 related:,再跑 pnpm knowledge:build 驗證。
//
// 須先跑過 node scripts/build-knowledge.mjs(讀 src/data/knowledge/index.json)。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const index = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/knowledge/index.json"), "utf8"));
const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/knowledge/taxonomy.json"), "utf8"));
const OUT = path.join(ROOT, "docs/related-review");
const KEYS = [
  ["lab", "檢驗"],
  ["drug", "藥物"],
  ["pathogen", "病原體"],
  ["physiology", "生理機轉"],
];

function explicitRelated(slug) {
  const file = path.join(ROOT, "content/knowledge/disease", `${slug}.md`);
  const m = fs.readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  return m ? (YAML.parse(m[1]).related ?? null) : null;
}

const linkCounts = (slug) => {
  const counts = {};
  for (const [from, outs] of Object.entries(index.links)) {
    if (from.split("#")[0] !== slug) continue;
    for (const to of new Set(outs.map((t) => t.split("#")[0]))) counts[to] = (counts[to] ?? 0) + 1;
  }
  return counts;
};

const all = Object.values(index.articles);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const d of taxonomy.domains) {
  const diseases = all.filter((a) => a.category === "disease" && a.system === d.id);
  if (diseases.length === 0) continue;
  let md = `# related 建議:${d.name}\n\n由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。\n\n`;
  for (const a of diseases) {
    const explicit = explicitRelated(a.slug);
    const links = linkCounts(a.slug);
    md += `## ${a.title}(${a.slug})${explicit ? " — 已設定" : ""}\n\n`;
    const block = {};
    for (const [key, label] of KEYS) {
      const have = new Set(explicit?.[key] ?? []);
      const cands = all
        .filter((t) => t.category === key && t.slug !== a.slug)
        .map((t) => {
          const ev = [];
          if (links[t.slug]) ev.push(`link×${links[t.slug]}`);
          if (t.dzTags.some((x) => a.dzTags.includes(x))) ev.push("dz");
          return { t, ev };
        })
        .filter((c) => c.ev.length > 0 && !have.has(c.t.slug))
        .sort((x, y) => y.ev.length - x.ev.length || (links[y.t.slug] ?? 0) - (links[x.t.slug] ?? 0));
      if (cands.length === 0) continue;
      block[key] = cands.map((c) => c.t.slug);
      md += `**${label}**\n` + cands.map((c) => `- ${c.t.slug} ${c.t.title}  _(${c.ev.join("、")})_`).join("\n") + "\n\n";
    }
    if (Object.keys(block).length === 0) {
      md += "(沒有候選)\n\n";
      continue;
    }
    md += "```yaml\nrelated:\n" + Object.entries(block).map(([k, v]) => `  ${k}: [${v.join(", ")}]`).join("\n") + "\n```\n\n";
  }
  fs.writeFileSync(path.join(OUT, `${d.id}.md`), md);
}
console.log(`已輸出到 ${path.relative(ROOT, OUT)}/`);
