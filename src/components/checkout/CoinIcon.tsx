import type { Coin } from "@/lib/payments";

export default function CoinIcon({ coin, size = 36 }: { coin: Coin; size?: number }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className="flex h-full w-full items-center justify-center rounded-full font-bold"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${coin.color}55, ${coin.color}22)`,
          border: `1px solid ${coin.color}70`,
          color: coin.color,
          fontSize: size * 0.48,
          boxShadow: `0 6px 18px -6px ${coin.color}`,
        }}
      >
        {coin.glyph}
      </span>
      {coin.symbol === "USDT" && (
        <span
          className="absolute -bottom-1 -right-1.5 rounded-md px-1 text-[7px] font-bold leading-[13px] text-black"
          style={{ background: coin.id === "USDT_TRC20" ? "#EF0027" : "#F0B90B", color: coin.id === "USDT_TRC20" ? "#fff" : "#000" }}
        >
          {coin.networkShort}
        </span>
      )}
    </span>
  );
}
