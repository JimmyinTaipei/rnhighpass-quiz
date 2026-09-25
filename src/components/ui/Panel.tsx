import { cn } from "@/lib/utils";

/**
 * 內容面板：淺灰頁面上的一塊白色圓角卡面。
 *
 * 全站的層次是三層：頁面 bg-page(淺灰) ▸ 面板 bg-card(白) ▸ 面板內的區塊
 * 回到 bg-page(淺灰)。這不是新發明的規則，mock-exam 的 LoginScreen 與
 * OnScreenKeyboard 早就是這樣堆的，閱讀頁只是跟上。
 */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-card-border bg-card p-4 shadow-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
