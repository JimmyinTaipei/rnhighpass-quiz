import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "多保命 護理國考題庫",
  description: "護理國考分章筆記與線上測驗",
  // 從 iOS 主畫面開啟時以全螢幕 app 的樣子呈現
  appleWebApp: { capable: true, title: "多保命", statusBarStyle: "default" },
};

// viewport-fit=cover:讓頁面延伸到瀏海與 Home 指示條底下，再由各處用 env(safe-area-inset-*) 讓開。
// 加入主畫面或包成 app 後才不會上下留白條。
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F2F7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-page">{children}</body>
    </html>
  );
}
