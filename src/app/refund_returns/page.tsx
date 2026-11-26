import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CreditCard, Server } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Refund and Returns Policy",
  description: "Refund and returns policy for DotCloudShop cloud accounts and virtual cards.",
  alternates: { canonical: "/refund_returns/" },
};

const blocks = [
  {
    icon: Server,
    title: "Cloud Accounts",
    items: [
      "Cloud accounts come with a login warranty only.",
      "You must log in within 30 minutes of delivery.",
      "Any login issue must be reported within the warranty period.",
      "After a successful login, we are not responsible for later suspensions or other problems.",
      "If we miss the delivery time, you receive a full refund within 24 hours.",
    ],
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    items: [
      "If a card fails on the buyer's side, the creation fee and 10% of the loaded funds are deducted, so you receive 90% of the main balance.",
      "Refunds are issued only after verification.",
      "Restrictions set by merchants are not our responsibility.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Important Notice",
    items: [
      "Making a purchase means you agree to these terms.",
      "Disputes raised after purchase are not accepted.",
      "Refunds can be refused for terms violations or misleading information.",
    ],
  },
];

export default function RefundPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Refund Policy" }]}
        title="Refund and Returns"
        highlight="Policy"
        text="This policy covers both cloud accounts and virtual cards purchased from DotCloudShop."
      />
      <section className="pb-20">
        <div className="container-xl max-w-4xl">
          <div className="space-y-4">
            {blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 80}>
                <div className="rounded-3xl border border-white/[0.06] bg-ink-card p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                      <b.icon className="h-4 w-4 text-accent-bright" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">{b.title}</h2>
                  </div>
                  <ul className="space-y-2.5">
                    {b.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-white/55">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl p-6 sm:flex-row" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.12), #131216 70%)", border: "1px solid rgba(249,115,22,0.22)" }}>
              <p className="font-display text-lg font-bold text-white">Have a question about a refund?</p>
              <Link href="/contact-us/" className="btn-primary"><span>Contact Support</span><ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
