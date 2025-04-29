import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "/pages/register",
      },
      {
        source: "/login",
        destination: "/pages/login",
      },
      {
        source: "/register",
        destination: "/pages/register",
      },
      {
        source: "/task",
        destination: "/pages/task",
      }
    ];
  }
};

export default nextConfig;
