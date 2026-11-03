"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchReturnHref } from "@/lib/search";

export function TableBackLink() {
  const params = useSearchParams();
  return <Link href={searchReturnHref(params.get("returnTo"))} scroll={false} className="mb-4 inline-flex min-h-11 items-center gap-1 rounded-btn px-2 text-sm font-medium text-deep hover:bg-surface-hover">← 返回搜尋結果</Link>;
}
