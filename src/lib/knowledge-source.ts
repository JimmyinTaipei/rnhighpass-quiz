// 知識庫 .md 原始檔的局部改寫(dev mode 編輯用)。純字串處理，不碰檔案系統，
// 所以可以單獨測試；讀寫檔與重建由 knowledge-edit-fs.ts 負責。
//
// 改寫一律以「行」為單位，只動目標那幾行，其餘內容(含註解、空行、frontmatter 其他欄位)
// 原封不動，讓 git diff 保持乾淨。

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const HEADING_PATTERN = /^(#{2,6})[ \t]+(.*?)[ \t]*\{#([a-z0-9][a-z0-9-]*)\}[ \t]*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;
const ANY_HEADING_PATTERN = /^#{1,6}[ \t]/;

export interface SectionSource {
  /** 標題原文(不含 # 與 {#id}，可含 Markdown 粗體等) */
  title: string;
  /** 本段自己的內文(不含子段落) */
  body: string;
}

export interface ArticleMetaSource {
  title: string;
  subtitle: string;
}

type Result<T> = { ok: true; value: T } | { ok: false; reason: string };

interface Parsed {
  lines: string[];
  /** 內文第一行的索引(frontmatter 之後) */
  bodyStart: number;
  /** frontmatter 內容的行範圍 [start, end) */
  fmStart: number;
  fmEnd: number;
}

function parse(md: string): Result<Parsed> {
  const lines = md.split("\n");
  if (lines[0] !== "---") return { ok: false, reason: "缺少 frontmatter" };
  const close = lines.indexOf("---", 1);
  if (close < 0) return { ok: false, reason: "frontmatter 沒有結束的 ---" };
  return { ok: true, value: { lines, bodyStart: close + 1, fmStart: 1, fmEnd: close } };
}

/** 內文中所有標題的位置；略過程式碼區塊裡看起來像標題的行 */
function headings(p: Parsed) {
  const out: { line: number; hashes: string; title: string; id: string }[] = [];
  let inFence = false;
  for (let i = p.bodyStart; i < p.lines.length; i++) {
    const line = p.lines[i];
    if (FENCE_PATTERN.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(HEADING_PATTERN);
    if (m) out.push({ line: i, hashes: m[1], title: m[2], id: m[3] });
  }
  return out;
}

function locate(p: Parsed, id: string) {
  const hs = headings(p);
  const idx = hs.findIndex((h) => h.id === id);
  if (idx < 0) return null;
  const h = hs[idx];
  // 本段內文到「下一個任何層級的標題」為止(子段落另外編輯)
  const end = idx + 1 < hs.length ? hs[idx + 1].line : p.lines.length;
  return { ...h, bodyStart: h.line + 1, bodyEnd: end };
}

export function readSection(md: string, id: string): Result<SectionSource> {
  const p = parse(md);
  if (!p.ok) return p;
  const s = locate(p.value, id);
  if (!s) return { ok: false, reason: `找不到段落 #${id}` };
  const body = p.value.lines.slice(s.bodyStart, s.bodyEnd).join("\n").trim();
  return { ok: true, value: { title: s.title, body } };
}

export function writeSectionTitle(md: string, id: string, title: string): Result<string> {
  const clean = title.trim();
  if (!clean) return { ok: false, reason: "標題不能空白" };
  if (/[\r\n]/.test(clean)) return { ok: false, reason: "標題不能換行" };
  if (/\{#/.test(clean)) return { ok: false, reason: "標題裡不要寫 {#id}，id 會自動保留" };
  const p = parse(md);
  if (!p.ok) return p;
  const s = locate(p.value, id);
  if (!s) return { ok: false, reason: `找不到段落 #${id}` };
  const lines = [...p.value.lines];
  lines[s.line] = `${s.hashes} ${clean} {#${id}}`;
  return { ok: true, value: lines.join("\n") };
}

export function writeSectionBody(md: string, id: string, body: string): Result<string> {
  const text = body.replace(/\r\n?/g, "\n").trim();
  // 內文裡出現標題會改變段落結構(新增段落要有新的 id)，這種改動請直接改 .md
  let inFence = false;
  for (const line of text.split("\n")) {
    if (FENCE_PATTERN.test(line)) inFence = !inFence;
    if (!inFence && ANY_HEADING_PATTERN.test(line)) {
      return { ok: false, reason: "內文不能包含標題(# 開頭的行)；要新增段落請直接編輯 .md 檔" };
    }
  }
  const p = parse(md);
  if (!p.ok) return p;
  const s = locate(p.value, id);
  if (!s) return { ok: false, reason: `找不到段落 #${id}` };
  const lines = p.value.lines;
  const replacement = text ? ["", ...text.split("\n"), ""] : [""];
  const next = [...lines.slice(0, s.bodyStart), ...replacement, ...lines.slice(s.bodyEnd)];
  return { ok: true, value: next.join("\n") };
}

// ---------- frontmatter 的 title / subtitle ----------

/** YAML 單行字串：有特殊字元才加引號(用 JSON 字串，YAML 相容) */
function yamlScalar(value: string): string {
  const needsQuote =
    /: |\s#|^[-?:,[\]{}#&*!|>'"%@`]|^\s|\s$/.test(value) || /^(true|false|null|yes|no|~|[\d.+-]+)$/i.test(value);
  return needsQuote ? JSON.stringify(value) : value;
}

function unquote(raw: string): string {
  const v = raw.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}

function findKey(p: Parsed, key: string): number {
  for (let i = p.fmStart; i < p.fmEnd; i++) {
    if (p.lines[i].startsWith(`${key}:`)) return i;
  }
  return -1;
}

export function readMeta(md: string): Result<ArticleMetaSource> {
  const p = parse(md);
  if (!p.ok) return p;
  const get = (key: string) => {
    const i = findKey(p.value, key);
    return i < 0 ? "" : unquote(p.value.lines[i].slice(key.length + 1));
  };
  return { ok: true, value: { title: get("title"), subtitle: get("subtitle") } };
}

export function writeMeta(md: string, meta: ArticleMetaSource): Result<string> {
  const title = meta.title.trim();
  const subtitle = meta.subtitle.trim();
  if (!title) return { ok: false, reason: "頁面標題不能空白" };
  if (/[\r\n]/.test(title + subtitle)) return { ok: false, reason: "標題不能換行" };
  const p = parse(md);
  if (!p.ok) return p;
  const lines = [...p.value.lines];
  const ti = findKey(p.value, "title");
  if (ti < 0) return { ok: false, reason: "frontmatter 沒有 title" };
  lines[ti] = `title: ${yamlScalar(title)}`;

  const si = findKey(p.value, "subtitle");
  if (si >= 0 && subtitle) lines[si] = `subtitle: ${yamlScalar(subtitle)}`;
  else if (si >= 0) lines.splice(si, 1);
  else if (subtitle) lines.splice(ti + 1, 0, `subtitle: ${yamlScalar(subtitle)}`);
  return { ok: true, value: lines.join("\n") };
}
