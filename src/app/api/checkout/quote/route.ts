import { NextResponse } from "next/server";
import { createQuote, type QuoteInput } from "@/lib/gateway.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Create a signed payment quote: re-prices the cart server-side and locks the crypto amount. */
export async function POST(req: Request) {
  let body: QuoteInput;
  try {
    body = (await req.json()) as QuoteInput;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    return NextResponse.json(await createQuote(body));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Could not create the payment." }, { status: 400 });
  }
}
