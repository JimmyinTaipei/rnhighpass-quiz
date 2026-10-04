#!/usr/bin/env node
// 把頁尾「## 國考常考點 {#exam-points}」合併進頁首的「## 重點摘要 {#summary}」(2026-10,docs/positioning.md 第六節)。
//
//   node scripts/merge-exam-points.mjs            dry-run:只印出每頁會怎麼改
//   node scripts/merge-exam-points.mjs --apply    實際改寫 content/knowledge/**/*.md(不含 _templates)
//
// 規則:
//   - 段落拆成兩份:第一個 ::questions 或 H3 之前的內容是「考點」,之後(::questions 與題目分組的 H3)是「考題」。
//   - 考點:去掉外層 :::exam[…] … ::: 外框(裡面有巢狀提示框時保留外框),放到
//     「### 國考常考點 {#exam-points}」底下,接在重點摘要段落的結尾;沒有重點摘要就在第一個 H2 前新增。
//   - 考題:原樣放到頁尾「## 相關考題 {#questions}」(頁面已有 #questions 時改用 #exam-questions),
//     放在原本國考常考點的位置(後面若還有其他 H2,順序不變)。
//   - 段落中間零散的 :::exam 提示框不動。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content/knowledge");
const apply = process.argv.includes("--apply");

const isH2 = (l) => /^## /.test(l);
const isH3plus = (l) => /^###+ /.test(l);

/** 去掉外層 :::exam 外框;外框裡有巢狀 ::: 時不拆(回傳 null 代表保留原樣) */
function unwrapExam(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^:::exam(\[|\s|$)/.test(l)) {
      const end = lines.findIndex((x, k) => k > i && x.trim() === ":::");
      const inner = end > 0 ? lines.slice(i + 1, end) : null;
      if (!inner || inner.some((x) => x.startsWith(":::"))) return null;
      out.push(...inner);
      i = end + 1;
    } else {
      out.push(l);
      i++;
    }
  }
  return out;
}

const trim = (lines) => {
  const a = [...lines];
  while (a.length && !a[0].trim()) a.shift();
  while (a.length && !a.at(-1).trim()) a.pop();
  return a;
};

function processFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  const exStart = lines.findIndex(
    (l) => isH2(l) && l.includes("{#exam-points}"),
  );
  if (exStart < 0) return null;
  let exEnd = lines.findIndex((l, k) => k > exStart && isH2(l));
  if (exEnd < 0) exEnd = lines.length;

  const body = lines.slice(exStart + 1, exEnd);
  const split = body.findIndex(
    (l) => l.startsWith("::questions") || isH3plus(l),
  );
  const pointsRaw = trim(split < 0 ? body : body.slice(0, split));
  const questions = trim(split < 0 ? [] : body.slice(split));

  const unwrapped = unwrapExam(pointsRaw);
  const points = unwrapped ?? pointsRaw;
  const notes = [];
  if (!unwrapped) notes.push(":::exam 裡有巢狀提示框,保留外框");
  if (!points.length) notes.push("沒有考點內容,只搬考題");

  const qid = lines.some(
    (l, k) => (k < exStart || k >= exEnd) && /\{#questions\}/.test(l),
  )
    ? "exam-questions"
    : "questions";

  // 1. 頁尾:國考常考點 → 相關考題(沒有考題就整段刪掉)
  const tail = questions.length
    ? [`## 相關考題 {#${qid}}`, "", ...questions, ""]
    : [];
  let out = [...lines.slice(0, exStart), ...tail, ...lines.slice(exEnd)];

  // 2. 頂端:重點摘要結尾加上國考常考點
  const block = points.length
    ? ["### 國考常考點 {#exam-points}", "", ...points, ""]
    : [];
  const sumStart = out.findIndex((l) => isH2(l) && l.includes("{#summary}"));
  let created = false;
  if (block.length) {
    if (sumStart >= 0) {
      let sumEnd = out.findIndex((l, k) => k > sumStart && isH2(l));
      if (sumEnd < 0) sumEnd = out.length;
      const head = trim(out.slice(0, sumEnd));
      out = [...head, "", ...block, ...out.slice(sumEnd)];
    } else {
      const firstH2 = out.findIndex(isH2);
      const at = firstH2 < 0 ? out.length : firstH2;
      out = [
        ...out.slice(0, at),
        "## 重點摘要 {#summary}",
        "",
        ...block,
        ...out.slice(at),
      ];
      created = true;
    }
  }

  const result = out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n*$/, "\n");
  return {
    file: path.relative(CONTENT, file),
    created,
    points: points.length,
    questions: questions.length,
    qid,
    notes,
    changed: result !== src,
    result,
  };
}

// 也可以直接指定檔案(例如範本):node scripts/merge-exam-points.mjs --apply content/knowledge/_templates/drug.md
const argFiles = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const files = argFiles.length
  ? argFiles.map((f) => path.resolve(f))
  : fs
      .readdirSync(CONTENT, { recursive: true })
      .filter(
        (f) =>
          f.endsWith(".md") &&
          !f.startsWith("_") &&
          !f.includes("/_") &&
          f.includes("/"),
      )
      .map((f) => path.join(CONTENT, f))
      .sort();

let n = 0;
let created = 0;
for (const f of files) {
  const r = processFile(f);
  if (!r) continue;
  n++;
  if (r.created) created++;
  const tag = r.created ? "新增重點摘要" : "併入既有重點摘要";
  console.log(
    `${r.file}: ${tag}、考點 ${r.points} 行、考題 ${r.questions} 行 → #${r.qid}${r.notes.length ? `(${r.notes.join(";")})` : ""}`,
  );
  if (apply && r.changed) fs.writeFileSync(f, r.result);
}
console.log(
  `\n共 ${n} 頁(新增重點摘要 ${created} 頁)。${apply ? "已寫入。" : "dry-run,加 --apply 才會寫入。"}`,
);
