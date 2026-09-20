import type { Mark } from "@/lib/mock-exam/session";

export const MARK_OPTIONS: { value: Mark; symbol: string; className: string; label: string }[] = [
  { value: "triangle", symbol: "▲", className: "text-warning", label: "三角形註記" },
  { value: "circle", symbol: "●", className: "text-incorrect", label: "圓形註記" },
  { value: "square", symbol: "■", className: "text-accent", label: "方形註記" },
];

export function markInfo(mark: Mark | undefined) {
  return MARK_OPTIONS.find((m) => m.value === mark);
}
