import { PageLoader } from "@/components/ui/PageLoader";

// 章節頁要抓 chapter / topics / cards / questions 四份資料，是全站最慢的一頁
export default function Loading() {
  return <PageLoader message="章節載入中…" />;
}
