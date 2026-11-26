export type Category = "vcc" | "cloud";

export interface Variant {
  name: string;
  price: number;
  /** Regular (crossed-out) price */
  regular?: number;
  inStock: boolean;
  /** Optional heading the variant is listed under on the product page */
  group?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  /** Short label used in cards, e.g. "Amazon Web Services" */
  provider: string;
  /** Brand/accent colour used for glows and accents */
  color: string;
  /** 1–3 letter monogram, used when there is no logo image */
  mono: string;
  /** Official provider logo in /public/logos */
  logo?: string;
  badge?: string;
  /** Lowest in-stock price (what "From" shows) */
  price: number;
  /** Highest price, when there are several variants */
  priceTo?: number;
  oldPrice?: number;
  /** Selectable options (tiers). Products without variants are bought as-is. */
  variants?: Variant[];
  headline: string;
  subline: string;
  /** One-line description shown on product cards */
  short: string;
  description: string;
  bullets: string[];
  meta: string[];
  // VCC only
  balance?: number;
  creationFee?: number;
  serviceFee?: number;
}

const usd = (n: number) => "$" + n.toLocaleString("en-US");

// balance, service fee, total, crossed price, badge
const vccRows: Array<[number, number, number, number, string]> = [
  [10, 5, 25, 30, "Starter"],
  [25, 8, 43, 60, "Instant Delivery"],
  [50, 18, 78, 85, "Popular"],
  [100, 28, 138, 150, "Best Seller"],
  [200, 43, 253, 270, "Instant Delivery"],
  [500, 88, 598, 630, "High Balance"],
  [1000, 148, 1158, 1210, "Business"],
  [2000, 198, 2208, 2320, "Max Balance"],
];

export const vccProducts: Product[] = vccRows.map(([balance, fee, total, old, badge]) => ({
  id: `vcc-${balance}`,
  slug: `${balance}-loaded-card`,
  name: `${usd(balance)} Loaded Card`,
  category: "vcc",
  provider: "Virtual Credit Card",
  color: "#f97316",
  mono: "VCC",
  badge,
  price: total,
  oldPrice: old,
  headline: usd(balance),
  subline: "Loaded balance",
  short: `Reloadable virtual card with ${usd(balance)} loaded.`,
  description: `A reloadable virtual credit card pre-loaded with ${usd(
    balance
  )}. You receive the card number, expiry date and CVV — ready for online payments, ads, subscriptions and international transactions.`,
  bullets: [`${usd(balance)} loaded balance`, `$10 creation fee + ${usd(fee)} service fee`, "Card number, expiry & CVV"],
  meta: ["< 5 Min", "Reloadable", "Global"],
  balance,
  creationFee: 10,
  serviceFee: fee,
}));

interface CloudSeed {
  key: string;
  name: string;
  provider: string;
  color: string;
  mono: string;
  badge?: string;
  short: string;
  bullets: string[];
  /** For single-option products */
  price?: number;
  oldPrice?: number;
  variants?: Variant[];
}

const v = (name: string, price: number, regular: number, group?: string, inStock = true): Variant => ({
  name,
  price,
  regular,
  inStock,
  group,
});

