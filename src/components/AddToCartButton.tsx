"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({
  id,
  label = "Add to Cart",
  variant = "primary",
  className = "",
}: {
  id: string;
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        // product cards are links — add without navigating
        e.preventDefault();
        e.stopPropagation();
        add(id);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`}
    >
      {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
      <span>{added ? "Added to cart" : label}</span>
    </button>
  );
}
