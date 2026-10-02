import { notFound } from "next/navigation";
import { MockExamSession } from "@/components/mock-exam/MockExamSession";
import { getMockExamPaper } from "@/lib/mock-exam/data";
import { requireUser } from "@/lib/auth";
import { isMockOnly } from "@/lib/site-mode";
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
  // 主站(歷年考題模擬)要用網站帳號登入，交卷時才能記錄
  const mockSite = isMockOnly();
  if (!mockSite) await requireUser(`/mock-exam/${params.paper}/${params.group}`);

  const questions = await getMockExamPaper(paper, groupId);
  if (questions.length === 0) notFound();

  return (
    <MockExamSession
      paperSlug={paperSlug(paper)}
      groupId={groupId}
      title={examTitle(paper.sitting, paper.isMakeup)}
      subjectName={GROUP_FULL_NAMES[groupId]}
      questions={questions}
      simplified={!mockSite}
    />
  );
}
