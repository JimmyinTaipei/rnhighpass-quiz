'use client'

import { createClient } from '@/lib/supabase'

interface GoogleLoginButtonProps {
  /** 登入完成後要回到的站內路徑，會交給 /auth/callback 處理 */
  next?: string
  /** 導覽列用的小尺寸樣式 */
  compact?: boolean
  /** 大尺寸時的層級：首頁「開始讀書」才是主要動作，登入用白底的次要樣式 */
  tone?: 'primary' | 'secondary'
}

export function GoogleLoginButton({ next, compact = false, tone = 'primary' }: GoogleLoginButtonProps) {
  const handleLogin = async () => {
    const supabase = createClient()
    const callback = new URL('/auth/callback', window.location.origin)
    if (next) callback.searchParams.set('next', next)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callback.toString(),
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      className={
        compact
          ? 'rounded-full bg-deep px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90'
          : tone === 'secondary'
            ? 'flex h-12 w-full items-center justify-center gap-2 rounded-full border border-card-border bg-card px-5 font-medium text-deep transition-colors hover:bg-surface-hover md:w-[220px]'
            : 'flex h-12 w-full items-center justify-center gap-2 rounded-full bg-deep px-5 font-medium text-on-accent transition-opacity hover:opacity-90 md:w-[220px]'
      }
    >
      {compact ? '登入' : '使用 Google 登入'}
    </button>
  )
}
