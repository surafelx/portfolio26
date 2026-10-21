import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so a stray lockfile higher up the disk isn't picked up.
  turbopack: { root: process.cwd() },
  // Links from surafel.work and portfolio26 land on the matching page here.
  async redirects() {
    return [
      { source: "/articles", destination: "/writing", permanent: true },
      { source: "/articles/:id", destination: "/writing/:id", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/contact", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
