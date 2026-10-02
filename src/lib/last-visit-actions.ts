"use server";

import { createClient } from "./supabase-server";
import { knowledgeIndex } from "./knowledge";

/** 記下登入者開啟的知識頁。只收存在的 slug；未登入或失敗都靜默略過，不影響閱讀。 */
export async function recordLastVisit(slug: string): Promise<void> {
  if (!knowledgeIndex.articles[slug]) return;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase
    .from("user_last_visit")
    .upsert({ user_id: userData.user.id, slug, visited_at: new Date().toISOString() });
}
