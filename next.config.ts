import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://avatars.githubusercontent.com/u/62371174?v=4")],
  },
};

export default nextConfig;
