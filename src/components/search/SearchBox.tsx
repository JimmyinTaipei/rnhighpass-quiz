"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜尋題幹、考點、筆記卡…"
          className="w-full rounded-btn bg-fill py-2 pr-3 pl-9 text-sm text-strong placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-subj-accent/40"
        />
      </div>
      <button
        type="submit"
        className="rounded-btn bg-subj-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        搜尋
      </button>
    </form>
  );
}
