/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Consolidate and secure remote patterns
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }, // Added for Cloudinary
      { protocol: "https", hostname: "teslaevpartners.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static2.finnhub.io" },
      { protocol: "https", hostname: "static.seekingalpha.com" },
      { protocol: "https", hostname: "s.yimg.com" },
      { protocol: "https", hostname: "cdn.motor1.com" },
      { protocol: "https", hostname: "www.tesla.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Wildcard support for subdomains
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.tesla.com" },
    ].map((pattern) => ({ ...pattern, pathname: "/**" })),
  },

  // 2. Modern Performance Optimizations
  experimental: {
    optimizeCss: true,
  },

  // 3. Robust Defaults
  reactStrictMode: true,

  // 4. Turbopack configuration
  turbopack: {
    root: __dirname,
  },

  // 5. API Redirection
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
};

module.exports = nextConfig;
