"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { MOCK_ID_LENGTH, canTypeAt, isValidMockId, markLoggedIn } from "@/lib/mock-exam/login";
import { OnScreenKeyboard } from "./OnScreenKeyboard";

const NOTICES: React.ReactNode[] = [
  <>
    <strong className="text-incorrect">考試前三分鐘方可登入系統</strong>，請靜候監場人員說明。
  </>,
  <>請持身分證件於每節考試預備鈴聲響後，進入試場，依座號就座。</>,
  <>
    就定位後，請仔細核對<strong className="text-incorrect">試場之電腦座位標籤</strong>與
    <strong className="text-incorrect">考試通知書上之應試座位</strong>
    是否一致，如發現不符，應即向監場人員提出。
  </>,
  <>請將身分證件放置於指定位置，俾利監場人員查驗。</>,
];

export function LoginScreen({ next }: { next: string }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!isValidMockId(id)) {
      setError("格式錯誤：請輸入 1 個英文字母加 9 碼數字");
      return;
    }
    // 只記「已登入」，不保存身分證號(見 src/lib/mock-exam/login.ts)
    markLoggedIn();
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-card border border-card-border bg-card p-5 shadow-sm sm:p-8">
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-body sm:text-base">
          {NOTICES.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ol>
        <p className="mt-4 text-center text-sm font-medium text-accent">試場代碼：001（模擬）</p>
        <p className="mt-1 text-center text-xs text-muted">
          本頁為模擬登入畫面，正式考試請依監場人員指示登入。
        </p>

        <hr className="my-6 border-dashed border-card-border" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="mock-id" className="text-sm text-strong sm:text-base">
              請輸入您的國民身分證統一編號：
            </label>
            <div className="flex flex-1 items-center gap-2">
              {/* 正式考場沒有實體鍵盤，所以設為唯讀、只能用下方畫面鍵盤輸入；
                  inputMode="none" 讓手機不要跳出系統鍵盤 */}
              <input
                id="mock-id"
                value={id}
                readOnly
                inputMode="none"
                autoComplete="off"
                aria-describedby="mock-id-note"
                aria-invalid={!!error}
                className="min-w-0 flex-1 rounded-btn border border-card-border bg-card px-3 py-2 font-mono text-lg tracking-widest text-strong focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-btn bg-deep px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
              >
                <LogIn size={16} />
                送出
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-incorrect">
              {error}
            </p>
          )}

          <OnScreenKeyboard
            canPress={(key) => canTypeAt(id.length, key)}
            onKey={(key) => {
              if (!canTypeAt(id.length, key)) return;
              setId((prev) => (prev.length < MOCK_ID_LENGTH ? prev + key : prev));
              setError(null);
            }}
            canBackspace={id.length > 0}
            onBackspace={() => {
              setId((prev) => prev.slice(0, -1));
              setError(null);
            }}
          />

          <p id="mock-id-note" className="rounded-btn bg-light/60 px-3 py-2 text-xs leading-relaxed text-body">
            ※ 本頁僅為模擬登入流程，只檢查格式（1 個英文字母加 9 碼數字），不會儲存或傳送你輸入的資料。
            請用上方畫面鍵盤點選輸入。
          </p>
        </form>
      </section>
    </div>
  );
}
