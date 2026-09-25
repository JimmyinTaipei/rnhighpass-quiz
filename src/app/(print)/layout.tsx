import { notFound } from "next/navigation";
import { isMockOnly } from "@/lib/site-mode";

// 列印頁外框：沒有導覽列，白底。匯出 PDF 的做法是瀏覽器「列印 → 另存為 PDF」，
// 不需要任何套件或伺服器運算，未來也不會有費用。
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  if (isMockOnly()) notFound();
  return <div className="print-root flex-1 bg-white">{children}</div>;
}
