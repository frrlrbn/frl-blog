import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        destination: "/p/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
