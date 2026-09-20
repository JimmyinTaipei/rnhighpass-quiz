// 模擬考用的文字與常數。刻意不 import 主站的 subject-groups.ts，
// 讓 src/lib/mock-exam 整包搬到別的專案時不需要帶其他檔案。

export const MOCK_GROUP_IDS = ["BM", "FA", "MS", "OP", "PC"] as const;
export type MockGroupId = (typeof MOCK_GROUP_IDS)[number];

/** 護理師考試的五個科目(考選部正式名稱) */
export const GROUP_FULL_NAMES: Record<MockGroupId, string> = {
  BM: "基礎醫學",
  FA: "基本護理學與護理行政",
  MS: "內外科護理學",
  OP: "產兒科護理學",
  PC: "精神科與社區衛生護理學",
};

export function isMockGroupId(v: string): v is MockGroupId {
  return (MOCK_GROUP_IDS as readonly string[]).includes(v);
}

/**
 * 模擬考頁首「回主畫面」的目的地。模擬考裡唯一連出去的地方就是這裡，
 * 整包搬到獨立網站時只要改這一行(或設為 null 隱藏按鈕)。
 */
export const SITE_HOME: { href: string; label: string } | null = {
  href: "/",
  label: "回主畫面",
};

/** 每節考試時間 */
export const EXAM_DURATION_MS = 60 * 60 * 1000;
/** 剩餘時間少於這個值時，計時器轉為警示色 */
export const TIME_WARNING_MS = 5 * 60 * 1000;
/** 考前等候頁的倒數時間(考選部練習網站約 2 分鐘) */
export const WAITING_DURATION_MS = 2 * 60 * 1000;

/**
 * 確認頁與等候頁上顯示的應考人資料。一律用固定的模擬值，
 * 刻意不使用登入時輸入的身分證號(那個號碼不會被保存)。
 */
export const MOCK_CANDIDATE = {
  name: "應考人 先生/女士",
  seatNo: "10100001",
  seat: "A01",
} as const;

/** 沒有指定時優先顯示的考卷 */
export const DEFAULT_SITTING = "115-2";

const SITTING_ORDINALS = ["", "一", "二", "三", "四"];

/** '115-2' -> '115 年第二次' */
export function formatSitting(sitting: string, isMakeup = false): string {
  const [year, no] = sitting.split("-");
  const ordinal = SITTING_ORDINALS[Number(no)] ?? no;
  return `${year} 年第${ordinal}次${isMakeup ? "（補考）" : ""}`;
}

/** 完整考試名稱，顯示在確認頁與作答頁頂端 */
export function examTitle(sitting: string, isMakeup = false): string {
  return `${formatSitting(sitting, isMakeup)}專門職業及技術人員高等考試 護理師（模擬）`;
}

// ===== 考卷在網址上的代號 =====
// 一般梯次就是 '115-2'；補考加上 '-makeup'，例如 '106-2-makeup'
// (補考與正式考試同一個 exam_sitting，只靠 is_makeup 區分)。

export interface PaperKey {
  sitting: string;
  isMakeup: boolean;
}

export function paperSlug({ sitting, isMakeup }: PaperKey): string {
  return isMakeup ? `${sitting}-makeup` : sitting;
}

export function parsePaperSlug(slug: string): PaperKey | null {
  const m = slug.match(/^(\d{3}-\d)(-makeup)?$/);
  if (!m) return null;
  return { sitting: m[1], isMakeup: !!m[2] };
}
