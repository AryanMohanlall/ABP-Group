import type { NextConfig } from "next";
import path from "path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
