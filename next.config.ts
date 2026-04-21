import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
