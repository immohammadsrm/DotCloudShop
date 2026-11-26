import { NextResponse } from "next/server";
import { readToken, verifyPayment } from "@/lib/gateway.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Check the blockchain for the payment of a signed quote (optionally a specific transaction hash). */
export async function POST(req: Request) {
  let body: { token?: string; txHash?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const quote = readToken(body.token);
  if (!quote) return NextResponse.json({ error: "This payment link is invalid. Please start checkout again." }, { status: 400 });

  const txHash = typeof body.txHash === "string" ? body.txHash.trim() : undefined;
  if (txHash && !/^(0x)?[a-fA-F0-9]{64}$/.test(txHash)) {
    return NextResponse.json({ error: "That doesn't look like a valid transaction ID." }, { status: 400 });
  }

  try {
    return NextResponse.json(await verifyPayment(quote, txHash || undefined));
  } catch (e) {
    console.error("[gateway] verify failed:", (e as Error).message);
    return NextResponse.json({ status: "waiting", checkedAt: Date.now(), error: "Blockchain check is busy — retrying automatically." });
  }
}
