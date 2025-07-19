/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add static export configuration for Netlify
  output: 'export',
  trailingSlash: true,
  // Disable server-side features that don't work with static export
  experimental: {
    appDir: true,
  },
}

export default nextConfig
