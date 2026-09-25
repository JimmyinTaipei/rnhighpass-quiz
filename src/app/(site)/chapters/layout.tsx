import { ReadingFrame } from "@/components/reading/ReadingFrame";
import { ReadingSidebar } from "@/components/reading/ReadingSidebar";
import {
  getAllChapterCardCounts,
  getAllChapterQuestionCounts,
  getAllChapters,
  getSubjects,
} from "@/lib/data";

/**
 * 閱讀頁的兩欄外框。
 *
 * 側邊欄刻意放在這一層而不是 page：這個 layout 段沒有動態參數，是
 * /chapters/1 與 /chapters/2 的共用段，client 導航時 Next 不會重繪它。
 * 於是換章時左側的科目切換器與 Ch 列表原地不動(連展開狀態、捲動位置都保住)，
 * 只有右側的 page 與 @tree slot 被換掉——loading.tsx 也是包在 layout 裡面的，
 * 所以載入骨架只會蓋住右欄。
 *
 * 代價：layout 讀不到 chapterId，所以這裡把「全站章節 + 全站章節計數」一次撈好
 * (都走 0008 的 view，一章一列)，由 ReadingSidebar 依 pathname 取用。
 */
export default async function ChaptersLayout(props: LayoutProps<"/chapters">) {
  const [subjects, chapters, questionCounts, cardCounts] = await Promise.all([
    getSubjects(),
    getAllChapters(),
    getAllChapterQuestionCounts(),
    getAllChapterCardCounts(),
  ]);

  return (
    <ReadingFrame
      sidebar={
        <ReadingSidebar
          subjects={subjects}
          chapters={chapters}
          questionCounts={[...questionCounts]}
          cardCounts={[...cardCounts]}
        >
          {props.tree}
        </ReadingSidebar>
      }
    >
      {props.children}
    </ReadingFrame>
  );
}
