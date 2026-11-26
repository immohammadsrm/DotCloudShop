import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // While indexing is off, crawlers may still visit pages (so they can SEE the noindex tag),
  // but no sitemap is advertised. Blocking crawling here would stop Google from reading the noindex.
  if (!site.indexing) return { rules: [{ userAgent: "*", allow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart/", "/checkout/", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
