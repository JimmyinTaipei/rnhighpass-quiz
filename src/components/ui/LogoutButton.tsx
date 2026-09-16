'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm underline"
      style={{ color: 'var(--color-deep)' }}
    >
      登出
    </button>
  )
}
