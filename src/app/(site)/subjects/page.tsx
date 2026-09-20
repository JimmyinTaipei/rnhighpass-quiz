import { getSubjects } from "@/lib/data";
import { SubjectGrid } from "@/components/subjects/SubjectGrid";

export default async function SubjectsPage() {
  const subjects = await getSubjects();
  return (
    <SubjectGrid
      subjects={subjects}
      title="科目"
      hrefFor={(s) => `/subjects/${s.id}`}
    />
  );
}
