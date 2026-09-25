// 知識庫建置:content/knowledge/**/*.md → src/data/knowledge/*.json
//
// 為什麼在建置期就把 Markdown 轉成 JSON:Cloudflare Worker 的 bundle 與 CPU
// 都有限制,執行期只需要把現成的 hast 丟給 hast-util-to-jsx-runtime。連結檢查、
// 反向連結、嵌入次數也都在這裡一次算好,壞連結直接讓 build 失敗。
//
// 語法(見 content/knowledge/README.md):
//   ## 標題 {#id}             每個標題都是可被連結的知識點
//   [[slug]] / [[slug#id|文字]] 行內連結
//   ![[slug#id]]              嵌入(獨立一行),內容只存在來源頁
//   ::questions{tag="" keyword="" ids="" limit=""}   相關考題
//   :::tip[標題] ... :::       提示框(tip / exam / warning / note)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkRehype from "remark-rehype";
import { toString as mdToString } from "mdast-util-to-string";
import { toString as hastToString } from "hast-util-to-string";
import { visit, SKIP } from "unist-util-visit";
import YAML from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content/knowledge");
const OUT_DIR = path.join(ROOT, "src/data/knowledge");
const CREDITS_FILE = path.join(ROOT, "public/knowledge-images/credits.json");

const CATEGORIES = ["disease", "physiology", "drug", "lab"];
const CALLOUTS = ["tip", "exam", "warning", "note"];
const SUMMARY_LEN = 110;
const BLOCK_SEPARATORS = new Set(["p", "li", "tr", "td", "th", "k-callout"]);

const errors = [];
const fail = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);

// ---------- 編號:一、 → (一) → 1. → (1) ----------

const CN_DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function toChineseNumeral(n) {
  if (n < 10) return CN_DIGITS[n];
  if (n < 20) return "十" + (n % 10 ? CN_DIGITS[n % 10] : "");
  const tens = Math.floor(n / 10);
  return CN_DIGITS[tens] + "十" + (n % 10 ? CN_DIGITS[n % 10] : "");
}
function sectionNumber(depth, index) {
  switch (depth) {
    case 2: return `${toChineseNumeral(index)}、`;
    case 3: return `(${toChineseNumeral(index)})`;
    case 4: return `${index}.`;
    default: return `(${index})`;
  }
}

// ---------- 讀檔 ----------

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return listMarkdown(p);
    return d.name.endsWith(".md") && d.name !== "README.md" ? [p] : [];
  });
}

function splitFrontmatter(file, raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) {
    fail(file, "缺少 frontmatter");
    return { data: {}, body: raw };
  }
  try {
    return { data: YAML.parse(m[1]) ?? {}, body: raw.slice(m[0].length) };
  } catch (e) {
    fail(file, `frontmatter YAML 格式錯誤(含「: 」的值請加引號):${e.message.split("\n")[0]}`);
    return { data: {}, body: raw.slice(m[0].length) };
  }
}

/**
 * wikilink 先改寫成 directive 再交給 remark 解析。
 * 若直接讓 remark 看到 [[a|b]],GFM 表格會在區塊階段就把 | 當成欄位分隔,
 * 而 [ ] 也可能被當成 link reference。改成 directive 後屬性有引號包住,兩個問題都沒了。
 */
