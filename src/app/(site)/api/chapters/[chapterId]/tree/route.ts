import type { NextRequest } from "next/server";
import { getChapterTreeNodes } from "@/lib/data";

/**
 * 章節側邊樹的按需載入端點，給側邊欄展開「非當前章節」時抓。
 *
 * 當前章節的樹仍由 chapters/@tree 這個平行路由 slot 在 server render(可 stream)，
 * 這支只負責使用者額外展開的那幾章 —— 一次把全科 18 章的樹都塞進 layout payload
 * 太重，而使用者多半只會同時開兩三章。
 *
 * 內容與 slot 都走 data.ts 的 getChapterTreeNodes，組樹規則只有一份。
 * 閱讀相關的表在 RLS 上是 public read，所以不需要登入(與閱讀模式一致)。
 */
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/chapters/[chapterId]/tree">,
) {
  const { chapterId } = await ctx.params;
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const nodes = await getChapterTreeNodes(chapterIdNum);
  if (!nodes) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(nodes);
}
