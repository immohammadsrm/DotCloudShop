import type { MetadataRoute } from "next";
import { allProducts } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/shop/", "/contact-us/", "/refund_returns/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...allProducts.map((p) => ({ url: `${site.url}/${p.slug}/`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
