import { redirect } from "next/navigation";
import { getCurrentUser } from "./data";
import { createClient } from "./supabase-server";
import { loginRedirectPath } from "./routes";

/**
 * 受保護頁面的實際門檻。
 *
 * src/proxy.ts 也會做一次導向，但官方文件明講 proxy 只適合 optimistic check
 * (CDN 快取、預取等情況不保證攔得到)，所以真正的檢查要放在 Server Component 這層。
 *
 * @param nextPath 登入完成後要回到的路徑
 */
export async function requireUser(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) redirect(loginRedirectPath(nextPath));
  return user;
}

/**
 * 目前使用者是不是 admin(可編輯題目)。
 *
 * admins 表的 RLS 只允許讀自己那一列(migration 0005)，所以這個查詢對非 admin
 * 會回空、對 admin 會回自己那列——不需要另外的權限判斷。
 *
 * 注意：這只用來決定「要不要渲染編輯介面」。真正的授權在
 * updateQuestion action 內部再驗一次，而且 Postgres 的 RLS 還會再守一層。
 * Next 16 的 Server Actions 文件明講渲染層 gating 不是安全邊界。
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  // migration 0005 還沒套用時 admins 表不存在 -> 當作沒有 admin，不要讓整頁掛掉
  if (error) return false;
  return !!data;
}
