const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
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
  env: {
    NEXT_PUBLIC_SITE_TITLE: 'cc || cheshirecat.dev',
    NEXT_PUBLIC_SITE_DESCRIPTION: 'sup',
  },
});
