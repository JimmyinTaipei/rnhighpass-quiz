import { notFound, redirect } from "next/navigation";
import { knowledgeIndex } from "@/lib/knowledge";

/**
 * 知識面板的網址。站內點進來時會被 @panel/(.)k 攔截成側邊面板(章節頁不動)；
 * 直接開啟、重新整理或分享出去的連結則走到這裡，轉到完整的知識頁。
 *
 * 另開 /k 而不是直接攔截 /learn:知識庫內部的連結要照常換頁，不該變成面板。
 * ?s=<段落 id> 指定要定位的段落。
 */
export default async function KnowledgePanelFallback(props: PageProps<"/k/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  if (!knowledgeIndex.articles[slug]) notFound();
  const section = typeof searchParams.s === "string" ? searchParams.s : "";
  redirect(`/learn/${slug}${section ? `#${encodeURIComponent(section)}` : ""}`);
}
