"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, label, select, input[type='checkbox'], input[type='radio']";
const TEXT = "input:not([type='checkbox']):not([type='radio']), textarea";

/**
 * Custom cursor (replaces the system pointer): a glowing dot (turns into a spinning spark over
 * links/buttons) and an orange ring (grows on links/buttons, becomes a caret over text
 * fields), a soft orange spotlight that follows the mouse and a burst on click.
 * Mouse/trackpad only — disabled on touch screens and for "reduce motion" users.
 */
export default function CursorEffects() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...mouse };
    const glowPos = { ...mouse };
    let raf = 0;

    const tick = () => {
      // The ring wraps the normal system pointer, so it stays tight around it (with a smooth glide)
      ringPos.x += (mouse.x - ringPos.x) * 0.45;
      ringPos.y += (mouse.y - ringPos.y) * 0.45;
      glowPos.x += (mouse.x - glowPos.x) * 0.07;
      glowPos.y += (mouse.y - glowPos.y) * 0.07;
      if (dot.current) dot.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      if (glow.current) glow.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      wrap.current?.classList.add("cursor-visible");

      const target = e.target as Element | null;
      const overText = Boolean(target?.closest(TEXT));
      const overLink = !overText && Boolean(target?.closest(INTERACTIVE));
      ring.current?.classList.toggle("is-text", overText);
      ring.current?.classList.toggle("is-hover", overLink);
      dot.current?.classList.toggle("is-text", overText);
      dot.current?.classList.toggle("is-hover", overLink);

    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ring.current?.classList.add("is-down");
      dot.current?.classList.add("is-down");
      const b = document.createElement("span");
      b.className = "cursor-burst";
      b.style.left = `${e.clientX}px`;
      b.style.top = `${e.clientY}px`;
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 650);
    };
    const onUp = () => {
      ring.current?.classList.remove("is-down");
      dot.current?.classList.remove("is-down");
    };
    const onLeave = () => {
      wrap.current?.classList.remove("cursor-visible");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true">
      <div ref={glow} className="cursor-glow" />
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot">
        <span className="cd-core" />
        <span className="cd-spark">
          {/* 4-point spark with a bright centre */}
          <svg viewBox="0 0 24 24">
            <defs>
              <linearGradient id="cd-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fdba74" />
                <stop offset="1" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="url(#cd-grad)" />
            <circle cx="12" cy="12" r="2" fill="#fff7ed" />
          </svg>
        </span>
      </div>
    </div>
  );
}
