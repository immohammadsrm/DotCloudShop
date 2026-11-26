"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BadgeCheck, Check, Clock, CreditCard, Headphones, Minus, Plus, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { formatPrice, type Product, type Variant } from "@/lib/products";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { TelegramIcon } from "./Icons";

export default function BuyBox({ product: p }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const variants = p.variants ?? [];
  const multi = variants.length > 1;
  const isVcc = p.category === "vcc";

  // Preselect the cheapest in-stock option
  const initial = useMemo(() => {
    const inStock = variants.filter((x) => x.inStock);
    return inStock.length ? inStock.reduce((a, b) => (b.price < a.price ? b : a)).name : undefined;
  }, [variants]);
  const [selected, setSelected] = useState<string | undefined>(initial);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const current: Variant | undefined = variants.find((x) => x.name === selected);
  const price = current?.price ?? p.price;
  const regular = current ? current.regular : p.oldPrice;
  const save = regular && regular > price ? Math.round((1 - price / regular) * 100) : 0;
  const canBuy = variants.length === 0 || Boolean(current?.inStock);

  // Group variants under their headings (keeps original order)
  const groups = useMemo(() => {
    const map = new Map<string, Variant[]>();
    for (const x of variants) {
      const g = x.group ?? "";
      map.set(g, [...(map.get(g) ?? []), x]);
    }
    return [...map.entries()];
  }, [variants]);

  const addToCart = () => {
    if (!canBuy) return;
    add(p.id, qty, variants.length ? selected : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-ink-card p-6"
      style={{ border: `1px solid ${p.color}35`, boxShadow: `0 30px 80px -30px ${p.color}60` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />

      <div className="mb-4 flex items-center justify-between gap-2">
        {p.badge ? (
          <span className="rounded-full border border-accent/35 bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent-soft">{p.badge}</span>
        ) : (
          <span />
        )}
        {save > 0 && (
          <span className="rounded-full bg-green-400/10 px-2.5 py-0.5 text-[10px] font-bold text-green-400">Save {save}%</span>
        )}
      </div>

      {/* Live price */}
      <p className="mb-1 text-[11px] uppercase tracking-wider text-white/30">{multi ? "Selected option" : "Price"}</p>
      <div className="mb-2">
        <div className="price-chip !gap-2.5 !px-4 !py-2.5">
          <span key={price} className="feed-in price-glow text-[36px]">
            {formatPrice(price)}
          </span>
          {regular && regular > price && <span className="text-[15px] tabular-nums text-white/35 line-through">{formatPrice(regular)}</span>}
        </div>
      </div>
      {current && <p className="mb-1 text-[12px] font-medium text-accent-soft">{current.name}</p>}
      {isVcc && (
        <p className="text-[12px] text-white/40">
          {formatPrice(p.balance ?? 0)} balance + {formatPrice(p.creationFee ?? 0)} creation + {formatPrice(p.serviceFee ?? 0)} service fee
        </p>
      )}

      {/* Variation buttons */}
      {multi && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-white">Choose an option</p>
            <span className="text-[11px] text-white/35">{variants.length} options</span>
          </div>
          <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
            {groups.map(([group, list]) => (
              <div key={group || "all"}>
                {group && <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">{group}</p>}
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {list.map((x) => {
                    const on = x.name === selected;
                    return (
                      <button
                        key={x.name}
                        type="button"
                        disabled={!x.inStock}
                        aria-pressed={on}
                        onClick={() => setSelected(x.name)}
                        className="group relative flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200 disabled:cursor-not-allowed"
                        style={
                          on
                            ? {
                                background: `linear-gradient(135deg, ${p.color}26, rgba(249,115,22,0.10))`,
                                border: `1px solid ${p.color}`,
                                boxShadow: `0 0 0 3px ${p.color}22, 0 10px 24px -12px ${p.color}`,
                              }
                            : {
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                opacity: x.inStock ? 1 : 0.45,
                              }
                        }
                      >
                        <span className="min-w-0">
                          <span className={`block text-[12px] font-semibold leading-tight ${on ? "text-white" : "text-white/75"} ${x.inStock ? "" : "line-through"}`}>
                            {x.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] tabular-nums text-white/40">
                            {x.inStock ? <span className="text-[12px] font-bold text-accent-soft">{formatPrice(x.price)}</span> : "Sold out"}
                            {x.inStock && x.regular && x.regular > x.price && <span className="ml-1.5 line-through opacity-60">{formatPrice(x.regular)}</span>}
                          </span>
                        </span>
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all"
                          style={on ? { background: p.color } : { border: "1px solid rgba(255,255,255,0.15)" }}
                        >
                          {on && <Check className="h-3 w-3 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single fixed option (e.g. Oracle) */}
      {variants.length === 1 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] font-semibold text-white" style={{ borderColor: p.color, background: `${p.color}1a` }}>
          <Check className="h-3.5 w-3.5" style={{ color: p.color }} /> {variants[0].name}
        </div>
      )}

      {/* Quantity + actions */}
      <div className="mt-5 flex items-center gap-2">
        <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))} className="flex h-11 w-10 items-center justify-center text-white/60 hover:text-white">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-[14px] tabular-nums">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((n) => n + 1)} className="flex h-11 w-10 items-center justify-center text-white/60 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button type="button" onClick={addToCart} disabled={!canBuy} className="btn-primary h-11 flex-1">
          {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          <span>{added ? "Added to cart" : `Add to Cart · ${formatPrice(price * qty)}`}</span>
        </button>
      </div>
      <button
        type="button"
        disabled={!canBuy}
        onClick={() => {
          addToCart();
          router.push("/cart/");
        }}
        className="btn-outline mt-2 h-11 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Zap className="h-4 w-4 text-accent" /> Buy Now
      </button>

      <div className="my-5 grid grid-cols-2 gap-2.5 border-y border-white/[0.06] py-5 text-[12px] text-white/55">
        <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-accent" /> {isVcc ? "< 5 min delivery" : "Fast delivery"}</p>
        <p className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-accent" /> BTC · USDT</p>
        <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> {isVcc ? "No KYC" : "Login warranty"}</p>
        <p className="flex items-center gap-2"><Headphones className="h-3.5 w-3.5 text-accent" /> 24/7 support</p>
      </div>

      <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-outline w-full !py-3">
        <TelegramIcon className="h-4 w-4" /> Ask on Telegram
      </a>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/30">
        <BadgeCheck className="h-3.5 w-3.5 text-accent" />
        <Link href="/refund_returns/" className="hover:text-white hover:underline">Refund policy</Link>
      </p>
    </div>
  );
}
