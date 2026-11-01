import { createClient } from '@/lib/supabase-server'
import { safeNextPath } from '@/lib/routes'
import { redirectWithinSite } from '@/lib/site-redirect'

// Google 登入後導回這裡,用授權碼換取 session 並寫入 cookie
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // 相對轉址保留手機使用的 .local 主機；仍須排除 //host 等外站路徑。
  const next = safeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirectWithinSite(next)
    }
  }

  return redirectWithinSite('/?error=auth')
}