// The 15 cloud accounts, with their real variations and prices.
const cloudSeeds: CloudSeed[] = [
  {
    key: "aws", name: "AWS Account", provider: "Amazon Web Services", color: "#FF9900", mono: "AWS", badge: "Best Seller",
    short: "Bedrock & Kiro enabled options, vCPU tiers from 5 to 1,946 vCPUs and 5K–100K credit accounts.",
    bullets: ["5 – 1,946 vCPU tiers", "5K–100K credit accounts", "Bedrock & Kiro enabled options"],
    variants: [
      v("5vCPUs Account", 25, 35, "vCPU Accounts"),
      v("8vCPUs Account", 30, 40, "vCPU Accounts"),
      v("32vCPUs Account", 45, 60, "vCPU Accounts"),
      v("64vCPUs Account", 80, 120, "vCPU Accounts"),
      v("128vCPUs Account", 160, 220, "vCPU Accounts"),
      v("256vCPUs Account", 320, 380, "vCPU Accounts"),
      v("512vCPUs Account", 570, 680, "vCPU Accounts"),
      v("Bedrock Enabled 10 RPM 5vCPUs", 80, 130, "Bedrock & Kiro"),
      v("Bedrock Enabled 50 RPM 5vCPUs", 160, 220, "Bedrock & Kiro"),
      v("Bedrock Enabled 10K RPM 5vCPUs", 190, 280, "Bedrock & Kiro", false),
      v("Kiro Enabled Account", 160, 200, "Bedrock & Kiro"),
      v("256vCPUs 10K RPM - 4.6, 4.7, 4.8 Supported", 3500, 3800, "High-RPM vCPU Accounts"),
      v("384vCPUs 10K RPM - 4.6, 4.7, 4.8 Supported", 4500, 4900, "High-RPM vCPU Accounts"),
      v("512vCPUs 10K RPM - 4.6, 4.7, 4.8 Supported", 5500, 6000, "High-RPM vCPU Accounts"),
      v("1920vCPUs 10K RPM - 4.6, 4.7, 4.8 Supported", 6200, 6800, "High-RPM vCPU Accounts"),
      v("1946vCPUs 10K RPM - 4.6, 4.7, 4.8 Supported", 6700, 7500, "High-RPM vCPU Accounts"),
      v("5K Credits Account", 1200, 1600, "Credit Accounts"),
      v("10K Credits Account", 2900, 3200, "Credit Accounts"),
      v("25K Credits Account", 6850, 9500, "Credit Accounts"),
      v("100K Credit Account", 22450, 26000, "Credit Accounts"),
    ],
  },
  {
    key: "azure", name: "Azure Account", provider: "Microsoft Azure", color: "#0EA5E9", mono: "Az",
    short: "$200 free-trial and Pay-As-You-Go Azure accounts.",
    bullets: ["$200 free-trial credit", "Pay-As-You-Go option", "Login warranty"],
    variants: [v("$200 Free Trial Account", 30, 45), v("Pay As You Go Account", 50, 65)],
  },
  {
    key: "google-cloud", name: "Google Cloud Account", provider: "Google Cloud", color: "#4285F4", mono: "GCP", badge: "Popular",
    short: "$300 free-trial accounts plus $2K–$100K credit accounts for Compute Engine, Vertex AI and more.",
    bullets: ["$300 free-trial credit", "$2K–$100K credit accounts", "Full console access"],
    variants: [
      v("$300 Free Trial Account", 65, 80),
      v("$2,000 Credits Account", 800, 1250),
      v("$25,000 Credits Account", 6850, 8500),
      v("$100,000 Credits Account", 21450, 26500),
    ],
  },
  {
    key: "digitalocean", name: "DigitalOcean Account", provider: "DigitalOcean", color: "#0080FF", mono: "DO",
    short: "$200 free-trial DigitalOcean accounts with 3 or 10 droplet limits.",
    bullets: ["$200 free-trial credit", "3 or 10 droplet limit", "Ready to deploy"],
    variants: [v("3 Droplets Account", 20, 30), v("10 Droplets Account", 30, 45)],
  },
  {
    key: "akamai-connected", name: "Akamai Connected Account", provider: "Akamai Connected", color: "#0099CC", mono: "Ak", badge: "Port 25 Open",
    short: "Free-trial and Port 25 open accounts with 10 or 50 IP limits.",
    bullets: ["Free-trial account", "Port 25 open", "10 or 50 IP limits"],
    variants: [v("Free Trial Account", 30, 50), v("Port 25 Open 10 IP Limit", 120, 160), v("Port 25 Open 50 IP Limit", 420, 600)],
  },
  {
    key: "linode", name: "Linode Account", provider: "Linode", color: "#00B159", mono: "Li",
    short: "$100 free-trial Linode accounts and Port 25 open accounts with 10 or 20 limits.",
    bullets: ["$100 free-trial credit", "Port 25 open", "10 or 20 limits"],
    variants: [v("$100 Free Trial Account", 30, 45), v("Port 25 Open Limit 10", 100, 140), v("Port 25 Open Limit 20", 180, 240)],
  },
  {
    key: "hetzner", name: "Hetzner Account", provider: "Hetzner Cloud", color: "#D50C2D", mono: "Hz",
    short: "Free-trial Hetzner accounts and Port 25 open accounts with 10 or 50 limits.",
    bullets: ["Free-trial account", "Port 25 open", "10 or 50 limits"],
    variants: [v("Free Trial Account", 45, 80), v("Port 25 Open 10 Limit", 120, 150), v("Port 25 Open 50 Limit", 280, 320)],
  },
  {
    key: "oracle-cloud", name: "Oracle Cloud Account", provider: "Oracle Cloud", color: "#C74634", mono: "OCI",
    short: "Oracle Cloud accounts with $300 free-trial credits, Pay-As-You-Go ready.",
    bullets: ["$300 free-trial credits", "Pay-As-You-Go ready", "Full console access"],
    variants: [v("$300 Free Trial Account", 45, 60)],
  },
  {
    key: "alibaba-cloud", name: "Alibaba Cloud Account", provider: "Alibaba Cloud", color: "#FF6A00", mono: "Ali",
    short: "Verified, ready-to-use Alibaba Cloud personal and enterprise accounts.",
    bullets: ["Verified account", "Personal or enterprise", "Login support"],
    variants: [v("Personal Account", 50, 80), v("Enterprise Account", 80, 130)],
  },
  {
    key: "ibm-cloud", name: "IBM Cloud Account", provider: "IBM Cloud", color: "#0F62FE", mono: "IBM",
    short: "Ready-to-use IBM Cloud accounts with $200 credit.",
    bullets: ["$200 credit", "Verified account", "Login support"],
    price: 45, oldPrice: 65,
  },
  {
    key: "kamatera", name: "Kamatera Account", provider: "Kamatera", color: "#14B8A6", mono: "Ka",
    short: "Kamatera cloud server accounts with $100 credits and Port 25 open.",
    bullets: ["$100 credits", "Port 25 open", "Login support"],
    price: 20, oldPrice: 35,
  },
  {
    key: "ovhcloud", name: "OVHcloud Account", provider: "OVHcloud", color: "#2563EB", mono: "OVH",
    short: "Ready-to-use OVHcloud accounts with 34 vCPUs.",
    bullets: ["34 vCPUs", "Verified account", "Login support"],
    price: 30, oldPrice: 55,
  },
  {
    key: "upcloud", name: "UpCloud Account", provider: "UpCloud", color: "#7B2FF7", mono: "Up",
    short: "Ready-to-use UpCloud accounts with $250 credits.",
    bullets: ["$250 credits", "Verified account", "Login support"],
    price: 30, oldPrice: 55,
  },
  {
    key: "amazon-ses", name: "Amazon SES Account", provider: "Amazon SES", color: "#DD344C", mono: "SES", badge: "Premium",
    short: "Ready-to-use Amazon SES accounts with 50K sending limits.",
    bullets: ["50K sending limit", "Production access", "Login support"],
    price: 900, oldPrice: 1150,
  },
  {
    key: "amazon-seller", name: "Amazon Seller Account", provider: "Amazon Seller", color: "#FF9900", mono: "AMZ",
    short: "Marketplace-approved Amazon Seller accounts, ready to list and sell.",
    bullets: ["Marketplace approved", "Ready to list", "Login support"],
    price: 150, oldPrice: 200,
  },
];

