import type { NextConfig } from 'next'

const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
} satisfies NextConfig

export default config
