import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // aceita qualquer hostname HTTPS
      },
    ],
  },
};

export default nextConfig;
