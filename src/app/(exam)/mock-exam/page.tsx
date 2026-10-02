import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/mock-exam/LoginScreen";
import { isMockOnly } from "@/lib/site-mode";
import { safeNext } from "@/lib/mock-exam/login";

export default async function MockExamLoginPage(props: PageProps<"/mock-exam">) {
  // 主站的歷年考題模擬不走模擬身分證登入，直接選卷
  if (!isMockOnly()) redirect("/mock-exam/select");
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : null;
  return <LoginScreen next={safeNext(next)} />;
}
