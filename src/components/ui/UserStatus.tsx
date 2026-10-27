'use client'

import { useViewer } from '@/components/viewer/ViewerProvider'
import { DevToggle } from '@/components/admin/DevToggle'
import { Skeleton } from '@/components/ui/Skeleton'
import { LogoutButton } from './LogoutButton'
import { GoogleLoginButton } from './GoogleLoginButton'

// 登入狀態。未登入時直接給登入鈕，不能只顯示文字。
// sidebar:電腦版側邊欄底部(名稱、登出、dev 開關)。
// mobile:手機頂部右上角，只在未登入時出現登入鈕——已登入的帳號資訊在「我的」頁籤。
// 在瀏覽器端讀目前使用者(ViewerProvider)，外框不讀 cookie，知識頁才能是靜態頁。
export function UserStatus({ variant = 'sidebar' }: { variant?: 'sidebar' | 'mobile' }) {
  const viewer = useViewer()

  if (viewer.loading) {
    return variant === 'mobile' ? null : <Skeleton className="h-9 w-full rounded-lg" />
  }
  if (!viewer.loggedIn) {
    return <GoogleLoginButton compact />
  }
  if (variant === 'mobile') return null

  return (
    <div className="flex flex-col gap-2 px-1 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-medium text-body">{viewer.displayName}</span>
        <LogoutButton />
      </div>
      {viewer.admin && <DevToggle enabled={viewer.devMode} onChanged={viewer.refresh} />}
    </div>
  )
}
