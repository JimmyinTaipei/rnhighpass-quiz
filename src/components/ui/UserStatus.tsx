import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth'
import { getDevMode } from '@/lib/dev-mode'
import { DevToggle } from '@/components/admin/DevToggle'
import { LogoutButton } from './LogoutButton'
import { GoogleLoginButton } from './GoogleLoginButton'

// 登入狀態。未登入時直接給登入鈕，不能只顯示文字。
// sidebar:電腦版側邊欄底部(名稱、登出、dev 開關)。
// mobile:手機頂部右上角，只在未登入時出現登入鈕——已登入的帳號資訊在「我的」頁籤。
export async function UserStatus({ variant = 'sidebar' }: { variant?: 'sidebar' | 'mobile' }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return <GoogleLoginButton compact />
  }
  if (variant === 'mobile') return null

  const [admin, devMode] = await Promise.all([isAdmin(), getDevMode()])
  // 顯示 Google 名稱而不是 email：截圖分享時不會把 email 露出去
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined
  const displayName = meta?.full_name ?? meta?.name ?? '已登入'

  return (
    <div className="flex flex-col gap-2 px-1 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-medium text-body">{displayName}</span>
        <LogoutButton />
      </div>
      {admin && <DevToggle enabled={devMode} />}
    </div>
  )
}
