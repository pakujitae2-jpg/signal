import { ImageResponse } from "next/og";
import { getQuoteDetail, isValidSymbol } from "@/lib/quote";
import { fmtNum, fmtSigned } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Price card";

export default async function OgImage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw);
  const detail = isValidSymbol(symbol) ? await getQuoteDetail(symbol, "1d") : null;

  const name = detail?.name ?? symbol;
  const price = detail?.price ?? null;
  const prev = detail?.prevClose ?? null;
  const change = price !== null && prev !== null ? price - prev : null;
  const pct = change !== null && prev ? (change / prev) * 100 : null;
  const up = (pct ?? 0) >= 0;
  const color = pct === null ? "#77746b" : up ? "#0d7d55" : "#c62828";

  const spark = detail?.points.map((p) => p.c) ?? [];
  const w = 1040;
  const h = 190;
  let poly = "";
  if (spark.length > 1) {
    const min = Math.min(...spark);
    const max = Math.max(...spark);
    const range = max - min || 1;
    poly = spark
      .map((v, i) => `${((i / (spark.length - 1)) * w).toFixed(1)},${(8 + (1 - (v - min) / range) * (h - 16)).toFixed(1)}`)
      .join(" ");
  }

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
          padding: "56px 80px 48px",
          borderTop: "14px solid #1a1916",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
            <div style={{ fontSize: 26, color: "#8b877c", marginTop: 10, letterSpacing: "0.08em" }}>
              {symbol.replace(/^\^/, "").toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 72, fontWeight: 700 }}>{fmtNum(price, detail?.currency ?? "USD")}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color, marginTop: 6, display: "flex", alignItems: "center", gap: 12 }}>
              {pct !== null && (
                <svg width="24" height="20" viewBox="0 0 24 20">
                  <polygon points={up ? "12,0 24,20 0,20" : "0,0 24,0 12,20"} fill={color} />
                </svg>
              )}
              {pct === null ? "—" : `${fmtSigned(change)} (${Math.abs(pct).toFixed(2)}%)`}
            </div>
          </div>
        </div>
        {poly ? (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline points={poly} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div style={{ height: h, display: "flex" }} />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
          <span style={{ fontWeight: 700, letterSpacing: "0.12em" }}>SIGNAL</span>
          <span style={{ color: "#55524a" }}>Live chart &amp; key stats — global markets, one page</span>
        </div>
      </div>
    ),
    size
  );
}
