"use client";

import Link from "next/link";
import { Printer } from "lucide-react";

export interface PrintOption {
  label: string;
  choices: { label: string; href: string; active: boolean }[];
}

/** 列印頁頂端工具列。列印時整條隱藏(print:hidden)。 */
export function PrintToolbar({ title, options = [] }: { title: string; options?: PrintOption[] }) {
  return (
    <div className="sticky top-0 z-10 border-b border-card-border bg-card/95 px-4 py-3 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2">
        <span className="font-bold text-deep">{title}</span>
        {options.map((o) => (
          <div key={o.label} className="flex items-center gap-1.5 text-xs">
            <span className="text-muted">{o.label}</span>
            {o.choices.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                replace
                className={`rounded-full border px-2.5 py-0.5 ${
                  c.active ? "border-accent bg-light font-bold text-deep" : "border-card-border text-body"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        ))}
        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-1.5 rounded-btn bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-deep"
        >
          <Printer size={16} />
          列印 / 另存 PDF
        </button>
      </div>
      <p className="mx-auto mt-1 max-w-4xl text-xs text-muted">
        在列印視窗的「目的地」選「另存為 PDF」即可下載。建議勾選「背景圖形」以保留表格底色。
      </p>
    </div>
  );
}
