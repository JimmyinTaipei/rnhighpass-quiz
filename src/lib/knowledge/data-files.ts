import { getCloudflareContext } from "@opennextjs/cloudflare";

// 文章全文與搜尋索引放在 public/knowledge-data/(scripts/build-knowledge.mjs 產生),
// 不打包進 Worker:整包 import 會超過 Cloudflare 64 MiB 上限(docs/deploy-size-plan.md)。
// Cloudflare 上用 ASSETS binding 讀;本機 next dev 沒有 binding,改讀磁碟。
const BASE = "/knowledge-data/";

type ReadResult<T> = { ok: true; data: T } | { ok: false };

async function readFromAssets<T>(rel: string): Promise<ReadResult<T> | null> {
  let assets: ReturnType<typeof getCloudflareContext>["env"]["ASSETS"];
  try {
    assets = getCloudflareContext().env.ASSETS;
  } catch {
    return null; // 不在 Cloudflare 執行環境(next dev)
  }
  if (!assets) return null;
  const res = await assets.fetch(new Request(`https://assets.local${BASE}${rel}`));
  if (!res.ok) return { ok: false };
  return { ok: true, data: (await res.json()) as T };
}

async function readFromDisk<T>(rel: string): Promise<ReadResult<T>> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    // 路徑在執行時才組出來,避免建置時被檔案追蹤整包帶進伺服器輸出
    const file = join(process.cwd(), "public", BASE, rel);
    return { ok: true, data: JSON.parse(await readFile(file, "utf8")) as T };
  } catch {
    return { ok: false };
  }
}

/** 讀 public/knowledge-data/ 底下的 JSON;找不到回傳 null。 */
export async function readKnowledgeData<T>(rel: string): Promise<T | null> {
  const result = (await readFromAssets<T>(rel)) ?? (await readFromDisk<T>(rel));
  return result.ok ? result.data : null;
}
