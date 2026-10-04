"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 250;
const LEARN = "/learn";

interface KnowledgeSearchBoxProps {
  /**
   * live(預設):邊打邊搜。在 /learn 只改網址 ?q=;在系統頁、速查頁打字就導到 /learn?q=。
   *   放在知識庫瀏覽頁的 layout,換頁時元件不會重建,輸入框不會失去焦點。
   * submit:按 Enter 才導到 /learn?q=(章節頁用:跨 layout 換頁會失去焦點,邊打邊跳會打斷輸入)。
   */
  mode?: "live" | "submit";
  className?: string;
}

/** 知識庫搜尋框。結果一律顯示在知識庫首頁(/learn?q=),由 server 端全文搜尋。 */
export function KnowledgeSearchBox({ mode = "live", className = "" }: KnowledgeSearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname === LEARN ? (searchParams.get("q") ?? "") : "";
  const [q, setQ] = useState(urlQuery);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 網址上的搜尋詞變了(上一頁、點側欄換到系統頁)就跟著網址走。
  // 自己送出的詞(sent)不回寫:網址更新前使用者可能又多打了字,回寫會把後來打的字蓋掉。
  const [sent, setSent] = useState<string | null>(null);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    if (urlQuery !== sent) {
      setQ(urlQuery);
      setSent(null);
    }
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const go = (value: string) => {
    const term = value.trim();
    setSent(term);
    if (pathname === LEARN) {
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("q", term);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${LEARN}?${qs}` : LEARN, { scroll: false });
    } else if (term) {
      router.push(`${LEARN}?q=${encodeURIComponent(term)}`);
    }
  };

  const onChange = (value: string) => {
    setQ(value);
    if (mode !== "live") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => go(value), DEBOUNCE_MS);
  };

  return (
    <form
      role="search"
      className={`relative block ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        go(q);
      }}
    >
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={q}
        onChange={(e) => onChange(e.target.value)}
        aria-label="搜尋知識庫"
        placeholder="搜尋知識庫(如 Kussmaul、SGLT2、HbA1c)"
        className="w-full rounded-btn bg-fill py-2 pr-3 pl-9 text-[15px] text-strong outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40"
      />
    </form>
  );
}
