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
        // 無外框：靠白底與 #F2F2F7 頁面底色的反差分層(iOS 的 inset grouped)
        "on-white rounded-card bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
