import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;