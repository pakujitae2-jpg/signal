import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, OG_DOWN, OG_UP } from "@/components/OgCard";
import { fmtTime } from "@/lib/format";
import { getMovers, type Mover } from "@/lib/movers";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Daily Movers";

function Row({ m }: { m: Mover }) {
  const up = m.changePct >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: 460, fontSize: 26 }}>
      <span style={{ fontWeight: 700 }}>{m.symbol.replace(/-USD$/, "")}</span>
      <span style={{ color: up ? OG_UP : OG_DOWN, fontWeight: 700 }}>
        {up ? "+" : "−"}{Math.abs(m.changePct).toFixed(2)}%
      </span>
    </div>
  );
}

export default async function OgImage() {
  const data = await getMovers();
  const all = [...data.equities, ...data.crypto].sort((a, b) => b.changePct - a.changePct);
  const gainers = all.slice(0, 4);
  const losers = all.slice(-4).reverse();

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline="US · Japan · Korea equities and crypto">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 30 }}>Daily Movers</div>
          <div style={{ display: "flex", gap: 60 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 22, color: "#8b877c", letterSpacing: "0.08em", textTransform: "uppercase" }}>Top Gainers</div>
              {gainers.map((m) => (
                <Row key={m.symbol} m={m} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 22, color: "#8b877c", letterSpacing: "0.08em", textTransform: "uppercase" }}>Top Losers</div>
              {losers.map((m) => (
                <Row key={m.symbol} m={m} />
              ))}
            </div>
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
