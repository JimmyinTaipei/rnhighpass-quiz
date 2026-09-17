import Link from "next/link";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";
import { getCurrentUser } from "@/lib/data";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-deep">多保命 護理國考題庫</h1>
      <p className="max-w-md text-muted">
        分章筆記 + 線上測驗，答錯自動收錄錯題本，可依章節查看正確率。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/subjects"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-deep"
        >
          開始練習
        </Link>
        {!user && <GoogleLoginButton />}
      </div>
    </main>
  );
}
