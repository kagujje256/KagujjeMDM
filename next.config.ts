import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["*.kagujje.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
