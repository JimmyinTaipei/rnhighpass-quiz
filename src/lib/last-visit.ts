import { createClient } from "./supabase-server";
import { knowledgeIndex } from "./knowledge";

export interface LastVisit {
  slug: string;
  title: string;
}

/**
 * 登入者上次開啟的知識頁(user_last_visit,一人一列)。
 * 未登入、表還沒建(migration 0013 未套用)、頁面已不存在時都回 null，首頁就不顯示那一條。
 */
export async function getLastVisit(): Promise<LastVisit | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("user_last_visit")
    .select("slug")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (error || !data) return null;

  const article = knowledgeIndex.articles[data.slug];
  return article ? { slug: data.slug, title: article.title } : null;
}
