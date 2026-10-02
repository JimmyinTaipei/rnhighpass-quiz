import { LoginGate } from "@/components/mock-exam/LoginGate";
import { isMockOnly } from "@/lib/site-mode";

// 模擬考站：選卷頁與作答頁都要先經過 /mock-exam 的模擬身分證登入。
// 主站的「歷年考題模擬」改用網站帳號(各頁 requireUser 把關)，不走模擬登入。
export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  if (!isMockOnly()) return <>{children}</>;
  return <LoginGate>{children}</LoginGate>;
}
