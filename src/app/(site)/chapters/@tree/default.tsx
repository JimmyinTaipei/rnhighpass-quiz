// 平行路由必備：slot 配不到路由時(例如 /chapters/<id>/quiz、或整頁重載時的
// 未匹配狀態)的 fallback。側邊欄在那些情況本來就不顯示，所以回 null。
export default function Default() {
  return null;
}
