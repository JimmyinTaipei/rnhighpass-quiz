"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eraser,
  FileCheck2,
  Flag,
  Pencil,
} from "lucide-react";
import { OPTION_KEYS, type OptionKey } from "@/lib/quiz-utils";
import type { MockQuestion } from "@/lib/mock-exam/data";
import { EXAM_DURATION_MS, MOCK_CANDIDATE, TIME_WARNING_MS } from "@/lib/mock-exam/labels";
import {
  clearSession,
  createSession,
  gradeSession,
  loadSession,
  remainingMs,
  saveSession,
  type ExamSession,
  type Mark,
} from "@/lib/mock-exam/session";
import { useIsClient } from "@/lib/use-is-client";
import { PageLoader } from "@/components/ui/PageLoader";
import { AnswerSheet } from "./AnswerSheet";
import { ConfirmDialog } from "./ConfirmDialog";
import { MARK_OPTIONS } from "./marks";
import { QuestionView } from "./QuestionView";
import { ResultView } from "./ResultView";
import { ScoreOptionsScreen } from "./ScoreOptionsScreen";
import { WaitingScreen } from "./WaitingScreen";

interface MockExamSessionProps {
  paperSlug: string;
  groupId: string;
  title: string;
  subjectName: string;
  questions: MockQuestion[];
}

type Phase = "confirm" | "scoreOptions" | "waiting" | "exam" | "overview" | "ended" | "result";
type Dialog = "submit" | "submitAgain" | "early" | "restart" | null;

