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
      { protocol: "https", hostname: "finance.yahoo.com" },
    ].map((pattern) => ({ ...pattern, pathname: "/**" })),
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 2. Stable Turbopack Configuration (Next.js 16 Fix)
  transpilePackages: ["lucide-react"],

  // Move turbo configuration to top-level 'turbopack'
  turbopack: {
    resolveAlias: {
      "lucide-react": "lucide-react/dist/esm/lucide-react",
    },
  },

  experimental: {
    optimizeCss: true,
    webpackMemoryOptimizations: true,
    // Note: filesystem cache for dev is now stable/default in 16.1+
    // but you can still toggle it if you have local write issues
    turbopackFileSystemCacheForDev: true,
  },

  // 3. Headers
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  // 4. API Redirection Logic
  async rewrites() {
    return [
      {
        source: "/external-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },

  generateEtags: false,
  compress: true,
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
};

module.exports = nextConfig;
