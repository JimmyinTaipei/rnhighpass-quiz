import { notFound } from "next/navigation";
import { NavBar } from "@/components/ui/NavBar";
import { isMockOnly } from "@/lib/site-mode";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";

// 主站外框(導覽列 + 手機底部頁籤的留白)。
// 刻意不放在 root layout：/mock-exam 是模擬國考的全版介面，不應出現主站導覽。
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // 模擬考站不該存在這些頁面。proxy 已經會導走，這裡是第二道防線
  // (預取、快取等情況下 proxy 不保證攔得到)。
  if (isMockOnly()) notFound();

  return (
    <FavoritesProvider>
      <NavBar />
      <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
    </FavoritesProvider>
  );
}
