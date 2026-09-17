import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters, getSubject } from "@/lib/data";

export default async function SubjectPage(props: PageProps<"/subjects/[subjectId]">) {
  const params = await props.params;
  // App Router 不會自動 decode 動態路由參數,科目 ID 含中文字,
  // 瀏覽器網址列會是 %E5%85%A7%E5%A4%96 這種編碼過的字串,要手動解碼才能查資料庫
  const subjectId = decodeURIComponent(params.subjectId);
  const subject = await getSubject(subjectId);
  if (!subject) notFound();

  const chapters = await getChapters(subjectId);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <p className="mb-1 text-sm text-muted">
        <Link href="/subjects" className="hover:text-accent">
          科目
        </Link>{" "}
        / {subject.name}
      </p>
      <h1 className="mb-6 text-2xl font-bold text-deep">{subject.name}</h1>
      <div className="flex flex-col gap-2">
        {chapters.map((c) => (
          <Link
            key={c.id}
            href={`/chapters/${c.id}`}
            className="rounded-card border border-card-border bg-card p-4 font-medium text-body shadow-sm transition-colors hover:border-accent hover:text-accent"
          >
            {c.chapter_no} {c.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
