"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll motion:
 * - glowing progress bar at the top
 * - parallax for any element with data-parallax="<speed>" (e.g. 0.15 moves slower, -0.1 moves against the scroll)
 * - back-to-top button
 */
export default function ScrollEffects() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let items: HTMLElement[] = [];
    let frame = 0;

    const collect = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setShowTop(y > 700);
      if (reduce) return;
      const vh = window.innerHeight;
      for (const el of items) {
        const speed = parseFloat(el.dataset.parallax || "0.15");
        const r = el.getBoundingClientRect();
        // offset relative to the viewport centre, so elements sit in place when centred
        const center = r.top + r.height / 2 - parseFloat(el.dataset.py || "0");
        const shift = (center - vh / 2) * -speed;
        el.dataset.py = String(shift);
        el.style.translate = `0 ${shift.toFixed(1)}px`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    collect();
    update();
    // pick up elements rendered after navigation / lazy content
    const mo = new MutationObserver(() => {
      collect();
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <>
      <div ref={bar} className="scroll-progress" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        // sits above the chat button (components/ChatWidget.tsx) in the bottom-right corner
        className={`fixed bottom-[92px] right-[26px] z-40 flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-[#131216]/90 text-accent-bright backdrop-blur-xl transition-all duration-500 hover:text-white ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        style={{ boxShadow: "0 10px 26px -10px rgba(234,88,12,0.8)" }}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
