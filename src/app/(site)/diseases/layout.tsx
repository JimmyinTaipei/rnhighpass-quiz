import { DiseaseSidebar } from "@/components/reading/DiseaseSidebar";
import { getDiseaseTagSample } from "@/lib/data";

/**
 * 疾病軸的兩欄外框，結構與 chapters/layout.tsx 相同。
 *
 * 標籤清單放在這一層(沒有動態參數的共用段)，切標籤時 Next 不會重繪它，
 * 只有右側的 page 被換掉。
 */
export default async function DiseasesLayout(props: LayoutProps<"/diseases">) {
  const tags = await getDiseaseTagSample();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
      <DiseaseSidebar tags={tags} />
      <div className="min-w-0 flex-1">{props.children}</div>
    </div>
  );
}