function formatClock(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

interface InitialState {
  phase: Phase;
  session: ExamSession | null;
  /** 上次沒考完的存檔(確認頁用來顯示「繼續作答」) */
  saved: ExamSession | null;
}

/** 從 localStorage 回復上次的狀態(只會在 client 呼叫) */
function restore(paperSlug: string, groupId: string, questions: MockQuestion[]): InitialState {
  const existing = loadSession(paperSlug, groupId, questions);
  if (!existing) return { phase: "confirm", session: null, saved: null };
  if (existing.finishedAt) {
    // 已交卷過：直接回到成績頁，重新整理不會把成績弄丟
    // 選了不顯示成績的，回到「本節考試結束」頁，不直接跳成績
    const phase = existing.showScore === false ? "ended" : "result";
    return { phase, session: existing, saved: null };
  }
  if (remainingMs(existing, Date.now()) <= 0) {
    // 離開期間時間已到：比照時間到自動交卷
    const finished = { ...existing, finishedAt: existing.startedAt + EXAM_DURATION_MS };
    saveSession(paperSlug, groupId, finished);
    return { phase: "ended", session: finished, saved: null };
  }
  return { phase: "confirm", session: null, saved: existing };
}

/**
 * 作答狀態存在 localStorage、選項排列靠亂數，兩者都只能在瀏覽器決定，
 * 所以 hydration 完成前只顯示佔位，之後才掛上真正的考試元件
 * (讓它可以在 useState 的初始化函式裡直接讀 localStorage)。
 */
export function MockExamSession(props: MockExamSessionProps) {
  const isClient = useIsClient();
  if (!isClient) {
    return <PageLoader />;
  }
  return <ExamRunner {...props} />;
}

function ExamRunner({ paperSlug, groupId, title, subjectName, questions }: MockExamSessionProps) {
  const [initial] = useState(() => restore(paperSlug, groupId, questions));
  const [phase, setPhase] = useState<Phase>(initial.phase);
  const [session, setSession] = useState<ExamSession | null>(initial.session);
  const [saved, setSaved] = useState<ExamSession | null>(initial.saved);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [now, setNow] = useState(() => Date.now());
  /** 顯示成績選項頁的選擇，開始作答時寫進 session */
  const [showScore, setShowScore] = useState(true);

  const update = useCallback(
    (fn: (s: ExamSession) => ExamSession) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = fn(prev);
        saveSession(paperSlug, groupId, next);
        return next;
      });
    },
    [paperSlug, groupId],
  );

  const finish = useCallback(() => {
    update((s) => (s.finishedAt ? s : { ...s, finishedAt: Date.now() }));
    setDialog(null);
    setPhase("ended");
  }, [update]);

  const inProgress = phase === "exam" || phase === "overview";

  // 計時器：每秒用 startedAt 重算剩餘時間(不是自己累加)，背景分頁被節流也不會跑掉。
  // 時間到就自動交卷。
  const startedAt = session?.startedAt;
  useEffect(() => {
    if (!inProgress || startedAt === undefined) return;
    const deadline = startedAt + EXAM_DURATION_MS;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= deadline) finish();
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [inProgress, startedAt, finish]);

  const remaining = session ? remainingMs(session, now) : 0;

  // 作答中離開頁面時提醒(進度有存，但避免誤觸)
  useEffect(() => {
    if (!inProgress) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [inProgress]);

  const result = useMemo(
    () => (session?.finishedAt ? gradeSession(session, questions) : null),
    [session, questions],
  );

  /** 開始作答(60 分鐘從這時起算)；resume 時沿用上次的存檔 */
  const start = useCallback(
    (resume: boolean) => {
      const s = resume && saved ? saved : createSession(questions, showScore);
      saveSession(paperSlug, groupId, s);
      setSession(s);
      setSaved(null);
      setNow(Date.now());
      setDialog(null);
      setPhase("exam");
      window.scrollTo(0, 0);
    },
    [saved, questions, showScore, paperSlug, groupId],
  );
  const startFresh = useCallback(() => start(false), [start]);

  /** 從確認頁往下走：顯示成績選項 → 考前等候 → 作答 */
  function proceedToScoreOptions() {
    clearSession(paperSlug, groupId);
    setSaved(null);
    setDialog(null);
    setPhase("scoreOptions");
    window.scrollTo(0, 0);
  }

  function restart() {
    clearSession(paperSlug, groupId);
    setSession(null);
    setSaved(null);
    setPhase("confirm");
    window.scrollTo(0, 0);
  }

  // ===== 顯示成績選項(step 3-1) =====
  if (phase === "scoreOptions") {
    return (
      <ScoreOptionsScreen
        onConfirm={(choice) => {
          setShowScore(choice);
          setPhase("waiting");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // ===== 考前等候(step 4) =====
  if (phase === "waiting") {
    return <WaitingScreen title={title} subjectName={subjectName} onStart={startFresh} />;
  }

  // ===== 確認頁 =====
  if (phase === "confirm" || !session) {
    return (
      <ConfirmScreen
        title={title}
        subjectName={subjectName}
        count={questions.length}
        saved={saved}
        now={now}
        onStart={() => (saved ? setDialog("restart") : proceedToScoreOptions())}
        onResume={() => start(true)}
        dialog={dialog === "restart"}
        onConfirmRestart={proceedToScoreOptions}
        onCancelRestart={() => setDialog(null)}
      />
    );
  }

  // ===== 本節考試結束 =====
  if (phase === "ended") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-card border border-card-border bg-card px-6 py-16 text-center shadow-sm">
        <FileCheck2 size={40} className="text-deep" />
        <h1 className="text-2xl font-bold text-strong">本節考試結束！</h1>
        <p className="text-sm text-muted">{subjectName}</p>
        {session.showScore !== false ? (
          <button
            type="button"
            onClick={() => setPhase("result")}
            className="rounded-btn bg-deep px-6 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
          >
            查看成績
          </button>
        ) : (
          <>
            <p className="text-sm text-body">依你考前的選擇，本節不顯示成績。</p>
            <button
              type="button"
              onClick={() => setPhase("result")}
              className="rounded-btn border border-card-border bg-card px-5 py-2 text-sm text-body hover:bg-page"
            >
              仍要查看成績
              <span className="block text-xs text-warning">
                （正式考試選「否」將無法查看・僅供練習用）
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <ResultView
        title={title}
        subjectName={subjectName}
        questions={questions}
        session={session}
        result={result}
        onRestart={restart}
      />
    );
  }

  // ===== 作答中 =====
  const answeredCount = questions.filter((q) => session.answers[q.id]).length;
  const unansweredCount = questions.length - answeredCount;
  const allAnswered = unansweredCount === 0;
  const index = Math.min(session.index, questions.length - 1);
  const question = questions[index];
  const order = session.orders[question.id] ?? [...OPTION_KEYS];
  const points = 100 / questions.length;
  const isWarning = remaining <= TIME_WARNING_MS;

  const goTo = (i: number) => {
    update((s) => ({ ...s, index: Math.max(0, Math.min(questions.length - 1, i)) }));
    window.scrollTo(0, 0);
  };
  const select = (original: OptionKey) =>
    update((s) => ({ ...s, answers: { ...s.answers, [question.id]: original } }));
  const clearAnswer = () =>
    update((s) => {
      const answers = { ...s.answers };
      delete answers[question.id];
      return { ...s, answers };
    });
  const setMark = (mark: Mark | null) =>
    update((s) => {
      const marks = { ...s.marks };
      if (mark) marks[question.id] = mark;
      else delete marks[question.id];
      return { ...s, marks };
    });

  const navButtons = (
    <div className="flex gap-2">
      <ToolButton onClick={() => goTo(index - 1)} disabled={index === 0}>
        <ChevronLeft size={16} />
        上一題
      </ToolButton>
      <ToolButton onClick={() => goTo(index + 1)} disabled={index === questions.length - 1}>
        下一題
        <ChevronRight size={16} />
      </ToolButton>
      <ToolButton onClick={clearAnswer} disabled={!session.answers[question.id]}>
        <Eraser size={16} />
        取消作答
      </ToolButton>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 頂部資訊列 */}
      <header className="overflow-hidden rounded-card border border-card-border bg-card shadow-sm">
        <div className="bg-light px-4 py-2 text-sm font-bold text-deep">考試名稱：{title}</div>
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
          <div className="space-y-2 text-sm text-body">
            <p>
              科目：<span className="font-medium text-strong">{subjectName}</span>
            </p>
            <dl className="flex flex-wrap gap-x-5 gap-y-1">
              <Stat label="題數" value={questions.length} />
              <Stat label="已作答題數" value={answeredCount} />
              <Stat label="未作答題數" value={unansweredCount} />
              <div className="flex items-baseline gap-1">
                <dt>剩餘時間：</dt>
                <dd
                  className={`font-mono text-base font-bold tabular-nums ${
                    isWarning ? "animate-pulse text-incorrect" : "text-deep"
                  }`}
                  aria-live={isWarning ? "polite" : "off"}
                >
                  {formatClock(remaining)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap justify-end gap-2">
              {phase === "exam" ? (
                <ToolButton onClick={() => setPhase("overview")}>
                  <ClipboardList size={16} />
                  瀏覽作答情形
                </ToolButton>
              ) : (
                <ToolButton onClick={() => setPhase("exam")}>
                  <Pencil size={16} />
                  繼續作答
                </ToolButton>
              )}
              <button
                type="button"
                onClick={() => setDialog("submit")}
                disabled={!allAnswered}
                title={allAnswered ? undefined : `還有 ${unansweredCount} 題未作答`}
                className="flex items-center gap-1.5 rounded-btn bg-deep px-3 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileCheck2 size={16} />
                結束作答
              </button>
            </div>
            {!allAnswered && (
              <p className="text-xs text-muted">全部作答完才能結束作答</p>
            )}
            <button
              type="button"
              onClick={() => setDialog("early")}
              className="flex items-center gap-1 rounded-full border border-dashed border-warning px-2.5 py-0.5 text-xs text-body hover:bg-warning/10"
            >
              <Flag size={12} className="text-warning" />
              提前交卷
              <span className="text-warning">（國考無此選項・僅供練習用）</span>
            </button>
          </div>
        </div>
      </header>

      {phase === "overview" ? (
        <section className="rounded-card border border-card-border bg-card p-4 shadow-sm">
          <AnswerSheet
            activeId={question.id}
            onSelect={(id) => {
              goTo(questions.findIndex((q) => q.id === id));
              setPhase("exam");
            }}
            cells={questions.map((q, i) => {
              const original = session.answers[q.id];
              const pos = original ? (session.orders[q.id] ?? []).indexOf(original) : -1;
              return {
                id: q.id,
                number: i + 1,
                answer: pos >= 0 ? OPTION_KEYS[pos] : "",
                mark: session.marks[q.id],
              };
            })}
          />
          <p className="mt-3 text-xs text-muted">
            注意事項：1. 上方顯示所有題目之題號及作答答案　2. 若為
            <span className="text-incorrect">紅色</span>
            底色代表尚未作答　3. 題號旁的符號是你的輔助作答註記　4. 點題號可直接跳到該題
          </p>
        </section>
      ) : (
        <>
          {/* 工具列 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {navButtons}
            <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body">
              <legend className="sr-only">輔助作答註記</legend>
              <span className="text-strong">輔助作答註記</span>
              {MARK_OPTIONS.map((m) => (
                <label key={m.value} className="flex cursor-pointer items-center gap-1">
                  <input
                    type="radio"
                    name="mark"
                    checked={session.marks[question.id] === m.value}
                    onChange={() => setMark(m.value)}
                    className="accent-[var(--color-deep)]"
                  />
                  <span className={m.className} aria-label={m.label}>
                    {m.symbol}
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="mark"
                  checked={!session.marks[question.id]}
                  onChange={() => setMark(null)}
                  className="accent-[var(--color-deep)]"
                />
                不註記
              </label>
            </fieldset>
            <label className="flex items-center gap-1.5 text-sm text-strong">
              目前在第
              <select
                value={index}
                onChange={(e) => goTo(Number(e.target.value))}
                className="rounded-btn border border-card-border bg-card px-2 py-1 text-sm"
              >
                {questions.map((q, i) => (
                  <option key={q.id} value={i}>
                    {i + 1}
                    {session.answers[q.id] ? "" : "（未答）"}
                  </option>
                ))}
              </select>
              題
            </label>
          </div>

          <p className="text-sm text-body">
            本科目測驗試題為單一選擇題，請就各選項中選出一個正確或最適當的答案，複選作答者，該題不予計分！
          </p>

          <div className="rounded-card border border-card-border bg-card p-5 shadow-sm">
            <QuestionView
              question={question}
              number={index + 1}
              points={points}
              order={order}
              selected={session.answers[question.id]}
              zoom={session.zoom}
              onSelect={select}
              onZoom={(zoom) => update((s) => ({ ...s, zoom }))}
            />
          </div>

          {navButtons}
        </>
      )}

      {dialog === "submit" && (
        <ConfirmDialog
          title="注意：結束作答視同繳卷"
          message="是否結束本次應考？"
          onConfirm={() => setDialog("submitAgain")}
          onCancel={() => setDialog(null)}
        />
      )}
      {/* 第二次確認：避免一時手快誤交卷 */}
      {dialog === "submitAgain" && (
        <ConfirmDialog
          title="注意：結束作答視同繳卷"
          message="再次確認是否結束本次應考？"
          onConfirm={finish}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === "early" && (
        <ConfirmDialog
          title="提前交卷（僅供練習用）"
          message={
            <>
              <p>正式國考沒有這個選項，必須全部作答完才能結束作答。</p>
              <p className="mt-2">
                目前還有 <span className="font-bold text-incorrect">{unansweredCount}</span>{" "}
                題未作答，未作答的題目以 0 分計算。確定要交卷嗎？
              </p>
            </>
          }
          confirmLabel="確定交卷"
          onConfirm={finish}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <dt>{label}：</dt>
      <dd className="font-bold text-incorrect">{value}</dd>
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 rounded-btn border border-card-border bg-card px-3 py-1.5 text-sm font-medium text-body shadow-sm transition-colors hover:border-accent hover:text-deep disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ConfirmScreen({
  title,
  subjectName,
  count,
  saved,
  now,
  onStart,
  onResume,
  dialog,
  onConfirmRestart,
  onCancelRestart,
}: {
  title: string;
  subjectName: string;
  count: number;
  saved: ExamSession | null;
  now: number;
  onStart: () => void;
  onResume: () => void;
  dialog: boolean;
  onConfirmRestart: () => void;
  onCancelRestart: () => void;
}) {
  const savedAnswered = saved ? Object.keys(saved.answers).length : 0;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-card border border-card-border bg-card p-6 shadow-sm sm:p-8">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-strong">
          <dt className="text-muted">考試名稱</dt>
          <dd className="font-medium">{title}</dd>
          <dt className="text-muted">類科</dt>
          <dd>護理師</dd>
          <dt className="text-muted">科目</dt>
          <dd className="font-medium">{subjectName}</dd>
          <dt className="text-muted">姓名</dt>
          <dd>{MOCK_CANDIDATE.name}</dd>
          <dt className="text-muted">座號</dt>
          <dd>
            {MOCK_CANDIDATE.seatNo}
            <span className="ml-6 text-muted">應試座位：</span>
            {MOCK_CANDIDATE.seat}
          </dd>
          {/* 以下是本站補充的資訊，正式考試的確認頁不一定會顯示，所以做成次要樣式 */}
          <dt className="text-sm text-muted/80">題數</dt>
          <dd className="text-sm text-muted">
            {count} 題（單一選擇題，每題 {Number((100 / count).toFixed(2))} 分）
          </dd>
          <dt className="text-sm text-muted/80">考試時間</dt>
          <dd className="text-sm text-muted">60 分鐘</dd>
        </dl>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-body">
          <li>選項順序已打亂，與題本不同（正式考試每位應考人的選項順序也不同）。</li>
          <li>全部題目作答完才能按「結束作答」；時間到會自動交卷。</li>
          <li>作答進度會自動保存在這台裝置的瀏覽器，重新整理不會遺失，但計時不會暫停。</li>
        </ul>

        {saved && (
          <div className="mt-6 rounded-btn border border-accent bg-light/60 p-4 text-sm text-body">
            你有一份還沒交卷的作答（已作答 {savedAnswered} / {count} 題，剩餘{" "}
            {formatClock(remainingMs(saved, now))}）。
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {saved && (
            <button
              type="button"
              onClick={onResume}
              className="min-w-28 rounded-btn bg-deep px-6 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
            >
              繼續作答
            </button>
          )}
          <button
            type="button"
            onClick={onStart}
            className={
              saved
                ? "min-w-28 rounded-btn border border-card-border bg-card px-6 py-2.5 text-sm font-medium text-body hover:bg-page"
                : "min-w-28 rounded-btn bg-deep px-6 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
            }
          >
            {saved ? "重新開始" : "確定"}
          </button>
          <Link
            href="/mock-exam/select"
            className="min-w-28 rounded-btn border border-card-border bg-card px-6 py-2.5 text-center text-sm font-medium text-body hover:bg-page"
          >
            取消
          </Link>
        </div>
      </div>

      {dialog && (
        <ConfirmDialog
          title="重新開始？"
          message="上一份還沒交卷的作答會被清除，計時重新開始。"
          confirmLabel="重新開始"
          onConfirm={onConfirmRestart}
          onCancel={onCancelRestart}
        />
      )}
    </div>
  );
}
