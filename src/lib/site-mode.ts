/**
 * 部署模式。
 *
 * "mock" = 模擬考站(exam.rnhighpass.com)：只露出 /mock-exam，其餘頁面一律擋掉。
 * 未設定 = 完整測驗網站(本機開發與之後的 quiz.rnhighpass.com)。
 *
 * build 與 Worker runtime 兩邊都會設定 SITE_MODE(見 package.json 的 cf:deploy:exam
 * 與 wrangler.jsonc 的 env.exam)，任一邊讀得到都算數。
 */
export function isMockOnly(): boolean {
  return process.env.SITE_MODE === "mock";
}
