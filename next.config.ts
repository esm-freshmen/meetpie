import path from "path";
import type { NextConfig } from "next";

// Server Actions の Origin チェックは X-Forwarded-Host と Origin の一致を見る。
// CloudFront 経由だと X-Forwarded-Host が Lambda Function URL のドメインになり
// Origin (CloudFront ドメイン) と一致しないため、AUTH_URL の host を許可リストに追加する。
const allowedOrigins: string[] = [];
if (process.env.AUTH_URL) {
  try {
    allowedOrigins.push(new URL(process.env.AUTH_URL).host);
  } catch {
    // AUTH_URL が不正な場合は無視
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
