import { LoginGate } from "@/components/mock-exam/LoginGate";
import { isMockOnly } from "@/lib/site-mode";

// 選卷頁：跟 (authed) 一樣要先經過模擬登入，但這頁是唯讀的(只有連結)，
// 確認登入前先照常排版、只是不顯示，確認後版面不會跳動(CLS)。
// 作答頁掛載時會寫 localStorage，留在 (authed) 用原本的載入畫面擋住。
export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  if (!isMockOnly()) return <>{children}</>;
  return <LoginGate keepLayout>{children}</LoginGate>;
}
