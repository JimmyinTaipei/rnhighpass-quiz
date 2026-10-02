import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 「體液、電解質與酸鹼」併入泌尿系統(2026-10);舊網址永久轉址
  async redirects() {
    return [{ source: "/learn/system/fluid-acid-base", destination: "/learn/system/renal", permanent: true }];
  },
  // 基本的安全標頭：禁止 MIME sniffing、不被其他網站嵌入 iframe
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
