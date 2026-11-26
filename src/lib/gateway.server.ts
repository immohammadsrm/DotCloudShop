// Server-only crypto payment gateway. Never import this from a client component.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { getProductById, unitPrice } from "./products";
import {
  AVAILABLE_COINS,
  QUOTE_MINUTES,
  WALLETS,
  getCoin,
  type CoinId,
  type Quote,
  type QuoteItem,
  type SignedQuote,
  type VerifyResult,
} from "./payments";
import { site } from "./site";

// ───────────────────────── config ─────────────────────────

const SECRET = (() => {
  const s = process.env.ORDER_SECRET;
  if (s && s.length >= 16) return s;
  console.warn("[gateway] ORDER_SECRET is not set — using a temporary secret. Open orders stop verifying after a restart.");
  return randomBytes(32).toString("hex");
})();

const BSC_RPC = process.env.BSC_RPC_URL || "https://bsc-rpc.publicnode.com";
// TRON JSON-RPC reads live chain data (TronGrid's per-account history API can lag by days).
const TRON_RPCS: Array<{ url: string; headers?: Record<string, string> }> = [
  { url: process.env.TRON_RPC_URL || "https://tron-rpc.publicnode.com/jsonrpc" },
  ...(process.env.TRON_API_KEY ? [{ url: "https://api.trongrid.io/jsonrpc", headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY } }] : []),
];
const TRON_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
/** Blocks before a transfer counts as final */
const MIN_CONF = { tron: 19, bsc: 3 };
const BSC_USDT = "0x55d398326f99059fF775485246999027B3197955";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

/** Smallest-unit decimals on each chain */
const CHAIN_DECIMALS: Record<CoinId, number> = { BTC: 8, ETH: 18, USDT_TRC20: 6, USDT_BEP20: 18 };

// ───────────────────────── helpers ─────────────────────────

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const sign = (payload: string) => createHmac("sha256", SECRET).update(payload).digest("base64url");

export function signQuote(quote: Quote): SignedQuote {
  const payload = b64url(JSON.stringify(quote));
  return { quote, token: `${payload}.${sign(payload)}` };
}

export function readToken(token: unknown): Quote | null {
  if (typeof token !== "string" || token.length > 20000) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Quote;
  } catch {
    return null;
  }
}

/** "123.45" → 12345000000000000000n (for `decimals` = 18 → scaled) */
export function toUnits(amount: string, decimals: number): bigint {
  const [whole, frac = ""] = amount.split(".");
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt((frac + "0".repeat(decimals)).slice(0, decimals) || "0");
}

export function fromUnits(units: bigint, decimals: number, show = 8): string {
  const base = 10n ** BigInt(decimals);
  const whole = units / base;
  const frac = (units % base).toString().padStart(decimals, "0").slice(0, show).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** fetch JSON with a timeout; retries rate limits (429) and server errors with backoff. */
async function getJson<T>(url: string, init?: RequestInit, timeoutMs = 12000, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
      if ((res.status === 429 || res.status >= 500) && i < attempts) {
        await sleep(1200 * i);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return (await res.json()) as T;
    } finally {
      clearTimeout(t);
    }
  }
}

/**
 * Share one blockchain lookup per wallet between all open orders for ~10s,
 * so many customers paying at once don't hit the free APIs' rate limits.
 */
const scanCache = new Map<string, { at: number; p: Promise<Transfer[]> }>();
function cachedScan(key: string, fn: () => Promise<Transfer[]>): Promise<Transfer[]> {
  const hit = scanCache.get(key);
  if (hit && Date.now() - hit.at < 10_000) return hit.p;
  const p = fn();
  scanCache.set(key, { at: Date.now(), p });
  p.catch(() => scanCache.delete(key));
  return p;
}
const LOOKBACK_MS = 24 * 60 * 60 * 1000;

// ───────────────────────── rates ─────────────────────────

let rateCache: { at: number; btc: number; eth: number } | null = null;

