export function MatchSnippet({ snippet, label }: { snippet: [string, string, string] | null | undefined; label?: string }) {
  if (!snippet) return null;
  return <span className="mt-1 block break-words text-sm leading-relaxed text-body">{label && <span className="mr-1 font-medium text-muted">{label}：</span>}{snippet[0]}<mark className="rounded bg-light px-0.5 text-deep">{snippet[1]}</mark>{snippet[2]}</span>;
}
