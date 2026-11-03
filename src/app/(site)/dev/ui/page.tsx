import { notFound } from "next/navigation";
import { SelectLibrary } from "@/components/dev/SelectLibrary";
import { SELECT_STYLES } from "@/lib/ui-library";

export const metadata = { title: "UI 對照庫 | 多保命" };

export default async function UILibraryPage({ searchParams }: { searchParams: Promise<{ style?: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const params = await searchParams;
  const style = SELECT_STYLES.find((entry) => entry.id === params.style)?.id ?? "outlined";
  return <SelectLibrary key={style} style={style} />;
}
