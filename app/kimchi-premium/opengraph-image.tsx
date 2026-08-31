import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, ogColor } from "@/components/OgCard";
import { fmtTime } from "@/lib/format";
import { getKimchiData } from "@/lib/kimchi";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kimchi Premium";

export default async function OgImage() {
  const data = await getKimchiData();
  const btc = data.rows.find((r) => r.symbol === "BTC");
  const avg = data.rows.length ? data.rows.reduce((s, r) => s + r.premiumPct, 0) / data.rows.length : 0;
  const pct = btc?.premiumPct ?? avg;
  const color = ogColor(pct);

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline="Korea's crypto price gap">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>Kimchi Premium</div>
          <div style={{ fontSize: 26, color: "#8b877c", marginTop: 10 }}>Upbit (KRW) vs. global markets</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 36 }}>
            <div style={{ display: "flex", fontSize: 130, fontWeight: 700, color }}>
              {pct >= 0 ? "+" : "−"}{Math.abs(pct).toFixed(2)}%
            </div>
            <div style={{ fontSize: 30, color: "#8b877c" }}>Bitcoin premium</div>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 30, fontSize: 26, color: "#55524a" }}>
            <span style={{ display: "flex" }}>USD/KRW {data.usdKrw.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
            <span style={{ display: "flex" }}>{data.rows.length} coins tracked</span>
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
