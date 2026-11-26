"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Headphones,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { useCart, type CartItem } from "@/components/CartProvider";
import { ProviderTile } from "@/components/Icons";
import AddToCartButton from "@/components/AddToCartButton";
import Reveal from "@/components/Reveal";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CoinIcon from "@/components/checkout/CoinIcon";
import { allProducts, formatPrice, hasOptions } from "@/lib/products";
import { AVAILABLE_COINS } from "@/lib/payments";
import { testimonials } from "@/lib/content";
import { site } from "@/lib/site";

function regularOf(i: CartItem): number | undefined {
  const v = i.variant ? i.product.variants?.find((x) => x.name === i.variant) : i.product.variants?.length === 1 ? i.product.variants[0] : undefined;
  const r = v?.regular ?? i.product.oldPrice;
  return r && r > i.unit ? r : undefined;
}

const perks = [
  { icon: Zap, title: "Delivered in minutes", text: "Details arrive automatically once your payment confirms on-chain." },
  { icon: ShieldCheck, title: "Warranty & refunds", text: "Login warranty on cloud accounts and a clear refund policy on cards." },
  { icon: Lock, title: "No KYC, private checkout", text: "No ID, no bank. Pay straight to our wallet in crypto." },
  { icon: Headphones, title: "Real humans, 24/7", text: "Telegram & WhatsApp support before and after you buy." },
];

