# DotCloudShop — Next.js site

The DotCloudShop store (https://dotcloudshop.com): virtual cards and cloud accounts, with a dark and orange design.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, lucide-react icons and the Inter and Space Grotesk fonts.

## Run it

You need Node.js 18.18 or newer (https://nodejs.org). Run these in this folder:

```bash
npm install
npm run dev          # open http://localhost:3000
```

For a production build, run `npm run build && npm start`. To deploy on Vercel, push the folder to GitHub and import it.

## Pages

- `/` — Home: hero, ticker, VCC prices (8 cards, custom card, price table), three steps, 15 cloud accounts, guarantee banner, why choose us, stats, reviews, "All Details About Buy VCC" article, FAQ, keywords
- `/shop/` — all 23 products with All / Virtual Cards / Cloud Accounts tabs (`/shop/#cloud` opens the cloud tab)
- `/<slug>/` — product pages, e.g. `/10-loaded-card/`, `/buy-aws-account/` (old `/p/<slug>/` links redirect here permanently)
- `/cart/` and `/checkout/`
- `/contact-us/` and `/refund_returns/`

## Where to edit

- Contact details, stats and crypto wallet addresses: `src/lib/site.ts`
- Products and prices: `src/lib/products.ts`
- FAQ, reviews, features, steps, article and keywords: `src/lib/content.ts`
- Colours: CSS variables in `src/app/globals.css` and `tailwind.config.ts`

## Crypto payment gateway

Customers pay straight to your own wallets in BTC, ETH, USDT TRC20 and USDT BEP20. No third-party processor is involved.

- **Wallets:** `src/lib/payments.ts`. This is the only place addresses are defined. Each address is format-checked, and a coin with an invalid address is hidden at checkout.
- **How it works:**
  1. At checkout the server re-prices the cart from `products.ts`, so browser-sent prices are ignored.
  2. It gives each order a unique amount (USDT: 1–49 cents off; BTC/ETH: live rate locked for 30 minutes).
  3. It signs the quote so the amount and address can't be altered.
  4. The payment page checks the blockchain every 12 seconds and also accepts a pasted transaction ID.
- **Matching rules:**
  - The exact amount is preferred. Otherwise −1% to +5% is accepted.
  - Bigger overpayments count only when the customer pastes their transaction ID.
  - One transaction can pay only one order. Used transactions are recorded in `.data/payment-claims.json`.
- **Blockchain data sources** (all free, no keys needed):
  - TRON: publicnode JSON-RPC
  - BSC: publicnode JSON-RPC
  - ETH: Blockscout
  - BTC: Blockstream, with mempool.space as backup
- **Settings in `.env.local`:**
  - `ORDER_SECRET` (required, already generated) signs quotes. Keep it private and keep it the same between restarts.
  - `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (recommended) send you a Telegram message for every new order and every confirmed payment. Without them, you only learn about orders when customers message you.
  - Optional: `TRON_API_KEY` (free TronGrid key, used as a TRON backup), `BSC_RPC_URL`, `TRON_RPC_URL`.
- **Hosting:** run it with `npm run build && npm start` on a VPS or any Node host so `.data/` can be written. On serverless hosts such as Vercel the gateway still works, but used-transaction records reset on each cold start.

## Not connected yet

- **Newsletter:** the form opens an email. Connect your mailing service in `src/components/Newsletter.tsx`.
- **Order database:** orders aren't stored in a database. Each order and payment is sent to your Telegram (once configured), and the customer keeps their order ID and transaction link.
