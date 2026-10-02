// dev mode 編輯知識庫：讀寫 content/knowledge/*.md 並重跑建置。
//
// 只給 knowledge-edit-actions.ts 在 NODE_ENV=development 時動態 import。
// 正式站(Cloudflare Worker)沒有可寫的檔案系統，也不該改內容來源。

import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { SLUG_PATTERN } from "./knowledge-source";

const run = promisify(execFile);
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content/knowledge");
const BUILD_SCRIPT = path.join(ROOT, "scripts/build-knowledge.mjs");
// 與 build-knowledge.mjs 的 CATEGORIES 相同
const CATEGORIES = ["disease", "physiology", "drug", "lab", "care", "pathogen", "admin", "procedure"];

export async function articleFile(slug: string): Promise<string | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  for (const dir of CATEGORIES) {
    const file = path.join(CONTENT_DIR, dir, `${slug}.md`);
    try {
      await fs.access(file);
      return file;
    } catch {
      // 不在這個資料夾
    }
  }
  return null;
}

export async function readArticleSource(slug: string): Promise<string | null> {
  const file = await articleFile(slug);
  return file ? fs.readFile(file, "utf8") : null;
}

/**
 * 寫入新內容並重建。建置失敗(壞連結、YAML 錯誤…)就把原檔寫回去，
 * 建置腳本失敗時不會輸出任何 JSON，所以還原 .md 就等於完整回復。
 */
export async function writeArticleAndRebuild(
  slug: string,
  next: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const file = await articleFile(slug);
  if (!file) return { ok: false, reason: `找不到 ${slug}.md` };
  const original = await fs.readFile(file, "utf8");
  if (original === next) return { ok: true };

  await fs.writeFile(file, next, "utf8");
  try {
    await run(process.execPath, [BUILD_SCRIPT], { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 });
    return { ok: true };
  } catch (e) {
    await fs.writeFile(file, original, "utf8");
    const stderr = (e as { stderr?: string }).stderr ?? "";
    const lines = stderr
      .split("\n")
      .filter((l) => l.includes("✗"))
      .map((l) => l.replace(/^\s*✗\s*/, ""));
    return { ok: false, reason: `建置失敗，已還原：${lines.join("；") || (e as Error).message}` };
  }
}
