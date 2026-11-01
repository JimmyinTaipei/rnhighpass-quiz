import assert from "node:assert/strict";
import { test } from "node:test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import { visit } from "unist-util-visit";
import { transformTableContainer, buildTableIndex } from "./knowledge-tables.mjs";

function compile(markdown) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkDirective).parse(markdown);
  const errors = [];
  visit(tree, "containerDirective", (node, i, parent) => {
    if (node.name === "table") {
      const table = transformTableContainer(node, (error) => errors.push(error));
      if (table) parent.children[i] = table;
    } else node.data = { hName: "aside" };
  });
  return { root: unified().use(remarkRehype).runSync(tree), errors };
}
const source = (id, title = "比較表") => `:::table{#${id} title="${title}"}\n\n| 項目 | 說明 |\n|:---|---:|\n| **粗體** | [連結](https://example.com) |\n\n:::`;
function article(root, slug = "example") {
  return { file: `${slug}.md`, slug, title: slug, intro: { type: "root", children: [] }, sections: [{ id: "care", content: root, children: [] }] };
}

test("table identity and rich cell formatting survive conversion", () => {
  const { root, errors } = compile(source("kb-test"));
  assert.deepEqual(errors, []);
  const table = root.children[0];
  assert.equal(table.tagName, "table");
  assert.equal(table.properties["data-table-id"], "kb-test");
  const tags = [];
  visit(table, "element", (node) => { tags.push(node.tagName); });
  assert.ok(tags.includes("strong"));
  assert.ok(tags.includes("a"));
  const headers = [];
  visit(table, "element", (node) => { if (node.tagName === "th") headers.push(node); });
  assert.equal(headers[1].properties.align, "right");
});

test("reject invalid identity, missing title, extra contents and multiple tables", () => {
  assert.ok(compile(source("not-namespaced")).errors.length);
  assert.ok(compile(source("kb-test", "")).errors.length);
  assert.ok(compile(source("kb-test").replace("\n\n:::", "\n\nextra\n\n:::")).errors.length);
  assert.ok(compile(source("kb-test").replace("\n\n:::", "\n\n| A |\n|---|\n| B |\n\n:::")).errors.length);
});

test("index rejects unwrapped tables and global duplicate IDs", () => {
  const errors = [];
  const root = compile(source("kb-test")).root;
  buildTableIndex([article(root), article(root, "another")], (...error) => errors.push(error));
  assert.equal(errors.length, 1);
  assert.match(errors[0][1], /重複/);
  buildTableIndex([article(compile("| A |\n|---|\n| B |").root)], (...error) => errors.push(error));
  assert.equal(errors.length, 2);
});

test("inserting and reordering tables preserves each ID and source metadata", () => {
  const first = compile(source("kb-first") + "\n\n" + source("kb-second")).root;
  const next = compile(source("kb-new") + "\n\n" + source("kb-second") + "\n\n" + source("kb-first")).root;
  const fail = (file, reason) => assert.fail(`${file}: ${reason}`);
  const before = buildTableIndex([article(first)], fail);
  const after = buildTableIndex([article(next)], fail);
  assert.deepEqual(before["kb-first"], after["kb-first"]);
  assert.deepEqual(before["kb-second"], after["kb-second"]);
  assert.equal(after["kb-first"].sectionId, "care");
});

test("tables inside callouts keep their identity", () => {
  const { root, errors } = compile(`::::basics[補充]\n\n${source("kb-nested")}\n\n::::`);
  assert.deepEqual(errors, []);
  const index = buildTableIndex([article(root)], (file, reason) => assert.fail(`${file}: ${reason}`));
  assert.equal(index["kb-nested"].articleSlug, "example");
});
