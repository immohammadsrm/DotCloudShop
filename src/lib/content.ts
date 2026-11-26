// Page copy for DotCloudShop.
// Body text was reworded from the live site; paste your original wording here if you prefer.

/** Homepage ticker. `logo` = official provider logo; `icon` = built-in icon for the non-brand items. */
export type TickerItem = { label: string; logo?: string; icon?: "card" | "kyc" | "fast" | "crypto" | "support" | "reload" };

export const ticker: TickerItem[] = [
  { label: "Virtual Cards $10 – $2,000", icon: "card" },
  { label: "AWS", logo: "/logos/aws.png" },
  { label: "Google Cloud", logo: "/logos/google-cloud.png" },
  { label: "Microsoft Azure", logo: "/logos/azure.png" },
  { label: "No KYC", icon: "kyc" },
  { label: "DigitalOcean", logo: "/logos/digitalocean.png" },
  { label: "Hetzner", logo: "/logos/hetzner.png" },
  { label: "Reloadable Cards", icon: "reload" },
  { label: "Linode", logo: "/logos/linode.png" },
  { label: "Oracle Cloud", logo: "/logos/oracle-cloud.png" },
  { label: "< 5 Min Delivery", icon: "fast" },
  { label: "Alibaba Cloud", logo: "/logos/alibaba-cloud.png" },
  { label: "Amazon SES", logo: "/logos/amazon-ses.png" },
  { label: "BTC · USDT", icon: "crypto" },
  { label: "24/7 Support", icon: "support" },
];

export const steps = [
  { n: "01", title: "Choose Your Product", text: "Pick a virtual card balance from $10 to $2,000, or a ready-to-use account from 15 cloud providers." },
  { n: "02", title: "Pay With Crypto", text: "Check out with Bitcoin, USDT or other crypto. No bank, no KYC, no paperwork." },
  { n: "03", title: "Delivered in Minutes", text: "Get your card number, expiry and CVV, or your cloud login details, usually within minutes." },
];

export const features = [
  { icon: "headphones", title: "24/7 Customer Support", text: "Reach us on Telegram and WhatsApp before and after your purchase — real people, fast replies." },
  { icon: "zap", title: "Fast Delivery", text: "Automated delivery gets your card or account details to you within minutes of payment." },
  { icon: "lock", title: "Secure Transactions", text: "A secure checkout keeps your payment and order details private from start to finish." },
  { icon: "badge", title: "Verified Quality", text: "Every card and cloud account is tested before delivery, backed by reliable replacements." },
  { icon: "wallet", title: "Flexible Payment Options", text: "Pay with Bitcoin, USDT and other cryptocurrencies — no banking delays." },
  { icon: "users", title: "Trusted by Online Professionals", text: "Media buyers, freelancers, dropshippers, agencies and developers rely on us every day." },
];

export const testimonials = [
  { name: "Sarah Mitchell", role: "E-commerce Store Owner", initials: "SM",
    text: "A really smooth experience. The cards worked for my international payments, the reloadable option saves me time, delivery was fast and support was professional." },
  { name: "Amanda Lewis", role: "Digital Marketing Specialist", initials: "AL",
    text: "Fast delivery and the cards worked exactly as described. The high-balance options are perfect for my subscriptions and ad payments, and support answered quickly." },
  { name: "Jessica Carter", role: "Freelance Business Consultant", initials: "JC",
    text: "Reliable reloadable cards for my international transactions. Activation was simple and the whole process was hassle-free." },
];

export const faqs = [
  { q: "What is a VCC?", a: "A VCC (Virtual Credit Card) is a digital card used for online transactions. It comes with a card number, expiry date and CVV, just like a physical card." },
  { q: "Can I buy a VCC with cryptocurrency?", a: "Yes. You can pay with Bitcoin or USDT for a faster and more flexible checkout." },
  { q: "Are VCCs safe to use online?", a: "Yes. A VCC keeps your main banking details private, giving you more privacy and less fraud risk than using a physical card online." },
  { q: "How quickly will I receive my VCC?", a: "Delivery times can vary, but most cards are delivered within 5 minutes." },
  { q: "Can I use a VCC for subscriptions?", a: "Yes — VCCs work for software, hosting, advertising and other digital tools and subscriptions." },
  { q: "What makes your service the best place to buy a VCC?", a: "Verified cards, responsive support, secure payments and reliable performance." },
  { q: "Are reloadable VCCs available?", a: "Yes. Our reloadable cards are ideal for recurring payments and long-term use." },
  { q: "Can international customers buy a VCC?", a: "Yes. Customers from anywhere in the world can buy a VCC from us." },
  { q: "Which cloud accounts do you sell?", a: "Ready-to-use accounts for AWS, Google Cloud, Azure, DigitalOcean, Akamai Connected, Linode, Hetzner, Oracle Cloud, Alibaba Cloud, IBM Cloud, Kamatera, OVHcloud, UpCloud, Amazon SES and Amazon Seller." },
  { q: "What warranty do cloud accounts have?", a: "Cloud accounts come with a login warranty. Log in within 30 minutes of delivery and report any login issue within the warranty period. If we miss the delivery time, you get a full refund within 24 hours." },
];

