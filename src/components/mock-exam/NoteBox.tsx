/**
 * 本站補充的備註框。虛線框＋淡黃底，跟考選部畫面上原本就有的內容做出區隔。
 */
export function NoteBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside
      className={`rounded-btn border border-dashed border-warning bg-warning/10 p-4 text-left text-sm leading-relaxed text-body ${className}`}
    >
      <p className="mb-1 font-bold text-warning">本站備註</p>
      {children}
    </aside>
  );
}
