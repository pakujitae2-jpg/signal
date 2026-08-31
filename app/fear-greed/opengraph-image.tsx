import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE } from "@/components/OgCard";
import { classify, getFearGreed } from "@/lib/feargreed";
import { fmtTime } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Crypto Fear & Greed Index";

function gaugeColor(v: number): string {
  if (v <= 24) return "#c62828";
  if (v <= 44) return "#c9752f";
  if (v <= 55) return "#8b877c";
  if (v <= 74) return "#5a9c6a";
  return "#0d7d55";
}

export default async function OgImage() {
  const data = await getFearGreed();
  const v = data.now.value;
  const color = gaugeColor(v);

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline="Crypto market sentiment, 0-100">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Fear &amp; Greed Index</div>
            <div style={{ fontSize: 30, color, marginTop: 16, fontWeight: 700 }}>{classify(v)}</div>
            <div style={{ display: "flex", gap: 40, marginTop: 30, fontSize: 26, color: "#55524a" }}>
              <span>Yesterday {data.yesterday?.value ?? "—"}</span>
              <span>1wk ago {data.lastWeek?.value ?? "—"}</span>
              <span>1mo ago {data.lastMonth?.value ?? "—"}</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 260,
              height: 260,
              borderRadius: "50%",
              border: `16px solid ${color}`,
              fontSize: 100,
              fontWeight: 700,
              color,
            }}
          >
            {v}
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
