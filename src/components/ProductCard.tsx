import Link from "next/link";
import { Clock, Globe, RefreshCw, SlidersHorizontal } from "lucide-react";
import { formatPrice, hasOptions, type Product } from "@/lib/products";
import { ProviderTile } from "./Icons";
import AddToCartButton from "./AddToCartButton";

const metaIcons = [Clock, RefreshCw, Globe];

/** Product card — same anatomy as the reference site's product grid cards. */
export default function ProductCard({ product: p }: { product: Product }) {
  const isVcc = p.category === "vcc";
  const highlight = p.badge === "Best Seller" || p.badge === "Popular";

  return (
    <Link href={`/${p.slug}/`} className="group block h-full">
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: "#131216",
          border: highlight ? "1px solid rgba(249,115,22,0.28)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: highlight ? "0 0 40px -12px rgba(249,115,22,0.35)" : "none",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${p.color}88, transparent)` }}
        />

        <div className="mb-4 flex min-h-[28px] items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ProviderTile mono={p.mono} color={p.color} size="sm" logo={p.logo} alt={`${p.provider} logo`} />
            <span className="truncate text-[11px] font-medium text-white/45">{p.provider}</span>
          </div>
          {p.badge && (
            <span
              className="shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={
                highlight
                  ? { background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.35)", color: "#fdba74" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
              }
            >
              {p.badge}
            </span>
          )}
        </div>

        <div className="mb-3.5 min-h-[50px]">
          <span
            className="font-display font-black"
            style={{
              background: isVcc
                ? "linear-gradient(120deg, #ffedd5 0%, #fb923c 55%, #ea580c 110%)"
                : `linear-gradient(120deg, #ffffff 0%, ${p.color} 120%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontSize: isVcc ? 30 : 22,
            }}
          >
            {isVcc ? p.headline : p.name.replace(/ Account$/, "")}
          </span>
          <p className="mt-1 text-[11px] text-white/40">{p.subline}</p>
        </div>

        <div className="mb-4">
          <div className="price-chip">
            {p.priceTo && <span className="text-[11px] font-semibold text-accent-soft/80">From</span>}
            <span className="price-glow text-[26px]">{formatPrice(p.price)}</span>
            {p.oldPrice && <span className="text-[12px] tabular-nums text-white/35 line-through">{formatPrice(p.oldPrice)}</span>}
            <span className="text-[11px] font-medium text-white/45">{isVcc ? "/card" : "/account"}</span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1.5 border-b border-white/[0.06] pb-4">
          {p.meta.map((m, i) => {
            const Icon = metaIcons[i % metaIcons.length];
            return (
              <div key={m} className="flex items-center gap-1">
                <Icon className="h-3 w-3 text-white/30" />
                <span className="text-[10px] text-white/40">{m}</span>
              </div>
            );
          })}
        </div>

        <ul className="mb-5 flex flex-1 flex-col gap-1.5">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[11px] leading-snug text-white/45">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full" style={{ background: p.color }} />
              {b}
            </li>
          ))}
        </ul>

        {hasOptions(p) ? (
          <span className={`${highlight ? "btn-primary" : "btn-outline"} w-full !py-2.5 !text-[12px]`}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Select options · {p.variants?.length}</span>
          </span>
        ) : (
          <AddToCartButton
            id={p.id}
            label={isVcc ? "Buy Now" : "Add to Cart"}
            variant={highlight ? "primary" : "outline"}
            className="w-full !py-2.5 !text-[12px]"
          />
        )}
      </div>
    </Link>
  );
}
