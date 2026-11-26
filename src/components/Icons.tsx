import { BadgeCheck, Headphones, Lock, Users, Wallet, Zap, type LucideIcon } from "lucide-react";

type SvgProps = { className?: string };

export function TelegramIcon({ className = "w-4 h-4" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.3a1.2 1.2 0 0 0-1.27-.2L2.86 11.1c-.93.37-.9 1.7.05 2.03l4.5 1.53 1.7 5.36c.24.76 1.2.98 1.75.4l2.55-2.62 4.6 3.4c.72.53 1.75.13 1.93-.75l3.38-15.9a1.2 1.2 0 0 0-.38-1.24ZM17.5 7.6l-7.94 7.2a.6.6 0 0 0-.19.37l-.3 2.6-1.15-3.62 9.06-5.8c.36-.23.74.25.52.55v-.3Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.9.9-3-.2-.31a8.2 8.2 0 1 1 6.87 3.74Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 .99 2.5 10.8 10.8 0 0 0 4.14 3.66c1.54.66 2.14.72 2.91.6.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

export const featureIcons: Record<string, LucideIcon> = {
  headphones: Headphones,
  zap: Zap,
  lock: Lock,
  badge: BadgeCheck,
  wallet: Wallet,
  users: Users,
};

/** Provider logo tile: the official logo image when available, otherwise a coloured monogram. */
export function ProviderTile({
  mono,
  color,
  size = "md",
  logo,
  alt = "",
}: {
  mono: string;
  color: string;
  size?: "sm" | "md" | "lg";
  logo?: string;
  alt?: string;
}) {
  const dims =
    size === "sm" ? "w-8 h-8 rounded-lg text-[9px]" : size === "lg" ? "w-14 h-14 rounded-2xl text-[13px]" : "w-12 h-12 rounded-2xl text-[11px]";
  if (logo) {
    return (
      <div
        className={`${dims} relative shrink-0 overflow-hidden`}
        style={{ border: `1px solid ${color}40`, boxShadow: `0 6px 18px -8px ${color}90` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={alt} loading="lazy" className="h-full w-full scale-[1.18] object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${dims} font-display flex shrink-0 items-center justify-center font-bold tracking-tight`}
      style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}
    >
      {mono}
    </div>
  );
}
