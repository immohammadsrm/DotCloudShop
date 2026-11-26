"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useCart } from "./CartProvider";

/** "Buy Now" for one variant row: adds that option to the cart and opens the cart. */
export default function VariantBuyButton({
  productId,
  variant,
  inStock = true,
  label,
}: {
  productId: string;
  /** Omit for products without options (e.g. virtual cards) */
  variant?: string;
  inStock?: boolean;
  label: string;
}) {
  const { add } = useCart();
  const router = useRouter();

  if (!inStock) {
    return (
      <button type="button" disabled className="btn-outline !px-3 !py-1.5 !text-[11px]">
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Buy now: ${label}`}
      onClick={() => {
        add(productId, 1, variant);
        router.push("/cart/");
      }}
      className="btn-primary !px-3.5 !py-1.5 !text-[11px]"
    >
      <Zap className="h-3 w-3" />
      <span>Buy Now</span>
    </button>
  );
}
