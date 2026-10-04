#!/usr/bin/env node
// ⚠ 已停用(2026-10):頁尾國考常考點改為合併進頁首「重點摘要」,見 scripts/merge-exam-points.mjs 與 docs/positioning.md。
//   這支腳本做的是相反方向(分散到各段落),不要再跑。
//
// 把頁面底部「## 國考常考點」callout 的每一條,建議搬到最相關段落的結尾。
//
//   node scripts/suggest-exam-points.mjs                      產生審閱檔 docs/exam-points-review/<系統>.md(不改 content/)
//   node scripts/suggest-exam-points.mjs --apply --only <slug|系統id>   依審閱檔實際改寫 .md(預設是 dry-run,不加 --apply 只印出會做什麼)
//
// 審閱檔每條長這樣:
//   ### b03 → regulation   (信心:高;備選:bp-components、influencing-factors)  <!--h:1a2b3c-->
//   > 條文原文
// 要改放別的段落,把箭頭後的 id 換掉;填 keep 表示留在頁面底部。<!--h:...--> 是條文的雜湊,
// apply 時用來確認條文沒被改過,請不要刪。
//
// 搬動規則:
//   - 放到目標段落「自己的內容」結尾(H2 底下若有 H3,放在整個 H2 的結尾),在該段的 ::questions 之前。
//   - 目標段落已經有 :::exam 就把條文接在裡面,沒有就新增 :::exam[國考重點]。
//   - 底部的 callout 搬空後,H2 改名「歷年考題」(::questions 還在底下),錨點 #exam-points 保留。
//   - callout 裡有條列以外的內容(巢狀 :::note 等)的頁面一律跳過,請手動處理。
// 比對方式:條文的粗體詞、英文詞與中文雙字詞,對各段落文字計分(稀有詞權重高、標題命中加倍)。分數太低的建議 keep。

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content/knowledge");
const OUT = path.join(ROOT, "docs/exam-points-review");
const index = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/knowledge/index.json"), "utf8"));
const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/knowledge/taxonomy.json"), "utf8"));
const domainName = new Map(taxonomy.domains.map((d) => [d.id, d.name]));

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const MIN_SCORE = 3; // 低於這個分數建議 keep
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 6);
const plain = (s) => s.replace(/\*\*|\[\[|\]\]|[`_]/g, "").replace(/\{#[\w-]+\}/g, "");

// ---------- 解析 ----------

function fileOf(slug) {
  const cat = index.articles[slug].category;
  return path.join(CONTENT, cat, `${slug}.md`);
}

/** 回傳 { lines, sections, exam }。exam=null 表示沒有底部考點區;exam.complex 表示不能自動處理 */
function parse(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let i = 0;
  if (lines[0] === "---") {
    i = lines.indexOf("---", 1) + 1;
  }
  const heads = [];
  let fence = false;
  for (let n = i; n < lines.length; n++) {
    if (/^```/.test(lines[n])) fence = !fence;
    if (fence) continue;
    const m = lines[n].match(/^(#{2,3}) (.*?)(?: \{#([\w-]+)\})?\s*$/);
    if (m) heads.push({ level: m[1].length, title: m[2], id: m[3] ?? null, line: n });
  }
  for (let k = 0; k < heads.length; k++) {
    const h = heads[k];
    h.ownEnd = heads[k + 1]?.line ?? lines.length;
    let j = k + 1;
    while (j < heads.length && heads[j].level > h.level) j++;
    h.subtreeEnd = heads[j]?.line ?? lines.length;
    h.hasChildren = h.level === 2 && heads[k + 1]?.level === 3 && heads[k + 1].line < h.subtreeEnd;
  }
  const examHead = heads.find((h) => h.id === "exam-points");
  let exam = null;
  if (examHead) {
    const body = lines.slice(examHead.line + 1, examHead.ownEnd);
    const open = body.findIndex((l) => /^:::exam/.test(l));
    exam = { head: examHead, bullets: [], complex: false, open: -1, close: -1 };
    if (open >= 0) {
      let close = -1;
      for (let n = open + 1; n < body.length; n++) {
        if (/^:::\s*$/.test(body[n])) {
          close = n;
          break;
        }
      }
      exam.open = examHead.line + 1 + open;
      exam.close = examHead.line + 1 + close;
      const inner = lines.slice(exam.open + 1, exam.close);
      if (close < 0 || inner.some((l) => /^:::/.test(l))) exam.complex = true;
      let cur = null;
      for (const l of inner) {
        if (/^- /.test(l)) {
          cur = [l];
          exam.bullets.push(cur);
        } else if (/^\s+\S/.test(l) && cur) cur.push(l);
        else if (l.trim() === "") continue;
        else exam.complex = true;
      }
      exam.bullets = exam.bullets.map((b) => b.join("\n"));
    } else exam.complex = true;
  }
  const sections = heads.filter((h) => h.id && h.id !== "exam-points");
  return { lines, sections, exam };
}

// ---------- 計分 ----------

function termsOf(bullet) {
  const out = new Map(); // term → weight
  const add = (t, w) => t.length >= 2 && out.set(t, Math.max(out.get(t) ?? 0, w));
  for (const m of bullet.matchAll(/\*\*(.+?)\*\*/g)) add(plain(m[1]).toLowerCase(), 3);
  const p = plain(bullet).toLowerCase();
  for (const m of p.matchAll(/[a-z][a-z0-9-]{2,}/g)) add(m[0], 2);
  for (const run of p.match(/[一-鿿]+/g) ?? []) {
    for (let k = 0; k + 2 <= run.length; k++) add(run.slice(k, k + 2), 1);
  }
  return out;
}

function scoreAll(sections, lines, bullets) {
  const texts = sections.map((s) =>
    plain(lines.slice(s.line + 1, s.ownEnd).filter((l) => !/^::questions/.test(l)).join("\n")).toLowerCase(),
  );
  const titles = sections.map((s) => plain(s.title).toLowerCase());
  const N = sections.length;
  const dfCache = new Map();
  const df = (t) => {
    if (!dfCache.has(t)) dfCache.set(t, texts.filter((x, k) => x.includes(t) || titles[k].includes(t)).length);
    return dfCache.get(t);
  };
  return bullets.map((b) => {
    const terms = termsOf(b);
    const scores = sections.map((s, k) => {
      let sum = 0;
      for (const [t, w] of terms) {
        const d = df(t);
        if (d === 0) continue;
        const idf = Math.log(1 + N / d);
        if (texts[k].includes(t)) sum += w * idf;
        if (titles[k].includes(t)) sum += w * idf;
      }
      return sum;
    });
    return scores;
  });
}

// ---------- 審閱檔 ----------

function suggest() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const bySystem = new Map();
  const skipped = [];
  for (const slug of Object.keys(index.articles).sort()) {
    const { lines, sections, exam } = parse(fileOf(slug));
    if (!exam) continue;
    if (exam.complex || exam.bullets.length === 0) {
      skipped.push(slug);
      continue;
    }
    const all = scoreAll(sections, lines, exam.bullets);
    let md = `## ${slug} ${index.articles[slug].title}(${exam.bullets.length} 條)\n\n`;
    md += `可選段落:${sections.map((s) => `${s.id}${s.level === 3 ? "(H3)" : ""}`).join("、")}\n\n`;
    exam.bullets.forEach((b, n) => {
      const ranked = all[n].map((sc, k) => ({ sc, s: sections[k] })).sort((x, y) => y.sc - x.sc);
      const top = ranked[0];
      const second = ranked[1];
      const keep = !top || top.sc < MIN_SCORE;
      const conf = keep ? "低" : top.sc >= 6 && top.sc >= 1.4 * (second?.sc ?? 0) ? "高" : "中";
      const alt = ranked
        .slice(keep ? 0 : 1, keep ? 3 : 4)
        .filter((r) => r.sc > 0)
        .map((r) => `${r.s.id} ${r.sc.toFixed(1)}`)
        .join("、");
      md += `### b${String(n + 1).padStart(2, "0")} → ${keep ? "keep" : top.s.id}   (信心:${conf}${keep ? "" : ` ${top.sc.toFixed(1)} ${top.s.title}`};備選:${alt || "無"})  <!--h:${hash(b)}-->\n`;
      md += b.split("\n").map((l) => `> ${l}`).join("\n") + "\n\n";
    });
    const sys = index.articles[slug].system;
    bySystem.set(sys, (bySystem.get(sys) ?? "") + md);
  }
  for (const [sys, md] of bySystem) {
    const head = `# 國考常考點分散建議:${domainName.get(sys) ?? sys}\n\n由 scripts/suggest-exam-points.mjs 產生。把 \`→\` 後的段落 id 改成你要的(\`keep\` = 留在底部);確認後執行\n\`node scripts/suggest-exam-points.mjs --apply --only <slug|${sys}>\`。\n\n`;
    fs.writeFileSync(path.join(OUT, `${sys}.md`), head + md);
  }
  const total = [...bySystem.values()].reduce((n, m) => n + (m.match(/^### b\d+/gm) ?? []).length, 0);
  console.log(`審閱檔:${bySystem.size} 份,共 ${total} 條建議 → ${path.relative(ROOT, OUT)}/`);
  if (skipped.length) console.log(`略過(callout 含條列以外的內容,請手動處理)${skipped.length} 頁:${skipped.join("、")}`);
}

// ---------- 套用 ----------

function readReview(sys) {
  const file = path.join(OUT, `${sys}.md`);
  if (!fs.existsSync(file)) return null;
  const pages = new Map();
  let cur = null;
  for (const l of fs.readFileSync(file, "utf8").split("\n")) {
    const h = l.match(/^## (\S+) /);
    if (h) {
      cur = new Map();
      pages.set(h[1], cur);
      continue;
    }
    const b = l.match(/^### b(\d+) → (\S+)\s.*<!--h:(\w+)-->/);
    if (b && cur) cur.set(Number(b[1]), { target: b[2], hash: b[3] });
  }
  return pages;
}

/** 目標段落結尾的插入位置:自己內容(或 H2 整串)的結尾,略過尾端空行與 ::questions */
function insertionPoint(lines, s) {
  let end = s.hasChildren ? s.subtreeEnd : s.ownEnd;
  while (end - 1 > s.line && (lines[end - 1].trim() === "" || /^::questions/.test(lines[end - 1]))) end--;
  return end;
}

function applyPage(slug, assignments) {
  const file = fileOf(slug);
  const { lines, sections, exam } = parse(file);
  if (!exam || exam.complex) return { slug, moved: 0, note: "略過(callout 含條列以外的內容)" };
  const byId = new Map(sections.map((s) => [s.id, s]));
  const moves = new Map(); // section id → bullets
  const moved = new Set();
  const errors = [];
  exam.bullets.forEach((b, n) => {
    const a = assignments.get(n + 1);
    if (!a || a.target === "keep" || a.target === "skip") return;
    if (a.hash !== hash(b)) return errors.push(`b${n + 1} 條文已和審閱檔不同,請重跑建議`);
    if (!byId.has(a.target)) return errors.push(`b${n + 1} 目標「${a.target}」不存在`);
    (moves.get(a.target) ?? moves.set(a.target, []).get(a.target)).push(b);
    moved.add(n);
  });
  if (errors.length) return { slug, moved: 0, note: errors.join(";") };
  if (moved.size === 0) return { slug, moved: 0, note: "沒有要搬的條文" };

  // 由後往前改,行號才不會位移。每一筆是 { at, del, insert }
  const edits = [];
  const remaining = exam.bullets.filter((_, n) => !moved.has(n));
  if (remaining.length === 0) {
    // 整個 callout 刪掉(連同後面一個空行),H2 改名
    edits.push({ at: exam.open, del: exam.close - exam.open + 1 + (lines[exam.close + 1]?.trim() === "" ? 1 : 0), insert: [] });
    edits.push({ at: exam.head.line, del: 1, insert: ["## 歷年考題 {#exam-points}"] });
  } else {
    edits.push({ at: exam.open + 1, del: exam.close - exam.open - 1, insert: remaining.flatMap((b) => b.split("\n")) });
  }
  for (const [id, bullets] of moves) {
    const s = byId.get(id);
    const lastLines = bullets.flatMap((b) => b.split("\n"));
    const own = lines.slice(s.line + 1, s.ownEnd);
    const open = own.findIndex((l) => /^:::exam/.test(l));
    const close = open >= 0 ? own.findIndex((l, k) => k > open && /^:::\s*$/.test(l)) : -1;
    if (open >= 0 && close > open) {
      edits.push({ at: s.line + 1 + close, del: 0, insert: lastLines });
    } else {
      const at = insertionPoint(lines, s);
      edits.push({ at, del: 0, insert: ["", ":::exam[國考重點]", ...lastLines, ":::"] });
    }
  }
  edits.sort((a, b) => b.at - a.at);
  for (const e of edits) lines.splice(e.at, e.del, ...e.insert);
  if (APPLY) fs.writeFileSync(file, lines.join("\n"));
  return { slug, moved: moved.size, note: `${moves.size} 個段落` };
}

function apply() {
  if (!ONLY) {
    console.error("請用 --only <slug|系統id> 指定範圍(一次只改一部分,方便逐篇審 git diff)");
    process.exit(1);
  }
  const slugs = index.articles[ONLY]
    ? [ONLY]
    : Object.values(index.articles).filter((a) => a.system === ONLY).map((a) => a.slug);
  if (slugs.length === 0) {
    console.error(`找不到 slug 或系統:${ONLY}`);
    process.exit(1);
  }
  let total = 0;
  for (const slug of slugs.sort()) {
    const review = readReview(index.articles[slug].system)?.get(slug);
    if (!review) continue;
    const r = applyPage(slug, review);
    if (r.moved || r.note !== "沒有要搬的條文") console.log(`${APPLY ? "已改寫" : "dry-run"} ${slug}:搬 ${r.moved} 條(${r.note})`);
    total += r.moved;
  }
  console.log(`${APPLY ? "完成" : "dry-run 結束(加 --apply 才會寫入)"}:共 ${total} 條。接著跑 node scripts/build-knowledge.mjs 驗證。`);
}

if (APPLY || args.includes("--dry-run")) apply();
else suggest();
