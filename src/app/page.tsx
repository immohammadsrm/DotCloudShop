import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Check, Cloud, CreditCard, Layers, MessageSquareQuote, Plus, ShieldCheck, Sparkles, Star } from "lucide-react";
import { cloudProducts, formatPrice, vccProducts } from "@/lib/products";
import { article, faqs, features, keywords, steps, testimonials, ticker } from "@/lib/content";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import HeroMockup from "@/components/HeroMockup";
import FaqAccordion from "@/components/FaqAccordion";
import TickerIcon from "@/components/TickerIcon";
import { ProviderTile, TelegramIcon, WhatsAppIcon, featureIcons } from "@/components/Icons";

const gradientText = {
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
} as const;

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div data-parallax="0.3" className="pointer-events-none absolute" style={{ top: "-10%", left: "-5%", width: 700, height: 700, background: "radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div data-parallax="-0.2" className="pointer-events-none absolute" style={{ bottom: 0, right: "10%", width: 420, height: 420, background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at 70% 40%, black 10%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, black 10%, transparent 65%)",
          }}
        />
        <div className="container-xl relative z-10 grid w-full grid-cols-1 items-center gap-12 pb-16 pt-36 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pb-24 lg:pt-44">
          <Reveal className="max-w-xl">
            <div className="badge mb-5 w-fit">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
              {site.tagline}
            </div>
            <h1 className="font-display mb-5 font-black leading-[1.04] tracking-tight text-white" style={{ fontSize: "clamp(36px, 4.8vw, 60px)" }}>
              <span style={{ background: "linear-gradient(135deg, #ffedd5, #fb923c 45%, #ea580c)", ...gradientText }}>Virtual Cards</span>
              <span className="text-white/30"> &amp; </span>
              <br className="hidden sm:block" />
              <span style={{ background: "linear-gradient(135deg, #ffffff, #fdba74 70%)", ...gradientText }}>Cloud Accounts</span>
              <br />
              <span className="text-white/90">paid with crypto.</span>
            </h1>
            <p className="mb-6 max-w-md text-[15px] leading-relaxed text-white/45">
              Reloadable VCCs from $10 to $2,000 and ready-to-use accounts from {cloudProducts.length} cloud providers.
              No KYC, delivered in minutes, backed by 24/7 support.
            </p>

            {/* Two product pills */}
            <div className="mb-7 grid max-w-md grid-cols-2 gap-2">
              <Link href="#pricing" className="group flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/[0.06] p-3 transition hover:border-accent/50 hover:bg-accent/[0.1]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg,#fb923c,#ea580c)" }}>
                  <CreditCard className="h-4 w-4 text-white" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-white">Virtual Cards</span>
                  <span className="block text-[11px] text-white/40">from {formatPrice(vccProducts[0].price)}</span>
                </span>
              </Link>
              <Link href="#cloud" className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink-raised">
                  <Cloud className="h-4 w-4 text-accent-soft" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-white">Cloud Accounts</span>
                  <span className="block text-[11px] text-white/40">from {formatPrice(Math.min(...cloudProducts.map((p) => p.price)))}</span>
                </span>
              </Link>
            </div>

            <div className="mb-9 flex flex-wrap items-center gap-3">
              <Link href="/shop/" className="btn-primary !px-5 !py-2.5">
                <span>Browse Store</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/contact-us/" className="btn-outline !px-5 !py-2.5">Contact Us</Link>
              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <Check className="h-3.5 w-3.5 text-accent" /> Instant delivery
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {[
                [site.stats.rating, "Rating"],
                [site.stats.customers, "Customers"],
                [site.stats.delivery, "Delivery Time"],
                [site.stats.kyc, "KYC Required"],
              ].map(([v, l]) => (
                <div key={l} className="flex flex-col">
                  <span className="font-display text-[19px] font-black leading-none text-white">{v}</span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-wider text-white/25">{l}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150} className="hidden items-center justify-center lg:flex">
            <HeroMockup />
          </Reveal>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28" style={{ background: "linear-gradient(to bottom, transparent, #0a0a0c)" }} />
      </section>

      {/* ───────── TICKER ───────── */}
      <section className="relative overflow-hidden border-y border-white/[0.05] py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32" style={{ background: "linear-gradient(to right, #0a0a0c, transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32" style={{ background: "linear-gradient(to left, #0a0a0c, transparent)" }} />
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center" style={{ width: "max-content" }}>
            {[...ticker, ...ticker].map((u, i) => (
              <div key={i} className="group mx-6 flex shrink-0 items-center gap-3 text-white/45 transition hover:text-white">
                <span className="transition-transform duration-300 group-hover:scale-110">
                  <TickerIcon item={u} color={cloudProducts.find((p) => p.logo === u.logo)?.color} />
                </span>
                <span className="font-display text-[15px] font-semibold">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CHOOSE YOUR PATH ───────── */}
      <section className="section-pad relative">
        <div className="container-xl">
          <SectionHeading
            badge="Two products · One checkout"
            icon={<Sparkles className="h-3 w-3" />}
            title="Everything you need to"
            highlight="pay & deploy"
            text="Pay for anything online with a reloadable virtual card, or launch on a ready-to-use cloud account. Same crypto checkout, same fast delivery."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Virtual cards path */}
            <Reveal>
              <Link href="#pricing" className="group relative block h-full overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 md:p-10" style={{ background: "linear-gradient(145deg, rgba(249,115,22,0.16), #131216 55%)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div className="animate-beam h-full w-1/2" style={{ background: "linear-gradient(90deg, transparent, #fdba74, transparent)" }} />
                </div>
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.35), transparent 65%)", filter: "blur(30px)" }} />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg,#fb923c,#ea580c)", boxShadow: "0 14px 34px -10px rgba(234,88,12,0.8)" }}>
                      <CreditCard className="h-6 w-6 text-white" />
                    </span>
                    <span className="font-display text-[12px] font-semibold tracking-widest text-white/25">01</span>
                  </div>
                  <h3 className="heading mb-3 text-3xl md:text-4xl">Virtual Cards</h3>
                  <p className="mb-6 max-w-md text-[14px] leading-relaxed text-white/50">
                    Reloadable VCCs with card number, expiry and CVV — for ads, subscriptions, SaaS, hosting and
                    international payments. No KYC.
                  </p>
                  <div className="mb-8 flex flex-wrap gap-1.5">
                    {vccProducts.map((p) => (
                      <span key={p.id} className="rounded-lg border border-accent/20 bg-black/20 px-2.5 py-1 font-display text-[12px] font-bold text-accent-soft">
                        {formatPrice(p.balance ?? 0)}
                      </span>
                    ))}
                    <span className="rounded-lg border border-dashed border-white/15 px-2.5 py-1 text-[12px] text-white/40">+ custom</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">From</p>
                      <p className="font-display text-3xl font-black text-white">{formatPrice(vccProducts[0].price)}</p>
                    </div>
                    <span className="btn-primary">
                      <span>See card prices</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* Cloud accounts path */}
            <Reveal delay={120}>
              <Link href="#cloud" className="group relative block h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 md:p-10">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div className="animate-beam h-full w-1/2" style={{ background: "linear-gradient(90deg, transparent, #ffffff80, transparent)", animationDelay: "1.2s" }} />
                </div>
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-50 transition-opacity duration-500 group-hover:opacity-90" style={{ background: "radial-gradient(circle, rgba(66,133,244,0.22), transparent 65%)", filter: "blur(30px)" }} />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-ink-raised">
                      <Cloud className="h-6 w-6 text-accent-soft" />
                    </span>
                    <span className="font-display text-[12px] font-semibold tracking-widest text-white/25">02</span>
                  </div>
                  <h3 className="heading mb-3 text-3xl md:text-4xl">Cloud Accounts</h3>
                  <p className="mb-6 max-w-md text-[14px] leading-relaxed text-white/50">
                    Ready-to-use accounts from {cloudProducts.length} providers — free-trial credits, vCPU tiers, Port 25
                    open and high-credit accounts, with login warranty.
                  </p>
                  <div className="mb-8 grid grid-cols-5 gap-1.5 sm:grid-cols-8">
                    {cloudProducts.map((p, idx) => (
                      <div
                        key={p.id}
                        title={p.provider}
                        className="aspect-square overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105"
                        style={{ border: `1px solid ${p.color}40`, boxShadow: `0 6px 16px -8px ${p.color}`, transitionDelay: `${idx * 15}ms` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logo} alt={`${p.provider} logo`} loading="lazy" className="h-full w-full scale-[1.18] object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">From</p>
                      <p className="font-display text-3xl font-black text-white">{formatPrice(Math.min(...cloudProducts.map((p) => p.price)))}</p>
                    </div>
                    <span className="btn-outline">
                      Browse providers
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── VIRTUAL CARDS ───────── */}
      <section id="pricing" className="relative scroll-mt-24 py-14 md:py-20">
        <div data-parallax="0.25" className="pointer-events-none absolute left-0 top-0 h-[200px] w-[500px]" style={{ background: "radial-gradient(ellipse at top left, rgba(249,115,22,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="container-xl relative">
          <SectionHeading
            align="left"
            badge="Virtual Cards"
            icon={<CreditCard className="h-3 w-3" />}
            title="Prices To Buy VCC"
            highlight="With Crypto"
            text="Pick the loaded balance you need. Every card includes the card number, expiry date and CVV."
          />
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vccProducts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6">
            <div
              className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.12), #131216 70%)", border: "1px solid rgba(249,115,22,0.22)" }}
            >
              <div className="top-line" />
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <Plus className="h-4 w-4 text-accent-bright" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-bold text-white">Want a custom card? Contact us via Telegram</h3>
                  <p className="text-[12px] text-white/45">
                    Message {site.contact.telegramHandle} to load a custom balance. Buy VCC with any amount loaded.
                  </p>
                </div>
              </div>
              <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-primary w-fit shrink-0 px-4 py-2 text-[13px]">
                <TelegramIcon className="h-4 w-4" />
                <span>Message on Telegram</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── CLOUD ACCOUNTS ───────── */}
      <section id="cloud" className="relative scroll-mt-24 py-14 md:py-20">
        <div data-parallax="0.25" className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[600px] -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="container-xl relative">
          <SectionHeading
            badge={`${cloudProducts.length} cloud platforms available`}
            icon={<Layers className="h-3 w-3" />}
            title="Premium"
            highlight="Cloud Accounts"
            text="Ready-to-use accounts from the major cloud providers, with login support and warranty."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cloudProducts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60} className="h-full">
                <Link href={`/${p.slug}/`} className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card p-5 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }} />
                    <div className="mb-4 flex items-start justify-between">
                      <ProviderTile mono={p.mono} color={p.color} logo={p.logo} alt={`${p.provider} logo`} />
                      {p.badge ? (
                        <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent-soft">{p.badge}</span>
                      ) : p.oldPrice ? (
                        <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-white/50">
                          Save {Math.round((1 - p.price / p.oldPrice) * 100)}%
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-display mb-1.5 text-[15px] font-bold text-white">{p.provider}</h3>
                    <p className="mb-5 flex-1 text-[12px] leading-relaxed text-white/40">{p.short}</p>
                    <div className="flex items-end justify-between gap-2">
                      <div className="price-chip">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">{p.priceTo ? "From" : "Price"}</span>
                        <span className="price-glow text-[22px]">{formatPrice(p.price)}</span>
                        {p.oldPrice && <span className="text-[12px] font-medium text-white/35 line-through">{formatPrice(p.oldPrice)}</span>}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold transition-all group-hover:gap-2.5" style={{ color: p.color }}>
                        View Accounts <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/shop/#cloud" className="btn-outline">Browse all products <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="section-pad relative">
        <div className="container-xl">
          <SectionHeading badge="How it works?" title="Three" highlight="Simple" after=" Steps." text="The same fast checkout for virtual cards and cloud accounts." />
          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-14 hidden h-px md:block" style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.35), transparent)" }} />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="feature-card items-center text-center hover:-translate-y-2">
                  <div className="font-display relative mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-2xl text-xl font-black text-white" style={{ background: "linear-gradient(135deg,#fb923c,#ea580c)", boxShadow: "0 12px 30px -10px rgba(234,88,12,0.7)" }}>
                    {s.n}
                  </div>
                  <h3 className="font-display mb-3 text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-white/45">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── GUARANTEE BANNER ───────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div data-parallax="0.2" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(249,115,22,0.14) 0%, transparent 60%)" }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
        <Reveal className="container-xl relative z-10 text-center">
          <div className="badge mx-auto mb-8 w-fit">Instant Money Back Guarantee*</div>
          <h2 className="heading mb-8 text-5xl md:text-6xl lg:text-7xl">
            Just 5 minutes! <br />
            Your Card or Cloud Account <span className="text-gradient">in Your Hand!!</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/45 md:text-xl">
            No bank application, no KYC. Pay with crypto and start paying or deploying in minutes.
          </p>
          <div className="mx-auto mb-10 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              ["Buy VCC at a cheap price", "Low fees on every card balance."],
              ["Any amount loaded", "Custom cards available on request."],
              ["Cloud login warranty", "Full refund if delivery is late."],
            ].map(([t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-ink-card/80 p-4">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-bright" />
                <div>
                  <p className="text-[14px] font-semibold text-white">{t}</p>
                  <p className="text-[12px] text-white/45">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-primary !px-6 !py-3">
              <TelegramIcon className="h-4 w-4" />
              <span>Telegram</span>
            </a>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline !px-6 !py-3">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <p className="mt-6 text-[11px] text-white/30">
            *See our <Link href="/refund_returns/" className="text-accent-bright hover:underline">refund policy</Link> for details.
          </p>
        </Reveal>
      </section>

      {/* ───────── WHY CHOOSE US ───────── */}
      <section id="features" className="section-pad relative">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 75% 50%, rgba(249,115,22,0.06) 0%, transparent 55%)" }} />
        <div className="container-xl relative">
          <SectionHeading
            badge="Why DotCloudShop"
            icon={<ShieldCheck className="h-3 w-3" />}
            title="Why Choose Us for Your"
            highlight="VCC & Cloud Needs?"
            text="Fast, private payments and ready-to-use infrastructure, with support around the clock."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = featureIcons[f.icon];
              return (
                <Reveal key={f.title} delay={(i % 3) * 90}>
                  <div className="feature-card group hover:-translate-y-2">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, transparent, #f9731660, transparent)" }} />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at top left, rgba(249,115,22,0.14), transparent 60%)" }} />
                    <div className="relative mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid #f9731628" }}>
                      <Icon className="h-5 w-5 text-accent-bright" />
                    </div>
                    <h3 className="font-display relative mb-3 text-lg font-bold text-white">{f.title}</h3>
                    <p className="relative flex-1 text-sm leading-relaxed text-white/45">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop/" className="btn-primary"><span>Browse Products</span><ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* ───────── NUMBERS ───────── */}
      <section className="section-pad relative overflow-hidden">
        <div data-parallax="0.3" className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} />
        <div className="container-xl relative">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              [site.stats.rating, "Rating", "From our customers"],
              [site.stats.customers, "Customers", "Worldwide"],
              [site.stats.delivery, "Delivery Time", "Automated delivery"],
              [site.stats.kyc, "KYC Required", "Crypto checkout"],
            ].map(([v, l, s], i) => (
              <Reveal key={l} delay={i * 80}>
                <div className="feature-card relative items-center !p-6 text-center hover:-translate-y-2 md:!p-8">
                  <div className="font-display mb-3 text-4xl font-black leading-none md:text-5xl" style={{ background: "linear-gradient(135deg, #fed7aa, #f97316, #fb923c)", ...gradientText, filter: "drop-shadow(0 0 20px rgba(251,146,60,0.35))" }}>
                    {v}
                  </div>
                  <div className="mb-1 text-[15px] font-semibold text-white">{l}</div>
                  <div className="text-[12px] text-white/30">{s}</div>
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #fb923c, transparent)" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="section-pad relative overflow-hidden">
        <div className="container-xl">
          <SectionHeading
            badge="Reviews for DotCloudShop"
            icon={<Star className="h-3 w-3 fill-current" />}
            title="Our Customers Say"
            highlight="About Us"
            text="Many of our customers come back again and again."
          />
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28" style={{ background: "linear-gradient(to right, #0a0a0c, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28" style={{ background: "linear-gradient(to left, #0a0a0c, transparent)" }} />
          <div className="flex overflow-hidden">
            <div className="animate-marquee-slow flex gap-4 pb-4" style={{ width: "max-content" }}>
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="flex w-[360px] shrink-0 flex-col rounded-3xl border border-white/[0.06] bg-ink-card p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <MessageSquareQuote className="h-6 w-6 text-accent/60" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-accent-bright text-accent-bright" />
                      ))}
                    </div>
                  </div>
                  <p className="mb-6 flex-1 text-[13px] leading-relaxed text-white/60">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-white/[0.05] pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#fb923c,#9a3412)" }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{t.name}</p>
                      <p className="text-[11px] text-white/35">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── LONG-FORM ARTICLE ───────── */}
      <section className="section-pad relative">
        <div className="container-xl">
          <SectionHeading badge="Before you buy VCC, read this" icon={<BookOpen className="h-3 w-3" />} title="All Details About" highlight="Buy VCC" />
          <Reveal>
            <details className="group mx-auto max-w-4xl rounded-3xl border border-white/[0.06] bg-ink-card p-6 md:p-10">
              <summary className="flex cursor-pointer list-none flex-col gap-4 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{article[0].h}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/50">{article[0].p}</p>
                </div>
                <span className="btn-outline shrink-0 !text-[12px]">
                  <span className="group-open:hidden">Read more</span>
                  <span className="hidden group-open:inline">Show less</span>
                </span>
              </summary>
              <div className="prose-dark mt-4 border-t border-white/[0.05] pt-2">
                {article.slice(1).map((s) => (
                  <div key={s.h}>
                    <h3>{s.h}</h3>
                    {s.p && <p>{s.p}</p>}
                    {s.list && (
                      <ul>
                        {s.list.map((li) => (
                          <li key={li}>
                            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <h3>Conclusion</h3>
                <p>
                  <strong className="text-white/80">Get started today</strong> — pick a card, pay with crypto and have it in your hand in about five minutes.
                </p>
              </div>
            </details>
          </Reveal>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="section-pad relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[600px] -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="container-xl relative mx-auto max-w-3xl">
          <Reveal className="mb-12 text-center">
            <div className="badge mx-auto mb-6 w-fit">Quick Answers</div>
            <h2 className="heading mb-5 text-4xl md:text-5xl">Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p className="text-base text-white/40">Can&apos;t find your answer?</p>
          </Reveal>
          <Reveal><FaqAccordion items={faqs} /></Reveal>
          <div className="mt-10 text-center">
            <Link href="/contact-us/" className="btn-primary"><span>Contact Support</span><ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* ───────── KEYWORDS ───────── */}
      <section className="pb-20">
        <div className="container-xl">
          <Reveal>
            <h2 className="font-display mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Most Searched Keywords for Buy VCC
            </h2>
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
              {keywords.map((k) => (
                <Link key={k} href="/#pricing" className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] text-white/40 transition hover:border-accent/40 hover:text-accent-soft">
                  {k}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
