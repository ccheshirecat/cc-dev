/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['shuffle.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cheshirecat.dev',
      },
    ],
  },
}

module.exports = nextConfig

