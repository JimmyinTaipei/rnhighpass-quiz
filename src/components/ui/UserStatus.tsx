import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth'
import { getDevMode } from '@/lib/dev-mode'
import { DevToggle } from '@/components/admin/DevToggle'
import { LogoutButton } from './LogoutButton'
import { GoogleLoginButton } from './GoogleLoginButton'

// 導覽列右側的登入狀態。未登入時直接給登入鈕——手機版沒有其他登入入口
// (MobileTabBar 只有頁籤)，所以這裡是唯一的入口，不能只顯示文字。
export async function UserStatus() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return <GoogleLoginButton compact />
  }

  const [admin, devMode] = await Promise.all([isAdmin(), getDevMode()])
  // 顯示 Google 名稱而不是 email：截圖分享時不會把 email 露出去
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined
  const displayName = meta?.full_name ?? meta?.name ?? '已登入'

  return (
    <div className="flex items-center gap-3 text-sm">
      {admin && <DevToggle enabled={devMode} />}
      <span className="hidden max-w-[10rem] truncate text-body sm:inline">{displayName}</span>
      <LogoutButton />
    </div>
  )
}
