import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Railway keeps .next/cache between builds, and a cached build shipped the
    // site's old stylesheet with new pages. Always compile CSS from source.
    turbopackFileSystemCacheForBuild: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // The collector every client site loads. A short cache keeps it cheap
        // without leaving an old copy on visitors' devices for hours.
        source: "/leads.js",
        headers: [
          { key: "Content-Type", value: "text/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=600" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