export const keywords = [
  "buy VCC", "buy VCC with crypto", "best buy VCC", "instant VCC", "cheap virtual credit card",
  "reloadable VCC", "virtual card for ads", "crypto VCC", "prepaid virtual card",
  "buy virtual credit card online", "USA virtual card", "verified VCC provider", "secure VCC service",
  "virtual debit card online", "VCC for subscriptions", "international virtual card",
  "anonymous virtual card", "virtual card for PayPal", "high balance VCC", "trusted VCC seller",
];

/** Long-form "All Details About Buy VCC" article. */
export const article: Array<{ h: string; p?: string; list?: string[] }> = [
  { h: "Buy VCC: Secure, Fast & Reliable Virtual Card Solutions",
    p: "Whether you run ads, pay for SaaS tools or make international purchases, a virtual credit card gives you a fast, flexible way to pay online. We deliver verified cards in minutes, paid with crypto." },
  { h: "What is VCC?",
    p: "A VCC is a digital payment card with its own card number, expiry date and CVV. It supports billing details and gives you instant access to online payments." },
  { h: "Common Uses of VCCs",
    list: ["Advertising", "SaaS subscriptions", "Online shopping", "Freelancing tools", "Hosting", "International transactions", "Marketplace verification", "Trial subscriptions"] },
  { h: "What You Get with Our VCC Accounts",
    list: ["Instant delivery", "Verified cards", "Secure processing", "Global usability", "Multiple balance options", "Fast replacements", "Dedicated support", "High success rates"] },
  { h: "Designed for Serious Online Users",
    p: "Built for media buyers, freelancers, dropshippers, affiliate marketers, agency owners, developers and crypto users." },
  { h: "Why Use a VCC?",
    list: ["Privacy", "Lower fraud risk", "Speed", "Easy subscriptions", "Global use", "Budget control", "Payment management"] },
  { h: "Ideal for Managing Multiple Accounts",
    p: "Use separate cards for separate projects, clients or ad accounts to keep spending organised." },
  { h: "Should you get a VCC account?",
    p: "If you face international payment restrictions, card declines, payment delays, conversion fees or limited card compatibility, a VCC solves these problems." },
  { h: "Buy VCC with Crypto",
    p: "Pay with Bitcoin or USDT — no banking delays, global access, secure checkout and automated delivery. Popular with media buying agencies, international freelancers, remote teams and anyone paying for global subscriptions." },
  { h: "Benefits of Buying a VCC with Crypto",
    list: ["1. Faster Transactions", "2. Enhanced Privacy", "3. Global Accessibility", "4. Reduced Friction", "5. Easy Scaling"] },
  { h: "Are VCCs Worth It?",
    p: "Yes. A VCC helps you avoid payment interruptions, manage subscriptions, improve success rates, separate expenses and protect your banking details. Reloadable cards can be reused for recurring payments, so the value grows over time." },
  { h: "Choosing a Trusted VCC Provider",
    list: ["Instant access", "High usability", "Professional support", "Secure processing", "Reliable performance"] },
  { h: "Built for Real-World Use",
    list: ["Ad platforms", "Online tools", "Digital subscriptions", "Hosting", "Cloud platforms", "Marketplace accounts"] },
  { h: "Can I buy a reloadable VCC with a high balance from you?",
    p: "Yes. Reloadable cards remove the need for repeat purchases, with up to $2,000 loaded — or any custom amount you need." },
  { h: "Ready to Buy a VCC? Here's How",
    list: ["1. Visit our website", "2. Choose your VCC package", "3. Complete your payment with crypto", "4. Receive your card"] },
  { h: "After purchase you receive",
    list: ["Card details", "Expiry date", "CVV", "Usage instructions", "Support access"] },
];
