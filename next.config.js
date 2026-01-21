/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Image Optimization & Security
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "teslaevpartners.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static2.finnhub.io" },
      { protocol: "https", hostname: "static.seekingalpha.com" },
      { protocol: "https", hostname: "s.yimg.com" },
      { protocol: "https", hostname: "cdn.motor1.com" },
      { protocol: "https", hostname: "www.tesla.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.tesla.com" },
    ].map((pattern) => ({ ...pattern, pathname: "/**" })),

    // Cache settings
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Disable device-based optimization for consistent caching
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 2. Performance - CORRECT experimental options for Next.js 16
  experimental: {
    optimizeCss: true,
    webpackMemoryOptimizations: true,
    workerThreads: false,
  },

  // 3. SELECTIVE Cache-Control Headers (NOT global no-store!)
  async headers() {
    return [
      // Only disable cache for admin/user pages that need fresh data
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
      {
        source: "/account/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, max-age=0",
          },
        ],
      },
      // For /cars page - enable ISR with revalidation
      {
        source: "/cars",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=10, stale-while-revalidate=30",
          },
        ],
      },
      // Static assets - cache aggressively
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  // 4. API Redirection
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/:path*`,
      },
    ];
  },

  // 5. Disable ETags for better cache control
  generateEtags: false,

  // 6. Compress responses
  compress: true,

  reactStrictMode: true,

  // 7. Build output configuration
  output: "standalone", // Creates optimized standalone build

  // 8. Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
