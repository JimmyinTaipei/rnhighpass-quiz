import Link from "next/link";

// 網址對不到任何頁面時(主站與模擬考站共用，所以只給回首頁)
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-bold text-muted">404</p>
      <h1 className="text-xl font-bold text-strong">找不到這個頁面</h1>
      <p className="text-sm text-muted">網址可能打錯了，或這一頁已經移除。</p>
      <Link href="/" className="mt-2 rounded-full bg-mid px-5 py-2.5 text-sm font-semibold text-on-mid hover:bg-accent">
        回首頁
      </Link>
    </main>
  );
}
