import type { MetadataRoute } from "next";

// 讓網站可以「加入主畫面」並以全螢幕開啟：包成 Capacitor app 之前的試水溫。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "多保命 護理國考題庫",
    short_name: "多保命",
    description: "護理國考分章筆記、知識庫與線上測驗",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F2F7",
    theme_color: "#F2F2F7",
    lang: "zh-Hant",
  };
}
