import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  ChevronRight,
  Flag,
  Inbox,
  LineChart,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { DevToggle } from "@/components/admin/DevToggle";
import { BasicsModeSetting } from "@/components/learn/BasicsModeSetting";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { isAdmin } from "@/lib/auth";
import { getCurrentUser } from "@/lib/data";
import { getDevMode } from "@/lib/dev-mode";

export const metadata: Metadata = { title: "我的|多保命" };

interface Row {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 圖示方塊的底色(iOS 設定 app 的做法：每列一個色塊) */
  tint: string;
}

/**
 * 「我的」：帳號與個人相關的入口，排版仿 iOS 設定 app 的分組清單。
 * 手機上是底部頁籤之一；電腦版側邊欄收合時，底部的人像圖示也連到這裡。
 */
export default async function MePage() {
  const [user, admin, devMode] = await Promise.all([getCurrentUser(), isAdmin(), getDevMode()]);
  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
  const displayName = meta?.full_name ?? meta?.name ?? "已登入";

  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "學習紀錄",
      rows: [
        { href: "/stats", label: "統計", icon: BarChart3, tint: "bg-accent" },
        { href: "/mistakes", label: "我的題本", icon: AlertCircle, tint: "bg-incorrect" },
      ],
    },
    {
      title: "協助",
      rows: [
        { href: "/report", label: "回報問題", icon: Flag, tint: "bg-warning" },
        { href: "/privacy", label: "隱私與資料", icon: ShieldCheck, tint: "bg-correct" },
      ],
    },
  ];
  if (admin) {
    groups.push({
      title: "管理",
      rows: [
        { href: "/admin/reports", label: "回報管理", icon: Inbox, tint: "bg-deep" },
        { href: "/admin/analytics", label: "使用統計", icon: LineChart, tint: "bg-deep" },
      ],
    });
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <h1 className="mb-5 hidden text-3xl font-bold text-strong md:block">我的</h1>

      <section className="mb-6 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-light text-deep">
          <UserRound size={28} />
        </span>
        {user ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-strong">{displayName}</p>
            <p className="text-sm text-muted">作答紀錄與題本會同步到這個帳號</p>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-strong">尚未登入</p>
            <p className="mb-2 text-sm text-muted">登入後可以記錄作答、自動收錄錯題</p>
            <GoogleLoginButton />
          </div>
        )}
        {user && <LogoutButton />}
      </section>

      {admin && (
        <div className="mb-6 rounded-2xl bg-card px-4 py-3 shadow-sm">
          <DevToggle enabled={devMode} />
        </div>
      )}

      <section className="mb-6">
        <h2 className="mb-1.5 px-4 text-xs font-medium text-muted">閱讀</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
          <BasicsModeSetting />
        </div>
        <p className="mt-1.5 px-4 text-xs text-muted">知識頁裡補背景知識的收合區塊。設定只存在這台裝置。</p>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="mb-6">
          <h2 className="mb-1.5 px-4 text-xs font-medium text-muted">{g.title}</h2>
          <ul className="overflow-hidden rounded-2xl bg-card shadow-sm">
            {g.rows.map((r, i) => {
              const Icon = r.icon;
              return (
                <li key={r.href} className="relative">
                  {/* 分隔線從文字開始，不穿過圖示(iOS 清單的樣式) */}
                  {i > 0 && <span aria-hidden className="absolute top-0 right-0 left-14 h-px bg-card-border" />}
                  <Link
                    href={r.href}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover active:bg-surface-hover"
                  >
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-white ${r.tint}`}>
                      <Icon size={16} />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between">
                      <span className="text-[15px] text-strong">{r.label}</span>
                      <ChevronRight size={18} className="text-muted" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
