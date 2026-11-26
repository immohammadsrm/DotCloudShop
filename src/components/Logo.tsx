import Link from "next/link";
import { Cloud } from "lucide-react";

export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="DotCloudShop home">
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${small ? "h-8 w-8" : "h-9 w-9"}`}
        style={{ background: "linear-gradient(135deg, #fb923c, #ea580c)" }}
      >
        <div className="absolute inset-0 rounded-xl bg-white/10" />
        <Cloud className="relative h-4 w-4 text-white" />
        <span className="absolute bottom-[7px] right-[7px] h-1.5 w-1.5 rounded-full bg-white" />
      </div>
      <span className={`font-display font-bold tracking-tight ${small ? "text-[15px]" : "text-[17px]"}`}>
        DotCloud<span className="text-accent-bright">Shop</span>
      </span>
    </Link>
  );
}