function preprocessWikilinks(body, slug) {
  // [[#id]] = 本頁段落;表格內寫的 \| 會讓目標多一個結尾反斜線
  const esc = (s) => {
    const t = s.trim().replace(/\\$/, "");
    return (t.startsWith("#") ? slug + t : t).replace(/"/g, "&quot;");
  };
  return body
    .replace(/^[ \t]*!\[\[([^\]]+?)\]\][ \t]*$/gm, (_, t) => `::kembed{target="${esc(t)}"}`)
    // 緊接在冒號後的連結(「重點:[[x]]」)會變成 ::klink,被當成 leaf directive;
    // 中間補一個零寬空白隔開
    .replace(/:(?=\[\[)/g, ":\u200B")
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, (_, t, label) =>
      `:klink[${(label ?? "").replace(/[[\]]/g, "")}]{target="${esc(t)}"}`,
    );
}

// ---------- mdast 轉換 ----------

function transformDirectives(file, tree) {
  visit(tree, (node, index, parent) => {
    if (node.type === "textDirective") {
      if (node.name === "klink") {
        node.data = {
          hName: "k-link",
          hProperties: { target: node.attributes?.target ?? "" },
        };
        return;
      }
      // 內文裡的「Na:K」「1:2」會被 remark-directive 當成 text directive,還原成文字
      const text = `:${node.name}${node.children.length ? mdToString(node) : ""}`;
      parent.children.splice(index, 1, { type: "text", value: text });
      return [SKIP, index];
    }
    if (node.type === "leafDirective") {
      if (node.name === "kembed") {
        node.data = { hName: "k-embed", hProperties: { target: node.attributes?.target ?? "" } };
      } else if (node.name === "questions") {
        const a = node.attributes ?? {};
        node.data = {
          hName: "k-questions",
          hProperties: {
            tag: a.tag ?? "",
            keyword: a.keyword ?? "",
            ids: a.ids ?? "",
            limit: a.limit ?? "",
          },
        };
      } else {
        fail(file, `未知的 leaf directive ::${node.name}`);
      }
      return;
    }
    if (node.type === "containerDirective") {
      if (!CALLOUTS.includes(node.name)) {
        fail(file, `未知的提示框 :::${node.name}`);
        return;
      }
      const first = node.children[0];
      let title = "";
      if (first?.type === "paragraph" && first.data?.directiveLabel) {
        title = mdToString(first);
        node.children.shift();
      }
      node.data = {
        hName: "k-callout",
        hProperties: { kind: node.name, title },
      };
    }
  });
}

/** 取出標題尾端的 {#id} */
function extractHeadingId(heading) {
  const last = heading.children[heading.children.length - 1];
  if (last?.type !== "text") return null;
  const m = last.value.match(/\s*\{#([a-z0-9][a-z0-9-]*)\}\s*$/);
  if (!m) return null;
  last.value = last.value.slice(0, m.index);
  if (!last.value) heading.children.pop();
  return m[1];
}

const TABLE_PARTS = new Set(["table", "thead", "tbody", "tfoot", "tr"]);

/**
 * mdast → hast,並清掉執行期用不到的東西:
 * - position:原始碼行號,佔 JSON 大半體積
 * - 表格結構裡的純空白文字節點:React 會對 <tr> 底下的空白報 hydration 錯誤
 */
function toHast(nodes) {
  const hast = unified().use(remarkRehype).runSync({ type: "root", children: nodes });
  visit(hast, (node, index, parent) => {
    delete node.position;
    // 獨立一行的圖片 → k-figure(要放圖說與出處;<p> 裡不能包 <figure>)
    if (node.type === "element" && node.tagName === "p") {
      const meaningful = node.children.filter((c) => !(c.type === "text" && !c.value.trim()));
      if (meaningful.length === 1 && meaningful[0].tagName === "img") {
        const img = meaningful[0];
        parent.children[index] = {
          type: "element",
          tagName: "k-figure",
          properties: { src: img.properties.src, alt: img.properties.alt ?? "" },
          children: [],
        };
        return SKIP;
      }
    }
    if (
      node.type === "text" &&
      parent?.type === "element" &&
      TABLE_PARTS.has(parent.tagName) &&
      !node.value.trim()
    ) {
      parent.children.splice(index, 1);
      return [SKIP, index];
    }
  });
  return hast;
}

// ---------- 單篇解析 ----------

function parseArticle(file) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, body } = splitFrontmatter(file, raw);
  const slug = path.basename(file, ".md");
  const category = path.basename(path.dirname(file));

  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail(file, `slug 只能用小寫英數與 -:${slug}`);
  if (!CATEGORIES.includes(category)) fail(file, `資料夾必須是 ${CATEGORIES.join("/")}`);
  if (!data.title) fail(file, "frontmatter 缺 title");

  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    // 讓「**粗體(括號)**中文」這類緊貼中文的強調也能生效(CommonMark 原規則會失敗)
    .use(remarkCjkFriendly)
    .use(remarkDirective)
    .parse(preprocessWikilinks(body, slug));
  transformDirectives(file, tree);

  // 依標題切成樹。h1 保留給頁面標題,內文從 h2 開始。
  const intro = [];
  const roots = [];
  const stack = []; // { depth, section }
  const counters = [0, 0, 0, 0, 0, 0, 0];
  const seenIds = new Set();

  for (const node of tree.children) {
    if (node.type === "heading") {
      if (node.depth === 1) {
        fail(file, "內文不可使用 # 一級標題(標題寫在 frontmatter)");
        continue;
      }
      const id = extractHeadingId(node);
      const title = mdToString(node).trim();
      if (!id) fail(file, `標題缺 {#id}:「${title}」`);
      if (id && seenIds.has(id)) fail(file, `重複的 id:#${id}`);
      if (id) seenIds.add(id);

      while (stack.length && stack[stack.length - 1].depth >= node.depth) stack.pop();
      const parentDepth = stack.length ? stack[stack.length - 1].depth : 1;
      if (node.depth > parentDepth + 1) fail(file, `標題跳級:「${title}」(h${parentDepth} → h${node.depth})`);

      counters[node.depth] += 1;
      for (let d = node.depth + 1; d < counters.length; d++) counters[d] = 0;

      const section = {
        id: id ?? `missing-${counters[node.depth]}`,
        depth: node.depth,
        number: sectionNumber(node.depth, counters[node.depth]),
        title,
        mdContent: [],
        children: [],
      };
      if (stack.length) stack[stack.length - 1].section.children.push(section);
      else roots.push(section);
      stack.push({ depth: node.depth, section });
    } else if (stack.length) {
      stack[stack.length - 1].section.mdContent.push(node);
    } else {
      intro.push(node);
    }
  }

  // mdast → hast
  const finalize = (s) => {
    s.content = toHast(s.mdContent);
    delete s.mdContent;
    s.children.forEach(finalize);
  };
  roots.forEach(finalize);

  return {
    file,
    slug,
    category,
    title: data.title ?? slug,
    subtitle: data.subtitle ?? null,
    aliases: data.aliases ?? [],
    dzTags: data.dzTags ?? [],
    reviewed: data.reviewed === true,
    updated: data.updated ? String(data.updated) : null,
    references: data.references ?? [],
    intro: toHast(intro),
    sections: roots,
  };
}

// ---------- 全域索引 ----------

function walkSections(sections, fn, ancestors = []) {
  for (const s of sections) {
    fn(s, ancestors);
    walkSections(s.children, fn, [...ancestors, s]);
  }
}

/** 摘要:純文字,略過嵌入與考題區塊 */
function summarize(hast) {
  const clone = structuredClone(hast);
  visit(clone, "element", (node, index, parent) => {
    if (["k-embed", "k-questions"].includes(node.tagName)) {
      parent.children.splice(index, 1);
      return [SKIP, index];
    }
  });
  // 區塊元素之間補分隔,否則表格儲存格、清單項目的文字會黏在一起
  visit(clone, "element", (node) => {
    if (BLOCK_SEPARATORS.has(node.tagName)) node.children.push({ type: "text", value: node.tagName === "td" || node.tagName === "th" ? " " : ";" });
  });
  const text = hastToString(clone).replace(/\s+/g, " ").replace(/\s*;/g, ";").replace(/([。;:!?])\s*;/g, "$1").replace(/^[;\s]+|[;\s]+$/g, "").trim();
  return text.length > SUMMARY_LEN ? text.slice(0, SUMMARY_LEN) + "…" : text;
}

function buildIndex(articles) {
  const index = { articles: {}, sections: {}, links: {}, backlinks: {}, embeds: {} };
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  for (const a of articles) {
    if (index.articles[a.slug]) fail(a.file, `slug 重複:${a.slug}`);
    let count = 0;
    walkSections(a.sections, () => count++);
    index.articles[a.slug] = {
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      category: a.category,
      aliases: a.aliases,
      dzTags: a.dzTags,
      reviewed: a.reviewed,
      summary: "", // 連結文字補完後才算,見函式最後
      sectionCount: count,
    };
    walkSections(a.sections, (s, ancestors) => {
      index.sections[`${a.slug}#${s.id}`] = {
        slug: a.slug,
        id: s.id,
        number: s.number,
        title: s.title,
        articleTitle: a.title,
        path: ancestors.map((x) => x.title),
        summary: "",
      };
    });
  }

  const titleOf = (target) => {
    const [slug, id] = target.split("#");
    if (!id) return bySlug.get(slug)?.title;
    return index.sections[target]?.title;
  };

  // 走訪每一段的 hast:補連結文字、記錄外連/反向連結/嵌入
  for (const a of articles) {
    const visitContent = (hast, fromKey) => {
      visit(hast, "element", (node) => {
        const target = node.properties?.target;
        if (node.tagName === "k-link") {
          if (!titleOf(target)) {
            fail(a.file, `壞連結 [[${target}]](在 ${fromKey})`);
            return;
          }
          if (!hastToString(node).trim()) {
            node.children = [{ type: "text", value: titleOf(target) }];
          }
          const out = (index.links[fromKey] ??= []);
          if (!out.includes(target)) out.push(target);
          const back = (index.backlinks[target] ??= []);
          if (!back.includes(fromKey)) back.push(fromKey);
        } else if (node.tagName === "k-embed") {
          if (!target.includes("#")) {
            fail(a.file, `嵌入必須指到段落:![[${target}]]`);
          } else if (!index.sections[target]) {
            fail(a.file, `壞嵌入 ![[${target}]](在 ${fromKey})`);
          } else {
            (index.embeds[target] ??= []).push(fromKey);
          }
        }
      });
    };
    visitContent(a.intro, a.slug);
    walkSections(a.sections, (s) => visitContent(s.content, `${a.slug}#${s.id}`));
  }

  // 摘要要等 [[連結]] 的文字補好才算,否則會出現「見 。」這種空洞
  for (const a of articles) {
    index.articles[a.slug].summary = summarize(a.intro);
    walkSections(a.sections, (s) => {
      // 只有標題沒有內文的段落(例如只放子標題),摘要改用第一個子段落
      const firstChild = s.children[0];
      index.sections[`${a.slug}#${s.id}`].summary =
        summarize(s.content) || (firstChild ? summarize(firstChild.content) : "");
    });
  }

  return index;
}

// ---------- 嵌入:打包來源段落 + 循環檢查 ----------

function findSection(articlesBySlug, target) {
  const [slug, id] = target.split("#");
  let found = null;
  walkSections(articlesBySlug.get(slug)?.sections ?? [], (s) => {
    if (s.id === id) found = s;
  });
  return found;
}

function embedTargetsIn(section) {
  const out = [];
  const collect = (s) => {
    visit(s.content, "element", (n) => {
      if (n.tagName === "k-embed") out.push(n.properties.target);
    });
    s.children.forEach(collect);
  };
  collect(section);
  return out;
}

/** 回傳這篇需要的所有嵌入段落(含巢狀嵌入),同時檢查循環 */
function collectEmbeds(article, articlesBySlug, index) {
  const result = {};
  const ownKeys = new Set();
  walkSections(article.sections, (s) => ownKeys.add(`${article.slug}#${s.id}`));

  const visitTarget = (target, stack) => {
    if (stack.includes(target) || ownKeys.has(target)) {
      fail(article.file, `嵌入循環:${[...stack, target].join(" → ")}`);
      return;
    }
    const section = findSection(articlesBySlug, target);
    if (!section) return;
    if (!result[target]) {
      const [slug] = target.split("#");
      result[target] = {
        target,
        articleTitle: articlesBySlug.get(slug).title,
        section,
        embedCount: index.embeds[target]?.length ?? 0,
      };
    }
    for (const t of embedTargetsIn(section)) visitTarget(t, [...stack, target]);
  };

  const top = [];
  visit(article.intro, "element", (n) => {
    if (n.tagName === "k-embed") top.push(n.properties.target);
  });
  walkSections(article.sections, (s) => {
    visit(s.content, "element", (n) => {
      if (n.tagName === "k-embed") top.push(n.properties.target);
    });
  });
  for (const t of top) visitTarget(t, []);
  return result;
}

// ---------- 考題欄位 ----------

function assignQuestionSlots(article) {
  const slots = [];
  const handle = (hast, key) => {
    let n = 0;
    visit(hast, "element", (node) => {
      if (node.tagName !== "k-questions") return;
      n += 1;
      const qkey = n === 1 ? key : `${key}~${n}`;
      node.properties.qkey = qkey;
      const p = node.properties;
      if (!p.tag && !p.keyword && !p.ids) fail(article.file, `::questions 至少要有 tag/keyword/ids 其一(${qkey})`);
      slots.push({
        qkey,
        tag: p.tag || null,
        keyword: p.keyword || null,
        ids: p.ids ? String(p.ids).split(",").map((s) => s.trim()).filter(Boolean) : [],
        limit: p.limit ? Number(p.limit) : null,
      });
    });
  };
  handle(article.intro, article.slug);
  walkSections(article.sections, (s) => handle(s.content, `${article.slug}#${s.id}`));
  return slots;
}

// ---------- 圖片出處 ----------

function checkImages(articles) {
  const credits = fs.existsSync(CREDITS_FILE) ? JSON.parse(fs.readFileSync(CREDITS_FILE, "utf8")) : {};
  for (const a of articles) {
    const check = (hast) =>
      visit(hast, "element", (n) => {
        if (n.tagName !== "img" && n.tagName !== "k-figure") return;
        const src = String(n.properties.src ?? "");
        if (!src.startsWith("/knowledge-images/")) {
          fail(a.file, `圖片必須放在 /knowledge-images/:${src}`);
          return;
        }
        if (!fs.existsSync(path.join(ROOT, "public", src))) fail(a.file, `找不到圖檔:${src}`);
        const name = src.replace("/knowledge-images/", "");
        if (!credits[name]) fail(a.file, `credits.json 缺少 ${name} 的出處與授權`);
      });
    check(a.intro);
    walkSections(a.sections, (s) => check(s.content));
  }
  return credits;
}

// ---------- main ----------

function main() {
  const files = listMarkdown(CONTENT_DIR);
  const articles = files.map(parseArticle);
  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));
  const index = buildIndex(articles);
  const credits = checkImages(articles);
  const slots = articles.flatMap(assignQuestionSlots);

  const outputs = articles.map((a) => ({
    slug: a.slug,
    json: {
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      category: a.category,
      aliases: a.aliases,
      dzTags: a.dzTags,
      reviewed: a.reviewed,
      updated: a.updated,
      references: a.references,
      intro: a.intro,
      sections: a.sections,
      embeds: collectEmbeds(a, articlesBySlug, index),
    },
  }));

  if (errors.length) {
    console.error(`\n知識庫建置失敗(${errors.length} 個錯誤):`);
    for (const e of errors) console.error("  ✗ " + e);
    process.exit(1);
  }

  fs.rmSync(path.join(OUT_DIR, "articles"), { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT_DIR, "articles"), { recursive: true });
  for (const { slug, json } of outputs) {
    fs.writeFileSync(path.join(OUT_DIR, "articles", `${slug}.json`), JSON.stringify(json));
  }
  fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index));
  fs.writeFileSync(path.join(OUT_DIR, "question-slots.json"), JSON.stringify(slots, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "credits.json"), JSON.stringify(credits));

  const mapFile = path.join(OUT_DIR, "question-map.json");
  if (!fs.existsSync(mapFile)) fs.writeFileSync(mapFile, "{}\n");

  // 動態 import 的對照表:讓每篇文章各自成為一個 chunk,不必整包載入
  const loader = [
    "// 由 scripts/build-knowledge.mjs 產生,請勿手改。",
    'import type { KnowledgeArticle } from "@/lib/knowledge/types";',
    "",
    "export const ARTICLE_LOADERS: Record<string, () => Promise<KnowledgeArticle>> = {",
    ...outputs.map(
      ({ slug }) =>
        `  ${JSON.stringify(slug)}: () => import("./articles/${slug}.json").then((m) => m.default as unknown as KnowledgeArticle),`,
    ),
    "};",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "loaders.ts"), loader);

  const linkCount = Object.values(index.links).reduce((n, l) => n + l.length, 0);
  const embedCount = Object.values(index.embeds).reduce((n, l) => n + l.length, 0);
  console.log(
    `知識庫:${articles.length} 篇、${Object.keys(index.sections).length} 個知識點、` +
      `${linkCount} 條連結、${embedCount} 個嵌入、${slots.length} 個考題欄位`,
  );
}

main();
