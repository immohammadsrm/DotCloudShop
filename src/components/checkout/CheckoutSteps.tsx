import { Check, CreditCard, PackageCheck, ShoppingCart, UserRound } from "lucide-react";

const steps = [
  { label: "Cart", icon: ShoppingCart },
  { label: "Details", icon: UserRound },
  { label: "Payment", icon: CreditCard },
  { label: "Delivered", icon: PackageCheck },
];

/** Glowing 4-step progress tracker. `current` is 1-based. */
export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const pct = ((current - 1) / (steps.length - 1)) * 100;
  return (
    <div className="relative mx-auto mb-10 max-w-3xl">
      <div className="absolute left-[12.5%] right-[12.5%] top-5 h-[2px] rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#ea580c,#fdba74)", boxShadow: "0 0 14px rgba(249,115,22,0.7)" }}
        />
      </div>
      <ol className="relative grid grid-cols-4">
        {steps.map((s, i) => {
          const n = i + 1;
          const done = n < current;
          const on = n === current;
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex flex-col items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500"
                style={
                  on
                    ? { background: "linear-gradient(135deg,#fb923c,#ea580c)", boxShadow: "0 0 0 5px rgba(249,115,22,0.15), 0 10px 26px -6px rgba(234,88,12,0.8)" }
                    : done
                      ? { background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.5)" }
                      : { background: "#131216", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {done ? <Check className="h-4 w-4 text-accent-bright" /> : <Icon className={`h-4 w-4 ${on ? "text-white" : "text-white/35"}`} />}
              </span>
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${on ? "text-white" : done ? "text-accent-soft" : "text-white/30"}`}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
