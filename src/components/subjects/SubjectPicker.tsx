import Link from "next/link";
import { groupSubjects } from "@/lib/subject-groups";
import { UNCATEGORIZED } from "@/lib/notebook";
import type { Subject } from "@/lib/types";

interface SubjectPickerProps {
  subjects: Subject[];
  /** 每科的數字(錯題數、作答數…)；沒有的科目視為 0 並淡化 */
  counts: Map<string, number>;
  selected: string | null;
  /** 產生切換到某科的連結(server component，可以直接傳函式) */
  hrefFor: (subjectId: string) => string;
  unit?: string;
}

/**
 * 科目選擇器：依五大類分組的一排小方塊，每塊顯示數字。
 * 我的題本、統計、比較表共用。每一塊掛 data-group，顏色跟著科目類別走。
 */
export function SubjectPicker({ subjects, counts, selected, hrefFor, unit = "題" }: SubjectPickerProps) {
  const groups = groupSubjects(subjects);
  const uncategorized = counts.get(UNCATEGORIZED) ?? 0;

  const chip = (id: string, name: string, group?: string) => {
    const count = counts.get(id) ?? 0;
    const active = selected === id;
    return (
      <Link
        key={id}
        href={hrefFor(id)}
        scroll={false}
        data-group={group}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-1.5 rounded-btn border px-2.5 py-1.5 text-sm transition-colors ${
          active
            ? "border-subj-accent bg-subj-light font-bold text-subj-deep"
            : count === 0
              ? "border-card-border bg-card text-muted opacity-60 hover:opacity-100"
              : "border-card-border bg-card text-body hover:border-subj-accent"
        }`}
      >
        <span>{name}</span>
        <span className={`text-xs ${active ? "text-subj-deep" : "text-muted"}`}>
          {count}
          {unit}
        </span>
      </Link>
    );
  };

  return (
    <nav aria-label="選擇科目" className="flex flex-col gap-2">
      {groups.map((g) => (
        <div key={g.id} className="flex flex-wrap items-center gap-1.5">
          <span className="w-16 shrink-0 text-xs text-muted">{g.label}</span>
          {g.subjects.map((s) => chip(s.id, s.name, g.id))}
        </div>
      ))}
      {uncategorized > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-16 shrink-0 text-xs text-muted">其他</span>
          {chip(UNCATEGORIZED, "未分類")}
        </div>
      )}
    </nav>
  );
}
