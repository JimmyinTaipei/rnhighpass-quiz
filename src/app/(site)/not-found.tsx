import Link from "next/link";
import { pillGray, pillTint } from "@/lib/ui";

// 主站頁面裡呼叫 notFound()(例如不存在的章節、知識頁)時顯示，保留側邊欄與頁籤
export default function SiteNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-bold text-muted">404</p>
      <h1 className="text-xl font-bold text-strong">找不到這個頁面</h1>
      <p className="text-sm text-muted">這個章節或知識頁可能不存在，或已經改名。可以從科目重新找，或直接搜尋。</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link href="/subjects" className={pillTint}>
          回科目
        </Link>
        <Link href="/search" className={pillGray}>
          搜尋
        </Link>
      </div>
    </main>
  );
}
