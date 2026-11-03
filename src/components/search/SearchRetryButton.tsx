"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SearchRetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className="ml-1 inline-flex min-h-11 items-center font-medium text-accent underline disabled:opacity-60">{pending ? "重新搜尋中…" : "重試搜尋"}</button>;
}
