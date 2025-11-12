import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" }, // Google
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" }, // GitHub
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/**" }, // Discord
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
