import { notFound } from "next/navigation";
import { MockExamSession } from "@/components/mock-exam/MockExamSession";
import { getMockExamPaper } from "@/lib/mock-exam/data";
import {
  GROUP_FULL_NAMES,
  examTitle,
  isMockGroupId,
  paperSlug,
  parsePaperSlug,
} from "@/lib/mock-exam/labels";

export default async function MockExamPaperPage(props: PageProps<"/mock-exam/[paper]/[group]">) {
  const params = await props.params;
  const paper = parsePaperSlug(decodeURIComponent(params.paper));
  const groupId = decodeURIComponent(params.group);
  if (!paper || !isMockGroupId(groupId)) notFound();

  const questions = await getMockExamPaper(paper, groupId);
  if (questions.length === 0) notFound();

  return (
    <MockExamSession
      paperSlug={paperSlug(paper)}
      groupId={groupId}
      title={examTitle(paper.sitting, paper.isMakeup)}
      subjectName={GROUP_FULL_NAMES[groupId]}
      questions={questions}
    />
  );
}
