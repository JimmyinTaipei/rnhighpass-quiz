"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eraser,
  Settings2,
  Timer,
} from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { AnswerSheet, type AnswerSheetCell } from "@/components/mock-exam/AnswerSheet";
import { ConfirmDialog } from "@/components/mock-exam/ConfirmDialog";
import { submitAnswers, type AnswerRow } from "@/lib/actions";
import { setPreference, usePreferences, type Preferences } from "@/lib/preferences";
import {
  isAnswerCorrect,
  OPTION_KEYS,
  shuffledOptionOrder,
  type OptionKey,
} from "@/lib/quiz-utils";
import { pillGray, pillTint } from "@/lib/ui";
import type { KnowledgeRef } from "@/lib/knowledge/exam";
import type { Question } from "@/lib/types";

const AUTO_ADVANCE_DELAY_MS = 700;
/** 左右滑動換題：水平位移至少這麼多，而且要比垂直位移大(避免跟上下捲動衝突) */
const SWIPE_MIN_PX = 60;

interface ChapterQuizRunnerProps {
  /**
   * 麵包屑顯示的範圍描述，例如「生解 / Ch09 消化系統」或「生解 / 3 章・50 題」。
   * 跨章節測驗(沒有單一章節可言)也能沿用同一個 runner。
   */
  scopeLabel: string;
  questions: Question[];
  isLoggedIn: boolean;
  /** 由 server 端 getDevMode() 決定，只影響是否顯示編輯工具 */
  devMode?: boolean;
  /** 來源頁：結束頁的按鈕與「離開」都回這裡 */
  reviewHref?: string;
  /** 上面那顆按鈕的文字，要跟 reviewHref 指的地方一致 */
  reviewLabel?: string;
  /** 寫進 user_answers.quiz_mode；重做錯題時是 "mistakes" */
  mode?: string;
  /** 題目 id -> 相關知識頁，看詳解時可以直接打開知識面板 */
  knowledgeByQuestion?: Record<string, KnowledgeRef[]>;
}

interface AnswerState {
  /** 目前選的選項(可取消、可改) */
  selected: OptionKey | null;
  /** 第一次選的選項：立即對答模式以它為紀錄(看過詳解再改答不算數) */
  first: OptionKey | null;
}

type Dialog = null | "leave" | "submit" | "sheet" | "settings";

