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
//   ::questions{tag="" keyword="" drug="" group="" ids="" limit=""}   相關考題
//   frontmatter pathogens: [{ id, name, names }]   病原體索引(id 必須是本頁的標題 id)
//
// 分類(system / alsoIn / group)只能用 content/knowledge/taxonomy.yml 裡定義的 id。
// 章節對照(chapters)只能寫 src/data/knowledge/chapter-outline.json 裡有的 H2 / 可獨立的 H3。
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
const TAXONOMY_FILE = path.join(CONTENT_DIR, "taxonomy.yml");
// 由 database/scripts/export_chapter_outline.py 從分章題本產生、跟著 git 提交
const OUTLINE_FILE = path.join(OUT_DIR, "chapter-outline.json");
// 章節頁「考點地圖」的考點精華,一章一檔
const POINTS_DIR = path.join(ROOT, "content/chapter-points");
const MAX_POINTS = 5;
// 與 /learn 底下的靜態路由撞名的 slug
const RESERVED_SLUGS = new Set(["system"]);

const CATEGORIES = ["disease", "physiology", "drug", "lab", "care", "pathogen", "admin"];
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
    // _templates 等底線開頭的資料夾是寫作範本,不是文章
    if (d.isDirectory()) return d.name.startsWith("_") ? [] : listMarkdown(p);
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
            adm: a.adm ?? "",
            keyword: a.keyword ?? "",
            drug: a.drug ?? "",
            group: a.group ?? "",
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
  if (RESERVED_SLUGS.has(slug)) fail(file, `slug「${slug}」是保留字(與 /learn/${slug}/ 路由衝突)`);
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
    admTags: data.admTags ?? [],
    system: data.system ?? null,
    alsoIn: data.alsoIn ?? [],
    group: data.group ?? null,
    related: data.related ?? null,
    reviewed: data.reviewed === true,
    updated: data.updated ? String(data.updated) : null,
    references: data.references ?? [],
    pathogens: data.pathogens ?? [],
    chapters: data.chapters ?? [],
    intro: toHast(intro),
    sections: roots,
  };
}

// ---------- 病原體索引 ----------

// 名稱 → 病原體錨點。讓題目頁能用題幹比對出「相關病原體」並連過去,
// 所以 id 與名稱都必須全站唯一,且 id 一定要是該頁真的存在的標題。
function buildPathogenIndex(articles) {
  const entries = [];
  const seenIds = new Map();
  const seenNames = new Map();
  for (const a of articles) {
    if (!Array.isArray(a.pathogens)) {
      fail(a.file, "pathogens 必須是陣列");
      continue;
    }
    const ids = new Set();
    walkSections(a.sections, (s) => ids.add(s.id));
    for (const p of a.pathogens) {
      if (!p || !p.id || !p.name) {
        fail(a.file, "pathogens 每一項都要有 id 與 name");
        continue;
      }
      if (!ids.has(p.id)) fail(a.file, `pathogens 的 id「${p.id}」不是本頁的標題 id`);
      if (seenIds.has(p.id)) fail(a.file, `病原體 id「${p.id}」與 ${seenIds.get(p.id)} 重複`);
      seenIds.set(p.id, a.slug);
      const names = [p.name, ...(p.names ?? [])].map((n) => String(n).trim()).filter(Boolean);
      for (const n of names) {
        const key = n.toLowerCase();
        const owner = seenNames.get(key);
        if (owner && owner !== p.id) fail(a.file, `病原體名稱「${n}」同時屬於 ${owner} 與 ${p.id}`);
        seenNames.set(key, p.id);
      }
      entries.push({ id: p.id, name: p.name, names: [...new Set(names)], target: `${a.slug}#${p.id}` });
    }
  }
  return entries;
}

// ---------- 全域索引 ----------

function walkSections(sections, fn, ancestors = []) {
  for (const s of sections) {
    fn(s, ancestors);
    walkSections(s.children, fn, [...ancestors, s]);
  }
}

/** 摘要:純文字,略過嵌入與考題區塊 */
/** 純文字(略過嵌入與考題);預覽摘要與全文搜尋共用 */
function plainText(hast) {
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
  return hastToString(clone).replace(/\s+/g, " ").replace(/\s*;/g, ";").replace(/([。;:!?])\s*;/g, "$1").replace(/^[;\s]+|[;\s]+$/g, "").trim();
}

function summarize(hast) {
  const text = plainText(hast);
  return text.length > SUMMARY_LEN ? text.slice(0, SUMMARY_LEN) + "…" : text;
}

