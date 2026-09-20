import { NavBar } from "@/components/ui/NavBar";

// 主站外框(導覽列 + 手機底部頁籤的留白)。
// 刻意不放在 root layout：/mock-exam 是模擬國考的全版介面，不應出現主站導覽。
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
    </>
  );
}
