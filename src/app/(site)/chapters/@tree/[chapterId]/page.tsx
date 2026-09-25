import { TopicTree } from "@/components/reading/TopicTree";
import { getChapterTreeNodes } from "@/lib/data";

/**
 * 側邊欄的節點樹，獨立成平行路由 slot。
 *
 * 樹是唯一「跟著章節換」的側邊欄內容，切出來之後它可以自己 stream(見同層的
 * loading.tsx)，而外圈的 Ch 列表留在 chapters/layout.tsx 不重繪。
 *
 * 組樹的部分在 data.ts 的 getChapterTreeNodes，與 /api/chapters/[chapterId]/tree
 * 共用 —— 側邊欄展開其他章節時走那支 API，規則必須跟這裡一致。
 */
export default async function ChapterTreeSlot(
  props: PageProps<"/chapters/[chapterId]">,
) {
  const { chapterId } = await props.params;
  const chapterIdNum = Number(chapterId);
  if (!Number.isInteger(chapterIdNum)) return null;

  const nodes = await getChapterTreeNodes(chapterIdNum);
  if (!nodes) return null;

  return <TopicTree nodes={nodes} />;
}
