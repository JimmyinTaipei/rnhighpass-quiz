import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// shadcn 慣例的 class 合併工具：clsx 處理條件式，twMerge 讓後面的 Tailwind class 覆蓋前面衝突的
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
