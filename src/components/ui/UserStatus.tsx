import { createClient } from '@/lib/supabase-server'
import { LogoutButton } from './LogoutButton'

// 驗證用元件:顯示目前登入狀態,方便確認 Google OAuth 流程有沒有跑通
export async function UserStatus() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return <p className="text-sm text-muted">尚未登入</p>
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-body">已登入:{user.email}</span>
      <LogoutButton />
    </div>
  )
}
