import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server 端(Server Component / Route Handler)使用的 Supabase client。
// setAll 包 try/catch:在 Server Component 裡呼叫會因為無法寫入 response 而丟錯,
// 可以忽略——真正的 session 刷新交給 src/proxy.ts 處理。
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 呼叫時預期會丟錯,可忽略
          }
        },
      },
    }
  )
}
