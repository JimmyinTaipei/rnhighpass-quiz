import { highlightParts } from "@/lib/search";

export function HighlightText({ text, query }: { text: string; query: string }) {
  return highlightParts(text, query).map((part, index) => part.match
    ? <mark key={index} className="rounded bg-light px-0.5 text-deep">{part.text}</mark>
    : part.text);
}
