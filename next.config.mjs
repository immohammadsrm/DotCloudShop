/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing-slash URLs (/shop/, /<slug>/, /refund_returns/ ...)
  trailingSlash: true,
  async redirects() {
    return [
      // Product pages moved from /p/<slug>/ to /<slug>/ — keep old links and rankings working.
      { source: "/p/:slug", destination: "/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;