function buildIndex(articles) {
  const index = { articles: {}, sections: {}, links: {}, backlinks: {}, embeds: {}, related: {}, usedBy: {} };
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
      admTags: a.admTags,
      system: a.system,
      alsoIn: a.alsoIn,
      group: a.group,
      reviewed: a.reviewed,
      chapters: a.chapters,
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

  resolveRelated(articles, index, bySlug);

  return index;
}

// ---------- 關聯(疾病 → 檢驗/藥物/病原體/生理) ----------

// frontmatter 的 related: { lab: [slug], drug: [...], pathogen: [...], physiology: [...] } 只寫在疾病頁;
// 鍵就是目標頁的類型,build 時驗證 slug 存在且類型相符。反向(用於哪些疾病)由這裡自動產生。
// 還沒寫 related 的疾病頁,暫時由內文 [[連結]] 依目標類型推導(遷移期 fallback,不改內容)。
const RELATED_KEYS = ["lab", "drug", "pathogen", "physiology"];

function resolveRelated(articles, index, bySlug) {
  for (const a of articles) {
    if (a.related == null) continue;
    if (a.category !== "disease") {
      fail(a.file, "related 只能寫在疾病頁(disease/)");
      continue;
    }
    if (typeof a.related !== "object" || Array.isArray(a.related)) {
      fail(a.file, "related 必須是物件:{ lab: [...], drug: [...], pathogen: [...], physiology: [...] }");
      continue;
    }
    for (const [key, slugs] of Object.entries(a.related)) {
      if (!RELATED_KEYS.includes(key)) {
        fail(a.file, `related 的鍵「${key}」不存在(可用:${RELATED_KEYS.join("、")})`);
        continue;
      }
      if (!Array.isArray(slugs)) {
        fail(a.file, `related.${key} 必須是 slug 清單`);
        continue;
      }
      for (const s of slugs) {
        const target = bySlug.get(s);
        if (!target) fail(a.file, `related.${key}「${s}」不存在`);
        else if (target.category !== key) fail(a.file, `related.${key}「${s}」是 ${target.category} 頁,不是 ${key}`);
      }
    }
  }

  for (const a of articles) {
    if (a.category !== "disease") continue;
    const resolved = Object.fromEntries(RELATED_KEYS.map((k) => [k, []]));
    if (a.related) {
      for (const k of RELATED_KEYS) resolved[k] = [...new Set(a.related[k] ?? [])].filter((s) => bySlug.has(s));
    } else {
      const targets = new Set();
      for (const [from, outs] of Object.entries(index.links)) {
        if (from.split("#")[0] !== a.slug) continue;
        for (const to of outs) targets.add(to.split("#")[0]);
      }
      for (const s of targets) {
        const cat = bySlug.get(s)?.category;
        if (s !== a.slug && RELATED_KEYS.includes(cat)) resolved[cat].push(s);
      }
    }
    if (RELATED_KEYS.every((k) => resolved[k].length === 0)) continue;
    index.related[a.slug] = resolved;
    for (const k of RELATED_KEYS) {
      for (const s of resolved[k]) (index.usedBy[s] ??= []).push(a.slug);
    }
  }
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

function assignQuestionSlots(article, taxonomy) {
  const slots = [];
  const handle = (hast, key) => {
    let n = 0;
    visit(hast, "element", (node) => {
      if (node.tagName !== "k-questions") return;
      n += 1;
      const qkey = n === 1 ? key : `${key}~${n}`;
      node.properties.qkey = qkey;
      const p = node.properties;
      if (!p.tag && !p.adm && !p.keyword && !p.ids && !p.drug && !p.group) {
        fail(article.file, `::questions 至少要有 tag/adm/keyword/drug/group/ids 其一(${qkey})`);
      }
      // group 展開成該群組在 taxonomy 登記的所有 drug 標籤同義詞
      let drug = p.drug ? String(p.drug).split("|").map((t) => t.trim()).filter(Boolean) : [];
      if (p.group) {
        const g = taxonomy.groups.get(String(p.group));
        if (!g) fail(article.file, `::questions 的 group「${p.group}」不存在於 taxonomy.yml`);
        else if (!g.drugTags?.length) fail(article.file, `group「${p.group}」沒有登記 drugTags,無法查題`);
        else drug = [...new Set([...drug, ...g.drugTags])];
      }
      slots.push({
        qkey,
        tag: p.tag || null,
        adm: p.adm || null,
        drug: drug.length ? drug : null,
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

// ---------- 分類 ----------

function loadTaxonomy() {
  if (!fs.existsSync(TAXONOMY_FILE)) {
    fail(TAXONOMY_FILE, "找不到分類表");
    return { types: {}, domains: [], byId: new Map(), groups: new Map() };
  }
  const raw = YAML.parse(fs.readFileSync(TAXONOMY_FILE, "utf8"));
  const domains = raw.domains ?? [];
  const byId = new Map();
  const groups = new Map();
  for (const d of domains) {
    if (byId.has(d.id)) fail(TAXONOMY_FILE, `domain id 重複:${d.id}`);
    if (!["system", "nursing"].includes(d.kind)) fail(TAXONOMY_FILE, `domain ${d.id} 的 kind 必須是 system/nursing`);
    byId.set(d.id, d);
    for (const g of d.groups ?? []) {
      if (groups.has(g.id)) fail(TAXONOMY_FILE, `group id 重複:${g.id}`);
      if (!CATEGORIES.includes(g.type)) fail(TAXONOMY_FILE, `group ${g.id} 的 type 必須是 ${CATEGORIES.join("/")}`);
      groups.set(g.id, { ...g, domain: d.id });
    }
  }
  return { types: raw.types ?? {}, domains, byId, groups };
}

function validateClassification(articles, taxonomy) {
  const ids = [...taxonomy.byId.keys()].join(", ");
  for (const a of articles) {
    if (!a.system) {
      fail(a.file, `frontmatter 缺 system(可用:${ids})`);
      continue;
    }
    if (!taxonomy.byId.has(a.system)) fail(a.file, `system「${a.system}」不存在(可用:${ids})`);
    for (const d of a.alsoIn) {
      if (!taxonomy.byId.has(d)) fail(a.file, `alsoIn「${d}」不存在(可用:${ids})`);
      if (d === a.system) fail(a.file, `alsoIn 不需要重複主系統 ${d}`);
    }
    if (a.group) {
      const g = taxonomy.groups.get(a.group);
      const allowed = (taxonomy.byId.get(a.system)?.groups ?? [])
        .filter((x) => x.type === a.category)
        .map((x) => x.id)
        .join(", ") || "(無)";
      if (!g || g.domain !== a.system || g.type !== a.category) {
        fail(a.file, `group「${a.group}」不屬於 ${a.system} 的 ${a.category} 群組(可用:${allowed})`);
      }
    }
  }
}

// ---------- 章節對照 ----------

function loadChapterOutline() {
  if (!fs.existsSync(OUTLINE_FILE)) {
    fail(OUTLINE_FILE, "找不到章節大綱,請先執行 database/scripts/export_chapter_outline.py");
    return null;
  }
  const outline = JSON.parse(fs.readFileSync(OUTLINE_FILE, "utf8"));
  const sep = outline.separator;
  // 路徑 → 節點資訊。H3 多記 parent,用來檢查「H2 與其底下 H3 重複寫」
  const nodes = new Map();
  for (const ch of outline.chapters) {
    for (const h2 of ch.topics) {
      const h2Key = [ch.fullTitle, h2.title].join(sep);
      nodes.set(h2Key, { level: 2, count: h2.count, chapter: ch.fullTitle });
      for (const h3 of h2.children) {
        nodes.set([ch.fullTitle, h2.title, h3.title].join(sep), {
          level: 3,
          count: h3.count,
          block: h3.block,
          parent: h2Key,
          chapter: ch.fullTitle,
        });
      }
    }
  }
  return { ...outline, nodes };
}

/**
 * 檢查 frontmatter 的 chapters,並把寫法統一成大綱的標準路徑(「 > 」前後各一格)。
 * H3 只有題數達門檻(大綱裡 block: true)才能單獨對照,其餘請寫到它的 H2——
 * 這是讓章節頁「以 H2 為單位,題數多才拆到 H3」的規則在內容端的防線。
 */
function validateChapterRefs(articles, outline) {
  if (!outline) return;
  const { h2Split, h3Block } = outline.thresholds;
  for (const a of articles) {
    if (!Array.isArray(a.chapters)) {
      fail(a.file, "chapters 必須是陣列");
      a.chapters = [];
      continue;
    }
    const keys = [];
    for (const raw of a.chapters) {
      const key = String(raw)
        .split(">")
        .map((part) => part.trim())
        .join(outline.separator);
      const node = outline.nodes.get(key);
      if (!node) {
        fail(a.file, `chapters「${raw}」不存在於分章題本(格式:章節全名 > H2,例:藥理-Ch10內分泌與新陳代謝藥物 > 糖尿病用藥)`);
        continue;
      }
      if (node.level === 3 && !node.block) {
        fail(
          a.file,
          `chapters「${key}」只有 ${node.count} 題,H3 要在 H2 ≥ ${h2Split} 題且本身 ≥ ${h3Block} 題時才能單獨對照,請改寫 H2:${node.parent}`,
        );
        continue;
      }
      if (keys.includes(key)) {
        fail(a.file, `chapters 重複:${key}`);
        continue;
      }
      keys.push(key);
    }
    for (const key of keys) {
      const parent = outline.nodes.get(key).parent;
      if (parent && keys.includes(parent)) fail(a.file, `chapters 已寫 ${parent},不需要再寫其下的 H3:${key}`);
    }
    a.chapters = keys;
  }
}

/**
 * 反向對照:章節段落 → 對到它的知識頁,另附涵蓋率。
 * 一個 H2 算「已涵蓋」:本身有對照,或它底下可獨立的 H3 至少一個有對照。
 * 一章算「全部涵蓋」:每個有題目的 H2 都已涵蓋——這是章節頁能切成考點地圖的條件。
 */
const SKIP_COVERAGE = new Set(["綜合題型"]);
function chapterMapOutput(articles, outline) {
  const map = {};
  for (const a of articles) {
    for (const key of a.chapters) (map[key] ??= []).push(a.slug);
  }
  const sep = outline.separator;
  const chapters = {};
  let coveredH2 = 0;
  let totalH2 = 0;
  for (const ch of outline.chapters) {
    const missing = [];
    for (const h2 of ch.topics) {
      // 沒題目的段落、各章末尾的「綜合題型」不是主題,不列入涵蓋率
      if (h2.count === 0 || SKIP_COVERAGE.has(h2.title)) continue;
      totalH2++;
      const h2Key = [ch.fullTitle, h2.title].join(sep);
      const covered =
        map[h2Key] ||
        h2.children.some((h3) => h3.block && map[[h2Key, h3.title].join(sep)]);
      if (covered) coveredH2++;
      else missing.push(h2.title);
    }
    chapters[ch.fullTitle] = { missing };
  }
  const fullChapters = Object.values(chapters).filter((c) => c.missing.length === 0).length;
  return {
    output: { map, chapters },
    stats: { coveredH2, totalH2, fullChapters, totalChapters: outline.chapters.length },
  };
}

// ---------- 考點精華 ----------

/**
 * content/chapter-points/*.md → { 章節全名: { 段落路徑: [hast, ...] } }
 *
 *   ---
 *   chapter: 精神-Ch08雙相情緒障礙症病人的護理
 *   ---
 *   ## 雙相情緒障礙症          ← 必須是這一章的 H2
 *   - 一條考點(可用粗體等行內語法)
 *   ### 某個 H3               ← 只能是可獨立的 H3(同 chapters 對照的門檻)
 *   - ...
 *
 * 只收條列,每段最多 MAX_POINTS 條:這裡是「這章考什麼」的精華,
 * 完整說明放知識頁。
 */
function parseChapterPoints(outline) {
  const out = {};
  if (!outline || !fs.existsSync(POINTS_DIR)) return out;
  const sep = outline.separator;
  for (const file of listMarkdown(POINTS_DIR)) {
    const { data, body } = splitFrontmatter(file, fs.readFileSync(file, "utf8"));
    const chapter = outline.chapters.find((c) => c.fullTitle === data.chapter);
    if (!chapter) {
      fail(file, `chapter「${data.chapter ?? ""}」不存在於分章題本(寫章節全名,如 精神-Ch08雙相情緒障礙症病人的護理)`);
      continue;
    }
    if (out[chapter.fullTitle]) {
      fail(file, `${chapter.fullTitle} 已經有另一個考點檔`);
      continue;
    }
    const tree = unified().use(remarkParse).use(remarkGfm).use(remarkCjkFriendly).parse(body);
    const points = {};
    let h2 = null;
    let key = null;
    for (const node of tree.children) {
      if (node.type === "heading") {
        const title = mdToString(node).trim();
        if (node.depth === 2) {
          h2 = chapter.topics.find((t) => t.title === title) ?? null;
          key = h2 ? [chapter.fullTitle, title].join(sep) : null;
          if (!h2) fail(file, `「${title}」不是本章的 H2`);
        } else if (node.depth === 3) {
          const h3 = h2?.children.find((c) => c.title === title);
          key = null;
          if (!h3) fail(file, `「${title}」不是「${h2?.title ?? "(前面沒有 H2)"}」底下的 H3`);
          else if (!h3.block) fail(file, `「${title}」題數未達獨立門檻,考點請寫在它的 H2 底下`);
          else key = [chapter.fullTitle, h2.title, title].join(sep);
        } else {
          fail(file, `只能用 ## 與 ### 標題:「${title}」`);
        }
        if (key && points[key]) fail(file, `段落重複:${title}`);
        continue;
      }
      if (node.type !== "list") {
        fail(file, `考點只能用條列(- ...),請把段落文字改成條列或移到知識頁`);
        continue;
      }
      if (!key) continue; // 標題錯誤已回報
      const items = node.children.map((li) => toHast(li.children));
      points[key] = [...(points[key] ?? []), ...items];
      if (points[key].length > MAX_POINTS) {
        fail(file, `「${key.split(sep).at(-1)}」有 ${points[key].length} 條考點,最多 ${MAX_POINTS} 條(細節請放知識頁)`);
      }
    }
    out[chapter.fullTitle] = points;
  }
  return out;
}

/** 給前端的分類表:名稱、排序、每個 domain / group 的頁數 */
function taxonomyOutput(taxonomy, articles) {
  const count = (pred) => articles.filter(pred).length;
  return {
    types: taxonomy.types,
    domains: taxonomy.domains.map((d) => ({
      id: d.id,
      name: d.name,
      kind: d.kind,
      blockTag: d.blockTag ?? null,
      primaryCount: count((a) => a.system === d.id),
      alsoCount: count((a) => a.alsoIn.includes(d.id)),
      groups: (d.groups ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type,
        drugTags: g.drugTags ?? [],
        count: count((a) => a.group === g.id),
      })),
    })),
  };
}

/**
 * 全文搜尋索引(只在 server 端使用):每篇與每個知識點的標題、別名/麵包屑、內文純文字。
 * 內文只取該段自己的內容(不含子段落),命中時才能準確指到那一段。
 */
function searchOutput(articles, index) {
  const out = [];
  for (const a of articles) {
    out.push({
      k: a.slug,
      t: a.title,
      s: [a.subtitle, ...a.aliases].filter(Boolean).join(" "),
      c: a.category,
      d: a.system,
      b: plainText(a.intro),
    });
    walkSections(a.sections, (sec) => {
      const key = `${a.slug}#${sec.id}`;
      const meta = index.sections[key];
      out.push({
        k: key,
        t: sec.title,
        s: [meta.articleTitle, ...meta.path].join(" › "),
        c: a.category,
        d: a.system,
        n: sec.number,
        b: plainText(sec.content),
      });
    });
  }
  return out;
}

// ---------- main ----------

function main() {
  const files = listMarkdown(CONTENT_DIR);
  const articles = files.map(parseArticle);
  const taxonomy = loadTaxonomy();
  validateClassification(articles, taxonomy);
  const outline = loadChapterOutline();
  validateChapterRefs(articles, outline);
  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));
  const index = buildIndex(articles);
  const credits = checkImages(articles);
  const slots = articles.flatMap((a) => assignQuestionSlots(a, taxonomy));
  const pathogenIndex = buildPathogenIndex(articles);

  const outputs = articles.map((a) => ({
    slug: a.slug,
    json: {
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      category: a.category,
      aliases: a.aliases,
      dzTags: a.dzTags,
      admTags: a.admTags,
      system: a.system,
      alsoIn: a.alsoIn,
      group: a.group,
      reviewed: a.reviewed,
      updated: a.updated,
      references: a.references,
      chapters: a.chapters,
      intro: a.intro,
      sections: a.sections,
      embeds: collectEmbeds(a, articlesBySlug, index),
    },
  }));

  const chapterMap = outline && chapterMapOutput(articles, outline);
  const chapterPoints = parseChapterPoints(outline);

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
  fs.writeFileSync(path.join(OUT_DIR, "taxonomy.json"), JSON.stringify(taxonomyOutput(taxonomy, articles)));
  fs.writeFileSync(path.join(OUT_DIR, "search.json"), JSON.stringify(searchOutput(articles, index)));
  fs.writeFileSync(path.join(OUT_DIR, "pathogen-index.json"), JSON.stringify(pathogenIndex, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "chapter-map.json"), JSON.stringify(chapterMap.output, null, 1) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "chapter-points.json"), JSON.stringify(chapterPoints));

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
  const cs = chapterMap.stats;
  console.log(
    `章節對照:${articles.filter((a) => a.chapters.length).length} 篇有寫、` +
      `涵蓋 ${cs.coveredH2}/${cs.totalH2} 個有題目的 H2、${cs.fullChapters}/${cs.totalChapters} 章全部涵蓋、` +
      `${Object.keys(chapterPoints).length} 章有考點精華`,
  );
}

main();
