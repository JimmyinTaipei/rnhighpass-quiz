import { LoginGate } from "@/components/mock-exam/LoginGate";

// 選卷頁與作答頁都要先經過 /mock-exam 的模擬登入
export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return <LoginGate>{children}</LoginGate>;
}
