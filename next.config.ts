import type { NextConfig } from "next";

const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
  },
} satisfies NextConfig;

export default config;