export const cloudProducts: Product[] = cloudSeeds.map((c) => {
  const inStock = c.variants?.filter((x) => x.inStock) ?? [];
  const prices = (inStock.length ? inStock : c.variants ?? []).map((x) => x.price);
  const min = prices.length ? Math.min(...prices) : c.price ?? 0;
  const max = prices.length ? Math.max(...prices) : undefined;
  const single = c.variants?.length === 1 ? c.variants[0] : undefined;
  return {
    id: `cloud-${c.key}`,
    slug: `buy-${c.key}-account`,
    name: c.name,
    category: "cloud" as const,
    provider: c.provider,
    color: c.color,
    mono: c.mono,
    logo: `/logos/${c.key}.png`,
    badge: c.badge,
    price: min,
    priceTo: max !== undefined && max > min ? max : undefined,
    oldPrice: single?.regular ?? c.oldPrice,
    variants: c.variants,
    headline: c.provider,
    subline: c.variants && c.variants.length > 1 ? `${c.variants.length} options available` : "Ready-to-use account",
    short: c.short,
    description: `${c.short} Ready-to-use, with login support and warranty.`,
    bullets: c.bullets,
    meta: ["Fast Delivery", "Login Warranty", "Worldwide"],
  };
});

export const allProducts: Product[] = [...vccProducts, ...cloudProducts];

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

/** True when the buyer must pick an option before adding to cart. */
export function hasOptions(p: Product): boolean {
  return (p.variants?.length ?? 0) > 1;
}

/** Unit price for a product + optional variant name (falls back to the base price). */
export function unitPrice(p: Product, variant?: string): number {
  const found = variant ? p.variants?.find((x) => x.name === variant) : undefined;
  return found ? found.price : p.variants?.length === 1 ? p.variants[0].price : p.price;
}

export function formatPrice(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function priceLabel(p: Product): string {
  return p.priceTo ? `${formatPrice(p.price)} – ${formatPrice(p.priceTo)}` : formatPrice(p.price);
}
