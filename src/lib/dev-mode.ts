import { cache } from "react";
import { cookies } from "next/headers";
import { isAdmin } from "./auth";

/** dev mode 開關的 cookie 名稱。只有 setDevMode action 會寫它。 */
export const DEV_MODE_COOKIE = "devmode";

/**
 * 這次 request 是否要顯示 dev mode 工具。
 *
 * 必須「是 admin」且「開關打開」兩者成立。cookie 本身不是憑證——任何人都能在
 * 瀏覽器裡手動塞 devmode=1，所以每次都重新驗證 admin；非 admin 帶著 cookie
 * 也只會拿到 false。真正的寫入授權仍在各個 action 與 RLS 裡。
 */
export const getDevMode = cache(async (): Promise<boolean> => {
  const store = await cookies();
  if (store.get(DEV_MODE_COOKIE)?.value !== "1") return false;
  return isAdmin();
});
