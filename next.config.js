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
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains for news images
      },
    ].map((pattern) => ({ ...pattern, pathname: "/**" })),

    minimumCacheTTL: 60,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 2. Performance
  experimental: {
    optimizeCss: true,
    webpackMemoryOptimizations: true,
    workerThreads: false,
  },

  // 3. SELECTIVE Cache-Control Headers
  async headers() {
    return [
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
          { key: "Cache-Control", value: "private, no-cache, max-age=0" },
        ],
      },
      {
        source: "/cars",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=10, stale-while-revalidate=30",
          },
        ],
      },
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
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },

  generateEtags: false,
  compress: true,
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,

  // 9. FIX FOR TURBOPACK HMR (Lucide React instantiation error)
  transpilePackages: ["lucide-react"],
};

module.exports = nextConfig;
