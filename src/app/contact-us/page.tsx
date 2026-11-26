import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { TelegramIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a card, an account, or a custom order? Reach DotCloudShop on Telegram, WhatsApp or email.",
  alternates: { canonical: "/contact-us/" },
};

export default function ContactPage() {
  const cards = [
    { title: "Telegram", text: "We're online to assist you anytime you need us.", href: site.contact.telegram, cta: "Tap Here For Telegram", color: "#f97316", icon: <TelegramIcon className="h-5 w-5" /> },
    { title: "WhatsApp", text: "Chat with us on WhatsApp for quick help with your order.", href: site.contact.whatsapp, cta: "Tap Here For WhatsApp", color: "#25D366", icon: <WhatsAppIcon className="h-5 w-5" /> },
    { title: "Email Us", text: "Thanks for reaching out! We'll get back to you within 24 hours.", href: `mailto:${site.contact.email}`, cta: site.contact.email, color: "#fdba74", icon: <Mail className="h-5 w-5" /> },
  ];
  const details = [
    { icon: Phone, label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
    { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: MapPin, label: "Address", value: site.contact.address },
    { icon: Clock, label: "Hours", value: site.contact.hours },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact Us" }]}
        badge="We're online"
        title="Contact"
        highlight="Us"
        text="Questions about a card, an account, or a custom order? Reach us on the channel you prefer."
      />
      <section className="pb-20">
        <div className="container-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-card p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${c.color}80, transparent)` }} />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${c.color}14`, border: `1px solid ${c.color}30`, color: c.color }}>
                    {c.icon}
                  </div>
                  <h2 className="font-display mb-2 text-lg font-bold text-white">{c.title}</h2>
                  <p className="mb-6 flex-1 text-[13px] leading-relaxed text-white/45">{c.text}</p>
                  <span className="inline-flex items-center gap-1.5 break-all text-[12px] font-semibold transition-all group-hover:gap-2.5" style={{ color: c.color }}>
                    {c.cta} <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-8 grid gap-6 rounded-3xl border border-white/[0.06] bg-ink-card p-6 sm:grid-cols-2 lg:grid-cols-4">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                    <d.icon className="h-4 w-4 text-accent-bright" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-white/30">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="break-all text-[13px] text-white/75 hover:text-white">{d.value}</a>
                    ) : (
                      <p className="text-[13px] text-white/75">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
