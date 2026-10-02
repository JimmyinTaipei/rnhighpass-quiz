import { BookOpen } from "lucide-react";
import type { KnowledgeCard } from "@/lib/types";

interface NoteCardProps {
  card: KnowledgeCard & { bullets: string[] };
}

export function NoteCard({ card }: NoteCardProps) {
  return (
    <div className="mb-3 rounded-card bg-(--surface-inset) p-4 sm:p-5">
      <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-accent">
        <BookOpen size={13} />
        考點筆記
      </p>
      <h3 className="text-[17px] font-semibold text-strong">{card.card_title}</h3>
      {card.card_subtitle && <p className="mt-0.5 text-sm text-muted">{card.card_subtitle}</p>}
      {card.bullets.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-strong marker:text-accent">
          {card.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
