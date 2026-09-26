import { LearnSidebar } from "@/components/learn/LearnSidebar";
import { taxonomy } from "@/lib/knowledge";

/**
 * 知識庫「瀏覽」頁(首頁、系統頁)的外框:左側分類清單。
 * 知識頁本身(/learn/[slug])不在這個 route group 裡,它的左欄是文章目錄。
 */
export default function LearnBrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <LearnSidebar domains={taxonomy.domains} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
