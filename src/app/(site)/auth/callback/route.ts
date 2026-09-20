import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { safeNextPath } from '@/lib/routes'

// Google 登入後導回這裡,用授權碼換取 session 並寫入 cookie
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 一定要過 safeNextPath:下面是 `${origin}${next}` 直接串接,
  // 未驗證的話 ?next=//evil.example 會變成 open redirect
  const next = safeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
