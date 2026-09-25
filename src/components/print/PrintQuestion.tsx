import { OPTION_KEYS, parseAcceptedAnswers } from "@/lib/quiz-utils";
import type { Question } from "@/lib/types";

/** 詳解四欄(沒有就用 explanation_text)，與 QuestionCard 的顯示規則一致 */
export function explanationParts(q: Question): { label: string; text: string }[] {
  const parts = [
    { label: "考點", text: q.key_point },
    { label: "正解原因", text: q.correct_reason },
    { label: "其他選項為何錯", text: q.wrong_options_reason },
    { label: "延伸提醒", text: q.extra_notes },
  ].filter((p): p is { label: string; text: string } => !!p.text);
  return parts.length > 0 ? parts : [{ label: "詳解", text: q.explanation_text }];
}

export function answerLabel(q: Question): string {
  const accepted = parseAcceptedAnswers(q.answer);
  if (accepted.length === 0) return "送分";
  return accepted.join("、");
}

export function PrintExplanation({ question }: { question: Question }) {
  return (
    <div className="mt-2 space-y-1 border-l-2 border-card-border pl-3 text-xs leading-relaxed">
      {explanationParts(question).map((p) => (
        <p key={p.label} className="whitespace-pre-wrap">
          <strong className="text-deep">{p.label}：</strong>
          {p.text}
        </p>
      ))}
    </div>
  );
}

/** 一題的列印版。選項一律依原始 A–D 順序(不打亂)，方便對照答案。 */
export function PrintQuestion({
  question,
  no,
  showAnswer,
}: {
  question: Question;
  no: number;
  showAnswer: boolean;
}) {
  const options = [question.option_a, question.option_b, question.option_c, question.option_d];
  const accepted = parseAcceptedAnswers(question.answer);
  return (
    <article className="break-inside-avoid border-b border-card-border py-3 text-sm">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-bold text-deep">{no}.</span>
        <span className="text-xs text-muted">{question.source_text}</span>
      </div>
      <p className="mb-2 whitespace-pre-wrap leading-relaxed text-strong">{question.stem}</p>
      <ol className="space-y-0.5 pl-1">
        {OPTION_KEYS.map((key, i) =>
          options[i] ? (
            <li
              key={key}
              className={showAnswer && accepted.includes(key) ? "font-bold text-correct-text" : "text-strong"}
            >
              ({key}) {options[i]}
            </li>
          ) : null,
        )}
      </ol>
      {showAnswer && (
        <>
          <p className="mt-2 text-xs font-bold text-deep">答案：{answerLabel(question)}</p>
          <PrintExplanation question={question} />
        </>
      )}
    </article>
  );
}
