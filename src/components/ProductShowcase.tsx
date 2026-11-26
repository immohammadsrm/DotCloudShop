"use client";

import { useRef, useState } from "react";
import { BadgeCheck, CheckCircle2, Wifi } from "lucide-react";
import type { Product } from "@/lib/products";

/**
 * Hero visual for the product page: official provider logo (or the virtual card),
 * spinning brand-coloured border, orbit rings, floating feature chips and a 3D tilt + glare on hover.
 */
export default function ProductShowcase({ product: p }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 30, active: false });
  const isVcc = p.category === "vcc";
  const color = p.color;

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - y) * 10, ry: (x - 0.5) * 12, gx: x * 100, gy: y * 100, active: true });
  };

  const chips = isVcc ? ["Number · Expiry · CVV", "Reloadable", "No KYC"] : p.bullets.slice(0, 3);
  const chipPos = [
    "left-4 top-[22%] md:left-6",
    "right-4 top-[38%] md:right-6",
    "left-6 bottom-[16%] md:left-10",
  ];

  return (
    <div style={{ perspective: 1200 }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 30, active: false })}
        className="spin-border rounded-[28px] p-px"
        style={
          {
            "--glow": color,
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: tilt.active ? "transform 80ms linear" : "transform 600ms cubic-bezier(0.22,1,0.36,1)",
            transformStyle: "preserve-3d",
            boxShadow: `0 40px 100px -40px ${color}80`,
          } as React.CSSProperties
        }
      >
        <div className="relative aspect-[5/4] overflow-hidden rounded-[27px] bg-[#0d0c10]">
          {/* Brand glow + dotted grid */}
          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 45%, ${color}38 0%, transparent 58%)` }} />
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            }}
          />

          {/* Orbit rings */}
          <div className="animate-orbit pointer-events-none absolute left-1/2 top-[46%] w-[78%] rounded-full border border-white/[0.06]" style={{ aspectRatio: "1" }}>
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />
          </div>
          <div className="animate-orbit-rev pointer-events-none absolute left-1/2 top-[46%] w-[56%] rounded-full border border-dashed" style={{ aspectRatio: "1", borderColor: `${color}40` }}>
            <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/80" />
          </div>
          <div className="animate-pulse-ring pointer-events-none absolute left-1/2 top-[46%] w-[40%] rounded-full border-2" style={{ aspectRatio: "1", borderColor: `${color}70` }} />

          {/* Centerpiece */}
          <div className="absolute left-1/2 top-[46%]" style={{ transform: "translate(-50%,-50%) translateZ(60px)" }}>
            <div className="animate-bob">
              {isVcc ? (
                <div
                  className="shine relative h-[150px] w-[240px] overflow-hidden rounded-2xl p-5 md:h-[180px] md:w-[290px]"
                  style={{
                    background: "linear-gradient(135deg,#fb923c 0%,#ea580c 45%,#7c2d12 100%)",
                    boxShadow: "0 40px 90px -25px rgba(234,88,12,0.8), inset 0 1px 0 rgba(255,255,255,0.3)",
                    transform: "rotate(-6deg)",
                  }}
                >
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                  <div className="relative flex items-center justify-between">
                    <span className="font-display text-[14px] font-bold text-white">
                      DotCloud<span className="text-white/70">Shop</span>
                    </span>
                    <Wifi className="h-4 w-4 rotate-90 text-white/80" />
                  </div>
                  <p className="font-display relative mt-3 text-[38px] font-black leading-none text-white md:text-[46px]">{p.headline}</p>
                  <p className="relative mt-2 font-mono text-[12px] tracking-[0.18em] text-white/85 md:text-[13px]">4821 •••• •••• 1093</p>
                  <div className="relative mt-1.5 flex justify-between text-[9px] uppercase tracking-wider text-white/70">
                    <span>Exp 12/28</span>
                    <span>Virtual · Reloadable</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="shine relative h-[130px] w-[130px] overflow-hidden rounded-[30px] md:h-[168px] md:w-[168px] md:rounded-[38px]"
                    style={{ boxShadow: `0 30px 80px -18px ${color}, 0 0 0 1px ${color}50, inset 0 1px 0 rgba(255,255,255,0.2)` }}
                  >
                    {p.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.logo} alt={`${p.provider} official logo`} className="h-full w-full scale-[1.18] object-cover" />
                    )}
                  </div>
                  {/* Reflection */}
                  <div className="absolute -bottom-10 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[50%] blur-xl" style={{ background: `${color}70` }} />
                </div>
              )}
            </div>
          </div>

          {/* Floating chips */}
          {chips.map((c, i) => (
            <div
              key={c}
              className={`animate-bob absolute hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white/85 sm:flex ${chipPos[i]}`}
              style={{
                animationDelay: `${i * 0.9}s`,
                background: "rgba(19,18,22,0.75)",
                border: `1px solid ${color}35`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8)",
                transform: "translateZ(40px)",
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color }} />
              {c}
            </div>
          ))}

          {/* Top labels */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur md:left-5 md:top-5">
            <BadgeCheck className="h-3.5 w-3.5" style={{ color }} />
            {isVcc ? "Virtual Credit Card" : `Official ${p.provider}`}
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-green-400/25 bg-green-400/10 px-2.5 py-1 text-[10px] font-semibold text-green-400 md:right-5 md:top-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> In stock
          </div>

          {/* Bottom strip */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 border-t border-white/[0.06] bg-black/30 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-white/40 backdrop-blur">
            <span>Verified</span>
            <span className="h-1 w-1 rounded-full" style={{ background: color }} />
            <span>{isVcc ? "No KYC" : "Login warranty"}</span>
            <span className="h-1 w-1 rounded-full" style={{ background: color }} />
            <span>Fast delivery</span>
          </div>

          {/* Mouse glare */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.12), transparent 45%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