function formatClock(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * 做題頁。操作參考模擬考(上一題、下一題、取消作答、瀏覽作答情形、跳題)，外觀維持主站樣式。
 *
 * 作答先留在畫面上，交卷或離開時才寫入 user_answers(錯題本由它算出)：
 * - 立即對答：選了馬上看詳解，紀錄以「第一次」作答為準。
 * - 交卷後對答：像模擬考，交卷前可以自由改答，紀錄最後的答案。
 * 離開時詢問要不要記錄(預設要)；從側邊欄等攔不到的連結離開時，卸載時照預設記錄。
 */
export function ChapterQuizRunner({
  scopeLabel,
  questions,
  isLoggedIn,
  devMode = false,
  reviewHref = "/mistakes",
  reviewLabel = "回我的題本複習",
  mode = "quiz",
  knowledgeByQuestion,
}: ChapterQuizRunnerProps) {
  const router = useRouter();
  const prefs = usePreferences();
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [recordOnLeave, setRecordOnLeave] = useState(true);
  // 開始作答後就固定對答時機，避免中途切換讓「已看過詳解」的題目變得可以改答
  const [lockedFeedback, setLockedFeedback] = useState<Preferences["feedback"] | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  // 每題的選項順序在開始時決定一次，快捷鍵才能對到畫面上的位置
  const [orders, setOrders] = useState(() =>
    Object.fromEntries(questions.map((q) => [q.id, shuffledOptionOrder(q)])),
  );

  const feedback = lockedFeedback ?? prefs.feedback;
  const immediate = feedback === "immediate";
  const question = questions[index];
  const current = answers[question?.id] ?? { selected: null, first: null };
  const revealed = immediate && current.selected !== null;

  /** 要記錄的答案：立即對答用第一次，交卷後對答用最後一次 */
  const recordedChoice = useCallback(
    (a: AnswerState | undefined) => (a ? (immediate ? a.first : a.selected) : null),
    [immediate],
  );
  const answeredCount = questions.filter((q) => recordedChoice(answers[q.id]) !== null).length;

  // ---- 記錄 ----
  const recordedRef = useRef<Set<string>>(new Set());
  // 事件處理與卸載時要讀「最新」的狀態，所以每次 render 後同步到 ref
  const latest = useRef({ answers, recordedChoice, isLoggedIn, mode, finished, recordOnLeave });
  useLayoutEffect(() => {
    latest.current = { answers, recordedChoice, isLoggedIn, mode, finished, recordOnLeave };
  });

  const pendingRows = useCallback((): AnswerRow[] => {
    const { answers: a, recordedChoice: pick } = latest.current;
    return questions.flatMap((q) => {
      const choice = pick(a[q.id]);
      if (choice === null || recordedRef.current.has(q.id)) return [];
      return [{ questionId: q.id, selectedOption: choice, isCorrect: isAnswerCorrect(q.answer, choice) }];
    });
  }, [questions]);

  const flush = useCallback(() => {
    const rows = pendingRows();
    if (!latest.current.isLoggedIn || rows.length === 0) return;
    rows.forEach((r) => recordedRef.current.add(r.questionId));
    void submitAnswers(rows, latest.current.mode);
  }, [pendingRows]);

  // 從側邊欄、頁籤等攔不到的連結離開：照預設(記錄)寫入
  useEffect(
    () => () => {
      if (latest.current.recordOnLeave) flush();
    },
    [flush],
  );

  // 關閉分頁或重新整理前提醒(瀏覽器只會顯示它自己的通用訊息)
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!latest.current.finished && pendingRows().length > 0) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [pendingRows]);

  // ---- 返回鍵攔截：多推一筆 history，按返回時先跳出確認 ----
  // 保留 Next router 自己的 history.state(只多一個標記)，否則它在返回時會整頁重新載入。
  // 已經在 guard 上就不再推(開發模式 Strict Mode 會讓 effect 跑兩次)。
  useEffect(() => {
    const pushGuard = () => {
      if (!history.state?.quizGuard) history.pushState({ ...history.state, quizGuard: true }, "");
    };
    pushGuard();
    const onPop = () => {
      if (latest.current.finished || pendingRows().length === 0) {
        history.back();
        return;
      }
      pushGuard();
      setRecordOnLeave(true);
      setDialog("leave");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pendingRows]);

  const leave = (record: boolean) => {
    setRecordOnLeave(record);
    latest.current.recordOnLeave = record;
    if (record) flush();
    else questions.forEach((q) => recordedRef.current.add(q.id)); // 不記錄：卸載時也不要補寫
    setDialog(null);
    // 回到來源頁：前面還有頁面就退兩步(跳過我們推的那一筆 guard)，
    // 直接開這一頁(新分頁、書籤)時前面沒有東西，改去 reviewHref
    if (history.state?.quizGuard && history.length > 2) history.go(-2);
    else router.replace(reviewHref);
  };

  // ---- 計時 ----
  useEffect(() => {
    if (!prefs.timer || finished) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [prefs.timer, finished]);

  // ---- 作答 ----
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setIndex(Math.max(0, Math.min(questions.length - 1, i)));
    },
    [questions.length],
  );

  const select = (key: OptionKey) => {
    if (!question) return;
    if (lockedFeedback === null) setLockedFeedback(feedback);
    setAnswers((prev) => {
      const a = prev[question.id] ?? { selected: null, first: null };
      return { ...prev, [question.id]: { selected: key, first: a.first ?? key } };
    });
    // 立即對答：答對自動下一題，答錯停下來看詳解
    if (immediate && isAnswerCorrect(question.answer, key) && index < questions.length - 1) {
      advanceTimer.current = setTimeout(() => goTo(index + 1), AUTO_ADVANCE_DELAY_MS);
    }
  };

  const clearAnswer = useCallback(() => {
    if (!question) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAnswers((prev) => {
      const a = prev[question.id];
      if (!a?.selected) return prev;
      return { ...prev, [question.id]: { ...a, selected: null } };
    });
  }, [question]);

  const submit = () => {
    flush();
    setFinishedAt(Date.now());
    setFinished(true);
    setDialog(null);
    window.scrollTo({ top: 0 });
  };

  const requestSubmit = () => {
    if (answeredCount < questions.length) setDialog("submit");
    else submit();
  };

  const retry = () => {
    recordedRef.current = new Set();
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setFinishedAt(null);
    setLockedFeedback(null);
    setStartedAt(Date.now());
    setNow(Date.now());
    setOrders(Object.fromEntries(questions.map((q) => [q.id, shuffledOptionOrder(q)])));
    setRound((r) => r + 1);
  };

  // 畫面上的選項順序(與 QuestionCard 的顯示規則一致)，快捷鍵 1–4 / A–D 依此對應
  const displayOrder = useMemo<readonly OptionKey[]>(
    () => (question && prefs.shuffleOptions && !revealed ? (orders[question.id] ?? OPTION_KEYS) : OPTION_KEYS),
    [question, prefs.shuffleOptions, revealed, orders],
  );

  // ---- 快捷鍵 ----
  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (dialog || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      const k = e.key.toLowerCase();
      const pos = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
      if (k.length === 1 && pos >= 0) {
        const key = displayOrder[pos];
        const opt = question && key ? question[`option_${key.toLowerCase()}` as "option_a"] : "";
        if (key && opt && !revealed) {
          e.preventDefault();
          select(key);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (index === questions.length - 1 && e.key === "Enter") requestSubmit();
        else goTo(index + 1);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        clearAnswer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---- 手勢 ----
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touch.current = { x: p.clientX, y: p.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  };

  // ---- 結果頁 ----
  if (finished) {
    const total = questions.length;
    const results = questions.map((q) => {
      const choice = recordedChoice(answers[q.id]);
      return { q, choice, correct: choice !== null && isAnswerCorrect(q.answer, choice) };
    });
    const correctCount = results.filter((r) => r.correct).length;
    const unanswered = results.filter((r) => r.choice === null).length;
    const wrong = results.filter((r) => r.choice !== null && !r.correct);
    const accuracy = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    // 交卷時一定會設定 finishedAt
    const spent = (finishedAt ?? startedAt) - startedAt;

    return (
      <div>
        <h1 className="mb-1 text-3xl font-bold text-strong">測驗結束</h1>
        <p className="mb-1 text-lg text-body">
          正確率 {accuracy}%（{correctCount} / {total} 題）
          {unanswered > 0 && <span className="text-muted">・未答 {unanswered} 題</span>}
        </p>
        {prefs.timer && (
          <p className="mb-1 text-sm text-muted">
            用時 {formatClock(spent)}
            {total - unanswered > 0 && `・每題平均 ${Math.round(spent / 1000 / (total - unanswered))} 秒`}
          </p>
        )}
        <p className="mb-6 text-sm text-muted">
          {isLoggedIn ? "作答已記錄，答錯的題目已收進我的題本。" : "登入後作答會記錄下來，答錯的題目會自動收進題本。"}
        </p>

        <div className="mb-6">
          <AnswerSheet
            cells={results.map((r, i) => ({
              id: r.q.id,
              number: i + 1,
              answer: r.choice ?? "",
              outcome: r.choice === null ? "unanswered" : r.correct ? "correct" : "wrong",
              correctAnswer: r.q.answer,
            }))}
            onSelect={(id) => document.getElementById(`result-${id}`)?.scrollIntoView({ behavior: "smooth" })}
          />
        </div>

        {wrong.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-strong">答錯的題目</h2>
            {wrong.map(({ q, choice }) => (
              <div key={q.id} id={`result-${q.id}`} className="scroll-mt-20">
                <QuestionCard
                  question={q}
                  mode="quiz"
                  isLoggedIn={false}
                  revealAnswer={choice ?? undefined}
                  knowledge={knowledgeByQuestion?.[q.id]}
                  devMode={devMode}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={retry} className={`${pillGray} px-5 py-2.5 text-[15px]`}>
            重測一次
          </button>
          <Link href={reviewHref} className={`${pillTint} px-5 py-2.5 text-[15px]`}>
            {reviewLabel}
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const isLast = index === questions.length - 1;
  const sheetCells: AnswerSheetCell[] = questions.map((q, i) => {
    const a = answers[q.id];
    const choice = recordedChoice(a);
    // 交卷後對答：顯示畫面上的字母(選項可能打亂)；立即對答已揭曉，顯示原始字母並標對錯
    const order = prefs.shuffleOptions ? (orders[q.id] ?? OPTION_KEYS) : OPTION_KEYS;
    const shown = choice === null ? "" : immediate ? choice : OPTION_KEYS[order.indexOf(choice)];
    return {
      id: q.id,
      number: i + 1,
      answer: shown,
      outcome: immediate && choice !== null ? (isAnswerCorrect(q.answer, choice) ? "correct" : "wrong") : undefined,
    };
  });

  return (
    <div>
      {/* 工具列：離開｜範圍｜計時｜作答情形｜設定。手機上黏在標題列下方 */}
      <div className="sticky top-[calc(3rem+env(safe-area-inset-top))] z-20 -mx-4 mb-2 flex items-center gap-2 bg-page/85 px-4 py-2 backdrop-blur-xl md:top-0">
        <button type="button" onClick={() => setDialog("leave")} className={pillGray}>
          <ChevronLeft size={15} /> 離開
        </button>
        <p className="min-w-0 flex-1 truncate text-sm text-muted">{scopeLabel}</p>
        {prefs.timer && (
          <span className="flex items-center gap-1 text-sm font-medium tabular-nums text-strong">
            <Timer size={15} className="text-muted" />
            {formatClock(now - startedAt)}
          </span>
        )}
        <button type="button" onClick={() => setDialog("sheet")} className={pillGray} aria-label="瀏覽作答情形">
          <ClipboardList size={15} />
          <span className="hidden sm:inline">瀏覽作答情形</span>
        </button>
        <button type="button" onClick={() => setDialog("settings")} className={pillGray} aria-label="作答設定">
          <Settings2 size={15} />
        </button>
      </div>

      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-fill">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <QuestionCard
          key={`${round}-${question.id}`}
          question={question}
          mode={mode}
          isLoggedIn={isLoggedIn}
          hideExplanationWhenCorrect
          knowledge={knowledgeByQuestion?.[question.id]}
          devMode={devMode}
          shuffleOptions={prefs.shuffleOptions}
          optionOrder={orders[question.id]}
          selected={current.selected}
          onSelect={select}
          reveal={immediate}
        />
      </div>

      {immediate && current.first !== null && current.selected !== current.first && (
        <p className="-mt-2 mb-3 text-xs text-muted">
          已看過答案，紀錄以第一次作答（{current.first}）為準。
        </p>
      )}

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={`${pillGray} disabled:opacity-40`}>
          <ChevronLeft size={15} /> 上一題
        </button>
        <button
          type="button"
          onClick={clearAnswer}
          disabled={current.selected === null}
          className={`${pillGray} disabled:opacity-40`}
        >
          <Eraser size={14} /> 取消作答
        </button>
        <span className="flex-1" />
        {isLast ? (
          <button type="button" onClick={requestSubmit} className={pillTint}>
            交卷
          </button>
        ) : (
          <button type="button" onClick={() => goTo(index + 1)} className={pillTint}>
            下一題 <ChevronRight size={15} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-body">
        <label htmlFor="quiz-jump">目前在第</label>
        <select
          id="quiz-jump"
          value={index}
          onChange={(e) => goTo(Number(e.target.value))}
          className="rounded-btn bg-fill px-2 py-1 text-sm font-medium text-strong"
        >
          {questions.map((q, i) => (
            <option key={q.id} value={i}>
              {i + 1}
              {recordedChoice(answers[q.id]) === null ? "（未答）" : ""}
            </option>
          ))}
        </select>
        <span>題，共 {questions.length} 題</span>
        {recordedChoice(current) === null && <span className="text-incorrect">（未答）</span>}
      </div>
      <p className="mt-2 hidden text-center text-xs text-muted md:block">
        快捷鍵：1–4 或 A–D 作答・← → 換題・Backspace 取消作答・Enter 下一題
      </p>

      {dialog === "sheet" && (
        <Sheet title="瀏覽作答情形" onClose={() => setDialog(null)}>
          <p className="mb-3 text-sm text-muted">
            已作答 {answeredCount} 題・未作答 {questions.length - answeredCount} 題（粉紅色格子）。點題號可以跳到該題。
          </p>
          <AnswerSheet
            cells={sheetCells}
            activeId={question.id}
            onSelect={(id) => {
              goTo(questions.findIndex((q) => q.id === id));
              setDialog(null);
            }}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setDialog(null)} className={pillGray}>
              繼續作答
            </button>
            <button type="button" onClick={requestSubmit} className={pillTint}>
              交卷
            </button>
          </div>
        </Sheet>
      )}

      {dialog === "settings" && (
        <Sheet title="作答設定" onClose={() => setDialog(null)}>
          <SettingRow
            label="對答時機"
            hint={lockedFeedback ? "已開始作答，這一輪不能切換" : "立即對答：選了馬上看詳解；交卷後對答：像模擬考，交卷前可以改答"}
          >
            <div className="segmented">
              {(["immediate", "end"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  disabled={lockedFeedback !== null}
                  aria-pressed={feedback === f}
                  onClick={() => setPreference("feedback", f)}
                  className="disabled:opacity-50"
                >
                  {f === "immediate" ? "立即對答" : "交卷後對答"}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="計時" hint="在上方顯示已用時間，結果頁會列出每題平均">
            <Toggle checked={prefs.timer} onChange={(v) => setPreference("timer", v)} />
          </SettingRow>
          <SettingRow label="選項打亂" hint="作答前打亂 A–D 的順序，避免記位置">
            <Toggle checked={prefs.shuffleOptions} onChange={(v) => setPreference("shuffleOptions", v)} />
          </SettingRow>
          <p className="mt-3 text-xs text-muted">設定會記在這台裝置上，下次練習沿用。</p>
        </Sheet>
      )}

      {dialog === "submit" && (
        <ConfirmDialog
          title="確定要交卷嗎？"
          message={`還有 ${questions.length - answeredCount} 題沒有作答，未答的題目不會記錄。`}
          confirmLabel="交卷"
          cancelLabel="繼續作答"
          onConfirm={submit}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === "leave" && (
        <ConfirmDialog
          title="要離開這次練習嗎？"
          message={
            answeredCount === 0 ? (
              "還沒有作答，離開後不會留下紀錄。"
            ) : (
              <label className="flex items-center justify-center gap-2 text-strong">
                <input
                  type="checkbox"
                  checked={recordOnLeave}
                  onChange={(e) => setRecordOnLeave(e.target.checked)}
                  className="size-4 accent-[var(--color-accent)]"
                />
                記錄已作答的 {answeredCount} 題{isLoggedIn ? "（答錯的會收進題本）" : "（需登入）"}
              </label>
            )
          }
          confirmLabel="離開"
          cancelLabel="繼續作答"
          onConfirm={() => leave(recordOnLeave)}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

/** 底部拉起(手機)／置中(桌機)的面板 */
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <div className="relative max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl md:max-w-2xl md:rounded-2xl md:pb-5">
        <h2 className="mb-3 text-lg font-bold text-strong">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-card-border py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-strong">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** iOS 的開關 */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] rounded-full transition-colors ${checked ? "bg-correct" : "bg-fill-strong"}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] size-[27px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
