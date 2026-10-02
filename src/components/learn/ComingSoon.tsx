import Link from "next/link";
import { SoonBadge } from "@/components/learn/SoonBadge";

/** 分類已規劃、還沒有頁面時的說明(取代 404 與空清單) */
export function ComingSoon({ description }: { description?: string | null }) {
  return (
    <div className="rounded-card bg-card p-6 text-sm text-body">
      <p className="mb-2 flex items-center gap-2 font-semibold text-deep">
        這個分類即將推出 <SoonBadge />
      </p>
      {description && <p className="mb-3">{description}</p>}
      <Link href="/learn" className="text-accent hover:text-deep hover:underline">
        回知識庫首頁
      </Link>
    </div>
  );
}
