"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal that works in both directions: content animates in when it enters the
 * viewport and resets when it leaves, so it slides up when you scroll down and slides
 * down when you scroll back up.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        } else {
          // Remember which side it left from, so it re-enters from that side.
          el.dataset.from = entry.boundingClientRect.top < 0 ? "above" : "below";
          el.classList.remove("is-visible");
        }
      },
      { threshold: 0, rootMargin: "-6% 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-from="below" className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
