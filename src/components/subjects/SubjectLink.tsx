"use client";

import { entryHref, useReadingStore } from "@/lib/reading-position";

interface SubjectLinkProps {
  subjectId: string;
  /** SSR 期間用的連結，也是沒有閱讀紀錄時的結果 */
  fallbackHref: string;
  className?: string;
  children: React.ReactNode;
  "data-group"?: string;
}

/**
 * 科目卡的連結：有閱讀紀錄就直接指向上次的 Ch。
 *
 * 紀錄在 localStorage，SSR 讀不到。useReadingStore 的 server snapshot 是空的，
 * 所以伺服器與首次 client render 都輸出 fallbackHref(= /subjects/<id>，那個
 * 路由會 server redirect 到第一個 Ch)，hydration 之後才換成記住的章節。
 *
 * 用 <a> 而非 next/link：href 會在 hydration 後改變，而且不需要 prefetch
 * 一個馬上就會被換掉的網址。
 */
export function SubjectLink({
  subjectId,
  fallbackHref,
  children,
  ...rest
}: SubjectLinkProps) {
  const store = useReadingStore();
  const href = store.bySubject[subjectId] ? entryHref(store, subjectId) : fallbackHref;

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
