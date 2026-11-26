// Central site configuration — edit contact details, wallets and stats here.

export const site = {
  name: "DotCloudShop",
  url: "https://dotcloudshop.com",
  tagline: "No KYC · Global VCC · Instant Delivery",
  title: "Buy VCC With Crypto | No KYC | Global VCC | Instant Delivery",
  // false = ask Google & other search engines NOT to index any page (site still under construction).
  // When you're ready to launch, set this to true AND set ALLOW_INDEXING = true in next.config.mjs.
  indexing: false,
  description:
    "No KYC virtual cards and premium cloud accounts — paid with crypto, delivered in minutes.",
  contact: {
    phone: "+44 7916694950",
    phoneHref: "tel:+447916694950",
    email: "im.mrfuture@gmail.com",
    telegramHandle: "@hashtagbhw",
    telegram: "https://t.me/hashtagbhw",
    whatsapp: "https://wa.link/3lahap",
    address: "339 Forton Rd, Gosport, Hampshire",
    hours: "Sat - Thurs : 8am - 12pm",
  },
  // Crypto wallet addresses live in src/lib/payments.ts
  stats: {
    rating: "4.9",
    customers: "5,000+",
    delivery: "< 5 Min",
    kyc: "0%",
  },
};
