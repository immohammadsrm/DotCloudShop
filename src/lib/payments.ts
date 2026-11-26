// Crypto payment settings — the ONLY place wallet addresses are defined.
// The server signs every payment quote with these addresses, so customers can
// only ever be shown (and pay to) the wallets below.

export type CoinId = "BTC" | "ETH" | "USDT_TRC20" | "USDT_BEP20";

export const WALLETS: Record<CoinId, string> = {
  // Each address is format-checked; a coin with an invalid address is hidden at checkout.
  BTC: "bc1qvcv9tvz3r6qfzpra3rw2qddzlkhma2m7fx9y5q",
  ETH: "0x31Ad5ea289Faa348AB1763bb5A1B473f9aA129BE",
  USDT_TRC20: "TNiioTRoV2ukpusE3DR81d3oQHz7RrHaWM",
  USDT_BEP20: "0x31Ad5ea289Faa348AB1763bb5A1B473f9aA129BE",
};

export interface Coin {
  id: CoinId;
  symbol: string;
  name: string;
  network: string;
  networkShort: string;
  glyph: string;
  color: string;
  /** Decimals shown to the customer */
  decimals: number;
  explorerTx: (hash: string) => string;
  explorerAddress: (addr: string) => string;
  warning: string;
}

export const COINS: Coin[] = [
  {
    id: "USDT_TRC20",
    symbol: "USDT",
    name: "Tether",
    network: "TRON (TRC20)",
    networkShort: "TRC20",
    glyph: "₮",
    color: "#26A17B",
    decimals: 2,
    explorerTx: (h) => `https://tronscan.org/#/transaction/${h}`,
    explorerAddress: (a) => `https://tronscan.org/#/address/${a}`,
    warning: "Send only USDT on the TRON (TRC20) network. Other tokens or networks will be lost.",
  },
  {
    id: "USDT_BEP20",
    symbol: "USDT",
    name: "Tether",
    network: "BNB Smart Chain (BEP20)",
    networkShort: "BEP20",
    glyph: "₮",
    color: "#F0B90B",
    decimals: 2,
    explorerTx: (h) => `https://bscscan.com/tx/${h}`,
    explorerAddress: (a) => `https://bscscan.com/address/${a}`,
    warning: "Send only USDT on BNB Smart Chain (BEP20). Other tokens or networks will be lost.",
  },
  {
    id: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    networkShort: "BTC",
    glyph: "₿",
    color: "#F7931A",
    decimals: 8,
    explorerTx: (h) => `https://mempool.space/tx/${h}`,
    explorerAddress: (a) => `https://mempool.space/address/${a}`,
    warning: "Send only Bitcoin (BTC) on the Bitcoin network.",
  },
  {
    id: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum (ERC20)",
    networkShort: "ERC20",
    glyph: "Ξ",
    color: "#8C8CF7",
    decimals: 6,
    explorerTx: (h) => `https://etherscan.io/tx/${h}`,
    explorerAddress: (a) => `https://etherscan.io/address/${a}`,
    warning: "Send only ETH on the Ethereum mainnet. Do not send from another network.",
  },
];

const PATTERNS: Record<CoinId, RegExp> = {
  BTC: /^(bc1[02-9ac-hj-np-z]{11,71}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/,
  ETH: /^0x[a-fA-F0-9]{40}$/,
  USDT_BEP20: /^0x[a-fA-F0-9]{40}$/,
  USDT_TRC20: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
};

export function isValidWallet(id: CoinId): boolean {
  return PATTERNS[id].test(WALLETS[id]);
}

/** Coins customers can pay with (wallet set and in the right format). */
export const AVAILABLE_COINS: Coin[] = COINS.filter((c) => isValidWallet(c.id));

export function getCoin(id: string): Coin | undefined {
  return COINS.find((c) => c.id === id);
}

/** How long a crypto price quote is locked for. */
export const QUOTE_MINUTES = 30;

// ---- Shared order/quote types (client + server) ----

export interface QuoteItem {
  id: string;
  name: string;
  variant?: string;
  qty: number;
  unit: number;
}

export interface Quote {
  id: string;
  createdAt: number;
  expiresAt: number;
  coin: CoinId;
  address: string;
  usdTotal: number;
  /** Exact crypto amount to send, as a decimal string */
  amount: string;
  /** USD price of 1 coin used for the quote */
  rate: number;
  items: QuoteItem[];
  customer: { name: string; email: string; contact?: string; notes?: string };
}

export interface SignedQuote {
  quote: Quote;
  /** Server-signed copy of the quote; the server only trusts this, never `quote`. */
  token: string;
}

export type PaymentStatus = "waiting" | "pending" | "paid" | "underpaid";

export interface VerifyResult {
  status: PaymentStatus;
  txHash?: string;
  received?: string;
  confirmations?: number;
  checkedAt: number;
  error?: string;
}
