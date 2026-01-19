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

    // IMPORTANT: Cache busting configuration
    minimumCacheTTL: 60, // 60 seconds minimum cache for images
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Add cache buster to image URLs
    loader: "default",
    path: "/_next/image",
  },

  // 2. Performance - Enable proper ISR
  experimental: {
    optimizeCss: true,
    // Re-enable proper caching
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic pages
      static: 300, // 5 minutes for static pages
    },
    // Enable ISR memory cache
    isrMemoryCacheSize: 512, // 512MB cache
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
      {
        source: "/portfolio/:path*",
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
            value: "public, s-maxage=60, stale-while-revalidate=300",
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

  // 5. Enable ISR for dynamic pages
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`,
  },

  reactStrictMode: true,

  // 6. Disable static generation cache issues
  generateEtags: false,
};

module.exports = nextConfig;
