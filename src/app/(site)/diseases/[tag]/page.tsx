import Link from "next/link";
import { notFound } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ViewControls } from "@/components/reading/ViewControls";
import {
  getCurrentUser,
  getDiseaseTagsForQuestions,
  getOtherChaptersForQuestions,
  getQuestionsByDiseaseTag,
  getTablesForQuestions,
} from "@/lib/data";
import { getDevMode } from "@/lib/dev-mode";
import { parseViewMode } from "@/lib/view-mode";
import { QuestionBriefCard } from "@/components/reading/QuestionBriefCard";

/**
 * 單一疾病標籤的題目(demo)。
 *
 * 與章節頁的差別只在「題目從哪裡來」：這裡沒有 topic 樹，同一個標籤的題目
 * 本來就散在不同科不同章，所以直接平鋪，靠每張卡自己的「也出現在」帶回章節。
 */
export default async function DiseaseTagPage(props: PageProps<"/diseases/[tag]">) {
  const [{ tag: rawTag }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  // 疾病名是中文，網址列會是 encode 過的字串，要手動解碼才查得到
  const tag = decodeURIComponent(rawTag);

  const questions = await getQuestionsByDiseaseTag(tag);
  if (questions.length === 0) notFound();
  // getQuestionsByIds 沒有排序，這裡排一次讓每次進來的順序穩定
  questions.sort((a, b) => a.id.localeCompare(b.id));

  const questionIds = questions.map((q) => q.id);
  const [user, devMode, tablesByQuestion, otherChaptersByQuestion, diseaseTagsByQuestion] =
    await Promise.all([
      getCurrentUser(),
      getDevMode(),
      getTablesForQuestions(questionIds),
      // 沒有「當前章節」可扣，所以這裡列出該題所有相關章節
      getOtherChaptersForQuestions(questionIds, null),
      getDiseaseTagsForQuestions(questionIds),
    ]);

  const view = parseViewMode(
    typeof searchParams.view === "string" ? searchParams.view : undefined,
  );
  const reveal = searchParams.reveal === "1";

  return (
    <div className="min-w-0">
      <p className="mb-1 text-sm text-muted">
        <Link href="/subjects" className="hover:text-subj-deep">
          科目
        </Link>{" "}
        / 疾病 / {tag}
      </p>
      <h1 className="mb-4 flex items-center gap-2 text-3xl font-bold text-subj-deep">
        <Stethoscope className="text-subj-accent" />
        {tag}
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <ViewControls view={view} reveal={reveal} />
        <span className="text-sm text-muted">{questions.length} 題</span>
      </div>

      {view === "card" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {questions.map((q) => (
            <QuestionBriefCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            mode="tag"
            isLoggedIn={!!user}
            browseMode={reveal}
            tables={tablesByQuestion.get(q.id)}
            otherChapters={otherChaptersByQuestion.get(q.id)}
            diseaseTags={diseaseTagsByQuestion.get(q.id)}
            devMode={devMode}
          />
        ))
      )}
    </div>
  );
}
