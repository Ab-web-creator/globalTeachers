import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploys build into a separate folder so the running server keeps serving from .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["maxmind"],
};

export default nextConfig;
