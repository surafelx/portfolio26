import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so a stray lockfile higher up the disk isn't picked up.
  turbopack: { root: process.cwd() },
  // The admin reads content/site.json from disk at request time; make sure it ships with those routes.
  // Pages from the previous surafel.work site, sent to the matching section instead of a 404.
  async redirects() {
    return [
      { source: "/about", destination: "/#experience", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/articles", destination: "/#writing", permanent: true },
      { source: "/notes", destination: "/", permanent: true },
      { source: "/notes/:id", destination: "/", permanent: true },
      { source: "/partners/:id", destination: "/", permanent: true },
    ];
  },
  outputFileTracingIncludes: {
    "/admin": ["./content/**"],
    "/api/admin/content": ["./content/**"],
  },
};

export default nextConfig;
