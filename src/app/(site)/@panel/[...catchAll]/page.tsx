/**
 * 從面板導向別頁(例如點「出現在」的章節連結)時，slot 會保留上一個狀態，
 * 面板就會留在新頁面上。這個 catch-all 讓其他所有網址把 @panel 清空。
 */
export default function PanelCatchAll() {
  return null;
}
