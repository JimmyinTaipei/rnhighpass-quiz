'use client'

import { createClient } from '@/lib/supabase'

export function GoogleLoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-white transition-colors md:w-[220px]"
      style={{ backgroundColor: 'var(--color-deep)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-deep)'
      }}
    >
      使用 Google 登入
    </button>
  )
}
