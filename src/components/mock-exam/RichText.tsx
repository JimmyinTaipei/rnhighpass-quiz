// 題目文字裡少數選項用 markdown 圖片語法內嵌考卷掃描圖，例如
// '![105-2_PC_011_A|2.5cm](images/105-2_PC_011_A.png)表示離婚'。
// 這裡把它拆成 <img> + 文字；圖片檔放在 public/exam-images/。

const IMAGE_PATTERN = /!\[([^\]|]*)(?:\|([\d.]+)cm)?\]\((?:images\/)?([^)]+)\)/g;
/** 原始題本的 1cm 大約等於畫面上 38px */
const PX_PER_CM = 38;

export function examImageSrc(filename: string) {
  return `/exam-images/${encodeURIComponent(filename)}`;
}

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(IMAGE_PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    const widthCm = m[2] ? Number(m[2]) : null;
    parts.push(
      // eslint-disable-next-line @next/next/no-img-element -- 靜態掃描圖，尺寸不固定，不需要 next/image 的最佳化
      <img
        key={start}
        src={examImageSrc(m[3])}
        alt={m[1] || "題目附圖"}
        className="mx-1 inline-block max-w-full align-middle"
        style={widthCm ? { width: `${widthCm * PX_PER_CM}px` } : undefined}
      />,
    );
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <span className="whitespace-pre-wrap">{parts}</span>;
}
