"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export default function FaqAccordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b" style={{ borderColor: "rgba(249,115,22,0.12)" }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span
                className="font-display text-base font-semibold transition-colors duration-200 md:text-[17px]"
                style={{ color: isOpen ? "#fdba74" : "rgba(255,255,255,0.88)" }}
              >
                {f.q}
              </span>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                  border: isOpen ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Plus className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-45 text-accent-bright" : "text-white/50"}`} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-12 text-[14px] leading-relaxed text-white/50">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
