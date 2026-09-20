import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isProtectedPath, loginRedirectPath } from '@/lib/routes'

// Next.js 16 把 middleware.ts 改名為 proxy.ts(export 函式名稱也改成 proxy)。
// 這裡負責每個請求前刷新 Supabase session,維持登入狀態。
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Supabase 專案尚未設定(.env.local 空白)時直接放行,避免整站在開發階段掛掉
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 觸發 token 刷新(過期時會透過 setAll 寫回新 cookie)
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  // 未登入就擋掉測驗模式與錯題本/統計。這裡是 optimistic check,
  // 真正的門檻在各頁的 requireUser()(見 src/lib/auth.ts)。
  const { pathname, search } = request.nextUrl
  if (!isLoggedIn && isProtectedPath(pathname)) {
    const redirectResponse = NextResponse.redirect(
      new URL(loginRedirectPath(pathname + search), request.url)
    )
    // 關鍵:上面 getClaims() 可能剛刷新了 token 並把新 cookie 寫在 response 上。
    // 導向會換一個 response 物件,必須把 cookie 帶過去,否則剛刷新的 session 會遺失。
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
