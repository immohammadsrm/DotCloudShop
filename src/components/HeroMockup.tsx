"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Cpu, Database, Server, Sparkles, Wifi } from "lucide-react";

/** Illustrative delivery feed shown in the hero. */
const feed = [
  { mono: "VCC", color: "#f97316", title: "$100 Loaded Card", sub: "Card · Number, Expiry, CVV", price: "$138" },
  { mono: "AWS", color: "#FF9900", title: "AWS Account", sub: "Cloud · Bedrock & Kiro enabled", price: "$25" },
  { mono: "VCC", color: "#f97316", title: "$500 Loaded Card", sub: "Card · High balance", price: "$598" },
  { mono: "GCP", color: "#4285F4", title: "Google Cloud", sub: "Cloud · $300 free trial", price: "$65" },
  { mono: "DO", color: "#22D3EE", title: "DigitalOcean", sub: "Cloud · 10 droplets", price: "$20" },
  { mono: "Az", color: "#0078D4", title: "Azure Account", sub: "Cloud · Pay-as-you-go", price: "$30" },
];

export default function HeroMockup() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % feed.length), 2600);
    return () => clearInterval(t);
  }, []);

  const visible = [0, 1, 2].map((k) => feed[(i + k) % feed.length]);

  return (
    <div className="relative h-[480px] w-[460px] select-none">
      {/* Orbit rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      <div className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/15">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_#f97316]" />
      </div>

      {/* Cloud console (back layer) */}
      <div
        data-parallax="0.08"
        className="absolute right-0 top-6 z-10 w-[300px] overflow-hidden rounded-2xl"
        style={{ background: "#111014", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.025] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
          <span className="font-mono text-[9px] text-white/30">cloud-console · us-east-1</span>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-display flex h-8 w-8 items-center justify-center rounded-lg text-[9px] font-bold" style={{ background: "#FF990014", border: "1px solid #FF990030", color: "#FF9900" }}>
                AWS
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white">Account ready</p>
                <p className="text-[9px] text-white/35">Verified · Login warranty</p>
              </div>
            </div>
            <span className="rounded-full border border-green-400/25 bg-green-400/10 px-2 py-0.5 text-[9px] font-semibold text-green-400">Active</span>
          </div>
          <div className="mb-1 flex justify-between text-[9px] text-white/30">
            <span>vCPU limit</span>
            <span className="tabular-nums">32 / 32</span>
          </div>
          <div className="mb-4 h-[3px] rounded-full bg-white/[0.06]">
            <div className="animate-progress h-full rounded-full" style={{ background: "linear-gradient(90deg,#ea580c,#fdba74)" }} />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { icon: Server, l: "EC2" },
              { icon: Database, l: "S3" },
              { icon: Cpu, l: "Bedrock" },
            ].map(({ icon: Icon, l }) => (
              <div key={l} className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.05] bg-white/[0.02] py-2">
                <Icon className="h-3.5 w-3.5 text-accent-soft" />
                <span className="text-[9px] text-white/45">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="top-line" />
      </div>

      {/* Virtual card (front layer) */}
      <div
        data-parallax="-0.14"
        className="animate-float absolute left-0 top-[150px] z-20 h-[165px] w-[262px] overflow-hidden rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg,#fb923c 0%,#ea580c 45%,#7c2d12 100%)",
          boxShadow: "0 30px 80px -20px rgba(234,88,12,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-6 h-40 w-40 rounded-full bg-black/10" />
        <div className="relative flex items-center justify-between">
          <span className="font-display text-[15px] font-bold text-white">
            DotCloud<span className="text-white/70">Shop</span>
          </span>
          <Wifi className="h-4 w-4 rotate-90 text-white/80" />
        </div>
        <div className="relative mt-4 h-7 w-10 rounded-md" style={{ background: "linear-gradient(135deg,#fde68a,#d97706)" }} />
        <p className="relative mt-3 font-mono text-[15px] tracking-[0.18em] text-white">4821 •••• •••• 1093</p>
        <div className="relative mt-2 flex justify-between text-[9px] uppercase tracking-wider text-white/70">
          <span>Exp 12/28</span>
          <span>Reloadable</span>
        </div>
      </div>

      {/* Live delivery feed */}
      <div
        data-parallax="0.2"
        className="absolute bottom-0 right-4 z-30 w-[280px] overflow-hidden rounded-2xl"
        style={{ background: "rgba(17,16,20,0.92)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 60px rgba(0,0,0,0.65)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/35">Live deliveries</span>
          </div>
          <Sparkles className="h-3 w-3 text-accent/60" />
        </div>
        <ul className="p-2">
          {visible.map((f, k) => (
            <li
              key={`${i}-${k}`}
              className="feed-in flex items-center gap-2.5 rounded-lg px-2 py-1.5"
              style={{ animationDelay: `${k * 70}ms`, opacity: k === 0 ? 1 : k === 1 ? 0.7 : 0.4 }}
            >
              <div className="font-display flex h-7 w-8 shrink-0 items-center justify-center rounded-md text-[8px] font-bold" style={{ background: `${f.color}14`, border: `1px solid ${f.color}30`, color: f.color }}>
                {f.mono}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white">{f.title}</p>
                <p className="truncate text-[9px] text-white/35">{f.sub}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold tabular-nums text-white/80">{f.price}</span>
                {k === 0 && <CheckCircle2 className="h-3 w-3 text-green-400" />}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivered toast */}
      <div
        className="absolute -top-3 left-6 z-30 flex items-center gap-2 rounded-xl px-3 py-2"
        style={{ background: "#19171c", border: "1px solid rgba(74,222,128,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
      >
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-400/15">
          <CheckCircle2 className="h-3 w-3 text-green-400" />
        </div>
        <div>
          <p className="text-[11px] font-semibold leading-none text-white">Delivered in &lt; 5 min</p>
          <p className="mt-0.5 text-[9px] text-white/30">Cards & cloud accounts</p>
        </div>
      </div>
    </div>
  );
}
