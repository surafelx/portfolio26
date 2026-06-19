/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Images are served via plain <img> tags (Cloudinary), so next/image
  // remotePatterns are not required. If you migrate to next/image, add:
  //   images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] }
};

export default nextConfig;
