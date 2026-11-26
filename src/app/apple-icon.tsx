import { ImageResponse } from "next/og";

// Home-screen icon for iPhone/iPad (PNG). Same design as src/app/icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fb923c, #ea580c)",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path transform="translate(12 9) scale(1.67)" fill="#fff" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <circle cx="41.2" cy="33.2" r="3.6" fill="#ea580c" />
        </svg>
      </div>
    ),
    size,
  );
}
