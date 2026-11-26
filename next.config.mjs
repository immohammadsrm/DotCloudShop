// false = send "X-Robots-Tag: noindex" on every URL (pages, images, files) so nothing gets indexed.
// When you're ready to launch, set this to true AND set `indexing: true` in src/lib/site.ts.
const ALLOW_INDEXING = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing-slash URLs (/shop/, /<slug>/, /refund_returns/ ...)
  trailingSlash: true,
  async headers() {
    if (ALLOW_INDEXING) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  async redirects() {
    return [
      // Product pages moved from /p/<slug>/ to /<slug>/ — keep old links and rankings working.
      { source: "/p/:slug", destination: "/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;
