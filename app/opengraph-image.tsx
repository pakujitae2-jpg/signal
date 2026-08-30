import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PNL404 — Profit Not Found";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f9f8f4",
          color: "#1a1916",
          padding: "72px 80px",
          borderTop: "14px solid #1a1916",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: "0.1em" }}>
            <span>PNL</span>
            <span style={{ color: "#c62828" }}>404</span>
          </div>
          <div style={{ fontSize: 30, color: "#55524a", marginTop: 16, letterSpacing: "0.06em" }}>
            PROFIT NOT FOUND — GLOBAL MARKETS, ONE PAGE
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          {[112, 64, 148, 92, 178, 76, 132, 200, 108, 156, 88, 168, 122, 190, 142].map((h, i) => (
            <div
              key={i}
              style={{
                width: 44,
                height: h,
                borderRadius: 8,
                background: i % 3 === 2 ? "#c62828" : "#0d7d55",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#55524a" }}>
          <span>US · Japan · Korea equities — Crypto live — FX &amp; commodities</span>
          <span>Updated every 30 seconds</span>
        </div>
      </div>
    ),
    size
  );
}
