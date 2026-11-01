// One-time, idempotent source migration. IDs are authored once, never derived at runtime.
// Dry run by default; --write inserts wrappers without rewriting any table text.
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { toString } from "mdast-util-to-string";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content/knowledge");
const write = process.argv.includes("--write");
let total = 0;
let changed = 0;
function migrate(file) {
  const raw = fs.readFileSync(file, "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) return;
  const meta = YAML.parse(fm[1]);
  const offset = fm[0].length;
  const body = raw.slice(offset);
  const slug = path.basename(file, ".md");
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkDirective).parse(body);
  const edits = [];
  const upgraded = new Set();
  let section = { title: meta.title, id: "intro" };
  const scan = (node, parents = []) => {
    if (node.type === "heading") {
      const text = toString(node);
      const id = text.match(/\{#([a-z0-9-]+)\}\s*$/)?.[1];
      section = { title: text.replace(/\s*\{#[^}]+\}\s*$/, ""), id: id ?? "intro" };
    }
    if (node.type === "table" && !parents.some((p) => p.type === "containerDirective" && p.name === "table")) {
      const id = `kb-${slug}-${section.id}`.slice(0, 100).replace(/-$/, "") + `-${randomUUID().slice(0, 8)}`;
      const headings = node.children[0].children.map(toString).filter(Boolean).join("／");
      const title = `${meta.title}｜${section.title}${headings ? `：${headings}` : ""}`.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label ?? target).slice(0, 200);
      const indent = " ".repeat(node.position.start.column - 1);
      edits.push({ start: offset + node.position.start.offset, end: offset + node.position.start.offset, text: `:::table{#${id} title=${JSON.stringify(title)}}\n\n${indent}` });
      edits.push({ start: offset + node.position.end.offset, end: offset + node.position.end.offset, text: `\n\n${indent}:::` });
      // A table inside a callout needs a longer OUTER fence, per remark-directive.
      for (const parent of parents.filter((p) => p.type === "containerDirective")) {
        if (upgraded.has(parent)) continue;
        upgraded.add(parent);
        const start = offset + parent.position.start.offset;
        const end = offset + parent.position.end.offset;
        const source = raw.slice(start, end);
        const opening = source.match(/^:+/)[0];
        const closing = source.match(/:+\s*$/)[0];
        edits.push({ start, end: start + opening.length, text: `${opening}:` });
        edits.push({ start: end - closing.length, end, text: `:${closing}` });
      }
      total++;
    }
    for (const child of node.children ?? []) scan(child, [...parents, node]);
  };
  scan(tree);
  if (!edits.length) return;
  changed++;
  if (write) {
    let next = raw;
    for (const edit of edits.sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
    fs.writeFileSync(file, next);
  }
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith("_")) walk(file);
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") migrate(file);
  }
}
walk(root);
console.log(`${write ? "已標記" : "待標記"} ${total} 張表格，${changed} 篇文章`);
