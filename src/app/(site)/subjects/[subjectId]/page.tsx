import { notFound } from "next/navigation";
import { getChapters, getQuestionCountsByChapter, getSubject } from "@/lib/data";
import { ChapterGrid } from "@/components/subjects/ChapterGrid";

export default async function SubjectPage(props: PageProps<"/subjects/[subjectId]">) {
  const params = await props.params;
  // App Router 不會自動 decode 動態路由參數,科目 ID 含中文字,
  // 瀏覽器網址列會是 %E5%85%A7%E5%A4%96 這種編碼過的字串,要手動解碼才能查資料庫
  const subjectId = decodeURIComponent(params.subjectId);
  const subject = await getSubject(subjectId);
  if (!subject) notFound();

  const chapters = await getChapters(subjectId);
  const questionCounts = await getQuestionCountsByChapter(chapters.map((c) => c.id));

  return (
    <ChapterGrid
      subject={subject}
      chapters={chapters}
      questionCounts={questionCounts}
      backHref="/subjects"
      backLabel="科目"
      hrefFor={(c) => `/chapters/${c.id}`}
    />
  );
}
