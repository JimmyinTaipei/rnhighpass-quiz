import type { NextRequest } from "next/server";
import { getTable } from "@/lib/data";

/**
 * 比較表內容的按需載入端點，給 TableModalLink 在使用者「點開」時才抓。
 *
 * 為什麼不直接把表格內容當 props 傳給 client component：一個章節可能引用十幾張表，
 * 每張又有 5~6 欄 × 數列的中文，全部塞進 RSC payload 會讓章節頁明顯變重，
 * 而使用者多半只會點開其中一兩張。
 *
 * tables_ 在 RLS 上是 public read，所以這個端點不需要登入(與閱讀模式一致)。
 */
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/tables/[tableId]">,
) {
  const { tableId } = await ctx.params;
  const table = await getTable(decodeURIComponent(tableId));
  if (!table) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(table);
}
