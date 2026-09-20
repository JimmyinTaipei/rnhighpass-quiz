import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import { getExamPapers } from "@/lib/mock-exam/data";
import {
  DEFAULT_SITTING,
  GROUP_FULL_NAMES,
  MOCK_GROUP_IDS,
  formatSitting,
  paperSlug,
  parsePaperSlug,
} from "@/lib/mock-exam/labels";

export default async function MockExamHome(props: PageProps<"/mock-exam/select">) {
  const [papers, searchParams] = await Promise.all([getExamPapers(), props.searchParams]);

  // 梯次清單(去重、新到舊)。補考與正式考試分開列
  const sittings = [...new Map(papers.map((p) => [paperSlug(p), p])).values()];
  const requested = typeof searchParams.paper === "string" ? parsePaperSlug(searchParams.paper) : null;
  const current =
    sittings.find((p) => requested && paperSlug(p) === paperSlug(requested)) ??
    sittings.find((p) => p.sitting === DEFAULT_SITTING && !p.isMakeup) ??
    sittings[0];

  if (!current) {
    return <p className="text-body">目前沒有可用的考卷。</p>;
  }

  const slug = paperSlug(current);
  const groups = MOCK_GROUP_IDS.map((id) => ({
    id,
    name: GROUP_FULL_NAMES[id],
    count: papers.find((p) => paperSlug(p) === slug && p.groupId === id)?.questionCount ?? 0,
  }));

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-2 text-2xl font-bold text-deep">護理師線上模擬考</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-body">
          以國考歷屆試題模擬電腦化測驗：一次一題、可註記、可瀏覽作答情形，每科 60 分鐘。
          不需要登入，作答進度保存在這台裝置的瀏覽器。
        </p>
      </section>

      <form className="flex flex-wrap items-center gap-2 text-sm" action="/mock-exam/select">
        <label htmlFor="paper" className="font-medium text-strong">
          考試梯次
        </label>
        <select
          id="paper"
          name="paper"
          defaultValue={slug}
          className="rounded-btn border border-card-border bg-card px-2 py-1.5 text-sm text-strong"
        >
          {sittings.map((p) => (
            <option key={paperSlug(p)} value={paperSlug(p)}>
              {formatSitting(p.sitting, p.isMakeup)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-btn border border-card-border bg-card px-3 py-1.5 font-medium text-body hover:border-accent"
        >
          切換
        </button>
      </form>

      <section>
        <h2 className="mb-3 text-lg font-bold text-deep">
          {formatSitting(current.sitting, current.isMakeup)}・請選擇科目
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) =>
            g.count > 0 ? (
              <Link
                key={g.id}
                href={`/mock-exam/${slug}/${g.id}`}
                className="group rounded-card border border-card-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
              >
                <p className="mb-3 font-bold text-deep group-hover:text-accent">{g.name}</p>
                <p className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {g.count} 題
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    60 分鐘
                  </span>
                </p>
              </Link>
            ) : (
              <div
                key={g.id}
                className="rounded-card border border-dashed border-card-border p-5 text-muted"
              >
                <p className="mb-3 font-bold">{g.name}</p>
                <p className="text-xs">這一次沒有題目資料</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="rounded-card border border-card-border bg-card p-5 text-sm leading-relaxed text-body">
        <h2 className="mb-2 font-bold text-deep">作答說明</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>試題以一次一題方式顯示，可用「上一題／下一題」或下拉選單跳題。</li>
          <li>每位應考人的選項順序不同，本系統同樣會打亂 (A)(B)(C)(D) 的順序。</li>
          <li>沒把握的題目可以點選「輔助作答註記」，之後在「瀏覽作答情形」中快速找到。</li>
          <li>全部題目作答完才能「結束作答」；時間到系統會自動交卷。</li>
          <li>交卷後顯示分數與每題對錯，不提供詳解。</li>
        </ol>
      </section>
    </div>
  );
}
