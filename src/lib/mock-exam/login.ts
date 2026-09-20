// 模擬登入：只檢查身分證字號「格式」，刻意不保存號碼本身。
// sessionStorage 只記一個「已登入」旗標，關閉分頁就要重新登入。

const LOGIN_KEY = "mock-exam:login";
export const DEFAULT_AFTER_LOGIN = "/mock-exam/select";
export const MOCK_ID_LENGTH = 10;

/** 1 個英文字母 + 9 碼數字。不驗檢查碼，只是模擬登入流程 */
export function isValidMockId(id: string): boolean {
  return /^[A-Z]\d{9}$/.test(id);
}

/** 第 position 碼(0 起算)能不能輸入 char：第 1 碼只能字母，其餘只能數字 */
export function canTypeAt(position: number, char: string): boolean {
  if (position >= MOCK_ID_LENGTH) return false;
  return position === 0 ? /^[A-Z]$/.test(char) : /^\d$/.test(char);
}

export function markLoggedIn() {
  try {
    sessionStorage.setItem(LOGIN_KEY, "1");
  } catch {
    // 無法寫入(封鎖網站資料等)：isLoggedIn 讀取失敗時會放行，不影響使用
  }
}

export function isLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(LOGIN_KEY) === "1";
  } catch {
    // 讀不到 sessionStorage 時放行，避免使用者被卡在登入頁
    return true;
  }
}

/** 登入後要回到的路徑，只接受模擬考內部路徑，避免 ?next= 被拿來導向外站 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/mock-exam/") || raw.includes("//") || raw.includes("\\")) {
    return DEFAULT_AFTER_LOGIN;
  }
  return raw;
}
