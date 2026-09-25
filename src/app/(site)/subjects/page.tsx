import { getSubjects } from "@/lib/data";
import { SubjectGrid } from "@/components/subjects/SubjectGrid";
import { ContinueReading } from "@/components/subjects/ContinueReading";

export default async function SubjectsPage() {
  const subjects = await getSubjects();
  return (
    <SubjectGrid
      subjects={subjects}
      title="科目"
      hrefFor={(s) => `/subjects/${encodeURIComponent(s.id)}`}
      intro={<ContinueReading />}
      rememberPosition
    />
  );
}
