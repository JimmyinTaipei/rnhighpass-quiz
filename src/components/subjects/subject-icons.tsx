import {
  BookOpen,
  Brain,
  CalendarDays,
  Baby,
  HeartPulse,
  House,
  Microscope,
  Pill,
  Syringe,
  Virus,
} from "lucide-react";

// 科目卡片左側的線條 icon。
// 大部分用 lucide-react；lucide 沒有「手術刀」與「產婦」，這兩個用開源 icon 改寫成
// 跟 lucide 相同的介面(size / className / strokeWidth，顏色走 currentColor)。
//   - ScalpelIcon：System UIcons "scalpel"(Unlicense) https://systemuicons.com
//     原始 viewBox 是 0 0 21 21，但圖形只佔中間一小塊，這裡裁到圖形範圍讓大小跟其他 icon 一致
//   - PregnantIcon：IconPark "pregnant-women" outline(Apache-2.0) https://github.com/bytedance/IconPark

interface IconProps {
  size?: number;
  className?: string;
  /** 以 lucide 的 24px 畫布為基準的線寬(預設 2)，各 icon 會依自己的 viewBox 換算 */
  strokeWidth?: number;
}

type IconComponent = React.ComponentType<IconProps>;

export function ScalpelIcon({ size = 24, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="1.5 3 16.5 16.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={(strokeWidth * 16.5) / 24}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 15l7-7a1.414 1.414 0 0 0-2-2L3.5 16.5h7L7 13" />
    </svg>
  );
}

export function PregnantIcon({ size = 24, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={(strokeWidth * 48) / 24}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinejoin="round"
        d="M33 4v7.519q10.968 6.291 9.906 16.742T33 44M13.772 4q-3.207.555-4.616 3.758C7.746 10.96 5 21.964 5 23.726s3.568 6.509 12.052 13.71c3.931 3.336 6.255 3.166 7.513.928s-.407-3.674-2.515-5.327c-3.863-3.029-8.948-7.822-8.948-9.926q0-2.104 3.95-12.824"
      />
      <path d="M8.201 28.94a95 95 0 0 0 2.8 15M33 19.944q2.32 1.542 3 4.012q.68 2.472.396 4.506" />
    </svg>
  );
}

/** 以科目名稱(subjects.name)對應 icon */
const SUBJECT_ICONS: Record<string, IconComponent> = {
  生解: HeartPulse,
  病理: Microscope,
  藥理: Pill,
  微免: Virus,
  基護: Syringe,
  行政: CalendarDays,
  內外: ScalpelIcon,
  產科: PregnantIcon,
  兒科: Baby,
  精神: Brain,
  社區: House,
};

/** 找不到對應(例如之後新增科目)時用書本 icon，不會讓頁面壞掉 */
export function subjectIcon(subjectName: string): IconComponent {
  return SUBJECT_ICONS[subjectName] ?? BookOpen;
}
