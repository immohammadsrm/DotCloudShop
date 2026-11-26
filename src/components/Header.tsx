"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, CreditCard, Headphones, Menu, ShieldCheck, ShoppingCart, Wallet, X, Zap } from "lucide-react";
import { cloudProducts, formatPrice, vccProducts } from "@/lib/products";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { ProviderTile, TelegramIcon, WhatsAppIcon } from "./Icons";
import Logo from "./Logo";

// Desktop menu items: laser underline on hover (see .nav-laser in globals.css)
const navLink = "nav-laser";

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"cloud" | "vcc" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  const solid = scrolled || open;
  const path = (pathname ?? "/").replace(/\/+$/, "") || "/";
  const nav = (href: string, extra = false) => `${navLink}${path === (href.replace(/\/+$/, "") || "/") || extra ? " is-active" : ""}`;
  const productPath = path.slice(1);
  const onCloud = cloudProducts.some((p) => p.slug === productPath);
  const onVcc = vccProducts.some((p) => p.slug === productPath);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: solid ? "rgba(10,10,12,0.8)" : "transparent",
        backdropFilter: solid ? "blur(20px) saturate(140%)" : "none",
        WebkitBackdropFilter: solid ? "blur(20px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      {/* Tagline strip */}
      <div
        className={`overflow-hidden border-b border-white/[0.05] transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"}`}
        style={{ background: "rgba(249,115,22,0.05)" }}
      >
        <div className="container-xl flex h-8 items-center justify-between text-[11px] text-white/45">
          <span className="font-medium text-accent-soft/80">{site.tagline}</span>
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-accent" /> Instant Delivery</span>
            <span className="flex items-center gap-1.5"><Wallet className="h-3 w-3 text-accent" /> Crypto Payment</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-accent" /> No KYC</span>
            <span className="flex items-center gap-1.5"><Headphones className="h-3 w-3 text-accent" /> 24/7 Support</span>
          </div>
        </div>
      </div>

      <div className="container-xl">
        <div className="flex h-[68px] items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setMenu(null)}>
            <Link href="/" className={nav("/")} onMouseEnter={() => setMenu(null)}>Home</Link>

            <div className="relative" onMouseEnter={() => setMenu("cloud")}>
              <Link href="/shop/" className={`${nav("/__", onCloud)}${menu === "cloud" ? " is-open" : ""}`} aria-haspopup="true" aria-expanded={menu === "cloud"}>
                Cloud Services <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menu === "cloud" ? "rotate-180" : ""}`} />
              </Link>
              {menu === "cloud" && (
                <div className="absolute left-1/2 top-full w-[720px] -translate-x-[30%] pt-3">
                  <div className="glass dropdown-in p-3">
                    <div className="mb-2 flex items-center justify-between px-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">{cloudProducts.length} cloud platforms</span>
                      <Link href="/shop/#cloud" className="flex items-center gap-1 text-[11px] font-semibold text-accent-bright hover:text-accent-soft">
                        View all <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {cloudProducts.map((p) => (
                        <Link key={p.id} href={`/${p.slug}/`} className="sub-item">
                          <span className="sub-icon"><ProviderTile mono={p.mono} color={p.color} size="sm" logo={p.logo} /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12.5px] font-semibold">{p.provider}</span>
                            <span className="block text-[10.5px] text-white/35">{p.priceTo ? "from " : ""}<span className="sub-price">{formatPrice(p.price)}</span></span>
                          </span>
                          <ArrowRight className="sub-arrow h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setMenu("vcc")}>
              <Link href="/#pricing" className={`${nav("/__", onVcc)}${menu === "vcc" ? " is-open" : ""}`} aria-haspopup="true" aria-expanded={menu === "vcc"}>
                Virtual Cards <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menu === "vcc" ? "rotate-180" : ""}`} />
              </Link>
              {menu === "vcc" && (
                <div className="absolute left-0 top-full w-[460px] pt-3">
                  <div className="glass dropdown-in p-3">
                    <div className="mb-2 flex items-center justify-between px-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Prepaid virtual cards</span>
                      <Link href="/#pricing" className="flex items-center gap-1 text-[11px] font-semibold text-accent-bright hover:text-accent-soft">
                        All VCC prices <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {vccProducts.map((p) => (
                        <Link key={p.id} href={`/${p.slug}/`} className="sub-item">
                          <span className="sub-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}>
                            <CreditCard className="h-4 w-4 text-accent-bright" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12.5px] font-semibold">{formatPrice(p.balance ?? 0)} Card</span>
                            <span className="block text-[10.5px] text-white/35">total <span className="sub-price">{formatPrice(p.price)}</span></span>
                          </span>
                          <ArrowRight className="sub-arrow h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop/" className={nav("/shop")} onMouseEnter={() => setMenu(null)}>Shop</Link>
            <Link href="/refund_returns/" className={nav("/refund_returns")} onMouseEnter={() => setMenu(null)}>Refund Policy</Link>
            <Link href="/contact-us/" className={nav("/contact-us")} onMouseEnter={() => setMenu(null)}>Contact Us</Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on Telegram"
              title="Chat on Telegram"
              className="social-btn"
              style={{ "--brand": "#229ED9" } as React.CSSProperties}
            >
              <TelegramIcon className="h-[17px] w-[17px]" />
            </a>
            <a
              href={site.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
              className="social-btn"
              style={{ "--brand": "#25D366" } as React.CSSProperties}
            >
              <WhatsAppIcon className="h-[17px] w-[17px]" />
            </a>
            <span className="mx-0.5 hidden h-6 w-px bg-white/10 sm:block" />
            <Link
              href="/cart/"
              aria-label={`Cart, ${count} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            </Link>
            <Link href="/shop/" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
              <span>Browse Store</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto border-t border-white/[0.06] lg:hidden">
          <div className="container-xl space-y-1 py-4">
            {[
              ["Home", "/"],
              ["Cloud Services", "/shop/"],
              ["Virtual Cards", "/#pricing"],
              ["Shop", "/shop/"],
              ["Refund Policy", "/refund_returns/"],
              ["Contact Us", "/contact-us/"],
              ["Cart", "/cart/"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-[15px] text-white/70 hover:bg-white/[0.04] hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link href="/shop/" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full !py-3">
              <span>Browse Store</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
