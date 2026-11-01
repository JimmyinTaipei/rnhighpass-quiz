import { visit } from "unist-util-visit";

export const TABLE_ID_RE = /^kb-[a-z0-9][a-z0-9-]{0,115}$/;

/** Keep identity on the table itself, so embeds retain the original identity. */
export function transformTableContainer(node, fail) {
  const { id, title } = node.attributes ?? {};
  if (!TABLE_ID_RE.test(id ?? "")) fail("表格 id 必須是 kb- 開頭的小寫英數與 -，最多 119 字");
  if (typeof title !== "string" || !title.trim()) fail("表格缺少 title");
  if (node.children.length !== 1 || node.children[0].type !== "table") {
    fail(":::table 必須只包含一張 Markdown 表格");
    return;
  }
  const table = node.children[0];
  table.data = {
    ...table.data,
    hProperties: { "data-table-id": id, "data-table-title": title?.trim() },
  };
  return table;
}

export function buildTableIndex(articles, fail) {
  const index = {};
  for (const article of articles) {
    const scan = (root, sectionId) => visit(root, "element", (node) => {
      if (node.tagName !== "table") return;
      const id = node.properties["data-table-id"];
      const title = node.properties["data-table-title"];
      if (!TABLE_ID_RE.test(String(id ?? "")) || !title) {
        fail(article.file, "每張表格都必須用 :::table{#kb-唯一名稱 title=\"表格名稱\"} 包住");
        return;
      }
      if (index[id]) {
        fail(article.file, `表格 id「${id}」與 ${index[id].articleSlug} 重複`);
        return;
      }
      index[id] = { id, title, articleSlug: article.slug, articleTitle: article.title, sectionId };
    });
    scan(article.intro, null);
    const walk = (sections) => {
      for (const section of sections) {
        scan(section.content, section.id);
        walk(section.children);
      }
    };
    walk(article.sections);
  }
  return index;
}