export async function getRates(): Promise<{ btc: number; eth: number }> {
  if (rateCache && Date.now() - rateCache.at < 60_000) return rateCache;
  let btc = 0;
  let eth = 0;
  try {
    const r = await getJson<{ bitcoin?: { usd?: number }; ethereum?: { usd?: number } }>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );
    btc = r.bitcoin?.usd ?? 0;
    eth = r.ethereum?.usd ?? 0;
  } catch {
    /* fall through to Binance */
  }
  if (!(btc > 0 && eth > 0)) {
    const r = await getJson<Array<{ symbol: string; price: string }>>(
      'https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT"]'
    );
    btc = Number(r.find((x) => x.symbol === "BTCUSDT")?.price ?? 0);
    eth = Number(r.find((x) => x.symbol === "ETHUSDT")?.price ?? 0);
  }
  if (!(btc > 0 && eth > 0)) throw new Error("Live crypto prices are unavailable right now.");
  rateCache = { at: Date.now(), btc, eth };
  return rateCache;
}

// ───────────────────────── quotes ─────────────────────────

export interface QuoteInput {
  items: Array<{ id: string; variant?: string; qty: number }>;
  coin: string;
  customer: { name?: string; email?: string; contact?: string; notes?: string };
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function createQuote(input: QuoteInput): Promise<SignedQuote> {
  const coin = getCoin(input.coin);
  if (!coin || !AVAILABLE_COINS.some((c) => c.id === coin.id)) throw new Error("This payment method is not available.");

  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) throw new Error("Your cart is empty.");

  // Re-price every item from the catalogue — never trust prices sent by the browser.
  const items: QuoteItem[] = input.items.map((raw) => {
    const p = getProductById(String(raw.id));
    if (!p) throw new Error("A product in your cart no longer exists.");
    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) throw new Error("Invalid quantity.");
    let variant: string | undefined;
    if (raw.variant) {
      const v = p.variants?.find((x) => x.name === raw.variant);
      if (!v) throw new Error(`The option "${raw.variant}" is no longer available.`);
      if (!v.inStock) throw new Error(`"${v.name}" is sold out.`);
      variant = v.name;
    } else if ((p.variants?.length ?? 0) > 1) {
      throw new Error(`Please choose an option for ${p.name}.`);
    }
    return { id: p.id, name: p.name, variant, qty, unit: unitPrice(p, variant) };
  });

  const usdTotal = Math.round(items.reduce((n, i) => n + i.unit * i.qty, 0) * 100) / 100;
  if (!(usdTotal > 0)) throw new Error("Invalid order total.");

  const name = clean(input.customer?.name, 80);
  const email = clean(input.customer?.email, 120);
  if (!name) throw new Error("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");

  // Unique amount per order so payments can be matched automatically.
  let amount: string;
  let rate = 1;
  if (coin.id === "USDT_TRC20" || coin.id === "USDT_BEP20") {
    // Take 1–49 cents OFF the total (customer pays slightly less, never more).
    const cents = Math.max(1, Math.round(usdTotal * 100) - randomInt(1, 50));
    amount = (cents / 100).toFixed(2);
  } else {
    const rates = await getRates();
    rate = coin.id === "BTC" ? rates.btc : rates.eth;
    if (coin.id === "BTC") {
      const sats = Math.ceil(((usdTotal / rate) * 1e8) / 100) * 100 + randomInt(1, 100);
      amount = (sats / 1e8).toFixed(8);
    } else {
      const micro = Math.ceil(((usdTotal / rate) * 1e6) / 10) * 10 + randomInt(1, 10);
      amount = (micro / 1e6).toFixed(6);
    }
  }

  const now = Date.now();
  const quote: Quote = {
    id: "DCS-" + now.toString(36).toUpperCase().slice(-5) + randomBytes(2).toString("hex").toUpperCase(),
    createdAt: now,
    expiresAt: now + QUOTE_MINUTES * 60_000,
    coin: coin.id,
    address: WALLETS[coin.id],
    usdTotal,
    amount,
    rate,
    items,
    customer: {
      name,
      email,
      contact: clean(input.customer?.contact, 80) || undefined,
      notes: clean(input.customer?.notes, 500) || undefined,
    },
  };

  void notifyTelegram(orderMessage(quote, "🆕 <b>New order — awaiting payment</b>"));
  return signQuote(quote);
}

