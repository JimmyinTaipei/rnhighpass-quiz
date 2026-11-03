/** Add future select treatments here; the preview route keeps their examples together. */
export const SELECT_STYLES = [
  { id: "outlined", name: "原生白底", axis: "獨立欄位與細框線", description: "白底欄位搭配白底套用按鈕，結構清楚，適合日常篩選", tradeoff: "展開後使用裝置原生選單，外觀依系統而異" },
  { id: "soft", name: "柔和填色", axis: "低對比欄位與主要動作", description: "灰色填底、圓潤輪廓，搭配淡藍色套用按鈕", tradeoff: "邊界較輕，密集表單需要保留足夠欄位間距" },
  { id: "toolbar", name: "整合工具列", axis: "將範圍組成同一組控制", description: "科目與梯次放在連續工具列，套用按鈕收在同一組", tradeoff: "欄位較多時需要換行，窄版改為垂直排列" },
  { id: "searchable", name: "可搜尋清單", axis: "可查找選項的展開清單", description: "展開後可輸入選項名稱，選取後收合，適合科目或選項增加時", tradeoff: "互動較多；自訂清單在手機上不會呼叫系統選取器" },
] as const;
export type SelectStyle = typeof SELECT_STYLES[number]["id"];

export const SELECT_EXAMPLE_SUBJECTS = [
  { value: "", label: "所有科目" },
  { value: "07_內外", label: "內外科護理" },
  { value: "01_生解", label: "解剖與生理" },
  { value: "03_藥理", label: "藥理學" },
  { value: "05_基護", label: "基本護理" },
  { value: "09_兒科", label: "小兒科護理" },
  { value: "08_產科", label: "產科護理" },
  { value: "10_精神", label: "精神科護理" },
  { value: "11_社區", label: "社區衛生護理" },
];
export const SELECT_EXAMPLE_SITTINGS = [
  { value: "", label: "不限" },
  ...["113-1", "113-2", "114-1", "114-2", "114-3", "115-1", "115-2"].map((value) => ({ value, label: value })),
];
