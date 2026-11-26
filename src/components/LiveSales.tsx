"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, CreditCard, Flame, Sparkles, X } from "lucide-react";
import { allProducts } from "@/lib/products";

type Sale = {
  name: string;
  variant?: string;
  qty: number;
  price: number;
  coin: string;
  at: number;
  slug?: string;
  logo?: string;
  color: string;
  category?: string;
};

/** One card in the rotation: a real confirmed purchase, or a real product/deal from the catalogue. */
type Item =
  | { kind: "sale"; sale: Sale }
  | { kind: "deal"; label: string; hot: boolean; name: string; price: number; from: boolean; oldPrice?: number; note: string; slug: string; logo?: string; color: string };

const SHOW_MS = 7000; // how long each card stays on screen
const GAP_MS = 12000; // pause between cards
const REFRESH_MS = 60000; // re-check for new purchases

function timeAgo(at: number) {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

// Catalogue highlights — every claim here comes from the product data / site copy.
function buildDeals(): Item[] {
  const deals: Item[] = allProducts.map((p) => {
    const isVcc = p.category === "vcc";
    const save = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return {
      kind: "deal",
      label: p.badge ? p.badge : save ? `Save ${save}%` : isVcc ? "Virtual card" : "Featured deal",
      hot: Boolean(p.badge) || save >= 30,
      name: p.name,
      price: p.price,
      from: Boolean(p.priceTo),
      oldPrice: p.oldPrice,
      note: isVcc ? "Card details within 5 minutes" : "Login warranty included",
      slug: p.slug,
      logo: p.logo,
      color: p.color,
    };
  });
  // Shuffle so every visit shows a different order
  for (let i = deals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deals[i], deals[j]] = [deals[j], deals[i]];
  }
  return deals;
}

/**
 * Bottom-left rotating display: real confirmed purchases (from /api/recent-sales, recorded by the
 * crypto gateway) mixed with real product deals from the catalogue. No invented purchases.
 */
export default function LiveSales() {
  const pathname = usePathname();
  const [sales, setSales] = useState<Sale[]>([]);
  const [deals, setDeals] = useState<Item[]>([]);
  const [current, setCurrent] = useState<Item | null>(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const idx = useRef(0);

  const hiddenHere = pathname?.startsWith("/checkout");

  useEffect(() => {
    setClosed(sessionStorage.getItem("live-sales-closed") === "1");
    setDeals(buildDeals());
    let alive = true;
    const load = () =>
      fetch("/api/recent-sales/", { cache: "no-store" })
        .then((r) => r.json())
        .then((d: { sales?: Sale[] }) => alive && setSales(Array.isArray(d.sales) ? d.sales : []))
        .catch(() => {});
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // Real purchases first, then interleave them with deals
  const items = useMemo<Item[]>(() => {
    const real: Item[] = sales.map((sale) => ({ kind: "sale", sale }));
    const out: Item[] = [];
    const n = Math.max(real.length, deals.length);
    for (let i = 0; i < n; i++) {
      if (real[i]) out.push(real[i]);
      if (deals[i]) out.push(deals[i]);
    }
    return out;
  }, [sales, deals]);

  useEffect(() => {
    if (!items.length || closed) return;
    let hideT: ReturnType<typeof setTimeout>;
    let nextT: ReturnType<typeof setTimeout>;
    const show = () => {
      setCurrent(items[idx.current % items.length]);
      idx.current += 1;
      setVisible(true);
      hideT = setTimeout(() => setVisible(false), SHOW_MS);
      nextT = setTimeout(show, SHOW_MS + GAP_MS);
    };
    const first = setTimeout(show, 5000);
    return () => {
      clearTimeout(first);
      clearTimeout(hideT);
      clearTimeout(nextT);
    };
  }, [items, closed]);

  if (!current || closed || hiddenHere) return null;

  const close = () => {
    setVisible(false);
    setClosed(true);
    sessionStorage.setItem("live-sales-closed", "1");
  };

  const isSale = current.kind === "sale";
  const s = isSale ? current.sale : null;
  const d = current.kind === "deal" ? current : null;
  const href = s ? (s.slug ? `/${s.slug}/` : "/shop/") : `/${d!.slug}/`;
  const logo = s ? s.logo : d!.logo;
  const color = s ? s.color : d!.color;
  const title = s ? `${s.qty > 1 ? `${s.qty}× ` : ""}${s.name}${s.variant ? ` — ${s.variant}` : ""}` : d!.name;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`live-sale fixed bottom-5 left-5 z-40 w-[340px] max-w-[calc(100vw_-_110px)] ${visible ? "is-in" : ""}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#131216]/95 p-3 pr-8 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_-10px_rgba(249,115,22,0.45)] backdrop-blur-xl">
        <div className="top-line" />
        <button type="button" onClick={close} aria-label="Hide this display" className="absolute right-2 top-2 rounded-md p-1 text-white/30 transition hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
        <Link href={href} className="flex items-center gap-3">
          <span
            className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl"
            style={{ border: `1px solid ${color}55`, boxShadow: `0 6px 18px -8px ${color}` }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="h-full w-full scale-[1.18] object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center" style={{ background: "rgba(249,115,22,0.14)" }}>
                <CreditCard className="h-5 w-5 text-accent-bright" />
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            {s ? (
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-green-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                A customer just bought
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-accent-bright">
                {d!.hot ? <Flame className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                {d!.label}
              </span>
            )}
            <span className="mt-0.5 block truncate text-[13px] font-semibold text-white" title={title}>
              {title}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-white/40">
              {s ? (
                <>
                  <span className="price-glow text-[15px]">{usd(s.price)}</span>
                  <span>· {timeAgo(s.at)}</span>
                  <span className="inline-flex items-center gap-0.5 text-white/45">
                    · <BadgeCheck className="h-3 w-3 text-accent-bright" /> Paid in {s.coin}
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-baseline gap-1">
                    {d!.from && <span className="text-[10px] text-white/40">from</span>}
                    <span className="price-glow text-[15px]">{usd(d!.price)}</span>
                    {d!.oldPrice && d!.oldPrice > d!.price && <span className="text-white/30 line-through">{usd(d!.oldPrice)}</span>}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-white/45">
                    · <BadgeCheck className="h-3 w-3 text-accent-bright" /> {d!.note}
                  </span>
                </>
              )}
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