// ───────────────────────── blockchain scanners ─────────────────────────

interface Transfer {
  hash: string;
  units: bigint;
  time: number;
  confirmed: boolean;
  confirmations?: number;
}

async function rpc<T>(url: string, method: string, params: unknown[], headers: Record<string, string> = {}): Promise<T> {
  const r = await getJson<{ result?: T; error?: { message: string } }>(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (r.error) throw new Error(r.error.message);
  return r.result as T;
}

const bscRpc = <T>(method: string, params: unknown[]) => rpc<T>(BSC_RPC, method, params);

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/** TRON base58 address (T…) → 20-byte hex (no 0x41 prefix), e.g. for log topics. */
function tronHex20(address: string): string {
  let n = 0n;
  for (const c of address) {
    const i = B58.indexOf(c);
    if (i < 0) throw new Error("Invalid TRON address");
    n = n * 58n + BigInt(i);
  }
  const hex = n.toString(16).padStart(50, "0"); // 25 bytes: 0x41 + 20 bytes + 4-byte checksum
  return hex.slice(2, 42);
}

interface RpcLog {
  transactionHash: string;
  data: string;
  blockNumber: string;
  blockTimestamp?: string;
  topics: string[];
}

/**
 * Generic ERC20-style transfer scan via eth_getLogs, walking back from the chain head in
 * chunks (public RPCs cap the block range per query).
 */
async function scanLogs(opts: {
  call: <T>(method: string, params: unknown[]) => Promise<T>;
  token: string;
  toHex20: string;
  since: number;
  blockMs: number;
  maxRange: number;
  minConf: number;
  stripHashPrefix?: boolean;
}): Promise<Transfer[]> {
  const latest = Number(BigInt(await opts.call<string>("eth_blockNumber", [])));
  const back = Math.min(Math.ceil(LOOKBACK_MS / opts.blockMs), Math.ceil((Date.now() - opts.since) / opts.blockMs) + 200);
  const toTopic = "0x" + opts.toHex20.toLowerCase().padStart(64, "0");
  const out: Transfer[] = [];
  for (let end = latest; end > latest - back; end -= opts.maxRange) {
    const start = Math.max(latest - back, end - opts.maxRange + 1);
    const logs = await opts.call<RpcLog[]>("eth_getLogs", [
      { address: opts.token, fromBlock: "0x" + start.toString(16), toBlock: "0x" + end.toString(16), topics: [TRANSFER_TOPIC, null, toTopic] },
    ]);
    for (const l of logs ?? []) {
      const confirmations = latest - Number(BigInt(l.blockNumber)) + 1;
      out.push({
        hash: opts.stripHashPrefix ? l.transactionHash.replace(/^0x/, "") : l.transactionHash,
        units: BigInt(l.data),
        time: l.blockTimestamp ? Number(BigInt(l.blockTimestamp)) * 1000 : Date.now(),
        confirmed: confirmations >= opts.minConf,
        confirmations,
      });
    }
  }
  return out;
}

async function scanTron(address: string, since: number): Promise<Transfer[]> {
  let lastErr: unknown;
  for (const node of TRON_RPCS) {
    try {
      return await scanLogs({
        call: (m, p) => rpc(node.url, m, p, node.headers),
        token: "0x" + tronHex20(TRON_USDT),
        toHex20: tronHex20(address),
        since,
        blockMs: 3000,
        maxRange: 4900,
        minConf: MIN_CONF.tron,
        stripHashPrefix: true, // TRON explorers use the tx id without 0x
      });
    } catch (e) {
      lastErr = e; // try the next node
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("TRON lookup failed");
}

async function scanBsc(address: string, since: number): Promise<Transfer[]> {
  // ~0.45s blocks; the public RPC allows < 10k blocks per query.
  return scanLogs({
    call: bscRpc,
    token: BSC_USDT,
    toHex20: address.replace(/^0x/, ""),
    since,
    blockMs: 450,
    maxRange: 9000,
    minConf: MIN_CONF.bsc,
  });
}

async function bscByHash(address: string, hash: string): Promise<Transfer[]> {
  try {
    return await bscByHashUnsafe(address, hash);
  } catch {
    return []; // unknown / not-yet-indexed transaction
  }
}

async function bscByHashUnsafe(address: string, hash: string): Promise<Transfer[]> {
  const rcpt = await bscRpc<{ status: string; blockNumber: string; logs: Array<{ address: string; topics: string[]; data: string }> } | null>(
    "eth_getTransactionReceipt",
    [hash]
  );
  if (!rcpt || rcpt.status !== "0x1") return [];
  const block = await bscRpc<{ timestamp: string }>("eth_getBlockByNumber", [rcpt.blockNumber, false]);
  const toTopic = "0x" + address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  return rcpt.logs
    .filter((l) => l.address.toLowerCase() === BSC_USDT.toLowerCase() && l.topics[0] === TRANSFER_TOPIC && l.topics[2]?.toLowerCase() === toTopic)
    .map((l) => ({ hash, units: BigInt(l.data), time: Number(BigInt(block.timestamp)) * 1000, confirmed: true }));
}

interface BlockscoutTx {
  hash: string;
  value: string;
  timestamp: string | null;
  status: string | null;
  result?: string;
  confirmations?: number;
  to?: { hash?: string } | null;
}

const ethTransfer = (t: BlockscoutTx): Transfer => ({
  hash: t.hash,
  units: BigInt(t.value || "0"),
  time: t.timestamp ? Date.parse(t.timestamp) : Date.now(),
  confirmed: t.status === "ok" && (t.confirmations ?? 0) >= 1,
  confirmations: t.confirmations,
});

async function scanEth(address: string, since: number): Promise<Transfer[]> {
  const r = await getJson<{ items?: BlockscoutTx[] }>(`https://eth.blockscout.com/api/v2/addresses/${address}/transactions?filter=to`);
  return (r.items ?? [])
    .filter((t) => t.to?.hash?.toLowerCase() === address.toLowerCase() && t.status !== "error" && t.result !== "error")
    .map(ethTransfer)
    .filter((t) => t.time >= since && t.units > 0n);
}

async function ethByHash(address: string, hash: string): Promise<Transfer[]> {
  try {
    const t = await getJson<BlockscoutTx>(`https://eth.blockscout.com/api/v2/transactions/${hash}`);
    return t.to?.hash?.toLowerCase() === address.toLowerCase() && t.status !== "error" ? [ethTransfer(t)] : [];
  } catch {
    return []; // unknown / not-yet-indexed transaction
  }
}

// Two independent Bitcoin indexers with the same (Esplora) API — used in order.
const BTC_APIS = ["https://blockstream.info/api", "https://mempool.space/api"];

type EsploraTx = { txid: string; status: { confirmed: boolean; block_time?: number; block_height?: number }; vout: Array<{ scriptpubkey_address?: string; value: number }> };

async function btcFetch(address: string): Promise<[EsploraTx[], number]> {
  let lastErr: unknown;
  for (const base of BTC_APIS) {
    try {
      return await Promise.all([
        getJson<EsploraTx[]>(`${base}/address/${address}/txs`, undefined, 8000, 1),
        getJson<number>(`${base}/blocks/tip/height`, undefined, 8000, 1),
      ]);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Bitcoin lookup failed");
}

async function scanBtc(address: string, since: number): Promise<Transfer[]> {
  const [txs, tip] = await btcFetch(address);
  return txs
    .map((tx) => ({
      hash: tx.txid,
      units: BigInt(tx.vout.filter((o) => o.scriptpubkey_address === address).reduce((n, o) => n + o.value, 0)),
      time: tx.status.block_time ? tx.status.block_time * 1000 : Date.now(),
      confirmed: tx.status.confirmed,
      confirmations: tx.status.block_height ? tip - tx.status.block_height + 1 : 0,
    }))
    .filter((t) => t.time >= since && t.units > 0n);
}

const normHash = (h: string) => h.toLowerCase().replace(/^0x/, "");

async function findTransfers(q: Quote, txHash?: string): Promise<Transfer[]> {
  const since = q.createdAt - 2 * 60_000; // small clock-skew margin
  const want = txHash ? normHash(txHash) : undefined;
  const has = (list: Transfer[]) => list.some((t) => normHash(t.hash) === want);
  const dayAgo = () => Date.now() - LOOKBACK_MS;
  let list: Transfer[];
  switch (q.coin) {
    case "USDT_TRC20":
      list = await cachedScan(`trc20:${q.address}`, () => scanTron(q.address, dayAgo()));
      break;
    case "USDT_BEP20":
      // RPC windows are per order (block ranges are limited); cache per order window.
      list = await cachedScan(`bep20:${q.address}:${since}`, () => scanBsc(q.address, since));
      if (want && !has(list)) list = list.concat(await bscByHash(q.address, "0x" + want));
      break;
    case "ETH":
      list = await cachedScan(`eth:${q.address}`, () => scanEth(q.address, dayAgo()));
      if (want && !has(list)) list = list.concat(await ethByHash(q.address, "0x" + want));
      break;
    case "BTC":
      list = await cachedScan(`btc:${q.address}`, () => scanBtc(q.address, dayAgo()));
      break;
    default:
      list = [];
  }
  list = list.filter((t) => t.time >= since);
  if (want) list = list.filter((t) => normHash(t.hash) === want);
  return list;
}

// ───────────────────────── verification ─────────────────────────

const verifyCache = new Map<string, VerifyResult>();
const notified = new Set<string>();

// ── One transaction can only pay for one order. Claims are kept on disk so this survives restarts.
const CLAIMS_FILE = join(process.cwd(), ".data", "payment-claims.json");
let claims: Record<string, { order: string; at: number }> | null = null;

function loadClaims(): Record<string, { order: string; at: number }> {
  if (claims) return claims;
  try {
    claims = JSON.parse(readFileSync(CLAIMS_FILE, "utf8"));
  } catch {
    claims = {};
  }
  return claims!;
}

function claimOwner(hash: string): string | undefined {
  return loadClaims()[normHash(hash)]?.order;
}

function claim(hash: string, order: string) {
  const c = loadClaims();
  c[normHash(hash)] = { order, at: Date.now() };
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (const k of Object.keys(c)) if (c[k].at < weekAgo) delete c[k];
  try {
    mkdirSync(dirname(CLAIMS_FILE), { recursive: true });
    writeFileSync(CLAIMS_FILE, JSON.stringify(c));
  } catch {
    /* read-only hosting: claims stay in memory */
  }
}

// ── Recent sales (shown in the site's live "recent purchases" display). Only confirmed payments are recorded.
// Real sales made elsewhere (e.g. on Telegram) can be added to .data/recent-sales.json in the same format.
export interface SaleRecord {
  id: string; // product id
  name: string;
  variant?: string;
  qty: number;
  price: number; // USD for this line
  coin: string; // e.g. "USDT"
  at: number; // ms timestamp
}
const SALES_FILE = join(process.cwd(), ".data", "recent-sales.json");

export function loadSales(): SaleRecord[] {
  try {
    const list = JSON.parse(readFileSync(SALES_FILE, "utf8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function recordSale(q: Quote) {
  const coin = getCoin(q.coin)?.symbol ?? "crypto";
  const now = Date.now();
  const lines: SaleRecord[] = q.items.map((i) => ({ id: i.id, name: i.name, variant: i.variant, qty: i.qty, price: i.unit * i.qty, coin, at: now }));
  const list = [...lines, ...loadSales()].sort((a, b) => b.at - a.at).slice(0, 100);
  try {
    mkdirSync(dirname(SALES_FILE), { recursive: true });
    writeFileSync(SALES_FILE, JSON.stringify(list, null, 1));
  } catch {
    /* read-only hosting */
  }
}

const absDiff = (a: bigint, b: bigint) => (a > b ? a - b : b - a);

export async function verifyPayment(q: Quote, txHash?: string): Promise<VerifyResult> {
  const cacheKey = `${q.id}:${txHash ?? ""}`;
  const cached = verifyCache.get(cacheKey);
  if (cached && Date.now() - cached.checkedAt < 8000) return cached;

  const decimals = CHAIN_DECIMALS[q.coin];
  const expected = toUnits(q.amount, decimals);
  // Ignore transactions already used to pay a different order.
  const transfers = (await findTransfers(q, txHash)).filter((t) => {
    const owner = claimOwner(t.hash);
    return !owner || owner === q.id;
  });

  // Automatic matching: exact unique amount first, otherwise within -1% / +5% (exchange rounding, small top-ups).
  // When the customer gives their own TX hash, any payment of at least 99% counts (overpayment allowed).
  const inBand = (t: Transfer) =>
    t.units * 100n >= expected * 99n && (txHash ? true : t.units * 100n <= expected * 105n);
  const candidates = transfers.filter(inBand);
  const best =
    candidates.find((t) => t.units === expected) ??
    candidates.sort((a, b) => {
      const da = absDiff(a.units, expected);
      const db = absDiff(b.units, expected);
      return da < db ? -1 : da > db ? 1 : 0;
    })[0];

  let result: VerifyResult;
  if (best) {
    if (best.confirmed && claimOwner(best.hash) !== q.id) {
      claim(best.hash, q.id);
      recordSale(q); // first time this order is confirmed paid
    }
    result = {
      status: best.confirmed ? "paid" : "pending",
      txHash: best.hash,
      received: fromUnits(best.units, decimals),
      confirmations: best.confirmations,
      checkedAt: Date.now(),
    };
  } else {
    const partial = transfers
      .filter((t) => t.units * 100n >= expected * 50n && t.units * 100n < expected * 99n)
      .sort((a, b) => (a.units > b.units ? -1 : 1))[0];
    result = partial
      ? { status: "underpaid", txHash: partial.hash, received: fromUnits(partial.units, decimals), checkedAt: Date.now() }
      : { status: "waiting", checkedAt: Date.now() };
  }

  verifyCache.set(cacheKey, result);
  if (result.status === "paid" && result.txHash && !notified.has(result.txHash)) {
    notified.add(result.txHash);
    const coin = getCoin(q.coin);
    void notifyTelegram(
      orderMessage(q, "✅ <b>Payment received</b>") +
        `\n\n<b>Received:</b> ${result.received} ${coin?.symbol}\n<b>TX:</b> <a href="${coin?.explorerTx(result.txHash)}">${result.txHash}</a>`
    );
  }
  return result;
}

// ───────────────────────── notifications ─────────────────────────

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function orderMessage(q: Quote, title: string): string {
  const coin = getCoin(q.coin);
  return [
    `${title} · ${site.name}`,
    `<b>Order:</b> ${q.id}`,
    ...q.items.map((i) => `• ${esc(i.name)}${i.variant ? ` (${esc(i.variant)})` : ""} × ${i.qty} — $${(i.unit * i.qty).toLocaleString("en-US")}`),
    `<b>Total:</b> $${q.usdTotal.toLocaleString("en-US")} → <b>${q.amount} ${coin?.symbol}</b> (${coin?.network})`,
    `<b>Name:</b> ${esc(q.customer.name)}`,
    `<b>Email:</b> ${esc(q.customer.email)}`,
    q.customer.contact ? `<b>Telegram/WhatsApp:</b> ${esc(q.customer.contact)}` : "",
    q.customer.notes ? `<b>Notes:</b> ${esc(q.customer.notes)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  try {
    await getJson(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (e) {
    console.error("[gateway] Telegram notification failed:", (e as Error).message);
  }
}
