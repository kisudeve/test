import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" }, // Google
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" }, // GitHub
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/**" }, // Discord
      {
        protocol: "https",
        hostname: "kdrtsruqkmcavjwafvmq.supabase.co",
        pathname: "/storage/v1/object/public/**", // public 버킷 이미지 경로
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
