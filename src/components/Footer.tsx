import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { TelegramIcon, WhatsAppIcon } from "./Icons";
import BackToTopLink from "./BackToTopLink";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import Reveal from "./Reveal";

const h4 = "mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30";
// Laser underline on hover, same as the header menu (.foot-laser in globals.css)
const a = "foot-laser text-[12px] text-white/45";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[180px] w-[500px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)", filter: "blur(50px)" }}
      />
      <div className="top-line" />

      <div className="border-b border-white/[0.04]" style={{ background: "rgba(249,115,22,0.03)" }}>
        <div className="container-xl py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="font-display mb-1 text-lg font-bold text-white">Stay Update</h3>
              <p className="text-[12px] text-white/35">For news letters and discount updates, add your email.</p>
            </div>
            <Newsletter />
          </div>
        </div>
      </div>

      <div className="container-xl pt-12">
        <Reveal>
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-[260px_1fr_1fr_1.4fr]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-4"><Logo small /></div>
            <p className="mb-5 max-w-[240px] text-[12px] leading-relaxed text-white/35">{site.description}</p>
            <div className="mb-4 flex gap-2">
              {[
                { href: site.contact.telegram, label: "Telegram", icon: <TelegramIcon className="h-3.5 w-3.5" /> },
                { href: site.contact.whatsapp, label: "WhatsApp", icon: <WhatsAppIcon className="h-3.5 w-3.5" /> },
                { href: `mailto:${site.contact.email}`, label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
                { href: site.contact.phoneHref, label: "Phone", icon: <Phone className="h-3.5 w-3.5" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-white/40 transition hover:border-accent/40 hover:text-accent-bright"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["BTC", "USDT", "+ more crypto"].map((c) => (
                <span key={c} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold text-white/50">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className={h4}>Featured</h4>
            <ul className="space-y-2">
              <li><Link href="/buy-aws-account/" className={a}>AWS Account</Link></li>
              <li><Link href="/buy-azure-account/" className={a}>Azure Account</Link></li>
              <li><Link href="/buy-google-cloud-account/" className={a}>Google Cloud</Link></li>
              <li><Link href="/buy-hetzner-account/" className={a}>Hetzner Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={h4}>Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className={a}>Home</Link></li>
              <li><Link href="/shop/#cloud" className={a}>Cloud Accounts</Link></li>
              <li><Link href="/#pricing" className={a}>Virtual Cards</Link></li>
              <li><Link href="/refund_returns/" className={a}>Refund Policy</Link></li>
              <li><Link href="/contact-us/" className={a}>Contact us</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className={h4}>Contact</h4>
            <ul className="space-y-3 text-[12px] text-white/45">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /><a href={site.contact.phoneHref} className="foot-laser">{site.contact.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /><a href={`mailto:${site.contact.email}`} className="foot-laser break-all">{site.contact.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />{site.contact.address}</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        </Reveal>
      </div>

      {/* Planet horizon: giant faded brand name sinking behind a glowing curved horizon */}
      {/* Hover (.horizon in globals.css): the name rises and lights up orange, the sky and horizon rim glow brighter */}
      <div className="horizon relative overflow-hidden pt-[200px] sm:pt-[235px]">
        {/* warm sky glow rising from behind the planet */}
        <div
          className="horizon-sky pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(55% 75% at 50% 100%, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.05) 45%, transparent 75%)" }}
        />
        <div
          aria-hidden="true"
          className="font-display pointer-events-none absolute inset-x-0 top-[150px] select-none whitespace-nowrap text-center font-bold leading-none tracking-[-0.04em] sm:top-[185px]"
          style={{ fontSize: "clamp(48px, 9.5vw, 156px)", transform: "translateY(-76%)" }}
        >
          <span className="horizon-name relative inline-block">
            <span className="horizon-name-base">{site.name}</span>
            <span className="horizon-name-lit absolute inset-0">{site.name}</span>
          </span>
        </div>
        {/* the planet: a huge ellipse whose top edge forms the curved horizon */}
        <div
          aria-hidden="true"
          className="horizon-planet pointer-events-none absolute left-1/2 top-[150px] h-[1440px] w-[250%] -translate-x-1/2 rounded-[50%] sm:top-[185px]"
          style={{
            background: "linear-gradient(180deg, #3d2414 0%, #2a1a10 9%, #19130f 22%, #0f0d0f 40%)",
            boxShadow:
              "inset 0 1.5px 0 rgba(255,200,160,0.85), inset 0 40px 70px -40px rgba(249,115,22,0.45), 0 -1px 0 rgba(253,186,116,0.35), 0 -4px 22px rgba(251,146,60,0.35), 0 -30px 90px -20px rgba(249,115,22,0.4)",
          }}
        />
        <div className="container-xl relative z-10 flex flex-col items-center justify-between gap-3 pb-8 pt-2 text-center text-[11.5px] text-white/50 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="text-white/45">Independent seller. Not affiliated with cloud providers.</p>
          <div className="flex items-center gap-4">
            <Link href="/refund_returns/" className="foot-laser text-white/45">Terms</Link>
            <Link href="/refund_returns/" className="foot-laser text-white/45">Privacy</Link>
            <BackToTopLink className="foot-laser text-white/60">Back to top ↑</BackToTopLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
