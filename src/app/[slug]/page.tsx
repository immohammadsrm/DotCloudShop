import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";
import { allProducts, formatPrice, getProduct, priceLabel } from "@/lib/products";
import { site } from "@/lib/site";
import { ProviderTile } from "@/components/Icons";
import BuyBox from "@/components/BuyBox";
import ProductCard from "@/components/ProductCard";
import ProductShowcase from "@/components/ProductShowcase";
import Reveal from "@/components/Reveal";
import VariantBuyButton from "@/components/VariantBuyButton";

type Props = { params: Promise<{ slug: string }> };

// Only the product slugs below exist at the root — any other URL is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.category === "vcc" ? p.name : `Buy ${p.name}`,
    description: p.description,
    alternates: { canonical: `/${p.slug}/` },
    openGraph: p.logo ? { images: [{ url: p.logo, width: 364, height: 364, alt: `${p.provider} logo` }] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const isVcc = p.category === "vcc";
  const related = allProducts.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const variants = p.variants ?? [];

  const specs: Array<[string, string]> = isVcc
    ? [
        ["Loaded balance", formatPrice(p.balance ?? 0)],
        ["Creation fee", formatPrice(p.creationFee ?? 0)],
        ["Service fee", formatPrice(p.serviceFee ?? 0)],
        ["Total price", formatPrice(p.price)],
        ["You receive", "Card number, expiry date & CVV"],
        ["Delivery", "Within 5 minutes"],
        ["Payment", "BTC, USDT + more crypto"],
      ]
    : [
        ["Provider", p.provider],
        ["Price", priceLabel(p)],
        ["Options", variants.length > 1 ? `${variants.length} options` : variants[0]?.name ?? "Single account"],
        ["Includes", p.bullets.join(" · ")],
        ["Warranty", "Login warranty"],
        ["Payment", "BTC, USDT + more crypto"],
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.logo ? `${site.url}${p.logo}` : undefined,
    brand: { "@type": "Brand", name: site.name },
    offers:
      variants.length > 1
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: p.price,
            highPrice: p.priceTo ?? p.price,
            offerCount: variants.length,
            url: `${site.url}/${p.slug}/`,
          }
        : { "@type": "Offer", priceCurrency: "USD", price: p.price, availability: "https://schema.org/InStock", url: `${site.url}/${p.slug}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* overflow-clip (not overflow-hidden) so the sticky product image keeps working */}
      <section className="relative overflow-x-clip pb-14 pt-36 lg:pt-40">
        <div data-parallax="0.3" className="pointer-events-none absolute" style={{ top: "-20%", left: "-5%", width: 760, height: 600, background: `radial-gradient(circle, ${p.color}26 0%, transparent 65%)`, filter: "blur(80px)" }} />
        <div className="container-xl relative">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-white/35">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/shop/" className="hover:text-white">Shop</Link> /
            <span className="text-white/60">{p.name}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            {/* Visual */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <ProductShowcase product={p} />
              </Reveal>
            </div>

            {/* Info + buy box */}
            <div>
              <Reveal>
                <div className="mb-4 flex items-center gap-3">
                  <ProviderTile mono={p.mono} color={p.color} size="lg" logo={p.logo} alt={`${p.provider} logo`} />
                  <div>
                    <p className="text-[13px] text-white/50">{p.provider}</p>
                    <div className="flex items-center gap-1.5 text-[12px] text-white/45">
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent-bright text-accent-bright" />
                        ))}
                      </span>
                      {site.stats.rating} rating
                    </div>
                  </div>
                </div>
                <h1 className="heading mb-3 text-[clamp(30px,3.6vw,46px)] font-black">
                  {isVcc ? "" : "Buy "}
                  <span className="text-gradient">{p.name}</span>
                </h1>
                <p className="mb-6 text-[15px] leading-relaxed text-white/50">{p.description}</p>
              </Reveal>
              <Reveal delay={80}>
                <BuyBox product={p} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* All options & prices */}
      {variants.length > 1 && (
        <section className="pb-14">
          <div className="container-xl">
            <Reveal>
              <h2 className="heading mb-5 text-2xl md:text-3xl">All options <span className="text-gradient">&amp; prices</span></h2>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.14em] text-white/30">
                      <th className="px-5 py-3 font-semibold">Option</th>
                      <th className="hidden px-5 py-3 font-semibold sm:table-cell">Regular</th>
                      <th className="px-5 py-3 text-right font-semibold">Price</th>
                      <th className="px-5 py-3 text-right font-semibold"><span className="sr-only">Buy</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((x) => (
                      <tr key={x.name} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3">
                          <span className={`font-medium ${x.inStock ? "text-white/85" : "text-white/35 line-through"}`}>{x.name}</span>
                          {x.group && <span className="ml-2 hidden text-[11px] text-white/30 md:inline">{x.group}</span>}
                          {!x.inStock && <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">Sold out</span>}
                        </td>
                        <td className="hidden px-5 py-3 tabular-nums text-white/30 line-through sm:table-cell">{x.regular ? formatPrice(x.regular) : ""}</td>
                        <td className="font-display px-5 py-3 text-right font-bold tabular-nums" style={{ color: x.inStock ? "#fdba74" : "rgba(255,255,255,0.3)" }}>
                          {formatPrice(x.price)}
                        </td>
                        <td className="w-px whitespace-nowrap px-5 py-2.5 text-right">
                          <VariantBuyButton productId={p.id} variant={x.name} inStock={x.inStock} label={`${p.name} — ${x.name}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Details + how to order */}
      <section className="pb-14">
        <div className="container-xl grid gap-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display mb-4 text-xl font-bold text-white">Details</h2>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card">
              <table className="w-full text-[13px]">
                <tbody>
                  {specs.map(([k, val]) => (
                    <tr key={k} className="border-b border-white/[0.04] last:border-0">
                      <td className="w-1/3 px-5 py-3 text-white/40">{k}</td>
                      <td className="px-5 py-3 font-medium text-white/85">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mb-4 text-xl font-bold text-white">How to order</h2>
            <ol className="grid gap-3">
              {[
                ["01", isVcc ? "Add to cart" : "Choose your option", isVcc ? "Add this card balance to your cart." : "Pick the tier you need and add it to your cart."],
                ["02", "Pay with crypto", "Pay with Bitcoin, USDT or other crypto — no KYC."],
                ["03", "Receive details", isVcc ? "Card number, expiry and CVV within 5 minutes." : "Your login details, with login support."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-ink-card p-4">
                  <span className="font-display text-[22px] font-black leading-none text-accent-bright">{n}</span>
                  <div>
                    <p className="mb-0.5 text-[14px] font-semibold text-white">{t}</p>
                    <p className="text-[12px] leading-relaxed text-white/45">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="heading text-2xl md:text-3xl">You may also <span className="text-gradient">like</span></h2>
            <Link href="/shop/" className="flex items-center gap-1 text-[13px] font-semibold text-accent-bright">
              View all products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
