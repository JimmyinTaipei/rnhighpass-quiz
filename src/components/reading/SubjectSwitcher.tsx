"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Stethoscope } from "lucide-react";
import { groupSubjects, subjectGroup } from "@/lib/subject-groups";
import { entryHref, useReadingStore } from "@/lib/reading-position";
import type { NavScope } from "@/lib/reading-nav";
import type { Subject } from "@/lib/types";

interface SubjectSwitcherProps {
  subjects: Subject[];
  /** 目前所在的軸：科目，或(demo)疾病標籤 */
  current: NavScope;
}

/**
 * 側邊欄最上方的科目切換。依五大類分組，選了之後直接進該科的「上次位置」。
 *
 * 連結的 href 讀 localStorage。useReadingStore 的 server snapshot 是空的，
 * 所以 SSR 與首次 client render 一致，不會 hydration mismatch。
 */
export function SubjectSwitcher({ subjects, current }: SubjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // 寬螢幕側邊欄與窄螢幕目錄會同時掛載兩份，id 必須各自唯一
  const menuId = useId();
  const groups = groupSubjects(subjects);
  // 每一科的連結都指向該科的「上次位置」，沒紀錄就退回 /subjects/<id>(server redirect)
  const store = useReadingStore();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-base font-semibold text-subj-deep transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none"
      >
        <span className="min-w-0 flex-1 truncate">{current.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute left-0 right-0 z-20 mt-1 max-h-[60vh] overflow-y-auto rounded-card bg-card p-1.5 shadow-lg ring-1 ring-card-border"
        >
          {groups.map((g) => (
            <div key={g.id} className="mb-1 last:mb-0">
              <p className="px-2 py-1 text-xs text-muted">{g.label}</p>
              {g.subjects.map((s) => {
                const isCurrent = current.kind === "subject" && current.id === s.id;
                return (
                  <a
                    key={s.id}
                    href={entryHref(store, s.id)}
                    data-group={subjectGroup(s)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none ${
                      isCurrent ? "font-medium text-subj-deep" : "text-body"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{s.name}</span>
                    {isCurrent && <Check size={14} className="shrink-0 text-subj-accent" />}
                  </a>
                );
              })}
            </div>
          ))}

          {/* 第二條軸(demo)。疾病標籤是跨科的，所以不放在任何一個大類底下，
              而是自成一區，連到 /diseases 由那邊的 redirect 決定落在哪個標籤。 */}
          <div className="mt-1 border-t border-card-border pt-1">
            <Link
              href="/diseases"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-body transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subj-accent motion-reduce:transition-none"
            >
              <Stethoscope size={14} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate">依疾病瀏覽</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
