import { BookOpen } from "lucide-react";
import type { KnowledgeCard } from "@/lib/types";

interface NoteCardProps {
  card: KnowledgeCard & { bullets: string[] };
}

export function NoteCard({ card }: NoteCardProps) {
  return (
    <div className="mb-3 rounded-card border border-card-border bg-page p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-light px-3 py-1 text-xs font-medium text-deep">
          <BookOpen size={14} />
          考點筆記
        </div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-deep">{card.card_title}</h3>
      {card.card_subtitle && (
        <p className="mb-4 text-sm text-muted">{card.card_subtitle}</p>
      )}
      {card.bullets.length > 0 && (
        <ul className="space-y-2">
          {card.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-body">
              <span className="mt-1 text-accent">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
