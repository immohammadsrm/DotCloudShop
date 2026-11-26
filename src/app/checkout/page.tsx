"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Headphones,
  Loader2,
  Lock,
  Mail,
  Radar,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { ProviderTile, TelegramIcon, WhatsAppIcon } from "@/components/Icons";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CoinIcon from "@/components/checkout/CoinIcon";
import PaymentPanel from "@/components/checkout/PaymentPanel";
import { formatPrice, getProductById } from "@/lib/products";
import { AVAILABLE_COINS, getCoin, type CoinId, type QuoteItem, type SignedQuote, type VerifyResult } from "@/lib/payments";
import { site } from "@/lib/site";

const PENDING_KEY = "dotcloudshop-payment";
const MAX_PENDING_MS = 24 * 60 * 60 * 1000;

const coinTags: Partial<Record<CoinId, string>> = {
  USDT_TRC20: "Most popular",
  USDT_BEP20: "Low fees",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

function SummaryItems({ items }: { items: Array<QuoteItem & { key?: string }> }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const p = getProductById(i.id);
        return (
          <li key={i.key ?? `${i.id}${i.variant ?? ""}`} className="flex items-center gap-3">
            {p && <ProviderTile mono={p.mono} color={p.color} size="sm" logo={p.logo} alt="" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">{i.name}</p>
              <p className="truncate text-[11px] text-white/40">
                {i.variant ? `${i.variant} · ` : ""}Qty {i.qty}
              </p>
            </div>
            <span className="text-[13px] font-semibold tabular-nums text-white/85">{formatPrice(i.unit * i.qty)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, ready, clear, add } = useCart();
  const [step, setStep] = useState<"details" | "pay" | "done">("details");
  const [signed, setSigned] = useState<SignedQuote | null>(null);
  const [paid, setPaid] = useState<VerifyResult | null>(null);
  const [restored, setRestored] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "", notes: "" });
  const [coin, setCoin] = useState<CoinId>(AVAILABLE_COINS[0]?.id ?? "USDT_TRC20");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Resume an unfinished payment after a refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SignedQuote;
        if (s?.quote && Date.now() - s.quote.createdAt < MAX_PENDING_MS) {
          setSigned(s);
          setStep("pay");
        } else localStorage.removeItem(PENDING_KEY);
      }
    } catch {
      localStorage.removeItem(PENDING_KEY);
    }
    setRestored(true);
  }, []);

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) return setError("Please accept the refund policy to continue.");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout/quote/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product.id, variant: i.variant, qty: i.qty })),
          coin,
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start the payment.");
      localStorage.setItem(PENDING_KEY, JSON.stringify(data));
      setSigned(data as SignedQuote);
      clear();
      setStep("pay");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onPaid = useCallback((r: VerifyResult) => {
    setPaid(r);
    setStep("done");
    localStorage.removeItem(PENDING_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancelPayment = useCallback(() => {
    if (signed) for (const i of signed.quote.items) add(i.id, i.qty, i.variant);
    localStorage.removeItem(PENDING_KEY);
    setSigned(null);
    setStep("details");
  }, [signed, add]);

  const orderText = signed
    ? [
        `Order ${signed.quote.id}`,
        ...signed.quote.items.map((i) => `• ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty}`),
        `Paid: ${paid?.received ?? signed.quote.amount} ${getCoin(signed.quote.coin)?.symbol}`,
        paid?.txHash ? `TX: ${paid.txHash}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const stepNum = step === "details" ? 2 : step === "pay" ? 3 : 4;
  const emptyCart = ready && restored && items.length === 0 && step === "details";

  return (
    <section className="relative overflow-x-clip pb-24 pt-32 lg:pt-36">
      <div data-parallax="0.3" className="pointer-events-none absolute" style={{ top: "-10%", left: "-5%", width: 720, height: 540, background: "radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div className="container-xl relative">
        <CheckoutSteps current={stepNum as 2 | 3 | 4} />

        {emptyCart ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/[0.06] bg-ink-card p-10 text-center">
            <h1 className="heading mb-3 text-2xl">Your cart is empty</h1>
            <p className="mb-6 text-[14px] text-white/45">Add a product to start checkout.</p>
            <Link href="/shop/" className="btn-primary"><span>Browse Store</span><ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        ) : step === "done" && signed && paid ? (
          /* ───────────── DONE ───────────── */
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl border border-green-400/25 bg-ink-card p-8 text-center md:p-12">
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(74,222,128,0.22), transparent 70%)", filter: "blur(30px)" }} />
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <span className="animate-pulse-ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-2 border-green-400/60" />
                <span className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#4ade80,#16a34a)", boxShadow: "0 20px 50px -12px rgba(74,222,128,0.7)" }}>
                  <Check className="h-10 w-10 text-white" strokeWidth={3} />
                </span>
              </div>
              <h1 className="heading relative mb-2 text-3xl md:text-4xl">Payment confirmed!</h1>
              <p className="relative mb-6 text-[14px] text-white/55">
                Thank you, {signed.quote.customer.name}. Order <b className="text-white">{signed.quote.id}</b> is paid and on its way.
              </p>
              <div className="relative mb-6 grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/35">Amount received</p>
                  <p className="font-display text-xl font-bold text-white">{paid.received} {getCoin(signed.quote.coin)?.symbol}</p>
                  <p className="text-[12px] text-white/40">≈ {formatPrice(signed.quote.usdTotal)}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/35">Transaction</p>
                  {paid.txHash && (
                    <a href={getCoin(signed.quote.coin)?.explorerTx(paid.txHash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 break-all font-mono text-[12px] text-accent-soft hover:underline">
                      {paid.txHash.slice(0, 14)}…{paid.txHash.slice(-8)} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  )}
                  <p className="text-[12px] text-white/40">{getCoin(signed.quote.coin)?.network}</p>
                </div>
              </div>
              <div className="relative mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left">
                <SummaryItems items={signed.quote.items} />
              </div>
              <div className="relative mb-6 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4 text-left text-[13px] leading-relaxed text-white/70">
                <p className="mb-1 font-semibold text-white">What happens next</p>
                Your details will be delivered to <b className="text-white">{signed.quote.customer.email}</b>
                {signed.quote.customer.contact ? <> or <b className="text-white">{signed.quote.customer.contact}</b></> : null}. For the fastest delivery,
                message us on Telegram with your order ID.
              </div>
              <div className="relative flex flex-wrap justify-center gap-2">
                <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-primary" onClick={() => navigator.clipboard?.writeText(orderText).catch(() => {})}>
                  <TelegramIcon className="h-4 w-4" /><span>Message on Telegram</span>
                </a>
                <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    navigator.clipboard?.writeText(orderText).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1600);
                    }).catch(() => {});
                  }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy order"}
                </button>
              </div>
              <Link href="/shop/" className="relative mt-6 inline-block text-[13px] text-white/45 hover:text-white">Continue shopping →</Link>
            </div>
          </div>
        ) : step === "pay" && signed ? (
          /* ───────────── PAY ───────────── */
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-card p-5 md:p-8">
              <div className="top-line" />
              <PaymentPanel signed={signed} onPaid={onPaid} onCancel={cancelPayment} />
            </div>
            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-white/[0.07] bg-ink-card p-6">
                <h2 className="font-display mb-4 text-lg font-bold text-white">Order {signed.quote.id}</h2>
                <SummaryItems items={signed.quote.items} />
                <div className="mt-5 flex items-end justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-[13px] text-white/60">Total</span>
                  <span className="font-display text-2xl font-black text-white">{formatPrice(signed.quote.usdTotal)}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-white/[0.07] bg-ink-card p-6 text-[12px] text-white/55">
                <p className="mb-3 font-semibold text-white">How payment works</p>
                <ol className="space-y-3">
                  {[
                    [Wallet, "Send the exact amount to the address shown."],
                    [Radar, "We detect it on the blockchain automatically."],
                    [Zap, "Your order is confirmed and delivered."],
                  ].map(([Icon, t], idx) => {
                    const I = Icon as typeof Wallet;
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10"><I className="h-3.5 w-3.5 text-accent-bright" /></span>
                        <span className="pt-1">{t as string}</span>
                      </li>
                    );
                  })}
                </ol>
                <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 w-full !text-[12px]">
                  <Headphones className="h-3.5 w-3.5" /> Need help? {site.contact.telegramHandle}
                </a>
              </div>
            </aside>
          </div>
        ) : (
          /* ───────────── DETAILS ───────────── */
          <form onSubmit={startPayment} className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-card p-6 md:p-8">
                <div className="top-line" />
                <h1 className="heading mb-1 text-2xl">Where should we deliver?</h1>
                <p className="mb-6 text-[13px] text-white/45">We only need a way to send your order. No ID, no KYC, no account needed.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-[12px] font-medium text-white/55">
                    Full name
                    <input required maxLength={80} autoComplete="name" className="input mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </label>
                  <label className="block text-[12px] font-medium text-white/55">
                    Email for delivery
                    <input required type="email" maxLength={120} autoComplete="email" className="input mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                  </label>
                  <label className="block text-[12px] font-medium text-white/55 sm:col-span-2">
                    Telegram or WhatsApp <span className="text-white/30">(optional, for fastest delivery)</span>
                    <input maxLength={80} className="input mt-1.5" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="@username or +1 555 …" />
                  </label>
                  <label className="block text-[12px] font-medium text-white/55 sm:col-span-2">
                    Order notes <span className="text-white/30">(optional)</span>
                    <textarea rows={2} maxLength={500} className="input mt-1.5 resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. custom card balance" />
                  </label>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-card p-6 md:p-8">
                <h2 className="heading mb-1 text-2xl">Choose your crypto</h2>
                <p className="mb-6 text-[13px] text-white/45">You&apos;ll pay directly to our wallet. The exact amount is shown on the next step.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {AVAILABLE_COINS.map((c) => {
                    const on = coin === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCoin(c.id)}
                        aria-pressed={on}
                        className="relative flex items-center gap-3 rounded-2xl p-4 text-left transition-all duration-200"
                        style={
                          on
                            ? { background: `linear-gradient(135deg, ${c.color}22, rgba(249,115,22,0.06))`, border: `1px solid ${c.color}`, boxShadow: `0 0 0 3px ${c.color}22, 0 14px 30px -14px ${c.color}` }
                            : { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }
                        }
                      >
                        <CoinIcon coin={c} size={40} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-bold text-white">{c.symbol}</span>
                          <span className="block truncate text-[11px] text-white/45">{c.network}</span>
                        </span>
                        {coinTags[c.id] && (
                          <span className="absolute right-3 top-3 rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/50">{coinTags[c.id]}</span>
                        )}
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center self-end rounded-full" style={on ? { background: c.color } : { border: "1px solid rgba(255,255,255,0.15)" }}>
                          {on && <Check className="h-3 w-3 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-[13px] text-white/60">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-500" />
                  <span>
                    I agree to the <Link href="/refund_returns/" target="_blank" className="text-accent-bright hover:underline">refund & returns policy</Link> and understand crypto payments are final once sent.
                  </span>
                </label>

                {error && <p className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-[13px] text-red-300">{error}</p>}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <Link href="/cart/" className="btn-outline"><ArrowLeft className="h-3.5 w-3.5" /> Back to cart</Link>
                  <button type="submit" disabled={busy || !ready || items.length === 0} className="btn-primary !px-6 !py-3.5 !text-[14px]">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    <span>{busy ? "Locking your price…" : `Continue to payment · ${formatPrice(subtotal)}`}</span>
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="spin-border rounded-3xl p-px" style={{ "--glow": "#f97316" } as React.CSSProperties}>
                <div className="rounded-[23px] bg-ink-card p-6">
                  <h2 className="font-display mb-4 text-lg font-bold text-white">Your order</h2>
                  {ready ? (
                    <SummaryItems items={items.map((i) => ({ key: i.key, id: i.product.id, name: i.product.name, variant: i.variant, qty: i.qty, unit: i.unit }))} />
                  ) : (
                    <div className="h-20 animate-pulse rounded-xl bg-white/[0.03]" />
                  )}
                  <dl className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-[13px]">
                    <div className="flex justify-between"><dt className="text-white/45">Delivery</dt><dd className="text-green-400">Instant · Free</dd></div>
                    <div className="flex justify-between"><dt className="text-white/45">Network fee</dt><dd className="text-white/60">Paid by sender</dd></div>
                  </dl>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-[13px] font-semibold text-white">Total</span>
                    <span className="font-display text-[32px] font-black leading-none tabular-nums text-white">{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/[0.07] bg-ink-card p-6">
                <ul className="space-y-3 text-[12px] text-white/60">
                  <li className="flex items-start gap-2.5"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> Price is locked when you continue — you see the exact amount before paying.</li>
                  <li className="flex items-start gap-2.5"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Payments are verified on the blockchain automatically.</li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {site.stats.customers} customers · {site.stats.rating}/5 rating</li>
                  <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Support: {site.contact.telegramHandle} on Telegram</li>
                </ul>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
