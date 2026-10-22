import fs from "node:fs";
import type { NextConfig } from "next";

// Abro publishes the resume to public/resume.pdf; until it has, /cv is the CV that ships with the site
const cv = fs.existsSync("public/resume.pdf") ? "/resume.pdf" : "/Surafel-Yimam-Kebede-CV.pdf";

const nextConfig: NextConfig = {
  // Pin the project root so a stray lockfile higher up the disk isn't picked up.
  turbopack: { root: process.cwd() },
  // The pitch files are read at build time and the Abro API reads content/abro.json; ship them with the server.
  outputFileTracingIncludes: {
    "/for/[slug]": ["./content/pitches/**"],
    "/api/abro/[...path]": ["./content/abro.json"],
  },
  // Links from surafel.work and portfolio26 land on the matching page here.
  async redirects() {
    return [
      { source: "/articles", destination: "/writing", permanent: true },
      { source: "/articles/:id", destination: "/writing/:id", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/contact", destination: "/work", permanent: true },
      { source: "/cv", destination: cv, permanent: false },
    ];
  },
};

export default nextConfig;
