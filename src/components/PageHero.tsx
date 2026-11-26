import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

export default function PageHero({
  title,
  highlight,
  text,
  crumbs,
  badge,
}: {
  title: string;
  highlight?: string;
  text?: string;
  crumbs: Array<{ label: string; href?: string }>;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-10 pt-36 lg:pt-40">
      <div
        data-parallax="0.3"
        className="pointer-events-none absolute"
        style={{ top: "-20%", left: "10%", width: 640, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)", filter: "blur(80px)" }}
      />
      <div className="container-xl relative">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-white/35">
            <Link href="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white/60">{c.label}</span>}
              </span>
            ))}
          </nav>
          {badge && <div className="badge mb-4 w-fit">{badge}</div>}
          <h1 className="heading mb-3 text-[clamp(32px,4vw,50px)] font-black">
            {title} {highlight && <span className="text-gradient">{highlight}</span>}
          </h1>
          {text && <p className="max-w-xl text-[15px] leading-relaxed text-white/45">{text}</p>}
        </Reveal>
      </div>
    </section>
  );
}
