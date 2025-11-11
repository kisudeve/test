import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdrtsruqkmcavjwafvmq.supabase.co",
        pathname: "/storage/v1/object/public/**", // public 버킷 이미지 경로
      },
    ],
  },
};

export default nextConfig;
