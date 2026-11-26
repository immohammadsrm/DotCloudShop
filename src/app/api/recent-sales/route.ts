import { NextResponse } from "next/server";
import { loadSales } from "@/lib/gateway.server";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // show purchases from the last 30 days

/** Public, anonymous list of recent confirmed purchases (no customer details). */
export async function GET() {
  const cutoff = Date.now() - MAX_AGE;
  const sales = loadSales()
    .filter((s) => s.at >= cutoff)
    .slice(0, 20)
    .map((s) => {
      const p = getProductById(s.id);
      return {
        name: s.name,
        variant: s.variant,
        qty: s.qty,
        price: s.price,
        coin: s.coin,
        at: s.at,
        slug: p?.slug,
        logo: p?.logo,
        color: p?.color ?? "#f97316",
        category: p?.category,
      };
    });
  return NextResponse.json({ sales }, { headers: { "Cache-Control": "no-store" } });
}
