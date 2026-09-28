import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
