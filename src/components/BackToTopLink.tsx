"use client";

import type { ReactNode } from "react";

/** Text link that smooth-scrolls to the top of the page (used in the footer). */
export default function BackToTopLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={className}>
      {children}
    </button>
  );
}
