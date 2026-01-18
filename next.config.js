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
  },

  // 2. Performance & Global Cache Control
  experimental: {
    optimizeCss: true,
    // Reduce Client-side Router Cache to the absolute minimum (0 seconds)
    // This ensures that clicking "back" or clicking a link doesn't show old data.
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },

  // 3. Prevent Browser Caching of HTML
  // This solves the issue where "Refresh" shows an old version saved in the browser.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
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

  reactStrictMode: true,
};

module.exports = nextConfig;
