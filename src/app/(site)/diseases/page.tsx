import { notFound, redirect } from "next/navigation";
import { getDiseaseTagSample } from "@/lib/data";

/**
 * 疾病軸沒有自己的總覽頁——左側就是標籤清單，右邊一定要有內容才不會是空畫面，
 * 所以這裡直接轉到樣本清單的第一個標籤(作法同 /subjects/[subjectId])。
 */
export default async function DiseasesPage() {
  const tags = await getDiseaseTagSample(1);
  if (tags.length === 0) notFound();

  // redirect 靠 throw 中斷渲染，所以不能包在 try/catch 裡
  redirect(`/diseases/${encodeURIComponent(tags[0].tag)}`);
}
