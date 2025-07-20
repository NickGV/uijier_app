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
  // Enable static export for better offline support
  output: 'export',
  trailingSlash: true,
  // Remove deprecated options
  experimental: {
    // Remove optimizeCss - it's causing issues
  },
}

export default nextConfig