export default function CartPage() {
  const { items, ready, setQty, remove, count, subtotal } = useCart();
  const savings = items.reduce((n, i) => n + ((regularOf(i) ?? i.unit) - i.unit) * i.qty, 0);
  const inCart = new Set(items.map((i) => i.product.id));
  const suggestions = allProducts.filter((p) => !inCart.has(p.id) && (p.badge === "Best Seller" || p.badge === "Popular")).slice(0, 3);
  const review = testimonials[0];

  return (
    <section className="relative overflow-x-clip pb-24 pt-32 lg:pt-36">
      <div data-parallax="0.3" className="pointer-events-none absolute" style={{ top: "-10%", left: "-5%", width: 700, height: 520, background: "radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div data-parallax="-0.2" className="pointer-events-none absolute" style={{ top: "20%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="container-xl relative">
        <CheckoutSteps current={1} />

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="badge mb-3 w-fit">
              <Lock className="h-3 w-3" /> Secure crypto checkout
            </div>
            <h1 className="heading text-[clamp(32px,4vw,48px)] font-black">
              Your <span className="text-gradient">Cart</span>
              {count > 0 && <span className="ml-3 align-middle text-[15px] font-semibold text-white/35">{count} item{count === 1 ? "" : "s"}</span>}
            </h1>
          </div>
          <Link href="/shop/" className="text-[13px] text-white/45 transition hover:text-white">← Continue shopping</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ───── Left column ───── */}
          <div className="min-w-0 space-y-8">
            {!ready ? (
              <div className="h-48 animate-pulse rounded-3xl bg-white/[0.03]" />
            ) : items.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-card px-6 py-20 text-center">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.2), transparent 70%)", filter: "blur(30px)" }} />
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl" style={{ background: "linear-gradient(135deg,#fb923c,#ea580c)", boxShadow: "0 20px 50px -15px rgba(234,88,12,0.8)" }}>
                  <ShoppingCart className="h-9 w-9 text-white" />
                </div>
                <h2 className="font-display relative mb-2 text-2xl font-bold text-white">Your cart is empty</h2>
                <p className="relative mx-auto mb-8 max-w-sm text-[14px] text-white/45">
                  Grab a reloadable virtual card or a ready-to-use cloud account — delivered in minutes.
                </p>
                <div className="relative flex flex-wrap justify-center gap-3">
                  <Link href="/#pricing" className="btn-primary !px-6 !py-3"><span>Virtual Cards</span><ArrowRight className="h-3.5 w-3.5" /></Link>
                  <Link href="/shop/#cloud" className="btn-outline !px-6 !py-3">Cloud Accounts</Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((i) => {
                  const { key, product: p, variant, qty, unit } = i;
                  const regular = regularOf(i);
                  return (
                    <li
                      key={key}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-card p-4 transition-all duration-300 hover:border-white/[0.14] sm:p-5"
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-70" style={{ background: `linear-gradient(180deg, ${p.color}, transparent)` }} />
                      <div className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle, ${p.color}25, transparent 70%)` }} />
                      <div className="relative flex flex-wrap items-center gap-4 sm:flex-nowrap">
                        <ProviderTile mono={p.mono} color={p.color} size="lg" logo={p.logo} alt={`${p.provider} logo`} />
                        <div className="min-w-0 flex-1">
                          <Link href={`/${p.slug}/`} className="font-display text-[16px] font-bold text-white transition hover:text-accent-bright">
                            {p.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {variant && (
                              <span className="rounded-md border border-accent/25 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-soft">{variant}</span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-white/40"><Clock className="h-3 w-3" /> Instant delivery</span>
                          </div>
                          <p className="mt-1.5 text-[12px] tabular-nums text-white/40">
                            {formatPrice(unit)} each
                            {regular && (
                              <>
                                <span className="ml-1.5 line-through">{formatPrice(regular)}</span>
                                <span className="ml-1.5 font-semibold text-green-400">−{Math.round((1 - unit / regular) * 100)}%</span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                          <button type="button" aria-label="Decrease quantity" onClick={() => setQty(key, qty - 1)} className="flex h-10 w-10 items-center justify-center text-white/60 hover:text-white">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-[14px] tabular-nums">{qty}</span>
                          <button type="button" aria-label="Increase quantity" onClick={() => setQty(key, qty + 1)} className="flex h-10 w-10 items-center justify-center text-white/60 hover:text-white">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="w-28 text-right">
                          <p className="font-display text-[18px] font-black tabular-nums text-white">{formatPrice(unit * qty)}</p>
                          {regular && <p className="text-[11px] tabular-nums text-green-400">You save {formatPrice((regular - unit) * qty)}</p>}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${p.name}`}
                          onClick={() => remove(key)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Why buy here */}
            <div className="grid gap-3 sm:grid-cols-2">
              {perks.map(({ icon: Icon, title, text }, idx) => (
                <Reveal key={title} delay={(idx % 2) * 90}>
                <div className="feature-card !flex-row !gap-4 !rounded-2xl !p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.28)" }}>
                    <Icon className="h-5 w-5 text-accent-bright" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-white">{title}</p>
                    <p className="text-[12px] leading-relaxed text-white/45">{text}</p>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>

            {/* Review */}
            <Reveal>
            <figure className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-accent-bright text-accent-bright" />)}</span>
                <span className="text-[12px] font-semibold text-white/70">{site.stats.rating}/5 from {site.stats.customers} customers</span>
              </div>
              <blockquote className="mb-4 text-[14px] leading-relaxed text-white/65">&ldquo;{review.text}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#fb923c,#9a3412)" }}>{review.initials}</span>
                <span className="text-[12px]"><span className="font-semibold text-white">{review.name}</span> <span className="text-white/40">· {review.role}</span></span>
              </figcaption>
            </figure>
            </Reveal>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Reveal>
                <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold text-white"><Sparkles className="h-4 w-4 text-accent" /> Complete your setup</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {suggestions.map((p) => (
                    <div key={p.id} className="flex flex-col rounded-2xl border border-white/[0.06] bg-ink-card p-4 transition hover:border-white/[0.14]">
                      <div className="mb-3 flex items-center gap-3">
                        <ProviderTile mono={p.mono} color={p.color} logo={p.logo} alt={`${p.provider} logo`} />
                        <div className="min-w-0">
                          <Link href={`/${p.slug}/`} className="block truncate text-[13px] font-semibold text-white hover:text-accent-bright">{p.name}</Link>
                          <p className="text-[12px] text-white/40">{p.priceTo ? "From " : ""}{formatPrice(p.price)}</p>
                        </div>
                      </div>
                      {hasOptions(p) ? (
                        <Link href={`/${p.slug}/`} className="btn-outline mt-auto w-full !py-2 !text-[12px]">Choose option</Link>
                      ) : (
                        <AddToCartButton id={p.id} variant="outline" label="Add" className="mt-auto w-full !py-2 !text-[12px]" />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ───── Summary ───── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="spin-border rounded-3xl p-px" style={{ "--glow": "#f97316" } as React.CSSProperties}>
              <div className="relative rounded-[23px] bg-ink-card p-6">
                <h2 className="font-display mb-5 text-lg font-bold text-white">Order summary</h2>
                <dl className="space-y-3 text-[13px]">
                  <div className="flex justify-between"><dt className="text-white/45">Subtotal ({count} item{count === 1 ? "" : "s"})</dt><dd className="tabular-nums">{formatPrice(subtotal + savings)}</dd></div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-400"><dt className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Discount</dt><dd className="tabular-nums">−{formatPrice(savings)}</dd></div>
                  )}
                  <div className="flex justify-between"><dt className="text-white/45">Delivery</dt><dd className="text-green-400">Instant · Free</dd></div>
                  <div className="flex justify-between"><dt className="text-white/45">KYC / fees</dt><dd className="text-white/70">None</dd></div>
                </dl>
                <div className="my-5 h-px bg-white/[0.07]" />
                <div className="mb-6 flex items-end justify-between">
                  <span className="text-[13px] font-semibold text-white">Total</span>
                  <span className="font-display text-[34px] font-black leading-none tabular-nums text-white">{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <p className="-mt-3 mb-5 rounded-xl border border-green-400/20 bg-green-400/[0.07] px-3 py-2 text-center text-[12px] font-semibold text-green-400">
                    🎉 You&apos;re saving {formatPrice(savings)} on this order
                  </p>
                )}

                {count > 0 ? (
                  <Link href="/checkout/" className="btn-primary w-full !py-3.5 !text-[14px]">
                    <Lock className="h-4 w-4" />
                    <span>Secure Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button type="button" disabled className="btn-primary w-full !py-3.5"><span>Secure Checkout</span></button>
                )}

                <div className="mt-5">
                  <p className="mb-2 text-center text-[10px] uppercase tracking-[0.16em] text-white/30">Pay with</p>
                  <div className="flex justify-center gap-3">
                    {AVAILABLE_COINS.map((c) => (
                      <span key={c.id} title={`${c.symbol} · ${c.network}`}>
                        <CoinIcon coin={c} size={34} />
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-5 text-[12px] text-white/55">
                  <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" /> Verified cards & accounts only</li>
                  <li className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-accent" /> <Link href="/refund_returns/" className="hover:text-white hover:underline">Refund & replacement policy</Link></li>
                  <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-accent" /> Help on Telegram: {site.contact.telegramHandle}</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
