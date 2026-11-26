"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

/**
 * "Stay Update" newsletter form. There is no mailing-list service connected yet,
 * so submitting opens an email to the store. Replace the handler with your
 * provider's API (Mailchimp, Brevo...) when you have one.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="flex w-full gap-2 md:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
          "Newsletter subscription"
        )}&body=${encodeURIComponent(`Please add ${email} to the DotCloudShop newsletter.`)}`;
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="input flex-1 !text-[12px] md:w-56"
      />
      <button type="submit" className="btn-primary shrink-0 !px-4 !py-2.5 !text-[12px]">
        <span>{done ? "Thanks!" : "Submit"}</span>
        {done ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}
