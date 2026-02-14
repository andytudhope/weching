import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/weching" : "",
  images: { unoptimized: true },
};

export default nextConfig;
