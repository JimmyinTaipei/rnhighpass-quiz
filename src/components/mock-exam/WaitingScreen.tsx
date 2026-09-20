"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { MOCK_CANDIDATE, WAITING_DURATION_MS } from "@/lib/mock-exam/labels";

function formatClock(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * 考前等候頁(比照考選部 step 4)。倒數結束自動開始作答；
 * 「直接開始作答」是本站為了方便加的，正式考試沒有。
 *
 * 倒數不存 localStorage：這時還沒開始作答，重新整理就回到確認頁重來即可。
 */
export function WaitingScreen({
  title,
  subjectName,
  onStart,
}: {
  title: string;
  subjectName: string;
  onStart: () => void;
}) {
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  const remaining = Math.max(0, startedAt + WAITING_DURATION_MS - now);

  useEffect(() => {
    const deadline = startedAt + WAITING_DURATION_MS;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= deadline) {
        clearInterval(timer);
        onStart();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt, onStart]);

  return (
    <div className="space-y-5">
      <header className="overflow-hidden rounded-card border border-card-border bg-card shadow-sm">
        <div className="bg-light px-4 py-2 text-sm font-bold text-deep">考試名稱：{title}</div>
        <div className="grid gap-x-6 gap-y-1 px-4 py-3 text-sm text-body sm:grid-cols-3">
          <p>姓名：{MOCK_CANDIDATE.name}</p>
          <p>應試座位：{MOCK_CANDIDATE.seat}</p>
          <p>類科：護理師（{subjectName}）</p>
          <p>
            座號：<span className="font-bold text-incorrect">{MOCK_CANDIDATE.seatNo}</span>
          </p>
          <p className="sm:col-span-2">
            離開考時間：
            <span className="font-mono text-base font-bold tabular-nums text-incorrect" aria-live="off">
              {formatClock(remaining)}
            </span>
          </p>
        </div>
      </header>

      <section className="rounded-card border border-card-border bg-card p-6 text-center shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-strong">歡迎參加國家考試！</h1>
        <ol className="mx-auto max-w-xl list-inside list-decimal space-y-1 text-left text-sm leading-relaxed text-body sm:text-base">
          <li>考試開始前，應考人可瀏覽「試場規則」，或「靜候考試開始」。</li>
          <li>倒數結束時，系統將自動切換進入應試畫面。</li>
        </ol>
        <p className="mt-4 font-medium text-strong">預祝您考試順利！金榜題名！</p>

        <div className="mt-6 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onStart}
            className="flex items-center gap-2 rounded-btn bg-deep px-5 py-2.5 text-sm font-medium text-on-accent hover:opacity-90"
          >
            <Play size={16} />
            直接開始作答
          </button>
          <span className="text-xs text-warning">（僅為快速模擬用，正式考試需等待倒數結束）</span>
        </div>
      </section>

      <section className="rounded-card border border-card-border bg-card p-5 text-sm leading-relaxed text-body shadow-sm">
        <h2 className="mb-2 font-bold text-deep">試場規則</h2>
        <p>
          正式考試時可在這一頁瀏覽「試場規則」全文（考試院發布的法規）。建議考前先到考選部網站看過一次，
          考試當天就能把等候時間用來調整心情。
        </p>
        <a
          href="https://wwwc.moex.gov.tw/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-accent underline hover:text-deep"
        >
          前往考選部網站
        </a>
      </section>
    </div>
  );
}
