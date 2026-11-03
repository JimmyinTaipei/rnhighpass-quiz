"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { nativeSelectClass } from "@/lib/ui";
import { SELECT_STYLES, SELECT_EXAMPLE_SUBJECTS, SELECT_EXAMPLE_SITTINGS, type SelectStyle } from "@/lib/ui-library";

type Option = { value: string; label: string };
const nativeControl = nativeSelectClass;

function SearchableSelect({ name, label, options, disabled }: { name: string; label: string; options: Option[]; disabled: boolean }) {
  const [value, setValue] = useState(options[0].value);
  const [query, setQuery] = useState("");
  const details = useRef<HTMLDetailsElement>(null);
  const id = useId();
  const matches = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  const close = (focus = false) => {
    if (details.current) details.current.open = false;
    if (focus) details.current?.querySelector("summary")?.focus();
  };
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!details.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  if (disabled) return <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-body">{label}<select defaultValue={value} disabled className={nativeControl}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
  return <div className="min-w-0">
    <span id={`${id}-label`} className="mb-2 block text-sm font-medium text-body">{label}</span>
    <input type="hidden" name={name} value={value} />
    <details ref={details} className="relative" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(true); } }} onToggle={() => {
      if (details.current?.open) details.current.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    }}>
      <summary aria-labelledby={`${id}-label ${id}-value`} className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-btn border border-card-border bg-card px-3 text-base text-strong focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
        <span id={`${id}-value`}>{options.find((option) => option.value === value)?.label}</span><ChevronDown size={16} aria-hidden />
      </summary>
      <div className="absolute inset-x-0 top-full z-20 mt-2 min-w-full rounded-card border border-card-border bg-card p-2 shadow-lg">
        <label className="mb-2 flex min-h-11 items-center gap-2 rounded-btn bg-fill px-3"><Search size={16} aria-hidden /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="尋找選項" aria-label={`尋找${label}選項`} className="w-full min-w-0 bg-transparent py-2 text-base text-strong outline-none focus-visible:underline" /></label>
        <fieldset className="max-h-60 space-y-1 overflow-y-auto"><legend className="sr-only">{label}選項</legend>
          {matches.map((option) => <label key={option.value} className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-btn px-3 text-sm ${value === option.value ? "bg-light font-medium text-deep" : "text-body hover:bg-surface-hover"}`}>
            <input className="sr-only peer" type="radio" name={`${id}-choice`} checked={value === option.value} onChange={() => { setValue(option.value); setQuery(""); close(true); }} />
            <span className="peer-focus-visible:underline">{option.label}</span>{value === option.value && <Check size={16} aria-hidden />}
          </label>)}
          {!matches.length && <p className="px-3 py-4 text-sm text-body">沒有符合的選項，換個關鍵字試試</p>}
        </fieldset>
      </div>
    </details>
  </div>;
}

function SelectExample({ style, name, label, options, disabled }: { style: SelectStyle; name: string; label: string; options: Option[]; disabled: boolean }) {
  if (style === "searchable") return <SearchableSelect name={name} label={label} options={options} disabled={disabled} />;
  const control = style === "soft" ? `${nativeControl} rounded-full border-transparent bg-fill pl-4` : style === "toolbar" ? `${nativeControl} rounded-none border-transparent bg-transparent` : nativeControl;
  return <label className={`flex min-w-0 flex-col gap-2 text-sm font-medium text-body ${style === "toolbar" ? "px-3 py-2" : ""}`}>
    {label}
    <span className="relative block min-w-0"><select name={name} disabled={disabled} className={control}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={16} aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted" /></span>
  </label>;
}

export function SelectLibrary({ style }: { style: SelectStyle }) {
  const current = SELECT_STYLES.find((entry) => entry.id === style)!;
  const [narrow, setNarrow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);
  const buttonStyle = style === "soft" ? "rounded-full bg-mid text-on-mid hover:bg-accent" : style === "toolbar" ? "rounded-btn bg-deep text-on-accent hover:opacity-90" : "rounded-btn border border-card-border bg-card text-deep hover:bg-surface-hover";
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
    <p className="mb-2 text-sm font-medium text-deep">介面參考 / 表單元件</p>
    <h1 className="text-3xl font-bold tracking-tight text-strong">UI 對照庫</h1>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-body">先比較下拉選單與套用按鈕的整組搭配。這裡的操作只使用預覽資料，不會變更正式搜尋或作答紀錄；之後新增樣式也集中在這裡。</p>
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside><h2 className="mb-3 text-sm font-semibold text-body">下拉選單 / 四種方向</h2><nav aria-label="下拉選單樣式" className="space-y-2">
        {SELECT_STYLES.map((entry, index) => <Link key={entry.id} href={`/dev/ui?style=${entry.id}`} aria-current={style === entry.id ? "page" : undefined} className={`block rounded-card border p-4 focus-visible:outline-2 focus-visible:outline-accent ${style === entry.id ? "border-deep bg-light" : "border-card-border bg-card hover:bg-surface-hover"}`}>
          <span className="block text-sm font-semibold text-deep">{index + 1}. {entry.name}</span><span className="mt-1 block text-xs leading-relaxed text-body">{entry.axis}</span>
        </Link>)}
      </nav><Link href="/search" className="mt-4 inline-flex min-h-11 items-center text-sm text-deep hover:underline">返回搜尋頁 →</Link></aside>
      <section aria-labelledby="select-preview" className="min-w-0 rounded-card border border-card-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="select-preview" className="text-xl font-bold text-strong">{current.name}</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-body">{current.description}</p></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="預覽條件">
            <button type="button" aria-pressed={narrow} onClick={() => setNarrow(!narrow)} className="min-h-11 rounded-btn border border-card-border px-3 text-sm text-deep hover:bg-surface-hover">{narrow ? "切回寬版" : "查看窄版"}</button>
            <button type="button" aria-pressed={disabled} onClick={() => setDisabled(!disabled)} className="min-h-11 rounded-btn border border-card-border px-3 text-sm text-deep hover:bg-surface-hover">{disabled ? "解除停用" : "查看停用"}</button>
          </div>
        </div>
        <div className={`mt-8 ${narrow ? "mx-auto max-w-sm" : ""}`}>
          <h3 className="mb-1 text-lg font-semibold text-strong">搜尋範圍</h3><p className="mb-5 text-sm text-muted">關鍵字：糖尿病 · 科目與梯次符合任一範圍</p>
          <form onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const subject = SELECT_EXAMPLE_SUBJECTS.find((entry) => entry.value === data.get("subject"))?.label ?? "所有科目";
            setApplied(`已套用：${subject}，梯次 ${data.get("from") || "不限起點"} 至 ${data.get("to") || "不限終點"}`);
          }} className={`grid items-end gap-3 ${narrow ? "" : "xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"} ${style === "toolbar" ? "gap-0 rounded-card border border-card-border bg-fill p-2" : ""}`}>
            <SelectExample style={style} name="subject" label="科目範圍" options={SELECT_EXAMPLE_SUBJECTS} disabled={disabled} />
            <SelectExample style={style} name="from" label="考試梯次：從" options={SELECT_EXAMPLE_SITTINGS} disabled={disabled} />
            <SelectExample style={style} name="to" label="到" options={[SELECT_EXAMPLE_SITTINGS[0], ...SELECT_EXAMPLE_SITTINGS.slice(1).reverse()]} disabled={disabled} />
            <button type="submit" disabled={disabled} className={`min-h-11 px-4 text-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyle} ${style === "toolbar" ? "m-2" : ""}`}>套用範圍</button>
          </form>
          <p role="status" className="mt-4 min-h-11 text-sm leading-relaxed text-deep">{applied ?? "選擇科目與梯次，再按套用範圍，這裡會顯示選擇結果"}</p>
        </div>
        <div className="mt-6 border-t border-card-border pt-4 text-sm leading-relaxed text-body"><p><span className="font-semibold">取捨：</span>{current.tradeoff}</p><p className="mt-2">可以試試滑鼠、Tab、方向鍵與 Enter；可搜尋清單另支援 Esc 與點外部關閉。確認喜歡的款式後，告訴我名稱再套用至搜尋頁。</p></div>
      </section>
    </div>
  </main>;
}
