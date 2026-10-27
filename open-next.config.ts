import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// 預先產生的頁面(知識頁)放在靜態資產裡讀取，並在載入 Next 伺服器前就攔截回應，
// 讓這些請求幾乎不耗 Worker CPU(Cloudflare 免費方案每次請求 10 ms，見 docs/deploy-size-plan.md)。
// static-assets 快取是唯讀的：內容要更新就重新 build 部署(沒有 ISR 重新驗證)。
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
