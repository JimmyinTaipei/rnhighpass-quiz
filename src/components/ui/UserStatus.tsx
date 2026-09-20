import { createClient } from '@/lib/supabase-server'
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

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-body sm:inline">{user.email}</span>
      <LogoutButton />
    </div>
  )
}
