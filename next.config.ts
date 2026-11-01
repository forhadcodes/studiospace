import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Seeded + user-added studio photos
      { protocol: "https", hostname: "images.unsplash.com" },
      // imgbb uploads (lib/imgbb, plan section 2)
      { protocol: "https", hostname: "i.ibb.co" },
      // Google profile avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
