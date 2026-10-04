import { Suspense } from "react";
import { KnowledgeSearchBox } from "@/components/learn/KnowledgeSearchBox";
import { LearnSidebar } from "@/components/learn/LearnSidebar";
import { learnNavGroups } from "@/lib/knowledge/nav";

/**
 * 知識庫「瀏覽」頁(首頁、系統頁、速查頁)的外框:左側分類清單,內容區頂端是搜尋框(結果在 /learn?q=)。
 * 知識頁本身(/learn/[slug])不在這個 route group 裡,它的左欄是文章目錄。
 */
export default function LearnBrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 content-start gap-6 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <LearnSidebar groups={learnNavGroups()} />
      <div className="min-w-0">
        {/* useSearchParams 需要 Suspense;fallback 佔同樣高度避免版面跳動 */}
        <Suspense fallback={<div className="mb-5 h-10 max-w-xl" />}>
          <KnowledgeSearchBox className="mb-5 max-w-xl" />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
