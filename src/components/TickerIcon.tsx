import { CreditCard, Headset, RefreshCw, UserX, Zap } from "lucide-react";
import type { TickerItem } from "@/lib/content";

const tile = "relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg";

function BitcoinLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path fill="#F7931A" d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" />
      <path fill="#fff" d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.019 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726l-1.434 5.745 3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.384-4.739 1.527-4.36-.076-6.875-3.226-8.515 2.294-.529 4.022-2.038 4.483-5.155zM38.087 38.69c-1.086 4.36-8.426 2.003-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" />
    </svg>
  );
}

function TetherLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path fill="#fff" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" />
    </svg>
  );
}

const ICONS = { card: CreditCard, kyc: UserX, fast: Zap, support: Headset, reload: RefreshCw } as const;

/** Icon shown before each homepage ticker item: official logo for brands, themed icon otherwise. */
export default function TickerIcon({ item, color = "#f97316" }: { item: TickerItem; color?: string }) {
  if (item.logo) {
    return (
      <span className={tile} style={{ border: `1px solid ${color}45`, boxShadow: `0 4px 14px -6px ${color}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.logo} alt="" loading="lazy" className="h-full w-full scale-[1.18] object-cover" />
      </span>
    );
  }
  if (item.icon === "crypto") {
    return (
      <span className="flex shrink-0 items-center">
        <BitcoinLogo className="h-7 w-7 drop-shadow-[0_2px_8px_rgba(247,147,26,0.45)]" />
        <TetherLogo className="-ml-2 h-7 w-7 rounded-full ring-2 ring-ink drop-shadow-[0_2px_8px_rgba(38,161,123,0.45)]" />
      </span>
    );
  }
  const Icon = ICONS[item.icon ?? "card"];
  return (
    <span
      className={tile}
      style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.22), rgba(234,88,12,0.08))", border: "1px solid rgba(249,115,22,0.35)" }}
    >
      <Icon className="h-4 w-4 text-accent-bright" />
    </span>
  );
}
