'use client'

import { useId, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface GoogleLoginButtonProps {
  /** 登入完成後要回到的站內路徑，會交給 /auth/callback 處理 */
  next?: string
  /** 導覽列用的小尺寸樣式 */
  compact?: boolean
  /** 大尺寸時的層級：首頁「開始讀書」才是主要動作，登入用白底的次要樣式。
   *  主要樣式和全站主要按鈕一樣用粉彩底深字(深藍實心看起來比主要按鈕還重，會搶走層級) */
  tone?: 'primary' | 'secondary'
}

export function GoogleLoginButton({ next, compact = false, tone = 'primary' }: GoogleLoginButtonProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const errorId = useId()

  const handleLogin = async () => {
    if (pending) return
    setPending(true)
    setError(null)
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const supabase = createClient()
      const callback = new URL('/auth/callback', window.location.origin)
      if (next) callback.searchParams.set('next', next)
      const result = await Promise.race([
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: callback.toString(),
            // Only navigate after this attempt succeeds, never after a timed-out attempt.
            skipBrowserRedirect: true,
          },
        }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('連線逾時，請確認網路後再試一次')), 12000)
        }),
      ])
      if (result.error) throw result.error
      if (!result.data.url) throw new Error('未取得 Google 登入網址，請再試一次')
      window.location.assign(result.data.url)
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : '請重新整理頁面後再試一次'
      setError(`無法開啟登入：${reason}`)
    } finally {
      if (timer !== undefined) clearTimeout(timer)
      setPending(false)
    }
  }

  return (
    <span className={compact ? 'relative inline-flex' : 'relative inline-flex w-full md:w-auto'}>
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        aria-describedby={error ? errorId : undefined}
        onClick={handleLogin}
        className={
          compact
            ? 'rounded-full bg-mid px-4 py-2 text-sm font-semibold text-on-mid transition-colors hover:bg-accent'
            : tone === 'secondary'
              ? 'flex h-12 w-full items-center justify-center gap-2 rounded-full border border-card-border bg-card px-5 font-medium text-deep transition-colors hover:bg-surface-hover md:w-[220px]'
              : 'flex h-12 w-full items-center justify-center gap-2 rounded-full bg-mid px-5 font-semibold text-on-mid transition-colors hover:bg-accent md:w-[220px]'
        }
      >
        {pending ? '開啟登入中…' : compact ? '登入' : '使用 Google 登入'}
      </button>
      {error && (
        <span id={errorId} role="alert" className="absolute top-full right-0 z-50 mt-2 w-64 rounded-btn border border-card-border bg-card p-3 text-left text-sm text-incorrect shadow-md">
          {error}
        </span>
      )}
    </span>
  )
}
