"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

const tabs: Array<{ key: string; label: string; category?: Category }> = [
  { key: "all", label: "All" },
  { key: "vcc", label: "Virtual Cards", category: "vcc" },
  { key: "cloud", label: "Cloud Accounts", category: "cloud" },
];

/** Shop grid with All / Virtual Cards / Cloud Accounts tabs. /shop/#cloud opens the cloud tab. */
export default function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (tabs.some((t) => t.key === h)) setActive(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const shown = useMemo(
    () => products.filter((p) => !tab.category || p.category === tab.category),
    [products, tab]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const on = t.key === active;
          const n = products.filter((p) => !t.category || p.category === t.category).length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-200"
              style={
                on
                  ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }
              }
            >
              {t.label}
              <span className="ml-1 text-[9px] opacity-50">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-[11px] text-white/25">
        Showing {shown.length} of {products.length} products
      </p>
    </div>
  );
}
