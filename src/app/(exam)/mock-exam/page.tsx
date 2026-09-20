import { LoginScreen } from "@/components/mock-exam/LoginScreen";
import { safeNext } from "@/lib/mock-exam/login";

export default async function MockExamLoginPage(props: PageProps<"/mock-exam">) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : null;
  return <LoginScreen next={safeNext(next)} />;
}
