import type { NextConfig } from "next";
import { hostname, networkInterfaces } from "node:os";

const hostLabel = hostname().split(".")[0].toLowerCase();
const bonjourName = process.platform === "darwin" && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(hostLabel)
  ? `${hostLabel}.local`
  : null;

const nextConfig: NextConfig = {
  // Allow this machine's current private IPv4 addresses for same-Wi-Fi phone testing.
  // Exact local addresses and this Mac's local hostname only; never allow every
  // LAN origin or affect production. A hostname is needed for OAuth callbacks.
  allowedDevOrigins: process.env.NODE_ENV === "development"
    ? [
      ...Object.values(networkInterfaces()).flatMap((entries) => (entries ?? [])
        .filter((entry) => !entry.internal && entry.family === "IPv4" && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(entry.address))
        .map((entry) => entry.address)),
      ...(bonjourName ? [bonjourName] : []),
    ]
    : [],
  // 知識庫全文在 public/knowledge-data,執行時由 ASSETS 讀取(src/lib/knowledge/data-files.ts),
  // 不要被檔案追蹤複製進伺服器輸出
  outputFileTracingExcludes: {
    "**": ["public/knowledge-data/**/*"],
  },
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
