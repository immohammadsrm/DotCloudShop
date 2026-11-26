"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { AlertTriangle, Check, Copy, ExternalLink, Loader2, RefreshCw, Search, ShieldCheck, Timer, Wallet, X } from "lucide-react";
import { getCoin, type SignedQuote, type VerifyResult } from "@/lib/payments";
import { formatPrice } from "@/lib/products";
import CoinIcon from "./CoinIcon";

const POLL_MS = 12_000;

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return { copied, copy };
}

export default function PaymentPanel({
  signed,
  onPaid,
  onCancel,
}: {
  signed: SignedQuote;
  onPaid: (r: VerifyResult) => void;
  onCancel: () => void;
}) {
  const q = signed.quote;
  const coin = getCoin(q.coin)!;
  const [qr, setQr] = useState<string>("");
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<VerifyResult>({ status: "waiting", checkedAt: 0 });
  const [checking, setChecking] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { copied, copy } = useCopy();
  const paidRef = useRef(false);

  useEffect(() => {
    QRCode.toDataURL(q.address, { margin: 1, width: 360, color: { dark: "#0a0a0c", light: "#ffffff" } }).then(setQr).catch(() => setQr(""));
  }, [q.address]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const check = useCallback(
    async (hash?: string) => {
      if (paidRef.current) return;
      setChecking(true);
      try {
        const res = await fetch("/api/checkout/verify/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token: signed.token, txHash: hash }),
        });
        const data = (await res.json()) as VerifyResult & { error?: string };
        if (!res.ok) {
          if (hash) setTxError(data.error || "Could not check that transaction.");
          return;
        }
        if (hash && data.status === "waiting") setTxError("We couldn't find a matching payment to our wallet in that transaction yet. It may still be confirming — we'll keep checking.");
        setResult(data);
        if (data.status === "paid") {
          paidRef.current = true;
          onPaid(data);
        }
      } catch {
        /* network blip — next poll retries */
      } finally {
        setChecking(false);
      }
    },
    [signed.token, onPaid]
  );

  useEffect(() => {
    check();
    const t = setInterval(() => check(), POLL_MS);
    return () => clearInterval(t);
  }, [check]);

  const left = Math.max(0, q.expiresAt - now);
  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const expired = left === 0;
  const pctLeft = Math.max(0, Math.min(100, (left / (q.expiresAt - q.createdAt)) * 100));
  const isStable = coin.symbol === "USDT";

  const stage = result.status === "paid" ? 3 : result.status === "pending" ? 2 : 1;
  const stages = ["Awaiting payment", "Payment detected", "Confirmed"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CoinIcon coin={coin} size={44} />
          <div>
            <p className="font-display text-lg font-bold text-white">Pay with {coin.symbol}</p>
            <p className="text-[12px] text-white/45">{coin.network} · Order {q.id}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold tabular-nums"
          style={
            expired
              ? { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
              : { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#fdba74" }
          }
        >
          <Timer className="h-4 w-4" />
          {expired ? "Quote expired" : `${mm}:${ss}`}
        </div>
      </div>
      {!expired && (
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${pctLeft}%`, background: "linear-gradient(90deg,#ea580c,#fdba74)" }} />
        </div>
      )}

      {/* Status tracker */}
      <div className="grid grid-cols-3 gap-2">
        {stages.map((s, i) => {
          const n = i + 1;
          const done = n < stage || result.status === "paid";
          const on = n === stage && result.status !== "paid";
          return (
            <div
              key={s}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold"
              style={
                done
                  ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }
                  : on
                    ? { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.4)", color: "#fdba74" }
                    : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }
              }
            >
              {done ? <Check className="h-3.5 w-3.5 shrink-0" /> : on ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" /> : <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-current" />}
              <span className="truncate">{s}</span>
            </div>
          );
        })}
      </div>

      {/* Underpaid */}
      {result.status === "underpaid" && (
        <div className="flex gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/[0.07] p-4 text-[13px] text-yellow-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            We received <b>{result.received} {coin.symbol}</b> but this order needs <b>{q.amount} {coin.symbol}</b>. Please send the remaining
            amount to the same address, or contact support with your order ID.
          </p>
        </div>
      )}

      {/* Amount + address + QR */}
      <div className="grid gap-5 md:grid-cols-[1fr_200px]">
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-white/35">Send exactly</p>
            <button
              type="button"
              onClick={() => copy(q.amount, "amount")}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] px-4 py-3.5 text-left transition hover:border-accent/60"
            >
              <span className="min-w-0">
                <span className="font-display block break-all text-[26px] font-black leading-tight tabular-nums text-white">
                  {q.amount} <span className="text-accent-soft">{coin.symbol}</span>
                </span>
                <span className="text-[12px] text-white/40">
                  ≈ {formatPrice(q.usdTotal)} USD{!isStable && ` · 1 ${coin.symbol} = ${formatPrice(Math.round(q.rate))}`}
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 group-hover:text-white">
                {copied === "amount" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </span>
            </button>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-white/35">To this {coin.networkShort} address</p>
            <button
              type="button"
              onClick={() => copy(q.address, "address")}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-black/30 px-4 py-3.5 text-left transition hover:border-white/25"
            >
              <span className="break-all font-mono text-[13px] leading-relaxed text-white/90">{q.address}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 group-hover:text-white">
                {copied === "address" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </span>
            </button>
          </div>

          <div className="flex gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-3.5 text-[12px] leading-relaxed text-red-200/90">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p>
              {coin.warning} {isStable ? "Send the exact amount so we can match your payment automatically." : "Send the exact amount before the timer ends — the rate is locked for this quote."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative rounded-2xl bg-white p-2.5" style={{ boxShadow: `0 20px 50px -20px ${coin.color}` }}>
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt={`QR code for ${coin.symbol} address`} className="h-[180px] w-[180px]" />
            ) : (
              <div className="h-[180px] w-[180px] animate-pulse rounded-lg bg-black/10" />
            )}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1">
              <CoinIcon coin={coin} size={30} />
            </span>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/35">Scan with your wallet app</p>
        </div>
      </div>

      {/* Live status line */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2.5 text-[12px] text-white/55">
          {result.status === "pending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              Payment detected — waiting for network confirmation{result.confirmations ? ` (${result.confirmations})` : ""}…
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              Watching the blockchain for your payment · checks every {POLL_MS / 1000}s
            </>
          )}
        </div>
        <button type="button" onClick={() => check()} disabled={checking} className="flex items-center gap-1.5 text-[12px] font-semibold text-accent-bright disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} /> Check now
        </button>
      </div>
      {result.txHash && result.status !== "paid" && (
        <a href={coin.explorerTx(result.txHash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] text-white/45 hover:text-white">
          <ExternalLink className="h-3.5 w-3.5" /> View transaction on explorer
        </a>
      )}

      {/* Expired */}
      {expired && result.status === "waiting" && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-[13px] text-white/60">
          This quote has expired. <b className="text-white/80">If you already sent the payment, keep this page open</b> — it will still be detected.
          Otherwise, start a new payment to get a fresh {isStable ? "amount" : "rate"}.
          <button type="button" onClick={onCancel} className="btn-outline mt-3 w-full">Start a new payment</button>
        </div>
      )}

      {/* Manual TX hash */}
      <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-white/75 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2"><Search className="h-4 w-4 text-accent" /> Already paid? Verify with your transaction ID</span>
          <span className="text-white/30 transition group-open:rotate-45">+</span>
        </summary>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setTxError("");
            if (txHash.trim()) check(txHash.trim());
          }}
        >
          <input value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="Paste TX hash / ID" className="input flex-1 font-mono !text-[12px]" />
          <button type="submit" disabled={checking || !txHash.trim()} className="btn-primary shrink-0">
            <span>Verify</span>
          </button>
        </form>
        {txError && <p className="mt-2 text-[12px] text-yellow-300/90">{txError}</p>}
      </details>

      {/* Trust + cancel */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <p className="flex items-center gap-2 text-[11px] text-white/35">
          <ShieldCheck className="h-4 w-4 text-green-400" /> Pay directly to our own wallet · verified on-chain
        </p>
        {confirmCancel ? (
          <span className="flex items-center gap-2 text-[12px]">
            <span className="text-white/50">Cancel this payment?</span>
            <button type="button" onClick={onCancel} className="font-semibold text-red-400 hover:underline">Yes, cancel</button>
            <button type="button" onClick={() => setConfirmCancel(false)} className="text-white/50 hover:text-white"><X className="h-3.5 w-3.5" /></button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmCancel(true)} className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white">
            <Wallet className="h-3.5 w-3.5" /> Change payment method
          </button>
        )}
      </div>
    </div>
  );
}
